'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`
}

interface GithubConnection {
  github_username: string
  avatar_url: string | null
  connected_at: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { user, signOut } = useAuth()

  const [connection, setConnection] = useState<GithubConnection | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const fetchGithubConnection = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) return
    const { data } = await supabase
      .from('github_connections')
      .select('github_username, avatar_url, connected_at')
      .eq('user_id', u.id)
      .maybeSingle()
    setConnection(data ?? null)
  }, [supabase])

  useEffect(() => {
    const status = searchParams.get('github')
    if (status === 'success') {
      toast.success('GitHub connected successfully!')
      window.history.replaceState({}, '', '/settings')
      fetchGithubConnection()
    }
    if (status === 'error') {
      toast.error('GitHub connection failed. Please try again.')
      window.history.replaceState({}, '', '/settings')
    }
  }, [searchParams, fetchGithubConnection])

  useEffect(() => {
    fetchGithubConnection()
  }, [fetchGithubConnection])

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')

    if (!newPassword || !confirmPassword) {
      setPasswordError('Both fields are required')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setUpdating(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setUpdating(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Password updated successfully')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-[#f0f0f0]">Settings</h1>
      <p className="text-sm text-[#888888] mt-1">Manage your account preferences</p>

      <div className="mt-8 space-y-4">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#f0f0f0] mb-4">Account</h2>
          <div>
            <p className="text-xs text-[#555555]">Email</p>
            <p className="text-sm text-[#888888] font-mono">{user?.email ?? '—'}</p>
          </div>
          <div className="mt-3">
            <p className="text-xs text-[#555555]">Member since</p>
            <p className="text-sm text-[#888888] font-mono">{formatDate(user?.created_at)}</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#f0f0f0] mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="text-xs text-[#555555] block mb-1">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-9 px-3 text-sm bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-[#f0f0f0] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-xs text-[#555555] block mb-1">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-9 px-3 text-sm bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-[#f0f0f0] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-red-400">{passwordError}</p>
            )}
            <Button type="submit" className="w-auto px-5 gap-2" disabled={updating}>
              {updating && <Loader2 className="size-4 animate-spin" />}
              {updating ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#f0f0f0] mb-4">GitHub</h2>
          {connection ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {connection.avatar_url && (
                  <img
                    src={connection.avatar_url}
                    alt="GitHub avatar"
                    className="size-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm text-[#f0f0f0] font-mono">
                    @{connection.github_username}
                  </p>
                  <p className="text-xs text-[#555555]">
                    Connected · {connection.connected_at
                      ? new Date(connection.connected_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setDisconnecting(true)
                  const { data: { user: u } } = await supabase.auth.getUser()
                  if (u) {
                    await supabase
                      .from('github_connections')
                      .delete()
                      .eq('user_id', u.id)
                  }
                  setConnection(null)
                  setDisconnecting(false)
                  toast.success('GitHub disconnected')
                }}
                disabled={disconnecting}
                className="text-xs text-[#555555] hover:text-red-400 border border-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                Connect your GitHub account to browse and import code directly from your repositories.
              </p>
              <button
                onClick={() => window.location.href = '/api/github/connect'}
                className="flex items-center gap-2 bg-[#24292e] hover:bg-[#2d333b] text-white text-sm px-4 py-2.5 rounded-lg transition-colors ml-4 shrink-0"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Connect GitHub
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#111111] border border-[#ef4444]/20 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-red-400 mb-4">Danger Zone</h2>
          <button
            onClick={async () => {
              await signOut()
              router.push('/')
            }}
            className="inline-flex items-center gap-2 border border-[#2a2a2a] text-[#888888] hover:text-red-400 hover:border-red-400/30 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="size-[14px]" />
            Sign Out
          </button>
          <p className="text-xs text-[#555555] mt-2">This will sign you out of all devices</p>
        </div>
      </div>
    </div>
  )
}
