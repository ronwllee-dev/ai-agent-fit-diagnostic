begin;

-- Preflight: fail before changing security or schema objects if existing rows
-- would violate the constraints introduced below.
do $$
declare
  invalid_count bigint;
begin
  select count(*) into invalid_count
  from public.submissions
  where report_generation_status not in ('pending', 'processing', 'completed', 'failed');
  if invalid_count > 0 then
    raise exception 'Preflight failed: % invalid report_generation_status row(s)', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where crm_sync_status not in ('not_started', 'pending', 'completed', 'failed');
  if invalid_count > 0 then
    raise exception 'Preflight failed: % invalid crm_sync_status row(s)', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where report_processing_consent is distinct from (report_processing_consent_at is not null)
     or marketing_consent is distinct from (marketing_consent_at is not null);
  if invalid_count > 0 then
    raise exception 'Preflight failed: % inconsistent consent row(s)', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where coalesce(cardinality(main_bottlenecks), 0) > 3
     or coalesce(cardinality(time_consuming_tasks), 0) > 3;
  if invalid_count > 0 then
    raise exception 'Preflight failed: % row(s) exceed a maximum-three selection', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where (recommendation_1 is not null and recommendation_1 not in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
     or (recommendation_2 is not null and recommendation_2 not in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
     or (recommendation_3 is not null and recommendation_3 not in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
     or (next_phase_1 is not null and next_phase_1 not in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
     or (next_phase_2 is not null and next_phase_2 not in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'));
  if invalid_count > 0 then
    raise exception 'Preflight failed: % row(s) contain an unknown AI Agent ID', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where (recommendation_1 is not null and recommendation_1 in (recommendation_2, recommendation_3, next_phase_1, next_phase_2))
     or (recommendation_2 is not null and recommendation_2 in (recommendation_3, next_phase_1, next_phase_2))
     or (recommendation_3 is not null and recommendation_3 in (next_phase_1, next_phase_2))
     or (next_phase_1 is not null and next_phase_1 = next_phase_2);
  if invalid_count > 0 then
    raise exception 'Preflight failed: % row(s) contain duplicate recommendations', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where (workforce_summary_confidence is not null and workforce_summary_confidence not between 0 and 1)
     or (recommendation_content_confidence is not null and recommendation_content_confidence not between 0 and 1)
     or (workforce_sequence_confidence is not null and workforce_sequence_confidence not between 0 and 1)
     or (readiness_notes_confidence is not null and readiness_notes_confidence not between 0 and 1)
     or (next_phase_content_confidence is not null and next_phase_content_confidence not between 0 and 1);
  if invalid_count > 0 then
    raise exception 'Preflight failed: % row(s) contain an out-of-range confidence value', invalid_count;
  end if;

  select count(*) into invalid_count
  from public.submissions
  where agent_scores is not null
    and not (
      jsonb_typeof(agent_scores) = 'object'
      and agent_scores ?& array['enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting']
      and agent_scores - array['enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'] = '{}'::jsonb
      and jsonb_typeof(agent_scores -> 'enquiry_assistant') = 'number'
      and jsonb_typeof(agent_scores -> 'lead_qualification') = 'number'
      and jsonb_typeof(agent_scores -> 'sales_follow_up') = 'number'
      and jsonb_typeof(agent_scores -> 'appointment_coordinator') = 'number'
      and jsonb_typeof(agent_scores -> 'customer_support') = 'number'
      and jsonb_typeof(agent_scores -> 'payment_follow_up') = 'number'
      and jsonb_typeof(agent_scores -> 'review_reactivation') = 'number'
      and jsonb_typeof(agent_scores -> 'operations_reporting') = 'number'
    );
  if invalid_count > 0 then
    raise exception 'Preflight failed: % row(s) contain malformed agent_scores', invalid_count;
  end if;
end
$$;

alter table public.submissions
  add constraint submissions_report_generation_status_check
    check (report_generation_status in ('pending', 'processing', 'completed', 'failed')) not valid,
  add constraint submissions_crm_sync_status_check
    check (crm_sync_status in ('not_started', 'pending', 'completed', 'failed')) not valid,
  add constraint submissions_report_consent_consistency_check
    check (report_processing_consent is not distinct from (report_processing_consent_at is not null)) not valid,
  add constraint submissions_marketing_consent_consistency_check
    check (marketing_consent is not distinct from (marketing_consent_at is not null)) not valid,
  add constraint submissions_main_bottlenecks_max_three_check
    check (coalesce(cardinality(main_bottlenecks), 0) <= 3) not valid,
  add constraint submissions_time_consuming_tasks_max_three_check
    check (coalesce(cardinality(time_consuming_tasks), 0) <= 3) not valid,
  add constraint submissions_known_agent_ids_check
    check (
      (recommendation_1 is null or recommendation_1 in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
      and (recommendation_2 is null or recommendation_2 in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
      and (recommendation_3 is null or recommendation_3 in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
      and (next_phase_1 is null or next_phase_1 in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
      and (next_phase_2 is null or next_phase_2 in ('enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'))
    ) not valid,
  add constraint submissions_distinct_recommendations_check
    check (
      (recommendation_1 is null or recommendation_1 not in (recommendation_2, recommendation_3, next_phase_1, next_phase_2))
      and (recommendation_2 is null or recommendation_2 not in (recommendation_3, next_phase_1, next_phase_2))
      and (recommendation_3 is null or recommendation_3 not in (next_phase_1, next_phase_2))
      and (next_phase_1 is null or next_phase_2 is null or next_phase_1 <> next_phase_2)
    ) not valid,
  add constraint submissions_confidence_ranges_check
    check (
      (workforce_summary_confidence is null or workforce_summary_confidence between 0 and 1)
      and (recommendation_content_confidence is null or recommendation_content_confidence between 0 and 1)
      and (workforce_sequence_confidence is null or workforce_sequence_confidence between 0 and 1)
      and (readiness_notes_confidence is null or readiness_notes_confidence between 0 and 1)
      and (next_phase_content_confidence is null or next_phase_content_confidence between 0 and 1)
    ) not valid,
  add constraint submissions_agent_scores_shape_check
    check (
      agent_scores is null or (
        jsonb_typeof(agent_scores) = 'object'
        and agent_scores ?& array['enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting']
        and agent_scores - array['enquiry_assistant', 'lead_qualification', 'sales_follow_up', 'appointment_coordinator', 'customer_support', 'payment_follow_up', 'review_reactivation', 'operations_reporting'] = '{}'::jsonb
        and jsonb_typeof(agent_scores -> 'enquiry_assistant') = 'number'
        and jsonb_typeof(agent_scores -> 'lead_qualification') = 'number'
        and jsonb_typeof(agent_scores -> 'sales_follow_up') = 'number'
        and jsonb_typeof(agent_scores -> 'appointment_coordinator') = 'number'
        and jsonb_typeof(agent_scores -> 'customer_support') = 'number'
        and jsonb_typeof(agent_scores -> 'payment_follow_up') = 'number'
        and jsonb_typeof(agent_scores -> 'review_reactivation') = 'number'
        and jsonb_typeof(agent_scores -> 'operations_reporting') = 'number'
      )
    ) not valid;

alter table public.submissions validate constraint submissions_report_generation_status_check;
alter table public.submissions validate constraint submissions_crm_sync_status_check;
alter table public.submissions validate constraint submissions_report_consent_consistency_check;
alter table public.submissions validate constraint submissions_marketing_consent_consistency_check;
alter table public.submissions validate constraint submissions_main_bottlenecks_max_three_check;
alter table public.submissions validate constraint submissions_time_consuming_tasks_max_three_check;
alter table public.submissions validate constraint submissions_known_agent_ids_check;
alter table public.submissions validate constraint submissions_distinct_recommendations_check;
alter table public.submissions validate constraint submissions_confidence_ranges_check;
alter table public.submissions validate constraint submissions_agent_scores_shape_check;

create or replace function public.set_submissions_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

drop trigger if exists submissions_set_updated_at on public.submissions;
create trigger submissions_set_updated_at
before update on public.submissions
for each row execute function public.set_submissions_updated_at();

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_email_lower_idx on public.submissions (lower(email));
create index if not exists submissions_business_type_idx on public.submissions (business_type);
create index if not exists submissions_primary_goal_idx on public.submissions (primary_goal);
create index if not exists submissions_report_generation_status_idx on public.submissions (report_generation_status);
create index if not exists submissions_crm_sync_status_idx on public.submissions (crm_sync_status);
create index if not exists submissions_recommendation_1_idx on public.submissions (recommendation_1);
create index if not exists submissions_recommendation_2_idx on public.submissions (recommendation_2);
create index if not exists submissions_recommendation_3_idx on public.submissions (recommendation_3);
create index if not exists submissions_next_phase_1_idx on public.submissions (next_phase_1);
create index if not exists submissions_next_phase_2_idx on public.submissions (next_phase_2);

-- Rotate only the four predictable seed tokens. The expression is evaluated
-- independently for every row and retains the existing 64-character format.
update public.submissions
set public_report_token = replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
where public_report_token in (
  'demo_token_alpha_001',
  'demo_token_beta_002',
  'demo_token_gamma_003',
  'demo_token_delta_004'
);

drop policy if exists submissions_v1_read on public.submissions;
drop policy if exists submissions_v1_write on public.submissions;
revoke all privileges on table public.submissions from anon, authenticated;
grant all privileges on table public.submissions to service_role;

create table public.submission_audit_log (
  id bigint generated always as identity primary key,
  submission_id uuid not null references public.submissions(id) on delete restrict,
  action text not null,
  actor text not null,
  occurred_at timestamptz not null default now(),
  before_state jsonb,
  after_state jsonb,
  source text not null check (source in ('template', 'llm', 'admin', 'system'))
);

create index submission_audit_log_submission_id_idx
  on public.submission_audit_log (submission_id, occurred_at desc);

alter table public.submission_audit_log enable row level security;
revoke all privileges on table public.submission_audit_log from public, anon, authenticated;
revoke all privileges on sequence public.submission_audit_log_id_seq from public, anon, authenticated;
grant select, insert on table public.submission_audit_log to service_role;
grant usage, select on sequence public.submission_audit_log_id_seq to service_role;

create or replace function public.prevent_submission_audit_log_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'submission_audit_log is append-only' using errcode = '55000';
end;
$$;

create trigger submission_audit_log_prevent_update_delete
before update or delete on public.submission_audit_log
for each row execute function public.prevent_submission_audit_log_mutation();

commit;
