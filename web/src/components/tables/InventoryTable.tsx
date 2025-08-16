import React, { useState } from 'react';

export type InventoryItem = {
  id: number;
  item_name: string;
  item_category: string;
  item_qty: number;
  unit_measure: string;
  created_at: string;
  updated_at?: string;
};

export type InventoryTableProps = {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onRemove?: (item: InventoryItem) => void;
  isLoading?: boolean;
};

export function InventoryTable({
  items,
  onEdit,
  onRemove,
  isLoading = false,
}: InventoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full bg-white border border-blue-200 rounded shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 border-b border-blue-200 text-black">
              Name
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black">
              Category
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black">
              Quantity
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black">
              Unit
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black">
              Updated At
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50">
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.item_name}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.item_category}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.item_qty}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.unit_measure}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {new Date(item.updated_at || item.created_at).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                    onClick={() => onEdit?.(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    onClick={() => onRemove?.(item)}
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedItems.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-black">
          Showing {(currentPage - 1) * pageSize + 1} -{' '}
          {Math.min(currentPage * pageSize, items.length)} of {items.length}
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
}
