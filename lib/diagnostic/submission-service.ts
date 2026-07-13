import { createHmac } from "node:crypto";
import { generateTemplateReport } from "./report";
import { scoreSubmission } from "./scoring";
import { validateSubmission, type SubmissionPayload } from "./validation";

export type SubmissionRepository = {
  findByToken(token: string): Promise<{ public_report_token: string } | null>;
  insert(row: Record<string, unknown>): Promise<{ id: string; public_report_token: string }>;
  audit(submissionId: string, row: Record<string, unknown>): Promise<void>;
};

export function reportTokenFor(key: string, secret: string) { return createHmac("sha256", secret).update(`report:${key}`).digest("hex"); }

export async function createSubmission(input: unknown, repository: SubmissionRepository, secret: string) {
  const validation = validateSubmission(input);
  if (!validation.ok) return { ok: false as const, status: 400, errors: validation.errors };
  const payload: SubmissionPayload = validation.value;
  const token = reportTokenFor(payload.idempotencyKey, secret);
  const existing = await repository.findByToken(token);
  if (existing) return { ok: true as const, status: 200, reportToken: existing.public_report_token, duplicate: true };
  const scores = scoreSubmission(payload.answers);
  const report = generateTemplateReport(scores, payload.answers);
  const now = new Date().toISOString();
  const c = payload.contact;
  const row = {
    public_report_token: token, first_name: c.firstName.trim(), last_name: c.lastName?.trim() || null, email: c.email.trim().toLowerCase(), phone: c.phone?.trim() || null, business_name: c.businessName.trim(), website: c.website?.trim() || null,
    report_processing_consent: true, report_processing_consent_at: now, marketing_consent: Boolean(c.marketingConsent), marketing_consent_at: c.marketingConsent ? now : null,
    business_type: payload.answers.business_type[0], primary_goal: payload.answers.primary_goal[0], enquiry_sources: payload.answers.enquiry_sources, response_speed: payload.answers.response_speed[0], qualification_process: payload.answers.qualification_process[0], sales_follow_up_process: payload.answers.sales_follow_up_process[0], appointment_process: payload.answers.appointment_process[0], main_bottlenecks: payload.answers.main_bottlenecks, time_consuming_tasks: payload.answers.time_consuming_tasks, automation_readiness: payload.answers.automation_readiness[0],
    agent_scores: scores.agentScores, recommendation_1: scores.topThree[0], recommendation_2: scores.topThree[1], recommendation_3: scores.topThree[2], next_phase_1: scores.nextTwo[0], next_phase_2: scores.nextTwo[1], tie_break_data: scores.tieBreakData,
    workforce_summary: report.workforceSummary, workforce_summary_source: "template", workforce_summary_confidence: 1, recommendation_content: report.recommendationContent, recommendation_content_source: "template", recommendation_content_confidence: 1, workforce_sequence: report.workforceSequence, workforce_sequence_source: "template", workforce_sequence_confidence: 1, readiness_notes: report.readinessNotes, readiness_notes_source: "template", readiness_notes_confidence: 1, next_phase_content: report.nextPhaseContent, next_phase_content_source: "template", next_phase_content_confidence: 1, full_report_content: report.fullReportContent, report_generation_status: "completed", report_generated_at: now,
  };
  try {
    const saved = await repository.insert(row);
    await repository.audit(saved.id, { action: "submission_created", actor: "system", source: "template", after_state: { reportToken: token, scores: scores.agentScores, recommendations: scores.topThree } });
    return { ok: true as const, status: 201, reportToken: saved.public_report_token, duplicate: false };
  } catch (error) {
    const raced = await repository.findByToken(token);
    if (raced) return { ok: true as const, status: 200, reportToken: raced.public_report_token, duplicate: true };
    throw error;
  }
}
