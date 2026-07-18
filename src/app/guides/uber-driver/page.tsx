import Link from "next/link"

export default function UberDriverGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lr-600 text-sm font-bold text-white">
              LR
            </span>
            <span className="text-lg font-bold text-neutral-900">LodgeReady</span>
          </Link>
          <Link
            href="/guides"
            className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-700 transition hover:border-lr-300 hover:text-lr-700"
          >
            ← All guides
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lr-200 bg-lr-50 px-3 py-1 text-xs font-semibold text-lr-700">
              Last verified: July 2026
            </span>
            <span className="text-xs font-medium text-neutral-400">2025-26 income year</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Uber / Rideshare Driver Tax Guide
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Rideshare and food delivery work looks similar day-to-day, but the tax rules — especially GST
            — are stricter than most drivers expect. Here&apos;s what actually applies.
          </p>

          {/* ─── Section: employee or sole trader ───────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">
              Are you an employee or a sole trader?
            </h2>
            <p className="mt-3 text-neutral-700">
              The ATO treats rideshare and delivery driving as{" "}
              <span className="font-semibold">sole trader (business) income</span>, not employment
              income. You&apos;re not on a payroll, no PAYG tax is withheld, and you&apos;re responsible
              for reporting your own income and paying your own tax. This is true even though the
              platform controls your fares, algorithm, and app — the ATO&apos;s test looks at the
              overall relationship, and rideshare/delivery work has consistently been classified as
              independent contracting for tax purposes.
            </p>
            <p className="mt-3 text-neutral-700">
              In practice, this means you need an ABN, you report your driving income on the business
              section of your tax return, and you can claim business deductions against it.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/your-industry/gst-and-the-sharing-economy"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — GST and the sharing economy ↗
            </a>
          </section>

          {/* ─── Section: GST trap ──────────────────────────────────── */}
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900">GST — the rideshare trap</h2>
            <p className="mt-3 text-amber-900">
              This is the single most common mistake new drivers make. For most small businesses, GST
              registration only kicks in once turnover hits $75,000. Rideshare (taxi travel, which
              includes Uber, DiDi, Ola, and similar) is different.
            </p>
            <ul className="mt-4 space-y-2 text-amber-900">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Rideshare driving:</span> you must register for and
                  charge GST from the very first dollar you earn — there is no $75,000 threshold.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Food delivery only</span> (e.g. Uber Eats, DoorDash,
                  Menulog, with no passenger rides): the normal $75,000 threshold applies.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">If you do both</span> — even a handful of passenger
                  trips alongside delivery work — the $1 rideshare rule applies to{" "}
                  <span className="font-semibold">all</span> of your driving income, not just the
                  rideshare portion.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-amber-800">
              Source: GST Act s144-5 (taxi travel, extended to ride-sourcing services by ATO guidance).
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/your-industry/gst-and-the-sharing-economy"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — sharing economy and tax ↗
            </a>
          </section>

          {/* ─── Section: what you can claim ────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">What you can claim</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Platform fees</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Service and booking fees the platform deducts from your fares are fully deductible.
                  Report your <span className="font-semibold">gross</span> income (before fees), then
                  claim the fees as a separate deduction.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Vehicle expenses</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Two methods are available. The{" "}
                  <span className="font-semibold">cents-per-km method</span> is a flat $0.88/km, capped
                  at 5,000 km/year — no logbook needed, but most drivers exceed this cap quickly. The{" "}
                  <span className="font-semibold">logbook method</span> requires a 12-week logbook to
                  establish your business-use percentage, which you then apply to all running costs
                  (fuel, insurance, rego, servicing, depreciation). Most full-time drivers do better with
                  the logbook method because business-use percentage is very high.
                </p>
                <Link
                  href="/guides/vehicle-methods"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
                >
                  Compare both methods in detail
                </Link>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Phone & internet (business %)</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Your phone is essential for the platform app and navigation, but you can only claim
                  the business-use percentage. Keep a representative 4-week diary of business vs
                  personal use and apply that percentage to the full year&apos;s bills.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Safety equipment</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Dash cams, phone mounts, first aid kits, hi-vis vests for delivery riders, and similar
                  safety gear directly related to your driving work.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Cleaning</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Car washes and interior cleaning needed to keep your vehicle presentable for
                  passengers or food deliveries are deductible as a cost of doing business.
                </p>
              </div>
            </div>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/vehicle-and-other-transport-expenses/motor-vehicle-expenses"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — motor vehicle expenses ↗
            </a>
          </section>

          {/* ─── Section: what you cannot claim ─────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">What you CANNOT claim</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Fines and infringements</span> — parking tickets,
                  speeding fines, and toll penalties are never deductible, even if incurred while
                  driving for the platform.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Your ordinary commute</span> — travel from home to
                  where you start accepting rides is generally private travel, not a business trip,
                  unless you&apos;re carrying bulky equipment or your home is a genuine base of
                  operations.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Ordinary clothing</span> — a nice shirt or jeans worn
                  while driving isn&apos;t deductible. Only genuine protective clothing (e.g. hi-vis for
                  delivery riders) qualifies.
                </span>
              </li>
            </ul>
          </section>

          {/* ─── Section: record keeping ────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Record keeping</h2>
            <p className="mt-3 text-neutral-700">
              Keep the following for at least <span className="font-semibold">5 years</span> from when
              you lodge your return:
            </p>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Platform statements showing gross fares and fees deducted (download these regularly — platforms don&apos;t keep them forever).</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>A vehicle log — use our tracker below to record trips as you go, not from memory.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Phone bills plus your business-use diary.</span>
              </li>
            </ul>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/records-you-need-to-keep"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — records you need to keep ↗
            </a>
          </section>

          {/* ─── Tool link ───────────────────────────────────────────── */}
          <div className="mt-12 rounded-2xl border border-lr-200 bg-lr-50 p-6 text-center">
            <h2 className="text-lg font-bold text-lr-800">Start tracking your trips</h2>
            <p className="mt-2 text-sm text-lr-700">
              Use the vehicle tracker to log km as you drive and get a running estimate of your claim.
            </p>
            <Link
              href="/vehicle-log"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-lr-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lr-700"
            >
              Open vehicle tracker →
            </Link>
          </div>
        </article>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
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
            or a registered tax agent before making decisions about your tax return.
          </p>
        </div>
      </footer>
    </div>
  )
}
