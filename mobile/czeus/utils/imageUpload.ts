/**
 * Mobile image upload utility functions
 * Handles uploading images from mobile app to the server
 */

/**
 * Upload an image file from mobile to the server
 * @param imageUri - The local file URI from expo-image-picker
 * @param folder - Optional subfolder (default: 'products')
 * @returns Promise<string> - Returns the public URL from server
 */
export async function uploadImageFromMobile(imageUri: string, folder: string = 'products'): Promise<string> {
  try {
    // Create FormData for the file upload
    const formData = new FormData();
    
    // Create file object from URI for React Native
    const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `mobile_upload_${Date.now()}.${fileExtension}`;
    
    // For React Native, we need to create a file-like object
    const file = {
      uri: imageUri,
      type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
      name: fileName,
    } as any;

    formData.append('file', file);
    formData.append('folder', folder);

    // Call the upload API endpoint
    const response = await fetch('https://czeus-app.vercel.app/api/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.url) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.url;
  } catch (error) {
    console.error('Error uploading image from mobile:', error);
    throw error;
  }
}

/**
 * Validate if a URI points to a valid image file
 * @param uri - The image URI to validate
 * @returns boolean - True if URI appears to be a valid image
 */
export function isValidImageUri(uri: string): boolean {
  if (!uri) return false;
  
  const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = uri.split('.').pop()?.toLowerCase();
  
  return supportedExtensions.includes(extension || '');
}

/**
 * Check if URI is a local file URI (needs uploading)
 * @param uri - The URI to check
 * @returns boolean - True if it's a local file URI
 */
export function isLocalFileUri(uri: string): boolean {
  return uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('assets-library://');
}