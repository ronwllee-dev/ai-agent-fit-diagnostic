# Test Plan

## V1 Success Scenario (manual end-to-end)
1. Load `/` — landing page renders with demo content, no login prompt
2. Click **Start the Diagnostic** — introduction screen appears
3. Answer Q1–Q7 (single choice each) — Continue advances, Back restores prior answer
4. Answer Q8 — select 3 bottlenecks; attempt to select a 4th — 4th is blocked
5. Answer Q9 — same max-3 enforcement
6. Answer Q10 — continue to contact form
7. Submit contact form with first name, email, business name, report-processing consent checked, marketing consent unchecked
8. Loading screen appears with 'Analysing…' message
9. Browser navigates to `/report/[token]` — report renders with summary, 3 cards, sequence, readiness, next-phase, disclaimer
10. Reload `/report/[token]` — identical content
11. Open Supabase dashboard → submissions table → confirm row contains all 10 answer IDs, all 8 scores, correct top-3 agent IDs matching the report
12. Log in as approved admin at `/admin/login` → submission appears in list → open detail → all answers shown as human-readable labels → scores, tie-break data, and report content all present

## Scoring Unit Tests
- Each answer option in the matrix produces the documented delta for each agent
- Accumulation across all 10 questions matches expected totals for Scenarios A–E
- Tie-breaking: equal scores → +3 count wins; still tied → primary goal match; still tied → bottleneck match; still tied → journey order
- Max-3 validation rejects payloads with 4+ selections for Q8 and Q9
- Same answer set always returns same ranked output (determinism test ×10 runs)

## Empty and Error Cases
- Submit with missing email → validation error shown, no Supabase write
- Submit without report-processing consent → blocked with clear message
- Load `/report/invalid-token` → friendly 'report not found' state, no stack trace
- LLM call times out → submission intact in Supabase, `report_generation_status = 'failed'`, retry UI shown
- Double-click Submit → second request ignored, one row written
- Navigate back from Q6 to Q3 → Q3 answer still selected

## Admin Security Tests
- GET `/admin/submissions` with no session → 302 redirect to `/admin/login`
- GET `/admin/submissions` with valid Supabase session but non-approved email → 403
- GET `/api/report/[token]` → response contains only safe fields (no `crm_sync_error`, no `report_generation_error`, no `user_id`)
- GET `/api/report/[tokenA]` with `tokenB` in query → returns only tokenA data or 404
- `grep -r SUPABASE_SERVICE_ROLE_KEY .next/static/` → zero results

## Responsive Checks
- 375 px: no horizontal scroll; answer cards readable; Back/Continue buttons accessible; report sequence stacks vertically
- 430 px: same
- 768 px: layout widens; sequence may show arrow chain
- 1024 px and 1440 px: desktop layout; workforce sequence shows horizontal arrow chain

## Quality Gates (must all pass before Sprint 5 done)
- `pnpm lint` — zero errors
- `pnpm typecheck` — zero errors
- `pnpm test` — all unit and DB tests pass
- `pnpm build` — clean production build
- Live Vercel deployment responds to a full diagnostic run
