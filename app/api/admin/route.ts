import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, isAdmin } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User, Donation, TypingResult, Setting, SupportTicket } from '@/lib/models'

function isAuthorizedAdmin(payload: ReturnType<typeof getTokenFromRequest>) {
  return Boolean(payload && isAdmin(payload))
}

function adminGuard(req: NextRequest) {
  const payload = getTokenFromRequest(req)
  if (!isAuthorizedAdmin(payload)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  return null
}

async function expireProUsers() {
  const now = new Date()
  await User.updateMany(
    { role: 'pro', proExpiresAt: { $lte: now } },
    { role: 'user', isPro: false, plan: 'free', proExpiresAt: null }
  )
}

async function getAppConfig() {
  const config = await Setting.findOne({ key: 'appConfig' })
  return config?.value as {
    cards?: {
      uzsNumber?: string
      uzsHolder?: string
      uzsBank?: string
      usdNumber?: string
      usdHolder?: string
      usdBank?: string
      holder?: string
    }
    discount?: { active?: boolean; percent?: number; expiresAt?: string | null }
  } | null
}

type AdminActionPayload = Record<string, any>

type AdminSettingsPayload = {
  cards?: {
    uzsNumber?: string
    uzsHolder?: string
    uzsBank?: string
    usdNumber?: string
    usdHolder?: string
    usdBank?: string
    holder?: string
  }
  discount?: { active?: boolean; percent?: number; expiresAt?: string | null }
}

// GET /api/admin?action=stats|users|donations
export async function GET(req: NextRequest) {
  const guard = adminGuard(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  await connectDB()

  // ---- Dashboard stats ----
  if (action === 'stats') {
    await expireProUsers()
    const [totalUsers, totalTests, donations, activeToday, activeLast7Days] = await Promise.all([
      User.countDocuments(),
      TypingResult.countDocuments(),
      Donation.find({ status: 'confirmed' }),
      User.countDocuments({ 'stats.lastActive': { $gte: new Date(Date.now() - 86400000) } }),
      User.countDocuments({ 'stats.lastActive': { $gte: new Date(Date.now() - 7 * 86400000) } }),
    ])
    
    // users active in the last 5 minutes -> considered "online now"
    const onlineUsers = await User.countDocuments({ 'stats.lastActive': { $gte: new Date(Date.now() - 5 * 60 * 1000) } })
    const totalRevenue = donations.reduce((s, d) => s + (d.currency === 'USD' ? d.amount * 12500 : d.amount), 0)
    const pendingDonations = await Donation.countDocuments({ status: 'pending' })
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 86400000) },
    })
    const config = await getAppConfig()
    const discount = config?.discount || null

    // Oxirgi 7 kunlik faol foydalanuvchilar dinamikasi
    const weeklyActiveData = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const start = d
      const end = new Date(start.getTime() + 86400000)
      const count = await User.countDocuments({
        'stats.lastActive': { $gte: start, $lt: end }
      })
      const dayName = start.toLocaleDateString('en-US', { weekday: 'short' })
      weeklyActiveData.push({ name: dayName, users: count })
    }

    return NextResponse.json({
      totalUsers,
      totalTests,
      totalRevenue,
      pendingDonations,
      activeToday,
      activeLast7Days,
      newUsersThisWeek,
      totalDonations: donations.length,
      onlineUsers,
      discount,
      weeklyActiveData,
    })
  }

  // ---- Users list ----
  if (action === 'users') {
    await expireProUsers()
    const page  = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const query = search
      ? { $or: [{ email: new RegExp(search, 'i') }, { username: new RegExp(search, 'i') }] }
      : {}
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(query),
    ])
    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) })
  }

  // ---- Donations list ----
  if (action === 'donations') {
    const status = searchParams.get('status') || 'pending'
    const donations = await Donation.find(status === 'all' ? {} : { status })
      .sort({ createdAt: -1 }).limit(50)
    return NextResponse.json({ donations })
  }

  // ---- App config ----
  if (action === 'settings') {
    const config = await getAppConfig()
    return NextResponse.json({ success: true, config })
  }

  // ---- Get all support tickets with user ban status ----
  if (action === 'support-tickets') {
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 })
    // Retrieve users to see ban status
    const ticketsWithBanStatus = await Promise.all(tickets.map(async (t) => {
      const user = await User.findOne({ email: t.email })
      return {
        _id: t._id,
        email: t.email,
        userRole: t.userRole,
        subject: t.subject,
        message: t.message,
        wordCount: t.wordCount,
        createdAt: t.createdAt,
        isBanned: user ? Boolean(user.isBanned) : false,
        userId: user ? user._id : null
      }
    }))
    return NextResponse.json({ success: true, tickets: ticketsWithBanStatus })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// POST /api/admin
export async function POST(req: NextRequest) {
  const guard = adminGuard(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  let body: AdminActionPayload = {}
  try {
    body = await req.json() as AdminActionPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    await connectDB()

    // ---- Grant PRO directly by email (most reliable method) ----
    if (action === 'grant-by-email') {
      const { email, plan: planToGrant, donationId } = body
      if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

      const planValue = (planToGrant === 'ultra' ? 'ultra' : 'basic') as string
      const now = new Date()
      const proExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      const user = await User.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { role: 'pro', isPro: true, plan: planValue, proGrantedAt: now, proExpiresAt },
        { new: true }
      )
      console.log('[GRANT-BY-EMAIL]', email, planValue, '->', user ? 'OK' : 'NOT FOUND')

      if (!user) return NextResponse.json({ error: `User not found: ${email}` }, { status: 404 })

      // Also mark donation as confirmed if provided
      if (donationId) {
        await Donation.findByIdAndUpdate(donationId, { status: 'confirmed', confirmedAt: now, proGranted: true })
      }

      return NextResponse.json({
        success: true,
        message: `${planValue.toUpperCase()} PRO → ${user.username} (${user.email}) | expires: ${proExpiresAt.toLocaleDateString()}`,
      })
    }

    // ---- Confirm donation & grant PRO/Ultra ----
    if (action === 'confirm-donation') {
      const { donationId } = body
      if (!donationId) return NextResponse.json({ error: 'donationId required' }, { status: 400 })

      const donation = await Donation.findById(donationId)
      if (!donation) return NextResponse.json({ error: 'Donation not found' }, { status: 404 })

      console.log('[CONFIRM-DONATION] donation:', {
        id: donation._id,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        userId: donation.userId,
        plan: donation.plan,
        status: donation.status,
      })

      // Update donation status
      await Donation.findByIdAndUpdate(donationId, {
        status:      'confirmed',
        confirmedAt: new Date(),
        proGranted:  true,
      })

      const planToGrant = (donation.plan as string) || 'basic'
      const now = new Date()
      const proExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const userUpdate = {
        role:         'pro',
        isPro:        true,
        plan:         planToGrant,
        proGrantedAt: now,
        proExpiresAt: proExpiresAt,
      }

      let updated = false

      // Try userId first
      if (donation.userId) {
        const result = await User.findByIdAndUpdate(donation.userId, userUpdate, { new: true })
        console.log('[CONFIRM-DONATION] userId update result:', result?.username ?? 'not found')
        if (result) updated = true
      }

      // Fallback: find by email
      if (!updated && donation.donorEmail) {
        const emailToSearch = donation.donorEmail.toLowerCase().trim()
        console.log('[CONFIRM-DONATION] searching user by email:', emailToSearch)
        const result = await User.findOneAndUpdate(
          { email: emailToSearch },
          userUpdate,
          { new: true }
        )
        console.log('[CONFIRM-DONATION] email update result:', result?.username ?? 'not found')
        if (result) updated = true
      }

      console.log('[CONFIRM-DONATION] userUpdated:', updated, 'plan:', planToGrant)

      return NextResponse.json({
        success: true,
        userUpdated: updated,
        message: `Donation confirmed — ${planToGrant.toUpperCase()} PRO ${updated ? 'granted to user' : '(user not found by email/id)'}`,
      })
    }


    // ---- Reject donation ----
    if (action === 'reject-donation') {
      await Donation.findByIdAndUpdate(body.donationId, { status: 'rejected' })
      return NextResponse.json({ success: true })
    }

    // ---- Grant PRO manually ----
    if (action === 'grant-pro') {
      const planToGrant = body.plan || 'basic'
      const now = new Date()
      const user = await User.findByIdAndUpdate(
        body.userId,
        {
          role: 'pro', isPro: true, plan: planToGrant,
          proGrantedAt: now,
          proExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
        { new: true }
      )
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      return NextResponse.json({ success: true, message: `${planToGrant.toUpperCase()} PRO granted to ${user.username}` })
    }

    // ---- Revoke PRO ----
    if (action === 'revoke-pro') {
      await User.findByIdAndUpdate(body.userId, { role: 'user', isPro: false, plan: 'free' })
      return NextResponse.json({ success: true })
    }

    // ---- Delete user ----
    if (action === 'delete-user') {
      const payload = getTokenFromRequest(req)
      if (payload && payload.userId === body.userId) {
        return NextResponse.json({ error: 'Siz o\'zingizni o\'chira olmaysiz' }, { status: 400 })
      }
      await User.findByIdAndDelete(body.userId)
      await TypingResult.deleteMany({ userId: body.userId })
      return NextResponse.json({ success: true })
    }

    // ---- Update user role ----
    if (action === 'update-role') {
      const { userId, role } = body
      if (!userId || !role) return NextResponse.json({ error: 'userId va role talab qilinadi' }, { status: 400 })
      if (!['user', 'pro', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Noto\'g\'ri rol' }, { status: 400 })
      }

      const payload = getTokenFromRequest(req)
      if (payload && payload.userId === userId) {
        return NextResponse.json({ error: 'O\'z rolingizni o\'zgartira olmaysiz' }, { status: 400 })
      }

      const user = await User.findById(userId)
      if (!user) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })

      user.role = role
      if (role === 'pro') {
        user.isPro = true
        if (user.plan === 'free') user.plan = 'basic'
        if (!user.proExpiresAt) {
          user.proGrantedAt = new Date()
          user.proExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      } else if (role === 'admin') {
        user.isPro = true
        user.plan = 'ultra'
      } else {
        user.isPro = false
        user.plan = 'free'
        user.proExpiresAt = undefined
      }

      await user.save()
      return NextResponse.json({ success: true, message: `Foydalanuvchi roli ${role} ga o'zgartirildi` })
    }

    // ---- Update app settings ----
    if (action === 'update-settings') {
      const { cards, discount } = body
      const existing = await getAppConfig()
      const nextConfig = {
        ...existing,
        cards: {
          uzsNumber: cards?.uzsNumber !== undefined ? cards.uzsNumber : (existing?.cards?.uzsNumber ?? (process.env.NEXT_PUBLIC_DONATE_CARD_UZS || '')),
          uzsHolder: cards?.uzsHolder !== undefined ? cards.uzsHolder : (existing?.cards?.uzsHolder ?? (existing?.cards?.holder ?? (process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || ''))),
          uzsBank:   cards?.uzsBank !== undefined ? cards.uzsBank : (existing?.cards?.uzsBank ?? 'Uzcard'),
          usdNumber: cards?.usdNumber !== undefined ? cards.usdNumber : (existing?.cards?.usdNumber ?? (process.env.NEXT_PUBLIC_DONATE_CARD_USD || '')),
          usdHolder: cards?.usdHolder !== undefined ? cards.usdHolder : (existing?.cards?.usdHolder ?? (existing?.cards?.holder ?? (process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || ''))),
          usdBank:   cards?.usdBank !== undefined ? cards.usdBank : (existing?.cards?.usdBank ?? 'Visa'),
          // Keep generic holder for older client versions
          holder:    cards?.holder !== undefined ? cards.holder : (existing?.cards?.holder ?? (process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || '')),
        },
        discount: {
          active:    discount?.active !== undefined ? discount.active : (existing?.discount?.active ?? false),
          percent:   discount?.percent !== undefined ? discount.percent : (existing?.discount?.percent ?? 50),
          expiresAt: discount?.expiresAt !== undefined ? discount.expiresAt : (existing?.discount?.expiresAt ?? null),
        },
      }
      await Setting.findOneAndUpdate(
        { key: 'appConfig' },
        { value: nextConfig },
        { upsert: true }
      )
      return NextResponse.json({ success: true, message: 'Settings saved.' })
    }

    // ---- Toggle manual ban for user ----
    if (action === 'toggle-ban') {
      const { email } = body
      if (!email) {
        return NextResponse.json({ error: 'Email talab qilinadi' }, { status: 400 })
      }
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
      if (adminEmail && email.toLowerCase().trim() === adminEmail) {
        return NextResponse.json({ error: 'Adminni bloklash taqiqlanadi' }, { status: 400 })
      }
      const user = await User.findOne({ email })
      if (!user) {
        return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
      }
      user.isBanned = !user.isBanned
      await user.save()
      return NextResponse.json({ success: true, isBanned: user.isBanned, message: `Foydalanuvchi ${user.isBanned ? 'bloklandi' : 'blokdan chiqarildi'}` })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (err: unknown) {
    console.error('[ADMIN POST ERROR]', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
