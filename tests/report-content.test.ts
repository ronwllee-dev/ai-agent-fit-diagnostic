import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const content = readFileSync(fileURLToPath(new URL("../app/report/[token]/report-content.tsx", import.meta.url)), "utf8");
const actions = readFileSync(fileURLToPath(new URL("../app/report/[token]/report-actions.tsx", import.meta.url)), "utf8");
const page = readFileSync(fileURLToPath(new URL("../app/report/[token]/page.tsx", import.meta.url)), "utf8");
const loading = readFileSync(fileURLToPath(new URL("../app/report/[token]/loading.tsx", import.meta.url)), "utf8");

describe("report page components", () => {
  it.each(["AI Workforce Fit Report", "Your first three AI Agents", "Diagnostic Fit Score", "Implementation sequence", "Possible Next-Phase Agents", "Assessment snapshot"])("contains the %s section", (text) => expect(content).toContain(text));
  it("provides copy, print and restart actions", () => { expect(actions).toContain("navigator.clipboard"); expect(actions).toContain("window.print()"); expect(actions).toContain("Start another diagnostic"); expect(actions).toContain("Copy unavailable"); });
  it("provides loading, malformed, not-found, incomplete and failure states", () => { expect(loading).toContain("Loading your report"); for (const state of ["invalid", "Report not found", "still being prepared", "temporarily unavailable"]) expect(page).toContain(state); });
  it("does not render private fields or internal IDs", () => { for (const hidden of ["email", "phone", "consent", "public_report_token", "enquiry_assistant"]) expect(content).not.toContain(hidden); });
});
