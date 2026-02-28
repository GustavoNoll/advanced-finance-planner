-- Create meeting_notes table
-- Stores notes from client meetings (broker/consultant with client)
-- profile_id = the client profile whose meeting this note belongs to

CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  action_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  participants TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_meeting_notes_profile_id ON meeting_notes(profile_id);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_meeting_date ON meeting_notes(meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_profile_date ON meeting_notes(profile_id, meeting_date DESC);

-- Enable RLS
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- 1. Client can view/insert/update/delete their own notes (profile_id = their profile)
-- 2. Broker can view/insert/update/delete notes for their clients (profile belongs to broker)

CREATE POLICY "Users can view their own meeting notes"
  ON meeting_notes
  FOR SELECT
  USING (
    profile_id = auth.uid()
    OR
    profile_id IN (SELECT id FROM profiles WHERE broker_id = auth.uid())
  );

CREATE POLICY "Users can insert meeting notes for self or clients"
  ON meeting_notes
  FOR INSERT
  WITH CHECK (
    profile_id = auth.uid()
    OR
    profile_id IN (SELECT id FROM profiles WHERE broker_id = auth.uid())
  );

CREATE POLICY "Users can update their own or clients meeting notes"
  ON meeting_notes
  FOR UPDATE
  USING (
    profile_id = auth.uid()
    OR
    profile_id IN (SELECT id FROM profiles WHERE broker_id = auth.uid())
  );

CREATE POLICY "Users can delete their own or clients meeting notes"
  ON meeting_notes
  FOR DELETE
  USING (
    profile_id = auth.uid()
    OR
    profile_id IN (SELECT id FROM profiles WHERE broker_id = auth.uid())
  );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_meeting_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meeting_notes_updated_at
  BEFORE UPDATE ON meeting_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_meeting_notes_updated_at();

-- Comment
COMMENT ON TABLE meeting_notes IS 'Notes from client meetings - broker/consultant documentation per client';
