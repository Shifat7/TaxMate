// ─── LodgeReady — ATO 2025-26 tax data ───────────────────────────────
// Last verified: 18 Jul 2026
// Sources:
//   Tax brackets:  ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
//   WFH rate:      ato.gov.au/individuals-and-families/.../fixed-rate-method
//   Vehicle rate:  ato.gov.au/individuals-and-families/.../motor-vehicle-expenses
//   GST threshold: ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst

// ─── User type ───────────────────────────────────────────────────────

export type UserType = "employee" | "sole-trader" | "gig-worker"

export interface UserTypeOption {
  id: UserType
  label: string
  icon: string
  description: string
  examples: string
}

export const USER_TYPES: UserTypeOption[] = [
  {
    id: "employee",
    label: "Employee",
    icon: "💼",
    description: "Salaried or wages — your employer withholds PAYG tax",
    examples: "Full-time, part-time, casual, multiple jobs",
  },
  {
    id: "sole-trader",
    label: "Sole trader / Contractor",
    icon: "🔧",
    description: "You have an ABN and invoice for your work",
    examples: "Freelancer, subcontractor, consultant, tradesperson",
  },
  {
    id: "gig-worker",
    label: "Gig / Platform worker",
    icon: "🚗",
    description: "You earn through an app or online platform",
    examples: "Uber, Deliveroo, DoorDash, Airtasker, Fiverr",
  },
]

// ─── WFH / Home office rates ─────────────────────────────────────────

/** ATO fixed-rate method for EMPLOYEES working from home — 2025-26 */
export const WFH_RATE_EMPLOYEE = 0.70

/** ATO shortcut/fixed-rate for SOLE TRADERS — same rate, different eligibility rules */
export const WFH_RATE_SOLE_TRADER = 0.70

// ─── Vehicle rates ───────────────────────────────────────────────────

/** ATO cents-per-km rate — flat rate, max 5,000 km/year, 2024-25 and 2025-26 */
export const VEHICLE_CENTS_PER_KM = 0.88

/** Maximum km claimable under cents-per-km method */
export const VEHICLE_MAX_KM = 5000

// ─── GST threshold ──────────────────────────────────────────────────

/** Standard GST registration threshold */
export const GST_THRESHOLD = 75_000

/** Rideshare/taxi drivers must register for GST from $1 (GST Act s144-5) */
export const GST_RIDESHARE_THRESHOLD = 0

// ─── Tax brackets (2025-26 residents) ────────────────────────────────

export interface TaxBracket {
  label: string
  min: number
  max: number | null
  rate: number
  baseTax: number
  range: string
}

export const TAX_BRACKETS: TaxBracket[] = [
  { label: "Tax-free", min: 0, max: 18_200, rate: 0, baseTax: 0, range: "$0 – $18,200 (nil)" },
  { label: "$18,201 – $45,000", min: 18_201, max: 45_000, rate: 0.16, baseTax: 0, range: "16c per $1 over $18,200" },
  { label: "$45,001 – $135,000", min: 45_001, max: 135_000, rate: 0.30, baseTax: 4_288, range: "$4,288 + 30c per $1 over $45,000" },
  { label: "$135,001 – $190,000", min: 135_001, max: 190_000, rate: 0.37, baseTax: 31_288, range: "$31,288 + 37c per $1 over $135,000" },
  { label: "$190,001+", min: 190_001, max: null, rate: 0.45, baseTax: 51_638, range: "$51,638 + 45c per $1 over $190,000" },
]

/** Medicare levy rate — applies on top of income tax for most residents */
export const MEDICARE_LEVY_RATE = 0.02

// ─── Three-way test ──────────────────────────────────────────────────

export interface ComplianceRule {
  title: string
  description: string
}

export const ATO_THREE_WAY_TEST: ComplianceRule[] = [
  {
    title: "You spent the money and weren't reimbursed",
    description: "You must have personally incurred the expense and not been reimbursed by your employer or client.",
  },
  {
    title: "Directly related to earning your income",
    description: "The expense must be directly related to earning your employment or business income — not a private expense.",
  },
  {
    title: "You have a record to prove it",
    description: "You need evidence: receipts, invoices, bank statements, or a diary/logbook showing the expense.",
  },
]

// ─── Deduction categories ────────────────────────────────────────────

export interface DeductionCategory {
  id: string
  label: string
  description: string
  maxClaim?: string
  commonFor: string[] // job type ids
  complianceNote: string
  userTypes: UserType[] // which user types this applies to
}

export const DEDUCTION_CATEGORIES: DeductionCategory[] = [
  {
    id: "wfh",
    label: "Work-from-home expenses",
    description: "Electricity, internet, phone, stationery for hours worked from home",
    maxClaim: "Fixed rate: $0.70/hr (2025-26) or actual costs",
    commonFor: ["office", "healthcare", "retail", "teacher", "it-contractor"],
    complianceNote: "Keep a record of the total number of hours you work from home during the entire income year. An estimate or sample of representative weeks is not acceptable. Source: ato.gov.au",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "home-office-equipment",
    label: "Home office equipment",
    description: "Desk, chair, monitor, keyboard — items under $300 fully deductible",
    maxClaim: "Under $300: full deduction. Over $300: depreciate over effective life",
    commonFor: ["office", "it-contractor"],
    complianceNote: "Keep receipts for all purchases. Items $300+ need depreciation schedule over effective life.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "professional-memberships",
    label: "Professional memberships & subscriptions",
    description: "Industry body fees, professional association memberships",
    commonFor: ["office", "healthcare", "teacher", "it-contractor"],
    complianceNote: "Keep the invoice or receipt from the association. Membership must relate to your current role.",
    userTypes: ["employee", "sole-trader"],
  },
  {
    id: "self-education",
    label: "Self-education & courses",
    description: "Courses, conferences, workshops directly related to current job or business",
    commonFor: ["office", "healthcare", "trades", "teacher", "it-contractor"],
    complianceNote: "Keep enrolment records, course materials, and receipts. Must maintain or improve skills for your current work.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "laundry",
    label: "Laundry of work clothing",
    description: "Washing, drying, ironing of compulsory uniforms or protective clothing only — not plain clothes",
    maxClaim: "$1 per load if work-related only, $0.50 if mixed. No receipt needed under $150 total laundry claims.",
    commonFor: ["healthcare", "retail", "teacher", "trades"],
    complianceNote: "Keep a laundry diary: date, items washed, and whether load was work-only or mixed. You cannot claim for laundering ordinary plain clothes.",
    userTypes: ["employee"],
  },
  {
    id: "uniforms-scrubs",
    label: "Uniforms & scrubs",
    description: "Compulsory uniforms, scrubs, or protective clothing required by employer",
    commonFor: ["healthcare"],
    complianceNote: "Keep the employer policy stating uniform is compulsory, plus receipts for purchase and cleaning.",
    userTypes: ["employee"],
  },
  {
    id: "tools-equipment",
    label: "Tools & equipment",
    description: "Tools specific to trade — power tools, hand tools, safety gear, software licenses",
    maxClaim: "Under $300: full. Over $300: depreciate. Instant asset write-off up to $20,000 for sole traders (2025-26).",
    commonFor: ["trades", "it-contractor"],
    complianceNote: "Keep receipts for all purchases. The $300 threshold applies item-by-item for employees. Sole traders can use the $20,000 instant asset write-off.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "vehicle",
    label: "Vehicle & travel",
    description: "Travel between worksites, client visits, carrying bulky tools (not ordinary commute)",
    maxClaim: "Cents-per-km: flat $0.88/km, max 5,000 km/year. OR logbook method for actual expenses.",
    commonFor: ["trades", "it-contractor", "gig-driver"],
    complianceNote: "Cents-per-km: keep a record of how you calculated your km. Logbook: keep a logbook for 12 continuous weeks, valid for 5 years. Ordinary home-to-work commuting is NOT deductible.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "protective-gear",
    label: "Protective gear",
    description: "Safety boots, hard hat, hi-vis, gloves, goggles",
    commonFor: ["trades"],
    complianceNote: "Keep receipts. Protective gear is fully deductible if required by your job's safety obligations.",
    userTypes: ["employee", "sole-trader"],
  },
  {
    id: "union-fees",
    label: "Union & professional fees",
    description: "Union membership fees",
    commonFor: ["trades", "retail"],
    complianceNote: "Keep the annual membership receipt or payslip deduction record from your employer.",
    userTypes: ["employee"],
  },
  {
    id: "uniforms",
    label: "Compulsory uniforms",
    description: "Uniform with employer logo, or a strictly enforced dress code",
    commonFor: ["retail"],
    complianceNote: "Keep employer policy confirming the uniform is compulsory and your receipts for purchase.",
    userTypes: ["employee"],
  },
  {
    id: "classroom-supplies",
    label: "Classroom supplies",
    description: "Books, stationery, art supplies, educational resources bought for students",
    maxClaim: "Claim the amount you spent. Keep receipts for all purchases over the $300 total work-related expenses substantiation threshold.",
    commonFor: ["teacher"],
    complianceNote: "Keep receipts for everything. The $300 total work-related expense substantiation threshold means you need written evidence if your total claims exceed $300.",
    userTypes: ["employee"],
  },
  {
    id: "donations",
    label: "Donations & gifts",
    description: "Donations to DGR-registered charities — $2+ with receipt",
    maxClaim: "No dollar limit — must be to a Deductible Gift Recipient (DGR)",
    commonFor: ["office", "healthcare", "trades", "retail", "teacher", "it-contractor"],
    complianceNote: "Keep the charity receipt with ABN and DGR endorsement for all donations over $2.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "super-contributions",
    label: "Personal super contributions",
    description: "Personal deductible contributions to your super fund",
    maxClaim: "Up to $30,000 concessional cap (2025-26). Government co-contribution up to $500 for eligible low/mid income earners.",
    commonFor: ["office", "healthcare", "trades", "retail", "teacher", "it-contractor"],
    complianceNote: "Lodge a 'Notice of intent to claim a deduction' with your super fund BEFORE lodging your tax return or rolling over.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "tax-agent-fees",
    label: "Tax agent fees",
    description: "Cost of having a registered tax agent prepare your return",
    maxClaim: "Deduct in the financial year you actually pay the fee",
    commonFor: ["office", "healthcare", "trades", "retail", "teacher", "it-contractor"],
    complianceNote: "Keep the tax agent's invoice or receipt. You claim this in the year you pay — e.g., if you pay in Aug 2025 for your 2024-25 return, claim it in your 2025-26 return.",
    userTypes: ["employee", "sole-trader", "gig-worker"],
  },
  {
    id: "phone-internet",
    label: "Phone & internet (business use)",
    description: "Business percentage of your mobile plan and internet — must apportion private vs business use",
    maxClaim: "Claim the business-use percentage only. Keep a 4-week diary to establish the split.",
    commonFor: ["it-contractor", "gig-driver"],
    complianceNote: "Keep phone bills and a representative 4-week diary showing business vs personal usage. Apply the percentage to the full year.",
    userTypes: ["sole-trader", "gig-worker"],
  },
  {
    id: "platform-fees",
    label: "Platform / booking fees",
    description: "Service fees charged by platforms (Uber, Airtasker, etc.)",
    maxClaim: "Fully deductible — these are a cost of earning your business income",
    commonFor: ["gig-driver"],
    complianceNote: "Keep platform statements showing fees deducted. Note: report your GROSS income (before fees), then claim fees as a deduction.",
    userTypes: ["gig-worker"],
  },
  {
    id: "insurance",
    label: "Business insurance",
    description: "Public liability, professional indemnity, income protection (business-related)",
    commonFor: ["it-contractor", "trades"],
    complianceNote: "Keep the insurance certificate and payment receipt. Only the business-related portion is deductible.",
    userTypes: ["sole-trader", "gig-worker"],
  },
]

// ─── Job types ───────────────────────────────────────────────────────

export interface JobType {
  id: string
  label: string
  icon: string
  description: string
  deductions: string[] // deduction category ids
  userTypes: UserType[]
}

export const JOB_TYPES: JobType[] = [
  // Employee types
  {
    id: "office",
    label: "Office / IT",
    icon: "💻",
    description: "Salaried employee working in an office or remotely",
    deductions: ["wfh", "home-office-equipment", "professional-memberships", "self-education", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["employee"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    description: "Nurse, doctor, allied health professional",
    deductions: ["uniforms-scrubs", "laundry", "professional-memberships", "self-education", "wfh", "vehicle", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["employee"],
  },
  {
    id: "trades",
    label: "Tradesperson",
    icon: "🔧",
    description: "Electrician, plumber, builder, mechanic",
    deductions: ["tools-equipment", "vehicle", "protective-gear", "union-fees", "laundry", "self-education", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["employee", "sole-trader"],
  },
  {
    id: "retail",
    label: "Retail / Hospitality",
    icon: "🛒",
    description: "Shop assistant, waiter, bartender, manager",
    deductions: ["uniforms", "laundry", "union-fees", "wfh", "self-education", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["employee"],
  },
  {
    id: "teacher",
    label: "Teacher / Educator",
    icon: "📚",
    description: "Primary, secondary, or tertiary educator",
    deductions: ["classroom-supplies", "self-education", "wfh", "professional-memberships", "laundry", "vehicle", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["employee"],
  },
  // Contractor / sole trader types
  {
    id: "it-contractor",
    label: "IT / Digital Contractor",
    icon: "🖥️",
    description: "Software developer, designer, consultant, data analyst",
    deductions: ["wfh", "home-office-equipment", "tools-equipment", "phone-internet", "professional-memberships", "self-education", "vehicle", "insurance", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["sole-trader"],
  },
  // Gig worker types
  {
    id: "gig-driver",
    label: "Rideshare / Delivery Driver",
    icon: "🚗",
    description: "Uber, DiDi, Ola, DoorDash, Menulog, Uber Eats",
    deductions: ["vehicle", "phone-internet", "platform-fees", "tools-equipment", "insurance", "self-education", "donations", "tax-agent-fees", "super-contributions"],
    userTypes: ["gig-worker"],
  },
]

// ─── Pure functions ──────────────────────────────────────────────────

export function getJobTypesForUserType(userType: UserType): JobType[] {
  return JOB_TYPES.filter((j) => j.userTypes.includes(userType))
}

export function getDeductionsForJobType(jobTypeId: string): DeductionCategory[] {
  const job = JOB_TYPES.find((j) => j.id === jobTypeId)
  if (!job) return []
  return job.deductions
    .map((id) => DEDUCTION_CATEGORIES.find((d) => d.id === id))
    .filter(Boolean) as DeductionCategory[]
}

export function getWfhRate(userType: UserType): number {
  // Same rate for 2025-26, but different methods apply
  return userType === "employee" ? WFH_RATE_EMPLOYEE : WFH_RATE_SOLE_TRADER
}

export function estimateWfhClaim(totalHours: number, rate: number = WFH_RATE_EMPLOYEE): number {
  return Math.round(totalHours * rate * 100) / 100
}

export function estimateVehicleClaim(km: number): number {
  const clampedKm = Math.min(km, VEHICLE_MAX_KM)
  return Math.round(clampedKm * VEHICLE_CENTS_PER_KM * 100) / 100
}

export function calculateTax(taxableIncome: number): { incomeTax: number; medicareLevy: number; total: number } {
  let incomeTax = 0
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min) {
      const taxableInBracket = bracket.max
        ? Math.min(taxableIncome, bracket.max) - bracket.min + 1
        : taxableIncome - bracket.min + 1
      incomeTax = bracket.baseTax + taxableInBracket * bracket.rate
    }
  }
  // Simplified Medicare levy — full rate above threshold
  const medicareLevy = taxableIncome > 26_000 ? Math.round(taxableIncome * MEDICARE_LEVY_RATE) : 0
  return {
    incomeTax: Math.round(incomeTax),
    medicareLevy,
    total: Math.round(incomeTax) + medicareLevy,
  }
}

export function calculateRefundImpact(totalDeduction: number, marginalRate: number): number {
  return Math.round(totalDeduction * marginalRate)
}

export interface WfhEntryLike {
  date: string
  hours: number
  notes?: string
}

export function getTotalWfhHours(entries: WfhEntryLike[]): number {
  return entries.reduce((sum, e) => sum + e.hours, 0)
}

export function getAverageWeeklyHours(entries: WfhEntryLike[]): number {
  if (entries.length === 0) return 0
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
  if (totalHours === 0) return 0
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

export function jobLabel(id: string): string {
  return JOB_TYPES.find((j) => j.id === id)?.label ?? id
}
