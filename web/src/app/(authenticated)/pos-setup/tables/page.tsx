'use client';
import { useState } from 'react';
import AddTableModal, {
  TableForm,
} from '../../../../components/modals/AddTableModal';
import {
  TableTable,
  CafeTable,
} from '../../../../components/tables/TableTable';

const now = new Date().toISOString();
const sampleTables: CafeTable[] = [
  { id: 1, tableNumber: 'A1', numberOfSeats: 4, createdAt: now },
  { id: 2, tableNumber: 'A2', numberOfSeats: 2, createdAt: now },
  { id: 3, tableNumber: 'B1', numberOfSeats: 6, createdAt: now },
  { id: 4, tableNumber: 'B2', numberOfSeats: 4, createdAt: now },
  { id: 5, tableNumber: 'C1', numberOfSeats: 8, createdAt: now },
  { id: 6, tableNumber: 'C2', numberOfSeats: 2, createdAt: now },
  { id: 7, tableNumber: 'D1', numberOfSeats: 4, createdAt: now },
  { id: 8, tableNumber: 'D2', numberOfSeats: 6, createdAt: now },
  { id: 9, tableNumber: 'E1', numberOfSeats: 2, createdAt: now },
  { id: 10, tableNumber: 'E2', numberOfSeats: 4, createdAt: now },
];

export default function TablesManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TableForm>({
    tableNumber: '',
    numberOfSeats: '',
  });

  const filteredTables = sampleTables.filter(
    (t) =>
      t.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.numberOfSeats.toString().includes(search)
  );

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Cafe Tables</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
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
      <div className="overflow-x-auto">
        <TableTable
          items={filteredTables}
          onEdit={(item) => alert(`Edit table: ${item.tableNumber}`)}
          onRemove={(item) => alert(`Remove table: ${item.tableNumber}`)}
        />
      </div>
      <AddTableModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={() => setShowModal(false)}
      />
    </div>
  );
}
