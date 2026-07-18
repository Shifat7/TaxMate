"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  addWfhEntry,
  exportWfhCsv,
  getWfhLog,
  importWfhCsv,
  removeWfhEntry,
  type WfhEntry,
} from "@/lib/storage"
import { WFH_RATE_EMPLOYEE, estimateWfhClaim, getTotalWfhHours, getAverageWeeklyHours } from "@/data/deductions"

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function WfhLogPage() {
  const [entries, setEntries] = useState<WfhEntry[]>([])
  const [date, setDate] = useState(todayIso())
  const [hours, setHours] = useState("")
  const [notes, setNotes] = useState("")
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEntries(getWfhLog())
  }, [])

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  )

  const totalHours = useMemo(() => getTotalWfhHours(entries), [entries])
  const avgWeeklyHours = useMemo(() => getAverageWeeklyHours(entries), [entries])
  const estimatedClaim = useMemo(
    () => estimateWfhClaim(totalHours, WFH_RATE_EMPLOYEE),
    [totalHours]
  )

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault()
    const parsedHours = parseFloat(hours)
    if (!date || isNaN(parsedHours) || parsedHours <= 0) return

    const updated = addWfhEntry({ date, hours: parsedHours, notes: notes.trim() })
    setEntries(updated)
    setHours("")
    setNotes("")
  }

  function handleRemove(entryDate: string) {
    const updated = removeWfhEntry(entryDate)
    setEntries(updated)
  }

  function handleExport() {
    const csv = exportWfhCsv()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "lodgeready-wfh-log.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? "")
      const updated = importWfhCsv(text)
      setEntries(updated)
      setImportMessage(`Imported successfully. Your log now has ${updated.length} entries.`)
      setTimeout(() => setImportMessage(null), 4000)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

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
            <h1 className="hidden text-sm font-semibold text-neutral-500 sm:block">WFH / Home Office Log</h1>
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
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-neutral-900">WFH / Home Office Log</h1>
            <p className="mt-2 max-w-2xl text-neutral-600">
              Log every day you work from home. We total your hours and estimate your claim at the ATO
              fixed rate of ${WFH_RATE_EMPLOYEE.toFixed(2)}/hour for the 2025-26 income year.
            </p>
          </div>

          {/* ─── Record-keeping note ───────────────────────────────── */}
          <div className="mb-8 flex gap-3 rounded-2xl border border-lr-200 bg-lr-50 p-4">
            <span className="text-lg" aria-hidden="true">
              ℹ️
            </span>
            <p className="text-sm text-lr-800">
              <span className="font-semibold">Record-keeping requirement: </span>
              The ATO requires a record of your total hours for the entire income year. An estimate or
              sample weeks is not acceptable. Log every WFH day as it happens, not from memory at tax time.
            </p>
          </div>

          {/* ─── Summary cards ─────────────────────────────────────── */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">Total hours logged</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{totalHours.toFixed(1)}</p>
              <p className="mt-1 text-xs text-neutral-400">Across {entries.length} entries</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">Average weekly hours</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{avgWeeklyHours}</p>
              <p className="mt-1 text-xs text-neutral-400">Based on logged date range</p>
            </div>
            <div className="rounded-2xl border border-lr-200 bg-lr-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-lr-700">Estimated claim</p>
              <p className="mt-2 text-3xl font-bold text-lr-800">${estimatedClaim.toFixed(2)}</p>
              <p className="mt-1 text-xs text-lr-600">${WFH_RATE_EMPLOYEE.toFixed(2)}/hr fixed rate</p>
            </div>
          </div>

          {/* ─── Add entry form ─────────────────────────────────────── */}
          <div className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900">Add an entry</h2>
            <form onSubmit={handleAddEntry} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
              <div>
                <label htmlFor="wfh-date" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Date
                </label>
                <input
                  id="wfh-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <div>
                <label htmlFor="wfh-hours" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Hours
                </label>
                <input
                  id="wfh-hours"
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  placeholder="7.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <div>
                <label htmlFor="wfh-notes" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Notes (optional)
                </label>
                <input
                  id="wfh-notes"
                  type="text"
                  placeholder="e.g. Full day, client calls"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-lr-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lr-700"
              >
                Add entry
              </button>
            </form>
          </div>

          {/* ─── Import / export ────────────────────────────────────── */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-lr-300 hover:text-lr-700"
            >
              Export CSV
            </button>
            <button
              onClick={handleImportClick}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-lr-300 hover:text-lr-700"
            >
              Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleImportFile}
              className="hidden"
            />
            {importMessage && (
              <span className="text-sm font-medium text-lr-700">{importMessage}</span>
            )}
          </div>

          {/* ─── Entries table ──────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Hours</th>
                  <th className="px-5 py-3 font-medium">Notes</th>
                  <th className="px-5 py-3 font-medium text-right">Est. claim</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-neutral-400">
                      No entries yet. Add your first WFH day above.
                    </td>
                  </tr>
                ) : (
                  sortedEntries.map((entry) => (
                    <tr key={entry.date} className="transition hover:bg-lr-50/40">
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        {new Date(entry.date + "T00:00:00").toLocaleDateString("en-AU", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-neutral-700">{entry.hours}</td>
                      <td className="px-5 py-3 text-neutral-500">{entry.notes || "—"}</td>
                      <td className="px-5 py-3 text-right font-medium text-lr-700">
                        ${estimateWfhClaim(entry.hours, WFH_RATE_EMPLOYEE).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleRemove(entry.date)}
                          aria-label={`Remove entry for ${entry.date}`}
                          className="rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-neutral-400">
            Estimates use the ATO fixed-rate method for the current income year. Learn more at{" "}
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses/fixed-rate-method"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — fixed rate method ↗
            </a>
          </p>
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
