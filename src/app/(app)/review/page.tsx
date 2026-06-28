'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CodeEditor } from '@/components/editor/code-editor'
import { LanguageSelector } from '@/components/editor/language-selector'
import { ResultsPanel } from '@/components/review/results-panel'
import { AnalysisPipeline } from '@/components/review/analysis-pipeline'
import { Button } from '@/components/ui/button'
import { GitHubFilePicker } from '@/components/github/github-file-picker'
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react'
import type { Language, Review } from '@/types/review'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ReviewPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<Language>('typescript')
  const [analyzing, setAnalyzing] = useState(false)
  const [review, setReview] = useState<Review | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'editor' | 'results'>('editor')
  const [githubPickerOpen, setGithubPickerOpen] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const [supabase] = useState(() => createClient())
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (review && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [review])

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('github_connections')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      setGithubConnected(!!data)
    }
    check()
  }, [supabase])

  const charCount = code.length

  function handleSelectFile(content: string, name: string, lang: Language) {
    setCode(content)
    setLanguage(lang)
    toast.success(`Loaded from GitHub: ${name}`)
  }

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze')
      return
    }

    if (charCount > 10000) {
      toast.error('Code exceeds 10,000 character limit')
      return
    }

    if (window.innerWidth < 1024) {
      setMobileView('results')
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
      <div className={`flex-1 flex-col border-r border-border lg:max-w-[50%] ${mobileView === 'results' ? 'hidden lg:flex' : 'flex'} lg:flex h-[100dvh] lg:h-full`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <LanguageSelector value={language} onChange={setLanguage} />
          <div className="flex items-center gap-3">
            {githubConnected ? (
              <button
                onClick={() => setGithubPickerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#888888] hover:text-[#f0f0f0] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg transition-colors font-mono"
              >
                <svg className="size-[13px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Import from GitHub
              </button>
            ) : (
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#555555] hover:text-[#888888] border border-[#2a2a2a] rounded-lg transition-colors font-mono"
                title="Connect GitHub in Settings to import code"
              >
                <svg className="size-[13px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Connect GitHub
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-[400px]" style={{ height: 'calc(100dvh - 160px)' }}>
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          <div className="lg:relative fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a] border-t border-[#2a2a2a] lg:border-border lg:bg-transparent z-10">
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

      <div className={`flex-1 overflow-y-auto lg:max-w-[50%] ${mobileView === 'editor' ? 'hidden lg:block' : 'block'} lg:block h-[100dvh] lg:h-full transition-opacity duration-200`}>
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-0">
          <button
            onClick={() => setMobileView('editor')}
            className="flex items-center gap-1 text-sm text-[#888888] hover:text-[#f0f0f0] transition-colors"
          >
            <ChevronLeft size={16} />
            Back to editor
          </button>
        </div>

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

      <GitHubFilePicker
        open={githubPickerOpen}
        onOpenChange={setGithubPickerOpen}
        onSelectFile={handleSelectFile}
      />
    </div>
  )
}
