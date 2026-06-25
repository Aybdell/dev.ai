'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useInView } from '@/hooks/use-in-view'

export function CTA() {
  const { ref, inView } = useInView(0.3)

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-surface border-y border-border"
    >
      <div
        className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="text-[36px] font-bold text-foreground mb-4">
          Start writing better code today
        </h2>
        <p className="text-base text-muted-foreground mb-8">
          Join developers who use Dev AI to catch bugs early, improve code quality, and ship with confidence.
        </p>
        <Link href="/signup">
          <Button variant="default" className="px-8 py-4 text-base rounded-lg">
            Analyze your first snippet free
          </Button>
        </Link>
      </div>
    </section>
  )
}
