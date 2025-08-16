'use client';
import { useState } from 'react';
import AddSizeModal, {
  SizeForm,
} from '../../../../components/modals/AddSizeModal';
import EditSizeModal, {
  EditSizeForm,
} from '../../../../components/modals/EditSizeModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import { SizeTable, Size } from '../../../../components/tables/SizeTable';
import { useSizes, useCreateSize, useUpdateSize, useDeleteSize } from '../../../../hooks/useSizes';

export default function SizeManagement() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<Size | null>(null);
  const [addForm, setAddForm] = useState<SizeForm>({ sizeName: '', categoryId: '' });
  const [editForm, setEditForm] = useState<EditSizeForm>({ sizeName: '', categoryId: '' });
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  // Hooks for data management
  const { data: sizes = [], isLoading, error } = useSizes();
  const createSizeMutation = useCreateSize();
  const updateSizeMutation = useUpdateSize();
  const deleteSizeMutation = useDeleteSize();

  const filteredSizes = sizes.filter(
    (s) =>
      s.sizeName.toLowerCase().includes(search.toLowerCase()) ||
      s.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSize = () => {
    if (addForm.sizeName.trim() && addForm.categoryId !== '') {
      createSizeMutation.mutate(
        {
          size_name: addForm.sizeName.trim(),
          category_id: Number(addForm.categoryId),
        },
        {
          onSuccess: () => {
            setAddForm({ sizeName: '', categoryId: '' });
            setShowAddModal(false);
          },
        }
      );
    }
  };

  const handleEditSize = (size: Size) => {
    setSelectedSize(size);
    setEditForm({
      sizeName: size.sizeName,
      categoryId: size.categoryId,
    });
    setShowEditModal(true);
  };

  const handleUpdateSize = () => {
    if (selectedSize && editForm.sizeName.trim() && editForm.categoryId !== '') {
      updateSizeMutation.mutate(
        {
          id: selectedSize.id,
          input: {
            size_name: editForm.sizeName.trim(),
            category_id: Number(editForm.categoryId),
          },
        },
        {
          onSuccess: () => {
            setEditForm({ sizeName: '', categoryId: '' });
            setSelectedSize(null);
            setShowEditModal(false);
          },
        }
      );
    }
  };

  const handleDeleteSize = (size: Size) => {
    setSizeToDelete(size);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (sizeToDelete) {
      deleteSizeMutation.mutate(sizeToDelete.id);
    }
    setShowConfirmModal(false);
    setSizeToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSizeToDelete(null);
  };

  const handleCancelAdd = () => {
    setAddForm({ sizeName: '', categoryId: '' });
    setShowAddModal(false);
  };

  const handleCancelEdit = () => {
    setEditForm({ sizeName: '', categoryId: '' });
    setSelectedSize(null);
    setShowEditModal(false);
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Sizes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          Add Size
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search sizes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading sizes...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading sizes. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <SizeTable
            items={filteredSizes}
            onEdit={handleEditSize}
            onRemove={handleDeleteSize}
          />
        </div>
      )}

      <AddSizeModal
        open={showAddModal}
        form={addForm}
        setForm={setAddForm}
        onCancel={handleCancelAdd}
        onSubmit={handleAddSize}
        isLoading={createSizeMutation.isPending}
      />

      <EditSizeModal
        open={showEditModal}
        size={selectedSize}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSubmit={handleUpdateSize}
        isLoading={updateSizeMutation.isPending}
      />

      <ConfirmationModal
        open={showConfirmModal}
        title="Delete Size"
        message={`Are you sure you want to delete "${sizeToDelete?.sizeName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteSizeMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
