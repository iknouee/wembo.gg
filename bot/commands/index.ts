import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { getRulesEmbed } from '../embeds/rules'
import { getLinksEmbed } from '../embeds/links'
import { getFaqEmbed } from '../embeds/faq'
import { getGettingStartedEmbed } from '../embeds/getting-started'
import { getStatusEmbed } from '../embeds/status'
import { getWelcomeEmbed } from '../embeds/welcome'
import { getTicketEmbed } from '../embeds/ticket'
import { getRoadmapEmbed } from '../embeds/roadmap'
import { getTosEmbed } from '../embeds/tos'

export const commands = [
  new SlashCommandBuilder()
    .setName('sendrules')
    .setDescription('Send the server rules embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendlinks')
    .setDescription('Send the official links embed with buttons')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendfaq')
    .setDescription('Send the FAQ embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendgettingstarted')
    .setDescription('Send the getting started guide with buttons')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendstatus')
    .setDescription('Send the bot status embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendwelcome')
    .setDescription('Send the welcome embed with buttons')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendticket')
    .setDescription('Send the ticket panel with Open Ticket button')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendroadmap')
    .setDescription('Send the roadmap embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sendtos')
    .setDescription('Send the terms of service embed with buttons')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
]

export async function handleCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction
  const channel = interaction.channel

  if (!channel || !('send' in channel)) {
    await interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true })
    return
  }

  const ch = channel as TextChannel

  switch (commandName) {
    case 'sendrules': {
      await ch.send({ embeds: [getRulesEmbed()] })
      await interaction.reply({ content: '✅ Rules embed sent.', ephemeral: true })
      break
    }

    case 'sendlinks': {
      const { embed, rows } = getLinksEmbed()
      await ch.send({ embeds: [embed], components: rows })
      await interaction.reply({ content: '✅ Links embed sent.', ephemeral: true })
      break
    }

    case 'sendfaq': {
      await ch.send({ embeds: [getFaqEmbed()] })
      await interaction.reply({ content: '✅ FAQ embed sent.', ephemeral: true })
      break
    }

    case 'sendgettingstarted': {
      const { embed, row } = getGettingStartedEmbed()
      await ch.send({ embeds: [embed], components: [row] })
      await interaction.reply({ content: '✅ Getting Started embed sent.', ephemeral: true })
      break
    }

    case 'sendstatus': {
      await ch.send({ embeds: [getStatusEmbed()] })
      await interaction.reply({ content: '✅ Status embed sent.', ephemeral: true })
      break
    }

    case 'sendwelcome': {
      const { embed, row } = getWelcomeEmbed()
      await ch.send({ embeds: [embed], components: [row] })
      await interaction.reply({ content: '✅ Welcome embed sent.', ephemeral: true })
      break
    }

    case 'sendticket': {
      const { embed, components } = getTicketEmbed()
      await ch.send({ embeds: [embed], components })
      await interaction.reply({ content: '✅ Ticket panel sent.', ephemeral: true })
      break
    }

    case 'sendroadmap': {
      await ch.send({ embeds: [getRoadmapEmbed()] })
      await interaction.reply({ content: '✅ Roadmap embed sent.', ephemeral: true })
      break
    }

    case 'sendtos': {
      const { embed, row } = getTosEmbed()
      await ch.send({ embeds: [embed], components: [row] })
      await interaction.reply({ content: '✅ Terms of Service embed sent.', ephemeral: true })
      break
    }

    default:
      await interaction.reply({ content: 'Unknown command.', ephemeral: true })
  }
}
