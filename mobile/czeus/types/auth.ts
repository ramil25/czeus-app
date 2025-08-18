export interface User {
  id: string;
  email: string;
  // Fields from profiles table
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  birth_day?: string | null;
  profile_picture?: string | null;
  role: string;
  phone?: string | null;
  position?: string | null;
  address?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}