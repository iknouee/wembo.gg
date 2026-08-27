import { REST, Routes } from 'discord.js'
import { config } from './config'
import { commands } from './commands'

const rest = new REST({ version: '10' }).setToken(config.token)

async function deployCommands() {
  try {
    console.log(`Deploying ${commands.length} slash commands...`)

    // Deploy to specific guild (instant, for development)
    if (config.guildId) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands.map((c) => c.toJSON()) }
      )
      console.log(`✅ Deployed ${commands.length} commands to guild ${config.guildId}`)
    } else {
      // Deploy globally (takes up to 1 hour to propagate)
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands.map((c) => c.toJSON()) }
      )
      console.log(`✅ Deployed ${commands.length} commands globally`)
    }
  } catch (error) {
    console.error('Failed to deploy commands:', error)
    process.exit(1)
  }
}

deployCommands()
