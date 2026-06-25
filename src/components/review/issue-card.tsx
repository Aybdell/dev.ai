'use client'

import type { ReviewIssue } from '@/types/review'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface IssueCardProps {
  issue: ReviewIssue
}

const severityColors: Record<string, string> = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-subtle border border-border">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn('text-[10px] px-1.5 py-0 border', severityColors[issue.severity])}
        >
          {issue.severity}
        </Badge>
        {issue.line != null && (
          <span className="text-[10px] font-mono text-muted-text">L{issue.line}</span>
        )}
        <span className="text-sm font-medium text-foreground">{issue.title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{issue.description}</p>
    </div>
  )
}
