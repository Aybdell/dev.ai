'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types/review'
import { ReviewTable } from '@/components/dashboard/review-table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadReviews() {
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

  useEffect(() => {
    loadReviews()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-foreground">Review History</h1>
        <Link href="/review">
          <Button variant="default" size="sm">New Review</Button>
        </Link>
      </div>
      <ReviewTable reviews={reviews} loading={loading} onDelete={handleDelete} />
    </div>
  )
}
