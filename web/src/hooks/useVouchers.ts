import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchVouchers, 
  createVoucher, 
  updateVoucher, 
  deleteVoucher,
  CreateVoucherInput,
  UpdateVoucherInput,
  Voucher
} from '../lib/vouchers';
import toast from 'react-hot-toast';

const QUERY_KEY = ['vouchers'];

export function useVouchers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchVouchers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Voucher created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create voucher');
    },
  });
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateVoucherInput }) =>
      updateVoucher(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Voucher updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update voucher');
    },
  });
}

export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Voucher deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete voucher');
    },
  });
}