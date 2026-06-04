import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var _mongoConn: typeof mongoose | null
  // eslint-disable-next-line no-var
  var _mongoPromise: Promise<typeof mongoose> | null
}

global._mongoConn    = global._mongoConn    ?? null
global._mongoPromise = global._mongoPromise ?? null

export async function connectDB() {
  if (global._mongoConn) return global._mongoConn

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error(
      'MONGODB_URI topilmadi! ' +
      'Loyiha papkasida .env.local fayli borligini va ' +
      'MONGODB_URI to\'g\'ri yozilganini tekshiring, ' +
      'keyin serverni qayta ishga tushiring: npm run dev'
    )
  }

  if (!global._mongoPromise) {
    global._mongoPromise = mongoose.connect(uri, {
      bufferCommands:           false,
      serverSelectionTimeoutMS: 10000,
    })
  }

  try {
    global._mongoConn = await global._mongoPromise
    console.log('✅ MongoDB connected')
    return global._mongoConn
  } catch (e) {
    global._mongoPromise = null
    throw e
  }
}
