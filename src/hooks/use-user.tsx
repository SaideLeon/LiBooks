'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/prisma/definitions';
import { getUserById } from '@/lib/actions';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      const loggedInUserId = sessionStorage.getItem('litbook_userId');
      if (loggedInUserId) {
        try {
          const userFromDb = await getUserById(parseInt(loggedInUserId, 10));
          if (userFromDb) {
            setUser(userFromDb);
          } else {
             sessionStorage.removeItem('litbook_userId');
          }
        } catch (error) {
            console.error("Failed to fetch user", error);
            sessionStorage.removeItem('litbook_userId');
        }
      }
      setIsLoading(false);
    };
    initializeUser();
  }, []);

  const login = useCallback((userToLogin: User) => {
    if (userToLogin && typeof userToLogin.id !== 'undefined') {
        sessionStorage.setItem('litbook_userId', userToLogin.id.toString());
        setUser(userToLogin);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('litbook_userId');
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
