'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types/review'
import { ReviewTable } from '@/components/dashboard/review-table'
import { Button } from '@/components/ui/button'
import { Search, Download } from 'lucide-react'
import { toast } from 'sonner'

type ScoreFilter = 'all' | '80+' | '50-79' | '<50'
type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest'

const scoreFilters: { label: string; value: ScoreFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '80+', value: '80+' },
  { label: '50-79', value: '50-79' },
  { label: '<50', value: '<50' },
]

const sortOptions: { label: string; value: SortOrder }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Highest Score', value: 'highest' },
  { label: 'Lowest Score', value: 'lowest' },
]

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        toast.error('Failed to load reviews')
      } else {
        setReviews(data ?? [])
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete review')
    } else {
      setReviews((prev) => prev.filter((r) => r.id !== id))
      toast.success('Review deleted')
    }
  }

  const languages = useMemo(() => {
    const langs = new Set(reviews.map((r) => r.language))
    return ['all', ...Array.from(langs)]
  }, [reviews])

  const filteredAndSorted = useMemo(() => {
    let result = [...reviews]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((r) => r.summary.toLowerCase().includes(q))
    }

    if (languageFilter !== 'all') {
      result = result.filter((r) => r.language === languageFilter)
    }

    if (scoreFilter === '80+') result = result.filter((r) => r.score >= 80)
    else if (scoreFilter === '50-79') result = result.filter((r) => r.score >= 50 && r.score < 80)
    else if (scoreFilter === '<50') result = result.filter((r) => r.score < 50)

    if (sortOrder === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sortOrder === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    else if (sortOrder === 'highest') result.sort((a, b) => b.score - a.score)
    else if (sortOrder === 'lowest') result.sort((a, b) => a.score - b.score)

    return result
  }, [reviews, search, languageFilter, scoreFilter, sortOrder])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(reviews, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dev-ai-reviews-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Reviews exported')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-foreground">Review History</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="size-3.5" />
            Export
          </Button>
          <Link href="/review">
            <Button variant="default" size="sm">New Review</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by summary..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-surface border border-border rounded-md text-foreground placeholder-muted-text focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="h-8 px-2.5 text-xs bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang === 'all' ? 'All Languages' : lang}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-0.5 bg-surface border border-border rounded-md p-0.5">
            {scoreFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setScoreFilter(f.value)}
                className={`px-2.5 py-1 text-[11px] rounded transition-colors ${
                  scoreFilter === f.value
                    ? 'bg-accent text-white'
                    : 'text-muted-text hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="h-8 px-2.5 text-xs bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[11px] text-muted-text font-mono">{filteredAndSorted.length} reviews</p>
      </div>

      <ReviewTable reviews={filteredAndSorted} loading={loading} onDelete={handleDelete} />
    </div>
  )
}
