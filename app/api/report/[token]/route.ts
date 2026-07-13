import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  if (!/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  try {
    const db = createServiceClient();
    const { data, error } = await db.from("submissions").select("public_report_token,business_name,created_at,recommendation_1,recommendation_2,recommendation_3,next_phase_1,next_phase_2,agent_scores,full_report_content,report_generation_status").eq("public_report_token", token).maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Report not found." }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) { console.error("Report lookup failed", error); return NextResponse.json({ error: "Report is temporarily unavailable." }, { status: 500 }); }
}
