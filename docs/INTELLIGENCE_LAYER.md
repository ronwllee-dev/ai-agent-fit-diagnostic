# Intelligence Layer

## Messy Inputs
- Free-form business type and goal selections
- Multi-select bottlenecks and time sinks (variable combinations)
- Automation readiness ranging from fully documented to completely unclear

## Auto-Structure Schema
Immediately on submission, answers are normalised to stable IDs and scored:
```json
{
  "questionId": "response_speed",
  "answerId": "depends_on_staff",
  "agentDeltas": {
    "enquiry_assistant": 3,
    "sales_follow_up": 2,
    "operations_reporting": 1
  }
}
```
All eight agent score totals are stored in `agent_scores` jsonb before any LLM call.

## Scoring Rules (Weighted Matrix)
- `+3` strong relevance — answer is a primary signal for that agent
- `+2` moderate relevance — answer supports that agent
- `+1` supporting relevance — indirect signal
- `0` no relevance
- Automation readiness (Q10) scores affect readiness notes only, not ranking

## Ranking
1. Sort all eight agents by total score descending
2. Tie-break order: count of +3 hits → primary goal match → bottleneck match → journey order (Enquiry → Qualification → Follow-Up → Appointment → Support → Payment → Review → Operations)
3. Positions 1–3 are primary recommendations; 4–5 are next-phase
4. Result is deterministic: same answers always produce same ranking

## Events to Track
- `diagnostic_started` — Q1 loaded
- `question_answered` — per question (no PII)
- `submission_created` — full row written
- `report_generated` — status + source (llm/template)
- `report_viewed` — token accessed

## V1 vs Later
**V1:** fully rule-based scoring matrix; LLM writes narrative text only 
**Later:** LLM confidence scoring on answer ambiguity; industry-specific matrix variants; aggregate pattern analysis across submissions
