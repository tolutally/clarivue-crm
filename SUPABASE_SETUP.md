# Supabase Setup Instructions

## Overview
Your CRM application is being migrated from UI Bakery to Supabase for database management. Most of the contact-related actions have been converted to use Supabase directly.

## Setup Steps

### 1. Create a Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created (this takes a few minutes)

### 2. Run the Database Schema
1. In your Supabase project dashboard, go to the **SQL Editor**
2. Open the file `supabase-schema.sql` from your project root
3. Copy and paste the entire contents into the SQL Editor
4. Click "Run" to create all tables, indexes, and sample data

### 3. Get Your API Credentials
1. In your Supabase project, go to **Settings → API**
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (a long JWT token)

### 4. Configure Environment Variables
1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Save the file

### 5. Restart Your Development Server
```bash
# Stop the current dev server if running (Ctrl+C)
npm run dev
```

## What's Been Converted

### ✅ Completed Actions (Using Supabase)
- `createContact` - Create new contacts
- `loadContacts` - List contacts with filters, search, pagination
- `countContacts` - Get total count for pagination
- `loadContactById` - Fetch single contact by ID
- `updateContact` - Update existing contact
- `searchContacts` - Search contacts (autocomplete)
- `loadCompanies` - Get unique list of companies

### ⏳ Remaining Actions (Still Using UI Bakery Pattern)
- Deal-related actions:
  - `createDeal`
  - `loadDeals`
  - `loadDealById`
  - `loadDealsByContact`
  - `updateDeal`
  - `updateDealStage`
  - `updateDealSortOrder`
- Activity-related actions:
  - `createActivity`
  - `loadActivities`
  - `loadDealActivities`
  - `updateActivity`
  - `deleteActivity`

## Database Schema

The database includes three main tables:

### contacts
- id (bigint, primary key)
- first_name, last_name, email, phone
- company, position
- linkedin, acquisition_channel
- status, tags
- created_at, updated_at

### deals
- id (bigint, primary key)
- contact_id (references contacts)
- title, amount, stage, priority
- description, expected_close_date
- sort_order (for kanban board ordering)
- created_at, updated_at

### activities
- id (bigint, primary key)
- contact_id (references contacts)
- deal_id (references deals)
- type, title, description
- created_by, created_at

## Testing

Once configured, you should be able to:
1. ✅ View the contact list
2. ✅ Search and filter contacts
3. ✅ Create new contacts
4. ✅ Edit existing contacts
5. ✅ See the sample data (3 contacts: John Doe, Jane Smith, Bob Johnson)

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists and has both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart your dev server after adding the environment variables

### No data showing up
- Verify you ran the `supabase-schema.sql` file in the SQL Editor
- Check the browser console for any error messages
- Go to Supabase Dashboard → Table Editor → contacts to verify data exists

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- The @supabase/supabase-js package should be version 2.x

## Next Steps

After verifying contacts work correctly, the remaining deal and activity actions need to be converted using the same pattern as the contact actions.
