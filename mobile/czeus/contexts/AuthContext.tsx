import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, User } from '@/types/auth';
import { supabaseAuth } from '@/lib/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const { user } = await supabaseAuth.getSession();
      setAuthState({
        user,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        user: null,
        loading: false,
        initialized: true,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const { user } = await supabaseAuth.signIn(email, password);
      setAuthState({
        user,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // Split fullName into first and last name
      const names = fullName?.split(' ') || ['New', 'User'];
      const firstName = names[0] || 'New';
      const lastName = names.slice(1).join(' ') || 'User';
      
      const { user } = await supabaseAuth.signUp(email, password, firstName, lastName);
      setAuthState({
        user,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      await supabaseAuth.signOut();
      setAuthState({
        user: null,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    await supabaseAuth.resetPassword(email);
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}