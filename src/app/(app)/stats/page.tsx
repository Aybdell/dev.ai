'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types/review'
import { ScoreChart } from '@/components/stats/score-chart'
import { LanguagePie } from '@/components/stats/language-pie'
import { IssueBarChart } from '@/components/stats/issue-bar-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface StatsData {
  totalReviews: number
  averageScore: number
  bestScore: number
  reviewsThisMonth: number
  scoreOverTime: { date: string; score: number }[]
  languageData: { name: string; value: number }[]
  issueData: { name: string; avg: number }[]
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (error) {
        toast.error('Failed to load stats')
        setLoading(false)
        return
      }

      const reviews = (data ?? []) as Review[]
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const totalReviews = reviews.length
      const bestScore = reviews.length > 0 ? Math.max(...reviews.map((r) => r.score)) : 0
      const averageScore = reviews.length > 0
        ? Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length)
        : 0
      const reviewsThisMonth = reviews.filter((r) => new Date(r.created_at) >= monthStart).length

      const last30Days = reviews
        .filter((r) => new Date(r.created_at) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((r) => ({
          date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: r.score,
        }))

      const langCount: Record<string, number> = {}
      reviews.forEach((r) => {
        langCount[r.language] = (langCount[r.language] ?? 0) + 1
      })
      const languageData = Object.entries(langCount).map(([name, value]) => ({ name, value }))

      const totalBugs = reviews.reduce((s, r) => s + (r.bugs?.length ?? 0), 0)
      const totalPerf = reviews.reduce((s, r) => s + (r.performance?.length ?? 0), 0)
      const totalSec = reviews.reduce((s, r) => s + (r.security?.length ?? 0), 0)
      const totalClean = reviews.reduce((s, r) => s + (r.clean_code?.length ?? 0), 0)
      const count = reviews.length || 1
      const issueData = [
        { name: 'Bugs', avg: Math.round((totalBugs / count) * 10) / 10 },
        { name: 'Performance', avg: Math.round((totalPerf / count) * 10) / 10 },
        { name: 'Security', avg: Math.round((totalSec / count) * 10) / 10 },
        { name: 'Clean Code', avg: Math.round((totalClean / count) * 10) / 10 },
      ]

      setStats({
        totalReviews,
        averageScore,
        bestScore,
        reviewsThisMonth,
        scoreOverTime: last30Days,
        languageData,
        issueData,
      })
      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-lg font-semibold text-foreground">Stats</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-subtle" />
          ))}
        </div>
        <Skeleton className="h-64 bg-subtle" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Stats</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-surface border-border">
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-muted-text font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono text-foreground">{stats.totalReviews}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-muted-text font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono text-accent">{stats.averageScore}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-muted-text font-medium">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono text-green-500">{stats.bestScore}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-muted-text font-medium">Reviews This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono text-foreground">{stats.reviewsThisMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreChart data={stats.scoreOverTime} />
        <LanguagePie data={stats.languageData} />
      </div>

      <IssueBarChart data={stats.issueData} />
    </div>
  )
}
