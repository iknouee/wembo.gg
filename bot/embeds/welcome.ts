import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getWelcomeEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Welcome to Wembo')
    .setImage(BRAND.banner)
    .setDescription('Welcome to the official Wembo Discord community.\n\nWembo is an AI-powered Discord platform for automation, security, analytics, and community management.\n\nThis server is the place for:\n• Updates and announcements\n• Support and help\n• Feature discussions\n• Bug reports\n• Community conversation')
    .addFields(
      { name: 'Get started', value: 'Head to #getting-started to set up Wembo in your server.' },
      { name: 'Stay updated', value: 'Check #changelog for the latest updates.' },
    )
    .setFooter({ text: BRAND.footer })
}
