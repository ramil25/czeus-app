'use client';
import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useSizes } from '../../hooks/useSizes';
import { ProductDisplay } from '../../lib/products';

export interface EditProductForm {
  name: string;
  categoryId: number | '';
  sizeId: number | '';
  price: string;
  status: 'Available' | 'Not Available';
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
  
  // Filter sizes based on selected category
  const availableSizes = form.categoryId 
    ? allSizes.filter(size => size.categoryId === form.categoryId)
    : [];
  
  if (!open || !product) return null;

  const handleInputChange = (field: keyof EditProductForm, value: string | number | EditProductForm['status']) => {
    const newForm = { ...form, [field]: value };
    
    // If category changed, clear the size selection
    if (field === 'categoryId') {
      newForm.sizeId = '';
    }
    
    setForm(newForm);
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
            className="px-6 py-2 bg-white border border-blue-200 text-black rounded hover:bg-blue-100 transition-colors"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;