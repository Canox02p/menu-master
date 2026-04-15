'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '@/components/providers/auth-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { AdminDashboard } from '@/components/pos/admin-dashboard';
import { MenuManagement } from '@/components/pos/menu-management';
import { WaiterTables } from '@/components/pos/waiter-tables';
import { WaiterOrders } from '@/components/pos/waiter-orders';
import { ChefKDS } from '@/components/pos/chef-kds';
import { SettingsView } from '@/components/pos/settings-view';
import { InventoryManagement } from '@/components/pos/inventory-management';
import { TableManagement } from '@/components/pos/table-management';
import { ReportsView } from '@/components/pos/reports-view';
import { StaffManagement } from '@/components/pos/staff-management';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard, Eye, EyeOff, CheckCircle2, Shield, ChefHat, UtensilsCrossed, ChevronRight } from 'lucide-react-native';

const BASE_URL = 'https://menu-master-api.onrender.com';

export default function Home() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // ESTADOS DEL FORMULARIO SaaS
  const [mode, setMode] = useState<'login' | 'register' | 'recovery' | 'success'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // NUEVO: Estado para guardar el rol que el usuario selecciona al entrar
  const [sessionRole, setSessionRole] = useState<string | null>(null);

  // CAMPOS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  // Lógica de redirección por prioridad y selección de rol
  useEffect(() => {
    if (user?.roles) {
      // Si solo tiene 1 rol, entra directo sin preguntar
      if (user.roles.length === 1) {
        handleRoleSelection(user.roles[0]);
      }
    } else {
      // Si el usuario hace logout, limpiamos la selección
      setSessionRole(null);
    }
  }, [user]);

  const handleRoleSelection = (role: string) => {
    setSessionRole(role);
    if (role === 'ADMIN') setActiveTab('dashboard');
    else if (role === 'COCINERO') setActiveTab('kds');
    else setActiveTab('tables');
  };

  const getRoleIcon = (role: string) => {
    if (role === 'ADMIN') return <Shield color="#3b82f6" size={24} />;
    if (role === 'COCINERO') return <ChefHat color="#10b981" size={24} />;
    return <UtensilsCrossed color="#f97316" size={24} />;
  };

  // VALIDACIONES EXHAUSTIVAS
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast({ title: "Campo requerido", description: "El correo es obligatorio.", variant: "destructive" });
      return false;
    }

    if (!emailRegex.test(cleanEmail)) {
      toast({ title: "Correo inválido", description: "Formato de correo no válido.", variant: "destructive" });
      return false;
    }

    if (mode === 'login') {
      if (!password.trim()) {
        toast({ title: "Campo requerido", description: "La contraseña es obligatoria.", variant: "destructive" });
        return false;
      }
    }

    if (mode === 'register') {
      if (!restaurantName.trim() || !ownerName.trim() || !password.trim() || !confirmPassword.trim()) {
        toast({ title: "Campos incompletos", description: "Todos los campos son obligatorios para registrar la empresa.", variant: "destructive" });
        return false;
      }
      if (password.trim().length < 6) {
        toast({ title: "Contraseña débil", description: "Debe tener al menos 6 caracteres.", variant: "destructive" });
        return false;
      }
      if (password !== confirmPassword) {
        toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
        return false;
      }
    }

    if (mode === 'recovery') {
      if (!password.trim() || !confirmPassword.trim()) {
        toast({ title: "Campos incompletos", description: "Ingresa tu nueva contraseña y confírmala.", variant: "destructive" });
        return false;
      }
      if (password !== confirmPassword) {
        toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
        return false;
      }
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
        await login(cleanEmail, password.trim());
        toast({
          title: "Bienvenido",
          description: "Acceso concedido exitosamente."
        });

      } else if (mode === 'register') {
        const res = await fetch(`${BASE_URL}/auth/register-company`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombreRestaurante: restaurantName.trim(),
            nombreDueno: ownerName.trim(),
            correo: cleanEmail,
            password: password.trim(),
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar la empresa.');

        setMode('success');
        setPassword('');
        setConfirmPassword('');

      } else if (mode === 'recovery') {
        const res = await fetch(`${BASE_URL}/auth/recover-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: cleanEmail, nuevaPassword: password.trim() })
        });

        if (!res.ok) throw new Error('Error al actualizar contraseña.');

        toast({ title: "¡Actualizada!", description: "Tu contraseña ha sido cambiada." });
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Verifica tu conexión a internet.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- VISTA DE ÉXITO AL REGISTRAR ---
  if (mode === 'success' && !user) {
    return (
      <View className="flex-1 bg-[#09090b] items-center justify-center p-6">
        <View className="items-center space-y-6 max-w-sm">
          <CheckCircle2 color="#3b82f6" size={80} />
          <Text className="text-3xl font-bold text-white text-center">¡Cuenta Creada!</Text>
          <Text className="text-zinc-400 text-center text-lg">
            Tu restaurante <Text className="font-bold text-white">{restaurantName}</Text> ha sido registrado con éxito.
            Ya puedes iniciar sesión para configurar tu menú y empleados.
          </Text>
          <Button
            onPress={() => setMode('login')}
            className="w-full rounded-xl py-6 mt-4"
          >
            <Text className="text-white font-bold text-base">Ir a Iniciar Sesión</Text>
          </Button>
        </View>
      </View>
    );
  }

  // --- VISTA DE INICIO DE SESIÓN / REGISTRO / RECUPERACIÓN ---
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
                  {mode === 'login' ? 'Ingresa a tu portal de trabajo' :
                    mode === 'register' ? 'Registra tu restaurante' :
                      'Recupera tu acceso'}
                </Text>
              </View>
            </View>

            <Card className="bg-zinc-900/50 border-zinc-800/60 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
              <CardContent className="p-8 space-y-5">

                {/* CAMPOS EXCLUSIVOS DE REGISTRO */}
                {mode === 'register' && (
                  <>
                    <View className="space-y-2">
                      <Label className="text-zinc-400">Nombre del Restaurante</Label>
                      <Input
                        placeholder="Ej. Taquería Los Primos"
                        value={restaurantName}
                        onChangeText={setRestaurantName}
                        className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl"
                      />
                    </View>
                    <View className="space-y-2">
                      <Label className="text-zinc-400">Nombre del Dueño (Admin)</Label>
                      <Input
                        placeholder="Ej. Juan Pérez"
                        value={ownerName}
                        onChangeText={setOwnerName}
                        className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl"
                      />
                    </View>
                  </>
                )}

                {/* CORREO (COMÚN A TODOS) */}
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

                {/* CONTRASEÑA CON OJITO */}
                <View className="space-y-2">
                  <View className="flex-row justify-between items-center">
                    <Label className="text-zinc-400">
                      {mode === 'recovery' ? 'Nueva Contraseña' : 'Contraseña'}
                    </Label>
                    {mode === 'login' && (
                      <TouchableOpacity onPress={() => setMode('recovery')}>
                        <Text className="text-blue-500 text-xs font-bold">¿Olvidaste tu contraseña?</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="relative justify-center">
                    <Input
                      placeholder="••••••••"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl pr-12"
                    />
                    <TouchableOpacity
                      className="absolute right-4"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff color="#71717a" size={20} /> : <Eye color="#71717a" size={20} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CONFIRMAR CONTRASEÑA */}
                {(mode === 'register' || mode === 'recovery') && (
                  <View className="space-y-2">
                    <Label className="text-zinc-400">Confirmar Contraseña</Label>
                    <View className="relative justify-center">
                      <Input
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl pr-12"
                      />
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
                      {mode === 'login' ? 'Iniciar Sesión' :
                        mode === 'register' ? 'Registrar Empresa' : 'Actualizar Contraseña'}
                    </Text>
                  )}
                </Button>

                {/* BOTONES DE NAVEGACIÓN INFERIOR */}
                <View className="pt-4 flex-col gap-3">
                  {mode !== 'login' && (
                    <TouchableOpacity onPress={() => { setMode('login'); setPassword(''); setConfirmPassword(''); }}>
                      <Text className="text-zinc-500 text-center font-medium text-sm">
                        Volver a Iniciar Sesión
                      </Text>
                    </TouchableOpacity>
                  )}
                  {mode === 'login' && (
                    <TouchableOpacity onPress={() => { setMode('register'); setPassword(''); }}>
                      <Text className="text-zinc-500 text-center font-medium text-sm">
                        ¿Eres dueño? <Text className="text-blue-500 font-bold">Registra tu restaurante</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

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

  // --- VISTA DE SELECCIÓN DE ROL (Solo si tiene > 1 rol y aún no selecciona nada) ---
  if (user && user.roles && user.roles.length > 1 && !sessionRole) {
    return (
      <View className="flex-1 bg-[#09090b] items-center justify-center p-6">
        <View className="max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">

          <View className="text-center space-y-2 mb-4">
            <Text className="text-3xl font-headline font-bold text-white text-center">Selecciona tu Rol</Text>
            <Text className="text-zinc-500 text-center text-base">
              Tienes múltiples roles asignados. ¿Cómo deseas entrar hoy?
            </Text>
          </View>

          <Card className="bg-zinc-900/50 border-zinc-800/60 rounded-[32px] overflow-hidden shadow-2xl">
            <CardContent className="p-6 space-y-3">
              {user.roles.map(role => (
                <TouchableOpacity
                  key={role}
                  onPress={() => handleRoleSelection(role)}
                  className="bg-zinc-800/50 border border-zinc-700 p-5 rounded-2xl flex-row items-center justify-between hover:bg-zinc-800 active:scale-95 transition-all"
                >
                  <View className="flex-row items-center gap-4">
                    {getRoleIcon(role)}
                    <Text className="text-white font-bold text-lg tracking-wide">{role}</Text>
                  </View>
                  <ChevronRight color="#a1a1aa" size={24} />
                </TouchableOpacity>
              ))}
            </CardContent>
          </Card>

        </View>
      </View>
    );
  }
  // --- VISTA PRINCIPAL (LOGUEADO) ---
  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} sessionRole={sessionRole}>
      <View className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'table-management' && <TableManagement />}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'inventory' && <InventoryManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'tables' && <WaiterTables />}
        {activeTab === 'orders' && <WaiterOrders />}
        {activeTab === 'kds' && <ChefKDS />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'reports' && <ReportsView />}

        {!['dashboard', 'table-management', 'menu', 'tables', 'orders', 'kds', 'settings', 'inventory', 'staff', 'reports'].includes(activeTab) && (
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