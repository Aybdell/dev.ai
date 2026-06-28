'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, signOut } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [updating, setUpdating] = useState(false)

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
