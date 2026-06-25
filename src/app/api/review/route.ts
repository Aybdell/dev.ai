import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOpenAI } from '@/lib/openai'
import type { Language, ReviewIssue } from '@/types/review'

const SYSTEM_PROMPT = `You are an expert code reviewer for JavaScript, TypeScript, React, and Next.js.
Analyze the code and return structured JSON only — no markdown, no preamble.

Scoring rubric (total 100):
  Correctness / no bugs:     35 pts
  Performance / efficiency:  25 pts
  Security practices:        20 pts
  Cleanliness / best practice: 20 pts

Return ONLY this JSON schema:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "bugs": [{"line": <number>, "title": "", "description": "", "severity": "low|medium|high"}],
  "performance": [{"line": <number>, "title": "", "description": "", "severity": "low|medium|high"}],
  "security": [{"line": <number>, "title": "", "description": "", "severity": "low|medium|high"}],
  "clean_code": [{"line": <number>, "title": "", "description": "", "severity": "low|medium|high"}],
  "refactored_code": "<refactored version or empty string>",
  "explanation": "<plain-language explanation of the review>"
}

Empty array [] if no issues. Max 5 items per array.`

async function makeCompletion(code: string, language: Language): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2000,
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Language: ${language}\n\nCode:\n${code}` },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI returned empty response')
  }
  return content
}

function parseReviewResponse(content: string) {
  const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim()
  return JSON.parse(cleaned)
}

interface ReviewData {
  score: number
  summary: string
  bugs: ReviewIssue[]
  performance: ReviewIssue[]
  security: ReviewIssue[]
  clean_code: ReviewIssue[]
  refactored_code: string
  explanation: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code, language } = body as { code: string; language: Language }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (code.length > 10000) {
      return NextResponse.json({ error: 'Code exceeds 10,000 character limit' }, { status: 400 })
    }

    if (!['javascript', 'typescript', 'react', 'nextjs'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
    }

    let reviewData: ReviewData

    try {
      const content = await makeCompletion(code, language)
      reviewData = parseReviewResponse(content)
    } catch {
      try {
        const content = await makeCompletion(code, language)
        reviewData = parseReviewResponse(content)
      } catch (parseErr) {
        console.error('OpenAI parse error:', parseErr)
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
      }
    }

    const score = Math.max(0, Math.min(100, Math.round(reviewData.score ?? 0)))

    const { data: dbReview, error: dbError } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        language,
        original_code: code,
        score,
        summary: reviewData.summary ?? '',
        bugs: reviewData.bugs ?? [],
        performance: reviewData.performance ?? [],
        security: reviewData.security ?? [],
        clean_code: reviewData.clean_code ?? [],
        refactored_code: reviewData.refactored_code ?? '',
        explanation: reviewData.explanation ?? '',
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }

    return NextResponse.json({ review: dbReview })
  } catch (err) {
    console.error('Review API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
