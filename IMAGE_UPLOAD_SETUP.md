# Image Upload Setup for Vercel Deployment

## Overview
The image upload functionality has been updated to work with Vercel deployment by using Supabase Storage instead of local file system storage.

## Changes Made
- Modified `/web/src/app/api/upload-image/route.ts` to use Supabase Storage
- Replaced local file system calls (`fs.writeFile`, `fs.mkdir`) with Supabase Storage API
- Maintained the same API interface for compatibility with existing frontend code

## Setup Requirements for Production

### 1. Supabase Storage Bucket
Create an "images" bucket in your Supabase project:
1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket named "images"
4. Set appropriate permissions (typically public read access for product images)

### 2. Environment Variables
Ensure these environment variables are set in your Vercel deployment:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Bucket Policies (Optional)
For public product images, you may want to set a policy allowing public read access:
```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

## API Behavior
- **Input**: Same as before - FormData with 'file' and optional 'folder'
- **Output**: Returns Supabase Storage public URL instead of local path
- **Error Handling**: Provides specific error messages for common setup issues

## Benefits
- ✅ Works on Vercel serverless environment
- ✅ Persistent file storage (unlike local file system)
- ✅ CDN-backed delivery through Supabase
- ✅ Better scalability and performance
- ✅ Maintained API compatibility