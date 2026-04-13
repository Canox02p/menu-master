'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api'; // API real

// ==========================================
// 1. INTERFACES (Tipado Estricto)
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
  table: string; // Mongo devuelve ID o string
  time: string;
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
// 2. SUBCOMPONENTES (SRP & Interacciones)
// ==========================================

const OrderTicket = ({ order, isDark, primaryColor, widthStyle, onCompleteItem, onCompleteOrder }: OrderTicketProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUrgent = order.urgency === 'high';

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
            "border-none overflow-hidden transition-all duration-300 rounded-[24px] flex-1 flex flex-col",
            isDark ? "bg-zinc-900/40" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm",
            isUrgent && (isDark ? "bg-red-950/20" : "bg-red-50/50")
          )}
          style={{
            borderWidth: isUrgent ? 2 : 1.5,
            borderColor: isUrgent ? '#ef4444' : (isHovered ? primaryColor : 'transparent'),
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          {/* CABECERA DEL TICKET */}
          <CardHeader className={cn(
            "flex flex-row items-center justify-between py-4 border-b",
            isUrgent ? (isDark ? "bg-red-500/20 border-red-500/30" : "bg-red-500/10 border-red-200") :
              (isDark ? "bg-zinc-800/40 border-zinc-800" : "bg-zinc-50 border-zinc-100")
          )}>
            <View className="flex-row items-center gap-3">
              <View
                className={cn(
                  "w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm px-1",
                  isUrgent ? "bg-red-500" : (isDark ? "bg-zinc-800" : "bg-white")
                )}
                style={!isUrgent ? { backgroundColor: `${primaryColor}15` } : {}}
              >
                <Text
                  style={!isUrgent ? { color: primaryColor } : { color: 'white' }}
                  className="font-headline font-bold text-xs text-center"
                  numberOfLines={2}
                >
                  T{order.table}
                </Text>
              </View>
              <View>
                <CardTitle className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  #{order.id.slice(-4)}
                </CardTitle>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  {/* LIMPIEZA NATIVEWIND */}
                  <Clock color={isUrgent ? "#ef4444" : (isDark ? "#a1a1aa" : "#71717a")} size={12} />
                  <Text className={cn("text-[11px] font-bold", isUrgent ? "text-red-500" : "text-zinc-500")}>
                    {order.time}
                  </Text>
                </View>
              </View>
            </View>
            {isUrgent && (
              <View className="bg-red-500 px-3 py-1 rounded-full animate-pulse">
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Urgent</Text>
              </View>
            )}
          </CardHeader>

          {/* LISTA DE PLATILLOS */}
          <CardContent className="p-4 flex-1 space-y-3">
            {order.items.map((item, i) => {
              const isCompleted = item.status === 'Completed';
              return (
                <View key={i} className={cn(
                  "p-3 rounded-[16px] flex-row items-start justify-between gap-3 transition-colors",
                  isCompleted
                    ? (isDark ? "bg-emerald-500/10" : "bg-emerald-50")
                    : (isDark ? "bg-zinc-800/50 border border-zinc-700/50" : "bg-white shadow-sm border border-zinc-100")
                )}>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2.5 mb-1">
                      <View className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center",
                        isCompleted ? "bg-emerald-500/20" : "bg-zinc-200 dark:bg-zinc-700"
                      )}>
                        <Text className={cn("text-[11px] font-bold", isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300")}>
                          {item.qty}x
                        </Text>
                      </View>
                      <Text className={cn(
                        "font-bold text-sm flex-1",
                        isCompleted
                          ? "text-emerald-600 dark:text-emerald-500 line-through decoration-emerald-500/50"
                          : (isDark ? "text-zinc-200" : "text-zinc-800")
                      )}>
                        {item.name}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => onCompleteItem(order.id, item.name)}
                    disabled={isCompleted}
                    className={cn(
                      "w-11 h-11 rounded-xl items-center justify-center",
                      isCompleted ? "bg-emerald-500" : (isDark ? "bg-zinc-700" : "bg-zinc-100")
                    )}
                  >
                    {/* LIMPIEZA NATIVEWIND */}
                    <CheckCircle2 color={isCompleted ? "white" : (isDark ? "#52525b" : "#d4d4d8")} size={22} />
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* BOTÓN DESPACHAR ORDEN COMPLETA */}
            <View className="pt-4 mt-auto">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onCompleteOrder(order.id)}
                style={{ backgroundColor: primaryColor }}
                className="w-full rounded-[16px] h-12 flex-row justify-center items-center shadow-lg shadow-primary/30"
              >
                <Text className="text-white font-bold tracking-wide">Ready for Service</Text>
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

  // Responsividad exacta
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // Cargar órdenes y resolver nombres con MySQL
  const fetchKDSData = async () => {
    try {
      // 1. Obtener el diccionario de productos
      const productosData = await api.productos.getAll();
      const productDict: Record<string, string> = {};
      productosData.forEach((p: any) => {
        const id = p.id_producto?.toString() || p.id?.toString();
        productDict[id] = p.nombre;
      });

      // 2. Obtener pedidos de Mongo
      const pedidosData = await api.pedidos.getCocina();

      // 3. Mapear y combinar
      const mappedOrders: KDSOrder[] = pedidosData.map((p: any) => {
        const fecha = new Date(p.fecha_creacion || Date.now());
        const diffMins = Math.floor((Date.now() - fecha.getTime()) / 60000);

        return {
          id: p._id,
          table: p.id_mesa?.numero_mesa?.toString() || p.id_mesa?.toString().slice(-4) || '?',
          time: diffMins > 0 ? `${diffMins}m ago` : 'Just now',
          items: (p.productos || []).map((prod: any) => ({
            id_producto: prod.id_producto,
            name: productDict[prod.id_producto] || `Platillo #${prod.id_producto?.slice(-4)}`,
            qty: prod.cantidad,
            status: 'Preparing',
            mods: ''
          })),
          urgency: diffMins >= 15 ? 'high' : 'normal' // Si pasan de 15 mins se pone rojo
        };
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error cargando KDS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKDSData();
    // Auto-recarga cada 10 segundos (Polling)
    const interval = setInterval(fetchKDSData, 10000);
    return () => clearInterval(interval);
  }, []);

  const completeItem = (orderId: string, itemName: string) => {
    // Estado puramente visual para que el chef tache cosas
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, items: o.items.map(i => i.name === itemName ? { ...i, status: 'Completed' } : i) };
      }
      return o;
    }));
  };

  const completeOrder = async (orderId: string) => {
    try {
      // Optimistic UI: lo quitamos de la pantalla antes de la respuesta
      setOrders(prev => prev.filter(o => o.id !== orderId));

      // Enviamos actualización a MongoDB (Cambia estado a LISTO y crea Notificación)
      await api.pedidos.updateEstado(orderId, 'LISTO');

      toast({ title: "¡Orden Lista!", description: "Se ha notificado al mesero." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el estado.", variant: "destructive" });
      fetchKDSData(); // Revertimos si falla
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 140 : 120 }}
      >
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER DEL KDS */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 px-2">
            <View className="flex-row items-center gap-4">
              <View>
                <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  Kitchen Display
                </Text>
                <Text className="text-zinc-500">Monitor en tiempo real de MongoDB.</Text>
              </View>
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
            </View>

            {/* ESTADÍSTICAS RÁPIDAS */}
            <View className={cn(
              "flex-row items-center p-4 rounded-[20px] shadow-sm w-full md:w-auto justify-around md:justify-start gap-6",
              isDark ? "bg-zinc-900/80" : "bg-white"
            )}>
              <View className="items-center">
                <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Pending</Text>
                <Text className={cn("text-2xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  {orders.length}
                </Text>
              </View>
            </View>
          </View>

          {/* GRID DE TICKETS */}
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

            {/* MENSAJE SI NO HAY ÓRDENES */}
            {!isLoading && orders.length === 0 && (
              <View className="w-full py-20 items-center justify-center">
                {/* LIMPIEZA NATIVEWIND: Se movieron las clases al contenedor View */}
                <View className="mb-4 opacity-50">
                  <CheckCircle2 color={primaryColor} size={64} />
                </View>
                <Text className={cn("text-2xl font-headline font-bold mb-2", isDark ? "text-white" : "text-zinc-900")}>All caught up!</Text>
                <Text className="text-zinc-500">The kitchen is clear. Great job team.</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}