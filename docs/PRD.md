# AI Agent Fit Diagnostic — Product Requirements Document

## Problem
Solopreneurs and SMEs know they are losing time, leads, or revenue to manual processes but cannot identify which business function to fix first or which AI Agent is most relevant to their situation.

## Target User
Solopreneurs and SME owners in professional services, coaching, trades, agencies, healthcare, and local services — businesses that depend on enquiries, bookings, follow-up, payments, and repeat customers.

## Core Objects
- **Submission** — one completed diagnostic per user: all answers, all eight agent scores, top-3 + next-2 recommendations, generated report, consent records, public report token, CRM sync state
- **Agent** — one of eight fixed AI Agent roles with a stable ID, display name, and description
- **Scoring Matrix** — static weighted config: questionId → answerId → agentScoreDeltas (+3/+2/+1/0)
- **Report** — narrative sections generated from stored scores; AI-written summaries stored alongside source, confidence, and review_status

## MVP Must-Haves
- [ ] Dark-mode landing page with headline, trust indicators, and Start CTA — no login required
- [ ] 10-question guided assessment: one question per screen, progress bar, back/continue, answer persistence
- [ ] Max-3 enforcement for multi-select questions (Q8, Q9) in UI and server validation
- [ ] Contact form (first name, email, business name required) with separate report-processing and marketing consent
- [ ] Server-side scoring engine: deterministic, all eight scores, tie-breaking rules
- [ ] Full submission persisted to Supabase before report is shown
- [ ] Unique public report token; read-only `/report/[token]` page
- [ ] Report: summary, three recommendation cards, workforce sequence, readiness notes, next-phase agents, disclaimer
- [ ] Templated fallback report that works without an LLM
- [ ] Optional LLM narrative (writes text only; never changes ranking)
- [ ] Private admin portal: login, approved-admin allowlist, submissions list, full detail view
- [ ] 4 seeded demo submissions visible without login

## Non-Goals (V1)
- Live CRM / GHL integration or webhooks
- PDF export
- Public user accounts or saved history
- Editable scoring matrix in admin UI
- Payment, subscriptions, or multi-tenant SaaS features
- Multilingual support
- Consultation booking inside the report

## Success Criteria
A first-time visitor lands on the site, completes all 10 questions, submits contact details, and within 10 seconds sees a personalised AI Workforce Fit Report at a unique URL. The Supabase record contains every original answer, all eight agent scores, and the top-3 recommendations that match what is displayed on screen. An approved admin can log in and read the same answers, scores, and report content from the submissions list.
