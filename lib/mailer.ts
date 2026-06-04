import nodemailer from 'nodemailer'
import type { Donation } from '@/types'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || '',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
})

// ---- Send donation notification to admin ----
export async function sendDonationAlert(donation: Donation): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (!adminEmail || !process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return

  const subject = `💛 Yangi Donat! ${donation.donorName} — ${(donation as any).plan?.toUpperCase() ?? 'PRO'} — ${donation.amount} ${donation.currency}`

  const html = `
    <div style="font-family: monospace; background: #0E0E10; color: #E8B84B; padding: 24px; border-radius: 8px; max-width: 520px;">
      <h2 style="margin: 0 0 16px; font-size: 20px;">🎉 Yangi Donat Keldi!</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #888;">Ismi:</td>
          <td style="padding: 6px 0; font-weight: bold;">${donation.donorName}</td>
        </tr>
        ${donation.donorEmail ? `
        <tr>
          <td style="padding: 6px 0; color: #888;">Email:</td>
          <td style="padding: 6px 0;">${donation.donorEmail}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 6px 0; color: #888;">Plan:</td>
          <td style="padding: 6px 0; font-weight: bold; color: #a855f7;">${((donation as any).plan ?? 'basic').toUpperCase()} PRO</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #888;">Summa:</td>
          <td style="padding: 6px 0; font-size: 18px; color: #4ADE80; font-weight: bold;">${donation.amount.toLocaleString()} ${donation.currency}</td>
        </tr>
        ${donation.message ? `
        <tr>
          <td style="padding: 6px 0; color: #888;">Xabar:</td>
          <td style="padding: 6px 0; font-style: italic;">"${donation.message}"</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 6px 0; color: #888;">Vaqt:</td>
          <td style="padding: 6px 0;">${new Date(donation.createdAt).toLocaleString('uz-UZ')}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 12px; background: #18181B; border-radius: 6px; border-left: 3px solid #E8B84B;">
        <p style="margin: 0; font-size: 13px; color: #aaa;">
          Admin panelga kiring va bu donatni tasdiqlang. Tasdiqlash orqali foydalanuvchiga PRO status beriladi.
        </p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/${process.env.ADMIN_SECRET_PATH}/donations"
         style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #E8B84B; color: #0E0E10; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Admin Panelga O'tish →
      </a>
    </div>
  `

  await transporter.sendMail({
    from: `"TypeCraft System" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject,
    html,
  })
}
