'use client';
import { useState } from 'react';
import { InviteUserModal } from '../../../components/modals/InviteUserModal';
import UserTable from '../../../components/tables/UserTable';
import { useUsers, useCreateUser, useDeleteUser } from '../../../hooks/useUsers';
import { UserFormData, User } from '../../../lib/users';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'Staff',
  });

  // Hooks for data management
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  // Filter users based on search
  const filteredUsers: User[] = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form submission
  const handleInvite = async () => {
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createUserMutation.mutateAsync(form);
      setShowModal(false);
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        role: 'Staff',
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  // Handle user actions
  const handleView = (user: User) => {
    alert(`View user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}${user.position ? `\nPosition: ${user.position}` : ''}${user.phone ? `\nPhone: ${user.phone}` : ''}${user.address ? `\nAddress: ${user.address}` : ''}`);
  };

  const handleEdit = (user: User) => {
    alert(`Edit functionality for ${user.name} will be implemented soon.`);
  };

  const handleRemove = async (user: User) => {
    if (confirm(`Are you sure you want to remove ${user.name}?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">User Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowModal(true)}
          disabled={createUserMutation.isPending}
        >
          Add User
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded text-red-700">
          Error loading users: {error.message}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-2 sm:px-3 py-2 sm:py-2 w-1/2 sm:w-full text-black bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>
      
      <div className="overflow-x-auto">
        <UserTable
          users={filteredUsers}
          onView={handleView}
          onEdit={handleEdit}
          onRemove={handleRemove}
          loading={isLoading}
        />
      </div>
      
      <InviteUserModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onInvite={handleInvite}
        loading={createUserMutation.isPending}
      />
    </div>
  );
}
