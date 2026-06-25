'use client'

import type { Language } from '@/types/review'
import { cn } from '@/lib/utils'

const languages: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JS' },
  { value: 'typescript', label: 'TS' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
]

interface LanguageSelectorProps {
  value: Language
  onChange: (value: Language) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-0.5 bg-subtle rounded-lg p-0.5 border border-border w-fit">
      {languages.map((lang) => (
        <button
          key={lang.value}
          onClick={() => onChange(lang.value)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150',
            value === lang.value
              ? 'bg-accent text-white'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
