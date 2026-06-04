import mongoose, { Schema, Document, Model } from 'mongoose'

// ============================================================
// USER MODEL
// ============================================================
export interface IUser extends Document {
  email: string
  username: string
  password: string
  avatar?: string
  role: 'user' | 'pro' | 'admin' | 'free' | 'ultra'
  plan: 'free' | 'basic' | 'ultra'
  isPro: boolean
  proGrantedAt?: Date
  proExpiresAt?: Date
  isBanned?: boolean
  lastSupportSentAt?: Date
  createdAt: Date
  stats: {
    testsCompleted: number
    averageWpm: number
    bestWpm: number
    averageAccuracy: number
    totalTimeTyped: number
    streak: number
    lastActive: Date
  }
  preferences: {
    theme: string
    language: string
    soundEnabled: boolean
    caretStyle: string
    fontSize: string
    showLiveWpm: boolean
    showProgress: boolean
    smoothCaret: boolean
  }
}

const UserSchema = new Schema<IUser>(
  {
    // unique:true o'zi index yaratadi — index:true KERAK EMAS
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    username:     { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
    password:     { type: String, required: true, select: false },
    avatar:       { type: String },
    role:         { type: String, enum: ['user', 'pro', 'admin', 'free', 'ultra'], default: 'free' },
    plan:         { type: String, enum: ['free', 'basic', 'ultra'], default: 'free' },
    isPro:        { type: Boolean, default: false },
    isBanned:     { type: Boolean, default: false },
    lastSupportSentAt: { type: Date },
    proGrantedAt: { type: Date },
    proExpiresAt: { type: Date },
    stats: {
      testsCompleted:  { type: Number, default: 0 },
      averageWpm:      { type: Number, default: 0 },
      bestWpm:         { type: Number, default: 0 },
      averageAccuracy: { type: Number, default: 0 },
      totalTimeTyped:  { type: Number, default: 0 },
      streak:          { type: Number, default: 0 },
      lastActive:      { type: Date,   default: Date.now },
    },
    preferences: {
      theme:        { type: String,  default: 'dark' },
      language:     { type: String,  default: 'en' },
      soundEnabled: { type: Boolean, default: true },
      caretStyle:   { type: String,  default: 'line' },
      fontSize:     { type: String,  default: 'md' },
      showLiveWpm:  { type: Boolean, default: true },
      showProgress: { type: Boolean, default: true },
      smoothCaret:  { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

// Faqat bestWpm uchun qo'shimcha index (email/username unique orqali allaqachon bor)
UserSchema.index({ 'stats.bestWpm': -1 })

// ============================================================
// TYPING RESULT MODEL
// ============================================================
export interface ITypingResult extends Document {
  userId: mongoose.Types.ObjectId
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  correctChars: number
  totalChars: number
  mode: string
  duration: number
  language: string
  difficulty: string
  wordsTyped: number
  wpmHistory: number[]
  createdAt: Date
}

const TypingResultSchema = new Schema<ITypingResult>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wpm:          { type: Number, required: true },
    rawWpm:       { type: Number, required: true },
    accuracy:     { type: Number, required: true },
    consistency:  { type: Number, default: 0 },
    correctChars: { type: Number, default: 0 },
    totalChars:   { type: Number, default: 0 },
    mode:         { type: String, required: true },
    duration:     { type: Number, required: true },
    language:     { type: String, default: 'en' },
    difficulty:   { type: String, default: 'medium' },
    wordsTyped:   { type: Number, default: 0 },
    wpmHistory:   [{ type: Number }],
  },
  { timestamps: true }
)

TypingResultSchema.index({ userId: 1, createdAt: -1 })
TypingResultSchema.index({ wpm: -1, language: 1 })

// ============================================================
// DONATION MODEL
// ============================================================
export interface IDonation extends Document {
  donorName: string
  donorEmail?: string
  amount: number
  currency: 'UZS' | 'USD'
  plan: 'basic' | 'ultra'
  message?: string
  status: 'pending' | 'confirmed' | 'rejected'
  proGranted: boolean
  userId?: mongoose.Types.ObjectId
  notificationSent: boolean
  confirmedAt?: Date
  createdAt: Date
}

const DonationSchema = new Schema<IDonation>(
  {
    donorName:        { type: String, required: true, trim: true },
    donorEmail:       { type: String, trim: true, lowercase: true },
    amount:           { type: Number, required: true, min: 0 },
    currency:         { type: String, enum: ['UZS', 'USD'], default: 'UZS' },
    plan:             { type: String, enum: ['basic', 'ultra'], required: true },
    message:          { type: String, maxlength: 500 },
    status:           { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    proGranted:       { type: Boolean, default: false },
    userId:           { type: Schema.Types.ObjectId, ref: 'User' },
    notificationSent: { type: Boolean, default: false },
    confirmedAt:      { type: Date },
  },
  { timestamps: true }
)

DonationSchema.index({ status: 1, createdAt: -1 })

// ============================================================
// SETTINGS MODEL
// ============================================================
export interface ISetting extends Document {
  key: string
  value: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const SettingSchema = new Schema<ISetting>(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

// ============================================================
// SUPPORT TICKET MODEL
// ============================================================
export interface ISupportTicket extends Document {
  userId?: mongoose.Types.ObjectId
  email: string
  userRole: 'free' | 'ultra' | 'admin'
  subject: string
  message: string
  wordCount: number
  createdAt: Date
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User' },
    email:     { type: String, required: true, trim: true, lowercase: true },
    userRole:  { type: String, enum: ['user', 'pro', 'admin', 'free', 'ultra'], required: true },
    subject:   { type: String, required: true, trim: true },
    message:   { type: String, required: true, trim: true },
    wordCount: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// ============================================================
// Export — hot reload safe
// ============================================================
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export const TypingResult: Model<ITypingResult> =
  mongoose.models.TypingResult || mongoose.model<ITypingResult>('TypingResult', TypingResultSchema)

export const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema)

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema)
