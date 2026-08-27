import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getTicketEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Support Tickets')
    .setImage(BRAND.banner)
    .setDescription('Need private help? Click the button below to open a support ticket.\n\nA staff member will respond as soon as possible.')
    .addFields(
      { name: 'Before opening a ticket:', value: '• Check #faq for common solutions\n• Check #get-help for public answers\n• Include details about your issue' },
    )

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('Open Ticket')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Primary)
  )

  return { embed, row }
}
