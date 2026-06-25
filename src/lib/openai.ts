import OpenAI from 'openai'

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY ?? ''
  const isOpenRouter = apiKey.startsWith('sk-or-v1')

  return new OpenAI({
    apiKey,
    baseURL: isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined,
    defaultHeaders: isOpenRouter
      ? {
          'HTTP-Referer': 'https://devaiapp.vercel.app',
          'X-Title': 'Dev AI',
        }
      : undefined,
  })
}
