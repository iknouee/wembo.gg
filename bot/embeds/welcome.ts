import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getWelcomeEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Welcome to Wembo' })
    .setImage(BRAND.banner)
    .setDescription(
      'Welcome to the official **Wembo** Discord community.\n\n' +
      'Wembo is an AI-powered Discord platform for automation, security, analytics, and community management.\n\n' +
      '**→** <#1542326743975596042> to set up Wembo\n' +
      '**→** <#1542325615556829184> for the latest updates\n' +
      '**→** <#1542325791138775132> to share ideas\n' +
      '**→** <#1542325853952807083> for support'
    )

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Website').setURL('https://wembo.xyz').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Invite Bot').setURL('https://wembo.xyz/invite').setStyle(ButtonStyle.Link),
  )

  return { embed, row }
}
