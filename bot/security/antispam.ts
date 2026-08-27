import { Message } from 'discord.js'
import { logSecurityEvent, isModuleEnabled } from './index'

// Track message history per user per guild: `guildId:userId` -> timestamps
const messageHistory: Map<string, number[]> = new Map()

// Spam detection thresholds
const SPAM_MESSAGE_LIMIT = 5     // messages within the window
const SPAM_WINDOW_MS = 3000      // 3 seconds
const DUPLICATE_LIMIT = 3        // same message repeated
const CLEANUP_INTERVAL = 60000

// Track duplicate messages: `guildId:userId` -> last messages
const recentMessages: Map<string, string[]> = new Map()

// Cleanup old entries
setInterval(() => {
  const now = Date.now()
  messageHistory.forEach((timestamps, key) => {
    const filtered = timestamps.filter(t => now - t < SPAM_WINDOW_MS * 5)
    if (filtered.length === 0) messageHistory.delete(key)
    else messageHistory.set(key, filtered)
  })
  recentMessages.clear()
}, CLEANUP_INTERVAL)

/**
 * Check a message for spam patterns.
 */
export async function checkAntiSpam(message: Message) {
  if (!message.guild) return

  const guildId = message.guild.id
  const enabled = await isModuleEnabled(guildId, 'antispam')
  if (!enabled) return

  const key = `${guildId}:${message.author.id}`
  const now = Date.now()

  // --- Rate limit check ---
  const history = messageHistory.get(key) || []
  history.push(now)
  messageHistory.set(key, history)

  const recentCount = history.filter(t => now - t < SPAM_WINDOW_MS).length

  if (recentCount >= SPAM_MESSAGE_LIMIT) {
    // Spam detected — rate limit exceeded
    let actionTaken = 'detected'
    try {
      await message.delete()
      actionTaken = 'message_deleted'
    } catch {
      actionTaken = 'detected_no_perms'
    }

    // Only log once per burst
    if (recentCount === SPAM_MESSAGE_LIMIT) {
      await logSecurityEvent({
        guildId,
        eventType: 'spam',
        severity: 'medium',
        description: `Rapid message spam detected (${recentCount} messages in ${SPAM_WINDOW_MS / 1000}s)`,
        userId: message.author.id,
        userTag: message.author.tag,
        actionTaken,
        metadata: { messageCount: recentCount, channelId: message.channel.id },
      })
    }
    return
  }

  // --- Duplicate message check ---
  const messages = recentMessages.get(key) || []
  messages.push(message.content.toLowerCase().trim())
  if (messages.length > 10) messages.shift()
  recentMessages.set(key, messages)

  const lastN = messages.slice(-DUPLICATE_LIMIT)
  if (lastN.length >= DUPLICATE_LIMIT && lastN.every(m => m === lastN[0]) && lastN[0].length > 5) {
    let actionTaken = 'detected'
    try {
      await message.delete()
      actionTaken = 'message_deleted'
    } catch {
      actionTaken = 'detected_no_perms'
    }

    await logSecurityEvent({
      guildId,
      eventType: 'spam',
      severity: 'low',
      description: `Duplicate message spam: "${message.content.slice(0, 50)}${message.content.length > 50 ? '...' : ''}"`,
      userId: message.author.id,
      userTag: message.author.tag,
      actionTaken,
      metadata: { duplicateCount: DUPLICATE_LIMIT, content: message.content.slice(0, 200) },
    })
  }
}
