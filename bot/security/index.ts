import { Client, Events } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { checkAntiRaid } from './antiraid'
import { checkAntiSpam } from './antispam'
import { checkPhishing } from './phishing'

// Cache module settings for 30 seconds to avoid spamming DB
const moduleCache: Map<string, { data: any; expires: number }> = new Map()
const CACHE_TTL = 30000

/**
 * Initialize all security monitoring on the bot client.
 */
export function initSecurity(client: Client) {
  console.log('🛡️  Security module initialized')

  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      await checkAntiRaid(member)
    } catch (err) {
      console.error('Anti-raid error:', err)
    }
  })

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
 * Create default module settings for a new guild.
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
      .upsert({ guild_id: guildId, module_id: moduleId, enabled: settings.enabled, config: settings.config }, { onConflict: 'guild_id,module_id' })
  }

  await supabase.from('server_settings').upsert({ guild_id: guildId, lockdown_active: false }, { onConflict: 'guild_id' })
  await supabase.from('security_stats').upsert({ guild_id: guildId }, { onConflict: 'guild_id' })
}

/**
 * Check if a module is enabled for a guild (cached).
 */
export async function isModuleEnabled(guildId: string, moduleId: string): Promise<boolean> {
  const config = await getModuleConfig(guildId, moduleId)
  return config !== null
}

/**
 * Get module config from database (with 30s cache).
 * Returns null if module is disabled.
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

    // Increment stats
    await supabase.rpc('increment_threat_count', { p_guild_id: params.guildId })

    if (params.eventType === 'raid') {
      await supabase.rpc('increment_raid_count', { p_guild_id: params.guildId })
    }
  } catch (err) {
    console.error('Failed to log security event:', err)
  }
}
