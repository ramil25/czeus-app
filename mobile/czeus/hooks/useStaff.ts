import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, createStaff, updateStaff, deleteStaff, StaffFormData, Staff } from '@/lib/staff';

// Hook to fetch all staff members
export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: getStaff,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to create a new staff member
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      // Also invalidate users list since staff are users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to update an existing staff member
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffData }: { id: number; staffData: StaffFormData }) =>
      updateStaff(id, staffData),
    onSuccess: (updatedStaff) => {
      // Update the staff list cache
      queryClient.setQueryData(['staff'], (oldData: Staff[] | undefined) => {
        if (!oldData) return [updatedStaff];
        return oldData.map((staff) =>
          staff.id === updatedStaff.id ? updatedStaff : staff
        );
      });
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to delete a staff member
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: (_, deletedId) => {
      // Remove from staff list cache
      queryClient.setQueryData(['staff'], (oldData: Staff[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((staff) => staff.id !== deletedId);
      });
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}