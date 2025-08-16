import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  CreateProductInput,
  UpdateProductInput
} from '../lib/products';
import toast from 'react-hot-toast';

const QUERY_KEY = ['products'];

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Product created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) =>
      updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Product updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Product deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
}