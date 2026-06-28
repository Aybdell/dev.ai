'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BookOpen, ChevronRight, Folder, File, ArrowLeft, Search, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Language } from '@/types/review'

interface Repo {
  name: string
  full_name: string
  private: boolean
  language: string | null
  owner: { login: string }
}

interface FileItem {
  name: string
  path: string
  type: 'file' | 'dir'
}

interface GitHubFilePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectFile: (content: string, name: string, language: Language) => void
}

const extToLang: Record<string, Language> = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'react',
  '.jsx': 'react',
}

const allowedExts = new Set(Object.keys(extToLang))

export function GitHubFilePicker({ open, onOpenChange, onSelectFile }: GitHubFilePickerProps) {
  const [step, setStep] = useState<'repos' | 'files'>('repos')
  const [repos, setRepos] = useState<Repo[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)
  const [currentPath, setCurrentPath] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
  }

  useEffect(() => {
    if (open) {
      setStep('repos')
      setSelectedRepo(null)
      setCurrentPath('')
      setSearch('')
      setError('')
      setLoading(true)
      fetchRepos()
    }
  }, [open])

  async function fetchRepos() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/github/repos')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to load repos')
      }
      const data = await res.json()
      setRepos(data.repos ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repositories')
    } finally {
      setLoading(false)
    }
  }

  async function loadFiles(repo: Repo, path: string) {
    setCurrentPath(path)
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `/api/github/contents?owner=${repo.owner.login}&repo=${repo.name}&path=${path}`
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to load files')
      }
      const data = await res.json()
      const raw = Array.isArray(data.contents) ? data.contents : [data.contents]
      const items: FileItem[] = raw.map((item: { name: string; path: string; type: string }) => ({
        name: item.name,
        path: item.path,
        type: item.type as 'file' | 'dir',
      }))
      setFiles(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  function handleSelectRepo(repo: Repo) {
    setSelectedRepo(repo)
    setCurrentPath('')
    setStep('files')
    loadFiles(repo, '')
  }

  async function handleFileClick(item: FileItem) {
    if (item.type === 'dir') {
      if (!selectedRepo) return
      await loadFiles(selectedRepo, item.path)
      return
    }

    const ext = '.' + item.name.split('.').pop()?.toLowerCase()
    const lang = extToLang[ext]
    if (!lang) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `/api/github/file?owner=${selectedRepo!.owner.login}&repo=${selectedRepo!.name}&path=${item.path}`
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to load file')
      }
      const data = await res.json()
      onSelectFile(data.content, data.name, lang)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file')
    } finally {
      setLoading(false)
    }
  }

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const visibleFiles = files.filter((f) => {
    if (f.type === 'dir') return true
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    return allowedExts.has(ext)
  })

  const pathParts = currentPath ? currentPath.split('/') : []
  const breadcrumbs = selectedRepo
    ? [
        { label: selectedRepo.name, path: '' },
        ...pathParts.map((part, i) => ({
          label: part,
          path: pathParts.slice(0, i + 1).join('/'),
        })),
      ]
    : []

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-[#111111] border-[#2a2a2a]">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold text-[#f0f0f0] flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent" />
            Import from GitHub
          </DialogTitle>
        </DialogHeader>

        {step === 'repos' && (
          <div className="px-5 pb-5 pt-4">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#555555]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repositories..."
                className="w-full h-9 pl-8 pr-3 text-sm bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {loading && (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-[#1a1a1a] rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <AlertCircle className="size-8 text-red-400 mx-auto mb-2" />
                <p className="text-xs text-red-400 mb-3">{error}</p>
                <button
                  onClick={fetchRepos}
                  className="text-xs text-accent hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="max-h-72 overflow-y-auto space-y-1">
                {filteredRepos.length === 0 && (
                  <p className="text-xs text-[#555555] text-center py-8">
                    {search ? 'No repositories match your search' : 'No repositories found'}
                  </p>
                )}
                {filteredRepos.map((repo) => (
                  <button
                    key={repo.full_name}
                    onClick={() => handleSelectRepo(repo)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="size-[14px] text-[#555555] shrink-0" />
                      <span className="text-sm text-[#f0f0f0] truncate">{repo.name}</span>
                      {repo.private && (
                        <span className="text-[10px] text-[#555555] border border-[#2a2a2a] px-1.5 rounded font-mono shrink-0">
                          private
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {repo.language && (
                        <span className="text-[10px] font-mono text-[#888888]">{repo.language}</span>
                      )}
                      <ChevronRight className="size-3.5 text-[#555555]" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'files' && selectedRepo && (
          <div className="px-5 pb-5 pt-4">
            <button
              onClick={() => setStep('repos')}
              className="flex items-center gap-1 text-xs text-[#888888] hover:text-[#f0f0f0] mb-3 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>{selectedRepo.name}</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] font-mono text-[#555555] mb-3 flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[#3a3a3a]">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-[#888888]">{crumb.label}</span>
                  ) : (
                    <button
                      onClick={() => selectedRepo && loadFiles(selectedRepo, crumb.path)}
                      className="hover:text-[#f0f0f0] transition-colors"
                    >
                      {crumb.label}
                    </button>
                  )}
                </span>
              ))}
            </div>

            {loading && (
              <div className="space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[#1a1a1a] rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <AlertCircle className="size-8 text-red-400 mx-auto mb-2" />
                <p className="text-xs text-red-400 mb-3">{error}</p>
                <button
                  onClick={() => selectedRepo && loadFiles(selectedRepo, currentPath)}
                  className="text-xs text-accent hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="max-h-72 overflow-y-auto space-y-0.5">
                {visibleFiles.length === 0 && (
                  <p className="text-xs text-[#555555] text-center py-8">
                    No supported files found in this directory
                  </p>
                )}
                {visibleFiles.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleFileClick(item)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors',
                      'hover:bg-[#1a1a1a]'
                    )}
                  >
                    {item.type === 'dir' ? (
                      <Folder className="size-4 text-[#555555] shrink-0" />
                    ) : (
                      <File className="size-4 text-[#555555] shrink-0" />
                    )}
                    <span className="text-sm text-[#f0f0f0] truncate">{item.name}</span>
                    {item.type === 'dir' && (
                      <ChevronRight className="size-3.5 text-[#555555] ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-[#2a2a2a] px-5 py-3">
          <p className="text-xs text-[#555555] text-center">
            Only .js, .ts, .tsx, .jsx files are shown
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
