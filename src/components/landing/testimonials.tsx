'use client'

import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

const testimonials = [
  {
    initials: 'SK',
    name: 'Sarah Kim',
    role: 'Senior Frontend Engineer at Vercel',
    quote: 'Dev AI caught a subtle async race condition that had been in our production code for months. The refactored version was spot-on.',
  },
  {
    initials: 'MJ',
    name: 'Marcus Johnson',
    role: 'Full-Stack Developer at Shopify',
    quote: 'I use Dev AI on every PR before requesting human reviews. It cuts our review cycle time in half and catches things we often miss.',
  },
  {
    initials: 'AL',
    name: 'Aisha Lopez',
    role: 'Independent Consultant',
    quote: 'The plain English explanations make it perfect for onboarding junior devs. They learn proper patterns without feeling overwhelmed.',
  },
]

export function Testimonials() {
  const { ref, inView } = useInView(0.1)

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <h2
          className={`text-[32px] font-semibold text-foreground text-center mb-3 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Loved by developers
        </h2>
        <p
          className={`text-base text-muted-foreground text-center max-w-xl mx-auto mb-16 transition-all duration-700 delay-100 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Hear what the community says about Dev AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                'bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 transition-all duration-200',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-violet-500/20 text-accent text-sm font-semibold flex items-center justify-center">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className="size-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
