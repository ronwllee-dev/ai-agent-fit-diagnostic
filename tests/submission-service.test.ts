import { describe, expect, it } from "vitest";
import { createSubmission, reportTokenFor, type SubmissionRepository } from "@/lib/diagnostic/submission-service";
import { validPayload } from "./fixtures";

function memoryRepository() { const rows: Record<string, unknown>[]=[]; const audits: Record<string, unknown>[]=[]; const repository: SubmissionRepository={ async findByToken(token){ const row=rows.find((r)=>r.public_report_token===token); return row ? { public_report_token:String(row.public_report_token) } : null; }, async insert(row){ rows.push(row); return { id:"saved-id",public_report_token:String(row.public_report_token) }; }, async audit(submissionId,row){ audits.push({submissionId,...row}); } }; return { repository,rows,audits }; }

describe("submission API service", () => {
  it("returns 400 without persisting invalid payloads", async () => { const db=memoryRepository(); const result=await createSubmission({},db.repository,"secret"); expect(result.status).toBe(400); expect(db.rows).toHaveLength(0); });
  it("persists complete answers, all scores, report content, consent and token", async () => { const db=memoryRepository(); const result=await createSubmission(validPayload,db.repository,"secret"); expect(result.status).toBe(201); expect(result.ok).toBe(true); expect(db.rows).toHaveLength(1); expect(db.rows[0]).toMatchObject({business_type:"professional_services_consulting",main_bottlenecks:validPayload.answers.main_bottlenecks,report_generation_status:"completed",report_processing_consent:true,workforce_summary_source:"template"}); expect(Object.keys(db.rows[0].agent_scores as object)).toHaveLength(8); expect(String(db.rows[0].public_report_token)).toMatch(/^[a-f0-9]{64}$/); expect(db.audits).toHaveLength(1); });
  it("deduplicates retries by their secure idempotency token", async () => { const db=memoryRepository(); const first=await createSubmission(validPayload,db.repository,"secret"); const second=await createSubmission(validPayload,db.repository,"secret"); expect(second).toMatchObject({ok:true,status:200,duplicate:true,reportToken:first.ok ? first.reportToken : ""}); expect(db.rows).toHaveLength(1); });
  it("does not expose the raw idempotency key as its token", () => expect(reportTokenFor(validPayload.idempotencyKey,"secret")).not.toContain(validPayload.idempotencyKey));
});
