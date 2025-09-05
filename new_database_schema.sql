-- Updated Supabase Database Schema for Mobile-First Report App
-- Run these commands in your Supabase SQL Editor

-- =============================================
-- Drop existing tables if you want to start fresh
-- =============================================
-- DROP TABLE IF EXISTS bug_reports CASCADE;
-- DROP TABLE IF EXISTS suggestions CASCADE;

-- =============================================
-- Create Supabase Storage Bucket for Screenshots
-- =============================================
-- This needs to be done in the Supabase Dashboard under Storage
-- Create a bucket named 'screenshots' with public access

-- =============================================
-- Create Bug Reports Table (Updated Schema)
-- =============================================
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  app_version TEXT,
  screenshot_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'in_progress', 'resolved', 'fixed', 'spam', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Create Suggestions Table (Updated Schema)
-- =============================================
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies for Public Submission
-- =============================================

-- Allow anonymous users to INSERT new reports (public form submission)
CREATE POLICY "Allow public bug report submission"
  ON bug_reports FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public suggestion submission"
  ON suggestions FOR INSERT
  TO anon
  WITH CHECK (true);

-- =============================================
-- RLS Policies for Admin Access
-- =============================================

-- Allow authenticated admins to SELECT all reports
CREATE POLICY "Authenticated users can read bug reports"
  ON bug_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated admins to UPDATE and DELETE
CREATE POLICY "Authenticated users can update bug reports"
  ON bug_reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bug reports"
  ON bug_reports FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete suggestions"
  ON suggestions FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports (status);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON suggestions (created_at DESC);

-- =============================================
-- Storage Policies for Screenshots
-- =============================================
-- These policies need to be set in the Supabase Dashboard under Storage > screenshots bucket

-- For public upload (anonymous users can upload):
-- Policy name: "Allow public screenshot upload"
-- Allowed operation: INSERT
-- Target roles: anon
-- Policy definition: true

-- For public access (anyone can view uploaded images):
-- Policy name: "Allow public screenshot access"
-- Allowed operation: SELECT
-- Target roles: anon, authenticated
-- Policy definition: true

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================

-- Sample Bug Reports
INSERT INTO bug_reports (description, app_version, status) VALUES
('App crashes when I try to upload a photo', '2.1.0', 'new'),
('Login button is not working on iPhone', '2.0.5', 'investigating'),
('Search feature returns no results', '2.1.0', 'new');

-- Sample Suggestions
INSERT INTO suggestions (description) VALUES
('Please add dark mode to the app'),
('Would love to see a bookmark feature'),
('Add option to sync with calendar');

-- =============================================
-- Verify Setup
-- =============================================

-- Check tables
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bug_reports', 'suggestions');

-- Check policies
SELECT schemaname, tablename, policyname, cmd, roles, qual 
FROM pg_policies 
WHERE tablename IN ('bug_reports', 'suggestions')
ORDER BY tablename, policyname;

-- Check data
SELECT 'bug_reports' as table_name, count(*) as row_count FROM bug_reports
UNION ALL
SELECT 'suggestions' as table_name, count(*) as row_count FROM suggestions;
