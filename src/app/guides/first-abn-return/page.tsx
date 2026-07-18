import Link from "next/link"

export default function FirstAbnReturnGuidePage() {
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
            Your First ABN Tax Return
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Getting an ABN feels like the easy part. The tax obligations that come with it — GST, PAYG
            instalments, and setting money aside — catch most first-timers off guard. Here&apos;s what
            to expect.
          </p>

          {/* ─── Section: do you need an ABN ─────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Do you need an ABN?</h2>
            <p className="mt-3 text-neutral-700">
              You need an ABN if you&apos;re <span className="font-semibold">carrying on a business</span> —
              acting with a genuine intention to make a profit on a regular or repeated basis, not just
              a one-off sale of personal items. Freelancing, subcontracting, consulting, and most gig
              platform work all count.
            </p>
            <p className="mt-3 text-neutral-700">
              You generally <span className="font-semibold">don&apos;t</span> need one for a genuine
              hobby, occasional one-off jobs with no ongoing intention to trade, or income that&apos;s
              really employment (see below) — in which case your employer, not you, handles PAYG
              withholding.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/starting-registering-or-closing-a-business/do-you-need-an-abn"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — do you need an ABN? ↗
            </a>
          </section>

          {/* ─── Section: employee vs contractor ─────────────────────── */}
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900">Employee vs contractor</h2>
            <p className="mt-3 text-amber-900">
              Some businesses ask workers to get an ABN and invoice as a &quot;contractor&quot; when the
              actual working relationship looks like employment — set hours, one client, tools supplied
              by the business, no real ability to subcontract the work out. This is called{" "}
              <span className="font-semibold">sham contracting</span>, and it&apos;s illegal — it shifts
              tax, super, and leave obligations onto the worker that should sit with the employer.
            </p>
            <p className="mt-3 text-amber-900">
              Fair Work Act reforms effective from late 2024 introduced a clearer, whole-of-relationship
              test for distinguishing employees from contractors, along with tougher sham contracting
              penalties. If your working arrangement looks like employment in substance, it may be worth
              checking your status before assuming ABN income is automatically correct.
            </p>
            <a
              href="https://www.fairwork.gov.au/find-help-for/independent-contractors"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-700 underline hover:text-lr-800"
            >
              fairwork.gov.au — independent contractors ↗
            </a>
          </section>

          {/* ─── Section: income to report ───────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">What income to report</h2>
            <p className="mt-3 text-neutral-700">
              All income earned under your ABN is <span className="font-semibold">assessable income</span> —
              it must be reported, and there&apos;s no informal tax-free threshold for cash or platform
              work. Report your income{" "}
              <span className="font-semibold">gross</span> (the full amount before any platform or
              processing fees are deducted), then claim those fees separately as a business deduction.
              Reporting only the net amount you received understates your income and overstates your
              deductions in a way the ATO&apos;s data-matching will usually catch.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/income-and-expenses-for-business"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — income and expenses for business ↗
            </a>
          </section>

          {/* ─── Section: GST ────────────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">GST — do you need to register?</h2>
            <p className="mt-3 text-neutral-700">
              You must register for GST once your GST turnover reaches{" "}
              <span className="font-semibold">$75,000</span> in a 12-month period, or when you expect it
              to. Below that, registration is optional.
            </p>
            <p className="mt-3 text-neutral-700">
              The big exception: <span className="font-semibold">rideshare and taxi-style driving</span>{" "}
              must register for GST from $1 of income — there is no threshold. See our{" "}
              <Link href="/guides/uber-driver" className="font-medium text-lr-600 underline hover:text-lr-700">
                rideshare driver guide
              </Link>{" "}
              for the full detail.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — registering for GST ↗
            </a>
          </section>

          {/* ─── Section: PAYG instalments ──────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">PAYG instalments</h2>
            <p className="mt-3 text-neutral-700">
              PAYG instalments are the ATO&apos;s way of collecting tax on your business income
              throughout the year, instead of one lump sum at tax time. You&apos;re generally brought
              into the system automatically after you lodge your first return showing business income
              above a set threshold — the ATO then asks you to pay quarterly instalments toward{" "}
              <span className="font-semibold">next</span> year&apos;s tax bill.
            </p>
            <p className="mt-3 text-neutral-700">
              This creates a well-known <span className="font-semibold">first-year cash-flow shock</span>:
              in year one you pay your full tax bill for that year at tax time, and shortly after you
              may also be asked to start prepaying instalments for the following year — effectively two
              years of tax obligations landing close together. Budget for this in advance rather than
              being surprised by it.
            </p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/paying-tax-instalments/how-to-work-out-your-instalment"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — PAYG instalments ↗
            </a>
          </section>

          {/* ─── Section: setting aside tax ──────────────────────────── */}
          <section className="mt-10 rounded-2xl border border-lr-200 bg-lr-50 p-6">
            <h2 className="text-xl font-bold text-lr-800">Setting aside tax money</h2>
            <p className="mt-3 text-lr-800">
              A simple rule of thumb: set aside{" "}
              <span className="font-semibold">25–30% of your net profit</span> (income after
              deductions) into a separate savings account as soon as it lands, before you spend it. Your
              exact rate depends on your total taxable income and marginal tax bracket, but this range
              covers most part-time and early-stage sole traders comfortably.
            </p>
            <p className="mt-3 text-lr-800">
              Open a dedicated bank account for this and transfer the percentage every time you get
              paid. Treat it as money that was never really yours to spend — it removes the temptation
              to dip into it and the shock of an unexpected tax bill.
            </p>
          </section>

          {/* ─── Section: key dates ──────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Key dates</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">BAS quarters</span> (if GST-registered): due 28
                  October, 28 February, 28 April, and 28 July for each quarter.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">Annual tax return:</span> due 31 October if
                  self-lodging, or a later date if lodging through a registered tax agent.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-semibold">PAYG instalment dates:</span> generally align with the
                  BAS quarterly dates above once you&apos;re in the system.
                </span>
              </li>
            </ul>
            <a
              href="https://www.ato.gov.au/about-ato/using-our-systems/key-dates-and-time-limits"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — key lodgment dates ↗
            </a>
          </section>

          {/* ─── Section: mistakes to avoid ─────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Common mistakes to avoid</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Mixing personal and business expenses</span> in one
                  bank account — it makes it almost impossible to reconstruct accurate records later.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Not keeping receipts</span> — a bank statement line
                  alone often isn&apos;t enough evidence; keep the actual receipt or invoice.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Missing the GST threshold</span> — not tracking
                  rolling 12-month turnover and registering late, which can trigger backdated GST
                  liabilities.
                </span>
              </li>
            </ul>
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
