import { describe, it, expect, beforeEach } from "vitest"
import {
  addWfhEntry,
  getWfhLog,
  removeWfhEntry,
  importWfhCsv,
  exportWfhCsv,
  getWfhRate,
  setWfhRate,
  addVehicleEntry,
  getVehicleLog,
  removeVehicleEntry,
  setVehicleLog,
  exportVehicleCsv,
  addExpenseEntry,
  getExpenseLog,
  removeExpenseEntry,
  setExpenseLog,
  getUserType,
  setUserType,
  generateCsvReport,
  type WfhEntry,
  type VehicleEntry,
  type ExpenseEntry,
} from "@/lib/storage"

beforeEach(() => {
  localStorage.clear()
})

describe("WFH log", () => {
  it("returns empty array for empty log", () => {
    expect(getWfhLog()).toEqual([])
  })

  it("adds a WFH entry", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "Normal day" })
    const log = getWfhLog()
    expect(log).toHaveLength(1)
    expect(log[0]).toEqual({ date: "2026-06-01", hours: 8, notes: "Normal day" })
  })

  it("adds multiple entries", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "" })
    addWfhEntry({ date: "2026-06-02", hours: 7.5, notes: "Left early" })
    expect(getWfhLog()).toHaveLength(2)
  })

  it("removes entry by date", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "" })
    addWfhEntry({ date: "2026-06-02", hours: 8, notes: "" })
    removeWfhEntry("2026-06-01")
    const log = getWfhLog()
    expect(log).toHaveLength(1)
    expect(log[0].date).toBe("2026-06-02")
  })

  it("removing non-existent date does nothing", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "" })
    removeWfhEntry("2099-01-01")
    expect(getWfhLog()).toHaveLength(1)
  })

  it("export produces valid CSV header", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "Office day" })
    const csv = exportWfhCsv()
    const lines = csv.trim().split("\n")
    expect(lines[0]).toBe("date,hours,notes")
  })

  it("export includes correct data rows", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "Normal day" })
    const csv = exportWfhCsv()
    expect(csv).toContain('2026-06-01,8,"Normal day"')
  })

  it("export escapes quotes in notes", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: '8" monitor' })
    const csv = exportWfhCsv()
    expect(csv).toContain('"8"" monitor"')
  })

  it("import merges CSV entries", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "Existing" })
    const csv = "date,hours,notes\n2026-06-02,7.5,New entry"
    const merged = importWfhCsv(csv)
    expect(merged).toHaveLength(2)
  })

  it("import overwrites existing entry for same date", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "Old" })
    const csv = "date,hours,notes\n2026-06-01,7,\"Updated\""
    const merged = importWfhCsv(csv)
    const entry = merged.find((e) => e.date === "2026-06-01")
    expect(entry?.hours).toBe(7)
    expect(entry?.notes).toBe("Updated")
  })

  it("import handles unescaped quotes in notes field", () => {
    const csv = 'date,hours,notes\n2026-06-01,8,"Left at 5"" to pick up kids"'
    const merged = importWfhCsv(csv)
    expect(merged[0].notes).toBe('Left at 5" to pick up kids')
  })
})

describe("WFH rate", () => {
  it("defaults to 0.70", () => {
    expect(getWfhRate()).toBe(0.70)
  })

  it("persists custom rate", () => {
    setWfhRate(0.80)
    expect(getWfhRate()).toBe(0.80)
  })

  it("persists a rate across reads without resetting to default", () => {
    setWfhRate(0.75)
    expect(getWfhRate()).toBe(0.75)
    expect(getWfhRate()).toBe(0.75)
  })
})

describe("Vehicle log", () => {
  it("returns empty array for empty log", () => {
    expect(getVehicleLog()).toEqual([])
  })

  it("adds a vehicle entry", () => {
    addVehicleEntry({ date: "2026-06-01", km: 42, from: "Home office", to: "Client site", purpose: "client-visit" })
    const log = getVehicleLog()
    expect(log).toHaveLength(1)
    expect(log[0]).toEqual({ date: "2026-06-01", km: 42, from: "Home office", to: "Client site", purpose: "client-visit" })
  })

  it("adds multiple vehicle entries", () => {
    addVehicleEntry({ date: "2026-06-01", km: 10, from: "A", to: "B", purpose: "worksite-travel" })
    addVehicleEntry({ date: "2026-06-02", km: 20, from: "C", to: "D", purpose: "supplies-pickup" })
    expect(getVehicleLog()).toHaveLength(2)
  })

  it("removes a vehicle entry by date and origin", () => {
    addVehicleEntry({ date: "2026-06-01", km: 10, from: "A", to: "B", purpose: "other" })
    addVehicleEntry({ date: "2026-06-02", km: 20, from: "C", to: "D", purpose: "other" })
    removeVehicleEntry("2026-06-01", "A")
    const log = getVehicleLog()
    expect(log).toHaveLength(1)
    expect(log[0].date).toBe("2026-06-02")
  })

  it("removing a non-matching entry does nothing", () => {
    addVehicleEntry({ date: "2026-06-01", km: 10, from: "A", to: "B", purpose: "other" })
    removeVehicleEntry("2099-01-01", "Z")
    expect(getVehicleLog()).toHaveLength(1)
  })

  it("setVehicleLog overwrites the whole log", () => {
    addVehicleEntry({ date: "2026-06-01", km: 10, from: "A", to: "B", purpose: "other" })
    const replacement: VehicleEntry[] = [{ date: "2026-06-05", km: 99, from: "X", to: "Y", purpose: "client-visit" }]
    setVehicleLog(replacement)
    expect(getVehicleLog()).toEqual(replacement)
  })

  it("exports a CSV with the correct header", () => {
    addVehicleEntry({ date: "2026-06-01", km: 42, from: "Home", to: "Client HQ", purpose: "client-visit" })
    const csv = exportVehicleCsv()
    const lines = csv.trim().split("\n")
    expect(lines[0]).toBe("date,km,from,to,purpose")
  })

  it("exports correct data rows", () => {
    addVehicleEntry({ date: "2026-06-01", km: 42, from: "Home", to: "Client HQ", purpose: "client-visit" })
    const csv = exportVehicleCsv()
    expect(csv).toContain('2026-06-01,42,"Home","Client HQ","client-visit"')
  })

  it("returns [] from exportVehicleCsv header only when log is empty", () => {
    const csv = exportVehicleCsv()
    expect(csv.trim().split("\n")).toEqual(["date,km,from,to,purpose"])
  })

  it("empty log returns []", () => {
    expect(getVehicleLog()).toEqual([])
  })
})

describe("Expense log", () => {
  it("returns empty array for empty log", () => {
    expect(getExpenseLog()).toEqual([])
  })

  it("adds an expense entry", () => {
    const entry: ExpenseEntry = {
      id: "exp-1",
      date: "2026-06-01",
      amount: 129.95,
      category: "tools-equipment",
      description: "Cordless drill",
      hasReceipt: true,
    }
    addExpenseEntry(entry)
    const log = getExpenseLog()
    expect(log).toHaveLength(1)
    expect(log[0]).toEqual(entry)
  })

  it("adds multiple expense entries", () => {
    addExpenseEntry({ id: "exp-1", date: "2026-06-01", amount: 50, category: "phone-internet", description: "Phone bill", hasReceipt: true })
    addExpenseEntry({ id: "exp-2", date: "2026-06-02", amount: 20, category: "insurance", description: "PI insurance", hasReceipt: false })
    expect(getExpenseLog()).toHaveLength(2)
  })

  it("removes an expense entry by id", () => {
    addExpenseEntry({ id: "exp-1", date: "2026-06-01", amount: 50, category: "platform-fees", description: "Uber fee", hasReceipt: true })
    addExpenseEntry({ id: "exp-2", date: "2026-06-02", amount: 20, category: "insurance", description: "PI insurance", hasReceipt: false })
    removeExpenseEntry("exp-1")
    const log = getExpenseLog()
    expect(log).toHaveLength(1)
    expect(log[0].id).toBe("exp-2")
  })

  it("removing a non-existent id does nothing", () => {
    addExpenseEntry({ id: "exp-1", date: "2026-06-01", amount: 50, category: "insurance", description: "Cover", hasReceipt: true })
    removeExpenseEntry("does-not-exist")
    expect(getExpenseLog()).toHaveLength(1)
  })

  it("setExpenseLog overwrites the whole log", () => {
    addExpenseEntry({ id: "exp-1", date: "2026-06-01", amount: 50, category: "insurance", description: "Cover", hasReceipt: true })
    const replacement: ExpenseEntry[] = [
      { id: "exp-9", date: "2026-06-09", amount: 15, category: "platform-fees", description: "Fee", hasReceipt: false },
    ]
    setExpenseLog(replacement)
    expect(getExpenseLog()).toEqual(replacement)
  })

  it("empty log returns []", () => {
    expect(getExpenseLog()).toEqual([])
  })
})

describe("User type", () => {
  it("defaults to null", () => {
    expect(getUserType()).toBeNull()
  })

  it("persists a selected user type", () => {
    setUserType("sole-trader")
    expect(getUserType()).toBe("sole-trader")
  })

  it("persists each of the three valid user types", () => {
    setUserType("employee")
    expect(getUserType()).toBe("employee")
    setUserType("gig-worker")
    expect(getUserType()).toBe("gig-worker")
    setUserType("sole-trader")
    expect(getUserType()).toBe("sole-trader")
  })
})

describe("CSV report", () => {
  it("generates a report including userType, vehicleKm, and vehicleClaim", () => {
    const report = generateCsvReport({
      userType: "sole-trader",
      jobLabel: "IT / Digital Contractor",
      wfhHours: 800,
      wfhClaim: 560,
      vehicleKm: 1200,
      vehicleClaim: 1056,
      deductions: [
        { id: "wfh", label: "Work-from-home expenses", maxClaim: "Fixed rate: $0.70/hr (2025-26) or actual costs" },
        { id: "donations", label: "Donations & gifts", maxClaim: "No dollar limit — must be to a Deductible Gift Recipient (DGR)" },
      ],
    })

    expect(report).toContain("sole-trader")
    expect(report).toContain("IT / Digital Contractor")
    expect(report).toContain("800")
    expect(report).toContain("560.00")
    expect(report).toContain("1200")
    expect(report).toContain("1056.00")
    expect(report).toContain("Work-from-home expenses")
    expect(report).toContain("Donations & gifts")
    expect(report).toContain("Fixed rate: $0.70/hr")
  })

  it("includes the LodgeReady report title", () => {
    const report = generateCsvReport({
      userType: "employee",
      jobLabel: "Office / IT",
      wfhHours: 0,
      wfhClaim: 0,
      vehicleKm: 0,
      vehicleClaim: 0,
      deductions: [],
    })
    expect(report).toContain("LodgeReady")
  })

  it("handles zero vehicle km and claim", () => {
    const report = generateCsvReport({
      userType: "employee",
      jobLabel: "Office / IT",
      wfhHours: 100,
      wfhClaim: 70,
      vehicleKm: 0,
      vehicleClaim: 0,
      deductions: [],
    })
    expect(report).toContain("0.00")
  })
})

describe("localStorage keys", () => {
  it("uses lr-* prefixed keys, not taxmate-*", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "" })
    addVehicleEntry({ date: "2026-06-01", km: 10, from: "A", to: "B", purpose: "other" })
    addExpenseEntry({ id: "exp-1", date: "2026-06-01", amount: 10, category: "insurance", description: "", hasReceipt: false })
    setWfhRate(0.75)
    setUserType("employee")

    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) keys.push(key)
    }

    expect(keys.length).toBeGreaterThan(0)
    for (const key of keys) {
      expect(key.startsWith("lr-")).toBe(true)
      expect(key.startsWith("taxmate-")).toBe(false)
    }
  })

  it("wfh log is stored under lr-wfh-log", () => {
    addWfhEntry({ date: "2026-06-01", hours: 8, notes: "" })
    expect(localStorage.getItem("lr-wfh-log")).toBeTruthy()
    expect(localStorage.getItem("taxmate-wfh-log")).toBeNull()
  })

  it("vehicle log is stored under lr-vehicle-log", () => {
    addVehicleEntry({ date: "2026-06-01", km: 10, from: "A", to: "B", purpose: "other" })
    expect(localStorage.getItem("lr-vehicle-log")).toBeTruthy()
  })

  it("expense log is stored under lr-expense-log", () => {
    addExpenseEntry({ id: "exp-1", date: "2026-06-01", amount: 10, category: "insurance", description: "", hasReceipt: false })
    expect(localStorage.getItem("lr-expense-log")).toBeTruthy()
  })

  it("user type is stored under lr-user-type", () => {
    setUserType("gig-worker")
    expect(localStorage.getItem("lr-user-type")).toBeTruthy()
  })

  it("wfh rate is stored under lr-wfh-rate", () => {
    setWfhRate(0.72)
    expect(localStorage.getItem("lr-wfh-rate")).toBeTruthy()
  })
})

describe("removed APIs", () => {
  it("does not export a WfhEntry type mismatch (sanity check on shape)", () => {
    const entry: WfhEntry = { date: "2026-06-01", hours: 1, notes: "" }
    addWfhEntry(entry)
    expect(getWfhLog()).toHaveLength(1)
  })
})
