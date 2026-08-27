import { GuildMember, Role } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'

/**
 * Check if a new/updated member is impersonating staff.
 * Compares nicknames against members with protected roles.
 */
export async function checkImpersonation(member: GuildMember) {
  const guildId = member.guild.id

  const enabled = await isModuleEnabled(guildId, 'impersonation')
  if (!enabled) return

  const config = await getModuleConfig(guildId, 'impersonation')
  const THRESHOLD = config?.similarity_threshold ?? 80
  const ACTION = config?.action ?? 'flag'
  const CHECK_NICKNAMES = config?.check_nicknames ?? true

  if (!CHECK_NICKNAMES) return

  // Get staff members (members with admin or mod permissions)
  const staffMembers = member.guild.members.cache.filter(m =>
    m.permissions.has('Administrator') ||
    m.permissions.has('ModerateMembers') ||
    m.permissions.has('ManageMessages')
  )

  if (staffMembers.size === 0) return

  const memberName = (member.nickname || member.user.username).toLowerCase()

  // Don't check staff against themselves
  if (member.permissions.has('Administrator') || member.permissions.has('ModerateMembers')) return

  for (const [, staff] of staffMembers) {
    const staffName = (staff.nickname || staff.user.username).toLowerCase()

    if (staffName === memberName) continue // exact same person

    const similarity = calculateSimilarity(memberName, staffName)

    if (similarity >= THRESHOLD) {
      let actionTaken = 'flagged'

      try {
        if (ACTION === 'kick' && member.kickable) {
          await member.kick('Impersonation detected by Wembo')
          actionTaken = 'kicked'
        } else if (ACTION === 'rename' && member.manageable) {
          await member.setNickname('Renamed by Wembo', 'Impersonation detected')
          actionTaken = 'renamed'
        }
      } catch {
        actionTaken = 'flagged'
      }

      await logSecurityEvent({
        guildId,
        eventType: 'impersonation',
        severity: 'high',
        description: `Possible impersonation of "${staff.nickname || staff.user.username}" by ${member.user.tag} (${similarity}% similar)`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken,
        metadata: { staffName: staff.user.tag, similarity, action: ACTION },
      })

      // Increment flagged accounts
      try {
        const { getSupabase } = await import('../lib/supabase')
        const supabase = getSupabase()
        await supabase.rpc('increment_flagged_accounts', { p_guild_id: guildId })
      } catch {}

      break // Only flag once per member
    }
  }
}

/**
 * Calculate string similarity using Levenshtein distance (0-100%).
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 100
  if (a.length === 0 || b.length === 0) return 0

  const matrix: number[][] = []

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  const maxLen = Math.max(a.length, b.length)
  const distance = matrix[a.length][b.length]
  return Math.round((1 - distance / maxLen) * 100)
}
