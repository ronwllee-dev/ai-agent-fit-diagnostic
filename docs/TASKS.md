# Tasks and Sprints

## Sprint 1 — Data model, scoring engine, demo seed
**Goal:** The database exists, the scoring engine is correct and tested, demo submissions are visible without login.

- [ ] Write and apply Supabase migration (submissions table, all fields, v1 open RLS policies)
- [ ] Define `questions.ts`, `agents.ts`, `scoringMatrix.ts` with stable IDs and full weighted config
- [ ] Implement `scoreSubmission()`: accumulate deltas, rank all eight, apply tie-breaking, return top-5
- [ ] Implement `generateTemplateReport()`: build all report sections from scores and answers alone
- [ ] Unit tests: per-answer scoring, accumulation, ranking, tie-breaking, max-3 validation, all five test scenarios (A–E)
- [ ] Seed 4 realistic demo submissions
- [ ] Lint, typecheck, unit tests all pass; migration applies cleanly

**Definition of Done:** `pnpm test` passes all scoring tests; seeded submissions appear in Supabase; `pnpm build` succeeds.

---

## Sprint 2 — Public diagnostic flow
**Goal:** A visitor can complete all 10 questions, submit contact details, and have a full record written to Supabase.

- [ ] Dark-mode landing page: headline, value prop, trust indicators, Start CTA — no login wall
- [ ] Diagnostic introduction screen
- [ ] 10-question assessment UI: one question per screen, progress bar, back/continue, answer state preserved
- [ ] Max-3 UI enforcement for Q8 (bottlenecks) and Q9 (time-consuming tasks)
- [ ] Contact and consent form: required fields, two separate consent checkboxes, validation
- [ ] `POST /api/submit`: validate full payload, run `scoreSubmission()`, write to Supabase, return `{ reportToken }`
- [ ] Duplicate-submit guard (button disable + idempotency check)
- [ ] Loading screen during server round-trip
- [ ] All five question states handled: loading, empty, partial, error, ready

**Definition of Done:** Complete the diagnostic end-to-end → navigate back and forward → confirm answers persist → submit → Supabase row contains all 10 answers + scores + token. `pnpm build` passes.

---

## Sprint 3 — Report page ✦ v1 functional milestone
**Goal:** The public report page renders the correct personalised report from stored data. The app is fully demoable end-to-end.

- [ ] `GET /api/report/[token]`: fetch by `public_report_token`, return safe fields only
- [ ] `/report/[token]` page: summary, three recommendation cards (rank, name, priority label, why, tasks, readiness), workforce sequence (arrow chain desktop / stacked mobile), readiness notes, next-phase agents (visually secondary), disclaimer
- [ ] Verify: displayed top-3 = stored `recommendation_1/2/3` = calculated scores every time
- [ ] Optional LLM narrative call (server-side, async after row write); fallback to template on any failure; `report_generation_status` updated correctly
- [ ] Failed LLM path: submission intact, friendly retry UI, status = `'failed'`
- [ ] Report states handled: loading, error (invalid token), ready
- [ ] Responsive check at 375, 430, 768, 1024, 1440 px — no horizontal overflow
- [ ] Manual run of all five test scenarios; confirm expected top-3

**Definition of Done:** Completing the diagnostic produces a correct report at the unique URL. Reloading the URL shows the same recommendations. Removing the LLM call still produces a complete report. All breakpoints pass.

---

## Sprint 4 — Private admin portal
**Goal:** An approved admin can log in and inspect every submission in full detail.

- [ ] `/admin/login` using Supabase Auth
- [ ] Approved-admin allowlist: server-side check on every admin route and API handler
- [ ] `/admin/submissions`: list with date, name, business name, email, business type, goal, rec 1–3, consent status, report status, CRM sync status, View link
- [ ] Search and filter: name, email, business type, primary goal, top agent, report status, date range
- [ ] `/admin/submissions/[id]`: contact info, consent timestamps, full human-readable answers (labels not IDs), all 8 scores, tie-break reason, top-3 + next-2, full report content, report URL, CRM sync placeholder
- [ ] Admin retry action for `report_generation_status = 'failed'`
- [ ] Security tests: unauthenticated → redirect; non-approved authenticated → 403; public token cannot access admin fields; cross-token isolation; service-role key absent from client bundle

**Definition of Done:** All security tests pass. An approved admin can see every field. An unauthenticated visitor is redirected. `pnpm build` passes.

---

## Sprint 5 — Lock it down and production verification
**Goal:** RLS tightened, all tests pass, live deployment verified.

- [ ] Replace v1 open RLS policies with scoped policies: public report SELECT on safe columns by token only; inserts via service-role server route only; admin reads via service role
- [ ] Full end-to-end test: land → start → 10 questions → back/forward → submit → loading → report URL → admin record → answers match → scores match → recommendations match
- [ ] Lint, typecheck, all unit tests, database constraint tests, admin security tests, responsive checks — all pass
- [ ] Production smoke test on Vercel: site loads, diagnostic completes, submission in correct Supabase project, report URL works, admin login works, no secrets in client bundle (`grep` check)
- [ ] Confirm GitHub push triggers correct Vercel deployment

**Definition of Done:** All 22 acceptance criteria from the PRD confirmed pass. No open lint or typecheck errors. Production smoke test complete.

---

## Gantt (sprint → deliverable)
```
Sprint 1 | DB schema · scoring engine · seed data
Sprint 2 | Landing · questions · contact form · submit API
Sprint 3 | Report page · LLM layer · ✦ v1 functional
Sprint 4 | Admin portal · search · detail · security
Sprint 5 | RLS lock-down · full test pass · prod deploy
```
