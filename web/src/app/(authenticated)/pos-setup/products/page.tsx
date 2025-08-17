"use client";
import { useState } from "react";
import AddProductModal, { ProductForm } from "../../../../components/modals/AddProductModal";
import EditProductModal, { EditProductForm } from "../../../../components/modals/EditProductModal";
import ConfirmationModal from "../../../../components/modals/ConfirmationModal";
import { ProductsTable, Product } from "../../../../components/tables/ProductsTable";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../../../../hooks/useProducts";
import { CreateProductInput, UpdateProductInput } from "../../../../lib/products";
import { uploadImageToPublic } from "../../../../utils/fileUpload";

export default function ProductsManagement() {
	const [search, setSearch] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [productToDelete, setProductToDelete] = useState<Product | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	
	const [addForm, setAddForm] = useState<ProductForm>({ 
		name: "", 
		categoryId: "", 
		sizeId: "", 
		price: "", 
		status: "Available",
		imageFile: undefined,
		imageUrl: undefined
	});
	
	const [editForm, setEditForm] = useState<EditProductForm>({ 
		name: "", 
		categoryId: "", 
		sizeId: "", 
		price: "", 
		status: "Available",
		imageFile: undefined,
		imageUrl: undefined
	});

	// React Query hooks
	const { data: products = [], isLoading, error } = useProducts();
	const createProductMutation = useCreateProduct();
	const updateProductMutation = useUpdateProduct();
	const deleteProductMutation = useDeleteProduct();

	const filteredProducts = products.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()) ||
		p.category.toLowerCase().includes(search.toLowerCase()) ||
		p.size.toLowerCase().includes(search.toLowerCase())
	);

	const handleAddProduct = async () => {
		if (!addForm.name.trim() || !addForm.categoryId || !addForm.sizeId || !addForm.price.trim()) {
			return;
		}

		let imageUrl: string | undefined = undefined;

		// Upload image if provided
		if (addForm.imageFile) {
			try {
				setIsUploadingImage(true);
				imageUrl = await uploadImageToPublic(addForm.imageFile, 'products');
			} catch (error) {
				console.error('Failed to upload image:', error);
				alert('Failed to upload image. Product will be created without an image.');
			} finally {
				setIsUploadingImage(false);
			}
		}

		const input: CreateProductInput = {
			product_name: addForm.name.trim(),
			category_id: Number(addForm.categoryId),
			size_id: Number(addForm.sizeId),
			price: Number(addForm.price),
			status: addForm.status === 'Available' ? 'available' : 'not available',
			image_url: imageUrl,
		};

		try {
			await createProductMutation.mutateAsync(input);
			setShowAddModal(false);
			setAddForm({ name: "", categoryId: "", sizeId: "", price: "", status: "Available", imageFile: undefined, imageUrl: undefined });
		} catch (error) {
			// Error handling is done in the mutation
		}
	};

	const handleEditProduct = (product: Product) => {
		setSelectedProduct(product);
		setEditForm({
			name: product.name,
			categoryId: product.categoryId,
			sizeId: product.sizeId,
			price: product.price.toString(),
			status: product.status,
			imageFile: undefined,
			imageUrl: product.imageUrl,
		});
		setShowEditModal(true);
	};

	const handleUpdateProduct = async () => {
		if (!selectedProduct || !editForm.name.trim() || !editForm.categoryId || !editForm.sizeId || !editForm.price.trim()) {
			return;
		}

		let imageUrl: string | undefined = editForm.imageUrl;

		// Upload new image if provided
		if (editForm.imageFile) {
			try {
				setIsUploadingImage(true);
				imageUrl = await uploadImageToPublic(editForm.imageFile, 'products');
			} catch (error) {
				console.error('Failed to upload image:', error);
				alert('Failed to upload image. Product will be updated without changing the image.');
				// Continue with update without changing the image
				imageUrl = editForm.imageUrl;
			} finally {
				setIsUploadingImage(false);
			}
		}

		const input: UpdateProductInput = {
			product_name: editForm.name.trim(),
			category_id: Number(editForm.categoryId),
			size_id: Number(editForm.sizeId),
			price: Number(editForm.price),
			status: editForm.status === 'Available' ? 'available' : 'not available',
			image_url: imageUrl,
		};

		try {
			await updateProductMutation.mutateAsync({ id: selectedProduct.id, input });
			setShowEditModal(false);
			setSelectedProduct(null);
			setEditForm({ name: "", categoryId: "", sizeId: "", price: "", status: "Available", imageFile: undefined, imageUrl: undefined });
		} catch (error) {
			// Error handling is done in the mutation
		}
	};

	const handleDeleteProduct = async (product: Product) => {
		setProductToDelete(product);
		setShowConfirmModal(true);
	};

	const handleConfirmDelete = async () => {
		if (productToDelete) {
			try {
				await deleteProductMutation.mutateAsync(productToDelete.id);
			} catch (error) {
				// Error handling is done in the mutation
			}
		}
		setShowConfirmModal(false);
		setProductToDelete(null);
	};

	const handleCancelDelete = () => {
		setShowConfirmModal(false);
		setProductToDelete(null);
	};

	const handleCancelAdd = () => {
		setShowAddModal(false);
		setAddForm({ name: "", categoryId: "", sizeId: "", price: "", status: "Available" });
	};

	const handleCancelEdit = () => {
		setShowEditModal(false);
		setSelectedProduct(null);
		setEditForm({ name: "", categoryId: "", sizeId: "", price: "", status: "Available" });
	};

	if (error) {
		return (
			<div className="p-8 bg-blue-50 min-h-screen">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Error loading products: {error.message}
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 bg-blue-50 min-h-screen">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-blue-700">Products</h1>
				<button
					className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
					onClick={() => setShowAddModal(true)}
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
			
			{isLoading ? (
				<div className="text-center py-8">
					<div className="text-blue-600">Loading products...</div>
				</div>
			) : (
				<div className="overflow-x-auto">
					<ProductsTable
						items={filteredProducts}
						onEdit={handleEditProduct}
						onRemove={handleDeleteProduct}
					/>
				</div>
			)}
			
			<AddProductModal
				open={showAddModal}
				form={addForm}
				setForm={setAddForm}
				onCancel={handleCancelAdd}
				onAdd={handleAddProduct}
				isLoading={createProductMutation.isPending || isUploadingImage}
			/>
			
			<EditProductModal
				open={showEditModal}
				product={selectedProduct}
				form={editForm}
				setForm={setEditForm}
				onCancel={handleCancelEdit}
				onSubmit={handleUpdateProduct}
				isLoading={updateProductMutation.isPending || isUploadingImage}
			/>
			
			<ConfirmationModal
				open={showConfirmModal}
				title="Delete Product"
				message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isLoading={deleteProductMutation.isPending}
				variant="danger"
			/>
		</div>
	);
}
