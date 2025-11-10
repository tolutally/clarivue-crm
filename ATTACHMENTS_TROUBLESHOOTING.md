# Attachments Not Showing - Troubleshooting Guide

## Problem
Files upload successfully but don't show when viewing a deal. The "Attachments test" message appears but actual uploaded files are missing.

## Root Causes Identified

### 1. ✅ FIXED: loadDealById Not Fetching Attachments
**Issue**: The `loadDealById.ts` query was not including the `attachments` column in the SELECT statement.

**Fix Applied**: Updated the query to include `d.attachments` and `d.notes` in the SELECT clause.

### 2. ⚠️ NEEDS VERIFICATION: Database Schema Issue
**Issue**: The `attachments` column might still be `TEXT[]` instead of `JSONB` in your Supabase database.

**How to Check**:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/kyhwbvkakaactdwpqhps/sql/new
2. Run this query:
```sql
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'deals' 
AND column_name IN ('attachments', 'notes');
```

**Expected Result**:
- `attachments` should be type `jsonb`
- `notes` should be type `jsonb`

**If attachments is TEXT[] instead**, run this migration:
```sql
-- Run this in Supabase SQL Editor
-- This will fix the attachments column type

-- Step 1: Drop old column if it's TEXT[]
ALTER TABLE deals DROP COLUMN IF EXISTS attachments;

-- Step 2: Add as JSONB
ALTER TABLE deals ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Step 3: Verify
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'deals' 
AND column_name = 'attachments';
```

### 3. Storage Bucket Configuration
**Verify** that the storage bucket exists and has proper RLS policies:

1. Go to: https://supabase.com/dashboard/project/kyhwbvkakaactdwpqhps/storage/buckets
2. Check if `deal-attachments` bucket exists
3. Check if it's set to **public**

If the bucket doesn't exist, run:
```sql
-- Create the deal-attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('deal-attachments', 'deal-attachments', true);

-- Allow public read access
CREATE POLICY "Public can read deal attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'deal-attachments');

-- Allow all to upload (adjust for auth later)
CREATE POLICY "Allow uploads to deal attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'deal-attachments');
```

## Step-by-Step Fix

### Step 1: Verify Database Schema
Run `check-attachments-schema.sql` in Supabase SQL Editor

### Step 2: Fix Attachments Column (if needed)
Run `fix-attachments-column.sql` in Supabase SQL Editor

### Step 3: Test Upload
1. Go to a deal in your app
2. Upload a file
3. Check browser console for any errors
4. Refresh the page to see if the attachment appears

### Step 4: Verify Data in Database
After uploading, run this in Supabase SQL Editor:
```sql
SELECT id, name, attachments, notes 
FROM deals 
WHERE attachments IS NOT NULL 
ORDER BY updated_at DESC 
LIMIT 5;
```

You should see the attachments as JSON objects like:
```json
[
  {
    "id": "1731149234567-abc123",
    "name": "document.pdf",
    "url": "https://kyhwbvkakaactdwpqhps.supabase.co/storage/v1/object/public/deal-attachments/...",
    "size": 12345,
    "type": "application/pdf",
    "uploaded_at": "2024-11-09T12:00:00.000Z"
  }
]
```

## Common Errors and Solutions

### Error: "Cannot read properties of undefined"
**Cause**: Deal doesn't have attachments property  
**Fix**: Make sure `loadDealById` includes `d.attachments` in SELECT (already fixed in code)

### Error: "row-level security policy violation"
**Cause**: RLS policies not configured  
**Fix**: Run the RLS policy setup from `setup-rls-policies.sql`

### Error: "Invalid file URL"
**Cause**: URL format doesn't match expected pattern  
**Fix**: Check that storage bucket is named `deal-attachments`

### Files Upload but Don't Persist
**Cause**: Column is TEXT[] instead of JSONB  
**Fix**: Run `fix-attachments-column.sql`

## Quick Test
After applying fixes, test with this sequence:
1. Upload a file to any deal
2. Check console logs - should see "Attachment added successfully"
3. Close and reopen the deal
4. Attachments should now appear in the sidebar

## Files Updated
- ✅ `actions/loadDealById.ts` - Now includes attachments and notes columns
- ✅ `fix-attachments-column.sql` - Migration to fix column type
- ✅ `check-attachments-schema.sql` - Query to verify schema

## Next Steps After Fixes
1. Run the schema check query
2. If needed, run the fix migration
3. Try uploading a file
4. Verify it shows after page refresh
5. Check that clicking "View" opens the file correctly
