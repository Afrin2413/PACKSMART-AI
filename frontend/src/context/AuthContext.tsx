import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mode: 'Beginner' | 'Expert';
  setMode: (mode: 'Beginner' | 'Expert') => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, organization?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('packsmart_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<'Beginner' | 'Expert'>('Beginner');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('packsmart_token');
      if (storedToken) {
        try {
          const profile = await api.auth.getProfile();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          // Set demo fallback user
          setUser({
            id: 1,
            name: 'Anusri P',
            email: 'anusri@packsmart.ai',
            role: 'Researcher',
            organization: 'Food Packaging Innovation Lab',
            created_at: new Date().toISOString()
          });
        }
      } else {
        // Provide friendly default demo user for instant prototype exploration
        setUser({
          id: 1,
          name: 'Anusri P',
          email: 'anusri@packsmart.ai',
          role: 'Researcher',
          organization: 'Food Packaging Innovation Lab',
          created_at: new Date().toISOString()
        });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem('packsmart_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, organization?: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register({ name, email, password, role, organization });
      localStorage.setItem('packsmart_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('packsmart_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        mode,
        setMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
