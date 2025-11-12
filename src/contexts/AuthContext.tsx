'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isEmailAuthorized } from '@/config/authorized-emails';
import { useRouter } from 'next/navigation';
import messages from '@/locales/messages.pt-br.json';

interface AuthContextType {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const authorized = isEmailAuthorized(currentUser?.email);
      setIsAuthorized(authorized);
      setLoading(false);
      
      if (currentUser && !authorized) {
        // If user is logged in but not authorized, sign them out.
        signOut(auth);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (!isEmailAuthorized(result.user.email)) {
        await signOut(auth);
        throw new Error('EMAIL_NOT_AUTHORIZED');
      }
      router.push('/dashboard');
    } catch (error: any) {
       if (error.message !== 'EMAIL_NOT_AUTHORIZED') {
         console.error("Google Sign-In Error:", error);
       }
       throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setIsAuthorized(false);
    router.push('/login');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthorized, loading, signInWithGoogle, signOutUser }}>
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
