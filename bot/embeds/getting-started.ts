import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getGettingStartedEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Getting Started with Wembo')
    .setImage(BRAND.banner)
    .setDescription('Set up Wembo in your Discord server in under 2 minutes.')
    .addFields(
      { name: 'Step 1 — Invite Wembo', value: 'Click the invite link in #links to add Wembo to your server.' },
      { name: 'Step 2 — Grant Permissions', value: 'Wembo needs Administrator permission to function fully. You can fine-tune permissions later.' },
      { name: 'Step 3 — Open the Dashboard', value: 'Visit [wembo.xyz/dashboard](https://wembo.xyz/dashboard) and select your server to start configuring.' },
      { name: 'Step 4 — Configure Features', value: 'Enable the features you want — AI, security, automations, forms, and more.' },
      { name: 'Step 5 — Done', value: 'Wembo is ready. Use `/help` in your server to see available commands.' },
    )
    .setFooter({ text: 'Need help? Ask in #get-help or open a ticket.' })
}
