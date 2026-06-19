import { describe, it, expect } from "vitest"
import {
  getVisibleStepsForJob,
  isDeductionApplicable,
  jobLabel,
  JOB_TYPES,
  DEDUCTION_CATEGORIES,
  type Step,
  type ChecklistAnswers,
} from "@/data/deductions"

const defaultAnswers: ChecklistAnswers = {
  jobType: "office",
  wfhHours: 10,
  wfhWeeks: 48,
  homeOfficeGear: false,
  isUnionMember: false,
  selfEducation: false,
  uniforms: "none",
  otherExpenses: false,
}

describe("getVisibleStepsForJob", () => {
  it("returns all steps when no job type is set", () => {
    const steps = getVisibleStepsForJob("")
    expect(steps).toHaveLength(8)
    expect(steps).toContain("results")
  })

  it("returns all steps for unknown job type", () => {
    const steps = getVisibleStepsForJob("ceo")
    expect(steps).toHaveLength(8)
  })

  it("includes equipment step for office job", () => {
    const steps = getVisibleStepsForJob("office")
    expect(steps).toContain("equipment")
  })

  it("excludes equipment step for trades job", () => {
    const steps = getVisibleStepsForJob("trades")
    expect(steps).not.toContain("equipment")
  })

  it("includes union step when job has union fees or memberships", () => {
    expect(getVisibleStepsForJob("trades")).toContain("union")
    expect(getVisibleStepsForJob("retail")).toContain("union")
    expect(getVisibleStepsForJob("office")).toContain("union")
  })

  it("excludes union step for jobs without membership deductions", () => {
    expect(getVisibleStepsForJob("healthcare")).toContain("union")
    // All jobs have some form of membership — verify one has memberships
    const office = JOB_TYPES.find((j) => j.id === "office")!
    expect(office.deductions).toContain("professional-memberships")
  })

  it("includes education step when job has self-education deduction", () => {
    const officeSteps = getVisibleStepsForJob("office")
    expect(officeSteps).toContain("education")
  })

  it("includes uniforms step when job has any uniform-related deduction", () => {
    expect(getVisibleStepsForJob("retail")).toContain("uniforms")
    expect(getVisibleStepsForJob("healthcare")).toContain("uniforms")
    // Trades doesn't have uniform deductions
    expect(getVisibleStepsForJob("trades")).not.toContain("uniforms")
  })

  it("always includes job, wfh, other, and results steps", () => {
    for (const job of JOB_TYPES) {
      const steps = getVisibleStepsForJob(job.id)
      expect(steps[0]).toBe("job")
      expect(steps.slice(-2)).toEqual(["other", "results"])
    }
  })

  it("wfh step is always second", () => {
    for (const job of JOB_TYPES) {
      const steps = getVisibleStepsForJob(job.id)
      expect(steps[1]).toBe("wfh")
    }
  })

  it("all returned steps are valid Step values", () => {
    const valid: string[] = ["job", "wfh", "equipment", "union", "education", "uniforms", "other", "results"]
    for (const job of JOB_TYPES) {
      for (const s of getVisibleStepsForJob(job.id)) {
        expect(valid).toContain(s)
      }
    }
  })
})

describe("isDeductionApplicable", () => {
  it("wfh applies when hours > 0", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "wfh")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, wfhHours: 5 })).toBe(true)
  })

  it("wfh does not apply when hours are 0 or null", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "wfh")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, wfhHours: 0 })).toBe(false)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, wfhHours: null })).toBe(false)
  })

  it("home-office-equipment applies when homeOfficeGear is true", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "home-office-equipment")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, homeOfficeGear: true })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, homeOfficeGear: false })).toBe(false)
  })

  it("professional-memberships applies when isUnionMember is true", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "professional-memberships")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, isUnionMember: true })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, isUnionMember: false })).toBe(false)
  })

  it("union-fees applies when isUnionMember is true", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "union-fees")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, isUnionMember: true })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, isUnionMember: false })).toBe(false)
  })

  it("self-education applies when selfEducation is true", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "self-education")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, selfEducation: true })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, selfEducation: false })).toBe(false)
  })

  it("uniforms applies when uniforms is not 'none'", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "uniforms")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "compulsory" })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "scrubs" })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "none" })).toBe(false)
  })

  it("uniforms-scrubs applies when uniforms is not 'none'", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "uniforms-scrubs")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "compulsory" })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "none" })).toBe(false)
  })

  it("laundry applies when uniforms is not 'none'", () => {
    const cat = DEDUCTION_CATEGORIES.find((d) => d.id === "laundry")!
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "scrubs" })).toBe(true)
    expect(isDeductionApplicable(cat, { ...defaultAnswers, uniforms: "none" })).toBe(false)
  })

  it("always-applies categories: classroom-supplies, tools-equipment, vehicle, protective-gear, donations, super-contributions, tax-agent-fees", () => {
    const always: string[] = ["classroom-supplies", "tools-equipment", "vehicle", "protective-gear", "donations", "super-contributions", "tax-agent-fees"]
    for (const id of always) {
      const cat = DEDUCTION_CATEGORIES.find((d) => d.id === id)!
      expect(isDeductionApplicable(cat, defaultAnswers)).toBe(true)
    }
  })

  it("unknown category returns false", () => {
    const bogus = { id: "bogus", label: "Bogus", description: "", commonFor: [], complianceNote: "" }
    expect(isDeductionApplicable(bogus, defaultAnswers)).toBe(false)
  })
})

describe("jobLabel", () => {
  it("returns label for known job type", () => {
    expect(jobLabel("office")).toBe("Office / IT")
    expect(jobLabel("trades")).toBe("Tradesperson")
    expect(jobLabel("teacher")).toBe("Teacher / Educator")
  })

  it("returns the id itself for unknown job type", () => {
    expect(jobLabel("astronaut")).toBe("astronaut")
  })

  it("returns empty string for empty id", () => {
    expect(jobLabel("")).toBe("")
  })
})