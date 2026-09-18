import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Public alias for the admin login page. '/ct-login' itself stays wired
// up everywhere internally (redirects, links) — this just gives staff a
// second, less-guessable URL to actually use and share, so a leaked path
// isn't automatically guessable across every other Chesly-built site too.
// Rename this in one place if it ever needs to change (keep the matcher
// entry below in sync — Next needs a literal there, not a variable).
const LOGIN_ALIAS = '/growth-desk'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === LOGIN_ALIAS) {
    return NextResponse.rewrite(new URL('/ct-login', request.url))
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
  matcher: ['/admin/:path*', '/growth-desk'],
}
