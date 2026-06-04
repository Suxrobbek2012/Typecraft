import { NextRequest, NextResponse } from 'next/server'
import { getTextForMode } from '@/lib/texts'
import type { Language, Difficulty } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const lang       = (searchParams.get('lang')       || 'en')  as Language
  const difficulty = (searchParams.get('difficulty') || 'medium') as Difficulty
  const count      = parseInt(searchParams.get('count') || '50')
  const punct      = searchParams.get('punctuation') === 'true'
  const nums       = searchParams.get('numbers')     === 'true'

  let text = getTextForMode(lang, difficulty, count)

  if (punct) {
    text = addPunctuation(text)
  }
  if (nums) {
    text = addNumbers(text)
  }

  return NextResponse.json({ text })
}

function addPunctuation(text: string): string {
  const puncts = [',', '.', '!', '?', ';', ':']
  const words = text.split(' ')
  return words.map((w, i) => {
    if (i > 0 && i % 8 === 0) {
      const p = puncts[Math.floor(Math.random() * puncts.length)]
      return w + p
    }
    return w
  }).join(' ')
}

function addNumbers(text: string): string {
  const words = text.split(' ')
  return words.map((w, i) => {
    if (i > 0 && i % 10 === 0) {
      return String(Math.floor(Math.random() * 1000))
    }
    return w
  }).join(' ')
}
