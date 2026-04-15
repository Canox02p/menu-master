'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, DimensionValue } from 'react-native';
import { Card } from '@/components/ui/card';
import { Clock, Receipt, Printer, X, MapPin, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

// ==========================================
// 1. INTERFACES
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
  estado: string;
  total: number;
  nombre_mesero: string;
  productos: OrderItem[];
  numero_mesa?: number;
  nombre_mesa?: string;
  ubicacion_mesa?: string;
  id_mesa?: any;
  originalIds?: string[]; // NUEVO: Para guardar los IDs de todas las sub-órdenes agrupadas
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. COMPONENTE TICKET (Intacto)
// ==========================================
const TicketOverlay = ({ order, visible, onClose, primaryColor, isDark }: { order: OrderData | null, visible: boolean, onClose: () => void, primaryColor: string, isDark: boolean }) => {
  if (!order || !visible) return null;

  const handlePrint = () => {
    if (Platform.OS === 'web') {
      window.print();
    } else {
      Alert.alert("Impresión", "Iniciando impresión del ticket...");
    }
  };

  let fecha = new Date();
  try { if (order.fecha_creacion) fecha = new Date(order.fecha_creacion); } catch (e) { }

  const safeProductos = Array.isArray(order.productos) ? order.productos : [];
  const totalItems = safeProductos.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);

  const numMesa = order.numero_mesa || order.id_mesa?.numero_mesa || '?';
  const nomMesa = order.nombre_mesa || order.id_mesa?.nombre || '';
  const zonaMesa = order.ubicacion_mesa || order.id_mesa?.ubicacion || 'General';

  return (
    <SafeAreaView className="absolute z-[200] top-0 bottom-0 left-0 right-0 bg-black/60 items-center justify-center p-4">
      <View className="w-full max-w-sm bg-white rounded-t-[24px] rounded-b-[8px] overflow-hidden shadow-2xl flex-col max-h-[90%]">

        <View className="p-4 flex-row justify-between items-center border-b border-zinc-200 bg-zinc-50">
          <Text className="font-bold text-zinc-800 text-lg">Ticket de Compra</Text>
          <TouchableOpacity onPress={onClose} className="p-2 bg-zinc-200 rounded-full active:scale-95 transition-transform">
            <X color="#52525b" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="p-6 flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Text className="text-2xl font-headline font-bold text-black mb-1">MENU MASTER</Text>
            <Text className="text-zinc-500 text-xs">Ticket #{String(order._id || '0000').slice(-6).toUpperCase()}</Text>
          </View>

          <View className="space-y-1.5 mb-6 border-b border-zinc-200 pb-4">
            <Text className="text-sm font-medium text-zinc-700">Fecha: <Text className="font-bold">{!isNaN(fecha.getTime()) ? fecha.toLocaleDateString() : '--/--/----'}</Text></Text>
            <Text className="text-sm font-medium text-zinc-700">Hora: <Text className="font-bold">{!isNaN(fecha.getTime()) ? fecha.toLocaleTimeString() : '--:--'}</Text></Text>
            <Text className="text-sm font-medium text-zinc-700">Le atendió: <Text className="font-bold uppercase">{order.nombre_mesero || 'Mesero'}</Text></Text>
            <View className="flex-row flex-wrap mt-2 items-center gap-2">
              <View className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                <Text className="text-sm font-bold text-zinc-800">
                  Mesa {numMesa} {nomMesa ? `- ${nomMesa}` : ''}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MapPin color="#71717a" size={14} />
                <Text className="text-xs font-bold text-zinc-500">{zonaMesa}</Text>
              </View>
            </View>
          </View>

          <View className="border-b border-dashed border-zinc-300 pb-4 mb-4">
            <View className="flex-row justify-between mb-3">
              <Text className="text-[10px] font-bold text-zinc-500 w-8">CANT</Text>
              <Text className="text-[10px] font-bold text-zinc-500 flex-1">DESCRIPCIÓN</Text>
              <Text className="text-[10px] font-bold text-zinc-500 text-right">IMPORTE</Text>
            </View>

            {safeProductos.map((item, idx) => (
              <View key={idx} className="flex-row justify-between mb-2 items-start">
                <Text className="text-sm font-bold text-zinc-800 w-8">{item.cantidad || 1}</Text>
                <Text className="text-sm font-medium text-zinc-700 flex-1 pr-2">{item.nombre || 'Item sin nombre'}</Text>
                <Text className="text-sm font-mono font-bold text-zinc-800">
                  ${(Number(item.subtotal) || (Number(item.precio_unitario) * Number(item.cantidad)) || 0).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-zinc-500 font-medium">Total de Artículos:</Text>
            <Text className="font-bold text-zinc-800">{totalItems}</Text>
          </View>
          <View className="flex-row justify-between items-end mt-4">
            <Text className="text-2xl font-bold text-black">TOTAL</Text>
            <Text className="text-3xl font-mono font-bold text-black">${Number(order.total || 0).toFixed(2)}</Text>
          </View>

          <Text className="text-center text-zinc-400 text-xs mt-8 mb-4">¡Gracias por su preferencia!</Text>
        </ScrollView>

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
    </SafeAreaView>
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

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'Ongoing' | 'History'>('Ongoing');

  // Estado para manejar qué tarjetas están expandidas (Menú desplegable)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const [selectedTicket, setSelectedTicket] = useState<OrderData | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://menu-master-api.onrender.com/pedidos');
      const data = await response.json();

      const pedidosArray = Array.isArray(data) ? data : (data.pedidos || data.data || []);

      const mappedOrders: OrderData[] = pedidosArray.map((p: any) => {
        let estadoNormalizado = p.estado ? String(p.estado).toUpperCase().trim().replace(/\s+/g, '_') : 'EN_COCINA';
        if (estadoNormalizado.includes('LISTO')) estadoNormalizado = 'LISTO';
        if (estadoNormalizado.includes('PAGADO')) estadoNormalizado = 'PAGADO';

        return {
          _id: p._id || Math.random().toString(),
          fecha_creacion: p.fecha_creacion || p.createdAt || new Date().toISOString(),
          estado: estadoNormalizado,
          total: Number(p.total) || 0,
          nombre_mesero: p.nombre_mesero || p.mesero_nombre || 'Mesero',
          productos: Array.isArray(p.productos) ? p.productos : [],
          numero_mesa: p.numero_mesa || p.id_mesa?.numero_mesa || 0,
          nombre_mesa: p.nombre_mesa || p.id_mesa?.nombre || '',
          ubicacion_mesa: p.ubicacion_mesa || p.id_mesa?.ubicacion || 'General',
          id_mesa: p.id_mesa,
          originalIds: [p._id] // Guardamos el ID real de la base de datos
        };
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => { fetchOrders(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCobrar = async (order: OrderData) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Confirmas el cobro de $${order.total.toFixed(2)} y la liberación de la mesa?`)) {
        procesarCobro(order);
      }
    } else {
      Alert.alert("Procesar Cobro", `¿Confirmas el cobro de $${order.total.toFixed(2)}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Cobrar", style: "default", onPress: () => procesarCobro(order) }
      ]);
    }
  };

  const procesarCobro = async (order: OrderData) => {
    try {
      // Como pueden ser varias órdenes agrupadas, iteramos sobre los IDs originales
      const idsToPay = order.originalIds || [order._id];

      for (const id of idsToPay) {
        await fetch(`https://menu-master-api.onrender.com/pedidos/${id}/estado`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'PAGADO' })
        });
      }

      // Liberar la mesa
      const idMesaReal = order.id_mesa?._id || order.id_mesa;
      if (idMesaReal && typeof idMesaReal === 'string') {
        await fetch(`https://menu-master-api.onrender.com/mesas/${idMesaReal}/estado`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'LIBRE', mesero_nombre: '' })
        });
      }

      toast({ title: "Pago Registrado", description: "La orden se ha cobrado exitosamente." });
      fetchOrders();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar el cobro.", variant: "destructive" });
    }
  };

  // ==========================================
  // LÓGICA DE AGRUPACIÓN (Consolidar Mesas)
  // ==========================================
  const getConsolidatedOrders = () => {
    // 1. Filtrar por Activos o Historial
    const filtered = orders.filter(o => filter === 'History' ? o.estado === 'PAGADO' : o.estado !== 'PAGADO');

    // Si es historial, no las agrupamos para ver el registro exacto de cada pago
    if (filter === 'History') return filtered;

    // 2. Si son activas, agrupamos por número de mesa
    const groupedMap = new Map<string, OrderData>();

    filtered.forEach(o => {
      const key = o.numero_mesa ? String(o.numero_mesa) : o._id;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          ...o,
          _id: `MESA-${key}`, // Creamos un ID virtual para la tarjeta
          originalIds: [o._id], // Guardamos el ID real
          productos: [...o.productos.map(p => ({ ...p }))] // Clon profundo de productos
        });
      } else {
        const existing = groupedMap.get(key)!;
        existing.originalIds!.push(o._id);
        existing.total += o.total;

        // Si alguna orden está en cocina, toda la mesa sigue en cocina
        if (o.estado === 'EN_COCINA') {
          existing.estado = 'EN_COCINA';
        }

        // Sumar productos repetidos
        o.productos.forEach(prod => {
          const exProd = existing.productos.find(ep => ep.nombre === prod.nombre);
          if (exProd) {
            exProd.cantidad += Number(prod.cantidad);
            exProd.subtotal += Number(prod.subtotal || (prod.cantidad * prod.precio_unitario));
          } else {
            existing.productos.push({ ...prod });
          }
        });
      }
    });

    return Array.from(groupedMap.values());
  };

  const displayedOrders = getConsolidatedOrders();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): { width: DimensionValue } => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

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

            <View className={cn("flex-row p-1.5 rounded-xl border", isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-zinc-100 border-zinc-200")}>
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
              <View className="w-full py-32 items-center justify-center opacity-50">
                <Receipt color={isDark ? "white" : "black"} size={64} className="mb-4" />
                <Text className={cn("text-xl font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>
                  {filter === 'Ongoing' ? 'No hay órdenes activas' : 'El historial está vacío'}
                </Text>
              </View>
            )}

            {displayedOrders.map((order) => {
              const isReady = order.estado === 'LISTO';
              const isCooking = order.estado === 'EN_COCINA' || (!isReady && order.estado !== 'PAGADO');
              const isPaid = order.estado === 'PAGADO';
              const isExpanded = expandedCards[order._id];

              let fecha = new Date();
              try { if (order.fecha_creacion) fecha = new Date(order.fecha_creacion); } catch (e) { }
              const diffMins = Math.floor((Date.now() - fecha.getTime()) / 60000);

              const safeProductos = Array.isArray(order.productos) ? order.productos : [];
              const itemsCount = safeProductos.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0);
              const numMesa = order.numero_mesa || '?';

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
                          <Text className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>
                            {filter === 'Ongoing' ? `Mesa Consolidada` : `#${String(order._id).slice(-4).toUpperCase()}`}
                          </Text>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Clock color={isDark ? "#71717a" : "#a1a1aa"} size={12} />
                            <Text className={cn("text-[11px] font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>
                              {filter === 'Ongoing' ? `Hace ${isNaN(diffMins) ? 0 : diffMins} min` : (isNaN(fecha.getTime()) ? '--:--' : fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* BADGE DE ESTADO */}
                      <View className={cn(
                        "px-3 py-1.5 rounded-full border",
                        isReady && "border-emerald-500/30 bg-emerald-500/10",
                        isCooking && "border-amber-500/30 bg-amber-500/10",
                        isPaid && "border-zinc-500/30 bg-zinc-500/10"
                      )}>
                        <Text className={cn("text-[10px] font-bold tracking-widest uppercase",
                          isReady && "text-emerald-500",
                          isCooking && "text-amber-500",
                          isPaid && "text-zinc-400"
                        )}>
                          {order.estado.replace(/_/g, ' ')}
                        </Text>
                      </View>
                    </View>

                    {/* CUERPO CENTRAL (TOTALES) */}
                    <View className="p-5 flex-row justify-between items-center">
                      <View>
                        <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Cuenta Total</Text>
                        <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-black")}>
                          ${Number(order.total || 0).toFixed(2)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Items</Text>
                        <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>
                          {itemsCount}
                        </Text>
                      </View>
                    </View>

                    {/* NUEVO: MENÚ DESPLEGABLE (ACORDEÓN DE LA CUENTA) */}
                    <View className={cn("px-5 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
                      <TouchableOpacity
                        onPress={() => toggleExpand(order._id)}
                        className="py-4 flex-row justify-between items-center"
                      >
                        <Text className={cn("text-sm font-bold", isDark ? "text-zinc-400" : "text-zinc-600")}>Ver detalle de cuenta</Text>
                        {isExpanded ? <ChevronUp color={isDark ? "#a1a1aa" : "#71717a"} size={18} /> : <ChevronDown color={isDark ? "#a1a1aa" : "#71717a"} size={18} />}
                      </TouchableOpacity>

                      {isExpanded && (
                        <View className="pb-4 space-y-2">
                          {safeProductos.map((item, idx) => (
                            <View key={idx} className="flex-row justify-between items-center">
                              <Text className={cn("text-xs flex-1", isDark ? "text-zinc-300" : "text-zinc-700")} numberOfLines={1}>
                                <Text className="font-bold">{item.cantidad}x</Text> {item.nombre}
                              </Text>
                              <Text className={cn("text-xs font-mono font-bold", isDark ? "text-zinc-400" : "text-zinc-600")}>
                                ${(Number(item.subtotal) || (Number(item.precio_unitario) * Number(item.cantidad)) || 0).toFixed(2)}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* BOTONES DE ACCIÓN INFERIORES */}
                    <View className="p-4 pt-0 flex-row gap-3 mt-2">
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedTicket(order)}
                        className={cn("flex-1 py-3.5 rounded-xl border flex-row items-center justify-center gap-2 active:scale-95 transition-transform",
                          isDark ? "border-[#3f3f46] bg-[#2A2A2A]" : "border-zinc-300 bg-white"
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
                          <Text className={cn("font-bold text-sm", isReady ? "text-white" : "text-zinc-500")}>Cobrar</Text>
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
      <TicketOverlay
        order={selectedTicket}
        visible={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        primaryColor={primaryColor}
        isDark={isDark}
      />

    </View>
  );
}