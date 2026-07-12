# Security

## Secret Handling
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only; never imported in any client component or exposed in `NEXT_PUBLIC_*`
- `OPENAI_API_KEY` (or equivalent) — server-side only; never in client bundles
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — safe for client; anon key has no elevated permissions
- Verify: `grep -r SUPABASE_SERVICE_ROLE_KEY .next/` must return nothing before each production deploy

## Permission Model
- **Anonymous visitors** — can POST to `/api/submit` (rate-limited); can GET `/api/report/[token]` (token-scoped, safe fields only); cannot list submissions
- **Approved admins** — authenticated via Supabase Auth + server-side allowlist check on every admin route and API call; can read all submission fields; can trigger report retry
- **Non-approved authenticated users** — rejected with 403 at every admin route
- **Service role** — used only inside server-side API routes; never passed to the browser

## RLS
- V1: permissive open policies for demo (see migration)
- Lock-down sprint: `submissions_public_read` policy → `SELECT` where `public_report_token = current_setting('app.report_token')` on safe columns; all writes via server-side route using service role; admin reads via service role only

## Approved Tools Rule
Agents and server routes may only call the named tools listed in `AGENTIC_LAYER.md`. No `eval`, no dynamic SQL construction, no raw `run_any` / `send_any` patterns.

## Audit Principle
Every state change to a submission (score written, report generated, status updated, admin viewed) is logged with actor, timestamp, and before/after values. Logs are append-only.
