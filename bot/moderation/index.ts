import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, Client } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { BRAND } from '../config'

// ─── Command Definitions ─────────────────────────────────────────────────────

export const moderationCommands = [
  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(false)),

  new SlashCommandBuilder()
    .setName('warns')
    .setDescription('View warnings for a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The user to check').setRequired(true)),

  new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Remove a specific warning by ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addStringOption(opt => opt.setName('id').setDescription('The warning ID to remove').setRequired(true)),

  new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('Remove all warnings for a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(opt => opt.setName('user').setDescription('The user to clear warnings for').setRequired(true)),
]

// ─── Command Handler ─────────────────────────────────────────────────────────

export async function handleModerationCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction
  const guildId = interaction.guildId
  if (!guildId) { await interaction.reply({ content: 'Server only.', ephemeral: true }); return }

  switch (commandName) {
    case 'warn': return handleWarn(interaction, guildId)
    case 'warns': return handleWarns(interaction, guildId)
    case 'clearwarn': return handleClearWarn(interaction, guildId)
    case 'clearwarns': return handleClearWarns(interaction, guildId)
  }
}

// ─── /warn ───────────────────────────────────────────────────────────────────

async function handleWarn(interaction: ChatInputCommandInteraction, guildId: string) {
  const user = interaction.options.getUser('user', true)
  const reason = interaction.options.getString('reason') || 'No reason provided'

  if (user.bot) {
    await interaction.reply({ content: '❌ You cannot warn a bot.', ephemeral: true })
    return
  }

  await interaction.deferReply()

  try {
    const supabase = getSupabase()

    // Create warning
    const { error: warnError } = await supabase.from('warnings').insert({
      guild_id: guildId,
      user_id: user.id,
      user_tag: user.tag,
      moderator_id: interaction.user.id,
      moderator_tag: interaction.user.tag,
      reason,
    })

    if (warnError) throw warnError

    // Create mod log entry
    const { data: lastCase } = await supabase
      .from('mod_logs')
      .select('case_number')
      .eq('guild_id', guildId)
      .order('case_number', { ascending: false })
      .limit(1)
      .single()

    const caseNumber = (lastCase?.case_number || 0) + 1

    await supabase.from('mod_logs').insert({
      guild_id: guildId,
      case_number: caseNumber,
      action: 'warn',
      user_id: user.id,
      user_tag: user.tag,
      moderator_id: interaction.user.id,
      moderator_tag: interaction.user.tag,
      reason,
    })

    // Count total warnings for this user
    const { count } = await supabase
      .from('warnings')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .eq('user_id', user.id)

    const totalWarns = count || 1

    // DM the user
    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('⚠️ You received a warning')
        .setColor(0xFB923C)
        .setDescription(`You have been warned in **${interaction.guild?.name}**`)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Total Warnings', value: `${totalWarns}` },
        )
        .setFooter({ text: 'Wembo Moderation' })
        .setTimestamp()

      await user.send({ embeds: [dmEmbed] })
    } catch {
      // User has DMs disabled
    }

    // Reply
    const embed = new EmbedBuilder()
      .setTitle('⚠️ Warning Issued')
      .setColor(BRAND.color)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Total Warnings', value: `${totalWarns}`, inline: true },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: `Warned by ${interaction.user.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to issue warning.' })
  }
}

// ─── /warns ──────────────────────────────────────────────────────────────────

async function handleWarns(interaction: ChatInputCommandInteraction, guildId: string) {
  const user = interaction.options.getUser('user', true)
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()
    const { data: warnings } = await supabase
      .from('warnings')
      .select('*')
      .eq('guild_id', guildId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!warnings || warnings.length === 0) {
      await interaction.editReply({ content: `✅ **${user.tag}** has no warnings.` })
      return
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warnings for ${user.tag}`)
      .setColor(BRAND.color)
      .setDescription(warnings.map((w, i) =>
        `**${i + 1}.** ${w.reason}\n   └ By ${w.moderator_tag} • <t:${Math.floor(new Date(w.created_at).getTime() / 1000)}:R>\n   └ ID: \`${w.id}\``
      ).join('\n\n'))
      .setFooter({ text: `${warnings.length} warning${warnings.length !== 1 ? 's' : ''} total` })

    await interaction.editReply({ embeds: [embed] })
  } catch {
    await interaction.editReply({ content: '❌ Failed to fetch warnings.' })
  }
}

// ─── /clearwarn ──────────────────────────────────────────────────────────────

async function handleClearWarn(interaction: ChatInputCommandInteraction, guildId: string) {
  const id = interaction.options.getString('id', true)
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('warnings')
      .delete()
      .eq('id', id)
      .eq('guild_id', guildId)

    if (error) throw error
    await interaction.editReply({ content: `✅ Warning \`${id}\` has been removed.` })
  } catch {
    await interaction.editReply({ content: '❌ Failed to remove warning. Check the ID is correct.' })
  }
}

// ─── /clearwarns ─────────────────────────────────────────────────────────────

async function handleClearWarns(interaction: ChatInputCommandInteraction, guildId: string) {
  const user = interaction.options.getUser('user', true)
  await interaction.deferReply({ ephemeral: true })

  try {
    const supabase = getSupabase()
    const { error, count } = await supabase
      .from('warnings')
      .delete()
      .eq('guild_id', guildId)
      .eq('user_id', user.id)

    if (error) throw error
    await interaction.editReply({ content: `✅ All warnings for **${user.tag}** have been cleared.` })
  } catch {
    await interaction.editReply({ content: '❌ Failed to clear warnings.' })
  }
}
