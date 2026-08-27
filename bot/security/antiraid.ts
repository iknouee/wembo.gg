import { GuildMember, Collection } from 'discord.js'
import { logSecurityEvent, isModuleEnabled } from './index'

// Track recent joins per guild: guildId -> array of join timestamps
const recentJoins: Map<string, number[]> = new Map()

// Raid detection thresholds
const RAID_THRESHOLD = 10       // joins within the window
const RAID_WINDOW_MS = 10000    // 10 seconds
const CLEANUP_INTERVAL = 30000  // clean old entries every 30s

// Periodic cleanup
setInterval(() => {
  const now = Date.now()
  recentJoins.forEach((timestamps, guildId) => {
    const filtered = timestamps.filter(t => now - t < RAID_WINDOW_MS * 3)
    if (filtered.length === 0) {
      recentJoins.delete(guildId)
    } else {
      recentJoins.set(guildId, filtered)
    }
  })
}, CLEANUP_INTERVAL)

/**
 * Check if a new member join is part of a raid.
 */
export async function checkAntiRaid(member: GuildMember) {
  const guildId = member.guild.id

  // Check if module is enabled
  const enabled = await isModuleEnabled(guildId, 'antiraid')
  if (!enabled) return

  const now = Date.now()
  const joins = recentJoins.get(guildId) || []
  joins.push(now)
  recentJoins.set(guildId, joins)

  // Count joins within the raid window
  const recentCount = joins.filter(t => now - t < RAID_WINDOW_MS).length

  if (recentCount >= RAID_THRESHOLD) {
    // RAID DETECTED
    console.log(`🚨 RAID DETECTED in ${member.guild.name}: ${recentCount} joins in ${RAID_WINDOW_MS / 1000}s`)

    // Try to kick the member
    let actionTaken = 'detected'
    try {
      if (member.kickable) {
        await member.kick('Anti-raid: mass join detected')
        actionTaken = 'kicked'
      }
    } catch {
      actionTaken = 'detected_no_perms'
    }

    // Log the event (only log once per burst, not for every join)
    if (recentCount === RAID_THRESHOLD) {
      await logSecurityEvent({
        guildId,
        eventType: 'raid',
        severity: 'high',
        description: `Mass join attempt detected (${recentCount} accounts in ${RAID_WINDOW_MS / 1000}s)`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken,
        metadata: { joinCount: recentCount, windowMs: RAID_WINDOW_MS },
      })
    }
  } else if (recentCount >= RAID_THRESHOLD / 2) {
    // Suspicious but not yet a raid — log as low severity
    if (recentCount === Math.floor(RAID_THRESHOLD / 2)) {
      await logSecurityEvent({
        guildId,
        eventType: 'suspicious_join',
        severity: 'low',
        description: `Elevated join rate detected (${recentCount} in ${RAID_WINDOW_MS / 1000}s)`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken: 'monitoring',
      })
    }
  }
}
