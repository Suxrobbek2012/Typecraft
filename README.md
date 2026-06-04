# TypeCraft ⌨️

A full-featured, production-ready typing speed test built with **Next.js 14**, **React**, **MongoDB** and **Tailwind CSS**.

## Features

- 🎹 **MonkeyType-inspired** clean typing experience
- 🌐 **10+ languages** — English, Uzbek, Russian, German, French, Spanish, Japanese, Chinese, Arabic, Turkish
- 🔐 **Auth** — Email/password + **Google OAuth**
- 🌙 **Dark / Light** theme with smooth transition
- 📊 **Real-time stats** — WPM, accuracy, consistency, per-second WPM chart
- 🏆 **Leaderboard** with PRO badges
- 💛 **Donate system** — card payment + admin notification email + PRO grant
- 🛡️ **Admin panel** (secret URL) — users, donations, settings, card management
- 🎨 **SVG animations** — particles, speed lines, flame indicators while typing
- 📈 **SEO** — sitemap, robots.txt, OpenGraph, structured data, PWA manifest
- 🔒 **Security** — JWT httpOnly cookies, CSP headers, rate limiting

---

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/you/typecraft
cd typecraft
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Google OAuth setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → **APIs & Services** → **Credentials**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
5. Copy **Client ID** and **Client Secret** to `.env.local`

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 4. MongoDB
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/typecraft
```

### 5. SMTP email
1. Use your SMTP provider (Gmail, Outlook, Mailgun, etc.)
2. Add the SMTP credentials to `.env.local`:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=your_smtp_password
ADMIN_NOTIFY_EMAIL=admin@example.com
```

### 6. Admin setup
```env
ADMIN_EMAIL=admin@typecraft.com
ADMIN_PASSWORD=StrongPassword123!
ADMIN_SECRET_PATH=your-secret-admin-path
NEXT_PUBLIC_ADMIN_PATH=your-secret-admin-path
```

The admin panel will be at: `https://yourdomain.com/your-secret-admin-path/dashboard`

### 7. Run
```bash
npm run dev        # development
npm run build      # production build
npm start          # production server
```

---

## Folder Structure

```
typecraft/
├── app/
│   ├── api/
│   │   ├── auth/           # Login, register, logout
│   │   │   └── google/     # Google OAuth + callback
│   │   ├── admin/          # Protected admin API
│   │   ├── donate/         # Donation submit + card info
│   │   └── texts/          # Random text generation
│   ├── admin/              # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── donations/
│   │   └── settings/
│   ├── auth/login/         # Auth page (login + register)
│   ├── donate/             # Donation page
│   ├── leaderboard/
│   ├── practice/
│   ├── settings/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Homepage (typing test)
│   ├── sitemap.ts          # Auto sitemap
│   └── robots.ts           # SEO robots
├── components/
│   ├── layout/             # Navbar, Footer, ThemeProvider
│   ├── typing/             # TypingEngine, TestResult
│   ├── svg/                # KeyboardSVG, HeroSVG, TypingAnimations
│   ├── DonatePage.tsx
│   └── SettingsPage.tsx
├── lib/
│   ├── auth.ts             # JWT, bcrypt, cookies
│   ├── db.ts               # MongoDB connection
│   ├── mailer.ts           # Nodemailer email alerts
│   ├── models.ts           # Mongoose schemas
│   └── texts.ts            # Multi-language text bank
├── types/index.ts          # TypeScript types
├── middleware.ts            # Route protection
├── .env.example            # Environment template
└── README.md
```

---

## Donation Flow

1. User opens `/donate` page
2. User copies card number and transfers money
3. User fills the form (name, email, amount, message)
4. Admin receives **email notification** instantly
5. Admin logs in to `/your-secret-path/donations`
6. Admin clicks **Confirm** → user gets PRO status automatically

---

## PRO Status

PRO status is granted by admin after donation confirmation. PRO users get:
- PRO badge on leaderboard
- Advanced statistics
- No test limits

---

## Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel deploy
# Add all env vars in Vercel dashboard
```

### Docker
```bash
docker build -t typecraft .
docker run -p 3000:3000 --env-file .env.local typecraft
```

---

## License
MIT
