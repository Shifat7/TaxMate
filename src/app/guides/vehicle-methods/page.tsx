import Link from "next/link"

export default function VehicleMethodsGuidePage() {
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
            Vehicle: Logbook vs Cents-per-KM
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            There are only two ways to claim car expenses in Australia. Picking the right one — and
            switching if your driving pattern changes — can be worth thousands of dollars a year.
          </p>

          {/* ─── Section: two methods ────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Two methods</h2>
            <p className="mt-3 text-neutral-700">
              The ATO offers exactly two methods for claiming motor vehicle expenses:{" "}
              <span className="font-semibold">cents-per-km</span> and the{" "}
              <span className="font-semibold">logbook method</span>. You choose whichever one gives you
              the better outcome and suits how much record-keeping you&apos;re willing to do — you can
              also switch methods from year to year as your circumstances change.
            </p>
          </section>

          {/* ─── Section: cents-per-km ──────────────────────────────── */}
          <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">Cents-per-km</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Flat rate of <span className="font-semibold">$0.88 per km</span> (2025-26).</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Capped at <span className="font-semibold">5,000 km per car, per year</span> — even if you drove more for work.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>No logbook required — just a reasonable record of how you worked out your business km (diary notes, calendar, or a simple trip log).</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>The rate already covers <span className="font-semibold">all</span> running costs — fuel, servicing, insurance, rego, and depreciation are all baked in. You can&apos;t claim any of these separately on top.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-neutral-600">
              Best when: your work-related driving is low (well under 5,000 km/year) and you don&apos;t
              want the hassle of a 12-week logbook.
            </p>
          </section>

          {/* ─── Section: logbook ───────────────────────────────────── */}
          <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">Logbook method</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Keep a logbook for a continuous <span className="font-semibold">12-week</span> period to establish your business-use percentage.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>Apply that percentage to <span className="font-semibold">all</span> actual running costs for the full year: fuel, insurance, registration, repairs and servicing, and depreciation.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>The logbook percentage stays <span className="font-semibold">valid for 5 years</span>, as long as your driving pattern doesn&apos;t change significantly — you don&apos;t need to redo it every year.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>No cap on km — every dollar of the business-use percentage of your real running costs is claimable.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-neutral-600">
              Best when: your work-related driving is high (over 5,000 km/year), or your business-use
              percentage is a large share of your total driving.
            </p>
          </section>

          {/* ─── Section: worked example ────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Which method saves you more?</h2>
            <p className="mt-3 text-neutral-700">
              Say you drive <span className="font-semibold">12,000 km</span> for work in a year, and your
              car&apos;s total annual running costs (fuel, insurance, rego, servicing, depreciation) are{" "}
              <span className="font-semibold">$9,000</span>, with a logbook showing{" "}
              <span className="font-semibold">70% business use</span>.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <h3 className="font-semibold text-neutral-900">Cents-per-km</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Capped at 5,000 km × $0.88 = <span className="font-semibold">$4,400</span>, regardless
                  of the extra 7,000 km driven.
                </p>
              </div>
              <div className="rounded-xl border border-lr-200 bg-lr-50 p-5">
                <h3 className="font-semibold text-lr-800">Logbook method</h3>
                <p className="mt-2 text-sm text-lr-700">
                  70% of $9,000 total running costs = <span className="font-semibold">$6,300</span>.
                </p>
              </div>
            </div>
            <p className="mt-4 text-neutral-700">
              In this example, the logbook method claims <span className="font-semibold">$1,900 more</span>{" "}
              because the driver&apos;s business km exceed the 5,000 km cap. If the same driver only did
              3,000 business km a year, cents-per-km (uncapped in that scenario) would likely come out
              ahead with far less paperwork. Run your own numbers — the right answer depends entirely on
              your actual km and costs.
            </p>
          </section>

          {/* ─── Section: not deductible ────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">What&apos;s NOT deductible</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Ordinary home-to-work commute</span> — travel between
                  home and your regular workplace is private travel under both methods, with limited
                  exceptions (e.g. carrying bulky tools with nowhere secure to store them at work).
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Fines</span> — speeding tickets, parking fines, and
                  other infringements are never deductible, even on a work trip.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-red-500">
                  ✕
                </span>
                <span>
                  <span className="font-semibold">Toll penalties</span> — late payment fees and
                  administration penalties on toll accounts are excluded, even though the toll itself
                  can be a deductible running cost under the logbook method.
                </span>
              </li>
            </ul>
          </section>

          {/* ─── Section: car cost limit ────────────────────────────── */}
          <section className="mt-10 rounded-2xl border border-lr-200 bg-lr-50 p-6">
            <h2 className="text-xl font-bold text-lr-800">Car cost limit</h2>
            <p className="mt-3 text-lr-800">
              If you use the logbook method and claim depreciation, there&apos;s a{" "}
              <span className="font-semibold">car cost limit of $69,674</span> for the 2025-26 income
              year. Even if your car cost more than this, depreciation (and the GST credit you can
              claim, if registered) is calculated as if the car cost only the limit. This cap resets
              each year and is indexed for inflation.
            </p>
            <a
              href="https://www.ato.gov.au/tax-rates-and-codes/car-limit"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lr-700 underline hover:text-lr-800"
            >
              ato.gov.au — car cost limit ↗
            </a>
          </section>

          <p className="mt-6 text-sm text-neutral-500">
            Full detail on both methods:{" "}
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/vehicle-and-other-transport-expenses/motor-vehicle-expenses"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — motor vehicle expenses ↗
            </a>
          </p>

          {/* ─── Tool link ───────────────────────────────────────────── */}
          <div className="mt-12 rounded-2xl border border-lr-200 bg-lr-50 p-6 text-center">
            <h2 className="text-lg font-bold text-lr-800">Track your trips as you go</h2>
            <p className="mt-2 text-sm text-lr-700">
              Log each work trip and get a live estimate under the cents-per-km method, with a warning
              before you hit the 5,000 km cap.
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
