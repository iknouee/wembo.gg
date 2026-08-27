import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getRoadmapEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Roadmap' })
    .setDescription(
      '> What we\'re working on and what\'s coming next.\n\n' +
      '**✅ Completed**\n' +
      '```\n' +
      '• Setup embeds & slash commands\n' +
      '• Discord community server\n' +
      '• Website & landing page\n' +
      '```\n\n' +
      '**🔨 In Progress**\n' +
      '```\n' +
      '• Dashboard (web app)\n' +
      '• Ticket system\n' +
      '• Moderation commands\n' +
      '```\n\n' +
      '**📋 Planned**\n' +
      '```\n' +
      '• AI Assistant\n' +
      '• Automations engine\n' +
      '• Smart security\n' +
      '• Analytics & insights\n' +
      '• Knowledge base\n' +
      '• Forms & workflows\n' +
      '• Member intelligence\n' +
      '• Integrations (YouTube, Twitch, etc.)\n' +
      '• XP & leveling system\n' +
      '```'
    )
    .setFooter({ text: 'Have a feature request? Post in #suggestions' })
}
