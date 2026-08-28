import { Client, Events } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { checkAntiRaid } from './antiraid'
import { checkAntiSpam } from './antispam'
import { checkPhishing } from './phishing'
import { checkImpersonation } from './impersonation'
import { initLockdownMonitor, isInLockdown } from './lockdown'
import { initLogger, sendSecurityLog } from './logger'
import { initAntiNuke } from './antinuke'
import { initBotGuard } from './botguard'
import { initVerification } from './verification'

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

  // Initialize security logger
  initLogger(client)

  // Initialize Anti-Nuke monitoring
  initAntiNuke(client)

  // Initialize Bot Guard monitoring
  initBotGuard(client)

  // Initialize Verification Gate
  initVerification(client)

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
    antinuke: { enabled: true, config: { max_channel_deletes: 3, max_role_deletes: 3, max_bans: 5, max_kicks: 5, time_window_seconds: 60, action: 'strip_roles', monitor_permission_changes: true, monitor_webhook_creation: true, monitor_channel_deletes: true, monitor_role_deletes: true, monitor_mass_bans: true, monitor_mass_kicks: true, whitelist_owner: true } },
    botguard: { enabled: false, config: { action: 'kick', notify_on_add: true, quarantine_unverified: true, auto_kick_unverified: false, require_verification: true, log_bot_actions: true, whitelisted_bots: [] } },
    verification: { enabled: false, config: { embed_title: 'Verify to Access the Server', embed_description: 'Click the button below to verify that you are a human and gain access to the server.', embed_color: '#FFD600', embed_image: '', embed_thumbnail: '', embed_footer: 'Wembo Verification', button_label: '✓ Verify', button_style: 'Success', verified_role_id: '', unverified_role_id: '', channel_id: '', remove_unverified_role: true, log_verifications: true, kick_unverified_after: 0 } },
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

    // Send to log channel
    const fields: { name: string; value: string; inline?: boolean }[] = []
    if (params.userTag) fields.push({ name: 'User', value: params.userTag })
    if (params.actionTaken) fields.push({ name: 'Action', value: params.actionTaken.replace(/_/g, ' ') })

    const titles: Record<string, string> = {
      raid: 'Raid Detected',
      spam: 'Spam Detected',
      phishing: 'Link Blocked',
      impersonation: 'Impersonation Detected',
      lockdown: 'Lockdown',
      suspicious_join: 'Suspicious Activity',
      nuke: 'Nuke Attempt Detected',
      unauthorized_bot: 'Unauthorized Bot',
      bot_added: 'Bot Added',
      verification: 'Member Verified',
    }

    await sendSecurityLog({
      guildId: params.guildId,
      title: titles[params.eventType] || 'Security Alert',
      description: params.description,
      severity: params.severity,
      fields: fields.length > 0 ? fields : undefined,
    })
  } catch (err) {
    console.error('Failed to log security event:', err)
  }
}
