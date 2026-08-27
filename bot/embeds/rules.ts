import { EmbedBuilder } from 'discord.js'
import { BRAND } from '../config'

export function getRulesEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setAuthor({ name: 'Wembo • Server Rules' })
    .setDescription(
      '> Please follow these rules to keep the community safe and enjoyable for everyone.\n\n' +
      '**1.** Be respectful — no harassment, hate speech or personal attacks\n' +
      '**2.** No spam — messages, emojis, mentions or commands\n' +
      '**3.** No self-promotion — without explicit staff permission\n' +
      '**4.** English only — so staff can moderate effectively\n' +
      '**5.** No NSFW — no explicit or inappropriate content\n' +
      '**6.** No drama — keep personal conflicts out of public channels\n' +
      '**7.** Listen to staff — decisions are final, use tickets to dispute\n' +
      '**8.** Use channels correctly — keep things on-topic\n' +
      '**9.** No exploits — report bugs, don\'t abuse them\n' +
      '**10.** Follow [Discord ToS](https://discord.com/terms) — always'
    )
    .setFooter({ text: 'Violations may result in a warning, mute, kick or ban.' })
}
