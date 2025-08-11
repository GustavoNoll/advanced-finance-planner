-- Add old portfolio profitability column to investment_plans table
-- This field represents the profitability of the client's previous/old portfolio as a percentage (IPCA-based)
ALTER TABLE public.investment_plans 
ADD COLUMN old_portfolio_profitability integer NULL;

-- Add comment to explain the field
COMMENT ON COLUMN public.investment_plans.old_portfolio_profitability IS 
'Profitability of the client''s previous/old portfolio as a percentage, typically based on IPCA or similar inflation index. NULL when no previous portfolio data is available.';

