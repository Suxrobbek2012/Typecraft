import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'

export interface JWTPayload {
  userId: string
  email: string
  role: 'user' | 'pro' | 'admin' | 'free' | 'ultra'
  iat?: number
  exp?: number
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set in .env.local')
  return secret
}

export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getTokenFromRequest(req: NextRequest): JWTPayload | null {
  const token = req.cookies.get('tc_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function isAdmin(payload: JWTPayload | null): boolean {
  return payload?.role === 'admin'
}

export function getAdminPath(): string {
  return process.env.ADMIN_SECRET_PATH || 'admin-dashboard'
}
