'use client';
import { useState } from 'react';
import { InviteUserModal } from '../../../components/modals/InviteUserModal';
import UserTable from '../../../components/tables/UserTable';

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

const now = new Date().toISOString();
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bob@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    name: 'Carol White',
    email: 'carol@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    name: 'David Black',
    email: 'david@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    name: 'Eve Green',
    email: 'eve@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    name: 'Frank Blue',
    email: 'frank@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9,
    name: 'Grace Red',
    email: 'grace@example.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 10,
    name: 'Hank Yellow',
    email: 'hank@example.com',
    createdAt: now,
    updatedAt: now,
  },
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
    <div className="p-8 bg-blue-50 min-h-screen">
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
          users={filteredUsers}
          onView={(user: User) => alert(`View user: ${user.name}`)}
          onEdit={(user: User) => alert(`Edit user: ${user.name}`)}
          onRemove={(user: User) => alert(`Remove user: ${user.name}`)}
        />
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
