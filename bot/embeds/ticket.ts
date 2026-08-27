import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getTicketEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Support Tickets' })
    .setDescription(
      '> Need private help? Open a ticket below.\n\n' +
      'A staff member will respond as soon as possible.\n\n' +
      '**Before opening a ticket:**\n' +
      '• Check <#faq> for common answers\n' +
      '• Check <#get-help> for public support\n' +
      '• Be ready to describe your issue clearly'
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
