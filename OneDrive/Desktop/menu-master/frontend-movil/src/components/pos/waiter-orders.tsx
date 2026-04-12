'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Receipt, CircleDollarSign } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface OrderData {
  id: string;
  table: number;
  total: number;
  items: number;
  status: 'Preparing' | 'Ready' | 'Delivered';
  time: string;
  priority: 'high' | 'normal';
}

interface OrderCardProps {
  order: OrderData;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onPrint: (id: string) => void;
  onPay: (id: string) => void;
}

// ==========================================
// 2. DATOS MOCKEADOS
// ==========================================

const mockOrders: OrderData[] = [
  { id: 'ORD-1234', table: 5, total: 45.50, items: 3, status: 'Preparing', time: '12m ago', priority: 'high' },
  { id: 'ORD-1235', table: 2, total: 12.00, items: 1, status: 'Ready', time: '2m ago', priority: 'normal' },
  { id: 'ORD-1236', table: 8, total: 88.20, items: 5, status: 'Preparing', time: '22m ago', priority: 'normal' },
];

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 3. SUBCOMPONENTES (SRP & Interacciones)
// ==========================================

const OrderCard = ({ order, isDark, primaryColor, widthStyle, onPrint, onPay }: OrderCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isReady = order.status === 'Ready';

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-300 rounded-[24px]",
            isDark ? "bg-zinc-900/40" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : 'transparent',
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          {/* CABECERA DE LA TARJETA */}
          <CardHeader className={cn(
            "flex-row items-center justify-between py-4 border-b",
            isDark ? "border-zinc-800/60" : "border-zinc-100"
          )}>
            <View className="flex-row items-center gap-3">
              <View
                className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Text style={{ color: primaryColor }} className="font-headline font-bold text-base">T{order.table}</Text>
              </View>
              <View>
                <CardTitle className={cn("text-sm font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  {order.id}
                </CardTitle>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  <Clock color={isDark ? "#a1a1aa" : "#71717a"} size={12} />
                  <Text className="text-[10px] text-zinc-500 font-bold">{order.time}</Text>
                </View>
              </View>
            </View>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-3 py-1 border",
                isReady
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-amber-500/10 border-amber-500/20"
              )}
              label={order.status.toUpperCase()}
            />
          </CardHeader>

          {/* CUERPO DE LA TARJETA */}
          <CardContent className="p-5 space-y-6">
            <View className="flex-row justify-between items-center mb-2">
              <View className="space-y-1">
                <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Order Value</Text>
                <Text className={cn("text-2xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  ${order.total.toFixed(2)}
                </Text>
              </View>
              <View className="items-end space-y-1">
                <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Items</Text>
                <Text className={cn("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  {order.items}
                </Text>
              </View>
            </View>

            {/* BOTONES DE ACCIÓN */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPrint(order.id)}
                className={cn(
                  "flex-1 flex-row rounded-xl gap-2 h-12 border items-center justify-center transition-colors",
                  isDark ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                )}
              >
                <Receipt color={isDark ? "#d4d4d8" : "#52525b"} size={18} />
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-600")}>Print Bill</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPay(order.id)}
                style={{ backgroundColor: primaryColor }}
                className="flex-1 flex-row rounded-xl gap-2 h-12 items-center justify-center shadow-lg shadow-primary/30"
              >
                <CircleDollarSign color="white" size={18} />
                <Text className="text-white text-xs font-bold tracking-wide">Pay Now</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL
// ==========================================

export function WaiterOrders() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Responsividad exacta calculada por React Native
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' }; // 3 columnas
    if (isTablet) return { width: '50%' };     // 2 columnas
    return { width: '100%' };                  // 1 columna en móvil
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 140 : 120 }}
      >
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          {/* ENCABEZADO Y TABS */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View>
              <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Active Orders
              </Text>
              <Text className="text-zinc-500">Monitor dish statuses and manage billing.</Text>
            </View>

            <View className={cn(
              "flex-row p-1.5 rounded-[16px] mt-2 md:mt-0 w-full md:w-auto",
              isDark ? "bg-zinc-900" : "bg-white border border-zinc-200 shadow-sm"
            )}>
              <TouchableOpacity
                activeOpacity={0.7}
                className={cn(
                  "flex-1 md:flex-none rounded-xl px-6 py-2.5 items-center transition-all duration-200",
                  activeTab === 'active' ? (isDark ? "bg-zinc-800" : "bg-zinc-100") : "bg-transparent"
                )}
                onPress={() => setActiveTab('active')}
              >
                <Text className={cn(
                  "font-bold",
                  activeTab === 'active'
                    ? (isDark ? "text-white" : "text-zinc-900")
                    : "text-zinc-500"
                )}>
                  Ongoing
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                className={cn(
                  "flex-1 md:flex-none rounded-xl px-6 py-2.5 items-center transition-all duration-200",
                  activeTab === 'completed' ? (isDark ? "bg-zinc-800" : "bg-zinc-100") : "bg-transparent"
                )}
                onPress={() => setActiveTab('completed')}
              >
                <Text className={cn(
                  "font-bold",
                  activeTab === 'completed'
                    ? (isDark ? "text-white" : "text-zinc-900")
                    : "text-zinc-500"
                )}>
                  History
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GRID DE ÓRDENES */}
          <View className="flex-row flex-wrap -mx-2">
            {mockOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
                onPrint={(id) => console.log(`Printing bill for ${id}`)}
                onPay={(id) => console.log(`Processing payment for ${id}`)}
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}