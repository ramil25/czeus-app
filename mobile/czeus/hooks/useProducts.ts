import { useState, useEffect, useCallback } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '@/lib/products';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  createNewProduct: (input: CreateProductInput) => Promise<Product>;
  updateExistingProduct: (id: number, input: UpdateProductInput) => Promise<Product>;
  deleteExistingProduct: (id: number) => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewProduct = useCallback(async (input: CreateProductInput): Promise<Product> => {
    try {
      setError(null);
      const newProduct = await createProduct(input);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateExistingProduct = useCallback(async (id: number, input: UpdateProductInput): Promise<Product> => {
    try {
      setError(null);
      const updatedProduct = await updateProduct(id, input);
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteExistingProduct = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
  };
}