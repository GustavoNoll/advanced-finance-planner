-- Create micro_investment_plans table
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

-- Create index for better performance
CREATE INDEX idx_micro_investment_plans_life_investment_plan_id ON public.micro_investment_plans(life_investment_plan_id);
CREATE INDEX idx_micro_investment_plans_effective_date ON public.micro_investment_plans(effective_date);

-- Migrate existing data from investment_plans to micro_investment_plans
-- effective_date must equal plan_initial_date for the first micro plan
INSERT INTO public.micro_investment_plans (
  life_investment_plan_id,
  effective_date,
  monthly_deposit,
  desired_income,
  expected_return,
  inflation
)
SELECT 
  id as life_investment_plan_id,
  plan_initial_date as effective_date, -- Must equal plan_initial_date
  monthly_deposit,
  desired_income,
  expected_return,
  inflation
FROM public.investment_plans
WHERE plan_initial_date IS NOT NULL;

-- Add comment to the table
COMMENT ON TABLE public.micro_investment_plans IS 'Micro investment plans that belong to a main investment plan. Each plan can have multiple micro plans over time.';
COMMENT ON COLUMN public.micro_investment_plans.life_investment_plan_id IS 'Reference to the main investment plan';
COMMENT ON COLUMN public.micro_investment_plans.effective_date IS 'Date when this micro plan becomes effective';
