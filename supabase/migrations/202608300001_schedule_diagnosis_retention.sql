create extension if not exists pg_cron;

select cron.schedule(
  'delete-old-diagnosis-results',
  '15 3 1 * *',
  $$delete from public.diagnosis_results where created_at < now() - interval '24 months'$$
);
