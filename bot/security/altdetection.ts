import { Client, Events, GuildMember } from 'discord.js'
import { getModuleConfig, logSecurityEvent } from './index'

// Track recent joins for velocity detection
const recentJoins: Map<string, number[]> = new Map()

/**
 * Initialize Alt Detection monitoring.
 * Checks account age and indicators on every member join.
 */
export function initAltDetection(client: Client) {
  console.log('🔍 Alt Detection module initialized')

  client.on(Events.GuildMemberAdd, async (member) => {
    if (member.user.bot) return

    const config = await getModuleConfig(member.guild.id, 'altdetection')
    if (!config) return

    const accountAge = Date.now() - member.user.createdTimestamp
    const accountAgeDays = accountAge / (1000 * 60 * 60 * 24)

    console.log(`[AltDetect] ${member.user.tag} joined (account age: ${Math.floor(accountAgeDays)} days)`)

    // ─── Check Bypass Rules ──────────────────────────────────────────
    // Note: We can only check avatar/banner/username from client side.
    // Verified email / phone / nitro flags require privileged access.
    // For now we check what's available via the member object.

    if (config.bypass_nitro && member.premiumSince) {
      console.log(`[AltDetect] Bypassed — Nitro subscriber`)
      return
    }

    // ─── Join Velocity Check ─────────────────────────────────────────
    if (config.check_join_velocity) {
      const key = member.guild.id
      const now = Date.now()
      const window = (config.join_velocity_window || 60) * 1000
      const threshold = config.join_velocity_threshold || 3

      const joins = recentJoins.get(key) || []
      const recentCount = joins.filter(t => now - t < window)
      recentCount.push(now)
      recentJoins.set(key, recentCount.slice(-50)) // keep last 50

      // Only count new accounts in velocity
      if (accountAgeDays < (config.suspicious_age_days || 30)) {
        const newAccountJoins = recentCount.length
        if (newAccountJoins >= threshold) {
          await logSecurityEvent({
            guildId: member.guild.id,
            eventType: 'alt_velocity',
            severity: 'high',
            description: `Join velocity alert: ${newAccountJoins} new accounts joined within ${config.join_velocity_window}s`,
            userId: member.user.id,
            userTag: member.user.tag,
            actionTaken: 'alerted',
          })
        }
      }
    }

    // ─── Account Age Check ───────────────────────────────────────────
    const minAge = config.min_account_age_days || 7
    const suspiciousAge = config.suspicious_age_days || 30

    let severity: 'new' | 'suspicious' | null = null
    if (accountAgeDays < minAge) {
      severity = 'new'
    } else if (accountAgeDays < suspiciousAge) {
      severity = 'suspicious'
    }

    if (!severity) return // Account is old enough

    // ─── Detection Signals (increase confidence) ─────────────────────
    const signals: string[] = []
    if (config.check_no_avatar && !member.user.avatar) signals.push('no avatar')
    if (config.check_default_username && /^[a-z]+\d{3,}$/i.test(member.user.username)) signals.push('default username')

    // ─── Determine Action ────────────────────────────────────────────
    const action = severity === 'new' ? config.action_new_account : config.action_suspicious
    let actionTaken = 'flagged'

    console.log(`[AltDetect] ${member.user.tag} — severity: ${severity}, action: ${action}, signals: [${signals.join(', ')}]`)

    try {
      // DM before kick/ban
      if ((action === 'kick' || action === 'ban') && config.dm_on_kick && config.dm_message) {
        try {
          await member.user.send(config.dm_message)
        } catch {
          console.log(`[AltDetect] Could not DM ${member.user.tag}`)
        }
      }

      switch (action) {
        case 'quarantine':
          if (config.quarantine_role_id) {
            const role = member.guild.roles.cache.get(config.quarantine_role_id)
            if (role) {
              await member.roles.add(role, 'Alt Detection: Account quarantined')
              actionTaken = 'quarantined'
              console.log(`[AltDetect] ✅ Quarantined ${member.user.tag}`)
            }
          }
          break

        case 'kick':
          if (member.kickable) {
            await member.kick('Alt Detection: Account too new')
            actionTaken = 'kicked'
            console.log(`[AltDetect] ✅ Kicked ${member.user.tag}`)
          } else {
            console.log(`[AltDetect] ❌ Cannot kick ${member.user.tag}`)
          }
          break

        case 'ban':
          if (member.bannable) {
            await member.ban({ reason: 'Alt Detection: Account too new', deleteMessageSeconds: 0 })
            actionTaken = 'banned'
            console.log(`[AltDetect] ✅ Banned ${member.user.tag}`)
          } else {
            console.log(`[AltDetect] ❌ Cannot ban ${member.user.tag}`)
          }
          break

        case 'notify':
          actionTaken = 'notified'
          break

        case 'flag':
        default:
          actionTaken = 'flagged'
          break
      }
    } catch (err) {
      console.error('[AltDetect] Action failed:', err)
    }

    // ─── Log Event ───────────────────────────────────────────────────
    const shouldLog = (severity === 'new' && config.notify_on_action) ||
                      (severity === 'suspicious' && config.notify_on_flag)

    if (shouldLog) {
      await logSecurityEvent({
        guildId: member.guild.id,
        eventType: 'alt_detected',
        severity: severity === 'new' ? 'high' : 'medium',
        description: `${severity === 'new' ? 'New' : 'Suspicious'} account: ${member.user.tag} (${Math.floor(accountAgeDays)} days old)${signals.length > 0 ? ` — ${signals.join(', ')}` : ''}`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken,
        metadata: {
          account_age_days: Math.floor(accountAgeDays),
          signals,
          severity,
        },
      })
    }
  })
}
