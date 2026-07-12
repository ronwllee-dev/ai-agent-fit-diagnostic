begin;

revoke all privileges
  on table public.submission_audit_log
  from service_role;

revoke all privileges
  on sequence public.submission_audit_log_id_seq
  from service_role;

grant select, insert
  on table public.submission_audit_log
  to service_role;

grant usage, select
  on sequence public.submission_audit_log_id_seq
  to service_role;

commit;
