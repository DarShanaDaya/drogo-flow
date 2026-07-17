'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export type UserPlan = 'free' | 'starter' | 'pro' | 'monthly';

export type User = {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  credits: number;
  diagramsLimit: number;
  createdAt: string;
};

type AuthError = {
  field?: 'email' | 'password' | 'name' | 'general';
  message: string;
};

type AuthResult = {
  success: boolean;
  error?: AuthError;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPaid: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'drogo_session';
const USERS_KEY = 'drogo_users';

// Simple hash for demo purposes (in production, use bcrypt server-side)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash).toString(36)}_${password.length}`;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

function validateName(name: string): string | null {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}

type StoredUser = User & { passwordHash: string };

// Seed the demo user on first load
function getStoredUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }

  // Seed demo user
  const demo: StoredUser = {
    id: 'demo_user_001',
    email: 'demo@drogo.flow',
    name: 'Demo User',
    plan: 'pro',
    credits: 20000,
    diagramsLimit: 10000,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword('demo123'),
  };
  const users = { [demo.email.toLowerCase()]: demo };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

function saveUsers(users: Record<string, StoredUser>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    user,
    token: `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }));
}

function loadSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    const session = JSON.parse(data);
    // Check expiry
    if (session.expiresAt && session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = loadSession();
    if (saved) setUser(saved);
    // Ensure demo user exists
    getStoredUsers();
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    // Validate inputs
    const emailErr = validateEmail(email);
    if (emailErr) return { success: false, error: { field: 'email', message: emailErr } };

    const passErr = validatePassword(password);
    if (passErr) return { success: false, error: { field: 'password', message: passErr } };

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const users = getStoredUsers();
    const stored = users[email.toLowerCase()];

    if (!stored) {
      return { success: false, error: { field: 'email', message: 'No account found with this email' } };
    }

    if (stored.passwordHash !== hashPassword(password)) {
      return { success: false, error: { field: 'password', message: 'Incorrect password' } };
    }

    const { passwordHash: _, ...userData } = stored;
    setUser(userData);
    saveSession(userData);
    // Set cookie for middleware route protection
    if (typeof document !== 'undefined') {
      document.cookie = `drogo_session=1; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    const nameErr = validateName(name);
    if (nameErr) return { success: false, error: { field: 'name', message: nameErr } };

    const emailErr = validateEmail(email);
    if (emailErr) return { success: false, error: { field: 'email', message: emailErr } };

    const passErr = validatePassword(password);
    if (passErr) return { success: false, error: { field: 'password', message: passErr } };

    await new Promise(r => setTimeout(r, 600));

    const users = getStoredUsers();
    if (users[email.toLowerCase()]) {
      return { success: false, error: { field: 'email', message: 'An account with this email already exists' } };
    }

    const newUser: StoredUser = {
      id: `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      plan: 'free',
      credits: 100,
      diagramsLimit: 10,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
    };

    users[email.toLowerCase()] = newUser;
    saveUsers(users);

    const { passwordHash: _, ...userData } = newUser;
    setUser(userData);
    saveSession(userData);
    // Set cookie for middleware route protection
    if (typeof document !== 'undefined') {
      document.cookie = `drogo_session=1; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
    // Clear middleware cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'drogo_session=; path=/; max-age=0';
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'email'>>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    saveSession(updated);

    // Update in users store
    const users = getStoredUsers();
    const stored = users[user.email.toLowerCase()];
    if (stored) {
      // If email changed, migrate the key
      if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
        delete users[user.email.toLowerCase()];
        users[updates.email.toLowerCase()] = { ...stored, ...updates, email: updates.email.toLowerCase() };
      } else {
        users[user.email.toLowerCase()] = { ...stored, ...updates };
      }
      saveUsers(users);
    }
  }, [user]);

  const isAuthenticated = !!user;
  const isPaid = !!user && user.plan !== 'free';

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isPaid, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
