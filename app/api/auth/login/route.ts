import { redirect } from 'next/navigation'

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'identify guilds',
  })

  redirect(`https://discord.com/api/v10/oauth2/authorize?${params.toString()}`)
}
