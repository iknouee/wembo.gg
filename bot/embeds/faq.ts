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
      'Use <#bug-reports> with details, steps to reproduce, and screenshots.\n\n' +
      '**How do I suggest a feature?**\n' +
      'Post in <#suggestions> — be specific about what and why.\n\n' +
      '**Is my data safe?**\n' +
      'Yes. We don\'t sell or share your data. See <#terms-of-service> for details.\n\n' +
      '**How do I get support?**\n' +
      'Ask in <#get-help> or open a private ticket in <#open-ticket>.'
    )
    .setFooter({ text: 'Still have questions? Open a ticket.' })
}
