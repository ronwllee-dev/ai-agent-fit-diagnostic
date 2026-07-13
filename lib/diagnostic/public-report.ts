import { agents, agentIds, type AgentId } from "./agents";
import { questions, type Answers, type QuestionId } from "./questions";

export type ReadinessLevel = "Ready to Start" | "Start with Basic Process Setup" | "Foundation Needed Before Automation";
export type PublicReportRow = {
  business_name: string;
  created_at: string;
  business_type: string;
  primary_goal: string;
  enquiry_sources: string[];
  response_speed: string;
  qualification_process: string;
  sales_follow_up_process: string;
  appointment_process: string;
  main_bottlenecks: string[];
  time_consuming_tasks: string[];
  automation_readiness: string;
  agent_scores: Record<string, number>;
  recommendation_1: string;
  recommendation_2: string;
  recommendation_3: string;
  next_phase_1: string;
  next_phase_2: string;
  report_generation_status: string;
};

export type PublicReport = ReturnType<typeof buildPublicReport>;

const agentDetails: Record<AgentId, { problems: string[]; responsibilities: string[]; benefit: string; later: string; condition: string }> = {
  enquiry_assistant: { problems: ["Delayed or missed enquiries", "Repetitive first-response questions", "After-hours response gaps"], responsibilities: ["Acknowledge new enquiries", "Answer approved FAQs", "Capture details and route urgent requests"], benefit: "More consistent first contact and fewer opportunities lost before a human responds.", later: "It can strengthen the first stage of the customer journey as enquiry volume grows.", condition: "Add when response coverage or first-contact consistency becomes a constraint." },
  lead_qualification: { problems: ["Time spent on unsuitable leads", "Missing lead information", "Inconsistent qualification"], responsibilities: ["Ask approved qualification questions", "Collect need, urgency and fit information", "Route priority leads to the right owner"], benefit: "Teams can focus attention on better-fit opportunities with clearer context.", later: "It becomes valuable when enquiry volume makes manual assessment inefficient.", condition: "Add once qualification criteria are agreed and consistently applied." },
  sales_follow_up: { problems: ["Leads going cold", "Inconsistent follow-up", "Follow-up depending on memory"], responsibilities: ["Start approved follow-up sequences", "Nurture prospects by stage", "Escalate engaged leads for human action"], benefit: "A more dependable path from initial interest to a clear next step.", later: "It can improve conversion once lead capture and qualification are stable.", condition: "Add when follow-up stages, timing and ownership are clearly defined." },
  appointment_coordinator: { problems: ["Manual booking work", "Scheduling delays", "Cancellations and no-shows"], responsibilities: ["Coordinate booking options", "Send confirmations and reminders", "Support cancellation and rescheduling flows"], benefit: "Less scheduling friction and more consistent appointment attendance.", later: "It becomes useful when appointments are a regular conversion or service step.", condition: "Add when booking availability, reminders and exception rules are documented." },
  customer_support: { problems: ["Repetitive support questions", "Slow or inconsistent answers", "Unclear issue routing"], responsibilities: ["Answer approved support questions", "Collect issue details", "Route and escalate requests appropriately"], benefit: "Faster routine support while preserving human attention for complex issues.", later: "It can absorb repeatable service demand after approved guidance is organised.", condition: "Add when FAQs, escalation rules and ownership are ready." },
  payment_follow_up: { problems: ["Outstanding invoices", "Manual payment chasing", "Unclear payment status"], responsibilities: ["Send approved reminders", "Share payment instructions", "Alert staff when follow-up needs human attention"], benefit: "More consistent payment follow-up with less manual administration.", later: "It becomes relevant when payment chasing is frequent or inconsistent.", condition: "Add after reminder timing, tone, exceptions and ownership are approved." },
  review_reactivation: { problems: ["Too few customer reviews", "Inactive customers", "Cold leads and weak repeat engagement"], responsibilities: ["Request reviews at approved moments", "Re-engage inactive contacts", "Route positive responses or renewed interest"], benefit: "A consistent way to strengthen reputation and reconnect with existing relationships.", later: "It can extend value after core enquiry and service journeys are working reliably.", condition: "Add when customer segments, consent and outreach triggers are clearly defined." },
  operations_reporting: { problems: ["Scattered information", "Missed tasks and handovers", "Manual reporting and weak visibility"], responsibilities: ["Create operational summaries", "Notify owners about missed actions", "Track workflow and handover status"], benefit: "Clearer operational visibility and more reliable internal coordination.", later: "It becomes valuable as connected workflows create more activity to monitor.", condition: "Add when ownership, source data and reporting definitions are consistent." },
};

const label = (questionId: QuestionId, answerId: string) => questions.find((question) => question.id === questionId)?.answers.find((answer) => answer.id === answerId)?.label;
const labels = (questionId: QuestionId, answerIds: string[]) => answerIds.map((id) => label(questionId, id)).filter((value): value is string => Boolean(value));
const agent = (id: string) => agents.find((item) => item.id === id);

export function determineReadiness(answerId: string): { level: ReadinessLevel; explanation: string; avoid: string | null } {
  if (answerId === "processes_clearly_documented") return { level: "Ready to Start", explanation: "Your processes and rules are already documented, giving an initial Agent a clear operating foundation.", avoid: null };
  if (["mostly_clear_not_documented", "different_staff_handle_differently"].includes(answerId)) return { level: "Start with Basic Process Setup", explanation: "The operating knowledge exists, but a short documentation and alignment step will make automation more dependable.", avoid: "Avoid automating exceptions or judgement-heavy decisions until the team agrees on one standard process." };
  return { level: "Foundation Needed Before Automation", explanation: "Clarifying the process first will reduce rework and help the first Agent operate within safe, useful boundaries.", avoid: "Do not automate unclear decisions, sensitive exceptions or customer promises until ownership and rules are confirmed." };
}

export function generateFoundationNotes(answers: Answers): string[] {
  const notes = new Set<string>();
  notes.add("Map the customer journey and assign an owner to each handover.");
  if (!["clear_qualification_criteria", "staff_qualify_manually_consistently"].includes(answers.qualification_process[0])) notes.add("Define the questions and criteria that identify a suitable lead.");
  if (!["consistent_multi_step_process", "staff_follow_up_crm"].includes(answers.sales_follow_up_process[0])) notes.add("Agree follow-up stages, timing, ownership and stop conditions.");
  if (["essential_manual_work", "important_cancellations_no_shows"].includes(answers.appointment_process[0])) notes.add("Confirm booking availability, reminder timing and rescheduling rules.");
  if (answers.main_bottlenecks.includes("repetitive_customer_support_requests") || answers.time_consuming_tasks.includes("answering_customer_questions")) notes.add("Prepare approved FAQs and clear escalation rules for customer questions.");
  if (answers.main_bottlenecks.includes("outstanding_invoices_payment_chasing") || answers.time_consuming_tasks.includes("sending_invoices_payment_reminders")) notes.add("Standardise payment reminder timing, tone, exceptions and escalation ownership.");
  if (answers.main_bottlenecks.some((id) => ["manual_reporting_scattered_information", "tasks_handovers_missed"].includes(id))) notes.add("Centralise the essential customer and workflow data used for reporting.");
  return [...notes].slice(0, 5);
}

export function buildAssessmentSnapshot(answers: Answers) {
  return [
    { title: "Business context", items: [label("business_type", answers.business_type[0])!, `Enquiries: ${labels("enquiry_sources", answers.enquiry_sources).join(", ")}`] },
    { title: "Growth priority", items: [label("primary_goal", answers.primary_goal[0])!, `Main bottlenecks: ${labels("main_bottlenecks", answers.main_bottlenecks).join(", ")}`] },
    { title: "Enquiry handling", items: [label("response_speed", answers.response_speed[0])!, label("qualification_process", answers.qualification_process[0])!] },
    { title: "Sales process", items: [label("sales_follow_up_process", answers.sales_follow_up_process[0])!, `Time pressure: ${labels("time_consuming_tasks", answers.time_consuming_tasks).join(", ")}`] },
    { title: "Booking and service", items: [label("appointment_process", answers.appointment_process[0])!] },
    { title: "Operational readiness", items: [label("automation_readiness", answers.automation_readiness[0])!] },
  ];
}

export function buildPublicReport(row: PublicReportRow) {
  const rankedIds = [row.recommendation_1, row.recommendation_2, row.recommendation_3, row.next_phase_1, row.next_phase_2];
  if (!row.business_name || !row.created_at || row.report_generation_status !== "completed" || rankedIds.some((id) => !agent(id))) throw new Error("INCOMPLETE_REPORT");
  if (agentIds.some((id) => typeof row.agent_scores?.[id] !== "number")) throw new Error("INCOMPLETE_REPORT");
  const answers: Answers = { business_type: [row.business_type], primary_goal: [row.primary_goal], enquiry_sources: row.enquiry_sources ?? [], response_speed: [row.response_speed], qualification_process: [row.qualification_process], sales_follow_up_process: [row.sales_follow_up_process], appointment_process: [row.appointment_process], main_bottlenecks: row.main_bottlenecks ?? [], time_consuming_tasks: row.time_consuming_tasks ?? [], automation_readiness: [row.automation_readiness] };
  if (Object.entries(answers).some(([questionId, values]) => !values.length || values.some((id) => !label(questionId as QuestionId, id)))) throw new Error("INCOMPLETE_REPORT");
  const readiness = determineReadiness(row.automation_readiness);
  const foundation = generateFoundationNotes(answers);
  const topThree = rankedIds.slice(0, 3).map((id, index) => {
    const record = agent(id)!;
    const priority = readiness.level !== "Ready to Start" && index === 0 ? "Prepare, Then Start First" : ["Start First", "Add Next", "Build After Foundation"][index];
    return { rank: index + 1, name: record.name, priority, why: `${record.name} aligns with your priority to ${label("primary_goal", row.primary_goal)!.toLowerCase()} and the operational gaps highlighted in your assessment.`, ...agentDetails[record.id], evidence: [labels("main_bottlenecks", row.main_bottlenecks).slice(0, 2).join("; "), labels("time_consuming_tasks", row.time_consuming_tasks).slice(0, 2).join("; ")].filter(Boolean) };
  });
  const scoreOverview = agents.map((record) => ({ name: record.name, score: row.agent_scores[record.id], isTopThree: rankedIds.slice(0, 3).includes(record.id) })).sort((a, b) => b.score - a.score || agents.findIndex((item) => item.name === a.name) - agents.findIndex((item) => item.name === b.name));
  const top = topThree[0];
  const summary = `${row.business_name}'s greatest immediate opportunity is ${labels("main_bottlenecks", row.main_bottlenecks)[0].toLowerCase()}. ${top.name} should address the first operational gap because it most closely matches the saved diagnostic signals and fit scores. ${readiness.level === "Ready to Start" ? "Begin with one focused Agent, prove the handover, then add the next two in sequence." : "Complete the essential foundation actions, then begin with one focused Agent before moving to a staged rollout."} ${readiness.explanation}`;
  const nextPhase = rankedIds.slice(3, 5).map((id) => { const record = agent(id)!; return { name: record.name, why: agentDetails[record.id].later, condition: agentDetails[record.id].condition }; });
  return { businessName: row.business_name, completedAt: row.created_at, summary, readiness: { ...readiness, actions: foundation }, topThree, scoreOverview, maxScore: Math.max(...scoreOverview.map((item) => item.score), 1), sequence: ["Foundation", ...topThree.map((item) => item.name), "Later Expansion"], nextPhase, snapshot: buildAssessmentSnapshot(answers) };
}

export type PublicReportRepository = { findByToken(token: string): Promise<PublicReportRow | null> };
export async function getPublicReport(token: string, repository: PublicReportRepository) {
  if (!/^[a-f0-9]{64}$/.test(token)) return { status: 400 as const, error: "INVALID_TOKEN" as const };
  const row = await repository.findByToken(token);
  if (!row) return { status: 404 as const, error: "NOT_FOUND" as const };
  try { return { status: 200 as const, report: buildPublicReport(row) }; } catch { return { status: 422 as const, error: "INCOMPLETE_REPORT" as const }; }
}
