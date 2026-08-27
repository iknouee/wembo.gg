import { Client, Events, AuditLogEvent, Guild, ChannelType } from 'discord.js'
import { getModuleConfig, logSecurityEvent } from './index'

// Track actions per user per guild
const actionTracker: Map<string, { count: number; firstAction: number }> = new Map()

/**
 * Initialize Anti-Nuke monitoring.
 * Listens for mass destructive actions via audit log polling.
 */
export function initAntiNuke(client: Client) {
  console.log('💥 Anti-Nuke module initialized')

  // Channel deletions
  client.on(Events.ChannelDelete, async (channel) => {
    if (channel.isDMBased()) return
    await checkNukeAction(client, channel.guild, 'channel_delete', 'max_channel_deletes', 'monitor_channel_deletes')
  })

  // Role deletions
  client.on(Events.GuildRoleDelete, async (role) => {
    await checkNukeAction(client, role.guild, 'role_delete', 'max_role_deletes', 'monitor_role_deletes')
  })

  // Mass bans
  client.on(Events.GuildBanAdd, async (ban) => {
    await checkNukeAction(client, ban.guild, 'ban', 'max_bans', 'monitor_mass_bans')
  })

  // Mass kicks (detected via member remove + audit log)
  client.on(Events.GuildMemberRemove, async (member) => {
    const guild = member.guild
    // Check audit log to see if this was a kick (not a leave)
    try {
      const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 })
      const kickLog = auditLogs.entries.first()
      if (kickLog && kickLog.target?.id === member.id && (Date.now() - kickLog.createdTimestamp) < 5000) {
        await checkNukeAction(client, guild, 'kick', 'max_kicks', 'monitor_mass_kicks')
      }
    } catch {}
  })

  // Role permission changes
  client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    // Check if dangerous permissions were added
    const dangerousPerms = ['Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels', 'BanMembers', 'KickMembers']
    const addedDangerous = dangerousPerms.some(perm =>
      !oldRole.permissions.has(perm as any) && newRole.permissions.has(perm as any)
    )
    if (addedDangerous) {
      await checkNukeAction(client, newRole.guild, 'permission_change', 'max_channel_deletes', 'monitor_permission_changes')
    }
  })

  // Webhook creation spam
  client.on(Events.WebhooksUpdate, async (channel) => {
    if (channel.isDMBased() || !channel.guild) return
    await checkNukeAction(client, channel.guild, 'webhook', 'max_channel_deletes', 'monitor_webhook_creation')
  })
}

async function checkNukeAction(
  client: Client,
  guild: Guild,
  actionType: string,
  thresholdKey: string,
  monitorKey: string
) {
  const config = await getModuleConfig(guild.id, 'antinuke')
  if (!config) return
  if (!config[monitorKey]) return

  const threshold = config[thresholdKey] || 3
  const timeWindow = (config.time_window_seconds || 60) * 1000

  // Get the executor from audit log
  let executorId: string | null = null
  try {
    const auditLogs = await guild.fetchAuditLogs({ limit: 1 })
    const entry = auditLogs.entries.first()
    if (entry && (Date.now() - entry.createdTimestamp) < 5000) {
      executorId = entry.executor?.id || null
    }
  } catch {}

  if (!executorId) return

  // Skip owner if whitelisted
  if (config.whitelist_owner && guild.ownerId === executorId) return

  // Skip bots (Wembo itself)
  if (executorId === client.user?.id) return

  // Track action
  const key = `${guild.id}:${executorId}:${actionType}`
  const now = Date.now()
  const tracked = actionTracker.get(key)

  if (tracked && (now - tracked.firstAction) < timeWindow) {
    tracked.count++
    actionTracker.set(key, tracked)

    if (tracked.count >= threshold) {
      // NUKE DETECTED — take action
      await handleNukeDetected(client, guild, executorId, actionType, config, tracked.count)
      actionTracker.delete(key) // Reset tracker
    }
  } else {
    actionTracker.set(key, { count: 1, firstAction: now })
  }

  // Clean old entries periodically
  if (Math.random() < 0.1) {
    actionTracker.forEach((v, k) => {
      if (now - v.firstAction > timeWindow * 2) actionTracker.delete(k)
    })
  }
}

async function handleNukeDetected(
  client: Client,
  guild: Guild,
  executorId: string,
  actionType: string,
  config: Record<string, any>,
  count: number
) {
  const action = config.action || 'strip_roles'
  let actionTaken = 'logged'

  try {
    const member = await guild.members.fetch(executorId).catch(() => null)
    if (!member) return

    switch (action) {
      case 'strip_roles':
        const roles = member.roles.cache.filter(r => r.id !== guild.id)
        if (roles.size > 0) {
          await member.roles.remove(roles, 'Anti-Nuke: Destructive actions detected')
          actionTaken = 'roles_stripped'
        }
        break
      case 'kick':
        if (member.kickable) {
          await member.kick('Anti-Nuke: Destructive actions detected')
          actionTaken = 'kicked'
        }
        break
      case 'ban':
        if (member.bannable) {
          await member.ban({ reason: 'Anti-Nuke: Destructive actions detected' })
          actionTaken = 'banned'
        }
        break
    }
  } catch (err) {
    console.error('Anti-Nuke action failed:', err)
  }

  const descriptions: Record<string, string> = {
    channel_delete: `Mass channel deletion detected (${count} channels)`,
    role_delete: `Mass role deletion detected (${count} roles)`,
    ban: `Mass banning detected (${count} bans)`,
    kick: `Mass kicking detected (${count} kicks)`,
    permission_change: `Dangerous permission escalation detected`,
    webhook: `Webhook spam detected`,
  }

  await logSecurityEvent({
    guildId: guild.id,
    eventType: 'nuke',
    severity: 'high',
    description: descriptions[actionType] || `Anti-Nuke triggered (${actionType})`,
    userId: executorId,
    actionTaken,
    metadata: { actionType, count, threshold: config[`max_${actionType}s`] },
  })
}
