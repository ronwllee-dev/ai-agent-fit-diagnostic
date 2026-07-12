begin;

create extension if not exists pgtap with schema extensions;

select plan(14);

select lives_ok(
  $$
    insert into public.submissions (
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
      '{"enquiry_assistant":8,"lead_qualification":7,"sales_follow_up":10,"appointment_coordinator":6,"customer_support":3,"payment_follow_up":2,"review_reactivation":4,"operations_reporting":5}'::jsonb,
      'sales_follow_up', 'enquiry_assistant', 'lead_qualification',
      'appointment_coordinator', 'operations_reporting'
    )
  $$,
  'a valid complete submission is accepted'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, report_generation_status) values ('Bad', 'bad-status@example.com', 'Bad', 'other', 'convert_more_leads', 'unknown')$$,
  '23514',
  null,
  'an invalid report status is rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, crm_sync_status) values ('Bad', 'bad-crm@example.com', 'Bad', 'other', 'convert_more_leads', 'unknown')$$,
  '23514',
  null,
  'an invalid CRM status is rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, main_bottlenecks) values ('Bad', 'too-many@example.com', 'Bad', 'other', 'convert_more_leads', array['a','b','c','d'])$$,
  '23514',
  null,
  'more than three bottlenecks are rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, time_consuming_tasks) values ('Bad', 'too-many-tasks@example.com', 'Bad', 'other', 'convert_more_leads', array['a','b','c','d'])$$,
  '23514',
  null,
  'more than three time-consuming tasks are rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, recommendation_1, recommendation_2) values ('Bad', 'duplicate@example.com', 'Bad', 'other', 'convert_more_leads', 'enquiry_assistant', 'enquiry_assistant')$$,
  '23514',
  null,
  'duplicate recommendations are rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, recommendation_1) values ('Bad', 'unknown-agent@example.com', 'Bad', 'other', 'convert_more_leads', 'unknown_agent')$$,
  '23514',
  null,
  'unknown Agent IDs are rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, agent_scores) values ('Bad', 'scores@example.com', 'Bad', 'other', 'convert_more_leads', '{"enquiry_assistant":"high"}'::jsonb)$$,
  '23514',
  null,
  'malformed agent scores are rejected'
);

select throws_ok(
  $$insert into public.submissions (first_name, email, business_name, business_type, primary_goal, report_processing_consent) values ('Bad', 'consent@example.com', 'Bad', 'other', 'convert_more_leads', true)$$,
  '23514',
  null,
  'consent without its timestamp is rejected'
);

select throws_ok(
  $$insert into public.submissions (public_report_token, first_name, email, business_name, business_type, primary_goal) values ('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Duplicate', 'duplicate-token@example.com', 'Bad', 'other', 'convert_more_leads')$$,
  '23505',
  null,
  'public report tokens remain unique'
);

select pg_sleep(0.01);
update public.submissions
set business_name = 'Updated Business'
where id = '00000000-0000-0000-0000-000000000101';

select cmp_ok(
  updated_at,
  '>',
  created_at,
  'updated_at advances on update'
)
from public.submissions
where id = '00000000-0000-0000-0000-000000000101';

set local role anon;
select throws_ok(
  $$select count(*) from public.submissions$$,
  '42501',
  null,
  'anonymous reads are rejected'
);
select throws_ok(
  $$update public.submissions set business_name = 'Anonymous update' where id = '00000000-0000-0000-0000-000000000101'$$,
  '42501',
  null,
  'anonymous updates are rejected'
);
select throws_ok(
  $$delete from public.submissions where id = '00000000-0000-0000-0000-000000000101'$$,
  '42501',
  null,
  'anonymous deletes are rejected'
);
reset role;

select * from finish();

rollback;
