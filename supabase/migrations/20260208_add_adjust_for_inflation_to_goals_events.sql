-- Add adjust_for_inflation column to financial_goals table
ALTER TABLE public.financial_goals
ADD COLUMN adjust_for_inflation BOOLEAN NOT NULL DEFAULT true;

-- Add adjust_for_inflation column to events table
ALTER TABLE public.events
ADD COLUMN adjust_for_inflation BOOLEAN NOT NULL DEFAULT true;

-- Backfill existing rows with true
UPDATE public.financial_goals SET adjust_for_inflation = true WHERE adjust_for_inflation IS NULL;
UPDATE public.events SET adjust_for_inflation = true WHERE adjust_for_inflation IS NULL;

-- Add comments
COMMENT ON COLUMN public.financial_goals.adjust_for_inflation IS 'Whether the goal value should be adjusted for inflation over time';
COMMENT ON COLUMN public.events.adjust_for_inflation IS 'Whether the event value should be adjusted for inflation over time';
