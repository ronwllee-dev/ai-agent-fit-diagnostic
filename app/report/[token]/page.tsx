import { getPublicReport } from "@/lib/diagnostic/public-report";
import { createPublicReportRepository } from "@/lib/supabase/public-report";
import { ReportContent, ReportState } from "./report-content";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const result = await getPublicReport(token, createPublicReportRepository());
    if (result.status === 200) return <ReportContent report={result.report} />;
    if (result.error === "INVALID_TOKEN") return <ReportState title="This report link is invalid" message="Check that the complete link was copied, or start a new diagnostic." />;
    if (result.error === "NOT_FOUND") return <ReportState title="Report not found" message="This report may no longer be available, or the link may be incorrect." />;
    return <ReportState title="Your report is still being prepared" message="The submission was found, but the report is not complete yet. Please try again shortly." />;
  } catch (error) {
    console.error("Report page failed", error);
    return <ReportState title="Report temporarily unavailable" message="We could not load the report just now. Please refresh the page in a moment." />;
  }
}
