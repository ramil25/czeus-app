import { useState, useEffect, useCallback } from 'react';
import {
  fetchDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  Discount,
  CreateDiscountInput,
  UpdateDiscountInput,
} from '@/lib/discounts';

export interface UseDiscountsResult {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
  refreshDiscounts: () => Promise<void>;
  createNewDiscount: (input: CreateDiscountInput) => Promise<Discount>;
  updateExistingDiscount: (id: number, input: UpdateDiscountInput) => Promise<Discount>;
  deleteExistingDiscount: (id: number) => Promise<void>;
}

export function useDiscounts(): UseDiscountsResult {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDiscounts = await fetchDiscounts();
      setDiscounts(fetchedDiscounts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch discounts';
      setError(errorMessage);
      console.error('Error fetching discounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewDiscount = useCallback(async (input: CreateDiscountInput): Promise<Discount> => {
    try {
      setError(null);
      const newDiscount = await createDiscount(input);
      setDiscounts(prev => [newDiscount, ...prev]);
      return newDiscount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create discount';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateExistingDiscount = useCallback(async (id: number, input: UpdateDiscountInput): Promise<Discount> => {
    try {
      setError(null);
      const updatedDiscount = await updateDiscount(id, input);
      setDiscounts(prev =>
        prev.map(discount =>
          discount.id === id ? updatedDiscount : discount
        )
      );
      return updatedDiscount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update discount';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteExistingDiscount = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteDiscount(id);
      setDiscounts(prev => prev.filter(discount => discount.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete discount';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshDiscounts();
  }, [refreshDiscounts]);

  return {
    discounts,
    loading,
    error,
    refreshDiscounts,
    createNewDiscount,
    updateExistingDiscount,
    deleteExistingDiscount,
  };
}