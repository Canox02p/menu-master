import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';

// Usamos los roles exactos que devuelve tu backend
export type UserRole = 'ADMIN' | 'MESERO' | 'COCINERO';

interface User {
  id: string;
  name: string;
  roles: UserRole[]; // AHORA ES UN ARREGLO
  email: string;
  restaurante_nombre?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password_hash: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('pos-user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password_hash: string) => {
    try {
      // Ajusta 'api.auth.login' si tu API devuelve algo diferente, 
      // pero asumiendo que devuelve { usuario: {...}, token: "..." }
      const data = await api.auth.login(email, password_hash);

      const newUser: User = {
        id: data.usuario._id || data.usuario.id,
        name: data.usuario.nombre,
        roles: data.usuario.roles, // Extraemos el arreglo
        email: data.usuario.email,
        restaurante_nombre: data.usuario.restaurante_nombre
      };

      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('pos-user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['pos-user', 'userToken']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};