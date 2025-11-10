-- RLS Policies for Storage Bucket: deal-attachments
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
drop policy if exists "Authenticated users can upload deal attachments" on storage.objects;
drop policy if exists "Public can read deal attachments" on storage.objects;
drop policy if exists "Authenticated users can delete deal attachments" on storage.objects;

-- 1. Allow authenticated users to upload files
create policy "Authenticated users can upload deal attachments"
on storage.objects for insert
to authenticated
with check (bucket_id = 'deal-attachments');

-- 2. Allow public read access to files
create policy "Public can read deal attachments"
on storage.objects for select
to public
using (bucket_id = 'deal-attachments');

-- 3. Allow authenticated users to delete their uploaded files
create policy "Authenticated users can delete deal attachments"
on storage.objects for delete
to authenticated
using (bucket_id = 'deal-attachments');

-- Verify policies were created
select 
    policyname,
    cmd,
    roles
from pg_policies 
where tablename = 'objects' 
and schemaname = 'storage'
and policyname ilike '%deal attachments%'
order by policyname;
