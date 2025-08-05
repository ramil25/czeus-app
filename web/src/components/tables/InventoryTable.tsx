import React from 'react';

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  updatedAt: string;
};

export type InventoryTableProps = {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onRemove?: (item: InventoryItem) => void;
};

export function InventoryTable({ items, onEdit, onRemove }: InventoryTableProps) {
  return (
    <table className="min-w-full bg-white border border-blue-200">
      <thead>
        <tr className="bg-blue-50">
          <th className="py-2 px-4 border-b text-left text-black">Name</th>
          <th className="py-2 px-4 border-b text-left text-black">Category</th>
          <th className="py-2 px-4 border-b text-left text-black">Quantity</th>
          <th className="py-2 px-4 border-b text-left text-black">Unit</th>
          <th className="py-2 px-4 border-b text-left text-black">Updated At</th>
          <th className="py-2 px-4 border-b text-right text-black">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-blue-100">
            <td className="py-2 px-4 border-b text-black">{item.name}</td>
            <td className="py-2 px-4 border-b text-black">{item.category}</td>
            <td className="py-2 px-4 border-b text-left text-black">{item.quantity}</td>
            <td className="py-2 px-4 border-b text-left text-black">{item.unit}</td>
            <td className="py-2 px-4 border-b text-left text-black">{new Date(item.updatedAt).toLocaleString()}</td>
            <td className="py-2 px-4 border-b text-right text-black">
              <div className="flex gap-2 justify-end">
                <button
                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                  onClick={() => onEdit && onEdit(item)}
                >Edit</button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                  onClick={() => onRemove && onRemove(item)}
                >Remove</button>
              </div>
            </td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={6} className="py-4 text-center text-gray-500">No items found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
