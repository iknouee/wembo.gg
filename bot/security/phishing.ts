import { Message } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'
import { getSupabase } from '../lib/supabase'

const URL_REGEX = /https?:\/\/[^\s<>]+/gi

// Default whitelist — common safe domains for gifs, media, discord itself
const DEFAULT_WHITELIST = [
  'discord.com', 'discordapp.com', 'cdn.discordapp.com',
  'media.discordapp.net', 'tenor.com', 'giphy.com', 'imgur.com',
  'youtube.com', 'youtu.be', 'twitch.tv', 'twitter.com', 'x.com',
  'reddit.com', 'i.redd.it', 'spotify.com', 'open.spotify.com',
  'github.com', 'google.com', 'wikipedia.org',
]

// Discord invite patterns (discord.gg, discord.com/invite)
const INVITE_REGEX = /(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/i

/**
 * Link blocker — blocks all links except whitelisted domains.
 * Configurable actions: delete, timeout, kick, ban.
 */
export async function checkPhishing(message: Message) {
  if (!message.guild || !message.content) return
  if (!message.member) return

  const guildId = message.guild.id
  const enabled = await isModuleEnabled(guildId, 'phishing')
  if (!enabled) return

  // Skip if member has manage messages permission (staff can post links)
  if (message.member.permissions.has('ManageMessages')) return

  const config = await getModuleConfig(guildId, 'phishing')
  const ACTION = config?.action ?? 'delete'
  const TIMEOUT_MINS = config?.timeout_minutes ?? 5
  const WARN = config?.warn_in_channel ?? true
  const WHITELIST: string[] = config?.whitelisted_domains ?? []
  const BLOCK_ALL = config?.block_all_links ?? true
  const BLOCK_INVITES = config?.block_invites ?? true

  // Combine default whitelist + user whitelist
  const allWhitelisted = [...DEFAULT_WHITELIST, ...WHITELIST.map(d => d.toLowerCase().trim())]

  // --- Check for Discord invite links first ---
  if (BLOCK_INVITES && INVITE_REGEX.test(message.content)) {
    console.log(`🔗 Blocked invite from ${message.author.tag}`)
    await handleBlocked(message, guildId, 'Discord invite link', ACTION, TIMEOUT_MINS, WARN)
    return
  }

  // Extract URLs from message
  const urls = message.content.match(URL_REGEX) || []
  if (urls.length === 0) return

  // Increment links scanned counter
  try {
    const supabase = getSupabase()
    await supabase.rpc('increment_links_scanned', { p_guild_id: guildId, p_count: urls.length })
  } catch {}

  if (!BLOCK_ALL) return // Only scanning, not blocking

  // Check each URL against whitelist
  const blockedUrls: string[] = []
  for (const url of urls) {
    try {
      const hostname = new URL(url).hostname.toLowerCase()
      // Check if hostname matches any whitelisted domain
      const isWhitelisted = allWhitelisted.some(domain => {
        return hostname === domain || hostname.endsWith('.' + domain)
      })
      if (!isWhitelisted) {
        blockedUrls.push(url)
      }
    } catch {
      // Invalid URL — treat as suspicious
      blockedUrls.push(url)
    }
  }

  if (blockedUrls.length === 0) return // All links are whitelisted

  console.log(`🔗 Blocked link from ${message.author.tag}: ${blockedUrls[0]}`)
  await handleBlocked(message, guildId, blockedUrls[0].slice(0, 80), ACTION, TIMEOUT_MINS, WARN)
}

async function handleBlocked(message: Message, guildId: string, reason: string, action: string, timeoutMins: number, warn: boolean) {
  let actionTaken = 'detected'

  try {
    // Always delete the message
    await message.delete()
    actionTaken = 'message_deleted'

    // Additional action
    if (action === 'timeout' && message.member) {
      await message.member.timeout(timeoutMins * 60 * 1000, `Wembo: ${reason}`)
      actionTaken = 'timed_out'
    } else if (action === 'kick' && message.member?.kickable) {
      await message.member.kick(`Wembo: ${reason}`)
      actionTaken = 'kicked'
    } else if (action === 'ban' && message.member?.bannable) {
      await message.member.ban({ reason: `Wembo: ${reason}` })
      actionTaken = 'banned'
    }
  } catch (e: any) {
    console.error(`🔗 Action failed:`, e?.message)
    actionTaken = 'detected_no_perms'
  }

  await logSecurityEvent({
    guildId,
    eventType: 'phishing',
    severity: action === 'ban' || action === 'kick' ? 'high' : 'medium',
    description: `Blocked: ${reason}`,
    userId: message.author.id,
    userTag: message.author.tag,
    actionTaken,
    metadata: { reason, action },
  })

  if (warn && 'send' in message.channel) {
    try {
      const warning = await (message.channel as any).send({
        content: `⚠️ <@${message.author.id}> That link is not allowed here.`,
      })
      setTimeout(async () => { try { await warning.delete() } catch {} }, 5000)
    } catch {}
  }
}
