import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getRulesEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('Server Rules')
    .setImage(BRAND.banner)
    .setDescription('Welcome to the official Wembo Discord community. Please follow these rules to keep the server a positive space for everyone.')
    .addFields(
      { name: '1️⃣ Be Respectful', value: 'Treat everyone with respect. No harassment, hate speech, discrimination or personal attacks.' },
      { name: '2️⃣ No Spam', value: 'Do not spam messages, emojis, reactions, mentions or commands.' },
      { name: '3️⃣ No Self-Promotion', value: 'Do not advertise servers, products, services or social media without permission.' },
      { name: '4️⃣ English Only', value: 'Please communicate in English so staff can moderate effectively.' },
      { name: '5️⃣ No NSFW Content', value: 'No explicit, graphic or inappropriate content of any kind.' },
      { name: '6️⃣ No Drama', value: 'Keep personal drama, arguments and callouts out of public channels.' },
      { name: '7️⃣ Listen to Staff', value: 'Staff decisions are final. If you disagree, open a ticket — do not argue publicly.' },
      { name: '8️⃣ Use Channels Correctly', value: 'Keep discussions in the appropriate channels.' },
      { name: '9️⃣ No Exploits or Abuse', value: 'Do not exploit bugs in Wembo or Discord. Report them in #bug-reports.' },
      { name: '🔟 Follow Discord ToS', value: 'All Discord Terms of Service and Community Guidelines apply.' },
    )
    .setFooter({ text: 'Breaking these rules may result in a warning, mute, kick or ban.' })
}
