import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getLinksEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Official Links' })
    .setDescription('> All official Wembo links. Only trust URLs from this channel.')
    .setFooter({ text: 'Wembo staff will never DM you asking for personal information.' })

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Website').setURL('https://wembo.xyz').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Dashboard').setURL('https://wembo.xyz/dashboard').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Documentation').setURL('https://wembo.xyz/docs').setStyle(ButtonStyle.Link),
  )

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Invite Bot').setURL('https://wembo.xyz/invite').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Status').setURL('https://wembo.xyz/status').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Pricing').setURL('https://wembo.xyz/pricing').setStyle(ButtonStyle.Link),
  )

  return { embed, rows: [row1, row2] }
}
