-- =============================================
-- Database Update: Add Status Management Features
-- Run this in your Supabase SQL Editor
-- =============================================

-- Add status column to suggestions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suggestions' AND column_name = 'status'
  ) THEN
    ALTER TABLE suggestions 
    ADD COLUMN status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'pending'));
  END IF;
END $$;

-- Update bug_reports status to include new statuses
ALTER TABLE bug_reports 
DROP CONSTRAINT IF EXISTS bug_reports_status_check;

ALTER TABLE bug_reports 
ADD CONSTRAINT bug_reports_status_check 
CHECK (status IN ('new', 'investigating', 'in_progress', 'resolved', 'fixed', 'spam', 'closed', 'read', 'pending'));

-- Set default status for existing records
UPDATE suggestions 
SET status = 'new' 
WHERE status IS NULL;

UPDATE bug_reports 
SET status = 'new' 
WHERE status IS NULL;

-- Verify the changes
SELECT 'bug_reports status values:' as info, status, count(*) as count 
FROM bug_reports 
GROUP BY status
UNION ALL
SELECT 'suggestions status values:' as info, status, count(*) as count 
FROM suggestions 
GROUP BY status;
