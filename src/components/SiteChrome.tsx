"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/lib/cart/CartContext"

// The admin panel and login page have their own chrome (sidebar, footer)
// and should never show the public site's nav/footer around them. The
// invoice page is a standalone printable document for the same reason —
// the marketing header/cart/footer would print alongside it otherwise.
const HIDDEN_PREFIXES = ["/admin", "/ct-login", "/register", "/invoice"]

export default function SiteChrome({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: Record<string, string>
}) {
  const pathname = usePathname()
  const hideChrome = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))

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
