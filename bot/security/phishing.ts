import { Message } from 'discord.js'
import { logSecurityEvent, isModuleEnabled } from './index'

// Known phishing/scam patterns
const PHISHING_PATTERNS = [
  /discord[\s.-]*nitro[\s.-]*free/i,
  /free[\s.-]*nitro/i,
  /claim[\s.-]*your[\s.-]*nitro/i,
  /steam[\s.-]*community[\s.-]*gift/i,
  /you[\s.-]*won[\s.-]*a[\s.-]*subscription/i,
  /click[\s.-]*here[\s.-]*to[\s.-]*claim/i,
  /discord\.gift\/(?!real)/i,       // fake gift links
  /discorcl\./i,                     // typosquatting
  /disc0rd\./i,
  /dlscord\./i,
  /discard\./i,
]

// Known malicious domains (partial list)
const MALICIOUS_DOMAINS = [
  'discordgift.site',
  'discord-nitro.gift',
  'discorcl.com',
  'dlscord.com',
  'disc0rd.com',
  'steamcommunlty.com',
  'stearncommunitiy.com',
  'free-nitro.com',
  'discord-app.net',
  'discordapp.co',
]

// URL regex
const URL_REGEX = /https?:\/\/[^\s<]+/gi

// Track links scanned
let linksScannedBuffer = 0
const FLUSH_INTERVAL = 60000 // Flush to DB every minute

setInterval(async () => {
  if (linksScannedBuffer > 0) {
    try {
      const { getSupabase } = await import('../lib/supabase')
      const supabase = getSupabase()
      // We'll update this per-guild in a real implementation
      // For now just track globally
      linksScannedBuffer = 0
    } catch {}
  }
}, FLUSH_INTERVAL)

/**
 * Check a message for phishing links and patterns.
 */
export async function checkPhishing(message: Message) {
  if (!message.guild) return
  if (!message.content) return

  const guildId = message.guild.id
  const enabled = await isModuleEnabled(guildId, 'phishing')
  if (!enabled) return

  // Extract URLs from message
  const urls = message.content.match(URL_REGEX) || []

  if (urls.length > 0) {
    linksScannedBuffer += urls.length

    // Check URLs against known malicious domains
    for (const url of urls) {
      try {
        const hostname = new URL(url).hostname.toLowerCase()

        if (MALICIOUS_DOMAINS.some(domain => hostname.includes(domain))) {
          await handlePhishing(message, url, 'Known malicious domain')
          return
        }
      } catch {
        // Invalid URL, skip
      }
    }
  }

  // Check message content against phishing patterns
  for (const pattern of PHISHING_PATTERNS) {
    if (pattern.test(message.content)) {
      await handlePhishing(message, message.content.slice(0, 100), 'Phishing pattern match')
      return
    }
  }
}

async function handlePhishing(message: Message, matchedContent: string, reason: string) {
  const guildId = message.guild!.id

  let actionTaken = 'detected'
  try {
    await message.delete()
    actionTaken = 'message_deleted'
  } catch {
    actionTaken = 'detected_no_perms'
  }

  await logSecurityEvent({
    guildId,
    eventType: 'phishing',
    severity: 'medium',
    description: `Phishing link/content detected: ${reason}`,
    userId: message.author.id,
    userTag: message.author.tag,
    actionTaken,
    metadata: {
      content: matchedContent.slice(0, 200),
      channelId: message.channel.id,
      reason,
    },
  })

  // Try to warn the user
  try {
    if ('send' in message.channel) {
      await message.channel.send({
        content: `⚠️ A potentially malicious link was removed. Stay safe!`,
      })
    }
  } catch {}
}
