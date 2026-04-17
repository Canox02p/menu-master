'use client';

import { MesaStatus } from './mesa-status';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, ActivityIndicator, TouchableOpacity, Modal, DimensionValue, Alert, SafeAreaView } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Plus, MapPin, User, ReceiptText, CheckCircle2, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { OrderTaking } from './order-taking';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

// ==========================================
// 1. INTERFACES
// ==========================================
interface TableData {
  _id: string;
  numero_mesa: number;
  nombre?: string;
  ubicacion?: string;
  status: 'Occupied' | 'Available';
  capacity: number;
  mesero_nombre?: string;
}

// Nueva interfaz para agrupar las comandas de una mesa
interface ConsolidatedOrder {
  items: { nombre: string, cantidad: number, precio_unitario: number, subtotal: number }[];
  total: number;
  orderIds: string[]; // Guardamos los IDs de todas las sub-órdenes para marcarlas pagadas
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTE: TARJETA DE MESA
// ==========================================
const TableCard = ({ table, isSelected, onPress, isDark, primaryColor, widthStyle }: { table: TableData, isSelected: boolean, onPress: () => void, isDark: boolean, primaryColor: string, widthStyle: any }) => {
  const isOccupied = table.status === 'Occupied';

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable onPress={onPress}>
        <View
          className={cn(
            "aspect-square rounded-[32px] p-5 transition-all border flex-col justify-between overflow-hidden",
            isOccupied
              ? (isDark ? "bg-[#1E1E1E] border-[#3f3f46] shadow-xl" : "bg-white shadow-lg border-zinc-200")
              : (isDark ? "bg-[#161616] border-dashed border-[#2A2A2A]" : "bg-zinc-50 border-dashed border-zinc-300")
          )}
          style={{
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? primaryColor : (isOccupied ? (isDark ? '#3f3f46' : '#e4e4e7') : undefined),
            transform: [{ scale: isSelected ? 0.98 : 1 }]
          }}
        >
          <View className="flex-row justify-between items-start">
            <Text className={cn("text-4xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
              {table.numero_mesa}
            </Text>
            {isOccupied && (
              <View className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}15` }}>
                <User color={primaryColor} size={18} />
              </View>
            )}
          </View>

          <View>
            {isOccupied && (
              <View className="mb-2">
                <Text className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Atiende:</Text>
                <Text className={cn("text-[11px] font-bold uppercase", isDark ? "text-zinc-300" : "text-zinc-700")} numberOfLines={1}>
                  {table.mesero_nombre || 'Mesero'}
                </Text>
              </View>
            )}

            <View className={cn("flex-row items-center gap-1.5 px-2.5 py-1 rounded-full self-start", isOccupied ? "bg-rose-500/10" : "bg-emerald-500/10")}>
              <View className={cn("w-1.5 h-1.5 rounded-full", isOccupied ? "bg-rose-500" : "bg-emerald-500")} />
              <Text className={cn("text-[10px] font-bold uppercase tracking-widest", isOccupied ? "text-rose-500" : "text-emerald-500")}>
                {isOccupied ? 'Ocupada' : 'Libre'}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
export function WaiterTables() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();
  const { user } = useAuth();

  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  // Modales
  const [showOrderTaking, setShowOrderTaking] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Datos consolidados para cobrar
  const [activeAccount, setActiveAccount] = useState<ConsolidatedOrder | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://menu-master-api.onrender.com/mesas');
      const data = await response.json();

      const mappedTables: TableData[] = data.map((t: any) => ({
        _id: t._id,
        numero_mesa: t.numero_mesa,
        nombre: t.nombre,
        ubicacion: t.ubicacion,
        status: t.estado === 'LIBRE' ? 'Available' : 'Occupied',
        capacity: t.capacidad,
        mesero_nombre: t.mesero_nombre
      }));

      setTables(mappedTables.sort((a, b) => a.numero_mesa - b.numero_mesa));
    } catch (error) {
      toast({ title: "Error", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(() => { fetchTables(); }, 10000); // Recarga automática silenciosa
    return () => clearInterval(interval);
  }, []);

  // Lógica para Consolidar la Cuenta antes de Cobrar
  const openCheckout = async (mesa: TableData) => {
    try {
      setIsLoading(true);
      // 1. Obtenemos todas las órdenes de la API
      const response = await fetch('https://menu-master-api.onrender.com/pedidos');
      let data = await response.json();
      let pedidosArray = Array.isArray(data) ? data : (data.pedidos || data.data || Object.values(data)[0] || []);

      // 2. Filtramos solo las de ESTA mesa que NO estén pagadas
      const comandasMesa = pedidosArray.filter((p: any) => {
        const idMesaStr = p.id_mesa?._id || p.id_mesa;
        const isCorrectMesa = idMesaStr === mesa._id || p.numero_mesa === mesa.numero_mesa;
        const isNotPaid = p.estado !== 'PAGADO' && p.estado !== 'PAID';
        return isCorrectMesa && isNotPaid;
      });

      if (comandasMesa.length === 0) {
        toast({ title: "Sin Cuenta", description: "Esta mesa no tiene órdenes activas por cobrar." });
        setIsLoading(false);
        return;
      }

      // 3. Consolidamos todos los items en una sola lista y sumamos el total
      let grandTotal = 0;
      let orderIds: string[] = [];
      let mergedItems: { [key: string]: { nombre: string, cantidad: number, precio_unitario: number, subtotal: number } } = {};

      comandasMesa.forEach((orden: any) => {
        orderIds.push(orden._id);
        grandTotal += Number(orden.total || 0);

        (orden.productos || []).forEach((prod: any) => {
          if (mergedItems[prod.nombre]) {
            mergedItems[prod.nombre].cantidad += Number(prod.cantidad);
            mergedItems[prod.nombre].subtotal += Number(prod.subtotal) || (Number(prod.cantidad) * Number(prod.precio_unitario));
          } else {
            mergedItems[prod.nombre] = {
              nombre: prod.nombre,
              cantidad: Number(prod.cantidad),
              precio_unitario: Number(prod.precio_unitario),
              subtotal: Number(prod.subtotal) || (Number(prod.cantidad) * Number(prod.precio_unitario))
            };
          }
        });
      });

      setActiveAccount({
        items: Object.values(mergedItems),
        total: grandTotal,
        orderIds: orderIds
      });
      setShowCheckoutModal(true);

    } catch (error) {
      toast({ title: "Error", description: "No se pudo generar la cuenta.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para procesar el pago y liberar mesa
  const processPayment = async () => {
    if (!activeAccount || !selectedTable) return;
    setIsProcessingPayment(true);

    try {
      // 1. Armamos el objeto de Venta con los datos de la cuenta consolidada
      const payloadVenta = {
        id_pedido: activeAccount.orderIds[0], // Usamos el ID principal
        id_mesero: user?.id || '000000000000000000000000', // ID del mesero en sesión
        numero_mesa: selectedTable.numero_mesa,
        nombre_mesa: selectedTable.nombre || `Mesa ${selectedTable.numero_mesa}`,
        nombre_mesero: selectedTable.mesero_nombre || user?.name || 'Mesero',
        metodo_pago: 'EFECTIVO', // *Podrías agregar botones de método de pago en tu modal después
        division: false,
        monto_pagado: activeAccount.total,
        productos_cobrados: activeAccount.items.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio_unitario
        }))
      };

      // 2. Registramos la venta (Esto libera la mesa y paga el pedido automáticamente en MongoDB)
      await fetch('https://menu-master-api.onrender.com/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadVenta)
      });

      // 3. Si agrupaste varias comandas en una sola mesa, pagamos las "extra" manualmente
      if (activeAccount.orderIds.length > 1) {
        for (let i = 1; i < activeAccount.orderIds.length; i++) {
          await fetch(`https://menu-master-api.onrender.com/pedidos/${activeAccount.orderIds[i]}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'PAGADO' })
          });
        }
      }

      toast({ title: "Cuenta Pagada", description: "Venta registrada y mesa liberada exitosamente." });
      setShowCheckoutModal(false);
      setSelectedTable(null);
      setActiveAccount(null);
      fetchTables();
    } catch (error) {
      toast({ title: "Error crítico", description: "Fallo al procesar el pago.", variant: "destructive" });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getCardWidth = (): { width: DimensionValue } => {
    if (width >= 1024) return { width: '20%' };
    if (width >= 768) return { width: '33.33%' };
    return { width: '50%' };
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View>
              <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Plano de Mesas
              </Text>
              <Text className="text-zinc-500">Selecciona una mesa para gestionar la comanda o cobrar.</Text>
            </View>
            <View className="flex-row items-center gap-3 mt-2 md:mt-0">
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 px-3 py-1" label="Libres" />
              <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 px-3 py-1" label="Ocupadas" />
            </View>
          </View>

          <View className="flex-row flex-wrap -mx-2">
            {!isLoading && tables.length === 0 && (
              <Text className="text-zinc-500 p-4 w-full text-center">No hay mesas configuradas.</Text>
            )}

            {tables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                isSelected={selectedTable?._id === table._id}
                onPress={() => setSelectedTable(table)}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* POPUP INFERIOR: ACCIÓN SOBRE MESA */}
      {selectedTable && !showOrderTaking && !showCheckoutModal && (
        <View className="absolute bottom-8 left-4 right-4 items-center justify-center z-50">
          <Card
            className="border-none shadow-2xl rounded-[32px] overflow-hidden w-full max-w-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <CardContent className="p-5 flex-col gap-5">
              <View className="flex-row justify-between items-center w-full">
                <View className="flex-row items-center gap-4">
                  <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                    <Text className="text-2xl font-headline font-bold text-white text-center">
                      {selectedTable.numero_mesa}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-lg text-white">Mesa #{selectedTable.numero_mesa}</Text>
                    <Text className="text-xs text-white/80 font-medium uppercase tracking-widest mt-0.5">
                      {selectedTable.status === 'Available' ? 'ESTADO: LIBRE' : `ATIENDE: ${selectedTable.mesero_nombre || 'MESERO'}`}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="h-12 w-12 rounded-full items-center justify-center bg-black/10 active:scale-95 transition-transform"
                  onPress={() => setSelectedTable(null)}
                >
                  <Plus color="white" size={24} style={{ transform: [{ rotate: '45deg' }] }} />
                </TouchableOpacity>
              </View>

              {/* BOTONERA DUAL SI ESTÁ OCUPADA */}
              {selectedTable.status === 'Occupied' ? (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-1 rounded-xl bg-white/20 items-center justify-center flex-row py-4 shadow-sm active:scale-95 transition-transform"
                    onPress={() => setShowOrderTaking(true)}
                  >
                    <Plus color="white" size={20} strokeWidth={3} />
                    <Text className="text-white font-bold text-base ml-2">Añadir Más</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-1 rounded-xl bg-white items-center justify-center flex-row py-4 shadow-lg shadow-black/10 active:scale-95 transition-transform"
                    onPress={() => openCheckout(selectedTable)}
                  >
                    <ReceiptText color={primaryColor} size={20} strokeWidth={3} />
                    <Text style={{ color: primaryColor }} className="font-bold text-base ml-2">Cobrar Cuenta</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-full rounded-xl bg-white items-center justify-center flex-row py-4 shadow-lg shadow-black/10 active:scale-95 transition-transform"
                  onPress={() => setShowOrderTaking(true)}
                >
                  <Plus color={primaryColor} size={20} strokeWidth={3} />
                  <Text style={{ color: primaryColor }} className="font-bold text-lg ml-2">Abrir Mesa (Nueva Orden)</Text>
                </TouchableOpacity>
              )}

            </CardContent>
          </Card>
        </View>
      )}

      {/* MODAL DEL RESUMEN DE CUENTA (CHECKOUT) */}
      <Modal visible={showCheckoutModal} transparent animationType="slide">
        <SafeAreaView className="absolute z-[200] top-0 bottom-0 left-0 right-0 bg-black/60 items-center justify-center p-4">
          <View className={cn("w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl flex-col max-h-[90%]", isDark ? "bg-[#1E1E1E]" : "bg-white")}>

            <View className={cn("p-6 flex-row justify-between items-center border-b", isDark ? "border-[#2A2A2A]" : "border-zinc-200")}>
              <Text className={cn("font-bold text-lg font-headline", isDark ? "text-white" : "text-black")}>
                Cuenta Mesa {selectedTable?.numero_mesa}
              </Text>
              <TouchableOpacity onPress={() => setShowCheckoutModal(false)} className={cn("p-2 rounded-full", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                <X color={isDark ? "white" : "black"} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-6 flex-1" showsVerticalScrollIndicator={false}>
              <View className="mb-4 border-b border-dashed pb-4" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-[10px] font-bold text-zinc-500 w-8">CANT</Text>
                  <Text className="text-[10px] font-bold text-zinc-500 flex-1">PRODUCTO</Text>
                  <Text className="text-[10px] font-bold text-zinc-500 text-right">SUBTOTAL</Text>
                </View>

                {activeAccount?.items.map((item, idx) => (
                  <View key={idx} className="flex-row justify-between mb-3 items-start">
                    <Text className={cn("text-sm font-bold w-8", isDark ? "text-zinc-300" : "text-zinc-800")}>{item.cantidad}</Text>
                    <Text className={cn("text-sm font-medium flex-1 pr-2", isDark ? "text-zinc-400" : "text-zinc-700")}>{item.nombre}</Text>
                    <Text className={cn("text-sm font-mono font-bold", isDark ? "text-zinc-300" : "text-zinc-800")}>${item.subtotal.toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-end mt-2 mb-6">
                <Text className={cn("text-xl font-bold uppercase tracking-widest", isDark ? "text-zinc-500" : "text-zinc-400")}>Total a Pagar</Text>
                <Text style={{ color: primaryColor }} className="text-4xl font-mono font-bold">${activeAccount?.total.toFixed(2)}</Text>
              </View>
            </ScrollView>

            <View className={cn("p-6 pt-0 border-t mt-2", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
              <TouchableOpacity
                onPress={processPayment}
                disabled={isProcessingPayment}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-4 mt-6 rounded-2xl items-center justify-center flex-row shadow-lg active:scale-95 transition-transform"
              >
                {isProcessingPayment ? <ActivityIndicator color="white" /> : (
                  <>
                    <CheckCircle2 color="white" size={20} className="mr-2" />
                    <Text className="text-white font-bold text-lg tracking-wide">Confirmar Pago y Liberar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* MODAL DE TOMA DE PEDIDO */}
      <Modal
        visible={selectedTable !== null && showOrderTaking}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowOrderTaking(false);
          setSelectedTable(null);
          fetchTables();
        }}
      >
        {selectedTable && showOrderTaking && (
          <OrderTaking
            tableId={selectedTable._id}
            tableNumber={selectedTable.numero_mesa}
            tableName={selectedTable.nombre || `Mesa ${selectedTable.numero_mesa}`}
            waiterId={user?.id || ''}
            waiterName={user?.name || 'Mesero'}
            onClose={() => {
              setShowOrderTaking(false);
              setSelectedTable(null);
              fetchTables();
            }}
          />
        )}
      </Modal>
    </View>
  );
}