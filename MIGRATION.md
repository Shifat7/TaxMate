# TaxMate → LodgeReady Migration Guide

## Overview
This patch converts TaxMate into LodgeReady — a privacy-first expense tracker
and deduction guide for Australian contractors, sole traders, gig workers,
and salaried employees.

## What changed

### Renamed
- Project name: TaxMate → LodgeReady
- Package name: taxmate → lodgeready
- Color palette: taxmate-* → lr-* (teal-green)
- localStorage keys: taxmate-* → lr-*

### Fixed (ATO 2025-26 rates)
- WFH fixed rate: $0.67 → $0.70/hr
- Vehicle rate: $0.85/km tiered → flat $0.88/km (max 5,000 km)
- WFH evidence: "4 representative weeks" → full-year hour records required
- Three-way test: added "and weren't reimbursed" to rule 1
- Classroom supplies: removed incorrect $150 no-receipt concession
- Tax agent fees: fixed contradictory description
- Removed office → laundry mapping (plain clothes not claimable)
- Added Medicare levy (2%) to tax calculations
- Added base tax amounts ($4,288 / $31,288 / $51,638)

### Added
- Employee / Sole Trader / Gig Worker user type selection
- Vehicle km tracker with cents-per-km calculation
- Expense log with ATO deduction categories
- GST threshold monitoring ($75K standard, $0 for rideshare)
- 5 occupation-specific deduction guides:
  1. Uber / Rideshare Driver Tax Guide
  2. Sole Trader Home Office Deductions
  3. Your First ABN Tax Return
  4. IT Contractor Deductions
  5. Vehicle: Logbook vs Cents-per-KM
- Contractor-specific deduction categories (platform fees, phone/internet, insurance)
- Contractor-specific job types (IT contractor, gig driver)

### Removed
- AI Assistant (BYOK LLM chat) — regulatory risk too high
- Personalised deduction finder — replaced by generic occupation guides
- Purchase/paywall page — dead code

## How to apply

### Option A: Fresh start (recommended)
1. Copy this entire `lodgeready-patch/` directory as your new project root
2. Copy these files from the original TaxMate repo:
   - `next.config.ts`
   - `tsconfig.json`
   - `vitest.config.ts`
   - `postcss.config.mjs` (if it exists)
   - `public/_headers`
   - `src/test/setup.ts`
3. Update tests (see below)
4. Run `npm install && npm run build`

### Option B: In-place update
1. Delete these files:
   - `src/app/ai/page.tsx`
   - `src/app/checklist/page.tsx`
   - `src/app/purchase/page.tsx`
   - `src/lib/llm.ts`
2. Copy all files from `lodgeready-patch/src/` into your `src/` directory (overwriting existing)
3. Copy `lodgeready-patch/package.json` to your root
4. Run `npm install && npm run build`

### Updating tests
The existing tests in `src/test/` reference the old data structures.
Key changes needed:
- `deductions.test.ts`: WFH_RATE is now WFH_RATE_EMPLOYEE (0.70), add tests for VEHICLE_CENTS_PER_KM, new job types
- `storage.test.ts`: localStorage keys changed from `taxmate-*` to `lr-*`, remove BYOK tests, add vehicle log tests
- `checklist-logic.test.ts`: getVisibleStepsForJob is removed (checklist replaced by guides), delete or rewrite

### Updating audit-guide and mygov-checklist
These pages exist in the original repo but are NOT included in this patch.
They still work but need manual rebranding:
- Replace all `taxmate-*` CSS classes with `lr-*`
- Replace "TaxMate" text with "LodgeReady"
- Update footer disclaimer

## Deployment
- Deploy to Cloudflare Pages (or any static host) as before
- Register a new .com.au domain (NOT taxmate.com.au — it's taken)
- Update `public/_headers` if the domain changes

## Post-deployment checklist
- [ ] Verify all ATO rates match current published rates
- [ ] Test employee vs contractor user type flow
- [ ] Test WFH log with $0.70 rate
- [ ] Test vehicle log with $0.88 rate and 5,000 km cap
- [ ] Verify all guide page ATO links are live
- [ ] Check mobile responsiveness
- [ ] Set up annual rate-update reminder (1 July each year)
