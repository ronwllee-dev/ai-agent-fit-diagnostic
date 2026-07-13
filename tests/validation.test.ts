import { describe, expect, it } from "vitest";
import { validateAnswers, validateSubmission } from "@/lib/diagnostic/validation";
import { validAnswers, validPayload } from "./fixtures";

describe("question validation", () => {
  it("accepts a complete stable-ID answer set", () => expect(validateAnswers(validAnswers).ok).toBe(true));
  it("rejects missing required answers", () => { const answers = { ...validAnswers, response_speed: [] }; expect(validateAnswers(answers).errors.response_speed).toBeTruthy(); });
  it("rejects unknown and duplicate stable IDs", () => { expect(validateAnswers({ ...validAnswers, business_type: ["made_up"] }).ok).toBe(false); expect(validateAnswers({ ...validAnswers, enquiry_sources: ["email", "email"] }).ok).toBe(false); });
  it("requires contact fields, valid email, and report consent", () => { const result = validateSubmission({ ...validPayload, contact: { firstName: "", email: "bad", businessName: "", reportProcessingConsent: false } }); expect(result.ok).toBe(false); if (!result.ok) expect(Object.keys(result.errors)).toEqual(expect.arrayContaining(["firstName", "email", "businessName", "reportProcessingConsent"])); });
});
describe("maximum-three rules", () => {
  it.each(["main_bottlenecks", "time_consuming_tasks"] as const)("rejects four selections for %s", (id) => { const result = validateAnswers({ ...validAnswers, [id]: id === "main_bottlenecks" ? ["slow_responses_outside_hours", "leads_going_cold", "manual_appointment_booking", "too_many_unsuitable_leads"] : ["replying_to_new_enquiries", "following_up_with_leads", "booking_rescheduling_appointments", "preparing_reports"] }); expect(result.errors[id]).toContain("no more than 3"); });
});
