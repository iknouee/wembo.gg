import { GuildMember } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'

// Track recent joins per guild: guildId -> array of join timestamps
const recentJoins: Map<string, number[]> = new Map()

// Periodic cleanup
setInterval(() => {
  const now = Date.now()
  recentJoins.forEach((timestamps, guildId) => {
    const filtered = timestamps.filter(t => now - t < 60000)
    if (filtered.length === 0) {
      recentJoins.delete(guildId)
    } else {
      recentJoins.set(guildId, filtered)
    }
  })
}, 30000)

/**
 * Check if a new member join is part of a raid.
 * Reads thresholds from the guild's config in Supabase.
 */
export async function checkAntiRaid(member: GuildMember) {
  const guildId = member.guild.id

  const enabled = await isModuleEnabled(guildId, 'antiraid')
  if (!enabled) return

  // Get config from database
  const config = await getModuleConfig(guildId, 'antiraid')
  const THRESHOLD = config?.join_threshold ?? 10
  const WINDOW_MS = (config?.time_window_seconds ?? 10) * 1000
  const ACTION = config?.action ?? 'kick'
  const MIN_AGE_HOURS = config?.min_account_age_hours ?? 24

  const now = Date.now()
  const joins = recentJoins.get(guildId) || []
  joins.push(now)
  recentJoins.set(guildId, joins)

  // Check account age
  const accountAge = now - member.user.createdTimestamp
  const minAgeMs = MIN_AGE_HOURS * 60 * 60 * 1000
  const isNewAccount = accountAge < minAgeMs

  // Count joins within the raid window
  const recentCount = joins.filter(t => now - t < WINDOW_MS).length

  if (recentCount >= THRESHOLD) {
    console.log(`🚨 RAID DETECTED in ${member.guild.name}: ${recentCount} joins in ${WINDOW_MS / 1000}s`)

    let actionTaken = 'detected'
    try {
      if (ACTION === 'ban' && member.bannable) {
        await member.ban({ reason: 'Anti-raid: mass join detected' })
        actionTaken = 'banned'
      } else if (ACTION === 'kick' && member.kickable) {
        await member.kick('Anti-raid: mass join detected')
        actionTaken = 'kicked'
      } else if (ACTION === 'lockdown') {
        actionTaken = 'lockdown_triggered'
        // TODO: trigger actual lockdown via Supabase
      }
    } catch {
      actionTaken = 'detected_no_perms'
    }

    // Log once per burst
    if (recentCount === THRESHOLD) {
      await logSecurityEvent({
        guildId,
        eventType: 'raid',
        severity: 'high',
        description: `Mass join attempt detected (${recentCount} accounts in ${WINDOW_MS / 1000}s)`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken,
        metadata: { joinCount: recentCount, windowMs: WINDOW_MS, action: ACTION },
      })
    }
  } else if (isNewAccount && recentCount >= 3) {
    // Flag suspicious new accounts joining during elevated activity
    if (recentCount === 3) {
      await logSecurityEvent({
        guildId,
        eventType: 'suspicious_join',
        severity: 'low',
        description: `New account joined during elevated activity (account age: ${Math.floor(accountAge / 3600000)}h)`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken: 'monitoring',
      })
    }
  }
}
