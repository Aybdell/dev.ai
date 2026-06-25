'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileCode,
  History,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/review', label: 'New Review', icon: FileCode },
  { href: '/dashboard', label: 'History', icon: History },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
]

function SidebarContent() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="w-[220px] h-full bg-surface border-r border-border flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-border">
        <span className="size-2 rounded-full bg-accent" />
        <span className="font-sans font-bold text-base text-foreground">Dev AI</span>
      </div>

      <nav className="flex-1 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
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

      <Separator className="mx-4 w-auto" />

      <div className="p-4 flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs bg-subtle text-muted-foreground uppercase">
            {user?.email?.charAt(0) ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
        </div>
        <button
          onClick={signOut}
          className="text-muted-text hover:text-foreground transition-colors"
          title="Sign out"
        >
          <LogOut className="size-4" />
        </button>
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
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Menu className="size-5" />
          </Button>
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
