import { Message } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'

// Known phishing patterns
const PHISHING_PATTERNS = [
  /discord[\s.-]*nitro[\s.-]*free/i,
  /free[\s.-]*nitro/i,
  /claim[\s.-]*your[\s.-]*nitro/i,
  /steam[\s.-]*community[\s.-]*gift/i,
  /you[\s.-]*won[\s.-]*a[\s.-]*subscription/i,
  /click[\s.-]*here[\s.-]*to[\s.-]*claim/i,
  /discord\.gift\/(?!real)/i,
  /discorcl\./i,
  /disc0rd\./i,
  /dlscord\./i,
]

// Known malicious domains
const MALICIOUS_DOMAINS = [
  'discordgift.site', 'discord-nitro.gift', 'discorcl.com', 'dlscord.com',
  'disc0rd.com', 'steamcommunlty.com', 'stearncommunitiy.com', 'free-nitro.com',
  'discord-app.net', 'discordapp.co',
]

const URL_REGEX = /https?:\/\/[^\s<]+/gi

/**
 * Check a message for phishing links and patterns.
 * Reads config from Supabase.
 */
export async function checkPhishing(message: Message) {
  if (!message.guild || !message.content) return

  const guildId = message.guild.id
  const enabled = await isModuleEnabled(guildId, 'phishing')
  if (!enabled) return

  const config = await getModuleConfig(guildId, 'phishing')
  const AUTO_DELETE = config?.auto_delete ?? true
  const QUARANTINE = config?.quarantine_user ?? false
  const WARN = config?.warn_in_channel ?? true
  const CUSTOM_BLOCKLIST: string[] = config?.custom_blocklist ?? []

  // Combine blocklists
  const allBlockedDomains = [...MALICIOUS_DOMAINS, ...CUSTOM_BLOCKLIST]

  // Extract URLs
  const urls = message.content.match(URL_REGEX) || []

  if (urls.length > 0) {
    for (const url of urls) {
      try {
        const hostname = new URL(url).hostname.toLowerCase()
        if (allBlockedDomains.some(domain => hostname.includes(domain))) {
          await handlePhishing(message, url, 'Known malicious domain', AUTO_DELETE, QUARANTINE, WARN)
          return
        }
      } catch {}
    }
  }

  // Check patterns
  for (const pattern of PHISHING_PATTERNS) {
    if (pattern.test(message.content)) {
      await handlePhishing(message, message.content.slice(0, 100), 'Phishing pattern match', AUTO_DELETE, QUARANTINE, WARN)
      return
    }
  }
}

async function handlePhishing(message: Message, matched: string, reason: string, autoDelete: boolean, quarantine: boolean, warn: boolean) {
  const guildId = message.guild!.id
  let actionTaken = 'detected'

  try {
    if (autoDelete) {
      await message.delete()
      actionTaken = 'message_deleted'
    }

    if (quarantine && message.member) {
      await message.member.timeout(60 * 60 * 1000, 'Phishing detection: quarantined')
      actionTaken = 'quarantined'
    }
  } catch {
    actionTaken = 'detected_no_perms'
  }

  await logSecurityEvent({
    guildId,
    eventType: 'phishing',
    severity: 'medium',
    description: `Phishing detected: ${reason}`,
    userId: message.author.id,
    userTag: message.author.tag,
    actionTaken,
    metadata: { content: matched.slice(0, 200), channelId: message.channel.id, reason },
  })

  if (warn && 'send' in message.channel) {
    try {
      await message.channel.send({ content: `⚠️ A potentially malicious link was removed. Stay safe!` })
    } catch {}
  }
}
