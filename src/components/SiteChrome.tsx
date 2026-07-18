"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// The admin panel and login page have their own chrome (sidebar, footer)
// and should never show the public site's nav/footer around them.
const HIDDEN_PREFIXES = ["/admin", "/ct-login"]

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))

  if (hideChrome) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
