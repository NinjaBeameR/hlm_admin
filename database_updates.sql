-- Additional SQL commands to enable UPDATE and DELETE operations
-- Run these commands in your Supabase SQL Editor

-- =============================================
-- Add UPDATE and DELETE policies for Bug Reports
-- =============================================

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

-- =============================================
-- Add UPDATE and DELETE policies for Suggestions
-- =============================================

-- Allow authenticated users to update suggestions (if needed in future)
CREATE POLICY "Authenticated users can update suggestions"
  ON suggestions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete suggestions
CREATE POLICY "Authenticated users can delete suggestions"
  ON suggestions FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- Update the status constraint to include new statuses
-- =============================================

-- Drop the existing constraint
ALTER TABLE bug_reports DROP CONSTRAINT IF EXISTS bug_reports_status_check;

-- Add the new constraint with additional statuses
ALTER TABLE bug_reports ADD CONSTRAINT bug_reports_status_check 
  CHECK (status IN ('new', 'investigating', 'in_progress', 'resolved', 'fixed', 'spam', 'closed'));

-- =============================================
-- Verify the changes
-- =============================================

-- Check the policies
SELECT schemaname, tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('bug_reports', 'suggestions')
ORDER BY tablename, policyname;

-- Check the constraint
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conname = 'bug_reports_status_check';
