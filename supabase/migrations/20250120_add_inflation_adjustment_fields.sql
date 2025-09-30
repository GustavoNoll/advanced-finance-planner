-- Add inflation adjustment fields to investment_plans table
ALTER TABLE micro_investment_plans 
ADD COLUMN adjust_contribution_for_accumulated_inflation BOOLEAN DEFAULT false,
ADD COLUMN adjust_income_for_accumulated_inflation BOOLEAN DEFAULT false;

-- Add comments to explain the fields
COMMENT ON COLUMN investment_plans.adjust_contribution_for_accumulated_inflation IS 'When true, monthly contributions are adjusted for accumulated inflation. When false, contributions maintain their nominal value.';
COMMENT ON COLUMN investment_plans.adjust_income_for_accumulated_inflation IS 'When true, monthly income/withdrawals are adjusted for accumulated inflation. When false, income maintains its nominal value.';
