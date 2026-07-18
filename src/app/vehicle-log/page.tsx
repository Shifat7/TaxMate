"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  addVehicleEntry,
  exportVehicleCsv,
  getVehicleLog,
  removeVehicleEntry,
  setVehicleLog,
  type VehicleEntry,
} from "@/lib/storage"
import { VEHICLE_CENTS_PER_KM, VEHICLE_MAX_KM, estimateVehicleClaim } from "@/data/deductions"

const PURPOSES = [
  { id: "client-visit", label: "Client visit" },
  { id: "worksite-travel", label: "Worksite travel" },
  { id: "supplies-pickup", label: "Supplies pickup" },
  { id: "other", label: "Other" },
] as const

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function purposeLabel(id: string): string {
  return PURPOSES.find((p) => p.id === id)?.label ?? id
}

function importVehicleCsv(csv: string): VehicleEntry[] {
  const lines = csv.trim().split("\n")
  const entries: VehicleEntry[] = []

  // very small CSV parser that handles quoted fields with embedded commas
  function parseLine(line: string): string[] {
    const cells: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"'
          i++
        } else if (char === '"') {
          inQuotes = false
        } else {
          current += char
        }
      } else if (char === '"') {
        inQuotes = true
      } else if (char === ",") {
        cells.push(current)
        current = ""
      } else {
        current += char
      }
    }
    cells.push(current)
    return cells
  }

  const startIndex = lines[0]?.toLowerCase().startsWith("date") ? 1 : 0
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const cells = parseLine(line)
    if (cells.length < 2) continue
    const date = cells[0]?.trim()
    const km = parseFloat(cells[1]?.trim() ?? "")
    const from = cells[2]?.trim() ?? ""
    const to = cells[3]?.trim() ?? ""
    const purpose = cells[4]?.trim() ?? "other"
    if (date && !isNaN(km)) {
      entries.push({ date, km, from, to, purpose })
    }
  }

  const existing = getVehicleLog()
  const merged = [...existing, ...entries]
  setVehicleLog(merged)
  return merged
}

export default function VehicleLogPage() {
  const [entries, setEntries] = useState<VehicleEntry[]>([])
  const [date, setDate] = useState(todayIso())
  const [km, setKm] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [purpose, setPurpose] = useState<string>(PURPOSES[0].id)
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEntries(getVehicleLog())
  }, [])

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  )

  const totalTrips = entries.length
  const totalKm = useMemo(() => entries.reduce((sum, e) => sum + e.km, 0), [entries])
  const estimatedClaim = useMemo(() => estimateVehicleClaim(totalKm), [totalKm])
  const isNearCap = totalKm >= VEHICLE_MAX_KM * 0.9

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault()
    const parsedKm = parseFloat(km)
    if (!date || isNaN(parsedKm) || parsedKm <= 0 || !from.trim() || !to.trim()) return

    const updated = addVehicleEntry({ date, km: parsedKm, from: from.trim(), to: to.trim(), purpose })
    setEntries(updated)
    setKm("")
    setFrom("")
    setTo("")
  }

  function handleRemove(entryDate: string, entryFrom: string) {
    const updated = removeVehicleEntry(entryDate, entryFrom)
    setEntries(updated)
  }

  function handleExport() {
    const csv = exportVehicleCsv()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "lodgeready-vehicle-log.csv"
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
      const updated = importVehicleCsv(text)
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
            <h1 className="hidden text-sm font-semibold text-neutral-500 sm:block">Vehicle & KM Tracker</h1>
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
            <h1 className="text-3xl font-extrabold text-neutral-900">Vehicle & KM Tracker</h1>
            <p className="mt-2 max-w-2xl text-neutral-600">
              Log work-related trips — client visits, worksite travel, and supply runs. We estimate your
              claim using the cents-per-km method at ${VEHICLE_CENTS_PER_KM.toFixed(2)}/km.
            </p>
          </div>

          {/* ─── Cap warning ───────────────────────────────────────── */}
          {isNearCap && (
            <div className="mb-8 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <span className="text-lg" aria-hidden="true">
                ⚠️
              </span>
              <p className="text-sm text-amber-900">
                <span className="font-semibold">Approaching the cents-per-km cap. </span>
                The cents-per-km method is capped at 5,000 km per car per year. Consider the logbook
                method if you drive more.{" "}
                <Link href="/guides/vehicle-methods" className="font-semibold underline hover:text-amber-950">
                  See our guide
                </Link>
                .
              </p>
            </div>
          )}

          {/* ─── Summary cards ─────────────────────────────────────── */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">Total trips</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{totalTrips}</p>
              <p className="mt-1 text-xs text-neutral-400">Logged trips</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">Total km</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{totalKm.toFixed(1)}</p>
              <p className="mt-1 text-xs text-neutral-400">Cap: {VEHICLE_MAX_KM.toLocaleString()} km/year</p>
            </div>
            <div className="rounded-2xl border border-lr-200 bg-lr-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-lr-700">Estimated claim</p>
              <p className="mt-2 text-3xl font-bold text-lr-800">${estimatedClaim.toFixed(2)}</p>
              <p className="mt-1 text-xs text-lr-600">
                {Math.min(totalKm, VEHICLE_MAX_KM).toFixed(1)} km × ${VEHICLE_CENTS_PER_KM.toFixed(2)}
              </p>
            </div>
          </div>

          {/* ─── Add entry form ─────────────────────────────────────── */}
          <div className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900">Add a trip</h2>
            <form onSubmit={handleAddEntry} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
              <div className="lg:col-span-1">
                <label htmlFor="v-date" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Date
                </label>
                <input
                  id="v-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <div className="lg:col-span-1">
                <label htmlFor="v-km" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  KM driven
                </label>
                <input
                  id="v-km"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="24.5"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <div className="lg:col-span-1">
                <label htmlFor="v-from" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  From
                </label>
                <input
                  id="v-from"
                  type="text"
                  placeholder="Home office"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <div className="lg:col-span-1">
                <label htmlFor="v-to" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  To
                </label>
                <input
                  id="v-to"
                  type="text"
                  placeholder="Client site, Parramatta"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                />
              </div>
              <div className="lg:col-span-1">
                <label htmlFor="v-purpose" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Purpose
                </label>
                <select
                  id="v-purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-lr-500 focus:outline-none focus:ring-2 focus:ring-lr-200"
                >
                  {PURPOSES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-lr-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lr-700 lg:col-span-1"
              >
                Add trip
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
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">KM</th>
                  <th className="px-5 py-3 font-medium">Route</th>
                  <th className="px-5 py-3 font-medium">Purpose</th>
                  <th className="px-5 py-3 font-medium text-right">Est. claim</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-neutral-400">
                      No trips yet. Add your first work trip above.
                    </td>
                  </tr>
                ) : (
                  sortedEntries.map((entry) => (
                    <tr key={`${entry.date}-${entry.from}`} className="transition hover:bg-lr-50/40">
                      <td className="px-5 py-3 font-medium text-neutral-800 whitespace-nowrap">
                        {new Date(entry.date + "T00:00:00").toLocaleDateString("en-AU", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-neutral-700 whitespace-nowrap">{entry.km}</td>
                      <td className="px-5 py-3 text-neutral-500">
                        {entry.from} <span aria-hidden="true">→</span> {entry.to}
                      </td>
                      <td className="px-5 py-3 text-neutral-500 whitespace-nowrap">{purposeLabel(entry.purpose)}</td>
                      <td className="px-5 py-3 text-right font-medium text-lr-700 whitespace-nowrap">
                        ${estimateVehicleClaim(entry.km).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleRemove(entry.date, entry.from)}
                          aria-label={`Remove trip on ${entry.date} from ${entry.from}`}
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
            Estimates use the cents-per-km method for the current income year, capped at{" "}
            {VEHICLE_MAX_KM.toLocaleString()} km. If you drive more for work, the logbook method may give
            you a larger deduction — see our{" "}
            <Link href="/guides/vehicle-methods" className="font-medium text-lr-600 underline hover:text-lr-700">
              vehicle methods guide
            </Link>
            . Learn more at{" "}
            <a
              href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/vehicle-and-other-transport-expenses/motor-vehicle-expenses"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lr-600 underline hover:text-lr-700"
            >
              ato.gov.au — motor vehicle expenses ↗
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
