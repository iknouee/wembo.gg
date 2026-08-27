import { Client, Events, GuildMember, Message, Collection } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { checkAntiRaid } from './antiraid'
import { checkAntiSpam } from './antispam'
import { checkPhishing } from './phishing'

/**
 * Initialize all security monitoring on the bot client.
 */
export function initSecurity(client: Client) {
  console.log('🛡️  Security module initialized')

  // Monitor member joins for raid detection
  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      await checkAntiRaid(member)
    } catch (err) {
      console.error('Anti-raid error:', err)
    }
  })

  // Monitor messages for spam and phishing
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

  // When bot joins a new guild, set up default security config
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
 * Create default module settings and stats for a new guild.
 */
async function setupGuildDefaults(guildId: string) {
  const supabase = getSupabase()

  // Default modules
  const modules = ['antiraid', 'antispam', 'phishing', 'impersonation']
  for (const moduleId of modules) {
    await supabase
      .from('security_modules')
      .upsert({
        guild_id: guildId,
        module_id: moduleId,
        enabled: moduleId !== 'impersonation', // impersonation off by default
        config: {},
      }, { onConflict: 'guild_id,module_id' })
  }

  // Default server settings
  await supabase
    .from('server_settings')
    .upsert({
      guild_id: guildId,
      lockdown_active: false,
    }, { onConflict: 'guild_id' })

  // Default stats
  await supabase
    .from('security_stats')
    .upsert({
      guild_id: guildId,
      threats_blocked_week: 0,
      threats_blocked_month: 0,
      raids_prevented_month: 0,
      links_scanned_total: 0,
      accounts_flagged: 0,
    }, { onConflict: 'guild_id' })
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
}

/**
 * Check if a specific module is enabled for a guild.
 */
export async function isModuleEnabled(guildId: string, moduleId: string): Promise<boolean> {
  const supabase = getSupabase()

  const { data } = await supabase
    .from('security_modules')
    .select('enabled')
    .eq('guild_id', guildId)
    .eq('module_id', moduleId)
    .single()

  return data?.enabled ?? false
}
