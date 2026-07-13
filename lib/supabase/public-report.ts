import "server-only";
import type { PublicReportRepository, PublicReportRow } from "@/lib/diagnostic/public-report";
import { createServiceClient } from "./service";

export const publicReportColumns = "business_name,created_at,business_type,primary_goal,enquiry_sources,response_speed,qualification_process,sales_follow_up_process,appointment_process,main_bottlenecks,time_consuming_tasks,automation_readiness,agent_scores,recommendation_1,recommendation_2,recommendation_3,next_phase_1,next_phase_2,report_generation_status";

export function createPublicReportRepository(): PublicReportRepository {
  const db = createServiceClient();
  return {
    async findByToken(token) {
      const { data, error } = await db.from("submissions").select(publicReportColumns).eq("public_report_token", token).maybeSingle();
      if (error) throw error;
      return data as unknown as PublicReportRow | null;
    },
  };
}
