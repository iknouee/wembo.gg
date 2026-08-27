import { Message } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'
import { getSupabase } from '../lib/supabase'

const URL_REGEX = /https?:\/\/[^\s<>]+/gi

// Default whitelist — common safe domains for gifs, media, discord itself
const DEFAULT_WHITELIST = [
  'discord.com', 'discordapp.com', 'discord.gg', 'cdn.discordapp.com',
  'media.discordapp.net', 'tenor.com', 'giphy.com', 'imgur.com',
  'youtube.com', 'youtu.be', 'twitch.tv', 'twitter.com', 'x.com',
  'reddit.com', 'i.redd.it', 'spotify.com', 'open.spotify.com',
  'github.com', 'google.com', 'wikipedia.org',
]

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

  // Combine default whitelist + user whitelist
  const allWhitelisted = [...DEFAULT_WHITELIST, ...WHITELIST.map(d => d.toLowerCase().trim())]

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

  // Take action
  let actionTaken = 'detected'

  try {
    // Always delete the message with blocked links
    await message.delete()
    actionTaken = 'message_deleted'

    // Additional action based on config
    if (ACTION === 'timeout' && message.member) {
      await message.member.timeout(TIMEOUT_MINS * 60 * 1000, 'Wembo: Posted blocked link')
      actionTaken = 'timed_out'
    } else if (ACTION === 'kick' && message.member.kickable) {
      await message.member.kick('Wembo: Posted blocked link')
      actionTaken = 'kicked'
    } else if (ACTION === 'ban' && message.member.bannable) {
      await message.member.ban({ reason: 'Wembo: Posted blocked link' })
      actionTaken = 'banned'
    }
  } catch (e: any) {
    console.error(`🔗 Action failed:`, e?.message)
    actionTaken = 'detected_no_perms'
  }

  // Log event
  await logSecurityEvent({
    guildId,
    eventType: 'phishing',
    severity: ACTION === 'ban' || ACTION === 'kick' ? 'high' : 'medium',
    description: `Blocked link: ${blockedUrls[0].slice(0, 80)}`,
    userId: message.author.id,
    userTag: message.author.tag,
    actionTaken,
    metadata: { urls: blockedUrls.slice(0, 5), action: ACTION },
  })

  // Warn in channel
  if (WARN && 'send' in message.channel) {
    try {
      await message.channel.send({
        content: `⚠️ <@${message.author.id}> Links are not allowed in this server.`,
      })
      // Auto-delete warning after 5 seconds
      setTimeout(async () => {
        try {
          const msgs = await (message.channel as any).messages.fetch({ limit: 5 })
          const warning = msgs.find((m: any) => m.author.id === message.client.user?.id && m.content.includes('Links are not allowed'))
          if (warning) await warning.delete()
        } catch {}
      }, 5000)
    } catch {}
  }
}
