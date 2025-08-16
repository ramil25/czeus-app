'use client';
import React from 'react';
import { UserFormData } from '@/lib/users';

interface InviteUserModalProps {
  open: boolean;
  form: UserFormData;
  setForm: React.Dispatch<React.SetStateAction<UserFormData>>;
  onCancel: () => void;
  onInvite: () => void;
  loading?: boolean;
}

export function InviteUserModal({
  open,
  form,
  setForm,
  onCancel,
  onInvite,
  loading,
}: InviteUserModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Invite User</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onInvite();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              placeholder="Middle Name (Optional)"
              value={form.middle_name || ''}
              onChange={(e) =>
                setForm({ ...form, middle_name: e.target.value || undefined })
              }
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              required
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as 'admin' | 'staff' | 'customer',
                })
              }
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              value={form.phone || ''}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value || undefined })
              }
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              placeholder="Position/Title (Optional)"
              value={form.position || ''}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value || undefined })
              }
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              placeholder="Address (Optional)"
              value={form.address || ''}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value || undefined })
              }
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white resize-none"
              rows={2}
              disabled={loading}
            />
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Default password: &quot;ILoveCoffee@01&quot;
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
