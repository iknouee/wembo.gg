import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getGettingStartedEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Getting Started' })
    .setImage(BRAND.banner)
    .setDescription(
      '> Set up Wembo in your server in under 2 minutes.\n\n' +
      '**Step 1** — Invite Wembo to your server\n' +
      '**Step 2** — Grant Administrator permission\n' +
      '**Step 3** — Open the dashboard and select your server\n' +
      '**Step 4** — Enable and configure your features\n' +
      '**Step 5** — Done! Use `/help` to see commands'
    )
    .setFooter({ text: 'Need help? Ask in #get-help or open a ticket.' })

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Invite Wembo').setURL('https://wembo.xyz/invite').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Open Dashboard').setURL('https://wembo.xyz/dashboard').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Documentation').setURL('https://wembo.xyz/docs').setStyle(ButtonStyle.Link),
  )

  return { embed, row }
}
