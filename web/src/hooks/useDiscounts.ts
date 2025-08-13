import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDiscounts, 
  createDiscount, 
  updateDiscount, 
  deleteDiscount,
  CreateDiscountInput,
  UpdateDiscountInput,
  Discount
} from '../lib/discounts';
import toast from 'react-hot-toast';

const QUERY_KEY = ['discounts'];

export function useDiscounts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchDiscounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Discount created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create discount');
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateDiscountInput }) =>
      updateDiscount(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Discount updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update discount');
    },
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Discount deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete discount');
    },
  });
}