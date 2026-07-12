# Data Model

## Table: `submissions`
One row per completed diagnostic submission.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid nullable | Owner-scoping at lock-down; no FK yet |
| `created_at` | timestamptz | `now()` |
| `updated_at` | timestamptz | `now()`, updated on change |
| `public_report_token` | text unique | Random 64-char token; never sequential |
| `first_name` | text not null | |
| `last_name` | text | |
| `email` | text not null | |
| `phone` | text | |
| `business_name` | text not null | |
| `website` | text | |
| `report_processing_consent` | boolean not null | Required to submit |
| `report_processing_consent_at` | timestamptz | |
| `marketing_consent` | boolean not null default false | Optional |
| `marketing_consent_at` | timestamptz | |
| `business_type` | text | Stable answer ID |
| `primary_goal` | text | Stable answer ID |
| `enquiry_sources` | text[] | Stable answer IDs |
| `response_speed` | text | Stable answer ID |
| `qualification_process` | text | Stable answer ID |
| `sales_follow_up_process` | text | Stable answer ID |
| `appointment_process` | text | Stable answer ID |
| `main_bottlenecks` | text[] | Max 3 stable answer IDs |
| `time_consuming_tasks` | text[] | Max 3 stable answer IDs |
| `automation_readiness` | text | Stable answer ID |
| `agent_scores` | jsonb | `{ agentId: number }` all eight |
| `recommendation_1` | text | Agent ID |
| `recommendation_2` | text | Agent ID |
| `recommendation_3` | text | Agent ID |
| `next_phase_1` | text | Agent ID (4th ranked) |
| `next_phase_2` | text | Agent ID (5th ranked) |
| `tie_break_data` | jsonb | Which rule applied and why |
| `workforce_summary` | text | **AI field** |
| `workforce_summary_source` | text | `'llm'` or `'template'` |
| `workforce_summary_confidence` | numeric | 0–1 |
| `workforce_summary_review_status` | text | default `'unreviewed'` |
| `recommendation_content` | jsonb | Array of card objects; **AI field** |
| `recommendation_content_source` | text | |
| `recommendation_content_confidence` | numeric | |
| `recommendation_content_review_status` | text | |
| `workforce_sequence` | text | **AI field** |
| `workforce_sequence_source` | text | |
| `workforce_sequence_confidence` | numeric | |
| `workforce_sequence_review_status` | text | |
| `readiness_notes` | text | **AI field** |
| `readiness_notes_source` | text | |
| `readiness_notes_confidence` | numeric | |
| `readiness_notes_review_status` | text | |
| `next_phase_content` | jsonb | **AI field** |
| `next_phase_content_source` | text | |
| `next_phase_content_confidence` | numeric | |
| `next_phase_content_review_status` | text | |
| `full_report_content` | jsonb | Full assembled report snapshot |
| `report_generation_status` | text | `pending` `processing` `completed` `failed` |
| `report_generation_error` | text | Internal; never shown publicly |
| `report_generated_at` | timestamptz | |
| `crm_sync_status` | text | `not_started` `pending` `completed` `failed` |
| `crm_sync_error` | text | |
| `crm_last_attempt_at` | timestamptz | |
| `crm_synced_at` | timestamptz | |
| `external_contact_id` | text | Future CRM reference |

## RLS
- V1: permissive open policies (demo-first)
- Lock-down sprint: public SELECT restricted to matching `public_report_token` on safe columns only; admin access via service-role in server routes; inserts only through server-side API route

## Stable IDs (separate config, not a DB table)
- `questions.ts` — 10 question objects each with `id`, `type`, `answers[]`
- `agents.ts` — 8 agent objects each with `id`, `name`, `description`, `journeyOrder`
- `scoringMatrix.ts` — `questionId → answerId → { agentId: delta }` map
