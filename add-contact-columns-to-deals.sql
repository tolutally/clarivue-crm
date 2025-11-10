-- Add contact denormalized columns to deals table for easy export
-- Run this in Supabase SQL Editor

ALTER TABLE deals 
ADD COLUMN IF NOT EXISTS contact_first_name TEXT,
ADD COLUMN IF NOT EXISTS contact_last_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_company TEXT;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_deals_contact_name ON deals(contact_first_name, contact_last_name);

-- Optional: Backfill existing deals with contact information
UPDATE deals d
SET 
  contact_first_name = c.first_name,
  contact_last_name = c.last_name,
  contact_email = c.email,
  contact_company = c.company
FROM contacts c
WHERE d.contact_id = c.id
  AND d.contact_first_name IS NULL;

SELECT 'Migration completed successfully' as status;
