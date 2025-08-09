'use client';
import { useState } from 'react';
import AddDiscountModal, {
  DiscountForm,
} from '../../../../components/modals/AddDiscountModal';
import {
  DiscountTable,
  Discount,
} from '../../../../components/tables/DiscountTable';

const now = new Date().toISOString();
const sampleDiscounts: Discount[] = [
  {
    id: 1,
    name: 'Senior Citizen',
    value: 20,
    type: 'percentage',
    createdAt: now,
  },
  { id: 2, name: 'PWD', value: 20, type: 'percentage', createdAt: now },
  {
    id: 3,
    name: 'Promo 10% Off',
    value: 10,
    type: 'percentage',
    createdAt: now,
  },
  { id: 4, name: 'Holiday Special', value: 50, type: 'actual', createdAt: now },
  {
    id: 5,
    name: 'Birthday Discount',
    value: 15,
    type: 'percentage',
    createdAt: now,
  },
  {
    id: 6,
    name: 'Loyalty Discount',
    value: 30,
    type: 'actual',
    createdAt: now,
  },
  {
    id: 7,
    name: 'Student Discount',
    value: 5,
    type: 'percentage',
    createdAt: now,
  },
  {
    id: 8,
    name: 'Anniversary Promo',
    value: 100,
    type: 'actual',
    createdAt: now,
  },
  {
    id: 9,
    name: 'Opening Sale',
    value: 25,
    type: 'percentage',
    createdAt: now,
  },
  { id: 10, name: 'Bulk Order', value: 200, type: 'actual', createdAt: now },
];

export default function DiscountManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<DiscountForm>({
    name: '',
    type: '',
    value: '',
  });

  const filteredDiscounts = sampleDiscounts.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.type === 'percentage' ? 'percentage' : 'actual').includes(
        search.toLowerCase()
      )
  );

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Discounts</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
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
      <div className="overflow-x-auto">
        <DiscountTable
          items={filteredDiscounts}
          onEdit={(item) => alert(`Edit discount: ${item.name}`)}
          onRemove={(item) => alert(`Remove discount: ${item.name}`)}
        />
      </div>
      <AddDiscountModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={() => setShowModal(false)}
      />
    </div>
  );
}
