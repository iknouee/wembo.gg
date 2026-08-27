import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getTosEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Terms of Service' })
    .setDescription(
      '> By using Wembo, you agree to the following terms.\n\n' +
      '**Data Collection**\n' +
      'Wembo stores server configuration, command usage, and features you enable. We do not store message content unless explicitly configured (e.g. knowledge base).\n\n' +
      '**Data Usage**\n' +
      'Your data is used solely to provide Wembo\'s services. We do not sell, share, or monetise your data.\n\n' +
      '**Data Deletion**\n' +
      'Remove Wembo from your server and all associated data will be deleted within 30 days. You can request immediate deletion via a support ticket.\n\n' +
      '**Availability**\n' +
      'Wembo is provided as-is. We aim for high uptime but do not guarantee uninterrupted service.\n\n' +
      '**Changes**\n' +
      'Terms may be updated. Continued use of Wembo constitutes acceptance of any changes.'
    )
    .setFooter({ text: 'Questions? Open a support ticket.' })

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Full Terms').setURL('https://wembo.xyz/terms').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Privacy Policy').setURL('https://wembo.xyz/privacy').setStyle(ButtonStyle.Link),
  )

  return { embed, row }
}
