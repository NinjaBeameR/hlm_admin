-- Quick Fix for Bug Reports 400 Error
-- Run this in your Supabase SQL Editor

-- Create or recreate the bug_reports table with the correct schema
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT NOT NULL,
  severity TEXT,
  status TEXT DEFAULT 'new',
  app_version TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create or recreate the suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for the report form)
CREATE POLICY "Public can insert bug reports"
  ON bug_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can insert suggestions"
  ON suggestions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Authenticated can read bug reports"
  ON bug_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can read suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update and delete (for admin actions)
CREATE POLICY "Authenticated can update bug reports"
  ON bug_reports FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete bug reports"
  ON bug_reports FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete suggestions"
  ON suggestions FOR DELETE
  TO authenticated
  USING (true);

-- Test with a sample insert
INSERT INTO bug_reports (description, status) VALUES ('Test bug report', 'new');
INSERT INTO suggestions (description) VALUES ('Test suggestion');

-- Verify the data
SELECT COUNT(*) as bug_count FROM bug_reports;
SELECT COUNT(*) as suggestion_count FROM suggestions;
