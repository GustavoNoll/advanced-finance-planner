-- Create enum for asset classes
CREATE TYPE asset_class AS ENUM (
  'fixed_income_opportunities',
  'fixed_income_credit',
  'fixed_income_government',
  'multimarket',
  'real_estate',
  'stocks',
  'private_equity',
  'foreign_investments',
  'crypto'
);

-- Create asset allocations table
CREATE TABLE asset_allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID NOT NULL REFERENCES investment_policies(id) ON DELETE CASCADE,
  asset_class asset_class NOT NULL,
  allocation DECIMAL(5,2) NOT NULL CHECK (allocation >= 0 AND allocation <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(policy_id, asset_class)
);

-- Create function to validate total allocation
CREATE OR REPLACE FUNCTION validate_total_allocation()
RETURNS TRIGGER AS $$
DECLARE
  total DECIMAL(5,2);
BEGIN
  -- Calculate total allocation for the policy
  SELECT COALESCE(SUM(allocation), 0)
  INTO total
  FROM asset_allocations
  WHERE policy_id = NEW.policy_id;

  -- Check if total is less than 100%
  IF total < 100 THEN
    RAISE EXCEPTION 'Total allocation must be 100% (current: %)', total;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate total allocation
CREATE TRIGGER check_total_allocation
BEFORE INSERT OR UPDATE ON asset_allocations
FOR EACH ROW
EXECUTE FUNCTION validate_total_allocation();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_asset_allocations_updated_at
BEFORE UPDATE ON asset_allocations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 