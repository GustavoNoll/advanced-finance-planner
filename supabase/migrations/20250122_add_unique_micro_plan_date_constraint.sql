-- Add unique constraint to prevent duplicate micro plans for the same investment plan and date
-- This ensures that each investment plan can only have one micro plan per effective date

-- First, let's check if there are any existing duplicates and clean them up if necessary
-- We'll keep the most recent one (highest id) for each duplicate combination
WITH duplicates AS (
  SELECT 
    life_investment_plan_id,
    effective_date,
    MIN(id) as min_id,
    COUNT(*) as count
  FROM public.micro_investment_plans
  GROUP BY life_investment_plan_id, effective_date
  HAVING COUNT(*) > 1
),
duplicates_to_delete AS (
  SELECT mp.id
  FROM public.micro_investment_plans mp
  INNER JOIN duplicates d ON mp.life_investment_plan_id = d.life_investment_plan_id 
    AND mp.effective_date = d.effective_date
  WHERE mp.id != d.min_id
)
DELETE FROM public.micro_investment_plans 
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Add the unique constraint
-- This will prevent any future attempts to create duplicate micro plans
ALTER TABLE public.micro_investment_plans 
ADD CONSTRAINT unique_micro_plan_per_date 
UNIQUE (life_investment_plan_id, effective_date);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT unique_micro_plan_per_date ON public.micro_investment_plans 
IS 'Ensures that each investment plan can only have one micro plan per effective date';
