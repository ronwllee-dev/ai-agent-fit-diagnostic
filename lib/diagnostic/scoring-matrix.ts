import type { AgentId } from "./agents";

type Deltas = Partial<Record<AgentId, 1 | 2 | 3>>;
export const scoringMatrix: Record<string, Record<string, Deltas>> = {
  business_type: {
    professional_services_consulting: { lead_qualification: 1, appointment_coordinator: 1 }, coaching_training_education: { appointment_coordinator: 1, sales_follow_up: 1 }, property_finance_insurance: { lead_qualification: 1, sales_follow_up: 1 }, healthcare_wellness_beauty: { appointment_coordinator: 1, customer_support: 1 }, home_repair_local_services: { enquiry_assistant: 1, appointment_coordinator: 1 }, events_membership_community: { customer_support: 1, review_reactivation: 1 }, ecommerce_online_business: { customer_support: 1, operations_reporting: 1 }, agency_creative_marketing: { lead_qualification: 1, operations_reporting: 1 }, other: {},
  },
  primary_goal: {
    capture_enquiries_reduce_missed_opportunities: { enquiry_assistant: 3 }, identify_better_fit_leads_faster: { lead_qualification: 3 }, convert_leads_with_consistent_follow_up: { sales_follow_up: 3 }, book_appointments_reduce_no_shows: { appointment_coordinator: 3 }, reduce_repetitive_customer_support_work: { customer_support: 3 }, improve_payment_collection_reduce_manual_chasing: { payment_follow_up: 3 }, generate_reviews_reengage_inactive_customers: { review_reactivation: 3 }, improve_workflow_visibility_reporting_coordination: { operations_reporting: 3 },
  },
  enquiry_sources: {
    website_forms: { enquiry_assistant: 1 }, landing_pages: { enquiry_assistant: 1, sales_follow_up: 1 }, whatsapp: { enquiry_assistant: 2 }, social_media_messages: { enquiry_assistant: 2 }, phone_calls: { enquiry_assistant: 1 }, email: { enquiry_assistant: 1 }, referrals: { lead_qualification: 1 }, events_qr_codes: { enquiry_assistant: 1, sales_follow_up: 1 }, online_advertising: { lead_qualification: 1, sales_follow_up: 1 }, other: {},
  },
  response_speed: {
    within_minutes: {}, within_one_hour: {}, within_same_working_day: { enquiry_assistant: 1 }, next_working_day: { enquiry_assistant: 2, sales_follow_up: 1 }, depends_on_staff: { enquiry_assistant: 3, sales_follow_up: 2, operations_reporting: 1 }, missed_completely: { enquiry_assistant: 3, sales_follow_up: 2, operations_reporting: 1 },
  },
  qualification_process: {
    clear_qualification_criteria: {}, staff_qualify_manually_consistently: { lead_qualification: 1 }, staff_qualify_varies: { lead_qualification: 2, operations_reporting: 1 }, basic_contact_details_only: { lead_qualification: 2, enquiry_assistant: 1 }, speak_to_almost_every_lead: { lead_qualification: 3, enquiry_assistant: 1, sales_follow_up: 1 }, no_qualification_process: { lead_qualification: 3, enquiry_assistant: 1 },
  },
  sales_follow_up_process: {
    consistent_multi_step_process: {}, staff_follow_up_crm: { sales_follow_up: 1 }, staff_follow_up_when_remember: { sales_follow_up: 2, operations_reporting: 1 }, follow_up_once: { sales_follow_up: 2 }, follow_up_inconsistent: { sales_follow_up: 3, operations_reporting: 1 }, no_further_follow_up: { sales_follow_up: 3, review_reactivation: 1 },
  },
  appointment_process: {
    essential_well_automated: {}, essential_manual_work: { appointment_coordinator: 3, operations_reporting: 1 }, important_cancellations_no_shows: { appointment_coordinator: 3, sales_follow_up: 1 }, sometimes_used: { appointment_coordinator: 1 }, not_part_of_sales: {},
  },
  main_bottlenecks: {
    repetitive_enquiry_questions: { enquiry_assistant: 3, customer_support: 1 }, slow_responses_outside_hours: { enquiry_assistant: 3 }, too_many_unsuitable_leads: { lead_qualification: 3 }, leads_going_cold: { sales_follow_up: 3, review_reactivation: 1 }, manual_appointment_booking: { appointment_coordinator: 3 }, appointment_reminders_rescheduling: { appointment_coordinator: 3 }, repetitive_customer_support_requests: { customer_support: 3 }, outstanding_invoices_payment_chasing: { payment_follow_up: 3, operations_reporting: 1 }, too_few_reviews: { review_reactivation: 3 }, inactive_leads_past_customers: { review_reactivation: 3, sales_follow_up: 1 }, manual_reporting_scattered_information: { operations_reporting: 3 }, tasks_handovers_missed: { operations_reporting: 3 },
  },
  time_consuming_tasks: {
    replying_to_new_enquiries: { enquiry_assistant: 3 }, asking_qualification_questions: { lead_qualification: 3 }, following_up_with_leads: { sales_follow_up: 3 }, booking_rescheduling_appointments: { appointment_coordinator: 3 }, answering_customer_questions: { customer_support: 3 }, sending_invoices_payment_reminders: { payment_follow_up: 3 }, requesting_reviews: { review_reactivation: 3 }, re_engaging_inactive_contacts: { review_reactivation: 3, sales_follow_up: 1 }, updating_spreadsheets_crm_records: { operations_reporting: 3 }, preparing_reports: { operations_reporting: 3 }, assigning_tasks_notifying_staff: { operations_reporting: 3 },
  },
  automation_readiness: { processes_clearly_documented: {}, mostly_clear_not_documented: {}, different_staff_handle_differently: {}, depends_on_one_person: {}, clarify_before_automating: {}, not_sure: {} },
};
