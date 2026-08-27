import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getLinksEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Official Wembo Links')
    .setImage(BRAND.banner)
    .setDescription('All official Wembo links in one place.')
    .addFields(
      { name: '🌐 Website', value: '[wembo.xyz](https://wembo.xyz)' },
      { name: '📊 Dashboard', value: '[wembo.xyz/dashboard](https://wembo.xyz/dashboard)' },
      { name: '📄 Documentation', value: '[wembo.xyz/docs](https://wembo.xyz/docs)' },
      { name: '🤖 Bot Invite', value: '[wembo.xyz/invite](https://wembo.xyz/invite)' },
      { name: '🟢 Status', value: '[wembo.xyz/status](https://wembo.xyz/status)' },
      { name: '💰 Pricing', value: '[wembo.xyz/pricing](https://wembo.xyz/pricing)' },
    )
    .setFooter({ text: 'Only trust links from this channel. Wembo staff will never DM you asking for personal information.' })
}
