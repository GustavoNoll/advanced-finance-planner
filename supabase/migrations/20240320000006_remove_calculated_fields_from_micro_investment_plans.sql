-- Remove calculated fields from micro_investment_plans table
-- These fields will be calculated on-the-fly when needed

ALTER TABLE public.micro_investment_plans 
DROP COLUMN IF EXISTS future_value,
DROP COLUMN IF EXISTS inflation_adjusted_income,
DROP COLUMN IF EXISTS required_monthly_deposit,
DROP COLUMN IF EXISTS adjust_contribution_for_inflation,
DROP COLUMN IF EXISTS adjust_income_for_inflation;
