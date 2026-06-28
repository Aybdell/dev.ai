'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useInView } from '@/hooks/use-in-view'

const words = ['JavaScript', 'TypeScript', 'React', 'Next.js']

export function Hero() {
  const { ref, inView } = useInView(0.3)
  const [wordIndex, setWordIndex] = useState(0)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFadeState('out')
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length)
        setFadeState('in')
      }, 300)
    }, 2500)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 py-32 flex flex-col items-center text-center">
        <div
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs px-3 py-1 rounded-full font-mono mb-8">
            ✦ AI-Powered Code Reviews
          </div>

          <h1 className="text-foreground font-bold leading-[1.1] tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            Write better <span className="text-accent">code</span>.<br />
            Ship with{' '}
            <span className="text-accent">confidence.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
            Dev AI reviews your{' '}
            <span
              className="text-accent font-semibold inline-block min-w-[9ch]"
              style={{
                animation: `fadeCycle${fadeState === 'in' ? 'In' : 'Out'} 0.3s ease-out`,
              }}
            >
              {words[wordIndex]}
            </span>{' '}
            code instantly. Get a quality score, bug detection, security checks,
            and a refactored version — powered by GPT-4o.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup">
              <Button
                variant="default"
                className="px-6 py-3 text-[15px] rounded-lg transition-all duration-150 hover:scale-[1.02] hover:animate-pulse-violet"
              >
                Start reviewing for free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                className="px-6 py-3 text-[15px] rounded-lg border-strong text-muted-foreground hover:text-foreground hover:border-foreground"
              >
                See how it works
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-text font-mono mt-6">
            No credit card required · Powered by GPT-4o · Free to start
          </p>

          <p className="text-xs text-muted-text mt-8">
            Trusted by 1,200+ developers
          </p>
        </div>
      </div>
    </section>
  )
}
