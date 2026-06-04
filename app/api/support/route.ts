import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, SupportTicket } from '@/lib/models'
import { verifyToken } from '@/lib/auth'

function isGibberish(text: string): boolean {
  const lower = text.toLowerCase().trim()
  
  // Pattern 1: Any character repeated 5+ times consecutively (e.g. "aaaaa")
  if (/(.)\1{4,}/.test(lower)) return true

  // Pattern 2: Keymash sequences (e.g. "asdfgh", "qwerty", "zxcvbn")
  const keymashes = ['asdfgh', 'qwerty', 'zxcvbn', 'dfghjk', 'fghjkl']
  for (const mash of keymashes) {
    if (lower.includes(mash)) return true
  }

  // Pattern 3: Words with no vowels at all (if longer than 4 chars)
  // This detects sequences of consonant-only gibberish like "qwrtypsdfg"
  const words = lower.split(/\s+/)
  for (const word of words) {
    if (word.length > 4 && !/[aeiouyаеёиоуыэюяо'‘a‘]/i.test(word)) {
      return true
    }
  }

  return false
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('tc_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Yaroqsiz token' }, { status: 401 })
    }

    let body: { subject?: string; message?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Noto\'g\'ri JSON' }, { status: 400 })
    }

    const { subject, message } = body
    if (!subject || !message) {
      return NextResponse.json({ error: 'Mavzu va xabar kiritilishi shart' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // 1. Check if user is banned
    if (user.isBanned) {
      return NextResponse.json({ error: 'Sizning hisobingiz xabar yuborishdan cheklangan.' }, { status: 403 })
    }

    // 2. Spam/bema'nilikni aniqlash
    if (isGibberish(subject) || isGibberish(message)) {
      user.isBanned = true
      await user.save()
      return NextResponse.json({ error: 'Sizning hisobingiz xabar yuborishdan cheklangan.' }, { status: 403 })
    }

    // 3. Word count validation (max 100 words)
    const cleanedMessage = message.trim()
    const words = cleanedMessage ? cleanedMessage.split(/\s+/) : []
    const wordCount = words.length
    if (wordCount > 100) {
      return NextResponse.json({ error: 'Xabaringiz 100 ta so\'zdan oshmasligi kerak!' }, { status: 400 })
    }

    // 4. Rate Limit check
    // free = 7 days, ultra = 3 days, pro/admin = 3 days
    const limitDays = (user.role === 'ultra' || user.role === 'admin' || user.role === 'pro') ? 3 : 7
    if (user.lastSupportSentAt) {
      const diffMs = Date.now() - new Date(user.lastSupportSentAt).getTime()
      const limitMs = limitDays * 24 * 60 * 60 * 1000
      
      if (diffMs < limitMs) {
        const remainingMs = limitMs - diffMs
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24))
        return NextResponse.json({
          error: `Siz har ${limitDays} kunda 1 ta xabar yubora olasiz. Qolgan vaqt: ${remainingDays} kun.`
        }, { status: 429 })
      }
    }

    // 5. Create SupportTicket
    await SupportTicket.create({
      userId: user._id,
      email: user.email,
      userRole: user.role === 'admin' ? 'admin' : user.role === 'ultra' ? 'ultra' : 'free',
      subject: subject.trim(),
      message: cleanedMessage,
      wordCount,
    })

    // 6. Update user's lastSupportSentAt
    user.lastSupportSentAt = new Date()
    await user.save()

    return NextResponse.json({ success: true, message: 'Xabaringiz yuborildi' })

  } catch (err: unknown) {
    console.error('[SUPPORT POST ERROR]', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
