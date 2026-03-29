import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth, UserRole } from '@/components/providers/auth-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { AdminDashboard } from '@/components/pos/admin-dashboard';
import { MenuManagement } from '@/components/pos/menu-management';
import { WaiterTables } from '@/components/pos/waiter-tables';
import { WaiterOrders } from '@/components/pos/waiter-orders';
import { ChefKDS } from '@/components/pos/chef-kds';
import { SettingsView } from '@/components/pos/settings-view';
import { InventoryManagement } from '@/components/pos/inventory-management';
import { StaffManagement } from '@/components/pos/staff-management';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// MÓVIL: Se requiere la versión nativa de los iconos
import { ChefHat, UtensilsCrossed, ShieldCheck, LayoutDashboard } from 'lucide-react-native';

export default function Home() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Set default tabs based on role
  useEffect(() => {
    if (user?.role === 'WAITER') setActiveTab('tables');
    if (user?.role === 'CHEF') setActiveTab('kds');
    if (user?.role === 'ADMIN') setActiveTab('dashboard');
  }, [user]);

  if (!user) {
    return (
      <View className="min-h-screen bg-[#171A1C] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-[#171A1C] to-[#171A1C]">
        <View className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <View className="text-center space-y-2">
            <View className="w-16 h-16 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/20">
              {/* MÓVIL: El texto debe ir siempre envuelto en <Text> */}
              <Text className="text-primary-foreground font-headline font-bold text-3xl">C</Text>
            </View>
            <Text className="text-4xl font-headline font-bold text-white tracking-tighter mt-6">CustoServe POS</Text>
            <Text className="text-white/50 font-medium">Professional Dining Experience Platform</Text>
          </View>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-4">
              <Text className="text-center text-sm font-bold text-white/70 uppercase tracking-widest mb-6">Select Access Portal</Text>

              {/* MÓVIL: onClick pasa a ser onPress y button a TouchableOpacity */}
              <TouchableOpacity
                onPress={() => login('ADMIN')}
                className="w-full group flex-row items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-primary transition-all duration-300"
              >
                <View className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20">
                  <ShieldCheck color="white" size={24} />
                </View>
                <View className="text-left flex-1">
                  <Text className="font-bold text-lg text-white leading-none mb-1">Administrator</Text>
                  <Text className="text-xs text-white/50 group-hover:text-white/80">Control center & analytics</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => login('WAITER')}
                className="w-full group flex-row items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-accent transition-all duration-300"
              >
                <View className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20">
                  <UtensilsCrossed color="white" size={24} />
                </View>
                <View className="text-left flex-1">
                  <Text className="font-bold text-lg text-white leading-none mb-1">Service Staff</Text>
                  <Text className="text-xs text-white/50 group-hover:text-white/80">Table management & orders</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => login('CHEF')}
                className="w-full group flex-row items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-[#10B981] transition-all duration-300"
              >
                <View className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20">
                  <ChefHat color="white" size={24} />
                </View>
                <View className="text-left flex-1">
                  <Text className="font-bold text-lg text-white leading-none mb-1">Culinary Team</Text>
                  <Text className="text-xs text-white/50 group-hover:text-white/80">Kitchen display & prep</Text>
                </View>
              </TouchableOpacity>
            </CardContent>
          </Card>

          <Text className="text-center text-white/30 text-xs font-medium">
            © 2024 CustoServe POS Systems. All rights reserved.
          </Text>
        </View>
      </View>
    );
  }

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
          <View className="flex flex-col items-center justify-center h-[60vh] opacity-50">
            <LayoutDashboard color="gray" size={64} className="mb-4" />
            <Text className="font-headline text-xl text-gray-500">Module Under Construction</Text>
            <Text className="text-gray-500">This feature will be available in the next release.</Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
}