'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, TouchableOpacity, ActivityIndicator, Modal, StyleProp, ViewStyle, Alert } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Receipt, Printer, X, MapPin, User, CheckCircle2 } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================
interface OrderItem {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface OrderData {
  _id: string;
  fecha_creacion: string;
  estado: 'EN_COCINA' | 'LISTO' | 'PAGADO';
  total: number;
  nombre_mesero: string;
  productos: OrderItem[];
  numero_mesa?: number;
  nombre_mesa?: string;
  ubicacion_mesa?: string;
  id_mesa?: any; // Depende de cómo venga el populate de tu Mongo
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. COMPONENTE TICKET (RECIBO)
// ==========================================
const TicketModal = ({ order, visible, onClose, primaryColor }: { order: OrderData | null, visible: boolean, onClose: () => void, primaryColor: string }) => {
  if (!order) return null;

  const handlePrint = () => {
    if (Platform.OS === 'web') {
      window.print();
    } else {
      // Aquí a futuro integrarás expo-print
      alert("Impresión iniciada...");
    }
  };

  const fecha = new Date(order.fecha_creacion);
  const totalItems = order.productos.reduce((acc, item) => acc + item.cantidad, 0);

  // Intentamos extraer la información de la mesa (ya sea directa o poblada por Mongo)
  const numMesa = order.numero_mesa || order.id_mesa?.numero_mesa || 'N/A';
  const nomMesa = order.nombre_mesa || order.id_mesa?.nombre || '';
  const zonaMesa = order.ubicacion_mesa || order.id_mesa?.ubicacion || 'General';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        {/* Usamos un fondo blanco siempre para simular papel térmico de ticket */}
        <View className="w-full max-w-sm bg-white rounded-t-[24px] rounded-b-[8px] overflow-hidden shadow-2xl">

          {/* BOTON CERRAR Y TITULO */}
          <View className="p-4 flex-row justify-between items-center border-b border-zinc-200 bg-zinc-50">
            <Text className="font-bold text-zinc-800 text-lg">Ticket de Compra</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-zinc-200 rounded-full">
              <X color="#52525b" size={20} />
            </TouchableOpacity>
          </View>

          {/* CUERPO DEL TICKET */}
          <ScrollView className="max-h-[60vh] p-6">
            <View className="items-center mb-6">
              <Text className="text-2xl font-headline font-bold text-black mb-1">MENU MASTER</Text>
              <Text className="text-zinc-500 text-xs">Ticket #{order._id.slice(-6).toUpperCase()}</Text>
            </View>

            <View className="space-y-1.5 mb-6 border-b border-zinc-200 pb-4">
              <Text className="text-sm font-medium text-zinc-700">Fecha: {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}</Text>
              <Text className="text-sm font-medium text-zinc-700">Le atendió: <Text className="font-bold">{order.nombre_mesero}</Text></Text>
              <View className="flex-row flex-wrap mt-1">
                <Text className="text-sm font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">
                  Mesa {numMesa} {nomMesa ? `- ${nomMesa}` : ''}
                </Text>
                <Text className="text-xs text-zinc-500 ml-2 mt-1 px-1">📍 {zonaMesa}</Text>
              </View>
            </View>

            {/* LISTA DE ITEMS */}
            <View className="border-b border-dashed border-zinc-300 pb-4 mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs font-bold text-zinc-500 w-8">CANT</Text>
                <Text className="text-xs font-bold text-zinc-500 flex-1">DESCRIPCIÓN</Text>
                <Text className="text-xs font-bold text-zinc-500 text-right">IMPORTE</Text>
              </View>

              {order.productos.map((item, idx) => (
                <View key={idx} className="flex-row justify-between mb-2 items-start">
                  <Text className="text-sm font-bold text-zinc-800 w-8">{item.cantidad}</Text>
                  <Text className="text-sm font-medium text-zinc-700 flex-1 pr-2">{item.nombre}</Text>
                  <Text className="text-sm font-mono font-bold text-zinc-800">${item.subtotal.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-zinc-500">Total de Artículos:</Text>
              <Text className="font-bold text-zinc-800">{totalItems}</Text>
            </View>
            <View className="flex-row justify-between items-end mt-4">
              <Text className="text-2xl font-bold text-black">TOTAL</Text>
              <Text className="text-3xl font-mono font-bold text-black">${order.total.toFixed(2)}</Text>
            </View>

            <Text className="text-center text-zinc-400 text-xs mt-8 mb-4">¡Gracias por su preferencia!</Text>
          </ScrollView>

          {/* BOTÓN IMPRIMIR */}
          <View className="p-4 bg-zinc-50 border-t border-zinc-200">
            <TouchableOpacity
              onPress={handlePrint}
              style={{ backgroundColor: primaryColor }}
              className="w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg active:scale-95 transition-transform"
            >
              <Printer color="white" size={20} className="mr-2" />
              <Text className="text-white font-bold text-lg">Imprimir Ticket</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (Layout)
// ==========================================
export function WaiterOrders() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'Ongoing' | 'History'>('Ongoing');

  // Estado para el modal del ticket
  const [selectedTicket, setSelectedTicket] = useState<OrderData | null>(null);

  const fetchOrders = async () => {
    try {
      // Usamos el endpoint general. MongoDB debe retornar todos los pedidos de hoy
      const response = await fetch('https://menu-master-api.onrender.com/pedidos');
      const data = await response.json();

      // Ordenamos para que los más recientes salgan primero
      const sorted = data.sort((a: any, b: any) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
      setOrders(sorted);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-recarga cada 5 segundos para ver cuando la cocina marca como LISTO
    const interval = setInterval(() => { fetchOrders(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCobrar = async (order: OrderData) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Confirmas el cobro de $${order.total.toFixed(2)} y la liberación de la mesa?`)) {
        procesarCobro(order);
      }
    } else {
      Alert.alert(
        "Procesar Cobro",
        `¿Confirmas el cobro de $${order.total.toFixed(2)}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cobrar", style: "default", onPress: () => procesarCobro(order) }
        ]
      );
    }
  };

  const procesarCobro = async (order: OrderData) => {
    try {
      // 1. Cambiar estado de la orden a PAGADO
      await fetch(`https://menu-master-api.onrender.com/pedidos/${order._id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'PAGADO' })
      });

      // 2. Liberar la mesa física
      const idMesaReal = order.id_mesa?._id || order.id_mesa;
      if (idMesaReal) {
        await fetch(`https://menu-master-api.onrender.com/mesas/${idMesaReal}/estado`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'LIBRE', mesero_nombre: '' })
        });
      }

      toast({ title: "Pago Registrado", description: "La orden se ha cobrado y la mesa está libre." });
      fetchOrders(); // Recargar la vista
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar el cobro.", variant: "destructive" });
    }
  };

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // Filtrado de Pestañas
  const displayedOrders = orders.filter(o => {
    if (filter === 'Ongoing') return o.estado === 'EN_COCINA' || o.estado === 'LISTO';
    return o.estado === 'PAGADO';
  });

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER Y TABS */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 px-2">
            <View className="flex-row items-center gap-4">
              <View>
                <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  Órdenes Activas
                </Text>
                <Text className="text-zinc-500">Supervisa las órdenes en preparación y procesa cobros.</Text>
              </View>
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
            </View>

            {/* Pestañas (Ongoing / History) */}
            <View className={cn("flex-row p-1 rounded-xl", isDark ? "bg-zinc-900" : "bg-zinc-200/50")}>
              <TouchableOpacity
                onPress={() => setFilter('Ongoing')}
                className={cn("px-6 py-2.5 rounded-lg transition-all", filter === 'Ongoing' ? (isDark ? "bg-[#2A2A2A] shadow-sm" : "bg-white shadow-sm") : "")}
              >
                <Text className={cn("font-bold text-sm", filter === 'Ongoing' ? (isDark ? "text-white" : "text-zinc-900") : "text-zinc-500")}>
                  Activas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilter('History')}
                className={cn("px-6 py-2.5 rounded-lg transition-all", filter === 'History' ? (isDark ? "bg-[#2A2A2A] shadow-sm" : "bg-white shadow-sm") : "")}
              >
                <Text className={cn("font-bold text-sm", filter === 'History' ? (isDark ? "text-white" : "text-zinc-900") : "text-zinc-500")}>
                  Historial
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GRID DE TARJETAS DE ORDEN */}
          <View className="flex-row flex-wrap -mx-2">
            {!isLoading && displayedOrders.length === 0 && (
              <View className="w-full py-20 items-center justify-center opacity-50">
                <Receipt color={isDark ? "white" : "black"} size={64} className="mb-4" />
                <Text className={cn("text-xl font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>
                  {filter === 'Ongoing' ? 'No hay órdenes activas' : 'El historial está vacío'}
                </Text>
              </View>
            )}

            {displayedOrders.map((order) => {
              const isReady = order.estado === 'LISTO';
              const isCooking = order.estado === 'EN_COCINA';
              const isPaid = order.estado === 'PAGADO';

              const fecha = new Date(order.fecha_creacion);
              const diffMins = Math.floor((Date.now() - fecha.getTime()) / 60000);
              const itemsCount = order.productos.reduce((acc, i) => acc + i.cantidad, 0);

              const numMesa = order.numero_mesa || order.id_mesa?.numero_mesa || '?';

              return (
                <View key={order._id} style={getCardWidth()} className="p-2 mb-2">
                  <Card className={cn(
                    "border-none rounded-[24px] flex flex-col transition-all",
                    isDark ? "bg-[#1E1E1E]" : "bg-white shadow-md"
                  )}>

                    {/* CABECERA TARJETA */}
                    <View className={cn("p-5 flex-row justify-between items-start border-b", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
                      <View className="flex-row items-center gap-4">
                        <View className={cn("w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm", isDark ? "bg-black/40" : "bg-zinc-100")}>
                          <Text style={{ color: primaryColor }} className="font-headline font-bold text-lg">T{numMesa}</Text>
                        </View>
                        <View>
                          <Text className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>#{order._id.slice(-4).toUpperCase()}</Text>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Clock color={isDark ? "#71717a" : "#a1a1aa"} size={12} />
                            <Text className={cn("text-[11px] font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>
                              {filter === 'Ongoing' ? `Hace ${diffMins} min` : fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* BADGE DE ESTADO */}
                      <View className={cn(
                        "px-3 py-1 rounded-full border",
                        isReady && "border-emerald-500/30 bg-emerald-500/10",
                        isCooking && "border-amber-500/30 bg-amber-500/10",
                        isPaid && "border-zinc-500/30 bg-zinc-500/10"
                      )}>
                        <Text className={cn("text-[10px] font-bold tracking-widest",
                          isReady && "text-emerald-500",
                          isCooking && "text-amber-500",
                          isPaid && "text-zinc-500"
                        )}>
                          {order.estado}
                        </Text>
                      </View>
                    </View>

                    {/* CUERPO CENTRAL (TOTALES) */}
                    <View className="p-5 flex-row justify-between items-center">
                      <View>
                        <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total</Text>
                        <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-black")}>
                          ${order.total.toFixed(2)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Items</Text>
                        <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>
                          {itemsCount}
                        </Text>
                      </View>
                    </View>

                    {/* BOTONES DE ACCIÓN INFERIORES */}
                    <View className="p-4 pt-0 flex-row gap-3">
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedTicket(order)}
                        className={cn("flex-1 py-3.5 rounded-xl border flex-row items-center justify-center gap-2 active:scale-95 transition-transform",
                          isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-300 bg-white"
                        )}
                      >
                        <Receipt color={isDark ? "white" : "black"} size={16} />
                        <Text className={cn("font-bold text-sm", isDark ? "text-white" : "text-black")}>Ticket</Text>
                      </TouchableOpacity>

                      {filter === 'Ongoing' && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          disabled={!isReady}
                          onPress={() => handleCobrar(order)}
                          style={{ backgroundColor: isReady ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7') }}
                          className="flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
                        >
                          <Text className={cn("font-bold text-sm", isReady ? "text-white" : "text-zinc-400")}>Cobrar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* MODAL DEL RECIBO */}
      <TicketModal
        order={selectedTicket}
        visible={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        primaryColor={primaryColor}
      />

    </View>
  );
}