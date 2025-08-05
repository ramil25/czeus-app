import React from 'react';

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserTableProps = {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onRemove: (user: User) => void;
};

export function UserTable({ users, onView, onEdit, onRemove }: UserTableProps) {
  return (
    <table className="min-w-full bg-white border border-blue-200">
      <thead>
        <tr className="bg-blue-50">
          <th className="py-2 px-4 border-b text-left text-black">Name</th>
          <th className="py-2 px-4 border-b text-left text-black">Email</th>
          <th className="py-2 px-4 border-b text-left text-black">
            Created At
          </th>
          <th className="py-2 px-4 border-b text-left text-black">
            Updated At
          </th>
          <th className="py-2 px-4 border-b text-right text-black border-black">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-blue-100">
            <td className="py-2 px-4 border-b text-black">{user.name}</td>
            <td className="py-2 px-4 border-b text-black">{user.email}</td>
            <td className="py-2 px-4 border-b text-left text-black">
              {new Date(user.createdAt).toLocaleString()}
            </td>
            <td className="py-2 px-4 border-b text-left text-black">
              {new Date(user.updatedAt).toLocaleString()}
            </td>
            <td className="py-2 px-4 border-b text-right border-black">
              <div className="flex gap-2 justify-end">
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
        {users.length === 0 && (
          <tr>
            <td colSpan={5} className="py-4 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
