import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  UserFormData 
} from '../lib/users';
import toast from 'react-hot-toast';

const USERS_QUERY_KEY = ['users'];

// Hook to fetch users
export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Hook to create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
}

// Hook to update a user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormData }) => 
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
}

// Hook to delete (soft delete) a user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}