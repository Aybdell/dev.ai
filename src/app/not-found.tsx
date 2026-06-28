import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-mono text-[120px] sm:text-[180px] leading-none font-bold text-[#1a1a1a] select-none">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-foreground -mt-4 mb-2">
        Page not found
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="default" className="px-6">
          Back to home
        </Button>
      </Link>
    </div>
  )
}
