import { Sidebar, MobileHeader } from '@/components/layout/sidebar'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
