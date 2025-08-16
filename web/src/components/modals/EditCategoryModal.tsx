import React from 'react';
import { Category } from '../../lib/categories';

export interface EditCategoryForm {
  name: string;
  description: string;
}

interface EditCategoryModalProps {
  open: boolean;
  category: Category | null;
  form: EditCategoryForm;
  setForm: (form: EditCategoryForm) => void;
  onCancel: () => void;
  onSave: (form: EditCategoryForm) => void;
  isLoading?: boolean;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  category,
  form,
  setForm,
  onCancel,
  onSave,
  isLoading = false,
}) => {
  if (!open || !category) return null;

  const handleInputChange = (field: keyof EditCategoryForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return form.name.trim();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Edit Category
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter category name"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter description (optional)"
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
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
            onClick={() => onSave(form)}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;