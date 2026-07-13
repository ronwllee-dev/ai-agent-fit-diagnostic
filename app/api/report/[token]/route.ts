import { NextResponse } from "next/server";
import { getPublicReport } from "@/lib/diagnostic/public-report";
import { createPublicReportRepository } from "@/lib/supabase/public-report";

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  try {
    const result = await getPublicReport(token, createPublicReportRepository());
    if (result.status === 200) return NextResponse.json(result.report);
    const messages = { INVALID_TOKEN: "This report link is invalid.", NOT_FOUND: "We could not find this report.", INCOMPLETE_REPORT: "This report is not ready yet." };
    return NextResponse.json({ error: messages[result.error] }, { status: result.status });
  } catch (error) { console.error("Report lookup failed", error); return NextResponse.json({ error: "Report is temporarily unavailable." }, { status: 500 }); }
}
