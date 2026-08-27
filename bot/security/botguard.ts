import { Client, Events, GuildMember } from 'discord.js'
import { getModuleConfig, logSecurityEvent } from './index'

/**
 * Initialize Bot Guard monitoring.
 * Listens for bot additions and takes action on unauthorized ones.
 */
export function initBotGuard(client: Client) {
  console.log('🤖 Bot Guard module initialized')

  client.on(Events.GuildMemberAdd, async (member) => {
    if (!member.user.bot) return // Only care about bots

    const config = await getModuleConfig(member.guild.id, 'botguard')
    if (!config) return

    const whitelisted: string[] = config.whitelisted_bots || []
    const isWhitelisted = whitelisted.includes(member.user.id)

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

    try {
      switch (action) {
        case 'quarantine':
          // Strip all roles to quarantine the bot
          if (config.quarantine_unverified) {
            const roles = member.roles.cache.filter(r => r.id !== member.guild.id)
            if (roles.size > 0) {
              await member.roles.remove(roles, 'Bot Guard: Unverified bot quarantined')
            }
          }
          break

        case 'kick':
          if (member.kickable) {
            await member.kick('Bot Guard: Unauthorized bot')
          }
          break

        case 'ban':
          if (member.bannable) {
            await member.ban({ reason: 'Bot Guard: Unauthorized bot' })
          }
          break
      }
    } catch (err) {
      console.error('Bot Guard action failed:', err)
    }
  })
}
