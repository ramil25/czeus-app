'use client';
import { useState } from 'react';
import { AddInventoryModal, InventoryForm } from '../../../components/modals/AddInventoryModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { InventoryTable, InventoryItem } from '../../../components/tables/InventoryTable';
import { 
  useInventoryItems, 
  useCreateInventoryItem, 
  useUpdateInventoryItem, 
  useDeleteInventoryItem 
} from '../../../hooks/useInventory';
import { InventoryFormData } from '../../../lib/inventory';

export default function InventoryManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<InventoryForm>({
    name: '',
    category: '',
    quantity: '',
    unit: '',
  });

  // Database hooks
  const { data: inventoryItems = [], isLoading, error } = useInventoryItems();
  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();
  const deleteMutation = useDeleteInventoryItem();

  // Filter inventory items based on search
  const filteredInventory = inventoryItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) ||
      item.item_category.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: '', category: '', quantity: '', unit: '' });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setForm({
      name: item.item_name,
      category: item.item_category,
      quantity: item.item_qty.toString(),
      unit: item.unit_measure,
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.quantity || !form.unit) {
      return;
    }

    const formData: InventoryFormData = {
      item_name: form.name,
      item_category: form.category,
      item_qty: parseFloat(form.quantity),
      unit_measure: form.unit,
    };

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        },
      });
    }
  };

  const handleRemove = (item: InventoryItem) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    resetForm();
  };

  if (error) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Error loading inventory</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">
          Inventory Management
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={handleAdd}
          disabled={isLoading}
        >
          Add Item
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <InventoryTable
          items={filteredInventory}
          onEdit={handleEdit}
          onRemove={handleRemove}
          isLoading={isLoading}
        />
      </div>
      <AddInventoryModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isEditing={!!editingItem}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
      <ConfirmationModal
        open={showConfirmModal}
        title="Remove Inventory Item"
        message={`Are you sure you want to remove "${itemToDelete?.item_name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
