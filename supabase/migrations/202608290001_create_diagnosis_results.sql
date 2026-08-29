create table if not exists public.diagnosis_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null,
  score_a smallint not null check (score_a between 3 and 12),
  score_b smallint not null check (score_b between 3 and 12),
  score_c smallint not null check (score_c between 3 and 12),
  score_d smallint not null check (score_d between 3 and 12),
  total_score smallint not null check (total_score between 12 and 48),
  level smallint not null check (level between 1 and 5),
  diagnosis_type text not null check (diagnosis_type in ('体系化不足型', '教材化不足型', '運用不足型', '改善不足型')),
  secondary_weak_types text[] not null default '{}',
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  app_version text not null
);

alter table public.diagnosis_results enable row level security;

revoke all on table public.diagnosis_results from anon, authenticated;

create index if not exists diagnosis_results_created_at_idx on public.diagnosis_results (created_at desc);
create index if not exists diagnosis_results_level_idx on public.diagnosis_results (level);
create index if not exists diagnosis_results_type_idx on public.diagnosis_results (diagnosis_type);
