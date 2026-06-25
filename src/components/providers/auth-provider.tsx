'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextValue {
  user: User | null
  session: Session | null
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  signOut: async () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, session, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
