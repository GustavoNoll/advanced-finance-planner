
create table public.profiles (
  id uuid not null,
  is_broker boolean null default false,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  name text null,
  birth_date date null,
  broker_id uuid null,
  constraint profiles_pkey primary key (id),
  constraint profiles_broker_id_fkey foreign KEY (broker_id) references auth.users (id) on delete set null,
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id)
) TABLESPACE pg_default;

create table public.investment_plans (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone null default now(),
  user_id uuid not null,
  initial_amount numeric not null,
  final_age integer not null,
  monthly_deposit numeric not null,
  desired_income numeric not null,
  expected_return numeric not null,
  inflation numeric not null,
  plan_type character varying(1) not null,
  future_value numeric not null,
  inflation_adjusted_income numeric not null,
  required_monthly_deposit numeric not null,
  adjust_contribution_for_inflation boolean not null default false,
  adjust_income_for_inflation boolean not null default false,
  plan_initial_date date not null,
  status character varying(20) null default 'active'::character varying,
  constraint investment_plans_pkey primary key (id),
  constraint investment_plans_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint check_plan_type check (
    (
      (plan_type)::text = any (
        (
          array[
            '1'::character varying,
            '2'::character varying,
            '3'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint check_ages check ((final_age > initial_age)),
  constraint check_status check (
    (
      (status)::text = any (
        (
          array[
            'active'::character varying,
            'inactive'::character varying,
            'deleted'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint check_rates check (
    (
      (expected_return >= (0)::numeric)
      and (inflation >= (0)::numeric)
    )
  ),
  constraint check_amounts check (
    (
      (initial_amount >= (0)::numeric)
      and (monthly_deposit >= (0)::numeric)
      and (desired_income >= (0)::numeric)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_investment_plans_user_id on public.investment_plans using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_investment_plans_status on public.investment_plans using btree (status) TABLESPACE pg_default;

create table public.user_financial_records (
  id serial not null,
  user_id uuid null,
  record_year integer not null,
  record_month integer not null,
  starting_balance numeric(12, 2) not null,
  monthly_contribution numeric(12, 2) null default 0,
  monthly_return_rate numeric(6, 4) null default 0,
  ending_balance numeric(12, 2) not null,
  growth_percentage numeric(5, 2) not null,
  target_rentability numeric(12, 2) null,
  created_at timestamp without time zone null default now(),
  constraint user_financial_records_pkey primary key (id),
  constraint unique_user_month unique (user_id, record_year, record_month),
  constraint user_financial_records_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint user_financial_records_record_month_check check (
    (
      (record_month >= 1)
      and (record_month <= 12)
    )
  )
) TABLESPACE pg_default;
