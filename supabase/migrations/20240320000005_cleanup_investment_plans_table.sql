-- Remove columns that were moved to micro_investment_plans
-- Keep only basic plan information and lifecycle data

ALTER TABLE public.investment_plans 
DROP COLUMN IF EXISTS monthly_deposit,
DROP COLUMN IF EXISTS desired_income,
DROP COLUMN IF EXISTS expected_return,
DROP COLUMN IF EXISTS inflation,


-- Add comment to clarify the new structure
COMMENT ON TABLE public.investment_plans IS 'Main investment plans that can have multiple micro plans over time. Contains basic plan information and lifecycle data.';
COMMENT ON COLUMN public.investment_plans.plan_initial_date IS 'Initial date when the investment plan was created';
COMMENT ON COLUMN public.investment_plans.final_age IS 'Target age for plan completion';
COMMENT ON COLUMN public.investment_plans.limit_age IS 'Maximum age limit for the plan';
COMMENT ON COLUMN public.investment_plans.currency IS 'Currency code (BRL, USD, EUR)';
COMMENT ON COLUMN public.investment_plans.status IS 'Plan status (active, inactive, deleted)';
