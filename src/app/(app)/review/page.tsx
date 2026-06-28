'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { CodeEditor } from '@/components/editor/code-editor'
import { LanguageSelector } from '@/components/editor/language-selector'
import { ResultsPanel } from '@/components/review/results-panel'
import { AnalysisPipeline } from '@/components/review/analysis-pipeline'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'
import type { Language, Review } from '@/types/review'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ReviewPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<Language>('typescript')
  const [analyzing, setAnalyzing] = useState(false)
  const [review, setReview] = useState<Review | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = useRef(createClient()).current
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (review && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [review])

  const charCount = code.length

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze')
      return
    }

    if (charCount > 10000) {
      toast.error('Code exceeds 10,000 character limit')
      return
    }

    setAnalyzing(true)
    setReview(null)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('You must be signed in to analyze code')
        setAnalyzing(false)
        return
      }

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error ?? 'Analysis failed. Please try again.')
      }

      const data = await response.json()
      setReview(data.review)
      toast.success('Review saved')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      toast.error('Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }, [code, language, charCount, supabase.auth])

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col border-r border-border lg:max-w-[50%]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-[400px]">
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          <div className="p-4 border-t border-border">
            <Button
              className="w-full gap-2"
              onClick={handleAnalyze}
              disabled={analyzing || !code.trim()}
            >
              {analyzing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {analyzing ? 'Dev AI is analyzing your code...' : 'Analyze with Dev AI'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto lg:max-w-[50%]">
        {analyzing && (
          <div className="flex items-center justify-center h-full">
            <AnalysisPipeline />
          </div>
        )}

        {error && !analyzing && !review && (
          <div className="flex items-center justify-center h-full py-32 px-6">
            <div className="text-center max-w-sm">
              <p className="text-sm text-red-400 mb-2">Analysis failed</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => setError(null)}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {review && !analyzing && (
          <div ref={resultsRef} className="p-6">
            <ResultsPanel review={review} />
          </div>
        )}

        {!review && !analyzing && !error && (
          <div className="flex items-center justify-center h-full py-32 px-6">
            <div className="text-center max-w-sm">
              <Sparkles className="size-8 text-muted-text mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Paste your code in the editor and click <span className="text-accent font-medium">Analyze with Dev AI</span> to receive a structured review.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
