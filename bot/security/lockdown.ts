import { Client, Guild, PermissionFlagsBits, ChannelType } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { logSecurityEvent } from './index'

// Track lockdown state per guild to detect changes
const lockdownState: Map<string, boolean> = new Map()

/**
 * Start polling for lockdown state changes.
 * Checks every 10 seconds if the dashboard toggled lockdown.
 */
export function initLockdownMonitor(client: Client) {
  console.log('🔒 Lockdown monitor started')

  // Poll every 10 seconds
  setInterval(async () => {
    try {
      const supabase = getSupabase()
      const { data } = await supabase
        .from('server_settings')
        .select('guild_id, lockdown_active')

      if (!data) return

      for (const row of data) {
        const previousState = lockdownState.get(row.guild_id) ?? false
        const currentState = row.lockdown_active ?? false

        if (currentState !== previousState) {
          lockdownState.set(row.guild_id, currentState)

          const guild = client.guilds.cache.get(row.guild_id)
          if (!guild) continue

          if (currentState) {
            await activateLockdown(guild)
          } else {
            await deactivateLockdown(guild)
          }
        }
      }
    } catch (err) {
      console.error('Lockdown poll error:', err)
    }
  }, 10000)

  // Initialize state on startup
  client.guilds.cache.forEach(guild => {
    lockdownState.set(guild.id, false)
  })
}

/**
 * Lock down a server — deny @everyone send permissions in all text channels.
 */
async function activateLockdown(guild: Guild) {
  console.log(`🔒 LOCKDOWN ACTIVATED: ${guild.name}`)

  const everyone = guild.roles.everyone
  let lockedChannels = 0

  const channels = guild.channels.cache.filter(
    ch => ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
  )

  for (const [, channel] of channels) {
    try {
      if ('permissionOverwrites' in channel) {
        await channel.permissionOverwrites.edit(everyone, {
          SendMessages: false,
          AddReactions: false,
          Connect: false,
        }, { reason: 'Wembo Lockdown activated from dashboard' })
        lockedChannels++
      }
    } catch {
      // Skip channels we can't modify
    }
  }

  await logSecurityEvent({
    guildId: guild.id,
    eventType: 'lockdown',
    severity: 'high',
    description: `Server lockdown activated — ${lockedChannels} channels locked`,
    actionTaken: 'lockdown_activated',
    metadata: { channels_locked: lockedChannels },
  })
}

/**
 * Deactivate lockdown — restore @everyone send permissions.
 */
async function deactivateLockdown(guild: Guild) {
  console.log(`🔓 LOCKDOWN DEACTIVATED: ${guild.name}`)

  const everyone = guild.roles.everyone
  let unlockedChannels = 0

  const channels = guild.channels.cache.filter(
    ch => ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
  )

  for (const [, channel] of channels) {
    try {
      if ('permissionOverwrites' in channel) {
        await channel.permissionOverwrites.edit(everyone, {
          SendMessages: null,  // Reset to default (inherit from role)
          AddReactions: null,
          Connect: null,
        }, { reason: 'Wembo Lockdown deactivated from dashboard' })
        unlockedChannels++
      }
    } catch {
      // Skip channels we can't modify
    }
  }

  await logSecurityEvent({
    guildId: guild.id,
    eventType: 'lockdown',
    severity: 'low',
    description: `Server lockdown deactivated — ${unlockedChannels} channels unlocked`,
    actionTaken: 'lockdown_deactivated',
    metadata: { channels_unlocked: unlockedChannels },
  })
}

/**
 * Check if a guild is in lockdown (used by anti-raid to auto-kick during lockdown).
 */
export function isInLockdown(guildId: string): boolean {
  return lockdownState.get(guildId) ?? false
}
