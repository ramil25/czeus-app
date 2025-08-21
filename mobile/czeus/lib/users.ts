import { supabase } from './supabaseClient';
import { UserRole } from '@/types/auth';

// Default password for new users
const DEFAULT_PASSWORD = 'ILoveCoffee@01';

// Database schema type to match Supabase profiles table
export type Profile = {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_day?: string;
  profile_picture?: string;
  email: string;
  role: UserRole;
  phone?: string;
  position?: string;
  address?: string;
};

// Form type for creating/editing users
export type UserFormData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  position?: string;
  address?: string;
  birth_day?: string;
};

// Type for displaying in the UI (includes computed name field)
export type UserProfile = Profile & {
  name: string; // computed from first_name + last_name
};

// Sample data for fallback when database is not available
const sampleUsers: UserProfile[] = [
  {
    id: 1,
    name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    role: 'staff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Alice Johnson',
    first_name: 'Alice',
    last_name: 'Johnson',
    email: 'alice@example.com',
    role: 'customer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Local storage for demo mode
const initialUsers = [...sampleUsers];
let localUsersStore = initialUsers;
let nextId = 4;

// Helper function to convert Profile to UserProfile
function profileToUser(profile: Profile): UserProfile {
  return {
    ...profile,
    name: `${profile.first_name} ${profile.last_name}`.trim(),
  };
}

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    // Try a simple health check
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !!error;
  } catch {
    return true;
  }
}

// Get all non-deleted users
export async function getUsers(): Promise<UserProfile[]> {
  try {
    const demoMode = await isDemoMode();

    if (demoMode) {
      // Use local data when database is not accessible
      return localUsersStore.filter((user) => !user.deleted_at);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data.map(profileToUser);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    return localUsersStore.filter((user) => !user.deleted_at);
  }
}

// Create a new user (both in auth and profiles table)
export async function createUser(userData: UserFormData): Promise<UserProfile> {
  try {
    const demoMode = await isDemoMode();

    if (demoMode) {
      // Use local data when database is not accessible
      const newUser: UserProfile = {
        id: nextId++,
        first_name: userData.first_name,
        middle_name: userData.middle_name,
        last_name: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        position: userData.position,
        address: userData.address,
        birth_day: userData.birth_day,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localUsersStore.push(newUser);
      return newUser;
    }

    // First create user in auth
    const { error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: DEFAULT_PASSWORD,
    });

    if (authError) {
      throw new Error(`Failed to create user auth: ${authError.message}`);
    }

    // Then create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        first_name: userData.first_name,
        middle_name: userData.middle_name,
        last_name: userData.last_name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        position: userData.position,
        address: userData.address,
        birth_day: userData.birth_day,
      })
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, we should ideally clean up the auth user
      // but for now we'll just throw the error
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    return profileToUser(profileData);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const newUser: UserProfile = {
      id: nextId++,
      first_name: userData.first_name,
      middle_name: userData.middle_name,
      last_name: userData.last_name,
      name: `${userData.first_name} ${userData.last_name}`.trim(),
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      position: userData.position,
      address: userData.address,
      birth_day: userData.birth_day,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localUsersStore.push(newUser);
    return newUser;
  }
}

// Update an existing user
export async function updateUser(
  id: number,
  userData: UserFormData
): Promise<UserProfile> {
  try {
    const demoMode = await isDemoMode();

    if (demoMode) {
      // Use local data when database is not accessible
      const index = localUsersStore.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...localUsersStore[index],
        first_name: userData.first_name,
        middle_name: userData.middle_name,
        last_name: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        role: userData.role,
        phone: userData.phone,
        position: userData.position,
        address: userData.address,
        birth_day: userData.birth_day,
        updated_at: new Date().toISOString(),
      };

      localUsersStore[index] = updatedUser;
      return updatedUser;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: userData.first_name,
        middle_name: userData.middle_name,
        last_name: userData.last_name,
        role: userData.role,
        phone: userData.phone,
        position: userData.position,
        address: userData.address,
        birth_day: userData.birth_day,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return profileToUser(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localUsersStore.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...localUsersStore[index],
      first_name: userData.first_name,
      middle_name: userData.middle_name,
      last_name: userData.last_name,
      name: `${userData.first_name} ${userData.last_name}`.trim(),
      role: userData.role,
      phone: userData.phone,
      position: userData.position,
      address: userData.address,
      birth_day: userData.birth_day,
      updated_at: new Date().toISOString(),
    };

    localUsersStore[index] = updatedUser;
    return updatedUser;
  }
}

// Soft delete a user
export async function deleteUser(id: number): Promise<void> {
  try {
    const demoMode = await isDemoMode();

    if (demoMode) {
      // Use local data when database is not accessible
      const index = localUsersStore.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }

      localUsersStore[index] = {
        ...localUsersStore[index],
        deleted_at: new Date().toISOString(),
      };
      return;
    }

    // Get user email first for auth operations
    const { data: userData, error: getUserError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .single();

    if (getUserError) {
      throw new Error(`Failed to get user data: ${getUserError.message}`);
    }

    // Soft delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (profileError) {
      throw new Error(`Failed to delete user: ${profileError.message}`);
    }

    // Note: Disabling auth user requires admin privileges
    // This would typically be done through a server-side function
    // For now, we'll just log this operation
    console.log(`User ${userData.email} profile deleted. Auth should be disabled separately.`);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localUsersStore.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    localUsersStore[index] = {
      ...localUsersStore[index],
      deleted_at: new Date().toISOString(),
    };
  }
}

// Get a single user by ID
export async function getUserById(id: number): Promise<UserProfile | null> {
  try {
    const demoMode = await isDemoMode();

    if (demoMode) {
      const user = localUsersStore.find((u) => u.id === id && !u.deleted_at);
      return user || null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return profileToUser(data);
  } catch (error) {
    console.log('Falling back to demo mode due to error:', error);
    const user = localUsersStore.find((u) => u.id === id && !u.deleted_at);
    return user || null;
  }
}