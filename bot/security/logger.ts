import { Client, EmbedBuilder, TextChannel, ChannelType } from 'discord.js'
import { getSupabase } from '../lib/supabase'

let botClient: Client | null = null

// Cache log channel IDs per guild (refresh every 30s)
const logChannelCache: Map<string, { channelId: string | null; expires: number }> = new Map()

/**
 * Initialize the logger with the bot client reference.
 */
export function initLogger(client: Client) {
  botClient = client
  console.log('📝 Security logger initialized')
}

/**
 * Send a security log embed to the configured log channel.
 */
export async function sendSecurityLog(params: {
  guildId: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  fields?: { name: string; value: string; inline?: boolean }[]
}) {
  if (!botClient) return

  const channelId = await getLogChannel(params.guildId)
  if (!channelId) return

  try {
    const guild = botClient.guilds.cache.get(params.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(channelId)
    if (!channel || channel.type !== ChannelType.GuildText) return

    const colors = {
      high: 0xEF4444,    // red
      medium: 0xF59E0B,  // orange
      low: 0xFFD600,     // yellow
    }

    const icons = {
      high: '🚨',
      medium: '⚠️',
      low: '📋',
    }

    const embed = new EmbedBuilder()
      .setTitle(`${icons[params.severity]} ${params.title}`)
      .setDescription(params.description)
      .setColor(colors[params.severity])
      .setTimestamp()
      .setFooter({ text: 'Wembo Security' })

    if (params.fields) {
      params.fields.forEach(f => {
        embed.addFields({ name: f.name, value: f.value, inline: f.inline ?? true })
      })
    }

    await (channel as TextChannel).send({ embeds: [embed] })
  } catch (err) {
    console.error('Failed to send security log:', err)
  }
}

/**
 * Get the log channel ID for a guild (cached 30s).
 */
async function getLogChannel(guildId: string): Promise<string | null> {
  const cached = logChannelCache.get(guildId)
  if (cached && cached.expires > Date.now()) {
    return cached.channelId
  }

  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('server_settings')
      .select('log_channel_id')
      .eq('guild_id', guildId)
      .single()

    const channelId = data?.log_channel_id || null
    logChannelCache.set(guildId, { channelId, expires: Date.now() + 30000 })
    return channelId
  } catch {
    return null
  }
}
