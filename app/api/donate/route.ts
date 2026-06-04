import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Donation, Setting } from '@/lib/models'
import { sendDonationAlert } from '@/lib/mailer'

const PLAN_PRICES = {
  basic: { UZS: 5000,  USD: 0.39 },
  ultra: { UZS: 11000, USD: 0.89 },
}

async function getActiveDiscount() {
  const config = await Setting.findOne({ key: 'appConfig' })
  const discount = config?.value?.discount as { active?: boolean; percent?: number; expiresAt?: string } | undefined
  if (!discount?.active) return null
  if (discount.expiresAt) {
    const expiresAt = new Date(discount.expiresAt)
    if (isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) return null
  }
  return { percent: discount.percent ?? 50, expiresAt: discount.expiresAt || null }
}

// POST /api/donate — user submits donation notification
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { donorName, donorEmail, currency, message, userId, plan } = body

    if (!donorName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!plan || !['basic', 'ultra'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    const cur = (currency === 'USD' ? 'USD' : 'UZS') as 'UZS' | 'USD'
    const lockedAmount = PLAN_PRICES[plan as 'basic' | 'ultra'][cur]

    await connectDB()
    const discount = await getActiveDiscount()
    const finalAmount = discount
      ? (cur === 'UZS'
          ? Math.round(lockedAmount * (100 - discount.percent) / 100)
          : Number((lockedAmount * (100 - discount.percent) / 100).toFixed(2)))
      : lockedAmount

    const donation = await Donation.create({
      donorName: donorName.trim(),
      donorEmail: donorEmail?.trim(),
      amount: finalAmount,
      currency: cur,
      plan,
      message: message?.trim(),
      userId,
      status: 'pending',
      notificationSent: false,
    })

    // Send email alert to admin
    try {
      await sendDonationAlert({
        _id:              donation._id.toString(),
        donorName:        donation.donorName,
        donorEmail:       donation.donorEmail,
        amount:           donation.amount,
        currency:         donation.currency,
        plan:             donation.plan,
        message:          donation.message,
        status:           donation.status,
        proGranted:       donation.proGranted,
        notificationSent: donation.notificationSent,
        createdAt:        donation.createdAt.toISOString(),
      })
      await Donation.findByIdAndUpdate(donation._id, { notificationSent: true })
    } catch (mailErr) {
      console.error('[MAILER]', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Donation registered. Admin will confirm and grant PRO status.',
      donationId: donation._id,
    })

  } catch (err) {
    console.error('[DONATE]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


// GET /api/donate — get card info for display
export async function GET() {
  const config = await Setting.findOne({ key: 'appConfig' })
  const cards = config?.value?.cards as {
    uzsNumber?: string
    uzsHolder?: string
    uzsBank?: string
    usdNumber?: string
    usdHolder?: string
    usdBank?: string
    holder?: string
  } | undefined
  const discount = config?.value?.discount as { active?: boolean; percent?: number; expiresAt?: string } | undefined
  const activeDiscount = discount?.active && (!discount.expiresAt || new Date(discount.expiresAt).getTime() > Date.now())

  return NextResponse.json({
    cards: [
      {
        currency: 'UZS',
        number:   cards?.uzsNumber || process.env.NEXT_PUBLIC_DONATE_CARD_UZS || '8600 0000 0000 0000',
        holder:   cards?.uzsHolder || cards?.holder || process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || 'TypeCraft',
        bank:     cards?.uzsBank || 'Uzcard',
      },
      {
        currency: 'USD',
        number:   cards?.usdNumber || process.env.NEXT_PUBLIC_DONATE_CARD_USD || '4111 0000 0000 0000',
        holder:   cards?.usdHolder || cards?.holder || process.env.NEXT_PUBLIC_DONATE_CARD_HOLDER || 'TypeCraft',
        bank:     cards?.usdBank || 'Visa',
      },
    ],
    discount: {
      active: activeDiscount || false,
      percent: discount?.percent ?? 50,
      expiresAt: discount?.expiresAt || null,
    },
  })
}
