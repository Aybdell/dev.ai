'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Review } from '@/types/review'
import { ScoreRing } from '@/components/review/score-ring'
import { IssueCard } from '@/components/review/issue-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const DiffEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => ({ default: m.DiffEditor })),
  { ssr: false }
)

interface ResultsPanelProps {
  review: Review
}

const tabs = [
  { value: 'bugs', label: 'Bugs' },
  { value: 'performance', label: 'Performance' },
  { value: 'security', label: 'Security' },
  { value: 'clean_code', label: 'Clean Code' },
] as const

function categoryScore(count: number) {
  return Math.max(0, 100 - count * 15)
}

function scoreColor(score: number) {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function badgeColor(count: number) {
  if (count === 0) return 'bg-green-500/10 text-green-400'
  if (count <= 2) return 'bg-amber-500/10 text-amber-400'
  return 'bg-red-500/10 text-red-400'
}

export function ResultsPanel({ review }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState('bugs')
  const [renderSideBySide, setRenderSideBySide] = useState(true)

  const issueMap: Record<string, Review['bugs']> = {
    bugs: review.bugs,
    performance: review.performance,
    security: review.security,
    clean_code: review.clean_code,
  }

  const subScores = [
    { label: 'Bugs', count: review.bugs.length },
    { label: 'Performance', count: review.performance.length },
    { label: 'Security', count: review.security.length },
    { label: 'Clean Code', count: review.clean_code.length },
  ]

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col items-center gap-4 pt-4">
        <ScoreRing score={review.score} />
        <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
          {review.summary}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2">
        {subScores.map((item) => {
          const score = categoryScore(item.count)
          return (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-text uppercase">{item.label}</span>
                <span className="text-[10px] font-mono text-muted-text">{score}</span>
              </div>
              <div className="h-1 rounded-full bg-[#2a2a2a] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreColor(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Issues</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-subtle border border-border">
            {tabs.map((tab) => {
              const issues = issueMap[tab.value] ?? []
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs gap-1.5">
                  {tab.label}
                  {issues.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${badgeColor(issues.length)}`}>
                      {issues.length}
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {tabs.map((tab) => {
            const issues = issueMap[tab.value] ?? []
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-3 space-y-2">
                {issues.length === 0 ? (
                  <p className="text-xs text-muted-text py-4 text-center">No {tab.label.toLowerCase()} issues found.</p>
                ) : (
                  issues.map((issue, i) => (
                    <IssueCard key={i} issue={issue} />
                  ))
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {review.refactored_code && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Refactored Code</h3>
          <div className="flex items-center gap-1 mb-2">
            <button
              onClick={() => setRenderSideBySide(false)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                !renderSideBySide
                  ? 'bg-accent text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Unified
            </button>
            <button
              onClick={() => setRenderSideBySide(true)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                renderSideBySide
                  ? 'bg-accent text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Side by Side
            </button>
          </div>
          <div className="rounded-lg overflow-hidden border border-border">
            <DiffEditor
              original={review.original_code}
              modified={review.refactored_code}
              language="typescript"
              theme="vs-dark"
              height={350}
              options={{
                renderSideBySide,
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                readOnly: true,
                lineNumbers: 'on',
                renderWhitespace: 'none',
              }}
            />
          </div>
        </div>
      )}

      <Card className="bg-subtle border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-l-2 border-accent pl-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {review.explanation}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
