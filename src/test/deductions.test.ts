import { describe, it, expect } from "vitest"
import {
  JOB_TYPES,
  DEDUCTION_CATEGORIES,
  USER_TYPES,
  getDeductionsForJobType,
  getJobTypesForUserType,
  estimateWfhClaim,
  estimateVehicleClaim,
  calculateTax,
  getTotalWfhHours,
  calculateRefundImpact,
  getAverageWeeklyHours,
  TAX_BRACKETS,
  ATO_THREE_WAY_TEST,
  WFH_RATE_EMPLOYEE,
  WFH_RATE_SOLE_TRADER,
  VEHICLE_CENTS_PER_KM,
  VEHICLE_MAX_KM,
  GST_THRESHOLD,
  GST_RIDESHARE_THRESHOLD,
  MEDICARE_LEVY_RATE,
  jobLabel,
} from "@/data/deductions"

describe("JOB_TYPES", () => {
  it("has 7 job types", () => {
    expect(JOB_TYPES).toHaveLength(7)
  })

  it("each job type has an id, label, icon, deductions, and userTypes", () => {
    for (const job of JOB_TYPES) {
      expect(job.id).toBeTruthy()
      expect(job.label).toBeTruthy()
      expect(job.icon).toBeTruthy()
      expect(Array.isArray(job.deductions)).toBe(true)
      expect(Array.isArray(job.userTypes)).toBe(true)
      expect(job.userTypes.length).toBeGreaterThan(0)
    }
  })

  it("each job type's deductions reference valid category ids", () => {
    const validIds = new Set(DEDUCTION_CATEGORIES.map((d) => d.id))
    for (const job of JOB_TYPES) {
      for (const d of job.deductions) {
        expect(validIds.has(d)).toBe(true)
      }
    }
  })

  it("tags employee job types correctly", () => {
    const employeeJobs = ["office", "healthcare", "trades", "retail", "teacher"]
    for (const id of employeeJobs) {
      const job = JOB_TYPES.find((j) => j.id === id)
      expect(job).toBeDefined()
      expect(job!.userTypes).toContain("employee")
    }
  })

  it("tags sole-trader job types correctly", () => {
    const soleTraderJobs = ["trades", "it-contractor"]
    for (const id of soleTraderJobs) {
      const job = JOB_TYPES.find((j) => j.id === id)
      expect(job).toBeDefined()
      expect(job!.userTypes).toContain("sole-trader")
    }
  })

  it("tags gig-worker job types correctly", () => {
    const job = JOB_TYPES.find((j) => j.id === "gig-driver")
    expect(job).toBeDefined()
    expect(job!.userTypes).toContain("gig-worker")
  })

  it("trades is shared between employee and sole-trader", () => {
    const trades = JOB_TYPES.find((j) => j.id === "trades")!
    expect(trades.userTypes).toEqual(expect.arrayContaining(["employee", "sole-trader"]))
  })

  it("includes the new contractor job types: it-contractor and gig-driver", () => {
    expect(JOB_TYPES.some((j) => j.id === "it-contractor")).toBe(true)
    expect(JOB_TYPES.some((j) => j.id === "gig-driver")).toBe(true)
  })
})

describe("DEDUCTION_CATEGORIES", () => {
  it("has 18 categories", () => {
    expect(DEDUCTION_CATEGORIES).toHaveLength(18)
  })

  it("each category has required fields", () => {
    for (const d of DEDUCTION_CATEGORIES) {
      expect(d.id).toBeTruthy()
      expect(d.label).toBeTruthy()
      expect(d.description).toBeTruthy()
      expect(Array.isArray(d.commonFor)).toBe(true)
      expect(d.complianceNote).toBeTruthy()
      expect(Array.isArray(d.userTypes)).toBe(true)
      expect(d.userTypes.length).toBeGreaterThan(0)
    }
  })

  it("includes universal categories: donations, tax agent fees, and super contributions", () => {
    const donations = DEDUCTION_CATEGORIES.find((d) => d.id === "donations")
    expect(donations).toBeDefined()
    expect(donations!.label).toBeTruthy()
    expect(donations!.description).toMatch(/donation|DGR|charity/i)

    const taxAgent = DEDUCTION_CATEGORIES.find((d) => d.id === "tax-agent-fees")
    expect(taxAgent).toBeDefined()
    expect(taxAgent!.label).toBeTruthy()

    const superCat = DEDUCTION_CATEGORIES.find((d) => d.id === "super-contributions")
    expect(superCat).toBeDefined()
    expect(superCat!.label).toMatch(/super|contribution/i)
    expect(superCat!.complianceNote).toMatch(/intent|contribution/i)
  })

  it("universal categories apply to all three user types", () => {
    const donations = DEDUCTION_CATEGORIES.find((d) => d.id === "donations")!
    expect(donations.userTypes).toEqual(expect.arrayContaining(["employee", "sole-trader", "gig-worker"]))

    const taxAgent = DEDUCTION_CATEGORIES.find((d) => d.id === "tax-agent-fees")!
    expect(taxAgent.userTypes).toEqual(expect.arrayContaining(["employee", "sole-trader", "gig-worker"]))

    const superCat = DEDUCTION_CATEGORIES.find((d) => d.id === "super-contributions")!
    expect(superCat.userTypes).toEqual(expect.arrayContaining(["employee", "sole-trader", "gig-worker"]))
  })

  it("includes the new contractor categories: platform-fees, phone-internet, insurance", () => {
    const platformFees = DEDUCTION_CATEGORIES.find((d) => d.id === "platform-fees")
    expect(platformFees).toBeDefined()
    expect(platformFees!.userTypes).toContain("gig-worker")

    const phoneInternet = DEDUCTION_CATEGORIES.find((d) => d.id === "phone-internet")
    expect(phoneInternet).toBeDefined()
    expect(phoneInternet!.userTypes).toEqual(expect.arrayContaining(["sole-trader", "gig-worker"]))

    const insurance = DEDUCTION_CATEGORIES.find((d) => d.id === "insurance")
    expect(insurance).toBeDefined()
    expect(insurance!.userTypes).toEqual(expect.arrayContaining(["sole-trader", "gig-worker"]))
  })

  it("every deduction category has a complianceNote", () => {
    for (const d of DEDUCTION_CATEGORIES) {
      expect(d.complianceNote).toBeTruthy()
    }
  })

  it("compliance notes are unique per category", () => {
    const notes = DEDUCTION_CATEGORIES.map((d) => d.complianceNote)
    expect(new Set(notes).size).toBe(notes.length)
  })
})

describe("getDeductionsForJobType", () => {
  it("returns deductions for office job", () => {
    const deps = getDeductionsForJobType("office")
    expect(deps.length).toBeGreaterThan(0)
    expect(deps.some((d) => d.id === "wfh")).toBe(true)
  })

  it("returns deductions for tradesperson", () => {
    const deps = getDeductionsForJobType("trades")
    expect(deps.some((d) => d.id === "tools-equipment")).toBe(true)
    expect(deps.some((d) => d.id === "vehicle")).toBe(true)
  })

  it("returns vehicle, phone-internet, and platform-fees for gig-driver", () => {
    const deps = getDeductionsForJobType("gig-driver")
    expect(deps.some((d) => d.id === "vehicle")).toBe(true)
    expect(deps.some((d) => d.id === "phone-internet")).toBe(true)
    expect(deps.some((d) => d.id === "platform-fees")).toBe(true)
  })

  it("returns wfh, phone-internet, and insurance for it-contractor", () => {
    const deps = getDeductionsForJobType("it-contractor")
    expect(deps.some((d) => d.id === "wfh")).toBe(true)
    expect(deps.some((d) => d.id === "phone-internet")).toBe(true)
    expect(deps.some((d) => d.id === "insurance")).toBe(true)
  })

  it("returns empty array for unknown job type", () => {
    expect(getDeductionsForJobType("unknown-job")).toEqual([])
  })
})

describe("getJobTypesForUserType", () => {
  it("returns employee job types", () => {
    const jobs = getJobTypesForUserType("employee")
    const ids = jobs.map((j) => j.id)
    expect(ids).toEqual(expect.arrayContaining(["office", "healthcare", "trades", "retail", "teacher"]))
    expect(ids).not.toContain("gig-driver")
  })

  it("returns sole-trader job types", () => {
    const jobs = getJobTypesForUserType("sole-trader")
    const ids = jobs.map((j) => j.id)
    expect(ids).toEqual(expect.arrayContaining(["trades", "it-contractor"]))
    expect(ids).not.toContain("gig-driver")
    expect(ids).not.toContain("office")
  })

  it("returns gig-worker job types", () => {
    const jobs = getJobTypesForUserType("gig-worker")
    const ids = jobs.map((j) => j.id)
    expect(ids).toEqual(expect.arrayContaining(["gig-driver"]))
    expect(ids).not.toContain("office")
    expect(ids).not.toContain("it-contractor")
  })
})

describe("ATO rate constants", () => {
  it("WFH_RATE_EMPLOYEE equals 0.70", () => {
    expect(WFH_RATE_EMPLOYEE).toBe(0.70)
  })

  it("WFH_RATE_SOLE_TRADER equals 0.70", () => {
    expect(WFH_RATE_SOLE_TRADER).toBe(0.70)
  })

  it("VEHICLE_CENTS_PER_KM equals 0.88", () => {
    expect(VEHICLE_CENTS_PER_KM).toBe(0.88)
  })

  it("VEHICLE_MAX_KM equals 5000", () => {
    expect(VEHICLE_MAX_KM).toBe(5000)
  })

  it("GST_THRESHOLD equals 75000", () => {
    expect(GST_THRESHOLD).toBe(75_000)
  })

  it("GST_RIDESHARE_THRESHOLD equals 0", () => {
    expect(GST_RIDESHARE_THRESHOLD).toBe(0)
  })

  it("MEDICARE_LEVY_RATE equals 0.02", () => {
    expect(MEDICARE_LEVY_RATE).toBe(0.02)
  })
})

describe("estimateWfhClaim", () => {
  it("calculates 1000 hours at $0.70/hr as $700", () => {
    expect(estimateWfhClaim(1000, 0.70)).toBe(700)
  })

  it("calculates 500 hours at the default rate", () => {
    expect(estimateWfhClaim(500)).toBe(350)
  })

  it("returns 0 for 0 hours", () => {
    expect(estimateWfhClaim(0, 0.70)).toBe(0)
  })

  it("handles fractional hours", () => {
    expect(estimateWfhClaim(250.5, 0.70)).toBe(175.35)
  })

  it("accepts a custom rate", () => {
    expect(estimateWfhClaim(100, 0.80)).toBe(80)
  })
})

describe("estimateVehicleClaim", () => {
  it("calculates a normal km claim below the cap", () => {
    // 1000 km * $0.88 = $880
    expect(estimateVehicleClaim(1000)).toBe(880)
  })

  it("calculates the claim at exactly the 5,000 km cap", () => {
    // 5000 km * $0.88 = $4,400
    expect(estimateVehicleClaim(5000)).toBe(4400)
  })

  it("caps the claim when km exceeds 5,000", () => {
    // 6000 km is clamped to 5000 km → same as the cap
    expect(estimateVehicleClaim(6000)).toBe(4400)
    expect(estimateVehicleClaim(10000)).toBe(4400)
  })

  it("returns 0 for 0 km", () => {
    expect(estimateVehicleClaim(0)).toBe(0)
  })
})

describe("calculateTax", () => {
  it("returns 0 tax and 0 Medicare levy within the tax-free threshold", () => {
    const result = calculateTax(15_000)
    expect(result.incomeTax).toBe(0)
    expect(result.medicareLevy).toBe(0)
    expect(result.total).toBe(0)
  })

  it("calculates income tax in the mid (30%) bracket", () => {
    const result = calculateTax(60_000)
    expect(result.incomeTax).toBe(8788)
    expect(result.medicareLevy).toBe(1200)
    expect(result.total).toBe(9988)
  })

  it("calculates income tax in the top (45%) bracket", () => {
    const result = calculateTax(250_000)
    expect(result.incomeTax).toBe(78_638)
    expect(result.medicareLevy).toBe(5000)
    expect(result.total).toBe(83_638)
  })

  it("applies the 2% Medicare levy above the low-income threshold", () => {
    const withLevy = calculateTax(100_000)
    expect(withLevy.medicareLevy).toBe(Math.round(100_000 * MEDICARE_LEVY_RATE))

    const belowLevyThreshold = calculateTax(26_000)
    expect(belowLevyThreshold.medicareLevy).toBe(0)

    const aboveLevyThreshold = calculateTax(26_001)
    expect(aboveLevyThreshold.medicareLevy).toBeGreaterThan(0)
  })
})

describe("calculateRefundImpact", () => {
  it("calculates refund boost from total deduction at 32.5% bracket", () => {
    expect(calculateRefundImpact(1000, 0.325)).toBe(325)
  })

  it("returns 0 for zero deduction", () => {
    expect(calculateRefundImpact(0, 0.325)).toBe(0)
  })

  it("handles 45% top bracket", () => {
    expect(calculateRefundImpact(2000, 0.45)).toBe(900)
  })

  it("handles tax-free threshold (0%)", () => {
    expect(calculateRefundImpact(5000, 0)).toBe(0)
  })

  it("handles large deduction amounts", () => {
    expect(calculateRefundImpact(15000, 0.37)).toBe(5550)
  })
})

describe("getTotalWfhHours", () => {
  it("returns 0 for empty array", () => {
    expect(getTotalWfhHours([])).toBe(0)
  })

  it("sums hours from entries", () => {
    const entries = [
      { date: "2026-06-01", hours: 8, notes: "" },
      { date: "2026-06-02", hours: 7.5, notes: "" },
      { date: "2026-06-03", hours: 8, notes: "" },
    ]
    expect(getTotalWfhHours(entries)).toBe(23.5)
  })

  it("handles single entry", () => {
    const entries = [{ date: "2026-06-01", hours: 4, notes: "" }]
    expect(getTotalWfhHours(entries)).toBe(4)
  })

  it("handles fractional hours", () => {
    const entries = [
      { date: "2026-06-01", hours: 0.5, notes: "" },
      { date: "2026-06-02", hours: 1.25, notes: "" },
    ]
    expect(getTotalWfhHours(entries)).toBe(1.75)
  })
})

describe("getAverageWeeklyHours", () => {
  it("returns 0 for empty entries", () => {
    expect(getAverageWeeklyHours([])).toBe(0)
  })

  it("calculates average from single entry", () => {
    const entries = [{ date: "2026-06-01", hours: 8, notes: "" }]
    // 1 week span → 8 / 1 = 8
    expect(getAverageWeeklyHours(entries)).toBe(8)
  })

  it("calculates across multiple weeks", () => {
    const entries = [
      { date: "2026-06-01", hours: 40, notes: "" }, // Mon of week 1
      { date: "2026-06-08", hours: 36, notes: "" }, // Mon of week 2
    ]
    // 2 weeks span, 76 total hours → 76 / 2 = 38
    expect(getAverageWeeklyHours(entries)).toBe(38)
  })

  it("handles entries crossing year boundary", () => {
    const entries = [
      { date: "2026-12-28", hours: 40, notes: "" },
      { date: "2027-01-04", hours: 40, notes: "" },
    ]
    expect(getAverageWeeklyHours(entries)).toBe(40)
  })

  it("returns 0 for entries all with 0 hours", () => {
    const entries = [
      { date: "2026-06-01", hours: 0, notes: "" },
      { date: "2026-06-02", hours: 0, notes: "" },
    ]
    expect(getAverageWeeklyHours(entries)).toBe(0)
  })
})

describe("TAX_BRACKETS", () => {
  it("has 5 brackets", () => {
    expect(TAX_BRACKETS).toHaveLength(5)
  })

  it("each bracket has min, max, rate, and baseTax", () => {
    for (const b of TAX_BRACKETS) {
      expect(typeof b.min).toBe("number")
      expect(b.max === null || typeof b.max === "number").toBe(true)
      expect(typeof b.rate).toBe("number")
      expect(typeof b.baseTax).toBe("number")
    }
  })

  it("brackets ascend from 0% to 45%", () => {
    for (let i = 1; i < TAX_BRACKETS.length; i++) {
      expect(TAX_BRACKETS[i].rate).toBeGreaterThan(TAX_BRACKETS[i - 1].rate)
    }
  })

  it("brackets ascend by min threshold", () => {
    for (let i = 1; i < TAX_BRACKETS.length; i++) {
      expect(TAX_BRACKETS[i].min).toBeGreaterThan(TAX_BRACKETS[i - 1].min)
    }
  })

  it("first bracket is tax-free", () => {
    expect(TAX_BRACKETS[0].rate).toBe(0)
    expect(TAX_BRACKETS[0].min).toBe(0)
  })

  it("last bracket is the top marginal rate with no max", () => {
    expect(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate).toBe(0.45)
    expect(TAX_BRACKETS[TAX_BRACKETS.length - 1].max).toBeNull()
  })
})

describe("ATO_THREE_WAY_TEST", () => {
  it("has 3 rules", () => {
    expect(ATO_THREE_WAY_TEST).toHaveLength(3)
  })

  it("each rule has a title and description", () => {
    for (const rule of ATO_THREE_WAY_TEST) {
      expect(rule.title).toBeTruthy()
      expect(rule.description).toBeTruthy()
    }
  })

  it("the first rule mentions reimbursement", () => {
    expect(ATO_THREE_WAY_TEST[0].title + ATO_THREE_WAY_TEST[0].description).toMatch(/reimbursed/i)
  })
})

describe("USER_TYPES", () => {
  it("has 3 user types", () => {
    expect(USER_TYPES).toHaveLength(3)
  })

  it("includes employee, sole-trader, and gig-worker", () => {
    const ids = USER_TYPES.map((u) => u.id)
    expect(ids).toEqual(expect.arrayContaining(["employee", "sole-trader", "gig-worker"]))
  })

  it("each user type has an id, label, icon, and description", () => {
    for (const u of USER_TYPES) {
      expect(u.id).toBeTruthy()
      expect(u.label).toBeTruthy()
      expect(u.icon).toBeTruthy()
      expect(u.description).toBeTruthy()
    }
  })
})

describe("jobLabel", () => {
  it("returns the label for known job types", () => {
    expect(jobLabel("office")).toBe("Office / IT")
    expect(jobLabel("trades")).toBeTruthy()
  })

  it("returns the label for the new it-contractor job type", () => {
    expect(jobLabel("it-contractor")).toBeTruthy()
    expect(jobLabel("it-contractor")).not.toBe("it-contractor")
  })

  it("returns the label for the new gig-driver job type", () => {
    expect(jobLabel("gig-driver")).toBeTruthy()
    expect(jobLabel("gig-driver")).not.toBe("gig-driver")
  })

  it("falls back to the id for unknown job types", () => {
    expect(jobLabel("nonexistent-job")).toBe("nonexistent-job")
  })
})
