import React from 'react';

export interface VoucherForm {
  amount: string;
  code: string;
  is_used: boolean;
}

interface AddVoucherModalProps {
  open: boolean;
  form: VoucherForm;
  setForm: (form: VoucherForm) => void;
  onCancel: () => void;
  onAdd: (form: VoucherForm) => void;
  isLoading?: boolean;
}

const AddVoucherModal: React.FC<AddVoucherModalProps> = ({
  open,
  form,
  setForm,
  onCancel,
  onAdd,
  isLoading = false,
}) => {
  if (!open) return null;

  const handleInputChange = (field: keyof VoucherForm, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.code.trim() &&
      form.amount.trim() &&
      !isNaN(Number(form.amount)) &&
      Number(form.amount) > 0
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Add Voucher
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Voucher Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Code *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50 font-mono"
              placeholder="Enter voucher code (e.g., WELCOME20)"
              value={form.code}
              onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
            />
            <p className="text-xs text-gray-500 mt-1">
              Code will be automatically converted to uppercase
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₱) *
            </label>
            <input
              type="number"
              min="1"
              step="1"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter amount in pesos"
              value={form.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  className="mr-2"
                  checked={!form.is_used}
                  onChange={() => handleInputChange('is_used', false)}
                />
                <span className="text-sm text-green-700">Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  className="mr-2"
                  checked={form.is_used}
                  onChange={() => handleInputChange('is_used', true)}
                />
                <span className="text-sm text-red-700">Used</span>
              </label>
            </div>
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
            onClick={() => onAdd(form)}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Voucher'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVoucherModal;