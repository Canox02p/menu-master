'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// ¡AQUÍ ESTÁ EL ARREGLO! Agregamos UtensilsCrossed
import { Clock, CheckCircle2, AlertCircle, User, UtensilsCrossed } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api';

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface KDSOrderItem {
  id_producto?: string;
  name: string;
  qty: number;
  status: 'Preparing' | 'Completed';
  mods: string;
}

interface KDSOrder {
  id: string;
  table: string;
  waiterName: string;
  time: string;
  minutesAgo: number;
  items: KDSOrderItem[];
  urgency: 'high' | 'normal';
}

interface OrderTicketProps {
  order: KDSOrder;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onCompleteItem: (orderId: string, itemName: string) => void;
  onCompleteOrder: (orderId: string) => void;
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES (Ticket de la Cocina)
// ==========================================

const OrderTicket = ({ order, isDark, primaryColor, widthStyle, onCompleteItem, onCompleteOrder }: OrderTicketProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUrgent = order.urgency === 'high';

  const [opacityAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isUrgent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isUrgent]);

  const isFullyCompleted = order.items.every(item => item.status === 'Completed');

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        className="flex-1"
      >
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-300 rounded-[24px] flex-1 flex flex-col shadow-lg",
            isDark ? "bg-[#1E1E1E]" : "bg-white",
            isUrgent && (isDark ? "bg-red-950/30" : "bg-red-50/80")
          )}
          style={{
            borderWidth: isUrgent ? 2 : 1.5,
            borderColor: isUrgent ? '#ef4444' : (isHovered ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7')),
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          <CardHeader className={cn(
            "flex flex-row items-center justify-between py-4 border-b",
            isUrgent ? (isDark ? "bg-red-500/20 border-red-500/30" : "bg-red-500/10 border-red-200") :
              (isDark ? "bg-[#2A2A2A] border-[#3f3f46]" : "bg-zinc-50 border-zinc-200")
          )}>
            <View className="flex-row items-center gap-3">
              <View
                className={cn(
                  "w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm px-1",
                  isUrgent ? "bg-red-500" : (isDark ? "bg-black/40" : "bg-white")
                )}
                style={!isUrgent ? { backgroundColor: `${primaryColor}15` } : {}}
              >
                <Text
                  style={!isUrgent ? { color: primaryColor } : { color: 'white' }}
                  className="font-headline font-bold text-xs text-center"
                  numberOfLines={2}
                >
                  Mesa {order.table}
                </Text>
              </View>
              <View>
                <CardTitle className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  Ticket #{order.id.slice(-4)}
                </CardTitle>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  <Clock color={isUrgent ? "#ef4444" : (isDark ? "#a1a1aa" : "#71717a")} size={12} />
                  <Text className={cn("text-[11px] font-bold", isUrgent ? "text-red-500" : "text-zinc-500")}>
                    Hace {order.minutesAgo} min ({order.time})
                  </Text>
                </View>
              </View>
            </View>

            {isUrgent && (
              <Animated.View style={{ opacity: opacityAnim }} className="bg-red-500 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                <AlertCircle color="white" size={12} strokeWidth={3} />
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Urgente</Text>
              </Animated.View>
            )}
          </CardHeader>

          <View className={cn("px-4 py-2 border-b flex-row items-center gap-2", isDark ? "border-[#2A2A2A] bg-black/20" : "border-zinc-100 bg-zinc-50/50")}>
            <User color={isDark ? "#71717a" : "#a1a1aa"} size={14} />
            <Text className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-zinc-400" : "text-zinc-500")}>Mesero: {order.waiterName}</Text>
          </View>

          <CardContent className="p-4 flex-1 space-y-3">
            {order.items.map((item, i) => {
              const isCompleted = item.status === 'Completed';
              return (
                <View key={i} className={cn(
                  "p-3 rounded-[16px] flex-row items-center justify-between gap-3 transition-colors border",
                  isCompleted
                    ? (isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200")
                    : (isDark ? "bg-[#2A2A2A] border-[#3f3f46]" : "bg-white shadow-sm border-zinc-200")
                )}>
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      isCompleted ? "bg-emerald-500/20" : (isDark ? "bg-black/40" : "bg-zinc-100")
                    )}>
                      <Text className={cn("text-xs font-bold", isCompleted ? "text-emerald-500" : (isDark ? "text-zinc-300" : "text-zinc-700"))}>
                        {item.qty}x
                      </Text>
                    </View>
                    <Text className={cn(
                      "font-bold text-base flex-1",
                      isCompleted
                        ? "text-emerald-600 dark:text-emerald-500 line-through decoration-emerald-500/50"
                        : (isDark ? "text-zinc-200" : "text-zinc-800")
                    )}>
                      {item.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => onCompleteItem(order.id, item.name)}
                    className={cn(
                      "w-12 h-12 rounded-xl items-center justify-center border",
                      isCompleted ? "bg-emerald-500 border-emerald-500" : (isDark ? "bg-[#1E1E1E] border-[#3f3f46]" : "bg-zinc-50 border-zinc-300")
                    )}
                  >
                    <CheckCircle2 color={isCompleted ? "white" : (isDark ? "#52525b" : "#d4d4d8")} size={24} />
                  </TouchableOpacity>
                </View>
              );
            })}

            <View className="pt-4 mt-auto">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onCompleteOrder(order.id)}
                style={{ backgroundColor: isFullyCompleted ? '#10b981' : primaryColor }}
                className="w-full rounded-2xl h-14 flex-row justify-center items-center shadow-lg active:scale-95 transition-transform"
              >
                {isFullyCompleted ? <CheckCircle2 color="white" size={20} className="mr-2" /> : null}
                <Text className="text-white font-bold tracking-wide text-base">
                  {isFullyCompleted ? "Despachar Orden" : "Marcar todo como Listo"}
                </Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export function ChefKDS() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  const fetchKDSData = async () => {
    try {
      const pedidosData = await api.pedidos.getCocina();

      const mappedOrders: KDSOrder[] = pedidosData.map((p: any) => {
        const fecha = new Date(p.fecha_creacion || Date.now());
        const diffMins = Math.floor((Date.now() - fecha.getTime()) / 60000);

        return {
          id: p._id,
          table: p.numero_mesa?.toString() || p.id_mesa?.numero_mesa?.toString() || '?',
          waiterName: p.nombre_mesero || 'Mesero Desconocido',
          time: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          minutesAgo: diffMins,
          items: (p.productos || []).map((prod: any) => ({
            id_producto: prod.id_producto,
            name: prod.nombre || `Platillo #${prod.id_producto?.slice(-4)}`,
            qty: prod.cantidad,
            status: 'Preparing',
            mods: ''
          })),
          urgency: diffMins >= 10 ? 'high' : 'normal'
        };
      });

      setOrders(currentOrders => {
        return mappedOrders.map(newOrder => {
          const oldOrder = currentOrders.find(o => o.id === newOrder.id);
          if (oldOrder) {
            newOrder.items = newOrder.items.map(newItem => {
              const oldItem = oldOrder.items.find(i => i.name === newItem.name);
              return oldItem ? { ...newItem, status: oldItem.status } : newItem;
            });
          }
          return newOrder;
        });
      });

    } catch (error) {
      console.error("Error cargando KDS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKDSData();
    const interval = setInterval(() => {
      fetchKDSData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const completeItem = (orderId: string, itemName: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          items: o.items.map(i => i.name === itemName ? { ...i, status: i.status === 'Completed' ? 'Preparing' : 'Completed' } : i)
        };
      }
      return o;
    }));
  };

  const completeOrder = async (orderId: string) => {
    try {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      await api.pedidos.updateEstado(orderId, 'LISTO');
      toast({ title: "¡Orden Lista!", description: "La orden ha sido despachada." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el estado de la orden.", variant: "destructive" });
      fetchKDSData();
    }
  };

  const pendingOrders = orders.length;
  const urgentOrders = orders.filter(o => o.urgency === 'high').length;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 140 : 120 }}
      >
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 px-2">
            <View className="flex-row items-center gap-4">
              <View>
                <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  Pantalla de Cocina
                </Text>
                <Text className="text-zinc-500">Recibiendo órdenes en tiempo real. (Auto-recarga 5s).</Text>
              </View>
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
            </View>

            <View className={cn(
              "flex-row items-center p-4 rounded-2xl shadow-sm w-full md:w-auto justify-around md:justify-start gap-8 border",
              isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-white border-zinc-200"
            )}>
              <View className="items-center">
                <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Pendientes</Text>
                <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  {pendingOrders}
                </Text>
              </View>
              <View className="w-px h-10 bg-zinc-500/20" />
              <View className="items-center">
                <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Urgentes</Text>
                <Text className={cn("text-3xl font-headline font-bold", urgentOrders > 0 ? "text-red-500" : (isDark ? "text-zinc-700" : "text-zinc-300"))}>
                  {urgentOrders}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row flex-wrap -mx-2">
            {orders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
                onCompleteItem={completeItem}
                onCompleteOrder={completeOrder}
              />
            ))}

            {!isLoading && orders.length === 0 && (
              <View className="w-full py-32 items-center justify-center">
                <View className="mb-4 opacity-50">
                  <UtensilsCrossed color={primaryColor} size={64} />
                </View>
                <Text className={cn("text-2xl font-headline font-bold mb-2", isDark ? "text-white" : "text-zinc-900")}>¡Todo listo!</Text>
                <Text className="text-zinc-500">No hay órdenes pendientes en este momento.</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}