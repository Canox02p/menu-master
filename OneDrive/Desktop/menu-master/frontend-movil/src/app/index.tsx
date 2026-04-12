import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
import { ChefHat, UtensilsCrossed, ShieldCheck, LayoutDashboard } from 'lucide-react-native';

export default function Home() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Lógica de pestañas por defecto según el rol (SRP: Responsabilidad de redirección inicial)
  useEffect(() => {
    if (user?.role === 'WAITER') setActiveTab('tables');
    if (user?.role === 'CHEF') setActiveTab('kds');
    if (user?.role === 'ADMIN') setActiveTab('dashboard');
  }, [user]);

  // --- VISTA DE INICIO DE SESIÓN ---
  if (!user) {
    return (
      <View className="flex-1 bg-[#09090b] flex items-center justify-center p-6">
        <View className="max-w-md w-full space-y-12 animate-in fade-in zoom-in-95 duration-700">

          {/* SECCIÓN DEL LOGO Y TÍTULO */}
          <View className="text-center space-y-5">
            <View className="w-20 h-20 bg-primary rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-primary/40">
              <Text className="text-primary-foreground font-headline font-bold text-4xl">C</Text>
            </View>
            <View>
              <Text className="text-4xl font-headline font-bold text-white tracking-tighter text-center">
                CustoServe POS
              </Text>
              <Text className="text-zinc-500 font-medium text-center mt-2 text-base">
                Professional Dining Experience Platform
              </Text>
            </View>
          </View>

          {/* TARJETA DE PORTALES */}
          <Card className="bg-zinc-900/50 border-zinc-800/60 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <Text className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-[4px] mb-4">
                Select Access Portal
              </Text>

              {/* OPCIÓN: ADMINISTRADOR */}
              <TouchableOpacity
                onPress={() => login('ADMIN')}
                className="w-full flex-row items-center gap-5 p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/30 active:scale-95 transition-all"
              >
                <View className="p-3 rounded-xl bg-blue-500/10">
                  <ShieldCheck color="#3b82f6" size={26} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-white leading-tight">Administrator</Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">Control center & analytics</Text>
                </View>
              </TouchableOpacity>

              {/* OPCIÓN: SERVICE STAFF */}
              <TouchableOpacity
                onPress={() => login('WAITER')}
                className="w-full flex-row items-center gap-5 p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/30 active:scale-95 transition-all"
              >
                <View className="p-3 rounded-xl bg-orange-500/10">
                  <UtensilsCrossed color="#f97316" size={26} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-white leading-tight">Service Staff</Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">Table management & orders</Text>
                </View>
              </TouchableOpacity>

              {/* OPCIÓN: CULINARY TEAM */}
              <TouchableOpacity
                onPress={() => login('CHEF')}
                className="w-full flex-row items-center gap-5 p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/30 active:scale-95 transition-all"
              >
                <View className="p-3 rounded-xl bg-emerald-500/10">
                  <ChefHat color="#10b981" size={26} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-white leading-tight">Culinary Team</Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">Kitchen display & prep</Text>
                </View>
              </TouchableOpacity>
            </CardContent>
          </Card>

          {/* FOOTER */}
          <Text className="text-center text-zinc-600 text-[10px] font-medium tracking-widest mt-10">
            © 2026 MENU MASTER SYSTEMS. ALL RIGHTS RESERVED.
          </Text>
        </View>
      </View>
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

        {/* MODULO EN CONSTRUCCIÓN */}
        {!['dashboard', 'menu', 'tables', 'orders', 'kds', 'settings', 'inventory', 'staff'].includes(activeTab) && (
          <View className="flex-1 flex-col items-center justify-center h-[60vh] opacity-50">
            {/* CORRECCIÓN: Quitamos className del icono y usamos un View de envoltura */}
            <View className="mb-4">
              <LayoutDashboard color="gray" size={64} />
            </View>
            <Text className="font-headline text-xl text-gray-500">Module Under Construction</Text>
            <Text className="text-gray-500">This feature will be available in the next release.</Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
}