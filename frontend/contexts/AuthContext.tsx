import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import backend from '~backend/client';

interface AdminInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface AuthContextType {
  admin: AdminInfo | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithMagicLink: (token: string) => Promise<void>;
  requestMagicLink: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const authedBackend = backend.with({ auth: storedToken });
        const adminInfo = await authedBackend.auth.me();
        setAdmin(adminInfo);
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem('auth_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await backend.auth.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    setToken(response.token);
    setAdmin(response.admin);
  };

  const loginWithMagicLink = async (magicToken: string) => {
    const response = await backend.auth.verifyMagicLink({ token: magicToken });
    localStorage.setItem('auth_token', response.token);
    setToken(response.token);
    setAdmin(response.admin);
  };

  const requestMagicLink = async (email: string) => {
    await backend.auth.requestMagicLink({ email });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        loginWithMagicLink,
        requestMagicLink,
        logout,
        isAuthenticated: !!admin,
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
  return backend.with({ auth: token });
}
