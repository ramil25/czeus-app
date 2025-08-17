// File upload utility functions

/**
 * Upload an image file to the public/images directory
 * @param file - The image file to upload
 * @param folder - Optional subfolder in public/images/ (default: 'products')
 * @returns Promise<string> - Returns the public URL path to the uploaded image
 */
export async function uploadImageToPublic(file: File, folder: string = 'products'): Promise<string> {
  try {
    // Create FormData to send file to the API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Call our upload API endpoint
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Upload failed: ${errorData}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.url) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Validate if a file is a supported image type
 * @param file - The file to validate
 * @returns boolean - True if file is a supported image
 */
export function isValidImageFile(file: File): boolean {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return supportedTypes.includes(file.type.toLowerCase());
}

/**
 * Validate file size (max 5MB)
 * @param file - The file to validate
 * @returns boolean - True if file size is acceptable
 */
export function isValidFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  return file.size <= maxSize;
}

/**
 * Generate a unique filename for the uploaded image
 * @param originalFilename - Original filename
 * @returns string - Unique filename with timestamp
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}_${randomStr}.${extension}`;
}

/**
 * Create a preview URL for an image file
 * @param file - The image file
 * @returns string - Object URL for preview
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}