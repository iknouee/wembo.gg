import { Client, Events, GuildMember } from 'discord.js'
import { getModuleConfig, logSecurityEvent } from './index'

/**
 * Initialize Bot Guard monitoring.
 * Listens for bot additions and takes action on unauthorized ones.
 */
export function initBotGuard(client: Client) {
  console.log('🤖 Bot Guard module initialized')

  client.on(Events.GuildMemberAdd, async (member) => {
    // Log ALL member joins so we can see if the event fires
    console.log(`[BotGuard] Member joined: ${member.user.tag} (bot: ${member.user.bot}, guild: ${member.guild.id})`)

    if (!member.user.bot) return // Only care about bots

    console.log(`[BotGuard] Bot detected: ${member.user.tag} in guild ${member.guild.id}`)

    const config = await getModuleConfig(member.guild.id, 'botguard')
    console.log(`[BotGuard] Module config:`, config ? 'FOUND' : 'NULL (module disabled or not in DB)')

    if (!config) {
      console.log(`[BotGuard] Skipping — module not enabled for guild ${member.guild.id}`)
      return
    }

    const whitelisted: string[] = config.whitelisted_bots || []
    const isWhitelisted = whitelisted.includes(member.user.id)
    console.log(`[BotGuard] Bot ${member.user.tag} whitelisted: ${isWhitelisted}`)

    // Always log bot additions if notify is on
    if (config.notify_on_add) {
      await logSecurityEvent({
        guildId: member.guild.id,
        eventType: isWhitelisted ? 'bot_added' : 'unauthorized_bot',
        severity: isWhitelisted ? 'low' : 'high',
        description: isWhitelisted
          ? `Whitelisted bot added: ${member.user.tag}`
          : `Unauthorized bot added: ${member.user.tag}`,
        userId: member.user.id,
        userTag: member.user.tag,
        actionTaken: isWhitelisted ? 'allowed' : config.action || 'quarantine',
      })
    }

    // If whitelisted, allow it
    if (isWhitelisted) return

    // Not whitelisted — take action
    const action = config.action || 'kick'
    console.log(`[BotGuard] Taking action: ${action} on ${member.user.tag} (kickable: ${member.kickable}, bannable: ${member.bannable})`)

    try {
      switch (action) {
        case 'quarantine':
          if (config.quarantine_unverified) {
            const roles = member.roles.cache.filter(r => r.id !== member.guild.id)
            if (roles.size > 0) {
              await member.roles.remove(roles, 'Bot Guard: Unverified bot quarantined')
              console.log(`[BotGuard] ✅ Quarantined ${member.user.tag} (stripped ${roles.size} roles)`)
            }
          }
          break

        case 'kick':
          if (member.kickable) {
            await member.kick('Bot Guard: Unauthorized bot')
            console.log(`[BotGuard] ✅ Kicked ${member.user.tag}`)
          } else {
            console.log(`[BotGuard] ❌ Cannot kick ${member.user.tag} — bot role is too low`)
          }
          break

        case 'ban':
          if (member.bannable) {
            await member.ban({ reason: 'Bot Guard: Unauthorized bot' })
            console.log(`[BotGuard] ✅ Banned ${member.user.tag}`)
          } else {
            console.log(`[BotGuard] ❌ Cannot ban ${member.user.tag} — bot role is too low`)
          }
          break
      }
    } catch (err) {
      console.error('[BotGuard] Action failed:', err)
    }
  })
}
