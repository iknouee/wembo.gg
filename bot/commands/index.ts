import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { getRulesEmbed } from '../embeds/rules'
import { getLinksEmbed } from '../embeds/links'
import { getFaqEmbed } from '../embeds/faq'
import { getGettingStartedEmbed } from '../embeds/getting-started'
import { getStatusEmbed } from '../embeds/status'
import { getWelcomeEmbed } from '../embeds/welcome'
import { getTicketEmbed } from '../embeds/ticket'

export const commands = [
  new SlashCommandBuilder()
    .setName('sendrules')
    .setDescription('Send the server rules embed to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendlinks')
    .setDescription('Send the official links embed to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendfaq')
    .setDescription('Send the FAQ embed to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendgettingstarted')
    .setDescription('Send the getting started embed to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendstatus')
    .setDescription('Send the bot status embed to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendwelcome')
    .setDescription('Send the welcome/announcements embed to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendticket')
    .setDescription('Send the ticket panel with button to this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendall')
    .setDescription('Send all setup embeds to the current channel (for testing)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
]

export async function handleCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction
  const channel = interaction.channel

  if (!channel || !('send' in channel)) {
    await interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true })
    return
  }

  const textChannel = channel as TextChannel

  switch (commandName) {
    case 'sendrules': {
      await textChannel.send({ embeds: [getRulesEmbed()] })
      await interaction.reply({ content: '✅ Rules embed sent.', ephemeral: true })
      break
    }

    case 'sendlinks': {
      await textChannel.send({ embeds: [getLinksEmbed()] })
      await interaction.reply({ content: '✅ Links embed sent.', ephemeral: true })
      break
    }

    case 'sendfaq': {
      await textChannel.send({ embeds: [getFaqEmbed()] })
      await interaction.reply({ content: '✅ FAQ embed sent.', ephemeral: true })
      break
    }

    case 'sendgettingstarted': {
      await textChannel.send({ embeds: [getGettingStartedEmbed()] })
      await interaction.reply({ content: '✅ Getting Started embed sent.', ephemeral: true })
      break
    }

    case 'sendstatus': {
      await textChannel.send({ embeds: [getStatusEmbed()] })
      await interaction.reply({ content: '✅ Status embed sent.', ephemeral: true })
      break
    }

    case 'sendwelcome': {
      await textChannel.send({ embeds: [getWelcomeEmbed()] })
      await interaction.reply({ content: '✅ Welcome embed sent.', ephemeral: true })
      break
    }

    case 'sendticket': {
      const { embed, row } = getTicketEmbed()
      await textChannel.send({ embeds: [embed], components: [row] })
      await interaction.reply({ content: '✅ Ticket panel sent.', ephemeral: true })
      break
    }

    case 'sendall': {
      await textChannel.send({ embeds: [getRulesEmbed()] })
      await textChannel.send({ embeds: [getLinksEmbed()] })
      await textChannel.send({ embeds: [getFaqEmbed()] })
      await textChannel.send({ embeds: [getGettingStartedEmbed()] })
      await textChannel.send({ embeds: [getStatusEmbed()] })
      await textChannel.send({ embeds: [getWelcomeEmbed()] })
      const { embed, row } = getTicketEmbed()
      await textChannel.send({ embeds: [embed], components: [row] })
      await interaction.reply({ content: '✅ All embeds sent.', ephemeral: true })
      break
    }

    default:
      await interaction.reply({ content: 'Unknown command.', ephemeral: true })
  }
}
