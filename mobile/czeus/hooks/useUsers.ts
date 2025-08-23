import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, getUserById, UserFormData, UserProfile } from '@/lib/users';

// Hook to fetch all users
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch a single user by ID
export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to update an existing user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UserFormData }) =>
      updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Update the users list cache
      queryClient.setQueryData(['users'], (oldData: UserProfile[] | undefined) => {
        if (!oldData) return [updatedUser];
        return oldData.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      });
      
      // Update the individual user cache
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
    },
  });
}

// Hook to delete a user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId) => {
      // Remove the user from the users list cache
      queryClient.setQueryData(['users'], (oldData: UserProfile[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((user) => user.id !== deletedUserId);
      });
      
      // Remove the individual user cache
      queryClient.removeQueries({ queryKey: ['users', deletedUserId] });
    },
  });
}