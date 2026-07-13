import { emptyAnswers, type Answers } from "@/lib/diagnostic/questions";
import type { PublicReportRow } from "@/lib/diagnostic/public-report";

export const validAnswers: Answers = { ...structuredClone(emptyAnswers), business_type: ["professional_services_consulting"], primary_goal: ["capture_enquiries_reduce_missed_opportunities"], enquiry_sources: ["website_forms", "email"], response_speed: ["missed_completely"], qualification_process: ["basic_contact_details_only"], sales_follow_up_process: ["follow_up_inconsistent"], appointment_process: ["essential_manual_work"], main_bottlenecks: ["slow_responses_outside_hours", "leads_going_cold", "manual_appointment_booking"], time_consuming_tasks: ["replying_to_new_enquiries", "following_up_with_leads", "booking_rescheduling_appointments"], automation_readiness: ["mostly_clear_not_documented"] };

export const validPayload = { idempotencyKey: "123e4567-e89b-42d3-a456-426614174000", answers: validAnswers, contact: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", businessName: "Analytical Engines", reportProcessingConsent: true, marketingConsent: false } };

export const reportRow: PublicReportRow = {
  business_name: "Analytical Engines", created_at: "2026-07-13T00:00:00.000Z",
  business_type: validAnswers.business_type[0], primary_goal: validAnswers.primary_goal[0], enquiry_sources: validAnswers.enquiry_sources, response_speed: validAnswers.response_speed[0], qualification_process: validAnswers.qualification_process[0], sales_follow_up_process: validAnswers.sales_follow_up_process[0], appointment_process: validAnswers.appointment_process[0], main_bottlenecks: validAnswers.main_bottlenecks, time_consuming_tasks: validAnswers.time_consuming_tasks, automation_readiness: validAnswers.automation_readiness[0],
  agent_scores: { enquiry_assistant: 14, lead_qualification: 5, sales_follow_up: 10, appointment_coordinator: 8, customer_support: 1, payment_follow_up: 0, review_reactivation: 1, operations_reporting: 2 },
  recommendation_1: "enquiry_assistant", recommendation_2: "sales_follow_up", recommendation_3: "appointment_coordinator", next_phase_1: "lead_qualification", next_phase_2: "operations_reporting", report_generation_status: "completed",
};
