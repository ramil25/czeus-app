'use client';
import { useState, useEffect } from 'react';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { OrderTable, Order } from '../../../components/tables/OrderTable';
import { getOrders, updateOrderStatus, cancelOrder } from '../../../lib/orders';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<'pending' | 'processing' | 'cancelled' | 'served'>('pending');
  const [editPaymentStatus, setEditPaymentStatus] = useState<'unpaid' | 'paid' | 'void'>('unpaid');

  // Load order data on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await getOrders();
      setOrders(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search) ||
      o.status.toLowerCase().includes(search.toLowerCase()) ||
      o.paymentStatus.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setShowEditModal(true);
  };

  const handleSaveEditOrder = async () => {
    if (!editingOrder) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await updateOrderStatus(editingOrder.id, editStatus, editPaymentStatus);
      
      // Reset form and close modal
      setShowEditModal(false);
      setEditingOrder(null);
      
      // Reload order list
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      console.error('Error updating order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (orderToCancel) {
      try {
        setLoading(true);
        setError(null);
        await cancelOrder(orderToCancel.id);
        await loadOrders(); // Reload the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cancel order');
        console.error('Error cancelling order:', err);
      } finally {
        setLoading(false);
      }
    }
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCancelDelete = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Order Managements</h1>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded text-red-700">
          {error}
          <button 
            className="ml-2 text-red-900 hover:text-red-600"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search orders by customer name, ID, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
          disabled={loading}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Loading orders...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <OrderTable 
            items={filteredOrders} 
            onEdit={handleEditOrder}
            onCancel={handleCancelOrder}
          />
        </div>
      )}
      
      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Edit Order #{editingOrder.id}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as 'pending' | 'processing' | 'cancelled' | 'served')}
                className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
                <option value="served">Served</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={editPaymentStatus}
                onChange={(e) => setEditPaymentStatus(e.target.value as 'unpaid' | 'paid' | 'void')}
                className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="void">Void</option>
              </select>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-700">
                <p><strong>Customer:</strong> {editingOrder.customerName}</p>
                <p><strong>Total:</strong> ${editingOrder.totalAmount.toFixed(2)}</p>
                <p><strong>Items:</strong> {editingOrder.items.length}</p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSaveEditOrder}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmationModal
        open={showCancelModal}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${orderToCancel?.id} for ${orderToCancel?.customerName}? This action cannot be undone.`}
        confirmText="Cancel Order"
        cancelText="Keep Order"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelDelete}
        isLoading={loading}
        variant="danger"
      />
    </div>
  );
}
