# File Upload Setup Guide

This guide explains how to set up file uploads to Supabase Storage for deal attachments.

## Supabase Storage Setup

### 1. Create Storage Bucket

Run the migration script or manually create the bucket:

```bash
# Using Supabase CLI
supabase db push
```

Or manually in Supabase Dashboard:
1. Go to Storage in your Supabase project
2. Click "New bucket"
3. Name it `deal-attachments`
4. Make it public
5. Click "Create bucket"

### 2. Set Up Storage Policies

The migration script includes RLS policies, but you can also set them manually:

**Upload Policy:**
```sql
create policy "Authenticated users can upload deal attachments"
on storage.objects for insert
to authenticated
with check (bucket_id = 'deal-attachments');
```

**Read Policy:**
```sql
create policy "Public can read deal attachments"
on storage.objects for select
to public
using (bucket_id = 'deal-attachments');
```

**Delete Policy:**
```sql
create policy "Authenticated users can delete deal attachments"
on storage.objects for delete
to authenticated
using (bucket_id = 'deal-attachments');
```

### 3. Update Database Schema

Ensure the `deals.attachments` column is JSONB:

```sql
alter table deals 
alter column attachments type jsonb using attachments::jsonb;
```

## Features

### File Upload
- Upload multiple files when creating a deal
- Files are stored in Supabase Storage organized by deal ID
- File metadata (name, URL, size, type) is stored in the database

### File Preview
- Images can be previewed inline
- PDFs can be previewed in an iframe
- Other file types show appropriate icons

### File Download
- All files can be downloaded
- Public URLs are generated for easy sharing

### Mock Mode
- In mock/development mode, files are not uploaded
- Mock URLs are generated for testing

## Supported File Types

- **Images**: JPG, JPEG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX
- **Spreadsheets**: XLS, XLSX
- **Text**: TXT
- **Archives**: ZIP, RAR

## File Organization

Files are organized in storage by deal ID:
```
deal-attachments/
  ├── [dealId]/
  │   ├── 1699564800000-abc123.pdf
  │   ├── 1699564801000-def456.jpg
  │   └── ...
```

## Components

### AttachmentList
Displays attachments with preview and download buttons:
- Shows file icon based on type
- Displays file name, size, and type
- Preview button for images and PDFs
- Download button for all files

### CreateDealSheet
Updated to handle file uploads:
- File selection with preview
- Upload progress indicator
- Automatic upload on deal creation

## Storage Functions

Located in `lib/storage.ts`:

- `uploadFile(file, dealId)` - Upload a single file
- `uploadFiles(files, dealId)` - Upload multiple files
- `deleteFile(url)` - Delete a file by URL
- `formatFileSize(bytes)` - Format bytes to human-readable size
- `isImageFile(filename)` - Check if file is an image
- `isPDFFile(filename)` - Check if file is a PDF

## Security Notes

- Storage bucket is public for read access
- Write access requires authentication
- Files are organized by deal ID for access control
- Consider adding row-level security based on deal ownership

## Future Enhancements

- [ ] Add file size limits
- [ ] Implement file type restrictions
- [ ] Add virus scanning
- [ ] Implement thumbnail generation for images
- [ ] Add file compression for large files
- [ ] Implement CDN caching
- [ ] Add file versioning
