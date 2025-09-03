import { useState, useEffect, useCallback } from 'react';
import {
  fetchInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  InventoryItem,
  CreateInventoryInput,
  UpdateInventoryInput,
} from '@/lib/inventory';

export interface UseInventoryResult {
  inventoryItems: InventoryItem[];
  loading: boolean;
  error: string | null;
  refreshInventory: () => Promise<void>;
  createNewInventoryItem: (input: CreateInventoryInput) => Promise<InventoryItem>;
  updateExistingInventoryItem: (id: number, input: UpdateInventoryInput) => Promise<InventoryItem>;
  deleteExistingInventoryItem: (id: number) => Promise<void>;
}

export function useInventory(): UseInventoryResult {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await fetchInventoryItems();
      setInventoryItems(fetchedItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch inventory items';
      setError(errorMessage);
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewInventoryItem = useCallback(async (input: CreateInventoryInput): Promise<InventoryItem> => {
    try {
      setError(null);
      const newItem = await createInventoryItem(input);
      setInventoryItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create inventory item';
      setError(errorMessage);
      console.error('Error creating inventory item:', err);
      throw err;
    }
  }, []);

  const updateExistingInventoryItem = useCallback(async (id: number, input: UpdateInventoryInput): Promise<InventoryItem> => {
    try {
      setError(null);
      const updatedItem = await updateInventoryItem(id, input);
      setInventoryItems(prev => 
        prev.map(item => item.id === id ? updatedItem : item)
      );
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update inventory item';
      setError(errorMessage);
      console.error('Error updating inventory item:', err);
      throw err;
    }
  }, []);

  const deleteExistingInventoryItem = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteInventoryItem(id);
      setInventoryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete inventory item';
      setError(errorMessage);
      console.error('Error deleting inventory item:', err);
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  return {
    inventoryItems,
    loading,
    error,
    refreshInventory,
    createNewInventoryItem,
    updateExistingInventoryItem,
    deleteExistingInventoryItem,
  };
}