import 'dotenv/config'

export const config = {
  token: process.env.BOT_TOKEN!,
  clientId: process.env.CLIENT_ID!,
  guildId: process.env.GUILD_ID!,
}

export const BRAND = {
  color: 0xFFD600,
  banner: 'https://cdn.discordapp.com/attachments/1542326057997172776/1542333473765859358/banner.png?ex=6a90d97b&is=6a8f87fb&hm=ce13d0c34d928c49e3daf588964fb853ed1e4d6555760497b155c0b5f9fa1dfb',
  website: 'wembo.xyz',
  footer: 'wembo.xyz',
}
