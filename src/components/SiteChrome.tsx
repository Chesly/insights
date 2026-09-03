"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/lib/cart/CartContext"

// The admin panel and login page have their own chrome (sidebar, footer)
// and should never show the public site's nav/footer around them. The
// invoice page is a standalone printable document for the same reason —
// the marketing header/cart/footer would print alongside it otherwise.
// /lcdkhaya is a separate branded micro-site (its own layout.tsx renders
// its own header/footer) that just happens to share this Next.js app and
// backend — it must never show the Insights header/footer either.
const HIDDEN_PREFIXES = ["/admin", "/ct-login", "/register", "/invoice", "/lcdkhaya"]

export default function SiteChrome({
  children,
  settings,
  forceHideChrome,
}: {
  children: React.ReactNode
  settings: Record<string, string>
  // Set by the root layout when proxy.ts's rewrite for lcdkhaya.co.za has
  // masked the real path from usePathname() below — see layout.tsx.
  forceHideChrome?: boolean
}) {
  const pathname = usePathname()
  const hideChrome = forceHideChrome || HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))

  if (hideChrome) {
    return <>{children}</>
  }

  return (
    <CartProvider>
      <Header settings={settings} />
      <main id="main-content">{children}</main>
      <Footer settings={settings} />
    </CartProvider>
  )
}
