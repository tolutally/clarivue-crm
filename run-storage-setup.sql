-- Storage Setup Script for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create the deal-attachments storage bucket (if not already created via dashboard)
insert into storage.buckets (id, name, public)
values ('deal-attachments', 'deal-attachments', true)
on conflict (id) do nothing;

-- 2. Set up RLS policies for the bucket
-- Allow authenticated users to upload files
create policy if not exists "Authenticated users can upload deal attachments"
on storage.objects for insert
to authenticated
with check (bucket_id = 'deal-attachments');

-- Allow public read access to files
create policy if not exists "Public can read deal attachments"
on storage.objects for select
to public
using (bucket_id = 'deal-attachments');

-- Allow authenticated users to delete their uploaded files
create policy if not exists "Authenticated users can delete deal attachments"
on storage.objects for delete
to authenticated
using (bucket_id = 'deal-attachments');

-- 3. Add attachments column to deals table
alter table deals 
add column if not exists attachments jsonb;

comment on column deals.attachments is 'Array of attachment objects with name, url, size, and type';

-- Verify the setup
select 'Storage bucket exists' as status, count(*) as count 
from storage.buckets where id = 'deal-attachments'
union all
select 'RLS policies created' as status, count(*) as count 
from pg_policies where tablename = 'objects' and schemaname = 'storage'
union all
select 'Attachments column exists' as status, count(*) as count 
from information_schema.columns 
where table_name = 'deals' and column_name = 'attachments';
