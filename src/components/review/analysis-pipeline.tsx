'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, Circle } from 'lucide-react'

const STEPS = [
  'Reading source code...',
  'Detecting language...',
  'Running security scan...',
  'Analyzing performance...',
  'Detecting bugs...',
  'Reviewing code quality...',
  'Generating refactored code...',
  'Finalizing report...',
]

type StepState = 'pending' | 'active' | 'done'

export function AnalysisPipeline() {
  const [stepStates, setStepStates] = useState<StepState[]>(
    STEPS.map((_, i) => (i === 0 ? 'active' : 'pending'))
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= STEPS.length - 1) return

    const timer = setTimeout(() => {
      const nextIndex = activeIndex + 1
      setStepStates((prev) => {
        const next = [...prev]
        next[activeIndex] = 'done'
        next[nextIndex] = 'active'
        return next
      })
      setActiveIndex(nextIndex)
    }, 400)

    return () => clearTimeout(timer)
  }, [activeIndex])

  return (
    <div className="flex flex-col gap-1 py-8 px-6 max-w-sm mx-auto animate-fade-in-up">
      {STEPS.map((step, i) => {
        const state = stepStates[i]
        return (
          <div
            key={step}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
              state === 'active' ? 'bg-[#1a1a1a]' : ''
            }`}
          >
            {state === 'pending' && <Circle className="size-4 text-[#3a3a3a] shrink-0" />}
            {state === 'active' && (
              <Loader2 className="size-4 text-[#888888] animate-spin shrink-0" />
            )}
            {state === 'done' && (
              <CheckCircle2 className="size-4 text-[#10b981] shrink-0" />
            )}
            <span
              className={`text-sm font-mono transition-colors duration-300 ${
                state === 'pending'
                  ? 'text-[#3a3a3a]'
                  : state === 'active'
                    ? 'text-[#888888]'
                    : 'text-[#10b981]'
              }`}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
