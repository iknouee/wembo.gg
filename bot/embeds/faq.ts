import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getFaqEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • FAQ' })
    .setDescription(
      '> Common questions about Wembo.\n\n' +
      '**Is Wembo free?**\n' +
      'Yes — there\'s a free tier. Pro and Enterprise plans unlock more features.\n\n' +
      '**How do I set up Wembo?**\n' +
      'Invite the bot → open the [dashboard](https://wembo.xyz/dashboard) → configure.\n\n' +
      '**Can I use Wembo in multiple servers?**\n' +
      'Yes. Each server is configured independently.\n\n' +
      '**Where do I report bugs?**\n' +
      'Use <#1542325874613821450> with details, steps to reproduce, and screenshots.\n\n' +
      '**How do I suggest a feature?**\n' +
      'Post in <#1542325791138775132> — be specific about what and why.\n\n' +
      '**Is my data safe?**\n' +
      'Yes. We don\'t sell or share your data. See <#1542325660863955025> for details.\n\n' +
      '**How do I get support?**\n' +
      'Ask in <#1542325853952807083> or open a private ticket in <#1542325921695010917>.'
    )
    .setFooter({ text: 'Still have questions? Open a ticket.' })
}
