"use client"

import Link from "next/link"
import { USER_TYPES, type UserType } from "@/data/deductions"
import { setUserType } from "@/lib/storage"

const TOOLS = [
  {
    icon: "🏠",
    title: "WFH / Home Office Log",
    description:
      "Log the hours you work from home. We total them up and estimate your claim at the ATO fixed rate — with a CSV you can hand to your accountant.",
    href: "/wfh-log",
    cta: "Open the log",
  },
  {
    icon: "🚗",
    title: "Vehicle & KM Tracker",
    description:
      "Record trips for client visits, worksite travel, and supply runs. We estimate your cents-per-km claim and warn you before you hit the cap.",
    href: "/vehicle-log",
    cta: "Track your trips",
  },
  {
    icon: "📖",
    title: "Occupation Guides",
    description:
      "Plain-English guides for rideshare drivers, sole traders, IT contractors, and first-time ABN holders — with links back to the ATO source.",
    href: "/guides",
    cta: "Browse guides",
  },
]

const PRIVACY_POINTS = [
  {
    title: "No accounts, ever",
    description: "There's nothing to sign up for. Open the site and start logging — no email, no password.",
  },
  {
    title: "No tracking",
    description: "We don't run analytics or advertising scripts that follow you around. Your habits are your business.",
  },
  {
    title: "localStorage only",
    description: "Everything you enter is saved in your browser's local storage on your own device. Nothing is uploaded to a server.",
  },
]

export default function Home() {
  function handleUserTypeSelect(id: UserType) {
    setUserType(id)
    const toolsSection = document.getElementById("tools")
    toolsSection?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lr-600 text-sm font-bold text-white">
              LR
            </span>
            <span className="text-lg font-bold text-neutral-900">LodgeReady</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-neutral-600 sm:flex">
            <Link href="/guides" className="transition hover:text-lr-700">
              Guides
            </Link>
            <a href="#tools" className="transition hover:text-lr-700">
              Tools
            </a>
            <a href="#privacy" className="transition hover:text-lr-700">
              About
            </a>
          </div>
          <a
            href="#user-type"
            className="rounded-full bg-lr-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-lr-700"
          >
            Get started
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* ─── Hero ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-lr-200 bg-lr-50 px-4 py-1.5 text-xs font-semibold text-lr-700">
            Built for the 2025-26 Australian tax year
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
            Get lodge-ready for tax time
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            Track your work-from-home hours and vehicle km, and understand exactly what you can claim —
            whether you&apos;re a contractor, sole trader, gig worker, or employee. Free, private, and
            always on your device.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#user-type"
              className="rounded-full bg-lr-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-lr-700"
            >
              Choose your work type
            </a>
            <Link
              href="/guides"
              className="rounded-full border border-neutral-300 bg-white px-7 py-3.5 text-base font-semibold text-neutral-800 shadow-sm transition hover:border-lr-300 hover:text-lr-700"
            >
              Browse guides
            </Link>
          </div>
        </section>

        {/* ─── User Type Selector ───────────────────────────────────── */}
        <section id="user-type" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">What describes your work?</h2>
            <p className="mt-3 text-neutral-600">
              We&apos;ll tailor deduction guidance to your situation. You can change this at any time.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {USER_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleUserTypeSelect(type.id)}
                className="group flex flex-col items-start rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-lr-300 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lr-50 text-2xl transition group-hover:bg-lr-100">
                  {type.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-neutral-900">{type.label}</h3>
                <p className="mt-2 text-sm text-neutral-600">{type.description}</p>
                <p className="mt-3 text-xs font-medium text-lr-700">{type.examples}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-lr-600 transition group-hover:gap-2">
                  Select
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Tools Section ────────────────────────────────────────── */}
        <section id="tools" className="bg-lr-50/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Tools to keep you organised</h2>
              <p className="mt-3 text-neutral-600">
                Simple trackers that build the exact records the ATO asks for — no spreadsheets required.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-lr-300 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lr-50 text-2xl transition group-hover:bg-lr-100">
                    {tool.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-neutral-900">{tool.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-neutral-600">{tool.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-lr-600 transition group-hover:gap-2">
                    {tool.cta}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Privacy Section ──────────────────────────────────────── */}
        <section id="privacy" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-lr-200 bg-gradient-to-br from-lr-600 to-lr-800 px-6 py-14 text-center shadow-sm sm:px-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Your data never leaves your device</h2>
            <p className="mx-auto mt-3 max-w-xl text-lr-50">
              LodgeReady was built on a simple principle: your financial information is yours. There&apos;s
              no server to store it, no company to sell it, and no account to lose it from.
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
              {PRIVACY_POINTS.map((point) => (
                <div key={point.title} className="rounded-xl bg-white/10 p-5 backdrop-blur">
                  <h3 className="text-sm font-bold text-white">{point.title}</h3>
                  <p className="mt-2 text-sm text-lr-50">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lr-600 text-xs font-bold text-white">
                LR
              </span>
              <span className="font-bold text-neutral-900">LodgeReady</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-neutral-600">
              <Link href="/guides" className="transition hover:text-lr-700">
                Guides
              </Link>
              <Link href="/wfh-log" className="transition hover:text-lr-700">
                WFH log
              </Link>
              <Link href="/vehicle-log" className="transition hover:text-lr-700">
                Vehicle log
              </Link>
              <a
                href="https://www.ato.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-lr-700"
              >
                ato.gov.au ↗
              </a>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-neutral-500">
            LodgeReady provides general information only. It is not tax advice. Always verify with the{" "}
            <a
              href="https://www.ato.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lr-700 underline hover:text-lr-800"
            >
              ATO (ato.gov.au)
            </a>{" "}
            or a registered tax agent before making decisions about your tax return.
          </p>
          <p className="mt-4 text-xs text-neutral-400">© {new Date().getFullYear()} LodgeReady. All figures on this site are estimates.</p>
        </div>
      </footer>
    </div>
  )
}
