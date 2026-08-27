import { Message, GuildMember } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'

// Track message history per user per guild
const messageHistory: Map<string, number[]> = new Map()
const recentMessages: Map<string, string[]> = new Map()

// Cleanup old entries
setInterval(() => {
  const now = Date.now()
  messageHistory.forEach((timestamps, key) => {
    const filtered = timestamps.filter(t => now - t < 30000)
    if (filtered.length === 0) messageHistory.delete(key)
    else messageHistory.set(key, filtered)
  })
  recentMessages.clear()
}, 60000)

/**
 * Check a message for spam patterns.
 * Reads thresholds from the guild's config in Supabase.
 */
export async function checkAntiSpam(message: Message) {
  if (!message.guild) return
  if (!message.member) return

  const guildId = message.guild.id
  const enabled = await isModuleEnabled(guildId, 'antispam')
  if (!enabled) return

  // Get config from database
  const config = await getModuleConfig(guildId, 'antispam')
  const MSG_LIMIT = config?.message_limit ?? 5
  const WINDOW_MS = (config?.time_window_seconds ?? 3) * 1000
  const DUP_LIMIT = config?.duplicate_limit ?? 3
  const ACTION = config?.action ?? 'delete'
  const MUTE_MINS = config?.mute_duration_minutes ?? 10

  // Check exempt roles
  const exemptRoles: string[] = config?.exempt_roles ?? []
  if (exemptRoles.length > 0 && message.member.roles.cache.some(r => exemptRoles.includes(r.id))) {
    return
  }

  const key = `${guildId}:${message.author.id}`
  const now = Date.now()

  // --- Rate limit check ---
  const history = messageHistory.get(key) || []
  history.push(now)
  messageHistory.set(key, history)

  const recentCount = history.filter(t => now - t < WINDOW_MS).length

  if (recentCount >= MSG_LIMIT) {
    const actionTaken = await takeAction(message, ACTION, MUTE_MINS)

    if (recentCount === MSG_LIMIT) {
      await logSecurityEvent({
        guildId,
        eventType: 'spam',
        severity: 'medium',
        description: `Rapid message spam (${recentCount} msgs in ${WINDOW_MS / 1000}s)`,
        userId: message.author.id,
        userTag: message.author.tag,
        actionTaken,
        metadata: { messageCount: recentCount, channelId: message.channel.id, action: ACTION },
      })
    }
    return
  }

  // --- Duplicate message check ---
  const messages = recentMessages.get(key) || []
  messages.push(message.content.toLowerCase().trim())
  if (messages.length > 10) messages.shift()
  recentMessages.set(key, messages)

  const lastN = messages.slice(-DUP_LIMIT)
  if (lastN.length >= DUP_LIMIT && lastN.every(m => m === lastN[0]) && lastN[0].length > 5) {
    const actionTaken = await takeAction(message, ACTION, MUTE_MINS)

    await logSecurityEvent({
      guildId,
      eventType: 'spam',
      severity: 'low',
      description: `Duplicate spam: "${message.content.slice(0, 60)}${message.content.length > 60 ? '...' : ''}"`,
      userId: message.author.id,
      userTag: message.author.tag,
      actionTaken,
      metadata: { duplicateCount: DUP_LIMIT, content: message.content.slice(0, 200) },
    })
  }
}

async function takeAction(message: Message, action: string, muteMins: number): Promise<string> {
  try {
    if (action === 'delete') {
      await message.delete()
      return 'message_deleted'
    } else if (action === 'mute' && message.member) {
      await message.delete()
      await message.member.timeout(muteMins * 60 * 1000, 'Anti-spam: message spam detected')
      return 'muted'
    } else if (action === 'ban' && message.member?.bannable) {
      await message.delete()
      await message.member.ban({ reason: 'Anti-spam: severe spam detected' })
      return 'banned'
    }
  } catch {}
  return 'detected_no_perms'
}
