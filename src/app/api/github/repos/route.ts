import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
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

  const reposRes = await fetch(
    'https://api.github.com/user/repos?sort=updated&per_page=30',
    { headers: { Authorization: `Bearer ${connection.access_token}` } }
  )
  const repos = await reposRes.json()

  return NextResponse.json({ repos })
}
