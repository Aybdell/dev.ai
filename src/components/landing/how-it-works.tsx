'use client'

import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

const steps = [
  {
    num: '01',
    title: 'Paste your code',
    desc: 'Drop any JavaScript, TypeScript, React, or Next.js snippet into the Monaco editor.',
  },
  {
    num: '02',
    title: 'AI analyzes instantly',
    desc: 'GPT-4o reviews your code against 4 quality dimensions: bugs, performance, security, and cleanliness.',
  },
  {
    num: '03',
    title: 'Get actionable results',
    desc: 'Receive a score, detailed issues with line numbers, a refactored version, and a plain-language explanation.',
  },
]

export function HowItWorks() {
  const { ref, inView } = useInView(0.15)

  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <h2
          className={`text-[32px] font-semibold text-foreground text-center mb-20 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          From paste to insight in seconds
        </h2>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-0">
          <div className="hidden lg:block absolute top-1/2 left-[13%] right-[13%] -translate-y-1/2 z-0 border-t border-dashed border-strong" />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={cn(
                'flex-1 flex flex-col items-center text-center relative z-10 px-6',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ transitionDelay: `${i * 200}ms`, transitionDuration: '700ms' }}
            >
              <span className="text-[32px] font-mono font-bold text-accent border-2 border-accent rounded-xl px-4 py-2 mb-6 inline-block">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
