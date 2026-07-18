import Link from "next/link"

export default function SoleTraderHomeOfficeGuidePage() {
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
            Sole Trader Home Office Deductions
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Running a business from home opens up a bigger set of deductions than employees get — but
            also more ways to get it wrong. Here&apos;s the difference that matters most.
          </p>

          {/* ─── Section: employee vs sole trader ───────────────────── */}
          <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">
              Employee vs sole trader — different rules apply
            </h2>
            <p className="mt-3 text-neutral-700">
              <span className="font-semibold">Employees</span> working from home can only claim{" "}
              <span className="font-semibold">running expenses</span> — the day-to-day costs of using
              your home office (electricity, internet, phone). They almost never qualify for occupancy
              expenses, because an employee&apos;s home is not treated as a place of business even if
              they work there full-time.
            </p>
            <p className="mt-3 text-neutral-700">
              <span className="font-semibold">Sole traders</span> can potentially claim both{" "}
              <span className="font-semibold">running expenses</span> and{" "}
              <span className="font-semibold">occupancy expenses</span> — but only if part of the home
              genuinely has the character of a place of business (see below). This is the single biggest
              deduction gap between employees and the self-employed.
            </p>
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — working from home expenses ↗
            </a>
          </section>

          {/* ─── Section: running expenses ───────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Running expenses</h2>
            <p className="mt-3 text-neutral-700">
              These cover electricity, internet, phone, and cleaning attributable to your work area.
              Two ways to calculate your claim:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Fixed rate method</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  $0.70 per hour worked from home (2025-26), covering electricity, internet, phone, and
                  stationery together. You need a record of your total hours for the whole income year —
                  not an estimate or a sample of weeks.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Actual cost method</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Work out the actual business-use percentage of each expense (e.g. floor area for
                  electricity, usage logs for internet and phone) and claim that percentage of your real
                  bills. More paperwork, but can produce a larger claim.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Track your WFH hours as you go with our{" "}
              <Link href="/wfh-log" className="font-medium text-lr-600 underline hover:text-lr-700">
                WFH log tool
              </Link>
              , which builds the exact record the ATO requires.
            </p>
          </section>

          {/* ─── Section: occupancy expenses ─────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Occupancy expenses</h2>
            <p className="mt-3 text-neutral-700">
              Occupancy expenses cover the cost of <span className="font-semibold">having</span> the
              space at all — rent, mortgage interest, council rates, land tax, and home insurance.
              These are only claimable if the area of your home has the character of a{" "}
              <span className="font-semibold">&quot;place of business.&quot;</span>
            </p>
            <p className="mt-3 text-neutral-700">
              Indicators the ATO looks for include: the area is clearly identifiable as a place of
              business (e.g. a converted garage or dedicated studio), it&apos;s not readily suitable or
              adaptable for private/domestic use, it&apos;s used exclusively or almost exclusively for
              the business, and clients or customers visit regularly.
            </p>
            <p className="mt-3 text-neutral-700">
              If you qualify, use the <span className="font-semibold">floor-area method</span>: divide
              the floor area of your dedicated work space by the total floor area of your home to get a
              business-use percentage, then apply it to your occupancy costs.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/deductions/home-based-business-expenses"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — home-based business expenses ↗
            </a>
          </section>

          {/* ─── Section: when you can't claim occupancy ────────────── */}
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900">When you CAN&apos;T claim occupancy</h2>
            <p className="mt-3 text-amber-900">
              If you just work from the kitchen table, a laptop on the couch, or a spare bedroom that
              still doubles as a guest room, that space doesn&apos;t have the character of a place of
              business — it&apos;s still fundamentally domestic. In this very common situation, you can
              claim <span className="font-semibold">running expenses</span> (fixed rate or actual cost)
              but <span className="font-semibold">not occupancy expenses</span>.
            </p>
            <p className="mt-3 text-amber-900">
              There&apos;s also a capital gains tax (CGT) consequence to weigh up: claiming occupancy
              expenses on a dedicated home-business area can affect your main residence CGT exemption
              when you sell. For many sole traders working from a shared, informal space, sticking to
              running expenses only is simpler and avoids that trade-off entirely.
            </p>
          </section>

          {/* ─── Section: equipment ──────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Equipment</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Under $300:</span> desk, chair, monitor, keyboard and
                  similar items are immediately deductible in full.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Over $300:</span> depreciate the item over its
                  effective life instead of claiming it all at once.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Instant asset write-off:</span> eligible sole traders
                  can immediately deduct the full cost of eligible depreciating assets up to $20,000
                  each (2025-26), rather than depreciating them over years.
                </span>
              </li>
            </ul>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/deductions/depreciation-and-capital-expenses-and-allowances/simpler-depreciation-for-small-business/instant-asset-write-off"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — instant asset write-off ↗
            </a>
          </section>

          {/* ─── Section: records ────────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Records you need</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>A floor plan or measurements showing the size of your work area vs your whole home, if claiming occupancy or the actual cost method.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>A full-year hour log — every WFH day, not a sample. Estimates are not acceptable to the ATO.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Bills and receipts showing the actual costs of electricity, internet, phone, rent/mortgage interest, rates, and insurance.</span>
              </li>
            </ul>
          </section>

          {/* ─── Tool link ───────────────────────────────────────────── */}
          <div className="mt-12 rounded-2xl border border-lr-200 bg-lr-50 p-6 text-center">
            <h2 className="text-lg font-bold text-lr-800">Start logging your WFH hours</h2>
            <p className="mt-2 text-sm text-lr-700">
              Build the full-year record the ATO requires, and see your estimated claim update as you go.
            </p>
            <Link
              href="/wfh-log"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-lr-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lr-700"
            >
              Open WFH log →
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
