import { redirect } from 'next/navigation'

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID || ''
  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`
  redirect(inviteUrl)
}
