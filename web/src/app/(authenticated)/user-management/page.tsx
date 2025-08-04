'use client';
import { useState } from 'react';
import { InviteUserModal } from './InviteUserModal';

const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const filteredUsers = sampleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">User Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Add User
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-200">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-4 border-b text-left text-black">Name</th>
              <th className="py-2 px-4 border-b text-left text-black">Email</th>
              <th className="py-2 px-4  border-b text-right text-black border-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-100">
                <td className="py-2 px-4 border-b text-black">{user.name}</td>
                <td className="py-2 px-4 border-b text-black">{user.email}</td>
                <td className="py-2 px-4 border-b text-right border-black">
                  <div className="flex gap-2 justify-end">
                    <button
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      onClick={() => alert(`View user: ${user.name}`)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                      onClick={() => alert(`Edit user: ${user.name}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      onClick={() => alert(`Remove user: ${user.name}`)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InviteUserModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onInvite={() => setShowModal(false)}
      />
    </div>
  );
}
