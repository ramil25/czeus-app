"use client";
import { useState } from "react";
import AddCategoryModal, { CategoryForm } from "../../../../components/modals/AddCategoryModal";
import { CategoryTable, Category } from "../../../../components/tables/CategoryTable";

const now = new Date().toISOString();
const sampleCategories: Category[] = [
  { id: 1, name: "Coffee", description: "All coffee-based drinks", createdAt: now },
  { id: 2, name: "Tea", description: "Hot and cold teas", createdAt: now },
  { id: 3, name: "Pastries", description: "Freshly baked pastries", createdAt: now },
  { id: 4, name: "Sandwiches", description: "Various sandwiches", createdAt: now },
  { id: 5, name: "Salads", description: "Healthy salads", createdAt: now },
  { id: 6, name: "Smoothies", description: "Fruit and veggie smoothies", createdAt: now },
  { id: 7, name: "Breakfast", description: "Breakfast menu items", createdAt: now },
  { id: 8, name: "Desserts", description: "Sweet treats and desserts", createdAt: now },
  { id: 9, name: "Juices", description: "Fresh juices", createdAt: now },
  { id: 10, name: "Snacks", description: "Light snacks", createdAt: now },
];

export default function CategoryManagement() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CategoryForm>({ name: "", description: "" });

  const filteredCategories = sampleCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Food Categories</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Add Category
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <CategoryTable
          items={filteredCategories}
          onEdit={(item) => alert(`Edit category: ${item.name}`)}
          onRemove={(item) => alert(`Remove category: ${item.name}`)}
        />
      </div>
      <AddCategoryModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={() => setShowModal(false)}
      />
    </div>
  );
}
