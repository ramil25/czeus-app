import { useState, useEffect, useCallback } from 'react';
import {
  fetchSizes,
  createSize,
  updateSize,
  deleteSize,
  Size,
  CreateSizeInput,
  UpdateSizeInput,
} from '@/lib/sizes';

export interface UseSizesResult {
  sizes: Size[];
  loading: boolean;
  error: string | null;
  refreshSizes: () => Promise<void>;
  createNewSize: (input: CreateSizeInput) => Promise<Size>;
  updateExistingSize: (id: number, input: UpdateSizeInput) => Promise<Size>;
  deleteExistingSize: (id: number) => Promise<void>;
}

export function useSizes(): UseSizesResult {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSizes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSizes = await fetchSizes();
      setSizes(fetchedSizes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sizes';
      setError(errorMessage);
      console.error('Error fetching sizes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewSize = useCallback(async (input: CreateSizeInput): Promise<Size> => {
    try {
      setError(null);
      const newSize = await createSize(input);
      setSizes(prev => [newSize, ...prev]);
      return newSize;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create size';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateExistingSize = useCallback(async (id: number, input: UpdateSizeInput): Promise<Size> => {
    try {
      setError(null);
      const updatedSize = await updateSize(id, input);
      setSizes(prev =>
        prev.map(size =>
          size.id === id ? updatedSize : size
        )
      );
      return updatedSize;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update size';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteExistingSize = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteSize(id);
      setSizes(prev => prev.filter(size => size.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete size';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshSizes();
  }, [refreshSizes]);

  return {
    sizes,
    loading,
    error,
    refreshSizes,
    createNewSize,
    updateExistingSize,
    deleteExistingSize,
  };
}