'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GitBranch } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleGithubLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm bg-surface border-border">
        <CardHeader className="pb-4 pt-8 text-center">
          <h1 className="font-sans font-bold text-2xl text-foreground">Dev AI</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered code reviews for developers</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-subtle"
            onClick={handleGithubLogin}
            disabled={loading}
          >
            <GitBranch className="size-4 mr-2" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-2 text-muted-text">or</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <label htmlFor="email" className="text-xs text-muted-foreground block mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-9 px-3 text-sm bg-subtle border border-border rounded-md text-foreground placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs text-muted-foreground block mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-9 px-3 text-sm bg-subtle border border-border rounded-md text-foreground placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-xs text-muted-text text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
