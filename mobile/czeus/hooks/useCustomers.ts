import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, CustomerFormData, Customer } from '@/lib/customers';

// Hook to fetch all customers
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to create a new customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      // Invalidate and refetch customer list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      // Also invalidate users list since customers are users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to update an existing customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerData }: { id: number; customerData: Omit<CustomerFormData, 'email'> }) =>
      updateCustomer(id, customerData),
    onSuccess: (updatedCustomer) => {
      // Update the customer list cache
      queryClient.setQueryData(['customers'], (oldData: Customer[] | undefined) => {
        if (!oldData) return [updatedCustomer];
        return oldData.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        );
      });
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to delete a customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (_, deletedId) => {
      // Remove from customer list cache
      queryClient.setQueryData(['customers'], (oldData: Customer[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((customer) => customer.id !== deletedId);
      });
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}