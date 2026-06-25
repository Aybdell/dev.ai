'use client'

import dynamic from 'next/dynamic'
import type { Review } from '@/types/review'
import { ScoreRing } from '@/components/review/score-ring'
import { IssueCard } from '@/components/review/issue-card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface ReviewDetailDialogProps {
  review: Review
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tabs = [
  { value: 'bugs', label: 'Bugs' },
  { value: 'performance', label: 'Performance' },
  { value: 'security', label: 'Security' },
  { value: 'clean_code', label: 'Clean Code' },
] as const

const languageBadge: Record<string, string> = {
  javascript: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  typescript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  react: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  nextjs: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export function ReviewDetailDialog({ review, open, onOpenChange }: ReviewDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-elevated border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScoreRing score={review.score} />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">Code Review</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn('text-[10px] px-2 py-0.5 border', languageBadge[review.language] ?? '')}
                >
                  {review.language}
                </Badge>
                <span className="text-[11px] text-muted-text font-mono">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            {review.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Issues</h4>
            <Tabs defaultValue="bugs">
              <TabsList className="w-full bg-subtle border border-border">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-2 space-y-2">
                  {(review[tab.value as keyof Review] as Review['bugs']).length === 0 ? (
                    <p className="text-xs text-muted-text py-2 text-center">No issues found.</p>
                  ) : (
                    (review[tab.value as keyof Review] as Review['bugs']).map((issue, i) => (
                      <IssueCard key={i} issue={issue} />
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {review.refactored_code && (
            <div>
              <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Refactored Code</h4>
              <div className="rounded-lg overflow-hidden border border-border">
                <MonacoEditor
                  height={200}
                  language="typescript"
                  value={review.refactored_code}
                  theme="vs-dark"
                  options={{
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Explanation</h4>
            <div className="border-l-2 border-accent pl-3">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {review.explanation}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Original Code</h4>
            <div className="rounded-lg overflow-hidden border border-border">
              <MonacoEditor
                height={200}
                language="typescript"
                value={review.original_code}
                theme="vs-dark"
                options={{
                  fontSize: 12,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
