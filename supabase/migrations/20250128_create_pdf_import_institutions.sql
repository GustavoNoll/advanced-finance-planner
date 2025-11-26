-- Table for PDF import institutions
CREATE TABLE pdf_import_institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  default_currency TEXT NOT NULL CHECK (default_currency IN ('BRL', 'USD', 'EUR')),
  requires_additional_file BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for better query performance
CREATE INDEX idx_pdf_import_institutions_name ON pdf_import_institutions(name);

-- Trigger to update updated_at
CREATE TRIGGER update_pdf_import_institutions_updated_at
    BEFORE UPDATE ON pdf_import_institutions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data from ACCEPTED_INSTITUTIONS
INSERT INTO pdf_import_institutions (name, default_currency, requires_additional_file) VALUES
  ('Avenue', 'USD', true),
  ('B3', 'BRL', false),
  ('BB', 'BRL', false),
  ('Bradesco', 'BRL', false),
  ('BTG', 'BRL', false),
  ('C6', 'BRL', false),
  ('Fidelity', 'USD', false),
  ('IB', 'USD', false),
  ('Itau', 'BRL', false),
  ('Santander', 'BRL', false),
  ('Smart', 'BRL', false),
  ('Warren', 'BRL', false),
  ('XP', 'BRL', false);

-- Add comment to explain the table
COMMENT ON TABLE pdf_import_institutions IS 'Institutions accepted for PDF imports with their default currency and additional file requirements';
COMMENT ON COLUMN pdf_import_institutions.requires_additional_file IS 'When true, user must upload an additional file during PDF import';

