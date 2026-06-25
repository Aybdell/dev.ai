'use client'

import { Bug, Zap, Shield, Sparkles, Code, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

const features = [
  {
    icon: Bug,
    title: 'Bug Detection',
    desc: 'Catch logic errors, null references, and async mistakes before they reach production.',
  },
  {
    icon: Zap,
    title: 'Performance Analysis',
    desc: 'Identify slow loops, memory leaks, and inefficient patterns that hurt your app\'s speed.',
  },
  {
    icon: Shield,
    title: 'Security Scanning',
    desc: 'Detect XSS vulnerabilities, insecure API calls, and exposed secrets in your codebase.',
  },
  {
    icon: Sparkles,
    title: 'Clean Code Score',
    desc: 'Get a 0–100 quality score based on readability, naming conventions, and best practices.',
  },
  {
    icon: Code,
    title: 'Refactored Code',
    desc: 'Receive a fully rewritten version of your code that follows modern patterns and standards.',
  },
  {
    icon: MessageCircle,
    title: 'Plain English Explanation',
    desc: 'Understand exactly what your code does and why changes are needed — no jargon.',
  },
]

export function Features() {
  const { ref, inView } = useInView(0.1)

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <h2
          className={`text-[32px] font-semibold text-foreground text-center mb-3 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Everything you need to write better code
        </h2>
        <p
          className={`text-base text-muted-foreground text-center max-w-xl mx-auto mb-16 transition-all duration-700 delay-100 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Dev AI gives you a complete picture of your code quality in seconds — no setup, no config.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={cn(
                  'bg-surface border border-border rounded-xl p-6 hover:border-strong transition-all duration-200',
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="size-10 rounded-lg bg-violet-500/10 text-accent flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
