'use client';
import { useState } from 'react';
import AddVoucherModal, {
  VoucherForm,
} from '../../../components/modals/AddVoucherModal';
import EditVoucherModal, {
  EditVoucherForm,
} from '../../../components/modals/EditVoucherModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { VoucherTable } from '../../../components/tables/VoucherTable';
import { 
  useVouchers, 
  useCreateVoucher, 
  useUpdateVoucher, 
  useDeleteVoucher 
} from '../../../hooks/useVouchers';
import { useHasRole } from '../../../hooks/useCurrentUser';
import { Voucher } from '../../../lib/vouchers';

export default function VoucherManagement() {
  // Check if user has admin or staff role
  const { hasRole, loading: roleLoading } = useHasRole(['admin', 'staff']);
  
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  
  const [addForm, setAddForm] = useState<VoucherForm>({
    amount: '',
    code: '',
    is_used: false,
  });

  const [editForm, setEditForm] = useState<EditVoucherForm>({
    amount: '',
    code: '',
    is_used: false,
  });

  // Hooks for data management
  const { data: vouchers = [], isLoading, error } = useVouchers();
  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();
  const deleteMutation = useDeleteVoucher();

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have required role
  if (!hasRole) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">Access Denied</div>
          <p className="text-gray-600">
            You don&apos;t have permission to access voucher management. This feature is only available to administrators and staff members.
          </p>
        </div>
      </div>
    );
  }

  // Filter vouchers based on search
  const filteredVouchers = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.amount.toString().includes(search.toLowerCase()) ||
      (v.is_used ? 'used' : 'available').includes(search.toLowerCase())
  );

  const handleAddVoucher = async (form: VoucherForm) => {
    try {
      await createMutation.mutateAsync({
        amount: parseInt(form.amount),
        code: form.code,
        is_used: form.is_used,
      });
      
      // Reset form and close modal
      setAddForm({
        amount: '',
        code: '',
        is_used: false,
      });
      setShowAddModal(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setEditForm({
      amount: voucher.amount.toString(),
      code: voucher.code,
      is_used: voucher.is_used,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (form: EditVoucherForm) => {
    if (!editingVoucher) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingVoucher.id,
        input: {
          amount: parseInt(form.amount),
          code: form.code,
          is_used: form.is_used,
        },
      });
      
      setShowEditModal(false);
      setEditingVoucher(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteVoucher = (voucher: Voucher) => {
    setVoucherToDelete(voucher);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(voucherToDelete.id);
      setShowConfirmModal(false);
      setVoucherToDelete(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancelAdd = () => {
    setAddForm({
      amount: '',
      code: '',
      is_used: false,
    });
    setShowAddModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingVoucher(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setVoucherToDelete(null);
  };

  if (error) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h2 className="text-red-700 font-semibold">Error Loading Vouchers</h2>
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
        <h1 className="text-2xl font-bold text-blue-700">Vouchers Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Voucher
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vouchers by code, amount, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <VoucherTable
            items={filteredVouchers}
            onEdit={handleEditVoucher}
            onRemove={handleDeleteVoucher}
          />
        </div>
      )}
      
      <AddVoucherModal
        open={showAddModal}
        form={addForm}
        setForm={setAddForm}
        onCancel={handleCancelAdd}
        onAdd={handleAddVoucher}
        isLoading={createMutation.isPending}
      />
      
      <EditVoucherModal
        open={showEditModal}
        voucher={editingVoucher}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />
      
      <ConfirmationModal
        open={showConfirmModal}
        title="Delete Voucher"
        message={`Are you sure you want to delete voucher "${voucherToDelete?.code}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}