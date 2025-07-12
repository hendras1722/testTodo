import { NextRequest, NextResponse } from 'next/server'
import { defaultConfig } from '@/configs/config_security'
// import { SecurityConfig } from "@/type/config_security";

// config: SecurityConfig
function setSecurityHeaders(response: NextResponse) {
  // const { headers } = response

  // if (config.hideHeaderPoweredBy) {
  //   headers.delete('x-powered-by')
  // }

  // if (config.xssProtection) {
  //   headers.set('X-XSS-Protection', '1; mode=block')
  // }

  // if (config.contentTypeOptions) {
  //   headers.set('X-Content-Type-Options', 'nosniff')
  // }

  // if (config.frameguard) {
  //   const { action, domain } = config.frameguard
  //   let value = action as string
  //   if (action === 'ALLOW-FROM' && domain) {
  //     value = `ALLOW-FROM ${domain}`
  //   }
  //   headers.set('X-Frame-Options', value)
  // }

  // if (config.contentSecurityPolicy) {
  //   headers.set(
  //     'Content-Security-Policy',
  //     "default-src 'self'; " +
  //       "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  //       "style-src 'self' 'unsafe-inline'; " +
  //       "img-src 'self' data: https:; " +
  //       "font-src 'self';"
  //   )
  // }

  return response
}

// The middleware function
export async function middleware(request: NextRequest) {
  const config = defaultConfig
  const response = NextResponse.next()
  const url = new URL(request.url)

  const token = request.cookies.get('token')
  const { pathname } = new URL(request.url)

  const isProtectedRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/login'
  const home = pathname === '/'

  // Add response headers to prevent caching
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '-1')

  // Host validation
  if (config.allowedHosts?.length) {
    const host = request.headers.get('host')
    if (host && !config.allowedHosts.includes(host)) {
      return new NextResponse('Invalid Host header', { status: 400 })
    }
  }

  // Force SSL in production
  if (config.ssl && url.protocol === 'http:') {
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }
  if (token) {
    if (token.value && isLoginPage && !isProtectedRoute) {
      const redirectUrl = new URL(request.url).searchParams.get('redirect')
      const targetUrl = redirectUrl ?? '/admin/notes'
      const absoluteUrl = new URL(targetUrl, request.url)
      return NextResponse.redirect(absoluteUrl)
    }
    if (token.value && isLoginPage && home) {
      const redirectUrl = new URL(request.url).searchParams.get('redirect')
      const targetUrl = redirectUrl ?? '/admin/notes'
      const absoluteUrl = new URL(targetUrl, request.url)
      return NextResponse.redirect(absoluteUrl)
    }
  } else {
    if (isProtectedRoute && !isLoginPage) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('token', '', { maxAge: 0 })
      return response
    }
  }

  return setSecurityHeaders(response)
}

// Matcher configuration
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
