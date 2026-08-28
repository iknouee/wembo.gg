import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, Client, TextChannel, ChannelType } from 'discord.js'
import { getSupabase } from '../lib/supabase'
import { BRAND } from '../config'

// ─── Mod Log Channel Sender ──────────────────────────────────────────────────

let botClient: Client | null = null

export function initModeration(client: Client) {
  botClient = client
  console.log('⚖️  Moderation module initialized')
}

async function sendModLogEmbed(guildId: string, embed: EmbedBuilder) {
  if (!botClient) return

  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('server_settings')
      .select('mod_log_channel_id')
      .eq('guild_id', guildId)
      .single()

    const channelId = data?.mod_log_channel_id
    if (!channelId) return

    const guild = botClient.guilds.cache.get(guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(channelId)
    if (!channel || channel.type !== ChannelType.GuildText) return

    await (channel as TextChannel).send({ embeds: [embed] })
  } catch (err) {
    console.error('[ModLog] Failed to send log embed:', err)
  }
}

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

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The user to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick').setRequired(false)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g. 1h, 6h, 1d, 7d). Leave empty for permanent.').setRequired(false))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban').setRequired(false)),

  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a user (Discord timeout)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The user to mute').setRequired(true))
    .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g. 5m, 1h, 1d). Default: 1h').setRequired(false))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the mute').setRequired(false)),

  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt => opt.setName('user_id').setDescription('The user ID to unban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the unban').setRequired(false)),
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
    case 'kick': return handleKick(interaction, guildId)
    case 'ban': return handleBan(interaction, guildId)
    case 'mute': return handleMute(interaction, guildId)
    case 'unban': return handleUnban(interaction, guildId)
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

    // Send to mod log channel
    const logEmbed = new EmbedBuilder()
      .setTitle('⚠️ Warning Issued')
      .setColor(0xFB923C)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Total Warnings', value: `${totalWarns}`, inline: true },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: 'Wembo Moderation' })
      .setTimestamp()

    await sendModLogEmbed(guildId, logEmbed)
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


// ─── Duration Parser ─────────────────────────────────────────────────────────

function parseDuration(input: string): { ms: number; label: string } | null {
  const match = input.match(/^(\d+)\s*(m|min|h|hr|d|day|w|week)s?$/i)
  if (!match) return null
  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()
  const multipliers: Record<string, number> = { m: 60000, min: 60000, h: 3600000, hr: 3600000, d: 86400000, day: 86400000, w: 604800000, week: 604800000 }
  const labels: Record<string, string> = { m: 'minute', min: 'minute', h: 'hour', hr: 'hour', d: 'day', day: 'day', w: 'week', week: 'week' }
  const ms = num * (multipliers[unit] || 3600000)
  const label = `${num} ${labels[unit] || 'hour'}${num !== 1 ? 's' : ''}`
  return { ms, label }
}

// ─── Create Mod Log Entry Helper ─────────────────────────────────────────────

async function createModLog(guildId: string, action: string, userId: string, userTag: string, moderatorId: string, moderatorTag: string, reason: string, duration?: string) {
  const supabase = getSupabase()
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
    action,
    user_id: userId,
    user_tag: userTag,
    moderator_id: moderatorId,
    moderator_tag: moderatorTag,
    reason,
    duration: duration || null,
  })

  return caseNumber
}

// ─── /kick ───────────────────────────────────────────────────────────────────

async function handleKick(interaction: ChatInputCommandInteraction, guildId: string) {
  const user = interaction.options.getUser('user', true)
  const reason = interaction.options.getString('reason') || 'No reason provided'

  await interaction.deferReply()

  try {
    const member = await interaction.guild!.members.fetch(user.id)

    if (!member.kickable) {
      await interaction.editReply({ content: '❌ I cannot kick this user. They may have a higher role.' })
      return
    }

    // DM user before kick
    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('👢 You have been kicked')
        .setColor(0xFB923C)
        .setDescription(`You have been kicked from **${interaction.guild!.name}**`)
        .addFields({ name: 'Reason', value: reason })
        .setFooter({ text: 'Wembo Moderation' })
        .setTimestamp()
      await user.send({ embeds: [dmEmbed] })
    } catch {}

    await member.kick(reason)

    const caseNumber = await createModLog(guildId, 'kick', user.id, user.tag, interaction.user.id, interaction.user.tag, reason)

    const embed = new EmbedBuilder()
      .setTitle('👢 User Kicked')
      .setColor(BRAND.color)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: `Kicked by ${interaction.user.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to channel
    const logEmbed = new EmbedBuilder()
      .setTitle('👢 User Kicked')
      .setColor(0xFB923C)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: 'Wembo Moderation' })
      .setTimestamp()

    await sendModLogEmbed(guildId, logEmbed)
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to kick user.' })
  }
}

// ─── /ban ────────────────────────────────────────────────────────────────────

async function handleBan(interaction: ChatInputCommandInteraction, guildId: string) {
  const user = interaction.options.getUser('user', true)
  const reason = interaction.options.getString('reason') || 'No reason provided'
  const durationStr = interaction.options.getString('duration')

  await interaction.deferReply()

  try {
    const member = await interaction.guild!.members.fetch(user.id).catch(() => null)

    if (member && !member.bannable) {
      await interaction.editReply({ content: '❌ I cannot ban this user. They may have a higher role.' })
      return
    }

    // Parse duration for temp bans
    let duration: { ms: number; label: string } | null = null
    if (durationStr) {
      duration = parseDuration(durationStr)
      if (!duration) {
        await interaction.editReply({ content: '❌ Invalid duration format. Use: 1h, 6h, 1d, 7d, etc.' })
        return
      }
    }

    // DM user before ban
    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('🔨 You have been banned')
        .setColor(0xEF4444)
        .setDescription(`You have been banned from **${interaction.guild!.name}**`)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Duration', value: duration ? duration.label : 'Permanent' },
        )
        .setFooter({ text: 'Wembo Moderation' })
        .setTimestamp()
      await user.send({ embeds: [dmEmbed] })
    } catch {}

    await interaction.guild!.members.ban(user.id, { reason, deleteMessageSeconds: 86400 })

    const caseNumber = await createModLog(guildId, 'ban', user.id, user.tag, interaction.user.id, interaction.user.tag, reason, duration?.label)

    // Schedule unban for temp bans
    if (duration) {
      const supabase = getSupabase()
      await supabase.from('temp_bans').insert({
        guild_id: guildId,
        user_id: user.id,
        user_tag: user.tag,
        expires_at: new Date(Date.now() + duration.ms).toISOString(),
        moderator_id: interaction.user.id,
      })
    }

    const embed = new EmbedBuilder()
      .setTitle('🔨 User Banned')
      .setColor(0xEF4444)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Duration', value: duration ? duration.label : 'Permanent', inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: `Banned by ${interaction.user.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to channel
    const logEmbed = new EmbedBuilder()
      .setTitle('🔨 User Banned')
      .setColor(0xEF4444)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Duration', value: duration ? duration.label : 'Permanent', inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: 'Wembo Moderation' })
      .setTimestamp()

    await sendModLogEmbed(guildId, logEmbed)
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to ban user.' })
  }
}

// ─── /mute ───────────────────────────────────────────────────────────────────

async function handleMute(interaction: ChatInputCommandInteraction, guildId: string) {
  const user = interaction.options.getUser('user', true)
  const reason = interaction.options.getString('reason') || 'No reason provided'
  const durationStr = interaction.options.getString('duration') || '1h'

  await interaction.deferReply()

  try {
    const member = await interaction.guild!.members.fetch(user.id)

    if (!member.moderatable) {
      await interaction.editReply({ content: '❌ I cannot timeout this user. They may have a higher role.' })
      return
    }

    const duration = parseDuration(durationStr)
    if (!duration) {
      await interaction.editReply({ content: '❌ Invalid duration format. Use: 5m, 1h, 1d, etc.' })
      return
    }

    // Max timeout is 28 days
    if (duration.ms > 28 * 24 * 60 * 60 * 1000) {
      await interaction.editReply({ content: '❌ Maximum timeout duration is 28 days.' })
      return
    }

    // DM user
    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('🔇 You have been muted')
        .setColor(0xA78BFA)
        .setDescription(`You have been timed out in **${interaction.guild!.name}**`)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Duration', value: duration.label },
        )
        .setFooter({ text: 'Wembo Moderation' })
        .setTimestamp()
      await user.send({ embeds: [dmEmbed] })
    } catch {}

    await member.timeout(duration.ms, reason)

    const caseNumber = await createModLog(guildId, 'mute', user.id, user.tag, interaction.user.id, interaction.user.tag, reason, duration.label)

    const embed = new EmbedBuilder()
      .setTitle('🔇 User Muted')
      .setColor(0xA78BFA)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Duration', value: duration.label, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: `Muted by ${interaction.user.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to channel
    const logEmbed = new EmbedBuilder()
      .setTitle('🔇 User Muted')
      .setColor(0xA78BFA)
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Duration', value: duration.label, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: 'Wembo Moderation' })
      .setTimestamp()

    await sendModLogEmbed(guildId, logEmbed)
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to mute user.' })
  }
}

// ─── /unban ──────────────────────────────────────────────────────────────────

async function handleUnban(interaction: ChatInputCommandInteraction, guildId: string) {
  const userId = interaction.options.getString('user_id', true).trim()
  const reason = interaction.options.getString('reason') || 'No reason provided'

  if (!/^\d{17,20}$/.test(userId)) {
    await interaction.reply({ content: '❌ Invalid user ID.', ephemeral: true })
    return
  }

  await interaction.deferReply()

  try {
    await interaction.guild!.members.unban(userId, reason)

    const caseNumber = await createModLog(guildId, 'unban', userId, userId, interaction.user.id, interaction.user.tag, reason)

    // Remove from temp_bans if exists
    const supabase = getSupabase()
    await supabase.from('temp_bans').delete().eq('guild_id', guildId).eq('user_id', userId)

    const embed = new EmbedBuilder()
      .setTitle('🔓 User Unbanned')
      .setColor(0x4ade80)
      .addFields(
        { name: 'User', value: `<@${userId}>`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: `Unbanned by ${interaction.user.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to channel
    const logEmbed = new EmbedBuilder()
      .setTitle('🔓 User Unbanned')
      .setColor(0x4ade80)
      .addFields(
        { name: 'User', value: `<@${userId}>`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseNumber}`, inline: true },
      )
      .setFooter({ text: 'Wembo Moderation' })
      .setTimestamp()

    await sendModLogEmbed(guildId, logEmbed)
  } catch (err) {
    await interaction.editReply({ content: '❌ Failed to unban user. Make sure the ID is correct and they are actually banned.' })
  }
}
