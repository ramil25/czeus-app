# Image Upload API Documentation

## Overview
The CZEUS web application provides a public API endpoint for uploading images that can be used by both the web interface and mobile applications.

## API Endpoint

**URL:** `/api/upload-image`  
**Method:** `POST`  
**Content-Type:** `multipart/form-data`  
**Authentication:** None required (public endpoint)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | The image file to upload |
| `folder` | String | No | Subfolder in storage (default: 'products') |

### Supported File Types
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)

### File Size Limits
- Maximum file size: 5MB

## Response Format

### Success Response
```json
{
  "success": true,
  "url": "https://example.blob.vercel-storage.com/products/1234567890_abc123.png",
  "filename": "1234567890_abc123.png"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Upload successful |
| 400 | Bad request (invalid file type, size too large, no file provided) |
| 500 | Internal server error |

## Storage Behavior

1. **Production (Vercel Deployment)**: Uses Vercel Blob storage with public CDN URLs
2. **Development/Fallback**: Uses local filesystem with relative URLs

The API automatically handles storage selection and provides fallback mechanisms for reliability.

## Usage Examples

### curl Example
```bash
curl -X POST \
  -F "file=@/path/to/image.png" \
  -F "folder=products" \
  https://your-app-domain.vercel.app/api/upload-image
```

### JavaScript/React Native Example
```javascript
const uploadImage = async (imageFile, folder = 'products') => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('folder', folder);

  try {
    const response = await fetch('https://your-app-domain.vercel.app/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Upload successful:', result.url);
      return result.url;
    } else {
      console.error('Upload failed:', result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

### React Native with ImagePicker Example
```javascript
import * as ImagePicker from 'expo-image-picker';

const pickAndUploadImage = async () => {
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    formData.append('folder', 'products');

    // Upload to API
    try {
      const response = await fetch('https://your-app-domain.vercel.app/api/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadResult = await response.json();
      
      if (uploadResult.success) {
        return uploadResult.url;
      } else {
        throw new Error(uploadResult.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
};
```

## Mobile Development Notes

1. **Public Access**: The endpoint requires no authentication and can be called directly from mobile apps
2. **CORS**: The endpoint supports cross-origin requests for web browser usage
3. **File Handling**: Mobile apps should handle file selection and prepare FormData as shown in examples
4. **Error Handling**: Always check the `success` field in the response and handle errors appropriately
5. **Image URLs**: The returned URLs can be used directly in image components (Image, img tags, etc.)

## Environment Configuration

### For Production Deployment
Set the following environment variable in your Vercel deployment:
```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### For Development
The API automatically falls back to local filesystem storage when the Vercel Blob token is not available.

## Testing the API

You can test the API endpoint using the provided curl command or by implementing the JavaScript examples in your mobile application.

## Integration with Supabase

When using this API for product management:

1. Upload the image using this API endpoint
2. Save the returned `url` to the `image_url` field in your Supabase `products` table
3. The URL will be accessible for both web and mobile applications

Example flow:
```javascript
// 1. Upload image
const imageUrl = await uploadImage(selectedFile, 'products');

// 2. Create/update product in Supabase
const { data, error } = await supabase
  .from('products')
  .insert({
    product_name: 'Coffee Mug',
    category_id: 1,
    size_id: 1,
    price: 15.99,
    image_url: imageUrl,  // Use the uploaded image URL
    status: 'available'
  });
```

This ensures that all uploaded images are stored consistently and accessible across all platforms.