import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSizes, 
  createSize, 
  updateSize, 
  deleteSize,
  CreateSizeInput,
  UpdateSizeInput
} from '../lib/sizes';
import toast from 'react-hot-toast';

const QUERY_KEY = ['sizes'];

export function useSizes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchSizes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Size created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create size');
    },
  });
}

export function useUpdateSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateSizeInput }) =>
      updateSize(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Size updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update size');
    },
  });
}

export function useDeleteSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Size deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete size');
    },
  });
}