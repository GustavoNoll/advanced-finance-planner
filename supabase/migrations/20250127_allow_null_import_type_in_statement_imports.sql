-- Allow import_type to be NULL in statement_imports table
-- This migration removes the NOT NULL constraint and updates the CHECK constraint
-- to allow NULL values while still validating non-null values

-- First, drop the existing CHECK constraint
ALTER TABLE statement_imports
  DROP CONSTRAINT IF EXISTS statement_imports_import_type_check;

-- Remove NOT NULL constraint and add new CHECK constraint that allows NULL
ALTER TABLE statement_imports
  ALTER COLUMN import_type DROP NOT NULL,
  ADD CONSTRAINT statement_imports_import_type_check 
    CHECK (import_type IS NULL OR import_type IN ('consolidated', 'assets'));

-- Update the comment to reflect that import_type can be null
COMMENT ON COLUMN statement_imports.import_type IS 'Type of import: consolidated or assets (can be null)';

