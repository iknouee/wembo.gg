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
      '**→** <#getting-started> to set up Wembo\n' +
      '**→** <#changelog> for the latest updates\n' +
      '**→** <#suggestions> to share ideas\n' +
      '**→** <#get-help> for support'
    )

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Website').setURL('https://wembo.xyz').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Invite Bot').setURL('https://wembo.xyz/invite').setStyle(ButtonStyle.Link),
  )

  return { embed, row }
}
