'use client';
import React from 'react';
import { User } from '@/lib/users';

export interface EditUserForm {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  position?: string;
  address?: string;
}

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  form: EditUserForm;
  setForm: (form: EditUserForm) => void;
  onCancel: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  user,
  form,
  setForm,
  onCancel,
  onSave,
  isLoading = false,
}) => {
  if (!open || !user) return null;

  const handleInputChange = (field: keyof EditUserForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.first_name.trim() &&
      form.last_name.trim() &&
      form.email.trim() &&
      form.role
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Edit User
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
              value={form.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
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
              value={form.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter middle name (optional)"
              value={form.middle_name || ''}
              onChange={(e) => handleInputChange('middle_name', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Email (Read-only as per requirements) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              placeholder="Email address"
              value={form.email}
              disabled={true}
              readOnly={true}
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be modified</p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              disabled={isLoading}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter phone number (optional)"
              value={form.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter position/title (optional)"
              value={form.position || ''}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50 resize-none"
              placeholder="Enter address (optional)"
              value={form.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={isLoading}
              rows={3}
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
            onClick={onSave}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;