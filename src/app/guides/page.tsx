import Link from "next/link"

const GUIDES = [
  {
    icon: "🚗",
    title: "Uber / Rideshare Driver Tax Guide",
    description:
      "GST from dollar one, what platform fees and vehicle costs you can claim, and the records the ATO expects from rideshare and delivery drivers.",
    href: "/guides/uber-driver",
  },
  {
    icon: "🏠",
    title: "Sole Trader Home Office Deductions",
    description:
      "The difference between running expenses and occupancy expenses, when your home office counts as a \"place of business,\" and how to measure your claim.",
    href: "/guides/sole-trader-home-office",
  },
  {
    icon: "🧾",
    title: "Your First ABN Tax Return",
    description:
      "Do you actually need an ABN, what income to report, GST registration, PAYG instalments, and setting aside enough tax as you go.",
    href: "/guides/first-abn-return",
  },
  {
    icon: "🖥️",
    title: "IT Contractor Deductions",
    description:
      "The personal services income (PSI) one-client trap, what equipment and software you can claim, and vehicle rules for client visits.",
    href: "/guides/it-contractor",
  },
  {
    icon: "🛣️",
    title: "Vehicle: Logbook vs Cents-per-KM",
    description:
      "A side-by-side comparison of the two vehicle deduction methods, a worked example, and how to work out which one saves you more.",
    href: "/guides/vehicle-methods",
  },
]

export default function GuidesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lr-600 text-sm font-bold text-white">
              LR
            </span>
            <span className="text-lg font-bold text-neutral-900">LodgeReady</span>
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="hidden text-sm font-semibold text-neutral-500 sm:block">Guides</h1>
            <Link
              href="/"
              className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-700 transition hover:border-lr-300 hover:text-lr-700"
            >
              ← Home
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-neutral-900">Occupation Guides</h1>
            <p className="mt-2 max-w-2xl text-neutral-600">
              Plain-English guides written for specific work types, with links back to the ATO source for
              every claim. Each guide is verified against the 2025-26 income year rules.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-lr-300 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lr-50 text-2xl transition group-hover:bg-lr-100">
                  {guide.icon}
                </span>
                <h2 className="mt-4 text-lg font-bold text-neutral-900">{guide.title}</h2>
                <p className="mt-2 flex-1 text-sm text-neutral-600">{guide.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-lr-600 transition group-hover:gap-2">
                  Read guide
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <p className="max-w-3xl text-xs leading-relaxed text-neutral-500">
            LodgeReady provides general information only. It is not tax advice. Always verify with the{" "}
            <a
              href="https://www.ato.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lr-700 underline hover:text-lr-800"
            >
              ATO (ato.gov.au)
            </a>{" "}
            or a registered tax agent.
          </p>
        </div>
      </footer>
    </div>
  )
}
