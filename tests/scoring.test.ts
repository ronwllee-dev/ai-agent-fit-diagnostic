import { describe, expect, it } from "vitest";
import { agents } from "@/lib/diagnostic/agents";
import { scoreSubmission } from "@/lib/diagnostic/scoring";
import { scoringMatrix } from "@/lib/diagnostic/scoring-matrix";
import { validAnswers } from "./fixtures";

describe("deterministic scoring", () => {
  it("scores all eight roles and selects unique top three and next two", () => { const result = scoreSubmission(validAnswers); expect(Object.keys(result.agentScores)).toHaveLength(8); expect(new Set([...result.topThree, ...result.nextTwo]).size).toBe(5); expect(result.topThree).toEqual(["enquiry_assistant", "sales_follow_up", "appointment_coordinator"]); });
  it("returns identical results repeatedly", () => { const expected = scoreSubmission(validAnswers); for (let i=0;i<10;i++) expect(scoreSubmission(validAnswers)).toEqual(expected); });
  it("uses journey order as the final tie break", () => { const neutral = Object.fromEntries(Object.keys(validAnswers).map((key) => [key, []])) as unknown as typeof validAnswers; neutral.business_type=["other"]; neutral.primary_goal=["capture_enquiries_reduce_missed_opportunities"]; neutral.enquiry_sources=["other"]; neutral.response_speed=["within_minutes"]; neutral.qualification_process=["clear_qualification_criteria"]; neutral.sales_follow_up_process=["consistent_multi_step_process"]; neutral.appointment_process=["not_part_of_sales"]; neutral.main_bottlenecks=["slow_responses_outside_hours"]; neutral.time_consuming_tasks=["replying_to_new_enquiries"]; neutral.automation_readiness=["not_sure"]; const ranked=scoreSubmission(neutral).ranked; expect(ranked.filter((id)=>id!=="enquiry_assistant")).toEqual(agents.map((a)=>a.id).filter((id)=>id!=="enquiry_assistant")); });
  it("maps every Question 2 outcome primarily to its specified Agent", () => {
    expect(scoringMatrix.primary_goal).toEqual({
      capture_enquiries_reduce_missed_opportunities: { enquiry_assistant: 3 },
      identify_better_fit_leads_faster: { lead_qualification: 3 },
      convert_leads_with_consistent_follow_up: { sales_follow_up: 3 },
      book_appointments_reduce_no_shows: { appointment_coordinator: 3 },
      reduce_repetitive_customer_support_work: { customer_support: 3 },
      improve_payment_collection_reduce_manual_chasing: { payment_follow_up: 3 },
      generate_reviews_reengage_inactive_customers: { review_reactivation: 3 },
      improve_workflow_visibility_reporting_coordination: { operations_reporting: 3 },
    });
  });
  it("keeps readiness outside ranking", () => { const a=scoreSubmission(validAnswers); const b=scoreSubmission({...validAnswers,automation_readiness:["processes_clearly_documented"]}); expect(b.ranked).toEqual(a.ranked); expect(b.agentScores).toEqual(a.agentScores); });
});
