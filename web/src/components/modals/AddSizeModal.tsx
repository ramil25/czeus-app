'use client';
import React from 'react';

export interface SizeForm {
  sizeName: string;
  category: string;
}

interface AddSizeModalProps {
  open: boolean;
  form: SizeForm;
  setForm: (form: SizeForm) => void;
  onCancel: () => void;
  onAdd: () => void;
  categories?: string[]; // Optional: list of food categories for dropdown
}

const AddSizeModal: React.FC<AddSizeModalProps> = ({
  open,
  form,
  setForm,
  onCancel,
  onAdd,
  categories = [
    'Coffee',
    'Tea',
    'Pastries',
    'Sandwiches',
    'Salads',
    'Smoothies',
    'Breakfast',
    'Desserts',
    'Juices',
    'Snacks',
  ],
}) => {
  if (!open) return null;

  const handleInputChange = (field: keyof SizeForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return form.sizeName.trim() && form.category.trim();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Add Size</h2>

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
              value={form.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-6 py-2 bg-white border border-blue-200 text-black rounded hover:bg-blue-100 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onAdd}
            disabled={!isFormValid()}
          >
            Add Size
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSizeModal;
