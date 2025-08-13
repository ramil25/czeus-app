import React from 'react';
import { Discount, DiscountType } from '../../lib/discounts';

export interface EditDiscountForm {
  discount_name: string;
  discount_type: DiscountType;
  discount_value: string;
}

interface EditDiscountModalProps {
  open: boolean;
  discount: Discount | null;
  form: EditDiscountForm;
  setForm: (form: EditDiscountForm) => void;
  onCancel: () => void;
  onSave: (form: EditDiscountForm) => void;
  isLoading?: boolean;
}

const EditDiscountModal: React.FC<EditDiscountModalProps> = ({
  open,
  discount,
  form,
  setForm,
  onCancel,
  onSave,
  isLoading = false,
}) => {
  if (!open || !discount) return null;

  const handleInputChange = (field: keyof EditDiscountForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.discount_name.trim() &&
      form.discount_type &&
      form.discount_value.trim() &&
      !isNaN(Number(form.discount_value)) &&
      Number(form.discount_value) > 0
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Edit Discount
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Discount Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter discount name"
              value={form.discount_name}
              onChange={(e) => handleInputChange('discount_name', e.target.value)}
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.discount_type}
              onChange={(e) =>
                handleInputChange(
                  'discount_type',
                  e.target.value as DiscountType
                )
              }
            >
              <option value="percentage">Percentage</option>
              <option value="actual">Value</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter discount value"
              value={form.discount_value}
              onChange={(e) => handleInputChange('discount_value', e.target.value)}
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

export default EditDiscountModal;