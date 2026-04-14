'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '@/components/providers/auth-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { AdminDashboard } from '@/components/pos/admin-dashboard';
import { MenuManagement } from '@/components/pos/menu-management';
import { WaiterTables } from '@/components/pos/waiter-tables';
import { WaiterOrders } from '@/components/pos/waiter-orders';
import { ChefKDS } from '@/components/pos/chef-kds';
import { SettingsView } from '@/components/pos/settings-view';
import { InventoryManagement } from '@/components/pos/inventory-management';
import { StaffManagement } from '@/components/pos/staff-management';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard, ShieldCheck, UtensilsCrossed, ChefHat } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const BASE_URL = 'https://menu-master-api.onrender.com';

export default function Home() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // ESTADOS DEL FORMULARIO
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // CAMPOS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'WAITER' | 'CHEF'>('WAITER');

  // Lógica de redirección inicial
  useEffect(() => {
    if (user?.role === 'WAITER') setActiveTab('tables');
    else if (user?.role === 'CHEF') setActiveTab('kds');
    else if (user?.role === 'ADMIN') setActiveTab('dashboard');
  }, [user]);

  // VALIDACIONES EXHAUSTIVAS
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !password.trim()) {
      toast({ title: "Campos incompletos", description: "El correo y contraseña son obligatorios.", variant: "destructive" });
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      toast({ title: "Correo inválido", description: "Por favor ingresa un formato de correo válido.", variant: "destructive" });
      return false;
    }

    if (password.trim().length < 4) {
      toast({ title: "Contraseña muy corta", description: "La contraseña debe tener al menos 4 caracteres.", variant: "destructive" });
      return false;
    }

    if (mode === 'register' && !name.trim()) {
      toast({ title: "Nombre requerido", description: "Por favor ingresa el nombre del empleado.", variant: "destructive" });
      return false;
    }

    return true;
  };

  // MANEJADOR DE AUTENTICACIÓN
  const handleAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === 'login') {
        // En el login delegamos a tu AuthProvider, pero aseguramos de mandar el email limpio
        await login(cleanEmail, password.trim());
        toast({ title: "Bienvenido", description: "Acceso concedido exitosamente." });
      } else {
        // REGISTRO CON MANEJO DE ERRORES REAL
        const res = await fetch(`${BASE_URL}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: name.trim(),
            email: cleanEmail,
            password_hash: password.trim(),
            rol: role
          })
        });

        // Extraemos el error exacto que manda Node.js (MongoDB)
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error desconocido al crear la cuenta en el servidor.');
        }

        toast({ title: "Cuenta creada", description: "El usuario ha sido registrado en la base de datos." });
        setMode('login');
        setPassword('');
      }
    } catch (error: any) {
      console.error("Error Auth:", error);
      toast({
        title: mode === 'login' ? "Error de Acceso" : "Fallo en Registro",
        description: error.message || "Verifica tu conexión a internet.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- VISTA DE INICIO DE SESIÓN / REGISTRO ---
  if (!user) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-[#09090b]"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">

            <View className="text-center space-y-4 mb-4">
              <View className="w-20 h-20 bg-primary rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-primary/40">
                <Text className="text-primary-foreground font-headline font-bold text-4xl">C</Text>
              </View>
              <View>
                <Text className="text-4xl font-headline font-bold text-white tracking-tighter text-center">
                  Menu Master
                </Text>
                <Text className="text-zinc-500 font-medium text-center mt-2 text-base">
                  {mode === 'login' ? 'Ingresa a tu portal de trabajo' : 'Crea una nueva cuenta de empleado'}
                </Text>
              </View>
            </View>

            <Card className="bg-zinc-900/50 border-zinc-800/60 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
              <CardContent className="p-8 space-y-5">

                {mode === 'register' && (
                  <View className="space-y-2">
                    <Label className="text-zinc-400">Nombre Completo</Label>
                    <Input
                      placeholder="Ej. Uriel Cano"
                      value={name}
                      onChangeText={setName}
                      className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl"
                    />
                  </View>
                )}

                <View className="space-y-2">
                  <Label className="text-zinc-400">Correo Electrónico</Label>
                  <Input
                    placeholder="correo@restaurante.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl"
                  />
                </View>

                <View className="space-y-2">
                  <Label className="text-zinc-400">Contraseña</Label>
                  <Input
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl"
                  />
                </View>

                {mode === 'register' && (
                  <View className="space-y-3 pt-2">
                    <Label className="text-zinc-400">Rol del Empleado</Label>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => setRole('ADMIN')}
                        className={cn("flex-1 p-3 rounded-xl border items-center gap-2", role === 'ADMIN' ? "bg-blue-500/20 border-blue-500" : "bg-zinc-800/50 border-zinc-700")}
                      >
                        <ShieldCheck color={role === 'ADMIN' ? "#3b82f6" : "#71717a"} size={20} />
                        <Text className={cn("text-xs font-bold", role === 'ADMIN' ? "text-blue-500" : "text-zinc-400")}>Admin</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setRole('WAITER')}
                        className={cn("flex-1 p-3 rounded-xl border items-center gap-2", role === 'WAITER' ? "bg-orange-500/20 border-orange-500" : "bg-zinc-800/50 border-zinc-700")}
                      >
                        <UtensilsCrossed color={role === 'WAITER' ? "#f97316" : "#71717a"} size={20} />
                        <Text className={cn("text-xs font-bold", role === 'WAITER' ? "text-orange-500" : "text-zinc-400")}>Mesero</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setRole('CHEF')}
                        className={cn("flex-1 p-3 rounded-xl border items-center gap-2", role === 'CHEF' ? "bg-emerald-500/20 border-emerald-500" : "bg-zinc-800/50 border-zinc-700")}
                      >
                        <ChefHat color={role === 'CHEF' ? "#10b981" : "#71717a"} size={20} />
                        <Text className={cn("text-xs font-bold", role === 'CHEF' ? "text-emerald-500" : "text-zinc-400")}>Cocina</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <Button
                  onPress={handleAuth}
                  disabled={isLoading}
                  className="w-full rounded-xl py-6 mt-4 active:scale-95"
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      {mode === 'login' ? 'Iniciar Sesión' : 'Registrar Empleado'}
                    </Text>
                  )}
                </Button>

                <TouchableOpacity onPress={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setPassword('');
                }} className="pt-2">
                  <Text className="text-zinc-500 text-center font-medium text-sm">
                    {mode === 'login' ? '¿No tienes cuenta? Registra un usuario' : '¿Ya tienes cuenta? Inicia sesión'}
                  </Text>
                </TouchableOpacity>

              </CardContent>
            </Card>

            <Text className="text-center text-zinc-600 text-[10px] font-medium tracking-widest mt-6">
              © 2026 MENU MASTER SYSTEMS.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // --- VISTA PRINCIPAL (LOGUEADO) ---
  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <View className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'inventory' && <InventoryManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'tables' && <WaiterTables />}
        {activeTab === 'orders' && <WaiterOrders />}
        {activeTab === 'kds' && <ChefKDS />}
        {activeTab === 'settings' && <SettingsView />}

        {!['dashboard', 'menu', 'tables', 'orders', 'kds', 'settings', 'inventory', 'staff'].includes(activeTab) && (
          <View className="flex-1 flex-col items-center justify-center h-[60vh] opacity-50">
            <View className="mb-4">
              <LayoutDashboard color="gray" size={64} />
            </View>
            <Text className="font-headline text-xl text-gray-500">Módulo en Construcción</Text>
            <Text className="text-gray-500">Esta función estará disponible en la próxima versión.</Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
}