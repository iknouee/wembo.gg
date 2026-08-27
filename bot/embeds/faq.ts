import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getFaqEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Frequently Asked Questions')
    .setImage(BRAND.banner)
    .setDescription('Common questions about Wembo.')
    .addFields(
      { name: 'Is Wembo free?', value: 'Yes. Wembo has a free tier. Pro and Enterprise plans are available for larger communities that need more features.' },
      { name: 'How do I set up Wembo?', value: 'Invite the bot, go to [wembo.xyz/dashboard](https://wembo.xyz/dashboard), select your server and configure your features.' },
      { name: 'Where can I report bugs?', value: 'Use #bug-reports with as much detail as possible — what happened, what you expected, and any screenshots.' },
      { name: 'How do I suggest a feature?', value: 'Post in #suggestions. Be clear about what you want and why.' },
      { name: 'Can I use Wembo in multiple servers?', value: 'Yes. Each server is configured independently from the dashboard.' },
      { name: 'How do I get support?', value: 'Ask in #get-help for public questions or open a private ticket in #open-ticket.' },
      { name: 'Is my data safe?', value: 'Yes. See #terms-of-service for our privacy policy. We do not sell or share your data.' },
    )
    .setFooter({ text: 'Still have questions? Ask in #get-help or open a ticket.' })
}
