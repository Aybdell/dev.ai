'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
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

  return (
    <MonacoEditor
      height="calc(100vh - 220px)"
      language={monacoLang}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      theme="vs-dark"
      options={{
        fontSize: 13,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        padding: { top: 12 },
        lineNumbers: 'on',
        renderWhitespace: 'none',
        automaticLayout: true,
      }}
      loading={
        <div className="h-[400px] flex items-center justify-center text-muted-text text-sm">
          Loading editor...
        </div>
      }
    />
  )
}
