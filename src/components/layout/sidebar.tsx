'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileCode,
  History,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/review', label: 'New Review', icon: FileCode },
  { href: '/dashboard', label: 'History', icon: History },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <aside
      className={cn(
        'h-full bg-surface border-r border-border flex flex-col shrink-0 transition-all duration-200 ease-in-out',
        collapsed ? 'w-[60px]' : 'w-[220px]'
      )}
    >
      <div className={cn(
        'flex items-center h-14 border-b border-border relative',
        collapsed ? 'justify-center px-0' : 'gap-2 px-5'
      )}>
        <span className="size-2 rounded-full bg-accent shrink-0" />
        {!collapsed && (
          <span className="font-sans font-bold text-base text-foreground">Dev AI</span>
        )}
        <button
          onClick={toggleCollapsed}
          className={cn(
            'p-1.5 text-[#555555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-lg transition-colors',
            collapsed ? 'absolute -right-3 top-1/2 -translate-y-1/2 bg-surface border border-border z-10' : 'ml-auto'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                collapsed
                  ? 'flex items-center justify-center p-2 rounded-lg mx-2 text-[#555555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] transition-colors'
                  : 'flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                active && !collapsed && 'bg-accent/10 text-accent font-medium',
                active && collapsed && 'text-accent',
                !active && !collapsed && 'text-muted-foreground hover:text-foreground hover:bg-subtle'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          )
        })}
      </nav>

      <Separator className={collapsed ? 'mx-3 w-auto' : 'mx-4 w-auto'} />

      <div className={cn(
        'flex items-center gap-3',
        collapsed ? 'justify-center p-3' : 'p-4'
      )}>
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs bg-subtle text-muted-foreground uppercase">
            {user?.email?.charAt(0) ?? 'U'}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
            </div>
            <button
              onClick={async () => { await signOut(); router.push('/') }}
              className="text-muted-text hover:text-foreground transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

export function Sidebar() {
  return (
    <div className="hidden lg:flex h-full">
      <SidebarContent />
    </div>
  )
}

export function MobileHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const currentLabel = navItems.find((item) => pathname.startsWith(item.href))?.label ?? 'Dev AI'

  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-surface">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center size-9 rounded-md text-foreground hover:bg-subtle transition-colors">
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[220px]">
          <div className="flex items-center justify-between px-5 h-14 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <span className="font-sans font-bold text-base text-foreground">Dev AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-text hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <nav className="py-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                    active
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-subtle'
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <span className="font-medium text-sm text-foreground">{currentLabel}</span>
      <div className="size-5" />
    </header>
  )
}
