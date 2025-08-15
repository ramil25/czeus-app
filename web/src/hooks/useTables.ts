import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTables, 
  createTable, 
  updateTable, 
  deleteTable,
  CreateTableInput,
  UpdateTableInput
} from '../lib/tables';
import toast from 'react-hot-toast';

const QUERY_KEY = ['tables'];

export function useTables() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchTables,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Table created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create table');
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTableInput }) =>
      updateTable(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Table updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update table');
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Table deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete table');
    },
  });
}