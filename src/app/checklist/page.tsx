"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { JOB_TYPES, DeductionCategory, getDeductionsForJobType, estimateWfhClaim, getTotalWfhHours, getAverageWeeklyHours, calculateRefundImpact, TAX_BRACKETS, ATO_THREE_WAY_TEST, WFH_RATE, Step, STEPS, ChecklistAnswers, getVisibleStepsForJob, isDeductionApplicable, jobLabel } from "@/data/deductions"
import { getWfhLogSummary, generateCsvReport } from "@/lib/storage"

type Answers = ChecklistAnswers

function ProgressBar({ current, answers }: { current: Step; answers: Answers }) {
  const visible = getVisibleStepsForJob(answers.jobType)
  const currentIndex = STEPS.findIndex((s) => s.id === current)
  const visibleSteps = current === "results" ? visible : visible.slice(0, Math.max(currentIndex + 1, 3))

  return (
    <div className="flex items-center gap-1 mb-8">
      {visibleSteps.map((s, i) => {
        const def = STEPS.find((st) => st.id === s)!
        const isActive = s === current
        const isPast = i < currentIndex
        return (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all ${
              isPast ? "bg-taxmate-600 text-white" :
              isActive ? "bg-taxmate-600 text-white ring-2 ring-taxmate-200" :
              "bg-neutral-100 text-neutral-400"
            }`}>
              {isPast ? "✓" : def.label.charAt(0)}
            </div>
            {i < visibleSteps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full ${i < currentIndex ? "bg-taxmate-400" : "bg-neutral-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ChecklistFlow() {
  const [step, setStep] = useState<Step>("job")
  const [answers, setAnswers] = useState<Answers>({
    jobType: "",
    wfhHours: null,
    wfhWeeks: 48,
    homeOfficeGear: false,
    isUnionMember: false,
    selfEducation: false,
    uniforms: "none",
    otherExpenses: false,
  })
  const [wfhLogSummary, setWfhLogSummary] = useState<{ totalDays: number; totalHours: number; uniqueWeeks: number } | null>(null)
  const [taxBracketIndex, setTaxBracketIndex] = useState<number | null>(null)
  const [showMethodPopup, setShowMethodPopup] = useState(false)
  const [clampMessage, setClampMessage] = useState<string | null>(null)

  useEffect(() => {
    const summary = getWfhLogSummary()
    if (summary.totalDays > 0) {
      setWfhLogSummary(summary)
      // Pre-fill with log average
      const avgHours = summary.uniqueWeeks > 0
        ? Math.round(summary.totalHours / summary.uniqueWeeks)
        : Math.round(summary.totalHours)
      setAnswers((prev) => ({ ...prev, wfhHours: avgHours }))
    }
  }, [])

  function update(delta: Partial<Answers>) {
    setAnswers((prev) => ({ ...prev, ...delta }))
  }

  function clampAndShow(value: number, min: number, max: number, field: keyof Answers, fallback: number): number {
    if (isNaN(value) || value < min) {
      setClampMessage(`Minimum ${min}`)
      setTimeout(() => setClampMessage(null), 2500)
      return fallback
    }
    if (value > max) {
      setClampMessage(`Maximum ${max}`)
      setTimeout(() => setClampMessage(null), 2500)
      return max
    }
    return value
  }

  function next(s: Step) {
    const visible = getVisibleStepsForJob(answers.jobType)
    const stepOrder: Step[] = ["job", "wfh", "equipment", "union", "education", "uniforms", "other", "results"]
    const sIdx = stepOrder.indexOf(s)

    // if the target is visible, use it; otherwise find the next visible step after it
    if (visible.includes(s)) {
      setStep(s)
    } else {
      const nextVisible = visible.find((v) => stepOrder.indexOf(v) > sIdx)
      setStep(nextVisible ?? s)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const deductions = useMemo(() => answers.jobType ? getDeductionsForJobType(answers.jobType) : [], [answers.jobType])
  const wfhClaim = answers.wfhHours ? estimateWfhClaim(answers.wfhHours, answers.wfhWeeks) : 0

  function downloadReport() {
    const applicable = deductions.filter((d) => isDeductionApplicable(d, answers))
    const csv = generateCsvReport({
      jobLabel: jobLabel(answers.jobType),
      wfhHours: answers.wfhHours,
      wfhWeeks: answers.wfhWeeks,
      wfhClaim,
      deductions: applicable.map((d) => ({ id: d.id, label: d.label, maxClaim: d.maxClaim })),
    })
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taxmate-deduction-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function renderYesNo(key: keyof Answers, nextStep: Step, labelTrue?: string, labelFalse?: string) {
    return (
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { update({ [key]: true } as Partial<Answers>); next(nextStep) }}
          className={`flex-1 rounded-xl border-2 px-6 py-4 text-sm font-semibold transition ${
            answers[key as keyof Answers] === true
              ? "border-taxmate-500 bg-taxmate-50 text-taxmate-700"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-taxmate-300 hover:bg-taxmate-50/30"
          }`}
        >
          {labelTrue || "Yes"}
        </button>
        <button
          onClick={() => { update({ [key]: false } as Partial<Answers>); next(nextStep) }}
          className={`flex-1 rounded-xl border-2 px-6 py-4 text-sm font-semibold transition ${
            answers[key as keyof Answers] === false
              ? "border-taxmate-500 bg-taxmate-50 text-taxmate-700"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
          }`}
        >
          {labelFalse || "No"}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white">
      <nav className="flex items-center gap-4 px-6 py-5 max-w-2xl mx-auto border-b border-neutral-100">
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
        <span className="text-sm font-bold tracking-tight text-neutral-900">Deduction finder</span>
      </nav>

      <main className="px-6 pb-16 max-w-2xl mx-auto pt-8">
        {step !== "job" && step !== "results" && <ProgressBar current={step} answers={answers} />}

        {step === "job" && (
          <div>
            <div className="text-center mb-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-taxmate-100 text-taxmate-700 mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </span>
              <h2 className="text-3xl font-bold tracking-tight">What do you do?</h2>
              <p className="mt-1.5 text-neutral-500">Pick your job type to see personalised deductions.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {JOB_TYPES.map((job) => (
                <button
                  key={job.id}
                  onClick={() => { update({ jobType: job.id }); next("wfh") }}
                  className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white p-5 text-left transition-all hover:border-taxmate-300 hover:shadow-lg hover:shadow-taxmate-100/40"
                >
                  <span className="text-3xl block mb-2">{job.icon}</span>
                  <p className="font-semibold text-neutral-900">{job.label}</p>
                  <p className="text-sm text-neutral-500 mt-0.5">{job.description}</p>
                  <span className="absolute bottom-3 right-3 text-taxmate-400 opacity-0 group-hover:opacity-100 transition text-sm font-medium">
                    Select →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "wfh" && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-taxmate-100 text-taxmate-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Do you work from home?</h2>
            <p className="mt-1 text-neutral-500">Estimate your average WFH hours per week (0 if none).</p>

            {/* Fixed-rate vs actual cost comparison popover */}
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    Fixed-rate: ${WFH_RATE.toFixed(2)}/hr
                  </span>
                  <p className="text-xs text-blue-700 mt-1.5">
                    Covers electricity, internet, phone, and stationery. No apportionment needed. Keep a 4-week diary.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMethodPopup(true)}
                  className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  Compare methods
                </button>
              </div>
            </div>

            {/* Method comparison modal */}
            {showMethodPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowMethodPopup(false)}>
                <div className="max-w-lg w-full rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Fixed-rate vs Actual cost</h3>
                    <button onClick={() => setShowMethodPopup(false)} className="text-neutral-400 hover:text-neutral-700 transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                      <p className="font-semibold text-blue-900 text-sm">Fixed-rate method (recommended)</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Claim $0.67 per hour worked from home. This covers electricity, internet, phone usage, and
                        stationery in a single rate. No apportionment calculations needed. Requires a 4-week diary or
                        timesheet as evidence.
                      </p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Best for: most people — simpler, less record-keeping.</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                      <p className="font-semibold text-amber-900 text-sm">Actual cost method</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Track and claim the actual costs of each expense category separately — electricity, internet,
                        phone, stationery, etc. Requires receipts and an apportionment calculation for shared expenses
                        (e.g., what % of your internet is work-related).
                      </p>
                      <p className="text-xs text-amber-600 mt-2 font-medium">Best for: high-energy users who can substantiate larger claims.</p>
                    </div>
                    <div className="text-xs text-neutral-500 bg-neutral-50 rounded-xl p-3">
                      <p className="font-semibold text-neutral-700">ATO note:</p>
                      <p className="mt-0.5">You must choose one method for the full year — you can't switch between them for different periods. The fixed-rate method already includes the decline in value of home office furniture and equipment.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {wfhLogSummary && (
              <div className="mt-4 rounded-xl border border-taxmate-200 bg-gradient-to-r from-taxmate-50 to-white p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📊</span>
                  <div>
                    <p className="font-semibold text-taxmate-900 text-sm">
                      Your WFH log has data
                    </p>
                    <p className="text-xs text-taxmate-700 mt-0.5">
                      {wfhLogSummary.totalDays} entries — {wfhLogSummary.totalHours} total hours
                      {wfhLogSummary.uniqueWeeks > 0 && ` across ${wfhLogSummary.uniqueWeeks} weeks`}
                    </p>
                    <p className="text-xs text-taxmate-600 mt-1">
                      Hours pre-filled from your log. Edit if needed.
                    </p>
                    <Link
                      href="/wfh-log"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-taxmate-600 hover:text-taxmate-800 transition"
                    >
                      View WFH log →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={80}
                  placeholder="Hours per week"
                  className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-lg focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
                  value={answers.wfhHours ?? ""}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    const clamped = clampAndShow(raw, 0, 80, "wfhHours", 0)
                    update({ wfhHours: isNaN(raw) ? 0 : clamped })
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">hrs/wk</span>
              </div>
              {clampMessage && (
                <p className="text-xs text-amber-600 mt-1 transition">{clampMessage}</p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">Weeks worked from home</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={52}
                  placeholder="Weeks"
                  className="w-full rounded-xl border-2 border-neutral-200 px-5 py-3 text-base focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
                  value={answers.wfhWeeks}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    const clamped = clampAndShow(raw, 1, 52, "wfhWeeks", 48)
                    update({ wfhWeeks: isNaN(raw) ? 48 : clamped })
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">wks/yr</span>
              </div>
              {clampMessage && (
                <p className="text-xs text-amber-600 mt-1 transition">{clampMessage}</p>
              )}
              <p className="text-xs text-neutral-400 mt-1">ATO default: 48 weeks. Adjust if you worked fewer/more weeks.</p>
            </div>

            <div className="mt-5">
              <button
                onClick={() => next("equipment")}
                className="w-full rounded-xl bg-taxmate-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-taxmate-700 transition shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === "equipment" && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-taxmate-100 text-taxmate-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.75c0 .621.504 1.125 1.125 1.125H6m12-5.25A2.25 2.25 0 0119.5 9v.75c0 .621-.504 1.125-1.125 1.125H6" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Home office equipment</h2>
            <p className="mt-1 text-neutral-500">Did you buy any home office equipment this year? <span className="text-neutral-400">(desk, chair, monitor, keyboard, etc.)</span></p>
            {renderYesNo("homeOfficeGear", "union")}
          </div>
        )}

        {step === "union" && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-taxmate-100 text-taxmate-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Professional memberships</h2>
            <p className="mt-1 text-neutral-500">Are you a member of a union or professional association?</p>
            {renderYesNo("isUnionMember", "education")}
          </div>
        )}

        {step === "education" && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-taxmate-100 text-taxmate-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0-.96 15.953C5.042 26.808 7.07 27 12 27c4.93 0 6.958-.192 8.7-.9m0 0a60.7 60.7 0 0 1-.96-15.953m.96 15.953A3.02 3.02 0 0 1 18 27H6a3.02 3.02 0 0 1-2.7-1.653m14.4-15.207a3.73 3.73 0 1 0-7.4 0c.197 1.15.835 2.155 1.7 2.86a3.73 3.73 0 0 0 4 0c.865-.705 1.503-1.71 1.7-2.86zM12 14.25a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Self-education</h2>
            <p className="mt-1 text-neutral-500">Did you take courses or attend conferences related to your job?</p>
            {renderYesNo("selfEducation", "uniforms")}
          </div>
        )}

        {step === "uniforms" && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-taxmate-100 text-taxmate-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Uniforms & work clothes</h2>
            <p className="mt-1 text-neutral-500">Do you wear a compulsory uniform or work-specific clothing?</p>
            <div className="flex flex-col gap-2 mt-5">
              {[
                { value: "none" as const, label: "No uniform" },
                { value: "compulsory" as const, label: "Yes — compulsory uniform" },
                { value: "scrubs" as const, label: "Yes — scrubs / protective clothing" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { update({ uniforms: opt.value }); next("other") }}
                  className={`w-full text-left rounded-xl border-2 px-5 py-4 text-sm font-semibold transition ${
                    answers.uniforms === opt.value
                      ? "border-taxmate-500 bg-taxmate-50 text-taxmate-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-taxmate-300 hover:bg-taxmate-50/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "other" && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-taxmate-100 text-taxmate-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Other expenses</h2>
            <p className="mt-1 text-neutral-500">Any other work-related expenses not covered? <span className="text-neutral-400">(travel, tools, equipment)</span></p>
            {renderYesNo("otherExpenses", "results")}
          </div>
        )}

        {step === "results" && (
          <div>
            <div className="text-center mb-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h2 className="text-3xl font-bold tracking-tight">Your deduction checklist</h2>
              <p className="mt-1.5 text-neutral-500">
                Based on your answers as a <strong className="text-neutral-900">{jobLabel(answers.jobType)}</strong>
              </p>
            </div>

            {/* ATO three-way test compliance banner */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5 shrink-0">📋</span>
                <div className="min-w-0">
                  <p className="font-semibold text-blue-900 text-sm">ATO three-way test for every deduction</p>
                  <ul className="mt-2 space-y-1.5">
                    {ATO_THREE_WAY_TEST.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                        <span className="mt-0.5 shrink-0">•</span>
                        <span><strong>{rule.title}:</strong> {rule.description}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-blue-500 mt-2">
                    Every deduction below includes specific record-keeping guidance. The ATO uses these three tests to
                    assess your claim — make sure you can satisfy all three.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {deductions.map((d) => {
                if (!isDeductionApplicable(d, answers)) return null

                return (
                  <div key={d.id} className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-green-900">{d.label}</p>
                        <p className="text-sm text-green-700 mt-0.5">{d.description}</p>
                      </div>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-bold">✓</span>
                    </div>
                    {d.maxClaim && <p className="mt-2 text-xs text-green-600 font-medium">{d.maxClaim}</p>}
                    <div className="mt-3 pt-2 border-t border-green-100">
                      <p className="text-xs text-green-600 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📌</span>
                        <span>{d.complianceNote}</span>
                      </p>
                    </div>
                  </div>
                )
              })}

              {answers.wfhHours && answers.wfhHours > 0 && (
                <div className="rounded-xl border border-taxmate-200 bg-gradient-to-r from-taxmate-50 to-white p-6">
                  <p className="text-lg font-bold text-taxmate-900">WFH estimated claim: ${wfhClaim}</p>
                  <p className="text-sm text-taxmate-700 mt-1">
                    Based on {answers.wfhHours} hours/week at ${WFH_RATE.toFixed(2)}/hr for{"\u00A0"}{answers.wfhWeeks}{"\u00A0"}weeks
                    {wfhLogSummary && (
                      <span> — from your WFH log ({wfhLogSummary.totalHours}h total)</span>
                    )}
                  </p>
                </div>
              )}

              {/* Refund impact calculator */}
              {(answers.wfhHours ?? 0) > 0 && (
                <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">Refund impact estimate</p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Your marginal tax rate determines how much of your deductions come back as refund.
                      </p>
                    </div>
                    <select
                      value={taxBracketIndex ?? ""}
                      onChange={(e) => setTaxBracketIndex(e.target.value ? Number(e.target.value) : null)}
                      className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                    >
                      <option value="">Select bracket</option>
                      {TAX_BRACKETS.map((b, i) => (
                        <option key={i} value={i}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {taxBracketIndex !== null && (
                    <div className="mt-3 pt-3 border-t border-blue-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-blue-800">Estimated deduction</span>
                        <span className="font-bold text-blue-900">${wfhClaim}</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-sm text-blue-800">Marginal rate</span>
                        <span className="font-medium text-blue-900">{TAX_BRACKETS[taxBracketIndex].range}</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-blue-100">
                        <span className="text-sm font-semibold text-blue-900">Estimated refund boost</span>
                        <span className="text-lg font-bold text-green-700">+${calculateRefundImpact(wfhClaim, TAX_BRACKETS[taxBracketIndex].rate)}</span>
                      </div>
                      <p className="text-xs text-blue-500 mt-2">
                        This is an estimate. Actual refund depends on your total tax position. Check with your tax agent.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {deductions.filter((d) => isDeductionApplicable(d, answers)).length === 0 && (
                <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5">
                  <p className="font-semibold text-amber-900">No specific deductions matched</p>
                  <p className="text-sm text-amber-700 mt-1">
                    You may still be able to claim work-related expenses. Check the MyGov checklist for guidance.
                  </p>
                </div>
              )}

              {/* $300 instant asset write-off info */}
              {deductions.filter((d) => isDeductionApplicable(d, answers)).some((d) =>
                ["home-office-equipment", "tools-equipment"].includes(d.id)
              ) && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">⚡</span>
                    <div>
                      <p className="font-semibold text-amber-900 text-sm">$300 instant asset write-off</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Items under $300 are fully deductible in the year of purchase. Items costing $300 or more must be
                        depreciated over their effective life. The $300 threshold applies per item, not per purchase.
                      </p>
                      <a
                        href="https://www.ato.gov.au/individuals-and-households/income-and-deductions/deductions-you-can-claim/other-deductions/equipment-depreciation-and-instant-asset-write-off"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-600 hover:text-amber-800 transition"
                      >
                        ATO guidance →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal super contributions info */}
              <div className="mt-4 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-white p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">💰</span>
                  <div>
                    <p className="font-semibold text-teal-900 text-sm">Personal super contributions</p>
                    <p className="text-xs text-teal-700 mt-0.5">
                      You can make personal deductible contributions to your super fund and claim a tax deduction.
                      The concessional cap is $30,000 for 2025-26.
                    </p>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-teal-600 shrink-0">✓</span>
                        <span className="text-teal-800">
                          <strong>Government co-contribution:</strong> If your income is under $58,445, the
                          government matches 50% of your after-tax contributions (up to $500).
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-teal-600 shrink-0">✓</span>
                        <span className="text-teal-800">
                          <strong>LISTO:</strong> Low Income Super Tax Offset — if your income is under
                          $37,000, the government refunds the 15% tax on your super contributions (up to $500).
                        </span>
                      </div>
                    </div>
                    <a
                      href="https://www.ato.gov.au/individuals-and-households/super/withdrawing-and-using-your-super/contributions-you-can-claim-as-a-tax-deduction"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-teal-600 hover:text-teal-800 transition"
                    >
                      ATO super guide →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Paywall commented out — all guides accessible freely via links below */}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => next("job")}
                className="rounded-xl border-2 border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition flex-1 sm:flex-none"
              >
                ← Start over
              </button>
              <Link
                href="/mygov-checklist"
                className="rounded-xl px-6 py-3 text-sm font-semibold text-center transition flex-1 sm:flex-none bg-taxmate-600 text-white hover:bg-taxmate-700 shadow-sm"
              >
                View MyGov checklist →
              </Link>
              <button
                onClick={downloadReport}
                className="rounded-xl border-2 border-teal-200 bg-white px-6 py-3 text-sm font-semibold text-teal-700 hover:border-teal-300 hover:bg-teal-50 transition flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4 inline -mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ChecklistPage() {
  return <ChecklistFlow />
}
