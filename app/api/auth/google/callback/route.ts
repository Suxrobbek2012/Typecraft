import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'
import { signToken } from '@/lib/auth'

const APP_URL      = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const REDIRECT_URI = `${APP_URL}/api/auth/google/callback`

interface GoogleUser {
  sub: string
  email: string
  name: string
  picture: string
  email_verified: boolean
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${APP_URL}/auth/login?error=google_cancelled`)
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('[GOOGLE] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local')
    return NextResponse.redirect(`${APP_URL}/auth/login?error=server_error`)
  }

  try {
    // 1. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  REDIRECT_URI,
        grant_type:    'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      console.error('[GOOGLE] Token exchange failed:', tokens)
      return NextResponse.redirect(`${APP_URL}/auth/login?error=token_failed`)
    }

    // 2. Get Google user info
    const userRes  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const gUser: GoogleUser = await userRes.json()

    if (!gUser.email_verified) {
      return NextResponse.redirect(`${APP_URL}/auth/login?error=email_not_verified`)
    }

    // 3. Upsert user
    await connectDB()
    let user = await User.findOne({ email: gUser.email })

    if (!user) {
      const base = gUser.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) || 'user'
      let username = base
      let suffix   = 1
      while (await User.findOne({ username })) username = `${base}${suffix++}`

      user = await User.create({
        email:    gUser.email,
        username,
        password: `google_${gUser.sub}_${Date.now()}`,
        avatar:   gUser.picture,
        role:     'user',
      })
    } else if (gUser.picture && user.avatar !== gUser.picture) {
      await User.findByIdAndUpdate(user._id, { avatar: gUser.picture })
    }

    // 4. JWT cookie
    const jwt = signToken({ userId: user._id.toString(), email: user.email, role: user.role })
    const redirectTo = user.role === 'admin'
      ? `/${process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'}/dashboard`
      : '/profile'

    const res = NextResponse.redirect(`${APP_URL}${redirectTo}`)
    res.cookies.set('tc_token', jwt, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     '/',
    })
    return res

  } catch (err) {
    console.error('[GOOGLE_OAUTH]', err)
    return NextResponse.redirect(`${APP_URL}/auth/login?error=server_error`)
  }
}
