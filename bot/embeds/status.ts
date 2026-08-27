import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getStatusEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Wembo Status')
    .setImage(BRAND.banner)
    .setDescription('Current operational status of Wembo services.')
    .addFields(
      { name: '🤖 Bot', value: 'Online', inline: true },
      { name: '🌐 Dashboard', value: 'Online', inline: true },
      { name: '📡 API', value: 'Online', inline: true },
    )
    .setFooter({ text: `Last updated: ${new Date().toUTCString()} • wembo.xyz/status` })
    .setTimestamp()
}
