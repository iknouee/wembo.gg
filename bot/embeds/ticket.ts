import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BRAND } from '../config'

export function getTicketEmbed() {
  const embed = new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Support' })
    .setTitle('Need help? Open a ticket.')
    .setImage(BRAND.banner)
    .setDescription(
      'If you need private assistance from the Wembo team, select a category below and we\'ll create a private channel for you.\n\n' +
      'A staff member will respond as soon as possible.'
    )
    .addFields(
      {
        name: '📋 Before opening a ticket',
        value:
          '• Search for your issue in the FAQ first\n' +
          '• Include as much detail as possible\n' +
          '• Screenshots and error messages help us help you faster',
      },
      {
        name: '⏱️ Response Time',
        value: 'We aim to respond within a few hours. Complex issues may take longer.',
      },
    )
    .setFooter({ text: 'Select a category below to open a ticket.' })

  const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('ticket_category')
      .setPlaceholder('Select a ticket category...')
      .addOptions(
        {
          label: 'General Support',
          description: 'General questions or help with Wembo',
          value: 'general',
          emoji: '❓',
        },
        {
          label: 'Bug Report',
          description: 'Report a bug or unexpected behaviour',
          value: 'bug',
          emoji: '🐛',
        },
        {
          label: 'Account Issue',
          description: 'Problems with your account or access',
          value: 'account',
          emoji: '👤',
        },
        {
          label: 'Billing & Pricing',
          description: 'Questions about plans, payments or subscriptions',
          value: 'billing',
          emoji: '💰',
        },
        {
          label: 'Partnership',
          description: 'Partnership or collaboration enquiries',
          value: 'partnership',
          emoji: '🤝',
        },
        {
          label: 'Other',
          description: 'Anything else not listed above',
          value: 'other',
          emoji: '📌',
        },
      )
  )

  return { embed, components: [selectMenu] }
}
