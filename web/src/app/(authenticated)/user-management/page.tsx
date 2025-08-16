'use client';
import { useState } from 'react';
import { InviteUserModal } from '../../../components/modals/InviteUserModal';
import EditUserModal, { EditUserForm } from '../../../components/modals/EditUserModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import UserTable from '../../../components/tables/UserTable';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../../../hooks/useUsers';
import { UserFormData, User } from '../../../lib/users';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'staff',
  });
  const [editForm, setEditForm] = useState<EditUserForm>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'staff',
  });

  // Hooks for data management
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
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
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
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
        role: 'staff',
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  // Handle user actions
  const handleView = (user: User) => {
    alert(
      `View user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}${
        user.position ? `\nPosition: ${user.position}` : ''
      }${user.phone ? `\nPhone: ${user.phone}` : ''}${
        user.address ? `\nAddress: ${user.address}` : ''
      }`
    );
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      position: user.position,
      address: user.address,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    if (
      !editForm.first_name.trim() ||
      !editForm.last_name.trim() ||
      !editForm.email.trim()
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const userFormData: UserFormData = {
        first_name: editForm.first_name,
        middle_name: editForm.middle_name,
        last_name: editForm.last_name,
        email: editForm.email,
        role: editForm.role,
        phone: editForm.phone,
        position: editForm.position,
        address: editForm.address,
      };

      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: userFormData,
      });

      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({
        first_name: '',
        last_name: '',
        email: '',
        role: 'staff',
      });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditForm({
      first_name: '',
      last_name: '',
      email: '',
      role: 'staff',
    });
  };

  const handleRemove = async (user: User) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
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

      <EditUserModal
        open={showEditModal}
        user={selectedUser}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        isLoading={updateUserMutation.isPending}
      />

      <ConfirmationModal
        open={showConfirmModal}
        title="Remove User"
        message={`Are you sure you want to remove ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteUserMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
