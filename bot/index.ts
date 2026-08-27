import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js'
import { config } from './config'
import { handleCommand } from './commands'
import { initSecurity } from './security'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,        // Required for anti-raid (member join events)
    GatewayIntentBits.MessageContent,      // Required for spam/phishing scanning
  ],
})

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Wembo is online as ${readyClient.user.tag}`)
  console.log(`   Servers: ${readyClient.guilds.cache.size}`)

  // Set presence
  readyClient.user.setPresence({
    activities: [{ name: 'wembo.xyz | Protecting servers', type: ActivityType.Watching }],
    status: 'online',
  })

  // Initialize security monitoring
  initSecurity(client)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  try {
    await handleCommand(interaction)
  } catch (error) {
    console.error(`Error handling command ${interaction.commandName}:`, error)
    const reply = { content: '❌ An error occurred while running this command.', ephemeral: true }
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply)
    } else {
      await interaction.reply(reply)
    }
  }
})

// Login
client.login(config.token).catch((error) => {
  console.error('Failed to login:', error)
  process.exit(1)
})
