'use client';
import React, { useState } from 'react';

export type OrderStatus = 'pending' | 'processing' | 'cancelled' | 'served';
export type PaymentStatus = 'unpaid' | 'paid' | 'void';

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  points: number;
};

export type Order = {
  id: number;
  customerId: number;
  customerName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  voucherId?: number;
  discountId?: number;
};

export type OrderTableProps = {
  items: Order[];
  onEdit?: (item: Order) => void;
  onCancel?: (item: Order) => void;
};

export function OrderTable({ items, onEdit, onCancel }: OrderTableProps) {
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'served':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'unpaid':
        return 'bg-red-100 text-red-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'void':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatOrdersList = (items: OrderItem[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) return `${items[0].productName} (x${items[0].quantity})`;
    return `${items[0].productName} (x${items[0].quantity}) +${items.length - 1} more`;
  };

  return (
    <div>
      <table className="min-w-full bg-white border border-blue-200 rounded shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Customer Name
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Orders List
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Voucher Applied
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Discounts
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Total Price
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Order Status
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Payment Status
            </th>
            <th className="py-2 px-4 border-b border-blue-200 text-black text-left">
              Order At
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
                {item.customerName}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {formatOrdersList(item.items)}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.voucherId ? `Voucher #${item.voucherId}` : 'None'}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {item.discountId ? `Discount #${item.discountId}` : 'None'}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                ${item.totalAmount.toFixed(2)}
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(item.paymentStatus)}`}>
                  {item.paymentStatus}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-blue-100 text-black">
                {new Date(item.createdAt).toLocaleString()}
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
                    onClick={() => onCancel && onCancel(item)}
                    disabled={item.status === 'cancelled' || item.status === 'served'}
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedItems.length === 0 && (
            <tr>
              <td colSpan={9} className="py-4 text-center text-gray-500">
                No orders found.
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
