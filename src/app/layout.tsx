import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Dev AI',
  description: 'AI-powered code reviews for developers — Get structured feedback on your JavaScript, TypeScript, React, and Next.js code.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster theme="dark" position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
