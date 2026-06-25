'use client'

import { useState } from 'react'
import type { Review } from '@/types/review'
import { ReviewDetailDialog } from '@/components/dashboard/review-detail-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewTableProps {
  reviews: Review[]
  loading: boolean
  onDelete: (id: string) => void
}

const languageBadge: Record<string, string> = {
  javascript: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  typescript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  react: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  nextjs: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  return <span className={cn('font-mono font-bold', color)}>{score}</span>
}

export function ReviewTable({ reviews, loading, onDelete }: ReviewTableProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-subtle" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-text">No reviews yet — analyze your first snippet</p>
        <a href="/review">
          <Button variant="default">Analyze Code</Button>
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-muted-text border-b border-border">
              <th className="text-left font-medium py-3 pr-4">Date</th>
              <th className="text-left font-medium py-3 pr-4">Language</th>
              <th className="text-left font-medium py-3 pr-4">Score</th>
              <th className="text-left font-medium py-3 pr-4 hidden lg:table-cell">Summary</th>
              <th className="text-right font-medium py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-border hover:bg-subtle/50 transition-colors">
                <td className="py-3 pr-4">
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] px-2 py-0.5 border', languageBadge[review.language] ?? '')}
                  >
                    {review.language}
                  </Badge>
                </td>
                <td className="py-3 pr-4">
                  <ScoreBadge score={review.score} />
                </td>
                <td className="py-3 pr-4 hidden lg:table-cell">
                  <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
                    {review.summary.length > 80
                      ? review.summary.slice(0, 80) + '...'
                      : review.summary}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-text hover:text-red-400"
                      onClick={() => onDelete(review.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn('text-[10px] px-2 py-0.5 border', languageBadge[review.language] ?? '')}
                >
                  {review.language}
                </Badge>
                <ScoreBadge score={review.score} />
              </div>
              <span className="text-[11px] text-muted-text font-mono">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-7" onClick={() => setSelectedReview(review)}>
                <Eye className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7 text-muted-text hover:text-red-400" onClick={() => onDelete(review.id)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedReview && (
        <ReviewDetailDialog
          review={selectedReview}
          open={!!selectedReview}
          onOpenChange={(open) => { if (!open) setSelectedReview(null) }}
        />
      )}
    </>
  )
}
