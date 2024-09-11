'use client';

import { hasAuthToken } from '@/lib/auth-token';
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
  signOut,
} from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface AuthContextProps {
  user: FetchUserAttributesOutput;
  setUser: (user: FetchUserAttributesOutput) => void;
  isLoadingUserData: boolean;
  removeUserAndToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FetchUserAttributesOutput>(
    {} as FetchUserAttributesOutput,
  );
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const router = useRouter();

  const removeUserAndToken = useCallback(async () => {
    setIsLoadingUserData(true);

    await signOut({ global: true });
    setUser({} as FetchUserAttributesOutput);

    router.push('/login');

    setIsLoadingUserData(false);
  }, [router]);

  const loadUserData = useCallback(async () => {
    try {
      const token = await hasAuthToken();

      if (token) {
        const loadedUser = await fetchUserAttributes();
        setUser(loadedUser);
      }
    } catch (error) {
      await removeUserAndToken();
      toast.error('Sua sessão expirou. Faça login novamente.');
    } finally {
      setIsLoadingUserData(false);
    }
  }, [removeUserAndToken]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserData,
        removeUserAndToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
