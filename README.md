# LodgeReady

**Get lodge-ready for tax time.**

A privacy-first expense tracker and deduction guide for Australian sole traders, contractors, gig workers, and salaried employees. No accounts, no login, free. Everything runs in your browser.

## Features

- **WFH / Home Office Log** — Track work-from-home days with hours per entry, export to CSV for your tax agent. Uses the ATO fixed-rate method ($0.70/hr, 2025-26).
- **Vehicle KM Tracker** — Log trips (client visits, worksite travel, supplies pickups) and estimate your claim under the cents-per-km method ($0.88/km, capped at 5,000 km/year).
- **Occupation Deduction Guides** — Five in-depth guides covering rideshare/delivery drivers, sole trader home offices, first ABN tax returns, IT contractors, and vehicle logbook vs. cents-per-km — with ATO rules and rate limits baked in.
- **Expense Tracker** — Log work-related purchases against ATO deduction categories, with compliance notes for each.
- **MyGov Walkthrough** — Step-by-step guide to lodging your return through the ATO via MyGov.
- **Audit Guide** — What records to keep, how long to keep them, what triggers an ATO review, and how to handle it if you're reviewed.

All data stays in your browser (`localStorage`). No server, no account, no telemetry.

## Quick start

```bash
# Clone
git clone https://github.com/Shifat7/TaxMate.git
cd TaxMate

# Install
npm install

# Dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Running tests

```bash
# Run once
npm test

# Watch mode
npm run test:watch
```

Tests use Vitest + jsdom with a localStorage polyfill, covering deduction/job-type logic, ATO rate calculations, and storage operations.

## Project structure

```
src/
├── app/
│   ├── page.tsx                       — Landing page (user type selection)
│   ├── layout.tsx                     — Root layout
│   ├── guides/
│   │   ├── page.tsx                   — Occupation guide index
│   │   ├── uber-driver/page.tsx       — Rideshare / delivery driver tax guide
│   │   ├── sole-trader-home-office/page.tsx — Sole trader home office deductions
│   │   ├── first-abn-return/page.tsx  — Your first ABN tax return
│   │   ├── it-contractor/page.tsx     — IT contractor deductions
│   │   └── vehicle-methods/page.tsx   — Logbook vs. cents-per-km comparison
│   ├── wfh-log/page.tsx               — WFH day tracker
│   ├── vehicle-log/page.tsx           — Vehicle km tracker
│   ├── mygov-checklist/page.tsx       — MyGov lodging guide
│   └── audit-guide/page.tsx           — ATO audit prep guide
├── data/
│   └── deductions.ts                  — Deduction categories, job types, ATO rates, business logic
├── lib/
│   └── storage.ts                     — localStorage CRUD, CSV export/import
└── test/
    ├── setup.ts                       — Vitest + jsdom config
    ├── deductions.test.ts             — Calculation and data-integrity tests
    └── storage.test.ts                — Storage and CSV tests
```

There is no `ai/`, `checklist/`, or `purchase/` route, and no `lib/llm.ts` — the AI assistant, deduction-finder checklist, and paywall page have all been removed in favour of the occupation guides and trackers above.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) + jsdom for tests

Zero external runtime dependencies beyond Next.js and React. No UI libraries, no state management libraries, no auth.

## ATO rates (2025–26)

| Income | Marginal rate |
|--------|--------------|
| $0 – $18,200 | 0% |
| $18,201 – $45,000 | 16% |
| $45,001 – $135,000 | 30% |
| $135,001 – $190,000 | 37% |
| $190,001+ | 45% |

- **Medicare levy:** 2% on top of income tax for most residents above the low-income threshold.
- **WFH fixed-rate method:** $0.70/hr (2025-26) for both employees and sole traders — covers electricity, internet, phone, and stationery for hours worked from home.
- **Vehicle cents-per-km method:** flat $0.88/km, capped at 5,000 km per year. The logbook method remains available for higher-mileage claims.

All deduction limits and thresholds follow current ATO guidance and should be re-verified each financial year.

## Privacy

Zero data leaves your device. Everything is stored in `localStorage` — no cookies, no API calls, no analytics, no tracking. You own your tax data.

## Roadmap

- [ ] **Receipt OCR** — Snap a photo of a receipt and auto-fill the expense entry
- [ ] **Cross-device sync** — Optional, encrypted, still no accounts required
- [ ] **PDF export** — Generate a formatted report for your tax agent
- [ ] **More occupation guides** — Hospitality, healthcare, education, and creative freelancers
- [ ] **Quarterly BAS period summaries** — Roll up income and GST for sole traders and gig workers

## License

[CC BY-NC 4.0](LICENSE) — This project is for educational and personal use only. You may not use it for commercial purposes.

## Disclaimer

LodgeReady provides general information only. It is not tax advice. Always verify with the ATO (ato.gov.au) or a registered tax agent.
