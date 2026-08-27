import { GuildMember } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'

/**
 * Check if a member is impersonating a protected name.
 * Uses both the custom protected_names list AND auto-detected staff names.
 */
export async function checkImpersonation(member: GuildMember) {
  const guildId = member.guild.id

  const enabled = await isModuleEnabled(guildId, 'impersonation')
  if (!enabled) return

  const config = await getModuleConfig(guildId, 'impersonation')
  const THRESHOLD = config?.similarity_threshold ?? 80
  const ACTION = config?.action ?? 'flag'
  const CHECK_NICKNAMES = config?.check_nicknames ?? true
  const AUTO_PROTECT_STAFF = config?.auto_protect_staff ?? true
  const PROTECTED_NAMES: string[] = config?.protected_names ?? []
  const MIN_ACCOUNT_AGE_DAYS = config?.min_account_age_days ?? 7

  if (!CHECK_NICKNAMES) return

  // Skip if member has mod permissions (they're staff themselves)
  if (member.permissions.has('Administrator') || member.permissions.has('ModerateMembers')) return

  // Skip if account is old enough (not suspicious)
  const accountAgeDays = (Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24)
  if (MIN_ACCOUNT_AGE_DAYS > 0 && accountAgeDays > MIN_ACCOUNT_AGE_DAYS) return

  const memberName = (member.nickname || member.user.displayName || member.user.username).toLowerCase()

  // Build list of protected names
  const namesToProtect: string[] = [...PROTECTED_NAMES.map(n => n.toLowerCase())]

  // Add staff names if auto-protect is enabled
  if (AUTO_PROTECT_STAFF) {
    const staffMembers = member.guild.members.cache.filter(m =>
      m.id !== member.id &&
      (m.permissions.has('Administrator') || m.permissions.has('ModerateMembers') || m.permissions.has('ManageMessages'))
    )
    staffMembers.forEach(staff => {
      const staffName = (staff.nickname || staff.user.displayName || staff.user.username).toLowerCase()
      if (!namesToProtect.includes(staffName)) {
        namesToProtect.push(staffName)
      }
    })
  }

  if (namesToProtect.length === 0) return

  // Check against all protected names
  for (const protectedName of namesToProtect) {
    if (protectedName === memberName) continue // exact match = same name, not impersonation

    const similarity = calculateSimilarity(memberName, protectedName)

    if (similarity >= THRESHOLD) {
      console.log(`⚠️ Impersonation detected: "${memberName}" ≈ "${protectedName}" (${similarity}%)`)

      let actionTaken = 'flagged'

      try {
        if (ACTION === 'ban' && member.bannable) {
          await member.ban({ reason: `Wembo: Impersonating "${protectedName}" (${similarity}% match)` })
          actionTaken = 'banned'
        } else if (ACTION === 'kick' && member.kickable) {
          await member.kick(`Wembo: Impersonating "${protectedName}" (${similarity}% match)`)
          actionTaken = 'kicked'
        } else if (ACTION === 'rename' && member.manageable) {
          await member.setNickname(`Renamed_${member.user.id.slice(-4)}`, 'Wembo: Impersonation detected')
          actionTaken = 'renamed'
        }
      } catch (e: any) {
        console.error(`Impersonation action failed:`, e?.message)
        actionTaken = 'flagged'
      }

      await logSecurityEvent({
        guildId,
        eventType: 'impersonation',
        severity: 'high',
        description: `"${member.nickname || member.user.username}" impersonating "${protectedName}" (${similarity}% match)`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken,
        metadata: { protectedName, similarity, memberName, action: ACTION },
      })

      // Increment flagged accounts
      try {
        const { getSupabase } = await import('../lib/supabase')
        const supabase = getSupabase()
        await supabase.rpc('increment_flagged_accounts', { p_guild_id: guildId })
      } catch {}

      break
    }
  }
}

/**
 * Levenshtein distance similarity (0-100%).
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 100
  if (a.length === 0 || b.length === 0) return 0

  // Also check if one contains the other (common impersonation technique)
  if (a.includes(b) || b.includes(a)) {
    const containScore = Math.round((Math.min(a.length, b.length) / Math.max(a.length, b.length)) * 100)
    if (containScore >= 70) return Math.max(containScore, 85)
  }

  // Check for common substitutions (0→o, 1→l, etc)
  const normalized_a = a.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's')
  const normalized_b = b.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's')
  if (normalized_a === normalized_b) return 95

  const matrix: number[][] = []
  for (let i = 0; i <= a.length; i++) matrix[i] = [i]
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
    }
  }

  const maxLen = Math.max(a.length, b.length)
  return Math.round((1 - matrix[a.length][b.length] / maxLen) * 100)
}
