export type Language = 'javascript' | 'typescript' | 'react' | 'nextjs'

export interface ReviewIssue {
  line?: number
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface Review {
  id: string
  user_id: string
  created_at: string
  language: Language
  original_code: string
  score: number
  summary: string
  bugs: ReviewIssue[]
  performance: ReviewIssue[]
  security: ReviewIssue[]
  clean_code: ReviewIssue[]
  refactored_code: string | null
  explanation: string
}
