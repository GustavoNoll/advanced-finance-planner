-- Add language preference column to profiles so users can persist UI language
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS language_preference TEXT
  CHECK (language_preference IN ('pt-BR', 'en-US'))
  DEFAULT 'pt-BR';

-- Backfill existing rows
UPDATE profiles
  SET language_preference = 'pt-BR'
  WHERE language_preference IS NULL;

-- Helpful index for analytics / filtering
CREATE INDEX IF NOT EXISTS idx_profiles_language_preference ON profiles(language_preference);

