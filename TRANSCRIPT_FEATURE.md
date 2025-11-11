# Call Transcript Feature

## Overview
Added support for storing call transcripts with AI-generated summaries in activity logs.

## What Changed

### Database
- Added `transcript` (TEXT) column to `activities` table
- Added `transcript_summary` (TEXT) column to `activities` table
- Added full-text search index on transcript field

### Features
1. **Full Transcript Storage** - Store complete call/meeting transcripts
2. **AI Summary Support** - Summary field for quick context (manual for now, AI-generated later)
3. **Smart UI Display** - Shows summary by default, expandable to view full transcript
4. **Conditional Fields** - Transcript fields only shown for 'call' and 'meeting' activity types

### How to Use

1. **Run the Migration**
   ```bash
   ./run-transcript-migration.sh
   ```
   Or manually run the SQL in Supabase SQL Editor:
   - Navigate to: https://supabase.com/dashboard/project/kyhwbvkakaactdwpqhps/sql/new
   - Copy and run the SQL from `migrations/add_transcript_to_activities.sql`

2. **Log a Call with Transcript**
   - Create/edit a Call or Meeting activity
   - Paste the full transcript in the "Call Transcript" field
   - Add a brief summary in "Transcript Summary" (or leave empty for now)
   - Save the activity

3. **View Transcripts**
   - Activity timeline shows the summary automatically
   - Click "View Full Transcript" to expand and read the complete transcript
   - Transcripts are searchable and will be used by AI for insights

## Future AI Integration
When you activate AI features, the system will:
- **Auto-generate summaries** from full transcripts
- **Analyze sentiment** from call conversations
- **Extract action items** automatically
- **Provide relationship insights** based on conversation patterns
- **Search transcript content** for specific topics

## Technical Details
- Transcripts stored as TEXT (supports up to 1GB)
- Full-text search enabled for efficient querying
- UI optimized for long text with scroll and expand/collapse
- Summary shown inline, full transcript in expandable section
