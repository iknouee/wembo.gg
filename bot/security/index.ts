import { Client, Events } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { checkAntiRaid } from './antiraid'
import { checkAntiSpam } from './antispam'
import { checkPhishing } from './phishing'
import { checkImpersonation } from './impersonation'
import { initLockdownMonitor, isInLockdown } from './lockdown'

// Cache module settings to avoid spamming DB
const moduleCache: Map<string, { data: any; expires: number }> = new Map()
const CACHE_TTL = 10000

/**
 * Initialize all security monitoring.
 */
export function initSecurity(client: Client) {
  console.log('🛡️  Security module initialized')

  // Set up defaults for all existing guilds
  client.guilds.cache.forEach(async (guild) => {
    try { await setupGuildDefaults(guild.id) } catch {}
  })
  console.log(`📋 Checked security defaults for ${client.guilds.cache.size} guilds`)

  // Start lockdown monitor (polls DB every 10s)
  initLockdownMonitor(client)

  // ─── Member Join ─────────────────────────────────────────────────────
  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      // Block joins during lockdown
      if (isInLockdown(member.guild.id)) {
        if (member.kickable) {
          await member.kick('Server is in lockdown')
          await logSecurityEvent({
            guildId: member.guild.id,
            eventType: 'lockdown',
            severity: 'medium',
            description: `Blocked join during lockdown: ${member.user.tag}`,
            userId: member.user.id,
            userTag: member.user.tag,
            actionTaken: 'kicked',
          })
        }
        return
      }

      await checkAntiRaid(member)
      await checkImpersonation(member)
    } catch (err) {
      console.error('Member join error:', err)
    }
  })

  // ─── Member Update (nickname changes) ────────────────────────────────
  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (oldMember.nickname === newMember.nickname) return
    try {
      await checkImpersonation(newMember)
    } catch (err) {
      console.error('Member update error:', err)
    }
  })

  // ─── Messages ────────────────────────────────────────────────────────
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return
    if (!message.guild) return

    try {
      await checkAntiSpam(message)
      await checkPhishing(message)
    } catch (err) {
      console.error('Message security error:', err)
    }
  })

  // ─── Guild Join ──────────────────────────────────────────────────────
  client.on(Events.GuildCreate, async (guild) => {
    try {
      await setupGuildDefaults(guild.id)
      console.log(`📋 Set up security defaults for guild: ${guild.name}`)
    } catch (err) {
      console.error('Guild setup error:', err)
    }
  })
}

/**
 * Create default module settings for a new guild (never overwrites).
 */
async function setupGuildDefaults(guildId: string) {
  const supabase = getSupabase()

  const defaults: Record<string, { enabled: boolean; config: any }> = {
    antiraid: { enabled: true, config: { join_threshold: 10, time_window_seconds: 10, action: 'kick', min_account_age_hours: 24, notify_channel: true } },
    antispam: { enabled: true, config: { message_limit: 5, time_window_seconds: 3, duplicate_limit: 3, action: 'delete', mute_duration_minutes: 10, exempt_roles: [] } },
    phishing: { enabled: true, config: { auto_delete: true, quarantine_user: false, warn_in_channel: true, custom_blocklist: [], scan_embeds: true } },
    impersonation: { enabled: false, config: { protected_roles: [], similarity_threshold: 80, action: 'flag', check_avatars: true, check_nicknames: true } },
  }

  for (const [moduleId, settings] of Object.entries(defaults)) {
    await supabase
      .from('security_modules')
      .insert({ guild_id: guildId, module_id: moduleId, enabled: settings.enabled, config: settings.config })
      .select()
      .maybeSingle()
  }

  const { data: existing } = await supabase.from('server_settings').select('id').eq('guild_id', guildId).maybeSingle()
  if (!existing) {
    await supabase.from('server_settings').insert({ guild_id: guildId, lockdown_active: false })
  }

  const { data: existingStats } = await supabase.from('security_stats').select('id').eq('guild_id', guildId).maybeSingle()
  if (!existingStats) {
    await supabase.from('security_stats').insert({ guild_id: guildId })
  }
}

/**
 * Check if a module is enabled (cached).
 */
export async function isModuleEnabled(guildId: string, moduleId: string): Promise<boolean> {
  const config = await getModuleConfig(guildId, moduleId)
  return config !== null
}

/**
 * Get module config from DB (with 10s cache). Returns null if disabled.
 */
export async function getModuleConfig(guildId: string, moduleId: string): Promise<Record<string, any> | null> {
  const cacheKey = `${guildId}:${moduleId}`
  const cached = moduleCache.get(cacheKey)

  if (cached && cached.expires > Date.now()) {
    return cached.data
  }

  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('security_modules')
      .select('enabled, config')
      .eq('guild_id', guildId)
      .eq('module_id', moduleId)
      .single()

    if (!data || !data.enabled) {
      moduleCache.set(cacheKey, { data: null, expires: Date.now() + CACHE_TTL })
      return null
    }

    const config = data.config || {}
    moduleCache.set(cacheKey, { data: config, expires: Date.now() + CACHE_TTL })
    return config
  } catch {
    return null
  }
}

/**
 * Log a security event to the database.
 */
export async function logSecurityEvent(params: {
  guildId: string
  eventType: string
  severity: 'high' | 'medium' | 'low'
  description: string
  userId?: string
  userTag?: string
  actionTaken?: string
  metadata?: Record<string, any>
}) {
  try {
    const supabase = getSupabase()

    await supabase.from('security_events').insert({
      guild_id: params.guildId,
      event_type: params.eventType,
      severity: params.severity,
      description: params.description,
      user_id: params.userId || null,
      user_tag: params.userTag || null,
      action_taken: params.actionTaken || null,
      metadata: params.metadata || {},
    })

    await supabase.rpc('increment_threat_count', { p_guild_id: params.guildId })

    if (params.eventType === 'raid') {
      await supabase.rpc('increment_raid_count', { p_guild_id: params.guildId })
    }
  } catch (err) {
    console.error('Failed to log security event:', err)
  }
}
