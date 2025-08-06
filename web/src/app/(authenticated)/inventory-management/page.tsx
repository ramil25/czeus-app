'use client';
import { useState } from 'react';
import { AddInventoryModal, InventoryForm } from '../../../components/modals/AddInventoryModal';
import { InventoryTable } from '../../../components/tables/InventoryTable';

// Sample inventory data for a coffee shop
const now = new Date().toISOString();
const sampleInventory = [
  {
    id: 1,
    name: 'Espresso Beans',
    category: 'Coffee',
    quantity: 50,
    unit: 'kg',
    updatedAt: now,
  },
  {
    id: 2,
    name: 'Milk',
    category: 'Dairy',
    quantity: 30,
    unit: 'L',
    updatedAt: now,
  },
  {
    id: 3,
    name: 'Sugar',
    category: 'Condiment',
    quantity: 20,
    unit: 'kg',
    updatedAt: now,
  },
  {
    id: 4,
    name: 'Cups',
    category: 'Supplies',
    quantity: 200,
    unit: 'pcs',
    updatedAt: now,
  },
  {
    id: 5,
    name: 'Chocolate Syrup',
    category: 'Condiment',
    quantity: 10,
    unit: 'L',
    updatedAt: now,
  },
  {
    id: 6,
    name: 'Green Tea',
    category: 'Tea',
    quantity: 15,
    unit: 'kg',
    updatedAt: now,
  },
  {
    id: 7,
    name: 'Napkins',
    category: 'Supplies',
    quantity: 500,
    unit: 'pcs',
    updatedAt: now,
  },
  {
    id: 8,
    name: 'Vanilla Syrup',
    category: 'Condiment',
    quantity: 8,
    unit: 'L',
    updatedAt: now,
  },
  {
    id: 9,
    name: 'Black Tea',
    category: 'Tea',
    quantity: 12,
    unit: 'kg',
    updatedAt: now,
  },
  {
    id: 10,
    name: 'Whipped Cream',
    category: 'Dairy',
    quantity: 5,
    unit: 'kg',
    updatedAt: now,
  },
];

export default function InventoryManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<InventoryForm>({
    name: '',
    category: '',
    quantity: '',
    unit: '',
  });
  const [inventory, setInventory] = useState(sampleInventory);
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.category || !form.quantity || !form.unit) return;
    setInventory((inv) => [
      ...inv,
      {
        id: inv.length + 1,
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        updatedAt: new Date().toISOString(),
      },
    ]);
    setForm({ name: '', category: '', quantity: '', unit: '' });
    setShowModal(false);
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">
          Inventory Management
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Add Item
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <InventoryTable items={filteredInventory} />
      </div>
      <AddInventoryModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
