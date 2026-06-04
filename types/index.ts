// ============================================================
// TypeCraft - Shared TypeScript Types
// ============================================================

export type Theme = 'dark' | 'light'

export type Language = 'en' | 'uz' | 'ru' | 'de' | 'fr' | 'es' | 'ja' | 'zh' | 'ar' | 'tr'

export type TypingMode = 'words' | 'time' | 'quote' | 'custom' | 'code'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme'

// ----- User -----
export type Plan = 'free' | 'basic' | 'ultra'

export interface User {
  _id: string
  email: string
  username: string
  avatar?: string
  role: 'user' | 'pro' | 'admin'
  plan: Plan
  isPro: boolean
  proGrantedAt?: string
  createdAt: string
  stats: UserStats
  preferences: UserPreferences
}

export interface UserStats {
  testsCompleted: number
  averageWpm: number
  bestWpm: number
  averageAccuracy: number
  totalTimeTyped: number  // seconds
  streak: number
  lastActive: string
}

export interface UserPreferences {
  theme: Theme
  language: Language
  soundEnabled: boolean
  caretStyle: 'line' | 'block' | 'underline'
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  showLiveWpm: boolean
  showProgress: boolean
  smoothCaret: boolean
}

// ----- Typing Test -----
export interface TypingResult {
  _id?: string
  userId: string
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  errors: number
  mode: TypingMode
  duration: number   // seconds
  language: Language
  difficulty: Difficulty
  wordsTyped: number
  timestamp: string
  // per-second tracking
  wpmHistory: number[]
  errorPositions: number[]
}

export interface TestConfig {
  mode: TypingMode
  duration?: 15 | 30 | 60 | 120
  wordCount?: 10 | 25 | 50 | 100
  language: Language
  difficulty: Difficulty
  punctuation: boolean
  numbers: boolean
}

// ----- Donation -----
export type DonationStatus = 'pending' | 'confirmed' | 'rejected'

export interface Donation {
  _id: string
  donorName: string
  donorEmail?: string
  amount: number
  currency: 'UZS' | 'USD'
  plan: 'basic' | 'ultra'
  message?: string
  status: DonationStatus
  proGranted: boolean
  userId?: string
  createdAt: string
  confirmedAt?: string
  notificationSent: boolean
}

// ----- Leaderboard -----
export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar?: string
  wpm: number
  accuracy: number
  isPro: boolean
  language: Language
}

// ----- Admin -----
export interface AdminStats {
  totalUsers: number
  totalTests: number
  totalDonations: number
  totalRevenue: number
  pendingDonations: number
  activeToday: number
  newUsersThisWeek: number
}

// ----- API Response -----
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ----- Text Passage -----
export interface TextPassage {
  _id: string
  content: string
  language: Language
  difficulty: Difficulty
  source?: string
  category: 'common' | 'literature' | 'programming' | 'science' | 'custom'
  wordCount: number
  timesUsed: number
}
