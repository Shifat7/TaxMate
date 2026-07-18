// ─── LodgeReady — localStorage persistence ──────────────────────────
// All data stays on the user's device. No backend, no cookies, no tracking.

import type { UserType } from "@/data/deductions"

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded — silently fail
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(key)
}

// ─── Storage keys ────────────────────────────────────────────────────

const KEYS = {
  userType: "lr-user-type",
  wfhLog: "lr-wfh-log",
  vehicleLog: "lr-vehicle-log",
  wfhRate: "lr-wfh-rate",
  expenseLog: "lr-expense-log",
} as const

// ─── User type ───────────────────────────────────────────────────────

export function getUserType(): UserType | null {
  return getStorageItem<UserType | null>(KEYS.userType, null)
}

export function setUserType(userType: UserType): void {
  setStorageItem(KEYS.userType, userType)
}

// ─── WFH log ─────────────────────────────────────────────────────────

export interface WfhEntry {
  date: string // YYYY-MM-DD
  hours: number
  notes: string
}

export function getWfhLog(): WfhEntry[] {
  return getStorageItem<WfhEntry[]>(KEYS.wfhLog, [])
}

export function setWfhLog(entries: WfhEntry[]): void {
  setStorageItem(KEYS.wfhLog, entries)
}

export function addWfhEntry(entry: WfhEntry): WfhEntry[] {
  const log = getWfhLog()
  log.push(entry)
  setWfhLog(log)
  return log
}

export function removeWfhEntry(date: string): WfhEntry[] {
  const log = getWfhLog().filter((e) => e.date !== date)
  setWfhLog(log)
  return log
}

export function importWfhCsv(csv: string): WfhEntry[] {
  const lines = csv.trim().split("\n")
  const entries: WfhEntry[] = []
  for (const line of lines) {
    const parts = line.split(",")
    if (parts.length >= 2) {
      const date = parts[0].trim()
      const hours = parseFloat(parts[1].trim())
      let notes = parts.slice(2).join(",").trim()
      if (notes.startsWith('"') && notes.endsWith('"')) {
        notes = notes.slice(1, -1).replace(/""/g, '"')
      }
      if (date && !isNaN(hours)) {
        entries.push({ date, hours, notes })
      }
    }
  }
  const existing = getWfhLog()
  const merged = [...existing]
  for (const e of entries) {
    const idx = merged.findIndex((m) => m.date === e.date)
    if (idx >= 0) merged[idx] = e
    else merged.push(e)
  }
  setWfhLog(merged)
  return merged
}

export function exportWfhCsv(): string {
  const log = getWfhLog()
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date))
  const header = "date,hours,notes"
  const rows = sorted.map((e) => `${e.date},${e.hours},"${e.notes.replace(/"/g, '""')}"`)
  return [header, ...rows].join("\n")
}

export function getWfhRate(): number {
  return getStorageItem<number>(KEYS.wfhRate, 0.70)
}

export function setWfhRate(rate: number): void {
  setStorageItem(KEYS.wfhRate, rate)
}

// ─── Vehicle log ─────────────────────────────────────────────────────

export interface VehicleEntry {
  date: string // YYYY-MM-DD
  km: number
  from: string
  to: string
  purpose: string
}

export function getVehicleLog(): VehicleEntry[] {
  return getStorageItem<VehicleEntry[]>(KEYS.vehicleLog, [])
}

export function setVehicleLog(entries: VehicleEntry[]): void {
  setStorageItem(KEYS.vehicleLog, entries)
}

export function addVehicleEntry(entry: VehicleEntry): VehicleEntry[] {
  const log = getVehicleLog()
  log.push(entry)
  setVehicleLog(log)
  return log
}

export function removeVehicleEntry(date: string, from: string): VehicleEntry[] {
  const log = getVehicleLog().filter((e) => !(e.date === date && e.from === from))
  setVehicleLog(log)
  return log
}

export function exportVehicleCsv(): string {
  const log = getVehicleLog()
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date))
  const header = "date,km,from,to,purpose"
  const rows = sorted.map(
    (e) => `${e.date},${e.km},"${e.from.replace(/"/g, '""')}","${e.to.replace(/"/g, '""')}","${e.purpose.replace(/"/g, '""')}"`
  )
  return [header, ...rows].join("\n")
}

// ─── Expense log ─────────────────────────────────────────────────────

export interface ExpenseEntry {
  id: string
  date: string
  amount: number
  category: string
  description: string
  hasReceipt: boolean
}

export function getExpenseLog(): ExpenseEntry[] {
  return getStorageItem<ExpenseEntry[]>(KEYS.expenseLog, [])
}

export function setExpenseLog(entries: ExpenseEntry[]): void {
  setStorageItem(KEYS.expenseLog, entries)
}

export function addExpenseEntry(entry: ExpenseEntry): ExpenseEntry[] {
  const log = getExpenseLog()
  log.push(entry)
  setExpenseLog(log)
  return log
}

export function removeExpenseEntry(id: string): ExpenseEntry[] {
  const log = getExpenseLog().filter((e) => e.id !== id)
  setExpenseLog(log)
  return log
}

// ─── Report generation ───────────────────────────────────────────────

export interface CsvReportInput {
  userType: string
  jobLabel: string
  wfhHours: number
  wfhClaim: number
  vehicleKm: number
  vehicleClaim: number
  deductions: { id: string; label: string; maxClaim?: string }[]
}

export function generateCsvReport(input: CsvReportInput): string {
  const rows: string[][] = []
  const push = (cells: string[]) => rows.push(cells.map((c) => `"${c.replace(/"/g, '""')}"`))

  push(["LodgeReady Expense Summary", ""])
  push(["Generated", new Date().toLocaleDateString("en-AU")])
  push(["User type", input.userType])
  push(["Occupation", input.jobLabel])
  push([""])
  push(["WFH total hours", String(input.wfhHours)])
  push(["WFH estimated claim", `$${input.wfhClaim.toFixed(2)}`])
  push(["Vehicle total km", String(input.vehicleKm)])
  push(["Vehicle estimated claim", `$${input.vehicleClaim.toFixed(2)}`])
  push([""])
  push(["Category", "Limit / Method"])
  for (const d of input.deductions) {
    push([d.label, d.maxClaim ?? "Varies"])
  }
  push([""])
  push(["This is a data summary — not tax advice. Verify all figures with the ATO or a registered tax agent.", ""])

  return rows.map((r) => r.join(",")).join("\n")
}
