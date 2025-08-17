# Image Upload Configuration for Vercel Deployment

This document explains how to configure image uploads for the czeus-app when deployed on Vercel.

## Problem

The original image upload functionality used Node.js filesystem operations (`writeFile`, `mkdir`) to save files to the local `public/images` directory. This approach works in development but fails on Vercel because:

1. **Ephemeral Storage**: Vercel's serverless functions run in containers with ephemeral storage
2. **File Persistence**: Files written to the filesystem are lost when the function execution ends
3. **Static Asset Serving**: Vercel doesn't serve dynamically created files from the public directory in production

## Solution

The application now uses **Vercel Blob Storage** for production deployments while maintaining filesystem storage for local development.

### Implementation Details

#### 1. Dual Storage Strategy
- **Production (Vercel)**: Uses `@vercel/blob` for persistent cloud storage
- **Development (Local)**: Uses filesystem storage in `public/images/`
- **Automatic Detection**: Checks for `BLOB_READ_WRITE_TOKEN` environment variable

#### 2. Updated Upload API (`/api/upload-image`)
- Validates file type and size (max 5MB)
- Generates unique filenames with timestamps
- Routes to appropriate storage based on environment
- Returns consistent response format for both storage types

#### 3. Environment Variables Required

For **Vercel deployment**, add this environment variable in your Vercel dashboard:

```
BLOB_READ_WRITE_TOKEN=<your-vercel-blob-token>
```

For **local development**, the app automatically uses filesystem storage.

## Deployment Instructions

### Step 1: Install Dependencies
The `@vercel/blob` package is already included in `package.json`.

### Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your Vercel Blob token (get from Vercel dashboard → Storage → Blob)
   - **Environment**: Production, Preview, Development (or as needed)

### Step 3: Deploy
Deploy your application to Vercel as usual. The image upload will automatically use Vercel Blob storage.

## Testing

### Local Development
```bash
npm run dev
# Upload functionality uses local filesystem storage
# Files saved to: public/images/{folder}/{filename}
```

### Production (Vercel)
- Images are stored in Vercel Blob Storage
- Returns full URLs like: `https://{project}.blob.vercel.app/{folder}/{filename}`
- Images are globally accessible and persistent

## File Structure

```
web/
├── src/
│   ├── app/api/upload-image/
│   │   └── route.ts                 # Updated upload API with dual storage
│   └── utils/
│       └── fileUpload.ts           # Frontend upload utility (unchanged)
├── public/
│   └── images/                     # Local development storage
└── package.json                    # Includes @vercel/blob dependency
```

## Benefits

1. **Production Ready**: Works reliably on Vercel's serverless infrastructure
2. **Development Friendly**: No setup required for local development
3. **Performance**: Vercel Blob provides global CDN distribution
4. **Scalability**: No file size or quantity limits with Vercel Blob
5. **Backward Compatible**: Same API interface for frontend code

## Troubleshooting

### Upload Fails in Production
- Verify `BLOB_READ_WRITE_TOKEN` is set in Vercel environment variables
- Check Vercel Blob storage is enabled for your project
- Review function logs in Vercel dashboard for specific errors

### Upload Works Locally but Not in Production
- Ensure you've deployed the updated code with `@vercel/blob` dependency
- Confirm environment variable is properly configured
- Check that your Vercel plan supports Blob storage

### Storage Costs
- Vercel Blob has usage-based pricing
- Monitor storage usage in Vercel dashboard
- Consider implementing image optimization or size limits as needed