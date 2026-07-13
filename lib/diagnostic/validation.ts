import { questions, type Answers } from "./questions";

export type Contact = { firstName: string; lastName?: string; email: string; phone?: string; businessName: string; website?: string; reportProcessingConsent: boolean; marketingConsent?: boolean };
export type SubmissionPayload = { idempotencyKey: string; answers: Answers; contact: Contact };
export type ValidationResult = { ok: true; value: SubmissionPayload } | { ok: false; errors: Record<string, string> };

export function validateAnswers(value: unknown): { ok: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, errors: { answers: "Answers are required." } };
  const answers = value as Record<string, unknown>;
  for (const question of questions) {
    const selected = answers[question.id];
    if (!Array.isArray(selected) || selected.length === 0) { errors[question.id] = "Choose an answer to continue."; continue; }
    if (selected.some((id) => typeof id !== "string" || !question.answers.some((answer) => answer.id === id))) errors[question.id] = "One or more answers are invalid.";
    if (new Set(selected).size !== selected.length) errors[question.id] = "Duplicate answers are not allowed.";
    if (question.type === "single" && selected.length !== 1) errors[question.id] = "Choose one answer only.";
    if (question.max && selected.length > question.max) errors[question.id] = `Choose no more than ${question.max} answers.`;
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
export function validateSubmission(value: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, errors: { payload: "A valid submission is required." } };
  const input = value as Partial<SubmissionPayload>;
  const answerResult = validateAnswers(input.answers);
  Object.assign(errors, answerResult.errors);
  if (!input.contact || typeof input.contact !== "object") errors.contact = "Contact details are required.";
  else {
    const c = input.contact;
    if (!c.firstName?.trim()) errors.firstName = "First name is required.";
    if (!c.businessName?.trim()) errors.businessName = "Business name is required.";
    if (!c.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) errors.email = "Enter a valid email address.";
    if (c.website && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(c.website)) errors.website = "Enter a valid website.";
    if (c.reportProcessingConsent !== true) errors.reportProcessingConsent = "Consent is required to create your report.";
  }
  if (!input.idempotencyKey || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.idempotencyKey)) errors.idempotencyKey = "A valid submission key is required.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: input as SubmissionPayload };
}
