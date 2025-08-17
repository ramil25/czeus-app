import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const baseFilename = `${timestamp}_${randomStr}.${extension}`;

    // Check if Vercel Blob is available (in production)
    const useVercelBlob = process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== 'dummy_token_for_testing';

    if (useVercelBlob) {
      // Use Vercel Blob storage for production
      const filename = `${folder}/${baseFilename}`;
      
      const blob = await put(filename, file, {
        access: 'public',
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: baseFilename
      });
    } else {
      // Fallback to local filesystem for development
      console.log('Using local filesystem storage (development mode)');
      
      // Create target directory if it doesn't exist
      const publicPath = join(process.cwd(), 'public');
      const imagesPath = join(publicPath, 'images');
      const folderPath = join(imagesPath, folder);
      
      try {
        await mkdir(folderPath, { recursive: true });
      } catch (error) {
        // Directory might already exist, which is fine
      }

      // Write file to disk
      const filePath = join(folderPath, baseFilename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await writeFile(filePath, buffer);

      // Return the public URL path
      const imageUrl = `/images/${folder}/${baseFilename}`;
      
      return NextResponse.json({
        success: true,
        url: imageUrl,
        filename: baseFilename
      });
    }

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}