import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check for stored token and validate on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Get token from AsyncStorage and verify
      // const token = await AsyncStorage.getItem('authToken');
      // if (token) {
      //   const isValid = await authService.verifyToken(token);
      //   if (isValid) {
      //     // Fetch user data
      //   }
      // }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      // TODO: Store token in AsyncStorage
      // await AsyncStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: any) => {
    try {
      const response = await authService.signup(data);
      setUser(response.user);
      // TODO: Store token in AsyncStorage
      // await AsyncStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      // TODO: Remove token from AsyncStorage
      // await AsyncStorage.removeItem('authToken');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
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
