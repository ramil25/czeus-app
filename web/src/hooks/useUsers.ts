import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supbaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Customer';
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Staff' | 'Customer';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'Admin' | 'Staff' | 'Customer';
}

// Sample users for fallback when Supabase is not configured
const sampleUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Staff' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Customer' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
  } catch {
    return false;
  }
};

// Fetch all users
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        // Return sample data if Supabase is not configured
        return sampleUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }));
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform data to match expected format
        return data.map(user => ({
          id: user.id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          role: user.role || 'Customer',
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }));
      } catch (error) {
        console.warn('Supabase error, falling back to sample data:', error);
        return sampleUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }));
      }
    },
    enabled: true
  });
}

// Create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      if (!isSupabaseConfigured()) {
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return newUser;
      }

      try {
        // Create auth user first
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true
        });
        
        if (authError) throw authError;
        
        // Create user profile
        const { data, error } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase error in user creation:', error);
        throw new Error('Failed to create user. Please check your Supabase configuration.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateUserData & { id: string }) => {
      if (!isSupabaseConfigured()) {
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }

      try {
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return updatedUser;
      } catch (error) {
        console.warn('Supabase error in user update:', error);
        throw new Error('Failed to update user. Please check your Supabase configuration.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!isSupabaseConfigured()) {
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        return userId;
      }

      try {
        // Delete from auth users
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) throw authError;
        
        // Delete from users table
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        return userId;
      } catch (error) {
        console.warn('Supabase error in user deletion:', error);
        throw new Error('Failed to delete user. Please check your Supabase configuration.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}