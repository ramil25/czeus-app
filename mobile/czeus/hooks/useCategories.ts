import { useState, useEffect, useCallback } from 'react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/lib/categories';

export interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  createNewCategory: (input: CreateCategoryInput) => Promise<Category>;
  updateExistingCategory: (id: number, input: UpdateCategoryInput) => Promise<Category>;
  deleteExistingCategory: (id: number) => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewCategory = useCallback(async (input: CreateCategoryInput): Promise<Category> => {
    try {
      setError(null);
      const newCategory = await createCategory(input);
      setCategories(prev => [newCategory, ...prev]);
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateExistingCategory = useCallback(async (id: number, input: UpdateCategoryInput): Promise<Category> => {
    try {
      setError(null);
      const updatedCategory = await updateCategory(id, input);
      setCategories(prev =>
        prev.map(category =>
          category.id === id ? updatedCategory : category
        )
      );
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteExistingCategory = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  return {
    categories,
    loading,
    error,
    refreshCategories,
    createNewCategory,
    updateExistingCategory,
    deleteExistingCategory,
  };
}