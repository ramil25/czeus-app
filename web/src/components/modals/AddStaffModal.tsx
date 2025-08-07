import React from 'react';

export interface StaffForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  address: string;
}

interface AddStaffModalProps {
  open: boolean;
  form: StaffForm;
  setForm: (form: StaffForm) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  open,
  form,
  setForm,
  onCancel,
  onAdd,
}) => {
  if (!open) return null;

  const handleInputChange = (field: keyof StaffForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.position.trim()
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Add New Staff Member
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
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
            >
              <option value="">Select position</option>
              <option value="Manager">Manager</option>
              <option value="Barista">Barista</option>
              <option value="Cashier">Cashier</option>
              <option value="Kitchen Staff">Kitchen Staff</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Assistant Manager">Assistant Manager</option>
              <option value="Server">Server</option>
              <option value="Cleaner">Cleaner</option>
            </select>
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
          />
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
            Add Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
