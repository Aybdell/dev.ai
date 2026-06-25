'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Review } from '@/types/review'
import { ScoreRing } from '@/components/review/score-ring'
import { IssueCard } from '@/components/review/issue-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface ResultsPanelProps {
  review: Review
}

const tabs = [
  { value: 'bugs', label: 'Bugs' },
  { value: 'performance', label: 'Performance' },
  { value: 'security', label: 'Security' },
  { value: 'clean_code', label: 'Clean Code' },
] as const

export function ResultsPanel({ review }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState('bugs')

  const issueMap: Record<string, Review['bugs']> = {
    bugs: review.bugs,
    performance: review.performance,
    security: review.security,
    clean_code: review.clean_code,
  }

  const currentIssues = issueMap[activeTab] ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 pt-4">
        <ScoreRing score={review.score} />
        <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
          {review.summary}
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Issues</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-subtle border border-border">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-3 space-y-2">
              {currentIssues.length === 0 ? (
                <p className="text-xs text-muted-text py-4 text-center">No {tab.label.toLowerCase()} issues found.</p>
              ) : (
                currentIssues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {review.refactored_code && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Refactored Code</h3>
          <div className="rounded-lg overflow-hidden border border-border">
            <MonacoEditor
              height={250}
              language="typescript"
              value={review.refactored_code}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                readOnly: true,
                lineNumbers: 'on',
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
