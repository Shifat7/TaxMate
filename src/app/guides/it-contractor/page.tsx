import Link from "next/link"

export default function ItContractorGuidePage() {
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
            IT Contractor Deductions
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Software developers, designers, consultants, and data analysts contracting through an ABN
            face one risk that catches out more experienced contractors than beginners: the personal
            services income (PSI) rules.
          </p>

          {/* ─── Section: PSI rules ─────────────────────────────────── */}
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900">PSI rules — the one-client trap</h2>
            <p className="mt-3 text-amber-900">
              If more than <span className="font-semibold">80% of your income</span> comes from a single
              client, and your work doesn&apos;t pass the <span className="font-semibold">results test</span>{" "}
              (see below), the ATO treats your earnings as{" "}
              <span className="font-semibold">personal services income (PSI)</span>. When PSI rules
              apply, your allowable deductions are restricted to broadly what an employee doing the same
              work could claim — you lose access to some of the broader sole-trader deductions like
              certain home office occupancy costs, and income-splitting with a spouse or company
              structure is not allowed.
            </p>
            <p className="mt-3 text-amber-900">
              To avoid PSI restrictions, you need to pass one of the{" "}
              <span className="font-semibold">personal services business (PSB)</span> tests. In simple
              terms:
            </p>
            <ul className="mt-3 space-y-2 text-amber-900">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Results test:</span> you&apos;re paid to produce a
                  specific result, you supply your own tools/equipment, and you&apos;re liable to fix
                  defective work at your own cost — not just paid for hours worked.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Unrelated clients test:</span> you provide services to
                  the public or a section of the public and get work from at least two unrelated clients
                  found through advertising or similar means.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Employment test:</span> you engage other entities or
                  employees who perform at least 20% of the work by market value.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Business premises test:</span> you maintain and use
                  business premises that are physically separate from your home or your client&apos;s
                  premises, and used exclusively for your business.
                </span>
              </li>
            </ul>
            <p className="mt-3 text-amber-900">
              If you pass any one of these, you&apos;re a personal services business and the normal
              broader sole-trader deduction rules apply, even with one dominant client.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/personal-services-income"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-700 underline hover:text-lr-800"
            >
              ato.gov.au — personal services income ↗
            </a>
          </section>

          {/* ─── Section: what you can claim ────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">What you can claim</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Home office (running + maybe occupancy)</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Running expenses (fixed rate $0.70/hr or actual cost) are available to everyone.
                  Occupancy expenses (a share of rent, mortgage interest, rates) require a dedicated
                  space with the character of a place of business — see our full home office guide.
                </p>
                <Link
                  href="/guides/sole-trader-home-office"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
                >
                  Read the home office guide
                </Link>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Equipment (instant asset write-off)</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Laptops, monitors, keyboards, and similar gear under $300 are fully deductible
                  immediately. Higher-value equipment can qualify for the instant asset write-off up to
                  $20,000 per asset (2025-26) rather than being depreciated over years.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Software subscriptions</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  IDE licences, cloud hosting, design tools, SaaS subscriptions used for client work are
                  deductible in the proportion they&apos;re used for business.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Professional development</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Courses, certifications, and conferences that maintain or improve skills used in your
                  current contracting work.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Internet & phone (business %)</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Claim only the business-use percentage, supported by a representative 4-week usage
                  diary applied across the full year.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Professional memberships</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Industry body fees (e.g. professional software engineering or IT associations) related
                  to your current contracting work.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-neutral-900">Insurance</h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Professional indemnity and public liability insurance are common and fully deductible
                  business costs for contractors.
                </p>
              </div>
            </div>
          </section>

          {/* ─── Section: WFH as sole trader ────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Working from home as a sole trader</h2>
            <p className="mt-3 text-neutral-700">
              The rules for sole traders working from home differ from employees — you may be eligible
              for occupancy expenses that employees almost never get, but only if part of your home
              genuinely functions as a place of business. Getting this classification right (and the
              record-keeping behind it) matters more for contractors than for salaried staff.
            </p>
            <Link
              href="/guides/sole-trader-home-office"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              Read the full sole trader home office guide →
            </Link>
          </section>

          {/* ─── Section: vehicle ────────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Vehicle</h2>
            <p className="mt-3 text-neutral-700">
              Driving to a client&apos;s office for meetings, on-site work, or between multiple client
              sites is deductible business travel. Your{" "}
              <span className="font-semibold">ordinary commute</span> from home to a regular workplace
              is not — that distinction matters even more for contractors who sometimes work on-site and
              sometimes remotely.
            </p>
            <Link
              href="/guides/vehicle-methods"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              Compare cents-per-km vs logbook →
            </Link>
          </section>

          {/* ─── Section: records ────────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Records</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Invoices you&apos;ve issued to clients.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Contracts / statements of work — useful evidence for the PSB tests above.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>ABN quotes provided to clients before starting work.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Receipts for equipment, software, and professional development.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>A vehicle log for client-site travel.</span>
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
