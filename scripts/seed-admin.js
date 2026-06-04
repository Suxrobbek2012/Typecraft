/**
 * Admin foydalanuvchi yaratish skripti
 * Ishlatish: node scripts/seed-admin.js
 */

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

// .env.local dan o'qish
const fs = require('fs')
const path = require('path')

try {
  const envPath = path.join(process.cwd(), '.env.local')
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length && !key.startsWith('#')) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  })
} catch {
  console.error('❌ .env.local fayl topilmadi! cp .env.example .env.local')
  process.exit(1)
}

const MONGODB_URI = process.env.MONGODB_URI
const EMAIL       = process.env.ADMIN_EMAIL
const PASSWORD    = process.env.ADMIN_PASSWORD

if (!MONGODB_URI) { console.error('❌ MONGODB_URI .env.local da yo\'q'); process.exit(1) }
if (!EMAIL)       { console.error('❌ ADMIN_EMAIL .env.local da yo\'q');  process.exit(1) }
if (!PASSWORD)    { console.error('❌ ADMIN_PASSWORD .env.local da yo\'q'); process.exit(1) }

async function main() {
  console.log('🔗 MongoDB ga ulanilmoqda...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Ulandi!')

  const hash = await bcrypt.hash(PASSWORD, 12)

  const result = await mongoose.connection.collection('users').findOneAndUpdate(
    { email: EMAIL },
    {
      $set: {
        email:    EMAIL,
        username: 'admin',
        password: hash,
        role:     'admin',
        isPro:    true,
        stats: {
          testsCompleted:  0,
          averageWpm:      0,
          bestWpm:         0,
          averageAccuracy: 0,
          totalTimeTyped:  0,
          streak:          0,
          lastActive:      new Date(),
        },
        preferences: {
          theme:        'dark',
          language:     'en',
          soundEnabled: true,
          caretStyle:   'line',
          fontSize:     'md',
          showLiveWpm:  true,
          showProgress: true,
          smoothCaret:  true,
        },
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true, returnDocument: 'after' }
  )

  console.log('')
  console.log('✅ Admin yaratildi!')
  console.log(`   Email:    ${EMAIL}`)
  console.log(`   Password: ${PASSWORD}`)
  console.log(`   Path:     /${process.env.ADMIN_SECRET_PATH || 'admin-dashboard'}/dashboard`)
  console.log('')
  console.log('⚠️  .env.local da ADMIN_SECRET_PATH ni o\'rnatmaganingizni tekshiring!')
  console.log('   Admin URL: http://localhost:3000/admin/dashboard')

  await mongoose.disconnect()
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Xato:', err.message)
  process.exit(1)
})
