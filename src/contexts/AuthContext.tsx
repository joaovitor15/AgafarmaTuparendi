'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, ReactNode } from 'react';

// Mock user data
const mockUser: User = {
  uid: 'mock-user-id',
  email: 'mock@example.com',
  emailVerified: true,
  displayName: 'Usuário Mock',
  isAnonymous: false,
  photoURL: `https://i.pravatar.cc/150?u=mock-user-id`,
  providerData: [],
  metadata: {},
} as User;

interface AuthContextType {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const value: AuthContextType = {
    user: mockUser,
    isAuthorized: true,
    loading: false,
    signInWithGoogle: async () => { console.log("Sign-in disabled."); },
    signOutUser: async () => { console.log("Sign-out disabled."); },
  };

  return (
    <AuthContext.Provider value={value}>
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
