'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { InviteUserModal } from '../../../components/modals/InviteUserModal';
import UserTable from '../../../components/tables/UserTable';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, User } from '../../../hooks/useUsers';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
  });

  // Hooks for data fetching and mutations
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role as 'Admin' | 'Staff' | 'Customer'
      });
      
      toast.success('User created successfully!');
      setForm({ name: '', email: '', password: '', role: 'Staff' });
      setShowModal(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleViewUser = (user: User) => {
    const details = `
Name: ${user.name}
Email: ${user.email}
Role: ${user.role}
Created: ${new Date(user.createdAt).toLocaleDateString()}
Updated: ${new Date(user.updatedAt).toLocaleDateString()}
    `.trim();
    
    alert(`User Details:\n\n${details}`);
  };

  const handleEditUser = (user: User) => {
    const newName = prompt('Enter new name:', user.name);
    const newRole = prompt('Enter new role (Admin, Staff, Customer):', user.role);
    
    if (newName && newRole && ['Admin', 'Staff', 'Customer'].includes(newRole)) {
      updateUserMutation.mutate(
        { 
          id: user.id, 
          name: newName, 
          role: newRole as 'Admin' | 'Staff' | 'Customer' 
        },
        {
          onSuccess: () => toast.success('User updated successfully!'),
          onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed to update user')
        }
      );
    }
  };

  const handleRemoveUser = (user: User) => {
    if (window.confirm(`Are you sure you want to remove ${user.name}?`)) {
      deleteUserMutation.mutate(user.id, {
        onSuccess: () => toast.success('User removed successfully!'),
        onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed to remove user')
      });
    }
  };

  if (error) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="text-red-600">
          Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">User Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowModal(true)}
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Adding...' : 'Add User'}
        </button>
      </div>
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
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-blue-600">Loading users...</p>
          </div>
        ) : (
          <UserTable
            users={filteredUsers.map(user => ({
              id: parseInt(user.id),
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }))}
            onView={(user) => handleViewUser(users.find(u => u.id === user.id.toString())!)}
            onEdit={(user) => handleEditUser(users.find(u => u.id === user.id.toString())!)}
            onRemove={(user) => handleRemoveUser(users.find(u => u.id === user.id.toString())!)}
          />
        )}
      </div>
      <InviteUserModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => {
          setShowModal(false);
          setForm({ name: '', email: '', password: '', role: 'Staff' });
        }}
        onInvite={handleCreateUser}
        isLoading={createUserMutation.isPending}
      />
    </div>
  );
}
