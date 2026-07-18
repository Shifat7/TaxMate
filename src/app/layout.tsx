import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "LodgeReady — Get lodge-ready for tax time",
  description:
    "A free, privacy-first expense tracker and deduction guide for Australian contractors, sole traders, gig workers, and employees. Track work-from-home hours and vehicle km, and understand what you can claim — all data stays on your device.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen bg-gradient-to-b from-lr-50 via-white to-lr-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  )
}
