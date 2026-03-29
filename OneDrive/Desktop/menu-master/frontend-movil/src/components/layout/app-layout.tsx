import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth, UserRole } from '@/components/providers/auth-provider';
import { NAV_ITEMS } from './nav-config';
import { cn } from '@/lib/utils';
import { LogOut, Menu, X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppLayout({ children, activeTab, setActiveTab }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <>{children}</>;

  const items = NAV_ITEMS[user.role as keyof typeof NAV_ITEMS] || [];

  return (
    <View className="flex-1 flex-row bg-background overflow-hidden">

      {/* Sidebar for Desktop/Tablet */}
      <View className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-md">
        <View className="p-6 flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Text className="text-primary-foreground font-headline font-bold">C</Text>
          </View>
          <Text className="font-headline font-bold text-xl tracking-tight">CustoServe</Text>
        </View>

        <View className="flex-1 px-4 py-4 space-y-2">
          {items.map((item) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => setActiveTab(item.path)}
              className={cn(
                "w-full flex-row items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.path
                  ? "bg-primary shadow-lg shadow-primary/20"
                  : "hover:bg-accent/10"
              )}
            >
              <item.icon
                size={20}
                className={cn("w-5 h-5", activeTab === item.path ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")}
              />
              <Text className={cn(
                "font-medium",
                activeTab === item.path ? "text-primary-foreground text-white" : "text-muted-foreground"
              )}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="p-4 border-t">
          <View className="bg-accent/5 rounded-2xl p-4 mb-4">
            <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logged in as</Text>
            <Text className="font-bold text-foreground">{user.name}</Text>
            <Text className="text-xs text-primary font-medium">{user.role}</Text>
          </View>

          <TouchableOpacity
            className="w-full flex-row items-center gap-3 p-3 rounded-xl hover:bg-destructive/10"
            onPress={logout}
          >
            <LogOut size={20} className="text-destructive" color="gray" />
            <Text className="font-medium text-destructive">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 flex flex-col relative h-full">

        {/* Mobile Header */}
        <View className="md:hidden flex-row items-center justify-between p-4 border-b bg-card">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Text className="text-primary-foreground font-headline font-bold">C</Text>
            </View>
            <Text className="font-headline font-bold text-lg tracking-tight">CustoServe</Text>
          </View>
          <TouchableOpacity className="p-2" onPress={logout}>
            <LogOut size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </ScrollView>

        {/* Mobile Bottom Bar */}
        <View className="md:hidden absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t flex-row items-center justify-around py-3 px-2 z-50">
          {items.map((item) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => setActiveTab(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                activeTab === item.path ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={24} className={activeTab === item.path ? "text-primary" : "text-muted-foreground"} />
              <Text className={cn(
                "text-[10px] font-medium",
                activeTab === item.path ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}