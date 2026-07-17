'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storage } from '@/lib/storage';

export type User = {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro' | 'monthly';
  credits: number;
  diagramsLimit: number;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'demo@drogo.flow': { id: '1', email: 'demo@drogo.flow', name: 'Demo User', plan: 'pro', credits: 20000, diagramsLimit: 10000 },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = storage.getCurrentUser();
    if (saved) setUser(saved);
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Mock login - any email works for MVP
    const existing = MOCK_USERS[email] || {
      id: Math.random().toString(36).slice(2),
      email,
      name: email.split('@')[0],
      plan: 'free' as const,
      credits: 100,
      diagramsLimit: 10,
    };
    setUser(existing);
    storage.saveUser(existing);
    return true;
  };

  const signup = async (email: string, name: string, _password: string) => {
    const newUser: User = {
      id: Math.random().toString(36).slice(2),
      email,
      name,
      plan: 'free',
      credits: 100,
      diagramsLimit: 10,
    };
    setUser(newUser);
    storage.saveUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    storage.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
