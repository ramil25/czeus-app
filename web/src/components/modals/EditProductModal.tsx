'use client';
import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useSizes } from '../../hooks/useSizes';
import { ProductDisplay } from '../../lib/products';
import { isValidImageFile, isValidFileSize, createImagePreview } from '../../utils/fileUpload';

export interface EditProductForm {
  name: string;
  categoryId: number | '';
  sizeId: number | '';
  price: string;
  status: 'Available' | 'Not Available';
  imageFile?: File;
  imageUrl?: string;
}

interface EditProductModalProps {
  open: boolean;
  product: ProductDisplay | null;
  form: EditProductForm;
  setForm: (form: EditProductForm) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  product,
  form,
  setForm,
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allSizes = [], isLoading: sizesLoading } = useSizes();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  
  // Update image preview when product or form changes
  useEffect(() => {
    if (form.imageUrl) {
      setImagePreview(form.imageUrl);
    } else if (product?.imageUrl) {
      setImagePreview(product.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [form.imageUrl, product?.imageUrl]);
  
  // Filter sizes based on selected category
  const availableSizes = form.categoryId 
    ? allSizes.filter(size => size.categoryId === form.categoryId)
    : [];
  
  if (!open || !product) return null;

  const handleInputChange = (field: keyof EditProductForm, value: string | number | EditProductForm['status'] | File) => {
    const newForm = { ...form, [field]: value };
    
    // If category changed, clear the size selection
    if (field === 'categoryId') {
      newForm.sizeId = '';
    }
    
    setForm(newForm);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }

    setIsImageUploading(true);

    // Create preview
    const previewUrl = createImagePreview(file);
    setImagePreview(previewUrl);

    // Update form
    handleInputChange('imageFile', file);
    
    // Simulate image upload processing time for better UX
    setTimeout(() => {
      setIsImageUploading(false);
    }, 1000);
  };

  const removeImage = () => {
    setImagePreview(null);
    setIsImageUploading(false);
    setForm({ ...form, imageFile: undefined, imageUrl: undefined });
  };

  const isFormValid = () => {
    return (
      form.name.trim() &&
      form.categoryId !== '' &&
      form.sizeId !== '' &&
      form.price.trim() &&
      !isNaN(Number(form.price)) &&
      Number(form.price) > 0 &&
      form.status
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Edit Product</h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className={`w-32 h-32 object-cover rounded-lg border border-blue-200 ${isImageUploading ? 'opacity-50' : ''}`}
                  />
                  {isImageUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <div className="flex flex-col items-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                        <span className="text-sm">Processing...</span>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isImageUploading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
                  <span className="text-gray-500 text-sm">No image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isImageUploading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.categoryId}
              onChange={(e) => handleInputChange('categoryId', Number(e.target.value))}
              disabled={categoriesLoading}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
            )}
          </div>

          {/* Size Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.sizeId}
              onChange={(e) => handleInputChange('sizeId', Number(e.target.value))}
              disabled={sizesLoading || !form.categoryId}
            >
              <option value="">
                {!form.categoryId ? 'Select category first' : 'Select size'}
              </option>
              {availableSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.sizeName}
                </option>
              ))}
            </select>
            {sizesLoading && (
              <p className="text-sm text-gray-500 mt-1">Loading sizes...</p>
            )}
            {form.categoryId && availableSizes.length === 0 && !sizesLoading && (
              <p className="text-sm text-orange-600 mt-1">No sizes available for this category</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={
                  form.status === 'Available'
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-400'
                }
              >
                Available
              </span>
              <button
                type="button"
                aria-pressed={form.status === 'Available'}
                onClick={() =>
                  handleInputChange(
                    'status',
                    form.status === 'Available' ? 'Not Available' : 'Available'
                  )
                }
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  form.status === 'Available' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    form.status === 'Available'
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={
                  form.status === 'Not Available'
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-400'
                }
              >
                Not Available
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-6 py-2 bg-white border border-blue-200 text-black rounded hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
            disabled={isLoading || isImageUploading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading || isImageUploading}
          >
            {isImageUploading ? 'Processing Image...' : isLoading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;