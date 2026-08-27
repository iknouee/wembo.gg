import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getStatusEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • System Status' })
    .setDescription(
      '```\n' +
      '  Service        Status\n' +
      '  ─────────────────────\n' +
      '  Bot            ● Online\n' +
      '  Dashboard      ● Online\n' +
      '  API            ● Online\n' +
      '```'
    )
    .setFooter({ text: `Last updated • ${new Date().toUTCString()}` })
    .setTimestamp()
}
