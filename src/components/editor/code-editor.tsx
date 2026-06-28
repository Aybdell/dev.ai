'use client'

import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Copy, Trash2, Maximize2, Minimize2 } from 'lucide-react'
import type { Language } from '@/types/review'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: Language
}

const languageMap: Record<Language, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  react: 'javascript',
  nextjs: 'typescript',
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const monacoLang = useMemo(() => languageMap[language], [language])
  const editorRef = useRef<{ getPosition: () => { lineNumber: number; column: number } | null; onDidChangeCursorPosition: (cb: (e: { position: { lineNumber: number; column: number } }) => void) => void; focus: () => void } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [wordWrap, setWordWrap] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [cursor, setCursor] = useState({ line: 1, column: 1 })

  useEffect(() => {
    const handler = () => {
      setFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handleMount = useCallback((editor: { getPosition: () => { lineNumber: number; column: number } | null; onDidChangeCursorPosition: (cb: (e: { position: { lineNumber: number; column: number } }) => void) => void; focus: () => void }) => {
    editorRef.current = editor
    const pos = editor.getPosition()
    setCursor({ line: pos?.lineNumber ?? 1, column: pos?.column ?? 1 })
    editor.onDidChangeCursorPosition((e) => {
      setCursor({ line: e.position.lineNumber, column: e.position.column })
    })
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
  }, [value])

  const handleClear = useCallback(() => {
    onChange('')
    editorRef.current?.focus()
  }, [onChange])

  const toggleWordWrap = useCallback(() => {
    setWordWrap((prev) => !prev)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }, [])

  const charCount = value.length

  return (
    <div ref={containerRef} className="relative h-full min-h-[280px] md:min-h-0 flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-[#2a2a2a] bg-[#1e1e1e] shrink-0">
        <button onClick={handleCopy} className="p-1.5 text-[#555555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded transition-colors" title="Copy">
          <Copy className="size-3.5" />
        </button>
        <button onClick={handleClear} className="p-1.5 text-[#555555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded transition-colors" title="Clear">
          <Trash2 className="size-3.5" />
        </button>
        <div className="w-px h-4 bg-[#2a2a2a] mx-1" />
        <button
          onClick={toggleWordWrap}
          className={`p-1.5 rounded transition-colors ${
            wordWrap
              ? 'text-[#f0f0f0] bg-[#1a1a1a]'
              : 'text-[#555555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]'
          }`}
          title="Toggle Word Wrap"
        >
          <span className="text-[10px] font-mono font-semibold leading-none">WW</span>
        </button>
        <div className="flex-1" />
        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-[#555555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded transition-colors"
          title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {fullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {value.length === 0 && (
          <div className="absolute inset-0 flex items-start justify-start p-4 pointer-events-none z-10">
            <span className="font-mono text-sm text-[#3a3a3a]">{'// Paste your code here'}</span>
          </div>
        )}
        <MonacoEditor
          height="100%"
          language={monacoLang}
          value={value}
          onChange={(v) => onChange(v ?? '')}
          theme="vs-dark"
          onMount={handleMount}
          options={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            fontLigatures: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            bracketPairColorization: { enabled: true },
            padding: { top: 16, bottom: 16 },
            scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: wordWrap ? 'on' : 'off',
            lineNumbers: 'on',
            renderWhitespace: 'none',
            automaticLayout: true,
          }}
          loading={
            <div className="h-full flex items-center justify-center text-muted-text text-sm">
              Loading editor...
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-3 px-3 py-1 border-t border-[#2a2a2a] bg-[#1e1e1e] shrink-0">
        <span className="font-mono text-[10px] text-[#555555]">Ln {cursor.line}, Col {cursor.column}</span>
        <span className="font-mono text-[10px] text-[#555555]">{charCount} chars</span>
        <div className="flex-1" />
        <span className="font-mono text-[10px] text-[#555555] uppercase">{language}</span>
      </div>
    </div>
  )
}
