-- Create portfolio_verification_settings table
-- This table stores verification settings (correct threshold and tolerance value) per profile

CREATE TABLE IF NOT EXISTS portfolio_verification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  correct_threshold NUMERIC(10, 2) NOT NULL DEFAULT 0.01,
  tolerance_value NUMERIC(10, 2) NOT NULL DEFAULT 2500.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on profile_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_verification_settings_profile_id ON portfolio_verification_settings(profile_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE portfolio_verification_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile's settings
CREATE POLICY "Users can view their own profile verification settings"
  ON portfolio_verification_settings
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own profile's settings
CREATE POLICY "Users can insert their own profile verification settings"
  ON portfolio_verification_settings
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update their own profile's settings
CREATE POLICY "Users can update their own profile verification settings"
  ON portfolio_verification_settings
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own profile's settings
CREATE POLICY "Users can delete their own profile verification settings"
  ON portfolio_verification_settings
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_portfolio_verification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_verification_settings_updated_at
  BEFORE UPDATE ON portfolio_verification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_verification_settings_updated_at();

