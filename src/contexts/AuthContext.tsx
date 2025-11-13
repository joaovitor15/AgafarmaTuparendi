'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { isEmailAuthorized, AUTHORIZED_EMAILS } from '@/config/authorized-emails';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LoadingScreen = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Autenticando...</p>
    </div>
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const authorized = isEmailAuthorized(currentUser.email);
        setIsAuthorized(authorized);
        setUser(currentUser);
        
        if (authorized) {
            // Salva ou atualiza os dados do usuário no Firestore
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                await setDoc(userRef, {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                    lastLogin: new Date().toISOString(),
                }, { merge: true });
            } catch (error) {
                console.error("Erro ao salvar dados do usuário no Firestore:", error);
            }
        }
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!isEmailAuthorized(email)) {
        await signOut(auth);
        throw new Error('EMAIL_NOT_AUTHORIZED');
      }
      // O onAuthStateChanged vai cuidar de atualizar o estado
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Não mostrar toast se o usuário simplesmente fechou o popup
      } else if (error.message === 'EMAIL_NOT_AUTHORIZED') {
        toast({
            variant: 'destructive',
            title: 'Acesso Negado',
            description: 'Este email não tem permissão para acessar o aplicativo.',
        });
        router.push('/access-denied');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro de Login',
          description: 'Não foi possível fazer login. Tente novamente.',
        });
      }
      // Em caso de erro, o onAuthStateChanged garantirá que o usuário seja nulo.
    } finally {
        // Não paramos o loading aqui, pois o onAuthStateChanged é a fonte da verdade
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // O onAuthStateChanged vai cuidar de limpar o estado e redirecionar
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Sair',
        description: 'Não foi possível fazer logout. Tente novamente.',
      });
    } finally {
        // Não precisamos parar o loading, onAuthStateChanged fará isso.
    }
  };

  const value: AuthContextType = {
    user,
    isAuthorized,
    loading,
    signInWithGoogle,
    signOutUser,
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
