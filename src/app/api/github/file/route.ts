import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get('owner')
  const repo  = req.nextUrl.searchParams.get('repo')
  const path  = req.nextUrl.searchParams.get('path')

  if (!owner || !repo || !path)
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: connection } = await supabase
    .from('github_connections')
    .select('access_token')
    .eq('user_id', user.id)
    .single()

  if (!connection) return NextResponse.json({ error: 'Not connected' }, { status: 400 })

  const fileRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `Bearer ${connection.access_token}` } }
  )
  const file = await fileRes.json()

  const content = Buffer.from(file.content, 'base64').toString('utf-8')

  return NextResponse.json({ content, name: file.name, path: file.path })
}
