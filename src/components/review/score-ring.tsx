'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScoreRingProps {
  score: number
}

function getScoreColor(score: number) {
  if (score >= 80) return 'stroke-green-500'
  if (score >= 50) return 'stroke-amber-500'
  return 'stroke-red-500'
}

function getScoreTextColor(score: number) {
  if (score >= 80) return 'text-green-500'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}

export function ScoreRing({ score }: ScoreRingProps) {
  const [offset, setOffset] = useState(283)
  const radius = 45
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setOffset(circumference * (1 - score / 100))
    })
    return () => cancelAnimationFrame(timer)
  }, [score, circumference])

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={120} height={120} className="transform -rotate-90">
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-border"
        />
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            'transition-all duration-1000 ease-out',
            getScoreColor(score)
          )}
        />
      </svg>
      <span className={cn('font-mono text-3xl font-bold -mt-24', getScoreTextColor(score))}>
        {score}
      </span>
      <span className="text-xs text-muted-text -mt-1">/ 100</span>
    </div>
  )
}
