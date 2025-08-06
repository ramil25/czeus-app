'use client';
import React from "react";

interface InviteUserModalProps {
  open: boolean;
  form: { name: string; email: string; password: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
  onCancel: () => void;
  onInvite: () => void;
}

export function InviteUserModal({ open, form, setForm, onCancel, onInvite }: InviteUserModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Invite User</h2>
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onInvite(); }}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border border-blue-300 rounded px-3 py-2 text-black bg-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="border border-blue-300 rounded px-3 py-2 text-black bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="border border-blue-300 rounded px-3 py-2 text-black bg-white"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
