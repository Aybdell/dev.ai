import { NextResponse } from 'next/server'

export async function GET() {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return new Response(
      'GitHub OAuth not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env.local',
      { status: 500 }
    )
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/github/callback`,
    scope: 'repo read:user',
    state: crypto.randomUUID(),
  })

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  )
}
