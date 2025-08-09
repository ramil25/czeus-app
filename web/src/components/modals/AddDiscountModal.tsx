import React from 'react';

export interface DiscountForm {
  name: string;
  type: 'percentage' | 'actual' | '';
  value: string;
}

interface AddDiscountModalProps {
  open: boolean;
  form: DiscountForm;
  setForm: (form: DiscountForm) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  open,
  form,
  setForm,
  onCancel,
  onAdd,
}) => {
  if (!open) return null;

  const handleInputChange = (field: keyof DiscountForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.name.trim() &&
      form.type &&
      form.value.trim() &&
      !isNaN(Number(form.value)) &&
      Number(form.value) > 0
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Add Discount
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
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.type}
              onChange={(e) =>
                handleInputChange(
                  'type',
                  e.target.value as 'percentage' | 'actual'
                )
              }
            >
              <option value="">Select type</option>
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
              value={form.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
            />
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
            Add Discount
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountModal;
