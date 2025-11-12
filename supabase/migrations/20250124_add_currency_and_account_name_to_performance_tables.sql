-- Add currency and account_name columns to consolidated_performance table
ALTER TABLE consolidated_performance
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'BRL' CHECK (currency IN ('BRL', 'USD', 'EUR')),
  ADD COLUMN IF NOT EXISTS account_name TEXT;

-- Add currency and account_name columns to performance_data table
ALTER TABLE performance_data
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'BRL' CHECK (currency IN ('BRL', 'USD', 'EUR')),
  ADD COLUMN IF NOT EXISTS account_name TEXT;

-- Create unique constraint for performance_data to prevent duplicates
-- Only one record per profile_id, period, institution, asset, and account_name combination
-- This ensures that for the same profile, period, institution, and asset, only one account_name can exist
-- NULL values are treated as distinct, so NULL account_name is different from any specific account_name
CREATE UNIQUE INDEX IF NOT EXISTS idx_performance_data_unique_combination
ON performance_data(profile_id, period, institution, asset, account_name)
WHERE period IS NOT NULL AND asset IS NOT NULL;

-- Add comment to explain the constraint
COMMENT ON INDEX idx_performance_data_unique_combination IS 
  'Ensures no duplicate records for the same profile, period, institution, asset, and account_name combination';

-- Create index for account_name to improve query performance
CREATE INDEX IF NOT EXISTS idx_consolidated_performance_account_name 
ON consolidated_performance(account_name);

CREATE INDEX IF NOT EXISTS idx_performance_data_account_name 
ON performance_data(account_name);

-- Create index for currency to improve query performance
CREATE INDEX IF NOT EXISTS idx_consolidated_performance_currency 
ON consolidated_performance(currency);

CREATE INDEX IF NOT EXISTS idx_performance_data_currency 
ON performance_data(currency);

