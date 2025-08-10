"use client";
import { useState } from "react";
import AddProductModal, { ProductForm } from "../../../../components/modals/AddProductModal";
import { ProductsTable, Product } from "../../../../components/tables/ProductsTable";

const sampleProducts: Product[] = [
	{ id: 1, name: "Cappuccino", category: "Coffee", size: "Small", price: 120, status: "Available" },
	{ id: 2, name: "Latte", category: "Coffee", size: "Medium", price: 130, status: "Available" },
	{ id: 3, name: "Green Tea", category: "Tea", size: "Large", price: 110, status: "Available" },
	{ id: 4, name: "Blueberry Muffin", category: "Pastries", size: "Single", price: 70, status: "Available" },
	{ id: 5, name: "Ham Sandwich", category: "Sandwiches", size: "Double", price: 180, status: "Available" },
	{ id: 6, name: "Caesar Salad", category: "Salads", size: "Bowl", price: 150, status: "Not Available" },
	{ id: 7, name: "Mango Smoothie", category: "Smoothies", size: "Regular", price: 120, status: "Available" },
	{ id: 8, name: "Pancakes", category: "Breakfast", size: "Double", price: 160, status: "Available" },
	{ id: 9, name: "Chocolate Cake", category: "Desserts", size: "Whole", price: 600, status: "Available" },
	{ id: 10, name: "Orange Juice", category: "Juices", size: "Regular", price: 70, status: "Available" },
];

export default function ProductsManagement() {
	const [search, setSearch] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState<ProductForm>({ name: "", category: "", size: "", price: "", status: "Available" });

	const filteredProducts = sampleProducts.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()) ||
		p.category.toLowerCase().includes(search.toLowerCase()) ||
		p.size.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="p-8 bg-blue-50 min-h-screen">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-blue-700">Products</h1>
				<button
					className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
					onClick={() => setShowModal(true)}
				>
					Add Product
				</button>
			</div>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
				/>
			</div>
			<div className="overflow-x-auto">
				<ProductsTable
					items={filteredProducts}
					onEdit={(item) => alert(`Edit product: ${item.name}`)}
					onRemove={(item) => alert(`Remove product: ${item.name}`)}
				/>
			</div>
			<AddProductModal
				open={showModal}
				form={form}
				setForm={setForm}
				onCancel={() => setShowModal(false)}
				onAdd={() => setShowModal(false)}
			/>
		</div>
	);
}
