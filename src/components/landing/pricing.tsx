'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    desc: 'Perfect for trying Dev AI',
    features: [
      '10 reviews per month',
      'JS, TS, React, Next.js support',
      'Bug & security detection',
      'Code score (0–100)',
    ],
    cta: 'Get started free',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ month',
    desc: 'For developers who ship daily',
    features: [
      'Unlimited reviews',
      'All Free features',
      'Refactored code generation',
      'Review history & stats',
      'Priority AI processing',
    ],
    cta: 'Start Pro trial',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Team',
    price: '$39',
    period: '/ month',
    desc: 'For engineering teams',
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Shared review history',
      'Team analytics dashboard',
      'Slack integration (coming soon)',
    ],
    cta: 'Contact us',
    href: 'mailto:hello@devai.app',
    featured: false,
  },
]

export function Pricing() {
  const { ref, inView } = useInView(0.1)

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <h2
          className={`text-[32px] font-semibold text-foreground text-center mb-3 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Simple, transparent pricing
        </h2>
        <p
          className={`text-base text-muted-foreground text-center mb-16 transition-all duration-700 delay-100 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Start free. Upgrade when you need more.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={cn(
                'flex-1 flex flex-col rounded-xl p-8',
                plan.featured
                  ? 'bg-surface border-2 border-accent relative'
                  : 'bg-surface border border-border',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{
                transitionDelay: `${i * 150}ms`,
                transitionDuration: '700ms',
                boxShadow: plan.featured ? '0 0 40px #7c3aed20' : undefined,
              }}
            >
              {plan.featured && (
                <span className="self-start text-[11px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-full px-3 py-1 mb-4">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-0.5 mb-2">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-accent shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  variant={plan.featured ? 'default' : 'outline'}
                  className={cn('w-full', !plan.featured && 'border-border text-muted-foreground hover:text-foreground')}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
