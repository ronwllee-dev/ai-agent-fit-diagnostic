import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const migration1 = await readFile(
  new URL("../supabase/migrations/0001_init.sql", import.meta.url),
  "utf8",
);
const migration2 = await readFile(
  new URL("../supabase/migrations/0002_harden_submissions.sql", import.meta.url),
  "utf8",
);
const migration3 = await readFile(
  new URL(
    "../supabase/migrations/0003_harden_audit_permissions.sql",
    import.meta.url,
  ),
  "utf8",
);

let assertions = 0;

async function expectSqlState(sql, expectedState, label) {
  try {
    await db.exec(sql);
    assert.fail(`${label}: expected SQLSTATE ${expectedState}`);
  } catch (error) {
    assert.equal(error.code, expectedState, label);
    assertions += 1;
  }
}

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
`);

await db.exec(migration1);
assertions += 1;
await db.exec(migration2);
assertions += 1;
await db.exec(migration3);
assertions += 1;

const validScores = JSON.stringify({
  enquiry_assistant: 8,
  lead_qualification: 7,
  sales_follow_up: 10,
  appointment_coordinator: 6,
  customer_support: 3,
  payment_follow_up: 2,
  review_reactivation: 4,
  operations_reporting: 5,
});

await db.query(
  `insert into public.submissions (
    id, public_report_token, first_name, email, business_name,
    report_processing_consent, report_processing_consent_at,
    business_type, primary_goal, main_bottlenecks, time_consuming_tasks,
    agent_scores, recommendation_1, recommendation_2, recommendation_3,
    next_phase_1, next_phase_2
  ) values (
    '00000000-0000-0000-0000-000000000101',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'Valid', 'valid@example.com', 'Valid Business',
    true, now(), 'professional_services_consulting', 'convert_more_leads',
    array['leads_going_cold'], array['following_up_with_leads'],
    $1::jsonb, 'sales_follow_up', 'enquiry_assistant', 'lead_qualification',
    'appointment_coordinator', 'operations_reporting'
  )`,
  [validScores],
);
assertions += 1;

await expectSqlState(
  `insert into public.submissions (first_name, email, business_name, business_type, primary_goal, report_generation_status)
   values ('Bad', 'bad-status@example.com', 'Bad', 'other', 'convert_more_leads', 'unknown')`,
  "23514",
  "invalid report status is rejected",
);

await expectSqlState(
  `insert into public.submissions (first_name, email, business_name, business_type, primary_goal, crm_sync_status)
   values ('Bad', 'bad-crm@example.com', 'Bad', 'other', 'convert_more_leads', 'unknown')`,
  "23514",
  "invalid CRM status is rejected",
);

await expectSqlState(
  `insert into public.submissions (first_name, email, business_name, business_type, primary_goal, main_bottlenecks)
   values ('Bad', 'too-many@example.com', 'Bad', 'other', 'convert_more_leads', array['a','b','c','d'])`,
  "23514",
  "more than three selections are rejected",
);

await expectSqlState(
  `insert into public.submissions (first_name, email, business_name, business_type, primary_goal, recommendation_1, recommendation_2)
   values ('Bad', 'duplicate@example.com', 'Bad', 'other', 'convert_more_leads', 'enquiry_assistant', 'enquiry_assistant')`,
  "23514",
  "duplicate recommendations are rejected",
);

await expectSqlState(
  `insert into public.submissions (first_name, email, business_name, business_type, primary_goal, recommendation_1)
   values ('Bad', 'unknown-agent@example.com', 'Bad', 'other', 'convert_more_leads', 'unknown_agent')`,
  "23514",
  "unknown Agent IDs are rejected",
);

await expectSqlState(
  `insert into public.submissions (first_name, email, business_name, business_type, primary_goal, agent_scores)
   values ('Bad', 'scores@example.com', 'Bad', 'other', 'convert_more_leads', '{"enquiry_assistant":"high"}'::jsonb)`,
  "23514",
  "malformed agent scores are rejected",
);

await expectSqlState(
  `insert into public.submissions (public_report_token, first_name, email, business_name, business_type, primary_goal)
   values ('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Duplicate', 'duplicate-token@example.com', 'Bad', 'other', 'convert_more_leads')`,
  "23505",
  "public report tokens remain unique",
);

await new Promise((resolve) => setTimeout(resolve, 15));
await db.exec(`update public.submissions set business_name = 'Updated Business'
  where id = '00000000-0000-0000-0000-000000000101'`);
const updated = await db.query(`select updated_at > created_at as advanced
  from public.submissions where id = '00000000-0000-0000-0000-000000000101'`);
assert.equal(updated.rows[0].advanced, true, "updated_at advances on update");
assertions += 1;

const rotated = await db.query(`
  select count(*)::int as total,
         count(distinct public_report_token)::int as distinct_total,
         bool_and(length(public_report_token) = 64) as secure_length
  from public.submissions
  where email in (
    'sarah@brightleafcoaching.com', 'james@primetradeservices.co.uk',
    'priya@claritylegal.co.uk', 'marcus@nexusgrowthagency.com'
  )
`);
assert.deepEqual(
  rotated.rows[0],
  { total: 4, distinct_total: 4, secure_length: true },
  "all predictable demo tokens are rotated to distinct 64-character tokens",
);
assertions += 1;

await db.exec("set role anon");
await expectSqlState(
  "select count(*) from public.submissions",
  "42501",
  "anonymous reads are rejected",
);
await expectSqlState(
  "update public.submissions set business_name = 'Anonymous update'",
  "42501",
  "anonymous updates are rejected",
);
await expectSqlState(
  "delete from public.submissions",
  "42501",
  "anonymous deletes are rejected",
);
await db.exec("reset role");

await db.exec(`insert into public.submission_audit_log
  (submission_id, action, actor, source)
  values ('00000000-0000-0000-0000-000000000101', 'created', 'system', 'system')`);
await expectSqlState(
  "update public.submission_audit_log set action = 'changed'",
  "55000",
  "audit log rows cannot be updated",
);

const auditPrivileges = await db.query(`
  select
    has_table_privilege('service_role', 'public.submission_audit_log', 'SELECT') as can_select,
    has_table_privilege('service_role', 'public.submission_audit_log', 'INSERT') as can_insert,
    has_table_privilege('service_role', 'public.submission_audit_log', 'UPDATE') as can_update,
    has_table_privilege('service_role', 'public.submission_audit_log', 'DELETE') as can_delete,
    has_table_privilege('service_role', 'public.submission_audit_log', 'TRUNCATE') as can_truncate,
    has_sequence_privilege('service_role', 'public.submission_audit_log_id_seq', 'USAGE') as sequence_usage,
    has_sequence_privilege('service_role', 'public.submission_audit_log_id_seq', 'SELECT') as sequence_select
`);
assert.deepEqual(
  auditPrivileges.rows[0],
  {
    can_select: true,
    can_insert: true,
    can_update: false,
    can_delete: false,
    can_truncate: false,
    sequence_usage: true,
    sequence_select: true,
  },
  "service_role has only the required append-only audit privileges",
);
assertions += 1;

console.log(`Database migration checks passed: ${assertions} assertions`);
await db.close();
