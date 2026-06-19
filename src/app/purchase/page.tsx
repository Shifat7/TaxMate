"use client"

import Link from "next/link"

export default function Purchase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-taxmate-100 text-4xl mb-6">⏳</span>
        <h2 className="text-3xl font-bold tracking-tight">Not available yet</h2>
        <p className="mt-2 text-neutral-500 text-lg leading-relaxed">
          The full TaxMate experience is free while this feature is being built.
          All guides and tools are accessible without a purchase.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checklist"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-taxmate-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-taxmate-700 transition shadow-lg"
          >
            Start deduction finder
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-8 py-3.5 text-base font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
