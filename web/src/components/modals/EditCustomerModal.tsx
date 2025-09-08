import React from 'react';
import { Customer } from '../../lib/customers';

export interface EditCustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface EditCustomerModalProps {
  open: boolean;
  customer: Customer | null;
  form: EditCustomerForm;
  setForm: (form: EditCustomerForm) => void;
  onCancel: () => void;
  onSave: (form: EditCustomerForm) => void;
  isLoading?: boolean;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  open,
  customer,
  form,
  setForm,
  onCancel,
  onSave,
  isLoading = false,
}) => {
  if (!open || !customer) return null;

  const handleInputChange = (field: keyof EditCustomerForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      form.phone.trim()
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Edit Customer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Email - Read-only for customers as per requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email * (Cannot be changed)
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 text-black cursor-not-allowed"
              placeholder="Enter email address"
              value={form.email}
              disabled={true}
              title="Email cannot be changed for existing customers"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Address - Full Width */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            rows={3}
            className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
            placeholder="Enter full address"
            value={form.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={isLoading}
          />
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

export default EditCustomerModal;