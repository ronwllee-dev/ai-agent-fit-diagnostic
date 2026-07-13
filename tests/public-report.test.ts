import { describe, expect, it } from "vitest";
import { buildPublicReport, determineReadiness, generateFoundationNotes, getPublicReport } from "@/lib/diagnostic/public-report";
import { reportRow, validAnswers } from "./fixtures";

describe("deterministic public report", () => {
  it("generates the same fit summary for the same saved data", () => expect(buildPublicReport(reportRow).summary).toBe(buildPublicReport(reportRow).summary));
  it.each([
    ["processes_clearly_documented", "Ready to Start"],
    ["mostly_clear_not_documented", "Start with Basic Process Setup"],
    ["not_sure", "Foundation Needed Before Automation"],
  ])("maps readiness %s to %s", (answer, level) => expect(determineReadiness(answer).level).toBe(level));
  it("generates relevant foundation actions", () => { const notes = generateFoundationNotes(validAnswers); expect(notes.length).toBeGreaterThanOrEqual(2); expect(notes.join(" ")).toContain("suitable lead"); });
  it("assigns public priority labels and saved top-three order", () => expect(buildPublicReport(reportRow).topThree.map(({ name, priority }) => ({ name, priority }))).toEqual([{ name: "AI Enquiry Assistant", priority: "Prepare, Then Start First" }, { name: "Sales Follow-Up Agent", priority: "Add Next" }, { name: "Appointment Coordinator", priority: "Build After Foundation" }]));
  it("formats next-phase recommendations and readable assessment labels", () => { const report = buildPublicReport(reportRow); expect(report.nextPhase.map((item) => item.name)).toEqual(["Lead Qualification Agent", "Operations and Reporting Assistant"]); expect(report.snapshot.flatMap((group) => group.items).join(" ")).toContain("Professional services or consulting"); expect(JSON.stringify(report.snapshot)).not.toContain("professional_services_consulting"); });
  it("rejects missing report data", () => expect(() => buildPublicReport({ ...reportRow, agent_scores: {} })).toThrow("INCOMPLETE_REPORT"));
});

describe("public report retrieval", () => {
  const token = "a".repeat(64);
  it("returns safe report data for a valid token", async () => { const result = await getPublicReport(token, { findByToken: async () => reportRow }); expect(result.status).toBe(200); if (result.status === 200) { expect(result.report.scoreOverview).toHaveLength(8); expect(result.report.topThree.map((item) => item.name)).toEqual(["AI Enquiry Assistant", "Sales Follow-Up Agent", "Appointment Coordinator"]); expect(result.report.nextPhase).toHaveLength(2); expect(result.report).not.toHaveProperty("email"); expect(result.report).not.toHaveProperty("public_report_token"); expect(JSON.stringify(result.report)).not.toContain("report_processing_consent"); } });
  it("rejects malformed tokens without querying", async () => { let queried=false; const result=await getPublicReport("bad",{findByToken:async()=>{queried=true;return reportRow;}}); expect(result.status).toBe(400); expect(queried).toBe(false); });
  it("returns not found for an unknown token", async () => expect((await getPublicReport(token,{findByToken:async()=>null})).status).toBe(404));
});
