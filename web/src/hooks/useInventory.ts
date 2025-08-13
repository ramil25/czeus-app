import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getInventoryItems, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  InventoryFormData 
} from '../lib/inventory';
import toast from 'react-hot-toast';

const INVENTORY_QUERY_KEY = ['inventory'];

// Hook to fetch inventory items
export function useInventoryItems() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: getInventoryItems,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Hook to create a new inventory item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success('Inventory item created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create inventory item');
    },
  });
}

// Hook to update an inventory item
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InventoryFormData }) => 
      updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success('Inventory item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update inventory item');
    },
  });
}

// Hook to delete (soft delete) an inventory item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success('Inventory item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete inventory item');
    },
  });
}