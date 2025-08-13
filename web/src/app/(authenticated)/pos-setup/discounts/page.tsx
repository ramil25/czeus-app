'use client';
import { useState } from 'react';
import AddDiscountModal, {
  DiscountForm,
} from '../../../../components/modals/AddDiscountModal';
import EditDiscountModal, {
  EditDiscountForm,
} from '../../../../components/modals/EditDiscountModal';
import { DiscountTable } from '../../../../components/tables/DiscountTable';
import { 
  useDiscounts, 
  useCreateDiscount, 
  useUpdateDiscount, 
  useDeleteDiscount 
} from '../../../../hooks/useDiscounts';
import { Discount } from '../../../../lib/discounts';

export default function DiscountManagement() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  const [addForm, setAddForm] = useState<DiscountForm>({
    discount_name: '',
    discount_type: '',
    discount_value: '',
  });

  const [editForm, setEditForm] = useState<EditDiscountForm>({
    discount_name: '',
    discount_type: 'percentage',
    discount_value: '',
  });

  // Hooks for data management
  const { data: discounts = [], isLoading, error } = useDiscounts();
  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();
  const deleteMutation = useDeleteDiscount();

  // Filter discounts based on search
  const filteredDiscounts = discounts.filter(
    (d) =>
      d.discount_name.toLowerCase().includes(search.toLowerCase()) ||
      d.discount_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDiscount = async (form: DiscountForm) => {
    try {
      await createMutation.mutateAsync({
        discount_name: form.discount_name,
        discount_type: form.discount_type as 'percentage' | 'actual',
        discount_value: parseFloat(form.discount_value),
      });
      
      // Reset form and close modal
      setAddForm({
        discount_name: '',
        discount_type: '',
        discount_value: '',
      });
      setShowAddModal(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setEditForm({
      discount_name: discount.discount_name,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (form: EditDiscountForm) => {
    if (!editingDiscount) return;

    try {
      await updateMutation.mutateAsync({
        id: editingDiscount.id,
        input: {
          discount_name: form.discount_name,
          discount_type: form.discount_type,
          discount_value: parseFloat(form.discount_value),
        },
      });
      
      setShowEditModal(false);
      setEditingDiscount(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteDiscount = async (discount: Discount) => {
    if (window.confirm(`Are you sure you want to delete "${discount.discount_name}"?`)) {
      try {
        await deleteMutation.mutateAsync(discount.id);
      } catch (error) {
        // Error is handled by the mutation hook
      }
    }
  };

  const handleCancelAdd = () => {
    setAddForm({
      discount_name: '',
      discount_type: '',
      discount_value: '',
    });
    setShowAddModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingDiscount(null);
  };

  if (error) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h2 className="text-red-700 font-semibold">Error Loading Discounts</h2>
          <p className="text-red-600 mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Discounts</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowAddModal(true)}
          disabled={isLoading}
        >
          Add Discount
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search discounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Loading discounts...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DiscountTable
            items={filteredDiscounts}
            onEdit={handleEditDiscount}
            onRemove={handleDeleteDiscount}
          />
        </div>
      )}
      
      <AddDiscountModal
        open={showAddModal}
        form={addForm}
        setForm={setAddForm}
        onCancel={handleCancelAdd}
        onAdd={handleAddDiscount}
        isLoading={createMutation.isPending}
      />
      
      <EditDiscountModal
        open={showEditModal}
        discount={editingDiscount}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
