# Architecture

## Stack
- **Next.js 14 (App Router)** — public pages, server components, API routes
- **TypeScript** — strict mode throughout
- **Supabase** — Postgres (submissions table), Auth (admin only), Row Level Security
- **Vercel** — hosting and environment variables
- **OpenAI / compatible LLM** — optional narrative layer only; never touches ranking

## What to Build Now vs Later
**Now:** scoring engine, diagnostic flow, report page, admin portal, templated fallback report 
**Next:** LLM narrative enhancement, admin retry for failed reports, full end-to-end test suite 
**Later:** CRM sync, PDF export, client accounts, aggregate analytics, editable scoring UI

## Key User Action — Step by Step
1. Visitor loads landing page (seed data renders immediately, no login)
2. Clicks Start → introduction screen → Q1 of 10
3. Selects answers screen by screen; back navigation restores prior selections from in-memory state
4. After Q10 → contact and consent form
5. Submit → `POST /api/submit` validates payload, runs scoring engine, writes full row to Supabase, returns `{ reportToken }`
6. Browser navigates to `/report/[token]`
7. `GET /api/report/[token]` fetches the row by `public_report_token`, returns safe report fields only
8. Report renders: summary, three recommendation cards, sequence, readiness notes, next-phase, disclaimer
9. (Async, after response) LLM narrative generation updates the row; if it fails, `report_generation_status = 'failed'`, row is intact

## Layer Plan
1. **Database first** — schema, constraints, RLS, seed data
2. **Scoring engine** — pure TypeScript functions, fully unit-tested, no database dependency
3. **API routes** — submit, report retrieval, admin endpoints; service-role key server-side only
4. **UI** — consumes API; all states handled (loading, empty, error, partial, ready)
5. **LLM layer** — writes narrative fields only; templated fallback always present

## Core Without AI
The scoring engine is a deterministic weighted matrix in static config. Remove the LLM call entirely and the report still generates correctly from the template. No AI dependency on the critical path.
