'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Receipt, CircleDollarSign } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { api } from '@/lib/api'; // API Real

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface OrderData {
  id: string;
  table: number | string;
  total: number;
  items: number;
  status: 'Preparing' | 'Ready';
  time: string;
  priority: 'high' | 'normal';
  rawProducts: any[]; // Necesario para enviar el ticket al backend
}

interface OrderCardProps {
  order: OrderData;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onPrint: (id: string) => void;
  onPay: (order: OrderData) => void;
  isProcessing: boolean;
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES (SRP & Interacciones)
// ==========================================

const OrderCard = ({ order, isDark, primaryColor, widthStyle, onPrint, onPay, isProcessing }: OrderCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isReady = order.status === 'Ready';

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        disabled={isProcessing}
      >
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-300 rounded-[24px]",
            isDark ? "bg-zinc-900/40" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm",
            isProcessing ? "opacity-50" : ""
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
                  #{order.id.slice(-4)}
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
              label={isReady ? 'LISTO' : 'COCINANDO'}
            />
          </CardHeader>

          {/* CUERPO DE LA TARJETA */}
          <CardContent className="p-5 space-y-6">
            <View className="flex-row justify-between items-center mb-2">
              <View className="space-y-1">
                <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total</Text>
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
                disabled={isProcessing}
                className={cn(
                  "flex-1 flex-row rounded-xl gap-2 h-12 border items-center justify-center transition-colors",
                  isDark ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                )}
              >
                <Receipt color={isDark ? "#d4d4d8" : "#52525b"} size={18} />
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-600")}>Ticket</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPay(order)}
                disabled={isProcessing || !isReady}
                style={{ backgroundColor: !isReady ? 'gray' : primaryColor }}
                className="flex-1 flex-row rounded-xl gap-2 h-12 items-center justify-center shadow-lg"
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <CircleDollarSign color="white" size={18} />
                    <Text className="text-white text-xs font-bold tracking-wide">Cobrar</Text>
                  </>
                )}
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

export function WaiterOrders() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();
  const { user } = useAuth(); // Para mandar el nombre del mesero en la venta

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Responsividad exacta calculada por React Native
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // Cargar órdenes desde MongoDB
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.pedidos.getActivos();

      const mappedOrders: OrderData[] = data.map((p: any) => {
        // Calcular totales basados en el arreglo de productos
        const totalItems = p.productos?.reduce((sum: number, prod: any) => sum + prod.cantidad, 0) || 0;
        const totalPrice = p.productos?.reduce((sum: number, prod: any) => sum + (prod.cantidad * prod.precio_unitario), 0) || 0;

        // Tiempo transcurrido
        const fecha = new Date(p.fecha_creacion || Date.now());
        const diffMins = Math.floor((Date.now() - fecha.getTime()) / 60000);

        return {
          id: p._id,
          table: p.id_mesa?.numero_mesa || '?',
          total: totalPrice,
          items: totalItems,
          status: p.estado === 'LISTO' ? 'Ready' : 'Preparing',
          time: diffMins > 0 ? `${diffMins}m ago` : 'Just now',
          priority: diffMins > 20 ? 'high' : 'normal',
          rawProducts: p.productos // Los guardamos para enviarlos al ticket final
        };
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      toast({ title: "Error", description: "No se pudieron cargar las órdenes.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refrescar cada 15 segundos para ver si la cocina marcó como "LISTO"
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  // Lógica de Cobro
  const handlePayOrder = async (order: OrderData) => {
    // Validamos en Web/Móvil si está seguro de cobrar
    if (Platform.OS === 'web') {
      if (!window.confirm(`¿Confirmar cobro de $${order.total.toFixed(2)} por la Mesa ${order.table}?`)) return;
    } else {
      Alert.alert(
        "Confirmar Pago",
        `¿Cobrar $${order.total.toFixed(2)} por la Mesa ${order.table}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cobrar", onPress: () => processPayment(order) }
        ]
      );
      return; // Detenemos aquí para que la alerta maneje la confirmación en móvil
    }

    processPayment(order);
  };

  const processPayment = async (order: OrderData) => {
    try {
      setProcessingId(order.id);

      // Armamos el payload exacto que pide tu backend (POST /ventas)
      const payload = {
        id_pedido: order.id,
        numero_mesa: order.table,
        nombre_mesa: `Mesa ${order.table}`,
        nombre_mesero: user?.name || 'Mesero',
        monto_pagado: order.total,
        tipo_pago: 'EFECTIVO', // Por ahora lo dejamos por defecto
        productos_cobrados: order.rawProducts,
        division: false // Indicamos que no hay cuentas divididas para que se cierre la mesa
      };

      await api.ventas.crear(payload);

      toast({ title: "¡Cobro exitoso!", description: "El ticket se ha generado y la mesa está libre." });
      fetchOrders(); // Recargamos para quitar la orden de la lista
    } catch (error) {
      console.error("Error al cobrar:", error);
      toast({ title: "Error al cobrar", description: "Hubo un problema de conexión.", variant: "destructive" });
    } finally {
      setProcessingId(null);
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

          {/* ENCABEZADO Y TABS */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View className="flex-row items-center gap-4">
              <View>
                <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  Active Orders
                </Text>
                <Text className="text-zinc-500">Supervisa las órdenes en preparación y procesa cobros.</Text>
              </View>
              {isLoading && <ActivityIndicator color={primaryColor} />}
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
                <Text className={cn("font-bold", activeTab === 'active' ? (isDark ? "text-white" : "text-zinc-900") : "text-zinc-500")}>
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
                <Text className={cn("font-bold", activeTab === 'completed' ? (isDark ? "text-white" : "text-zinc-900") : "text-zinc-500")}>
                  History
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GRID DE ÓRDENES */}
          <View className="flex-row flex-wrap -mx-2">
            {!isLoading && orders.length === 0 && (
              <View className="w-full py-20 items-center justify-center">
                <Text className="text-zinc-500 font-medium text-lg">No hay órdenes activas en este momento.</Text>
              </View>
            )}

            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
                isProcessing={processingId === order.id}
                onPrint={(id) => toast({ title: "Ticket Impreso", description: "Enviado a la impresora térmica." })}
                onPay={handlePayOrder}
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}