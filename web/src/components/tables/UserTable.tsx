'use client';
import React, { useState } from 'react';
import { User } from '@/lib/users';

type UserTableProps = {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onRemove: (user: User) => void;
  loading?: boolean;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onEdit,
  onRemove,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-blue-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full bg-white border border-blue-200 rounded shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Name
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Email
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Role
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Position
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Phone
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Created At
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-blue-50">
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                <div>
                  <div className="font-medium">{user.name}</div>
                  {user.middle_name && (
                    <div className="text-sm text-gray-500">Middle: {user.middle_name}</div>
                  )}
                </div>
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {user.email}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'Staff' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {user.position || '-'}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {user.phone || '-'}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    onClick={() => onView(user)}
                  >
                    View
                  </button>
                  <button
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    onClick={() => onRemove(user)}
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan={7} className="py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-black">
          Showing {(currentPage - 1) * pageSize + 1} -{' '}
          {Math.min(currentPage * pageSize, users.length)} of {users.length}
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
