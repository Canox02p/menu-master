import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'ADMIN' | 'WAITER' | 'CHEF' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('pos-user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error loading user from AsyncStorage", error);
      }
    };
    loadUser();
  }, []);

  const login = async (role: UserRole) => {
    const names = { ADMIN: 'Alex Admin', WAITER: 'Will Waiter', CHEF: 'Charlie Chef' };
    const newUser = { id: '1', name: names[role as keyof typeof names], role };
    setUser(newUser);

    try {
      await AsyncStorage.setItem('pos-user', JSON.stringify(newUser));
    } catch (error) {
      console.error("Error saving user to AsyncStorage", error);
    }
  };

  const logout = async () => {
    setUser(null);

    try {
      await AsyncStorage.removeItem('pos-user');
    } catch (error) {
      console.error("Error removing user from AsyncStorage", error);
    }

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};