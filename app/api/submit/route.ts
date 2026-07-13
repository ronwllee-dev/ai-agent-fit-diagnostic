import { NextResponse } from "next/server";
import { createSubmission, type SubmissionRepository } from "@/lib/diagnostic/submission-service";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = createServiceClient();
    const repository: SubmissionRepository = {
      async findByToken(token) { const { data, error } = await db.from("submissions").select("public_report_token").eq("public_report_token", token).maybeSingle(); if (error) throw error; return data; },
      async insert(row) { const { data, error } = await db.from("submissions").insert(row).select("id,public_report_token").single(); if (error) throw error; return data; },
      async audit(submissionId, row) { const { error } = await db.from("submission_audit_log").insert({ submission_id: submissionId, ...row }); if (error) throw error; },
    };
    const result = await createSubmission(body, repository, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    return NextResponse.json(result.ok ? { reportToken: result.reportToken, duplicate: result.duplicate } : { errors: result.errors }, { status: result.status });
  } catch (error) {
    console.error("Submission failed", error);
    return NextResponse.json({ error: "We could not create your report. Please try again." }, { status: 500 });
  }
}
