import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel, EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'
import { getSupabase } from '../lib/supabase'

export const commands = [
  new SlashCommandBuilder()
    .setName('security')
    .setDescription('View security status for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Toggle server lockdown mode')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('threats')
    .setDescription('View recent security threats')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Manage the bot whitelist')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('add').setDescription('Add a bot to the whitelist')
        .addStringOption(opt => opt.setName('bot_id').setDescription('The bot user ID to whitelist').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove').setDescription('Remove a bot from the whitelist')
        .addStringOption(opt => opt.setName('bot_id').setDescription('The bot user ID to remove').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('list').setDescription('View all whitelisted bots')
    ),
]

export async function handleCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction
  const guildId = interaction.guildId

  if (!guildId) {
    await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true })
    return
  }

  switch (commandName) {
    case 'security': {
      await handleSecurityCommand(interaction, guildId)
      break
    }

    case 'lockdown': {
      await handleLockdownCommand(interaction, guildId)
      break
    }

    case 'threats': {
      await handleThreatsCommand(interaction, guildId)
      break
    }

    case 'whitelist': {
      await handleWhitelistCommand(interaction, guildId)
      break
    }

    default:
      await interaction.reply({ content: 'Unknown command.', ephemeral: true })
  }
}

// ─── /security ───────────────────────────────────────────────────────────────

async function handleSecurityCommand(interaction: ChatInputCommandInteraction, guildId: string) {
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()

    const [modulesRes, statsRes, settingsRes] = await Promise.all([
      supabase.from('security_modules').select('module_id, enabled').eq('guild_id', guildId),
      supabase.from('security_stats').select('*').eq('guild_id', guildId).single(),
      supabase.from('server_settings').select('lockdown_active').eq('guild_id', guildId).single(),
    ])

    const modules = modulesRes.data || []
    const stats = statsRes.data
    const lockdown = settingsRes.data?.lockdown_active || false

    const moduleStatus = (id: string) => {
      const mod = modules.find(m => m.module_id === id)
      return mod?.enabled ? '✅' : '❌'
    }

    const embed = new EmbedBuilder()
      .setTitle('🛡️ Security Status')
      .setColor(BRAND.color)
      .setDescription(lockdown ? '🔒 **SERVER IS IN LOCKDOWN**' : '✅ All systems operational')
      .addFields(
        { name: 'Modules', value: [
          `${moduleStatus('antiraid')} Anti-Raid`,
          `${moduleStatus('antispam')} Anti-Spam`,
          `${moduleStatus('antinuke')} Anti-Nuke`,
          `${moduleStatus('phishing')} Link Blocker`,
          `${moduleStatus('impersonation')} Impersonation Guard`,
          `${moduleStatus('botguard')} Bot Guard`,
        ].join('\n'), inline: true },
        { name: 'Stats', value: [
          `**${stats?.threats_blocked_week ?? 0}** threats this week`,
          `**${stats?.raids_prevented_month ?? 0}** raids prevented`,
          `**${stats?.links_scanned_total ?? 0}** links scanned`,
          `**${stats?.accounts_flagged ?? 0}** accounts flagged`,
        ].join('\n'), inline: true },
      )
      .setFooter({ text: 'Wembo Security • wembo.xyz/dashboard' })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to fetch security status.' })
  }
}

// ─── /lockdown ───────────────────────────────────────────────────────────────

async function handleLockdownCommand(interaction: ChatInputCommandInteraction, guildId: string) {
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()

    const { data } = await supabase.from('server_settings').select('lockdown_active').eq('guild_id', guildId).single()
    const currentState = data?.lockdown_active || false
    const newState = !currentState

    await supabase.from('server_settings').upsert({ guild_id: guildId, lockdown_active: newState }, { onConflict: 'guild_id' })

    const embed = new EmbedBuilder()
      .setTitle(newState ? '🔒 Lockdown Activated' : '🔓 Lockdown Deactivated')
      .setColor(newState ? 0xEF4444 : 0x4ade80)
      .setDescription(newState
        ? 'Server lockdown is now **active**. New joins will be blocked.'
        : 'Server lockdown has been **deactivated**. Normal operation resumed.')
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to toggle lockdown.' })
  }
}

// ─── /threats ────────────────────────────────────────────────────────────────

async function handleThreatsCommand(interaction: ChatInputCommandInteraction, guildId: string) {
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()

    const { data: events } = await supabase
      .from('security_events')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!events || events.length === 0) {
      await interaction.editReply({ content: '🎉 No threats detected recently. Your server is secure!' })
      return
    }

    const severityIcons = { high: '🔴', medium: '🟠', low: '🟡' }

    const embed = new EmbedBuilder()
      .setTitle('🛡️ Recent Threats')
      .setColor(BRAND.color)
      .setDescription(events.map(e =>
        `${severityIcons[e.severity as keyof typeof severityIcons] || '⚪'} **${e.description}**\n  └ ${e.action_taken || 'Logged'} • <t:${Math.floor(new Date(e.created_at).getTime() / 1000)}:R>`
      ).join('\n\n'))
      .setFooter({ text: `${events.length} most recent • wembo.xyz/dashboard/security` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to fetch threats.' })
  }
}

// ─── /whitelist ──────────────────────────────────────────────────────────────

async function handleWhitelistCommand(interaction: ChatInputCommandInteraction, guildId: string) {
  const sub = interaction.options.getSubcommand()
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()

    // Get current botguard config
    const { data: mod } = await supabase
      .from('security_modules')
      .select('config')
      .eq('guild_id', guildId)
      .eq('module_id', 'botguard')
      .single()

    const config = mod?.config || { whitelisted_bots: [] }
    const whitelist: string[] = config.whitelisted_bots || []

    if (sub === 'add') {
      const botId = interaction.options.getString('bot_id', true).trim()
      if (!/^\d{17,20}$/.test(botId)) {
        await interaction.editReply({ content: '❌ Invalid ID. Provide a valid Discord user ID (17-20 digits).' })
        return
      }
      if (whitelist.includes(botId)) {
        await interaction.editReply({ content: `✅ \`${botId}\` is already whitelisted.` })
        return
      }
      whitelist.push(botId)
      await supabase.from('security_modules').upsert({
        guild_id: guildId, module_id: 'botguard', enabled: true,
        config: { ...config, whitelisted_bots: whitelist },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'guild_id,module_id' })
      await interaction.editReply({ content: `✅ <@${botId}> (\`${botId}\`) has been whitelisted.` })

    } else if (sub === 'remove') {
      const botId = interaction.options.getString('bot_id', true).trim()
      if (!whitelist.includes(botId)) {
        await interaction.editReply({ content: `❌ \`${botId}\` is not on the whitelist.` })
        return
      }
      const updated = whitelist.filter(id => id !== botId)
      await supabase.from('security_modules').upsert({
        guild_id: guildId, module_id: 'botguard', enabled: true,
        config: { ...config, whitelisted_bots: updated },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'guild_id,module_id' })
      await interaction.editReply({ content: `✅ \`${botId}\` removed from whitelist.` })

    } else if (sub === 'list') {
      if (whitelist.length === 0) {
        await interaction.editReply({ content: 'No bots are whitelisted. Use `/whitelist add` to add one.' })
        return
      }
      const embed = new EmbedBuilder()
        .setTitle('🤖 Whitelisted Bots')
        .setColor(BRAND.color)
        .setDescription(whitelist.map(id => `• <@${id}> (\`${id}\`)`).join('\n'))
        .setFooter({ text: `${whitelist.length} bot${whitelist.length !== 1 ? 's' : ''}` })
      await interaction.editReply({ embeds: [embed] })
    }
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to manage whitelist.' })
  }
}
