"use client";
import { useState } from "react";
import AddCategoryModal, { CategoryForm } from "../../../../components/modals/AddCategoryModal";
import EditCategoryModal, { EditCategoryForm } from "../../../../components/modals/EditCategoryModal";
import { CategoryTable } from "../../../../components/tables/CategoryTable";
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from "../../../../hooks/useCategories";
import { Category } from "../../../../lib/categories";

export default function CategoryManagement() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [addForm, setAddForm] = useState<CategoryForm>({ name: "", description: "" });
  const [editForm, setEditForm] = useState<EditCategoryForm>({ name: "", description: "" });

  // React Query hooks
  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = async (form: CategoryForm) => {
    try {
      await createCategoryMutation.mutateAsync({
        category_name: form.name,
        category_description: form.description,
      });
      setAddForm({ name: "", description: "" });
      setShowAddModal(false);
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to create category:', error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditForm({
      name: category.name,
      description: category.description,
    });
    setShowEditModal(true);
  };

  const handleSaveCategory = async (form: EditCategoryForm) => {
    if (!selectedCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        input: {
          category_name: form.name,
          category_description: form.description,
        },
      });
      setShowEditModal(false);
      setSelectedCategory(null);
      setEditForm({ name: "", description: "" });
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(category.id);
      } catch (error) {
        // Error is handled by the mutation's onError callback
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ name: "", description: "" });
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
    setEditForm({ name: "", description: "" });
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Food Categories</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
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
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Loading categories...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <CategoryTable
            items={filteredCategories}
            onEdit={handleEditCategory}
            onRemove={handleDeleteCategory}
          />
        </div>
      )}
      
      <AddCategoryModal
        open={showAddModal}
        form={addForm}
        setForm={setAddForm}
        onCancel={handleCancelAdd}
        onAdd={handleAddCategory}
        isLoading={createCategoryMutation.isPending}
      />
      
      <EditCategoryModal
        open={showEditModal}
        category={selectedCategory}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSave={handleSaveCategory}
        isLoading={updateCategoryMutation.isPending}
      />
    </div>
  );
}
