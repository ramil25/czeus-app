'use client';
import React, { useState } from 'react';
import { ProductDisplay } from '../../lib/products';

export type Product = ProductDisplay;

export type ProductsTableProps = {
  items: Product[];
  onEdit?: (item: Product) => void;
  onRemove?: (item: Product) => void;
};

export function ProductsTable({ items, onEdit, onRemove }: ProductsTableProps) {
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

  return (
    <div>
      <table className="min-w-full bg-white border border-blue-200 rounded shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Image
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Product Name
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Category
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Size
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Price
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Status
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50">
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded border border-blue-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded border border-blue-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.name}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.category}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">{item.size}</td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">₱{item.price.toFixed(2)}</td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                <span
                  className={
                    item.status === 'Available'
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                    onClick={() => onEdit && onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    onClick={() => onRemove && onRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedItems.length === 0 && (
            <tr>
              <td colSpan={7} className="py-4 text-center text-gray-500">
                No products found.
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
