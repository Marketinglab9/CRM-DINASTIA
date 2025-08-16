import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Public routes that don't require authentication
    if (pathname.startsWith('/login') || pathname === '/') {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role-based route protection
    const userRole = token.role as Role

    // Admin routes - only for ADMIN
    if (pathname.startsWith('/admin') && userRole !== Role.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Dashboard routes for ADMIN and ADVISOR
    if (pathname.startsWith('/dashboard') && userRole !== Role.ADMIN && userRole !== Role.ADVISOR) {
      return NextResponse.redirect(new URL('/client', req.url))
    }

    // Client routes - only for CLIENT
    if (pathname.startsWith('/client') && userRole !== Role.CLIENT) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // API routes protection
    if (pathname.startsWith('/api/')) {
      // Allow auth routes
      if (pathname.startsWith('/api/auth')) {
        return NextResponse.next()
      }

      // Protect all other API routes
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Admin-only API routes
      if (pathname.startsWith('/api/admin') && userRole !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Allow access to public routes
        if (pathname === '/' || pathname.startsWith('/login')) {
          return true
        }

        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
}