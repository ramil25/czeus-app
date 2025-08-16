'use client';
import { useState } from 'react';
import AddTableModal, {
  TableForm,
} from '../../../../components/modals/AddTableModal';
import EditTableModal, {
  EditTableForm,
} from '../../../../components/modals/EditTableModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import {
  TableTable,
  CafeTable,
} from '../../../../components/tables/TableTable';
import {
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from '../../../../hooks/useTables';
import { Table } from '../../../../lib/tables';

export default function TablesManagement() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<CafeTable | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [addForm, setAddForm] = useState<TableForm>({
    tableNumber: '',
    numberOfSeats: '',
  });
  const [editForm, setEditForm] = useState<EditTableForm>({
    tableNumber: '',
    numberOfSeats: '',
  });

  // React Query hooks
  const { data: tables = [], isLoading, error } = useTables();
  const createTableMutation = useCreateTable();
  const updateTableMutation = useUpdateTable();
  const deleteTableMutation = useDeleteTable();

  const filteredTables = tables.filter(
    (t) =>
      t.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.numberOfSeats.toString().includes(search)
  );

  // Handler functions
  const handleAddTable = async () => {
    if (!addForm.tableNumber.trim() || !addForm.numberOfSeats.trim()) return;
    
    try {
      await createTableMutation.mutateAsync({
        table_name: addForm.tableNumber,
        number_of_seats: Number(addForm.numberOfSeats),
      });
      
      setAddForm({ tableNumber: '', numberOfSeats: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create table:', error);
    }
  };

  const handleEditTable = (table: CafeTable) => {
    setSelectedTable(table);
    setEditForm({
      tableNumber: table.tableNumber,
      numberOfSeats: table.numberOfSeats.toString(),
    });
    setShowEditModal(true);
  };

  const handleUpdateTable = async (form: EditTableForm) => {
    if (!selectedTable) return;
    
    try {
      await updateTableMutation.mutateAsync({
        id: selectedTable.id,
        input: {
          table_name: form.tableNumber,
          number_of_seats: Number(form.numberOfSeats),
        },
      });
      
      setShowEditModal(false);
      setSelectedTable(null);
      setEditForm({ tableNumber: '', numberOfSeats: '' });
    } catch (error) {
      console.error('Failed to update table:', error);
    }
  };

  const handleDeleteTable = async (table: CafeTable) => {
    setTableToDelete(table);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (tableToDelete) {
      try {
        await deleteTableMutation.mutateAsync(tableToDelete.id);
      } catch (error) {
        console.error('Failed to delete table:', error);
      }
    }
    setShowConfirmModal(false);
    setTableToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setTableToDelete(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedTable(null);
    setEditForm({ tableNumber: '', numberOfSeats: '' });
  };

  if (error) {
    return (
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading tables</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Cafe Tables</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          Add Table
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading tables...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <TableTable
            items={filteredTables}
            onEdit={handleEditTable}
            onRemove={handleDeleteTable}
          />
        </div>
      )}

      <AddTableModal
        open={showAddModal}
        form={addForm}
        setForm={setAddForm}
        onCancel={() => setShowAddModal(false)}
        onAdd={handleAddTable}
      />

      <EditTableModal
        open={showEditModal}
        table={selectedTable}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSave={handleUpdateTable}
        isLoading={updateTableMutation.isPending}
      />

      <ConfirmationModal
        open={showConfirmModal}
        title="Delete Table"
        message={`Are you sure you want to delete table ${tableToDelete?.tableNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteTableMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
