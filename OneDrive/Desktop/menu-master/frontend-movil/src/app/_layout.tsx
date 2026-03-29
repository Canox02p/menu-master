import { useEffect } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View className="flex-1 font-body antialiased selection:bg-primary selection:text-primary-foreground overflow-hidden">
      <AuthProvider>
        <ThemeProvider>
          <Slot />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </View>
  );
}