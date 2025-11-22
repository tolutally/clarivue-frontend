import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMe } from '@/hooks/useAuth';
import type { GetMeResponse } from '@/services';
import backend from '@/lib/api-client';

interface AuthContextType {
  admin: GetMeResponse | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  
  const { data: admin, isLoading, isError } = useGetMe();

  // Sync token from localStorage on mount and when it changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('auth_token');
      if (currentToken !== token) {
        setToken(currentToken);
        if (currentToken) {
          // Invalidate query to refetch user data
          queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        }
      }
    };

    // Check immediately
    checkToken();

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', checkToken);
    
    // Poll for changes (same-tab updates like after login)
    const interval = setInterval(checkToken, 100);

    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, [token, queryClient]);

  // Clear token if query fails (invalid/expired token)
  useEffect(() => {
    if (isError && token) {
      localStorage.removeItem('auth_token');
      setToken(null);
      queryClient.clear();
    }
  }, [isError, token, queryClient]);

  // Check localStorage directly for token to avoid delay from polling
  // This prevents the flash of login page after successful login
  // If we have a token in localStorage, consider authenticated (even if admin is loading)
  const hasToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  const isAuthenticated = !!hasToken;
  
  return (
    <AuthContext.Provider
      value={{
        admin: admin || null,
        token,
        loading: isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useBackend() {
  const { token } = useAuth();
  if (!token) return backend;
  return backend.with({ auth: { authorization: `Bearer ${token}` } });
}
