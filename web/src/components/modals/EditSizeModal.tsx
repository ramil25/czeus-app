'use client';
import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Size } from '../tables/SizeTable';

export interface EditSizeForm {
  sizeName: string;
  categoryId: number | '';
}

interface EditSizeModalProps {
  open: boolean;
  size: Size | null;
  form: EditSizeForm;
  setForm: (form: EditSizeForm) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const EditSizeModal: React.FC<EditSizeModalProps> = ({
  open,
  size,
  form,
  setForm,
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  
  if (!open || !size) return null;

  const handleInputChange = (field: keyof EditSizeForm, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return form.sizeName.trim() && form.categoryId !== '';
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Edit Size</h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Size Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter size name"
              value={form.sizeName}
              onChange={(e) => handleInputChange('sizeName', e.target.value)}
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
            {isLoading ? 'Updating...' : 'Update Size'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSizeModal;