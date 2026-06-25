import type { Metadata } from 'next'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { DemoPreview } from '@/components/landing/demo-preview'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'Dev AI — AI-Powered Code Reviews',
  description:
    'Instant AI code reviews for JavaScript, TypeScript, React, and Next.js. Catch bugs, improve performance, and ship better code.',
  openGraph: {
    title: 'Dev AI — AI-Powered Code Reviews',
    description: 'Catch bugs, improve performance, ship better code.',
    url: 'https://devai.app',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] scroll-smooth">
      <Navbar />
      <Hero />
      <DemoPreview />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
