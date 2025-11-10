-- Update deals table to match frontend structure
-- Run this in Supabase SQL Editor

-- Add new columns if they don't exist
alter table deals 
add column if not exists name text,
add column if not exists use_case text,
add column if not exists signal text check (signal in ('positive', 'neutral', 'negative')),
add column if not exists attachments jsonb;

-- Remove old columns that are no longer used
alter table deals 
drop column if exists title,
drop column if exists amount,
drop column if exists priority,
drop column if exists expected_close_date;

-- Make contact_id nullable (for standalone deals)
alter table deals 
alter column contact_id drop not null;

-- Ensure description is required
alter table deals 
alter column description set not null;

-- Add comments
comment on column deals.name is 'Name of the deal';
comment on column deals.use_case is 'Use case or purpose of the deal';
comment on column deals.signal is 'Deal progress signal: positive, neutral, or negative';
comment on column deals.attachments is 'Array of attachment objects with name, url, size, and type';
comment on column deals.contact_id is 'Optional - Contact linked to this deal';
comment on column deals.description is 'Required - Description of the deal';

-- Set default values
alter table deals 
alter column stage set default 'new',
alter column signal set default 'neutral',
alter column sort_order set default 0;

-- Verify the changes
select 
    column_name,
    data_type,
    is_nullable,
    column_default
from information_schema.columns
where table_name = 'deals'
order by ordinal_position;
