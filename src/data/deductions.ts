export interface DeductionCategory {
  id: string
  label: string
  description: string
  maxClaim?: string
  commonFor: string[] // job type ids
  complianceNote: string
}

export interface JobType {
  id: string
  label: string
  icon: string
  description: string
  deductions: string[] // category ids
}

export interface ChecklistAnswer {
  jobType: string
  wfhDays: number | null
  homeOfficeEquipment: boolean
  unionMember: boolean
  selfEducation: boolean
  uniforms: string | null
  hasOtherExpenses: boolean
}

export const JOB_TYPES: JobType[] = [
  {
    id: "office",
    label: "Office / IT",
    icon: "💻",
    description: "Salaried employee working in an office or remotely",
    deductions: ["wfh", "home-office-equipment", "professional-memberships", "self-education", "laundry", "donations", "tax-agent-fees", "super-contributions"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    description: "Nurse, doctor, allied health professional",
    deductions: ["uniforms-scrubs", "laundry", "professional-memberships", "self-education", "wfh", "donations", "tax-agent-fees", "super-contributions"],
  },
  {
    id: "trades",
    label: "Tradesperson",
    icon: "🔧",
    description: "Electrician, plumber, builder, mechanic",
    deductions: ["tools-equipment", "vehicle", "protective-gear", "union-fees", "self-education", "donations", "tax-agent-fees", "super-contributions"],
  },
  {
    id: "retail",
    label: "Retail / Hospitality",
    icon: "🛒",
    description: "Shop assistant, waiter, bartender, manager",
    deductions: ["uniforms", "laundry", "union-fees", "wfh", "donations", "tax-agent-fees", "super-contributions"],
  },
  {
    id: "teacher",
    label: "Teacher / Educator",
    icon: "📚",
    description: "Primary, secondary, or tertiary educator",
    deductions: ["classroom-supplies", "self-education", "wfh", "professional-memberships", "laundry", "donations", "tax-agent-fees", "super-contributions"],
  },
]

export const DEDUCTION_CATEGORIES: DeductionCategory[] = [
  {
    id: "wfh",
    label: "Work-from-home expenses",
    description: "Electricity, internet, phone, stationery for days worked from home",
    maxClaim: "Fixed rate: $0.67/hr (2025-26) or actual costs",
    commonFor: ["office", "healthcare", "retail", "teacher"],
    complianceNote: "Keep a diary or timesheet for 4 representative weeks as evidence of hours worked from home.",
  },
  {
    id: "home-office-equipment",
    label: "Home office equipment",
    description: "Desk, chair, monitor, keyboard — items under $300 fully deductible",
    maxClaim: "Under $300: full deduction. Over: depreciate over life",
    commonFor: ["office"],
    complianceNote: "Keep receipts for all purchases. Items $300+ need depreciation schedule over effective life.",
  },
  {
    id: "professional-memberships",
    label: "Professional memberships & subscriptions",
    description: "Industry body fees, professional association memberships",
    commonFor: ["office", "healthcare", "teacher"],
    complianceNote: "Keep the invoice or receipt from the association. Membership must relate to your current role.",
  },
  {
    id: "self-education",
    label: "Self-education & courses",
    description: "Courses, conferences, workshops directly related to current job",
    commonFor: ["office", "healthcare", "trades", "teacher"],
    complianceNote: "Keep enrolment records, course materials, and receipts. Course must maintain or improve skills for your current job.",
  },
  {
    id: "laundry",
    label: "Laundry of work clothes",
    description: "Washing, drying, ironing of compulsory uniforms or protective clothing",
    maxClaim: "$1 per load if work-related only, $0.50 if mixed",
    commonFor: ["office", "healthcare", "retail", "teacher"],
    complianceNote: "Keep a laundry diary: date, items washed, and whether load was work-only or mixed. No receipt needed under $150 total.",
  },
  {
    id: "uniforms-scrubs",
    label: "Uniforms & scrubs",
    description: "Compulsory uniforms, scrubs, or protective clothing required by employer",
    commonFor: ["healthcare"],
    complianceNote: "Keep the employer policy stating uniform is compulsory, plus receipts for purchase and cleaning.",
  },
  {
    id: "tools-equipment",
    label: "Tools & equipment",
    description: "Tools specific to trade — power tools, hand tools, tool box, safety gear",
    maxClaim: "Under $300: full. Over $300: depreciate",
    commonFor: ["trades"],
    complianceNote: "Keep receipts for all purchases. The $300 threshold applies item-by-item, not per purchase.",
  },
  {
    id: "vehicle",
    label: "Vehicle & travel",
    description: "Travel between worksites, carrying bulky tools (not commute to work)",
    maxClaim: "$0.85/km up to 5,000km then $0.78/km, or logbook method",
    commonFor: ["trades"],
    complianceNote: "Keep a logbook for 12 continuous weeks to establish your work-related use percentage.",
  },
  {
    id: "protective-gear",
    label: "Protective gear",
    description: "Safety boots, hard hat, hi-vis, gloves, goggles",
    commonFor: ["trades"],
    complianceNote: "Keep receipts. Protective gear is fully deductible if required by your job's safety obligations.",
  },
  {
    id: "union-fees",
    label: "Union & professional fees",
    description: "Union membership fees",
    commonFor: ["trades", "retail"],
    complianceNote: "Keep the annual membership receipt or payslip deduction record from your employer.",
  },
  {
    id: "uniforms",
    label: "Compulsory uniforms",
    description: "Uniform with employer logo, or a strictly enforced dress code",
    commonFor: ["retail"],
    complianceNote: "Keep employer policy confirming the uniform is compulsory and your receipts for purchase.",
  },
  {
    id: "classroom-supplies",
    label: "Classroom supplies",
    description: "Books, stationery, art supplies, educational resources bought for students",
    maxClaim: "Up to $150 without receipts (ATO concession)",
    commonFor: ["teacher"],
    complianceNote: "Keep a diary or log of items bought. Receipts not needed under $150 concession, but still recommended.",
  },
  {
    id: "donations",
    label: "Donations & gifts",
    description: "Donations to DGR-registered charities — $2+ with receipt",
    maxClaim: "Keep your receipt — no $ limit, but must be to a DGR",
    commonFor: ["office", "healthcare", "trades", "retail", "teacher"],
    complianceNote: "Keep the charity receipt with ABN and DGR endorsement for all cash and goods donations over $2.",
  },
  {
    id: "super-contributions",
    label: "Personal super contributions",
    description: "Personal deductible contributions and government co-contribution eligibility",
    maxClaim: "Up to $30,000 concessional cap (2025-26). Govt co-contribution up to $500.",
    commonFor: ["office", "healthcare", "trades", "retail", "teacher"],
    complianceNote: "Keep the notice of intent to lodge form provided by your super fund, plus contribution records.",
  },
  {
    id: "tax-agent-fees",
    label: "Tax agent fees",
    description: "Cost of preparing your tax return — claimable next year",
    maxClaim: "Deduct in the year you pay the bill",
    commonFor: ["office", "healthcare", "trades", "retail", "teacher"],
    complianceNote: "Keep the tax agent's invoice or receipt showing the amount paid. Claim in the following financial year.",
  },
]

export function getDeductionsForJobType(jobTypeId: string): DeductionCategory[] {
  const job = JOB_TYPES.find((j) => j.id === jobTypeId)
  if (!job) return []
  return job.deductions.map((id) => DEDUCTION_CATEGORIES.find((d) => d.id === id)).filter(Boolean) as DeductionCategory[]
}

export const WFH_RATE = 0.67

export function estimateWfhClaim(hoursPerWeek: number, weeks: number = 48): number {
  const safeWeeks = Math.max(1, Math.min(52, Math.round(weeks)))
  return Math.round(hoursPerWeek * safeWeeks * WFH_RATE)
}

export interface WfhEntryLike {
  date: string
  hours: number
  notes?: string
}

export function getTotalWfhHours(entries: WfhEntryLike[]): number {
  return entries.reduce((sum, e) => sum + e.hours, 0)
}

export function calculateRefundImpact(totalDeduction: number, marginalRate: number): number {
  return Math.round(totalDeduction * marginalRate)
}

export interface TaxBracket {
  label: string
  rate: number
  range: string
}

export const TAX_BRACKETS: TaxBracket[] = [
  { label: "Up to $18,200", rate: 0, range: "$0 – $18,200 (tax-free)" },
  { label: "$18,201 – $45,000", rate: 0.16, range: "16% + 2% Medicare levy" },
  { label: "$45,001 – $135,000", rate: 0.30, range: "30% + 2% Medicare levy" },
  { label: "$135,001 – $190,000", rate: 0.37, range: "37% + 2% Medicare levy" },
  { label: "$190,001+", rate: 0.45, range: "45% + 2% Medicare levy" },
]

export interface ComplianceRule {
  title: string
  description: string
}

export const ATO_THREE_WAY_TEST: ComplianceRule[] = [
  {
    title: "You spent the money",
    description: "You must have personally incurred the expense and not been reimbursed by your employer.",
  },
  {
    title: "Directly related to your job",
    description: "The expense must be directly related to earning your employment income — not a private expense.",
  },
  {
    title: "You have a record",
    description: "You need evidence: receipts, invoices, bank statements, or a diary/logbook showing the expense.",
  },
]

export function getAverageWeeklyHours(entries: WfhEntryLike[]): number {
  if (entries.length === 0) return 0

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
  if (totalHours === 0) return 0

  // Find date range and calculate weeks spanned (min 1)
  const dates = entries.map((e) => {
    const [y, m, d] = e.date.split("-").map(Number)
    return new Date(y, m - 1, d).getTime()
  })
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const diffDays = (maxDate - minDate) / 86400000
  const weeksSpanned = Math.max(1, Math.ceil((diffDays + 1) / 7))

  return Math.round(totalHours / weeksSpanned)
}

// Checklist step types — shared between component and tests
export type Step = "job" | "wfh" | "equipment" | "union" | "education" | "uniforms" | "other" | "results"

export const STEPS: { id: Step; label: string }[] = [
  { id: "job", label: "Job type" },
  { id: "wfh", label: "WFH" },
  { id: "equipment", label: "Equipment" },
  { id: "union", label: "Memberships" },
  { id: "education", label: "Education" },
  { id: "uniforms", label: "Uniform" },
  { id: "other", label: "Other" },
  { id: "results", label: "Results" },
]

export interface ChecklistAnswers {
  jobType: string
  wfhHours: number | null
  wfhWeeks: number
  homeOfficeGear: boolean
  isUnionMember: boolean
  selfEducation: boolean
  uniforms: "none" | "compulsory" | "scrubs"
  otherExpenses: boolean
}

export function getVisibleStepsForJob(jobType: string): Step[] {
  const allSteps: Step[] = ["job", "wfh", "equipment", "union", "education", "uniforms", "other", "results"]
  if (!jobType) return allSteps
  const job = JOB_TYPES.find((j) => j.id === jobType)
  if (!job) return allSteps
  const visible: Step[] = ["job", "wfh"]
  if (job.deductions.includes("home-office-equipment")) visible.push("equipment")
  if (job.deductions.includes("professional-memberships") || job.deductions.includes("union-fees")) visible.push("union")
  if (job.deductions.includes("self-education")) visible.push("education")
  if (job.deductions.some((id) => ["uniforms", "uniforms-scrubs", "laundry"].includes(id))) visible.push("uniforms")
  visible.push("other", "results")
  return visible
}

export function isDeductionApplicable(d: DeductionCategory, a: ChecklistAnswers): boolean {
  switch (d.id) {
    case "wfh":
      return (a.wfhHours ?? 0) > 0
    case "home-office-equipment":
      return a.homeOfficeGear
    case "professional-memberships":
    case "union-fees":
      return a.isUnionMember
    case "self-education":
      return a.selfEducation
    case "uniforms":
    case "uniforms-scrubs":
    case "laundry":
      return a.uniforms !== "none"
    case "classroom-supplies":
    case "tools-equipment":
    case "vehicle":
    case "protective-gear":
    case "donations":
    case "super-contributions":
    case "tax-agent-fees":
      return true
    default:
      return false
  }
}

export function jobLabel(id: string): string {
  return JOB_TYPES.find((j) => j.id === id)?.label ?? id
}
