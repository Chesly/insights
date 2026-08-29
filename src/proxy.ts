import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Once lcdkhaya.co.za is pointed at this deployment, requests arrive with
// a clean pathname ("/", "/about", ...) — rewrite them under /lcdkhaya so
// the existing route group serves them, keeping the custom domain's URL
// bar clean instead of redirecting to /lcdkhaya/*.
const LCDKHAYA_HOSTS = ['lcdkhaya.co.za', 'www.lcdkhaya.co.za']

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  if (
    LCDKHAYA_HOSTS.includes(hostname) &&
    !pathname.startsWith('/lcdkhaya') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `/lcdkhaya${pathname}`
    return NextResponse.rewrite(url)
  }

  // Everything below only matters for /admin/* — skip the Supabase round
  // trip entirely for every other request now that the matcher below runs
  // on (almost) every path rather than just /admin/:path*.
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/ct-login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Broadened from '/admin/:path*' so the lcdkhaya.co.za host rewrite
  // above can run on every path — the admin auth check itself still only
  // executes for /admin/* (see the early return above).
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
