import { NextRequest, NextResponse } from 'next/server'

// Simple Edge-compatible JWT decoder (does not verify signature in middleware)
// API routes will still verify the signature securely.
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadB64 = parts[1];
    
    let b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    
    const jsonPayload = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Read admin path dynamically from env (set at build/runtime)
  const adminPath = process.env.ADMIN_SECRET_PATH || 'admin-dashboard'

  // Protect /admin/* and /{adminPath}/*
  const isAdminRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith(`/${adminPath}`)

  if (isAdminRoute) {
    // Allow the admin login page itself
    if (
      pathname === `/${adminPath}/login` ||
      pathname === '/admin/login'
    ) {
      return NextResponse.next()
    }

    const token = req.cookies.get('tc_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL(`/${adminPath}/login`, req.url))
    }

    const payload = decodeJwt(token)
    const isAuthorizedAdmin = Boolean(payload?.role === 'admin')

    if (!isAuthorizedAdmin) {
      const res = NextResponse.redirect(new URL('/', req.url))
      res.cookies.delete('tc_token')
      return res
    }
  }

  return NextResponse.next()
}

const adminPath = process.env.ADMIN_SECRET_PATH || 'admin-dashboard'

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-dashboard/:path*',
  ],
}
