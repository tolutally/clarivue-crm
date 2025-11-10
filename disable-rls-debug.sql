-- Temporarily disable RLS on all tables for debugging
-- Run this in Supabase SQL Editor to troubleshoot the RLS issue

-- Disable RLS on all tables
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;

-- Check the status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('contacts', 'deals', 'activities');

-- Re-enable with better policies (run separately after testing)
/*
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow all operations on deals" ON deals;  
DROP POLICY IF EXISTS "Allow all operations on activities" ON activities;

-- Create more permissive policies
CREATE POLICY "Public access to contacts" ON contacts FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access to deals" ON deals FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access to activities" ON activities FOR ALL TO public USING (true) WITH CHECK (true);
*/