import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow login page without auth
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    // If env vars not set, allow access (dev mode)
    return NextResponse.next()
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get session from cookie
  const token = request.cookies.get('sb-auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Verify token validity
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
