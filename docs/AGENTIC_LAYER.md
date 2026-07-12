# Agentic Layer

## Risk Classification

### Low Risk — Auto-execute
- Score all eight agents from stored answers (pure computation)
- Select top-3 and next-2 from ranked scores
- Generate templated report sections from stored scores
- Draft LLM narrative (written to DB as `review_status = 'unreviewed'`)
- Tag submission with `report_generation_status`

### Medium Risk — Light approval (admin action)
- Retry failed report generation for a specific submission
- Mark a narrative section as `review_status = 'approved'`
- Update `crm_sync_status` to `pending` to trigger future sync

### High Risk — Always approval
- Send any external message or notification (not in V1)
- Push contact data to a CRM (not in V1; placeholder fields only)

### Critical — Human only
- Delete a submission record
- Export bulk contact data
- Modify the scoring matrix config

## Named Tools (V1)
- `scoreSubmission(answers)` → returns `{ agentScores, ranked, tieBreakData }`
- `generateTemplateReport(scores, answers)` → returns all report sections
- `generateLLMNarrative(structuredInput)` → returns narrative text; never ranking
- `writeSubmission(payload)` → server-side Supabase insert
- `fetchReport(token)` → server-side Supabase select, safe fields only

## Audit Log Fields (on every meaningful action)
- `submission_id`, `action`, `actor` (`system` or admin email), `timestamp`, `before_state`, `after_state`, `source` (`llm` or `template` or `admin`)

## V1 vs Later
**V1:** scoring and report generation only; no outbound actions 
**Later:** CRM sync tool, review request trigger, re-engagement sequence initiation (all require explicit admin approval)
