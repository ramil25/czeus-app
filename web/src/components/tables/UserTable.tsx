import React, { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string; // Add role to User type
  createdAt: string;
  updatedAt: string;
};

type UserTableProps = {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onRemove: (user: User) => void;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onEdit,
  onRemove,
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
              Created At
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Updated At
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
                {user.name}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {user.email}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {user.role}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {new Date(user.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {new Date(user.updatedAt).toLocaleString()}
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
              <td colSpan={6} className="py-4 text-center text-gray-500">
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
