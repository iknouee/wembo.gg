import { GuildMember } from 'discord.js'
import { logSecurityEvent, isModuleEnabled, getModuleConfig } from './index'

/**
 * Check if a member is impersonating a protected name.
 */
export async function checkImpersonation(member: GuildMember) {
  const guildId = member.guild.id

  const enabled = await isModuleEnabled(guildId, 'impersonation')
  if (!enabled) {
    console.log(`👤 Impersonation: disabled for ${guildId}`)
    return
  }

  const config = await getModuleConfig(guildId, 'impersonation')
  const THRESHOLD = config?.similarity_threshold ?? 80
  const ACTION = config?.action ?? 'flag'
  const CHECK_NICKNAMES = config?.check_nicknames ?? true
  const AUTO_PROTECT_STAFF = config?.auto_protect_staff ?? true
  const PROTECTED_NAMES: string[] = config?.protected_names ?? []

  if (!CHECK_NICKNAMES) return

  // Skip if member is staff themselves
  if (member.permissions.has('Administrator') || member.permissions.has('ModerateMembers')) {
    console.log(`👤 Impersonation: skipping ${member.user.tag} (is staff)`)
    return
  }

  const memberName = (member.nickname || member.user.displayName || member.user.username).toLowerCase()
  console.log(`👤 Impersonation check: "${memberName}" against protected names`)

  // Build list of protected names
  const namesToProtect: string[] = [...PROTECTED_NAMES.map(n => n.toLowerCase())]

  // Add staff names if auto-protect is enabled
  if (AUTO_PROTECT_STAFF) {
    // Fetch members if cache is empty
    if (member.guild.members.cache.size < 5) {
      try {
        await member.guild.members.fetch()
      } catch {}
    }

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

  console.log(`👤 Protected names: [${namesToProtect.join(', ')}]`)

  if (namesToProtect.length === 0) return

  // Check against all protected names
  for (let i = 0; i < namesToProtect.length; i++) {
    const protectedName = namesToProtect[i]

    // Skip exact match with self
    if (protectedName === memberName) {
      // This IS an exact match — definitely impersonation if they're not staff
      console.log(`👤 EXACT MATCH: "${memberName}" === "${protectedName}"`)
      await handleDetection(member, guildId, protectedName, 100, ACTION)
      return
    }

    const similarity = calculateSimilarity(memberName, protectedName)

    if (similarity >= THRESHOLD) {
      console.log(`👤 MATCH: "${memberName}" ~ "${protectedName}" (${similarity}%)`)
      await handleDetection(member, guildId, protectedName, similarity, ACTION)
      return
    }
  }

  console.log(`👤 No impersonation detected for "${memberName}"`)
}

async function handleDetection(member: GuildMember, guildId: string, protectedName: string, similarity: number, action: string) {
  let actionTaken = 'flagged'

  try {
    if (action === 'ban' && member.bannable) {
      await member.ban({ reason: `Wembo: Impersonating "${protectedName}" (${similarity}% match)` })
      actionTaken = 'banned'
    } else if (action === 'kick' && member.kickable) {
      await member.kick(`Wembo: Impersonating "${protectedName}" (${similarity}% match)`)
      actionTaken = 'kicked'
    } else if (action === 'rename' && member.manageable) {
      await member.setNickname(`Renamed_${member.user.id.slice(-4)}`, 'Wembo: Impersonation detected')
      actionTaken = 'renamed'
    }
  } catch (e: any) {
    console.error(`👤 Action failed:`, e?.message)
    actionTaken = 'flagged'
  }

  console.log(`👤 Action taken: ${actionTaken}`)

  await logSecurityEvent({
    guildId,
    eventType: 'impersonation',
    severity: 'high',
    description: `"${member.nickname || member.user.username}" impersonating "${protectedName}" (${similarity}% match)`,
    userId: member.user.id,
    userTag: member.user.tag,
    actionTaken,
    metadata: { protectedName, similarity, action },
  })

  try {
    const { getSupabase } = await import('../lib/supabase')
    const supabase = getSupabase()
    await supabase.rpc('increment_flagged_accounts', { p_guild_id: guildId })
  } catch {}
}

/**
 * Levenshtein + l33tspeak + substring similarity (0-100%).
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 100
  if (a.length === 0 || b.length === 0) return 0

  // Substring check — "admin_panto" contains "panto"
  if (a.includes(b) || b.includes(a)) {
    const ratio = Math.min(a.length, b.length) / Math.max(a.length, b.length)
    if (ratio >= 0.6) return Math.max(Math.round(ratio * 100), 85)
  }

  // L33tspeak normalization
  const normalize = (s: string) => s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
  if (normalize(a) === normalize(b)) return 95

  // Levenshtein distance
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
