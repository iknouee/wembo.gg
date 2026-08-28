import { Client, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, ChannelType, Interaction } from 'discord.js'
import { getModuleConfig, logSecurityEvent } from './index'
import { getSupabase } from '../lib/supabase'

/**
 * Initialize Verification Gate.
 * Sends a verification embed to a channel and handles button clicks.
 */
export function initVerification(client: Client) {
  console.log('✅ Verification Gate module initialized')

  // Handle button interactions
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return
    if (interaction.customId !== 'wembo_verify') return

    const member = interaction.member
    const guild = interaction.guild
    if (!member || !guild) return

    const config = await getModuleConfig(guild.id, 'verification')
    if (!config) {
      await interaction.reply({ content: '❌ Verification is not configured for this server.', ephemeral: true })
      return
    }

    try {
      const guildMember = await guild.members.fetch(member.user.id)

      // Add verified role
      if (config.verified_role_id) {
        const role = guild.roles.cache.get(config.verified_role_id)
        if (role) {
          await guildMember.roles.add(role, 'Verification Gate: User verified')
        }
      }

      // Remove unverified role
      if (config.remove_unverified_role && config.unverified_role_id) {
        const unverifiedRole = guild.roles.cache.get(config.unverified_role_id)
        if (unverifiedRole) {
          await guildMember.roles.remove(unverifiedRole, 'Verification Gate: User verified')
        }
      }

      await interaction.reply({ content: '✅ You have been verified! Welcome to the server.', ephemeral: true })

      // Log verification
      if (config.log_verifications) {
        await logSecurityEvent({
          guildId: guild.id,
          eventType: 'verification',
          severity: 'low',
          description: `${member.user.tag} verified successfully`,
          userId: member.user.id,
          userTag: member.user.tag,
          actionTaken: 'verified',
        })
      }
    } catch (err) {
      console.error('[Verification] Error:', err)
      await interaction.reply({ content: '❌ Verification failed. Please contact a moderator.', ephemeral: true }).catch(() => {})
    }
  })

  // Assign unverified role on join
  client.on(Events.GuildMemberAdd, async (member) => {
    if (member.user.bot) return

    const config = await getModuleConfig(member.guild.id, 'verification')
    if (!config) return
    if (!config.unverified_role_id) return

    try {
      const role = member.guild.roles.cache.get(config.unverified_role_id)
      if (role) {
        await member.roles.add(role, 'Verification Gate: Unverified member joined')
      }
    } catch (err) {
      console.error('[Verification] Failed to assign unverified role:', err)
    }
  })
}

/**
 * Send or update the verification embed in the configured channel.
 * Called when settings are saved from the dashboard.
 */
export async function deployVerificationEmbed(client: Client, guildId: string) {
  const config = await getModuleConfig(guildId, 'verification')
  if (!config || !config.channel_id) return

  const guild = client.guilds.cache.get(guildId)
  if (!guild) return

  const channel = guild.channels.cache.get(config.channel_id)
  if (!channel || channel.type !== ChannelType.GuildText) return

  const textChannel = channel as TextChannel

  // Build embed
  const embed = new EmbedBuilder()
    .setTitle(config.embed_title || 'Verify to Access the Server')
    .setDescription(config.embed_description || 'Click the button below to verify.')
    .setColor(parseInt((config.embed_color || '#FFD600').replace('#', ''), 16))

  if (config.embed_image) embed.setImage(config.embed_image)
  if (config.embed_thumbnail) embed.setThumbnail(config.embed_thumbnail)
  if (config.embed_footer) embed.setFooter({ text: config.embed_footer })

  // Build button
  const styleMap: Record<string, ButtonStyle> = {
    Primary: ButtonStyle.Primary,
    Secondary: ButtonStyle.Secondary,
    Success: ButtonStyle.Success,
    Danger: ButtonStyle.Danger,
  }

  const button = new ButtonBuilder()
    .setCustomId('wembo_verify')
    .setLabel(config.button_label || '✓ Verify')
    .setStyle(styleMap[config.button_style] || ButtonStyle.Success)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

  // Send embed
  try {
    await textChannel.send({ embeds: [embed], components: [row] })
    console.log(`[Verification] Deployed embed to #${channel.name} in ${guild.name}`)
  } catch (err) {
    console.error('[Verification] Failed to deploy embed:', err)
  }
}
