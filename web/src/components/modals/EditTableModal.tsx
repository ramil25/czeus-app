import React from 'react';
import { Table } from '../../lib/tables';

export interface EditTableForm {
  tableNumber: string;
  numberOfSeats: string;
}

interface EditTableModalProps {
  open: boolean;
  table: Table | null;
  form: EditTableForm;
  setForm: (form: EditTableForm) => void;
  onCancel: () => void;
  onSave: (form: EditTableForm) => void;
  isLoading?: boolean;
}

const EditTableModal: React.FC<EditTableModalProps> = ({
  open,
  table,
  form,
  setForm,
  onCancel,
  onSave,
  isLoading = false,
}) => {
  if (!open || !table) return null;

  const handleInputChange = (field: keyof EditTableForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.tableNumber.trim() &&
      form.numberOfSeats.trim() &&
      !isNaN(Number(form.numberOfSeats)) &&
      Number(form.numberOfSeats) > 0
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Edit Table
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Number *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter table number"
              value={form.tableNumber}
              onChange={(e) => handleInputChange('tableNumber', e.target.value)}
            />
          </div>

          {/* Number of Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Seats *
            </label>
            <input
              type="number"
              min="1"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter number of seats"
              value={form.numberOfSeats}
              onChange={(e) => handleInputChange('numberOfSeats', e.target.value)}
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

export default EditTableModal;