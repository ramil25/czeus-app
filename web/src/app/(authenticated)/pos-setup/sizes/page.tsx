'use client';
import { useState } from 'react';
import AddSizeModal, {
  SizeForm,
} from '../../../../components/modals/AddSizeModal';
import { SizeTable, Size } from '../../../../components/tables/SizeTable';

const now = new Date().toISOString();
const foodCategories = [
  'Coffee',
  'Tea',
  'Pastries',
  'Sandwiches',
  'Salads',
  'Smoothies',
  'Breakfast',
  'Desserts',
  'Juices',
  'Snacks',
];

const sampleSizes: Size[] = [
  { id: 1, sizeName: 'Small', category: 'Coffee', createdAt: now },
  { id: 2, sizeName: 'Medium', category: 'Coffee', createdAt: now },
  { id: 3, sizeName: 'Large', category: 'Coffee', createdAt: now },
  { id: 4, sizeName: 'Regular', category: 'Tea', createdAt: now },
  { id: 5, sizeName: 'Large', category: 'Tea', createdAt: now },
  { id: 6, sizeName: 'Slice', category: 'Pastries', createdAt: now },
  { id: 7, sizeName: 'Whole', category: 'Pastries', createdAt: now },
  { id: 8, sizeName: 'Single', category: 'Sandwiches', createdAt: now },
  { id: 9, sizeName: 'Double', category: 'Sandwiches', createdAt: now },
  { id: 10, sizeName: 'Bowl', category: 'Salads', createdAt: now },
];

export default function SizeManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<SizeForm>({ sizeName: '', category: '' });

  const filteredSizes = sampleSizes.filter(
    (s) =>
      s.sizeName.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Sizes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
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
      <div className="overflow-x-auto">
        <SizeTable
          items={filteredSizes}
          onEdit={(item) => alert(`Edit size: ${item.sizeName}`)}
          onRemove={(item) => alert(`Remove size: ${item.sizeName}`)}
        />
      </div>
      <AddSizeModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={() => setShowModal(false)}
        categories={foodCategories}
      />
    </div>
  );
}
