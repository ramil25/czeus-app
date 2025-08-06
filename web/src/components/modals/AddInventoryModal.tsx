import React from 'react';

export type InventoryForm = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
};

export type AddInventoryModalProps = {
  open: boolean;
  form: InventoryForm;
  setForm: React.Dispatch<React.SetStateAction<InventoryForm>>;
  onCancel: () => void;
  onAdd: () => void;
};

export function AddInventoryModal({
  open,
  form,
  setForm,
  onCancel,
  onAdd,
}: AddInventoryModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          Add Inventory Item
        </h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="border border-blue-300 rounded px-3 py-2 w-full mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="border border-blue-300 rounded px-3 py-2 w-full mb-2 text-black"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm((f) => ({ ...f, quantity: e.target.value }))
            }
            className="border border-blue-300 rounded px-3 py-2 w-full mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Unit"
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            className="border border-blue-300 rounded px-3 py-2 w-full text-black"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
