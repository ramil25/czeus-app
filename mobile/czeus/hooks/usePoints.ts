import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomerPoints,
  updateCustomerPoints,
  initializeCustomerPoints,
  CustomerPoint,
  CustomerPointsFormData,
} from '@/lib/points';

// Hook to fetch all customer points
export function useCustomerPoints() {
  return useQuery({
    queryKey: ['customerPoints'],
    queryFn: getCustomerPoints,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to update customer points
export function useUpdateCustomerPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pointsData }: { id: number; pointsData: CustomerPointsFormData }) =>
      updateCustomerPoints(id, pointsData),
    onSuccess: (updatedCustomerPoints) => {
      // Update the customer points list cache
      queryClient.setQueryData(['customerPoints'], (oldData: CustomerPoint[] | undefined) => {
        if (!oldData) return [updatedCustomerPoints];
        return oldData.map((item) =>
          item.id === updatedCustomerPoints.id ? updatedCustomerPoints : item
        );
      });
    },
  });
}

// Hook to initialize customer points for all customers
export function useInitializeCustomerPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeCustomerPoints,
    onSuccess: () => {
      // Invalidate and refetch customer points list
      queryClient.invalidateQueries({ queryKey: ['customerPoints'] });
    },
  });
}