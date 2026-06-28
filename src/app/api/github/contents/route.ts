import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get('owner')
  const repo  = req.nextUrl.searchParams.get('repo')
  const path  = req.nextUrl.searchParams.get('path') ?? ''

  if (!owner || !repo)
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

  const url = path
    ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    : `https://api.github.com/repos/${owner}/${repo}/contents`

  const contentsRes = await fetch(url, {
    headers: { Authorization: `Bearer ${connection.access_token}` },
  })

  if (!contentsRes.ok) {
    return NextResponse.json({ error: 'Failed to load contents' }, { status: contentsRes.status })
  }

  const data = await contentsRes.json()
  return NextResponse.json({ contents: data })
}
