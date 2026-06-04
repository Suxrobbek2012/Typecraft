import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'
import { hashPassword, comparePassword, signToken, verifyToken } from '@/lib/auth'
import { authenticator } from 'otplib'

const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()

async function expireUserPro(user: any) {
  if (!user || !user.proExpiresAt) return user
  if (new Date(user.proExpiresAt).getTime() <= Date.now()) {
    await User.findByIdAndUpdate(user._id, {
      role: 'user',
      isPro: false,
      plan: 'free',
      proExpiresAt: null,
    })
    return { ...user.toObject(), role: 'user', isPro: false, plan: 'free', proExpiresAt: null }
  }
  return user
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  if (action === 'me') {
    const token = req.cookies.get('tc_token')?.value
    if (!token) return NextResponse.json({ user: null }, { status: 200 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ user: null }, { status: 200 })
    try {
      await connectDB()
      const userDoc = await User.findById(payload.userId).select('-password')
      if (!userDoc) return NextResponse.json({ user: null }, { status: 404 })
      const user = await expireUserPro(userDoc)
      return NextResponse.json({ user: { id: user._id, email: user.email, username: user.username, role: user.role, isPro: user.isPro, plan: user.plan, proGrantedAt: user.proGrantedAt, proExpiresAt: (user as any).proExpiresAt, avatar: user.avatar, stats: user.stats } })
    } catch {
      return NextResponse.json({ user: null }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  if (action === 'logout') {
    const res = NextResponse.json({ success: true })
    res.cookies.delete('tc_token')
    return res
  }

  // env tekshirishni OLIB TASHLADIK - to'g'ridan connectDB ichida xato chiqadi
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    await connectDB()

    if (action === 'register') {
      const { email, username, password } = body
      if (!email || !username || !password)
        return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 })
      if (password.length < 8)
        return NextResponse.json({ error: "Parol kamida 8 ta belgi bo'lsin" }, { status: 400 })

      const exists = await User.findOne({ $or: [{ email }, { username }] })
      if (exists)
        return NextResponse.json({ error: 'Bu email yoki username band' }, { status: 409 })

      const hashed = await hashPassword(password)
      const isConfiguredAdmin = Boolean(adminEmail && email.toLowerCase().trim() === adminEmail)
      const role = isConfiguredAdmin ? 'admin' : 'free'
      const user = await User.create({ email, username, password: hashed, role })
      const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role })

      const res = NextResponse.json({ success: true, user: { id: user._id, email: user.email, username: user.username, role: user.role, plan: user.plan } })
      res.cookies.set('tc_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
      return res
    }

    if (action === 'login') {
      const { email, password } = body
      if (!email || !password)
        return NextResponse.json({ error: 'Email va parol kiritish shart' }, { status: 400 })

      const user = await User.findOne({ email }).select('+password')
      if (!user)
        return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 })

      const valid = await comparePassword(password, user.password)
      if (!valid)
        return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 })

      // Force admin role for configured admin email
      if (adminEmail && email.toLowerCase().trim() === adminEmail && user.role !== 'admin') {
        user.role = 'admin'
        await user.save()
      }

      // If admin 2FA is enabled, require and verify an OTP code
      if (user.role === 'admin' && process.env.ADMIN_2FA_ENABLED === 'true') {
        const code = (body as any).code || ''
        const secret = process.env.ADMIN_2FA_SECRET || ''
        if (!code) return NextResponse.json({ error: '2FA code required' }, { status: 401 })
        try {
          const ok = authenticator.verify({ token: String(code), secret })
          if (!ok) return NextResponse.json({ error: '2FA code invalid' }, { status: 401 })
        } catch (e) {
          return NextResponse.json({ error: '2FA verification error' }, { status: 500 })
        }
      }

      await expireUserPro(user)
      await User.findByIdAndUpdate(user._id, { 'stats.lastActive': new Date() })
      const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role })

      const res = NextResponse.json({ success: true, user: { id: user._id, email: user.email, username: user.username, role: user.role, isPro: user.isPro, plan: user.plan } })
      res.cookies.set('tc_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
      return res
    }

    return NextResponse.json({ error: "Noto'g'ri action" }, { status: 400 })

  } catch (err: unknown) {
    console.error('[AUTH ERROR]', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
