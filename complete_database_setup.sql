-- =============================================
-- Complete Database Setup for HLM Admin
-- Run these commands in your Supabase SQL Editor
-- =============================================

-- First, drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS bug_reports CASCADE;
DROP TABLE IF EXISTS suggestions CASCADE;

-- =============================================
-- Create Bug Reports Table
-- =============================================
CREATE TABLE bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'in_progress', 'resolved', 'fixed', 'spam', 'closed')),
  app_version TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Create Suggestions Table
-- =============================================
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Create Storage Bucket for Screenshots
-- =============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create RLS Policies for Public Access (Submit Only)
-- =============================================

-- Allow anyone to insert bug reports (public form submissions)
CREATE POLICY "Anyone can insert bug reports"
  ON bug_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to insert suggestions (public form submissions)
CREATE POLICY "Anyone can insert suggestions"
  ON suggestions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =============================================
-- Create RLS Policies for Admin Access (Read/Update/Delete)
-- =============================================

-- Allow authenticated users to read all bug reports
CREATE POLICY "Authenticated users can read bug reports"
  ON bug_reports FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update bug reports
CREATE POLICY "Authenticated users can update bug reports"
  ON bug_reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete bug reports
CREATE POLICY "Authenticated users can delete bug reports"
  ON bug_reports FOR DELETE
  TO authenticated
  USING (true);

-- Allow authenticated users to read all suggestions
CREATE POLICY "Authenticated users can read suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to delete suggestions
CREATE POLICY "Authenticated users can delete suggestions"
  ON suggestions FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- Create Storage Policies for Screenshots
-- =============================================

-- Allow anyone to upload screenshots
CREATE POLICY "Anyone can upload screenshots"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'screenshots');

-- Allow authenticated users to view screenshots
CREATE POLICY "Authenticated users can view screenshots"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'screenshots');

-- Allow public access to screenshots (for viewing in reports)
CREATE POLICY "Public can view screenshots"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'screenshots');

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX idx_bug_reports_created_at ON bug_reports (created_at DESC);
CREATE INDEX idx_bug_reports_status ON bug_reports (status);
CREATE INDEX idx_bug_reports_severity ON bug_reports (severity);
CREATE INDEX idx_suggestions_created_at ON suggestions (created_at DESC);

-- =============================================
-- Insert Sample Data (Optional - for testing)
-- =============================================

-- Sample Bug Reports
INSERT INTO bug_reports (title, description, severity, status, app_version) VALUES
('Login form not working', 'Users cannot log in with valid credentials', 'high', 'investigating', '1.2.0'),
('Dashboard loading slowly', 'Dashboard takes more than 10 seconds to load', 'medium', 'new', '1.2.0'),
('Mobile responsive issues', 'Layout breaks on mobile devices below 768px width', 'medium', 'in_progress', '1.1.5'),
('Data export feature broken', 'CSV export returns empty file when clicked', 'critical', 'new', '1.2.0'),
('Search functionality buggy', 'Search returns incorrect results for partial matches', 'low', 'resolved', '1.1.8');

-- Sample Suggestions
INSERT INTO suggestions (description) VALUES
('Add dark mode theme option for better user experience'),
('Implement bulk actions for data management operations'),
('Add email notifications for important bug updates'),
('Create a mobile app version of the admin dashboard'),
('Add advanced filtering options with date ranges'),
('Implement real-time notifications for new reports');

-- =============================================
-- Verify Setup
-- =============================================

-- Check tables exist
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('bug_reports', 'suggestions')
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE tablename IN ('bug_reports', 'suggestions')
ORDER BY tablename, policyname;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE name = 'screenshots';

-- Show sample data counts
SELECT 
  (SELECT COUNT(*) FROM bug_reports) as bug_reports_count,
  (SELECT COUNT(*) FROM suggestions) as suggestions_count;
