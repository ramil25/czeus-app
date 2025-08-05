'use client';
import { useState } from 'react';
import { InviteUserModal } from './InviteUserModal';
import { UserTable, User } from '../../../components/tables/UserTable';

const now = new Date().toISOString();
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: now, updatedAt: now },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: now, updatedAt: now },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', createdAt: now, updatedAt: now },
  { id: 4, name: 'Bob Brown', email: 'bob@example.com', createdAt: now, updatedAt: now },
  { id: 5, name: 'Carol White', email: 'carol@example.com', createdAt: now, updatedAt: now },
  { id: 6, name: 'David Black', email: 'david@example.com', createdAt: now, updatedAt: now },
  { id: 7, name: 'Eve Green', email: 'eve@example.com', createdAt: now, updatedAt: now },
  { id: 8, name: 'Frank Blue', email: 'frank@example.com', createdAt: now, updatedAt: now },
  { id: 9, name: 'Grace Red', email: 'grace@example.com', createdAt: now, updatedAt: now },
  { id: 10, name: 'Hank Yellow', email: 'hank@example.com', createdAt: now, updatedAt: now },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredUsers = sampleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
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
        <UserTable
          users={paginatedUsers}
          onView={(user: User) => alert(`View user: ${user.name}`)}
          onEdit={(user: User) => alert(`Edit user: ${user.name}`)}
          onRemove={(user: User) => alert(`Remove user: ${user.name}`)}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
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
