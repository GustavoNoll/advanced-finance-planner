-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.asset_allocations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  policy_id uuid,
  asset_class USER-DEFINED NOT NULL,
  allocation numeric NOT NULL CHECK (allocation >= 0::numeric AND allocation <= 100::numeric),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT asset_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT asset_allocations_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.broker_themes (
  broker_id uuid NOT NULL,
  primary_color character varying,
  secondary_color character varying,
  accent_color character varying,
  logo_url text,
  brand_name character varying,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT broker_themes_pkey PRIMARY KEY (broker_id),
  CONSTRAINT broker_themes_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.budgets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  policy_id uuid UNIQUE,
  incomes jsonb DEFAULT '[]'::jsonb,
  expenses jsonb DEFAULT '[]'::jsonb,
  bonus numeric DEFAULT 0,
  dividends numeric DEFAULT 0,
  savings numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT budgets_pkey PRIMARY KEY (id),
  CONSTRAINT budgets_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.children (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  family_structure_id uuid,
  name text NOT NULL,
  birth_date date NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT children_pkey PRIMARY KEY (id),
  CONSTRAINT children_family_structure_id_fkey FOREIGN KEY (family_structure_id) REFERENCES public.family_structures(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  name text NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL CHECK (year >= 2000),
  asset_value numeric NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  icon character varying NOT NULL DEFAULT 'other'::character varying,
  installment_count integer,
  installment_interval integer DEFAULT 1 CHECK (installment_interval IS NULL OR installment_interval >= 1),
  payment_mode text NOT NULL DEFAULT 'none'::text CHECK (payment_mode = ANY (ARRAY['none'::text, 'installment'::text, 'repeat'::text])),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.family_structures (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  policy_id uuid UNIQUE,
  marital_status text,
  spouse_name text,
  spouse_birth_date date,
  has_children boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT family_structures_pkey PRIMARY KEY (id),
  CONSTRAINT family_structures_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.financial_goals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  icon text NOT NULL,
  asset_value numeric NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL CHECK (year >= 2000),
  installment_count integer CHECK (installment_count > 0),
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name character varying NOT NULL DEFAULT ''::character varying,
  installment_interval integer DEFAULT 1 CHECK (installment_interval IS NULL OR installment_interval >= 1),
  payment_mode text NOT NULL DEFAULT 'none'::text CHECK (payment_mode = ANY (ARRAY['none'::text, 'installment'::text, 'repeat'::text])),
  CONSTRAINT financial_goals_pkey PRIMARY KEY (id),
  CONSTRAINT goals_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT financial_goals_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.financial_record_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  financial_record_id integer NOT NULL,
  item_id uuid NOT NULL,
  item_type character varying NOT NULL CHECK (item_type::text = ANY (ARRAY['goal'::character varying, 'event'::character varying]::text[])),
  allocated_amount numeric NOT NULL,
  is_completing boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financial_record_links_pkey PRIMARY KEY (id),
  CONSTRAINT financial_record_links_financial_record_id_fkey FOREIGN KEY (financial_record_id) REFERENCES public.user_financial_records(id)
);

-- Funções para delete em cascata
CREATE OR REPLACE FUNCTION delete_financial_goal_links()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.financial_record_links 
    WHERE item_id = OLD.id AND item_type = 'goal';
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_financial_event_links()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.financial_record_links 
    WHERE item_id = OLD.id AND item_type = 'event';
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers para delete em cascata
CREATE TRIGGER trigger_delete_financial_goal_links
    BEFORE DELETE ON public.financial_goals
    FOR EACH ROW
    EXECUTE FUNCTION delete_financial_goal_links();

CREATE TRIGGER trigger_delete_financial_event_links
    BEFORE DELETE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION delete_financial_event_links();
CREATE TABLE public.investment_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  initial_amount numeric NOT NULL,
  final_age integer NOT NULL,
  plan_type character varying NOT NULL CHECK (plan_type::text = ANY (ARRAY['1'::character varying, '2'::character varying, '3'::character varying]::text[])),
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'deleted'::character varying]::text[])),
  limit_age integer,
  legacy_amount numeric,
  plan_initial_date date,
  currency character varying NOT NULL DEFAULT 'BRL'::character varying CHECK (currency::text = ANY (ARRAY['BRL'::character varying::text, 'USD'::character varying::text, 'EUR'::character varying::text])),
  CONSTRAINT investment_plans_pkey PRIMARY KEY (id),
  CONSTRAINT investment_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.micro_investment_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  life_investment_plan_id uuid NOT NULL,
  effective_date date NOT NULL,
  monthly_deposit numeric NOT NULL,
  desired_income numeric NOT NULL,
  expected_return numeric NOT NULL,
  inflation numeric NOT NULL,
  CONSTRAINT micro_investment_plans_pkey PRIMARY KEY (id),
  CONSTRAINT micro_investment_plans_life_investment_plan_id_fkey FOREIGN KEY (life_investment_plan_id) REFERENCES public.investment_plans(id) ON DELETE CASCADE
);
CREATE TABLE public.investment_policies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT investment_policies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.investment_preferences (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  policy_id uuid UNIQUE,
  target_return_review text,
  max_bond_maturity text,
  fgc_event_feeling text,
  max_fund_liquidity text,
  max_acceptable_loss text,
  target_return_ipca_plus text,
  stock_investment_mode text,
  real_estate_funds_mode text,
  platforms_used jsonb DEFAULT '[]'::jsonb,
  asset_restrictions jsonb DEFAULT '[]'::jsonb,
  areas_of_interest jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  risk_profile text,
  CONSTRAINT investment_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT investment_preferences_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.life_information (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  policy_id uuid UNIQUE,
  life_stage text NOT NULL CHECK (life_stage = ANY (ARRAY['accumulation'::text, 'enjoyment'::text, 'consolidation'::text])),
  hobbies jsonb DEFAULT '[]'::jsonb,
  objectives jsonb DEFAULT '[]'::jsonb,
  insurances jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT life_information_pkey PRIMARY KEY (id),
  CONSTRAINT life_information_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.patrimonial_situations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  policy_id uuid UNIQUE,
  investments jsonb DEFAULT '{"properties": [], "participations": [], "liquid_investments": []}'::jsonb,
  personal_assets jsonb DEFAULT '{"vehicles": [], "properties": [], "valuable_goods": []}'::jsonb,
  liabilities jsonb DEFAULT '{"debts": [], "financing": []}'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT patrimonial_situations_pkey PRIMARY KEY (id),
  CONSTRAINT patrimonial_situations_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.professional_information (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  policy_id uuid UNIQUE,
  occupation text NOT NULL,
  work_description text NOT NULL,
  work_location text NOT NULL,
  work_regime text NOT NULL CHECK (work_regime = ANY (ARRAY['pj'::text, 'clt'::text, 'public_servant'::text])),
  tax_declaration_method text NOT NULL CHECK (tax_declaration_method = ANY (ARRAY['simplified'::text, 'complete'::text, 'exempt'::text])),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT professional_information_pkey PRIMARY KEY (id),
  CONSTRAINT professional_information_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.investment_policies(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  is_broker boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text,
  birth_date date,
  broker_id uuid,
  is_admin boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES auth.users(id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_financial_records (
  id integer NOT NULL DEFAULT nextval('user_financial_records_id_seq'::regclass),
  user_id uuid,
  record_year integer NOT NULL,
  record_month integer NOT NULL CHECK (record_month >= 1 AND record_month <= 12),
  starting_balance numeric NOT NULL,
  monthly_contribution numeric DEFAULT 0,
  monthly_return_rate numeric DEFAULT 0,
  ending_balance numeric NOT NULL,
  growth_percentage numeric NOT NULL,
  target_rentability numeric,
  created_at timestamp without time zone DEFAULT now(),
  monthly_return numeric DEFAULT 0,
  CONSTRAINT user_financial_records_pkey PRIMARY KEY (id),
  CONSTRAINT user_financial_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);