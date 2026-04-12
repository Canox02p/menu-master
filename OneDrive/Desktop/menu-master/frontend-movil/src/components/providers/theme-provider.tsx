import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-provider';
import { useColorScheme, vars } from 'nativewind';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// MÓVIL: Lógica matemática intacta
function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, '');
  if (hex.length !== 3 && hex.length !== 6) return '214 100% 70%';

  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [primaryColor, setPrimaryColor] = useState('#67A9FF');

  const theme = colorScheme || 'dark';
  const roleSuffix = user?.role ? `-${user.role.toLowerCase()}` : '';

  // 1. Carga inicial desde la memoria nativa
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(`pos-theme${roleSuffix}`) as Theme;
        if (savedTheme) setColorScheme(savedTheme);
        else setColorScheme('dark');

        const savedColor = await AsyncStorage.getItem(`pos-primary-color${roleSuffix}`);
        if (savedColor) setPrimaryColor(savedColor);
      } catch (error) {
        console.error("Error cargando configuración visual", error);
      }
    };
    loadSettings();
  }, [roleSuffix]);

  // 2. Guardado de Tema
  useEffect(() => {
    const saveTheme = async () => {
      if (user?.role) {
        try {
          await AsyncStorage.setItem(`pos-theme-${user.role.toLowerCase()}`, theme);
        } catch (error) {
          console.error("Error guardando tema", error);
        }
      }
    };
    saveTheme();
  }, [theme, user?.role]);

  // 3. Guardado de Color Primario
  useEffect(() => {
    const saveColor = async () => {
      if (user?.role && primaryColor !== '#67A9FF') {
        try {
          await AsyncStorage.setItem(`pos-primary-color-${user.role.toLowerCase()}`, primaryColor);
        } catch (error) {
          console.error("Error guardando color", error);
        }
      }
    };
    saveColor();
  }, [primaryColor, user?.role]);

  const toggleTheme = () => setColorScheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, setPrimaryColor }}>
      <View
        style={vars({ '--primary': hexToHsl(primaryColor), '--ring': hexToHsl(primaryColor) }) as any}
        className={`flex-1 bg-background ${theme === 'dark' ? 'dark' : ''}`}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};