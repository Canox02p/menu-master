'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, DimensionValue, Modal } from 'react-native';
import { Card } from '@/components/ui/card';
import { Clock, Receipt, Printer, X, MapPin, ChevronDown, ChevronUp, CreditCard, Banknote, User, CalendarClock, UtensilsCrossed, CheckCircle2 } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';

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
  originalIds?: string[];
}

interface VentaData {
  _id: string;
  fecha_venta: string;
  numero_mesa: number;
  nombre_mesa: string;
  nombre_mesero: string;
  metodo_pago: string;
  monto_pagado: number;
  productos_cobrados: { nombre: string; cantidad: number; precio: number }[];
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. MODAL DE MÉTODO DE PAGO
// ==========================================
const PaymentMethodModal = ({
  order,
  visible,
  onClose,
  onConfirm,
  primaryColor,
  isDark,
}: {
  order: OrderData | null;
  visible: boolean;
  onClose: () => void;
  onConfirm: (order: OrderData, metodo: 'EFECTIVO' | 'TARJETA') => void;
  primaryColor: string;
  isDark: boolean;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'EFECTIVO' | 'TARJETA' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedMethod(null);
      setIsProcessing(false);
    }
  }, [visible]);

  if (!order || !visible) return null;

  const handleConfirm = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    await onConfirm(order, selectedMethod);
    setIsProcessing(false);
  };

  const safeProductos = Array.isArray(order.productos) ? order.productos : [];
  const numMesa = order.numero_mesa || '?';

  return (
    <SafeAreaView className="absolute z-[300] top-0 bottom-0 left-0 right-0 bg-black/70 items-center justify-center p-4">
      <View
        className="w-full max-w-sm rounded-[28px] overflow-hidden shadow-2xl"
        style={{ backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }}
      >
        {/* Header */}
        <View
          className="p-5 flex-row justify-between items-center border-b"
          style={{ borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5' }}
        >
          <View>
            <Text className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
              Método de Pago
            </Text>
            <Text className="text-zinc-500 text-xs mt-0.5">Mesa {numMesa} · ${Number(order.total).toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: isDark ? '#2A2A2A' : '#f4f4f5' }}
          >
            <X color={isDark ? '#a1a1aa' : '#71717a'} size={18} />
          </TouchableOpacity>
        </View>

        {/* Resumen de cuenta */}
        <View className="px-5 pt-4 pb-3">
          <Text
            className="text-[10px] font-bold tracking-widest uppercase mb-3"
            style={{ color: isDark ? '#52525b' : '#a1a1aa' }}
          >
            Resumen de cuenta
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: isDark ? '#161616' : '#f9f9f9' }}
          >
            {safeProductos.map((item, idx) => (
              <View
                key={idx}
                className="flex-row justify-between items-center py-1.5"
                style={{
                  borderBottomWidth: idx < safeProductos.length - 1 ? 0.5 : 0,
                  borderBottomColor: isDark ? '#2A2A2A' : '#e4e4e7',
                }}
              >
                <Text
                  className={cn('text-xs flex-1 pr-2', isDark ? 'text-zinc-300' : 'text-zinc-700')}
                  numberOfLines={1}
                >
                  <Text className="font-bold">{item.cantidad}x</Text> {item.nombre}
                </Text>
                <Text className={cn('text-xs font-mono font-bold', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                  ${(Number(item.subtotal) || Number(item.precio_unitario) * Number(item.cantidad) || 0).toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="flex-row justify-between items-center mt-3 pt-2" style={{ borderTopWidth: 1, borderTopColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
              <Text className={cn('text-base font-bold', isDark ? 'text-white' : 'text-black')}>TOTAL</Text>
              <Text style={{ color: primaryColor }} className="text-xl font-mono font-bold">
                ${Number(order.total).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Selección de método */}
        <View className="px-5 pb-4">
          <Text
            className="text-[10px] font-bold tracking-widest uppercase mb-3"
            style={{ color: isDark ? '#52525b' : '#a1a1aa' }}
          >
            Selecciona cómo paga
          </Text>
          <View className="flex-row gap-3">
            {/* Botón Efectivo */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedMethod('EFECTIVO')}
              className="flex-1 rounded-2xl p-4 items-center justify-center border-2"
              style={{
                borderColor: selectedMethod === 'EFECTIVO' ? '#10b981' : (isDark ? '#2A2A2A' : '#e4e4e7'),
                backgroundColor:
                  selectedMethod === 'EFECTIVO'
                    ? 'rgba(16,185,129,0.1)'
                    : isDark
                      ? '#161616'
                      : '#f9f9f9',
              }}
            >
              <Banknote
                color={selectedMethod === 'EFECTIVO' ? '#10b981' : isDark ? '#71717a' : '#a1a1aa'}
                size={32}
              />
              <Text
                className="font-bold text-sm mt-2"
                style={{ color: selectedMethod === 'EFECTIVO' ? '#10b981' : isDark ? '#a1a1aa' : '#71717a' }}
              >
                Efectivo
              </Text>
              {selectedMethod === 'EFECTIVO' && (
                <View className="mt-2">
                  <CheckCircle2 color="#10b981" size={16} />
                </View>
              )}
            </TouchableOpacity>

            {/* Botón Tarjeta */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedMethod('TARJETA')}
              className="flex-1 rounded-2xl p-4 items-center justify-center border-2"
              style={{
                borderColor: selectedMethod === 'TARJETA' ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7'),
                backgroundColor:
                  selectedMethod === 'TARJETA'
                    ? `${primaryColor}18`
                    : isDark
                      ? '#161616'
                      : '#f9f9f9',
              }}
            >
              <CreditCard
                color={selectedMethod === 'TARJETA' ? primaryColor : isDark ? '#71717a' : '#a1a1aa'}
                size={32}
              />
              <Text
                className="font-bold text-sm mt-2"
                style={{ color: selectedMethod === 'TARJETA' ? primaryColor : isDark ? '#a1a1aa' : '#71717a' }}
              >
                Tarjeta
              </Text>
              {selectedMethod === 'TARJETA' && (
                <View className="mt-2">
                  <CheckCircle2 color={primaryColor} size={16} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón confirmar */}
        <View className="px-5 pb-5">
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!selectedMethod || isProcessing}
            onPress={handleConfirm}
            className="w-full py-4 rounded-2xl items-center justify-center flex-row gap-2"
            style={{
              backgroundColor: selectedMethod
                ? selectedMethod === 'EFECTIVO'
                  ? '#10b981'
                  : primaryColor
                : isDark
                  ? '#2A2A2A'
                  : '#e4e4e7',
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {selectedMethod === 'TARJETA' ? (
                  <CreditCard color={selectedMethod ? 'white' : isDark ? '#52525b' : '#a1a1aa'} size={18} />
                ) : (
                  <Banknote color={selectedMethod ? 'white' : isDark ? '#52525b' : '#a1a1aa'} size={18} />
                )}
                <Text
                  className="font-bold text-base"
                  style={{ color: selectedMethod ? 'white' : isDark ? '#52525b' : '#a1a1aa' }}
                >
                  {selectedMethod ? `Confirmar Cobro · $${Number(order.total).toFixed(2)}` : 'Elige un método de pago'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ==========================================
// 3. TICKET OVERLAY
// ==========================================
const TicketOverlay = ({
  order,
  visible,
  onClose,
  primaryColor,
  isDark,
}: {
  order: OrderData | null;
  visible: boolean;
  onClose: () => void;
  primaryColor: string;
  isDark: boolean;
}) => {
  if (!order || !visible) return null;

  let fecha = new Date();
  try { if (order.fecha_creacion) fecha = new Date(order.fecha_creacion); } catch (e) { }

  const safeProductos = Array.isArray(order.productos) ? order.productos : [];
  const totalItems = safeProductos.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
  const numMesa = order.numero_mesa || order.id_mesa?.numero_mesa || '?';
  const nomMesa = order.nombre_mesa || order.id_mesa?.nombre_mesa || '';
  const zonaMesa = order.ubicacion_mesa || order.id_mesa?.area || order.id_mesa?.ubicacion || 'General';
  const ticketId = String(order._id || '0000').slice(-6).toUpperCase();

  // ✅ CORRECCIÓN: Abre una ventana limpia con solo el ticket en lugar de imprimir toda la página
  const handlePrint = () => {
    if (Platform.OS === 'web') {
      const productosHTML = safeProductos.map(item => `
        <tr>
          <td style="padding: 4px 0; font-weight: bold; width: 32px;">${item.cantidad || 1}</td>
          <td style="padding: 4px 0;">${item.nombre || 'Item'}</td>
          <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: bold;">
            $${(Number(item.subtotal) || (Number(item.precio_unitario) * Number(item.cantidad)) || 0).toFixed(2)}
          </td>
        </tr>
      `).join('');

      const printWindow = window.open('', '_blank', 'width=400,height=650');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <title>Ticket #${ticketId}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Courier New', monospace;
                font-size: 13px;
                color: #000;
                background: #fff;
                padding: 20px;
                max-width: 300px;
                margin: 0 auto;
              }
              .center { text-align: center; }
              .divider { border-top: 1px dashed #999; margin: 10px 0; }
              .divider-solid { border-top: 1px solid #999; margin: 10px 0; }
              .bold { font-weight: bold; }
              .logo { font-size: 18px; font-weight: bold; letter-spacing: 2px; margin-bottom: 4px; }
              .subtitle { font-size: 11px; color: #555; }
              .info-row { display: flex; justify-content: space-between; margin: 3px 0; font-size: 12px; }
              .badge {
                display: inline-block; border: 1px solid #ccc;
                padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;
                margin-top: 6px;
              }
              table { width: 100%; border-collapse: collapse; }
              thead td { font-size: 10px; font-weight: bold; color: #555; padding-bottom: 6px; }
              .total-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; }
              .total-label { font-size: 20px; font-weight: bold; }
              .total-amount { font-size: 24px; font-weight: bold; font-family: monospace; }
              .thanks { text-align: center; color: #888; font-size: 11px; margin-top: 20px; }
              @media print {
                body { padding: 0; }
                @page { margin: 8mm; size: 80mm auto; }
              }
            </style>
          </head>
          <body>
            <div class="center" style="margin-bottom: 16px;">
              <div class="logo">MENU MASTER</div>
              <div class="subtitle">Ticket #${ticketId}</div>
            </div>

            <div class="divider-solid"></div>

            <div style="margin: 8px 0;">
              <div class="info-row">
                <span>Fecha:</span>
                <span class="bold">${!isNaN(fecha.getTime()) ? fecha.toLocaleDateString() : '--/--/----'}</span>
              </div>
              <div class="info-row">
                <span>Hora:</span>
                <span class="bold">${!isNaN(fecha.getTime()) ? fecha.toLocaleTimeString() : '--:--'}</span>
              </div>
              <div class="info-row">
                <span>Le atendió:</span>
                <span class="bold">${(order.nombre_mesero || 'Mesero').toUpperCase()}</span>
              </div>
              <div>
                <span class="badge">Mesa ${numMesa}${nomMesa ? ` - ${nomMesa}` : ''}</span>
                <span style="font-size: 11px; color: #555; margin-left: 6px;">📍 ${zonaMesa}</span>
              </div>
            </div>

            <div class="divider"></div>

            <table>
              <thead>
                <tr>
                  <td style="width: 32px;">CANT</td>
                  <td>DESCRIPCIÓN</td>
                  <td style="text-align: right;">IMPORTE</td>
                </tr>
              </thead>
              <tbody>${productosHTML}</tbody>
            </table>

            <div class="divider"></div>

            <div class="info-row" style="margin-top: 4px;">
              <span style="color: #555;">Total de Artículos:</span>
              <span class="bold">${totalItems}</span>
            </div>

            <div class="divider-solid"></div>

            <div class="total-row">
              <span class="total-label">TOTAL</span>
              <span class="total-amount">$${Number(order.total || 0).toFixed(2)}</span>
            </div>

            <p class="thanks">¡Gracias por su preferencia!</p>

            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      Alert.alert("Impresión", "Iniciando impresión del ticket...");
    }
  };

  return (
    <SafeAreaView className="absolute z-[200] top-0 bottom-0 left-0 right-0 bg-black/60 items-center justify-center p-4">
      <View className="w-full max-w-sm bg-white rounded-t-[24px] rounded-b-[8px] overflow-hidden shadow-2xl flex-col max-h-[90%]">
        <View className="p-4 flex-row justify-between items-center border-b border-zinc-200 bg-zinc-50">
          <Text className="font-bold text-zinc-800 text-lg">Ticket de Compra</Text>
          <TouchableOpacity onPress={onClose} className="p-2 bg-zinc-200 rounded-full">
            <X color="#52525b" size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView className="p-6 flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Text className="text-2xl font-headline font-bold text-black mb-1">MENU MASTER</Text>
            <Text className="text-zinc-500 text-xs">Ticket #{ticketId}</Text>
          </View>
          <View className="space-y-1.5 mb-6 border-b border-zinc-200 pb-4">
            <Text className="text-sm font-medium text-zinc-700">
              Fecha: <Text className="font-bold">{!isNaN(fecha.getTime()) ? fecha.toLocaleDateString() : '--/--/----'}</Text>
            </Text>
            <Text className="text-sm font-medium text-zinc-700">
              Hora: <Text className="font-bold">{!isNaN(fecha.getTime()) ? fecha.toLocaleTimeString() : '--:--'}</Text>
            </Text>
            <Text className="text-sm font-medium text-zinc-700">
              Le atendió: <Text className="font-bold uppercase">{order.nombre_mesero || 'Mesero'}</Text>
            </Text>
            <View className="flex-row flex-wrap mt-2 items-center gap-2">
              <View className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                <Text className="text-sm font-bold text-zinc-800">Mesa {numMesa} {nomMesa ? `- ${nomMesa}` : ''}</Text>
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
                <Text className="text-sm font-medium text-zinc-700 flex-1 pr-2">{item.nombre || 'Item'}</Text>
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
            className="w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg"
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
// 4. TARJETA DE HISTORIAL (VENTAS)
// ==========================================
const HistoryCard = ({ venta, isDark, primaryColor }: { venta: VentaData, isDark: boolean, primaryColor: string }) => {
  const [expanded, setExpanded] = useState(false);

  let fechaVenta = new Date();
  try { if (venta.fecha_venta) fechaVenta = new Date(venta.fecha_venta); } catch (e) { }

  const totalItems = venta.productos_cobrados?.reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0) || 0;
  const esTarjeta = venta.metodo_pago?.toUpperCase().includes('TARJETA') || venta.metodo_pago?.toUpperCase().includes('CARD');

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <View className="flex-row items-center gap-3 py-2" style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5' }}>
      <View style={{ opacity: 0.5 }}>{icon}</View>
      <Text className={cn("text-xs flex-1", isDark ? "text-zinc-400" : "text-zinc-500")}>{label}</Text>
      <Text className={cn("text-xs font-bold text-right", isDark ? "text-zinc-200" : "text-zinc-800")}>{value}</Text>
    </View>
  );

  return (
    <Card className={cn("border-none rounded-[24px] mb-3 overflow-hidden", isDark ? "bg-[#1E1E1E]" : "bg-white shadow-md")}>
      <View className={cn("p-5 flex-row justify-between items-start border-b", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
        <View className="flex-row items-center gap-4">
          <View className={cn("w-12 h-12 rounded-[14px] items-center justify-center", isDark ? "bg-black/40" : "bg-zinc-100")}>
            <Text style={{ color: primaryColor }} className="font-headline font-bold text-lg">T{venta.numero_mesa}</Text>
          </View>
          <View>
            <Text className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>
              Mesa {venta.numero_mesa}{venta.nombre_mesa ? ` · ${venta.nombre_mesa}` : ''}
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <CalendarClock color={isDark ? "#71717a" : "#a1a1aa"} size={11} />
              <Text className={cn("text-[11px] font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>
                {!isNaN(fechaVenta.getTime()) ? fechaVenta.toLocaleString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '--'}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <Text className="text-[10px] font-bold tracking-widest uppercase text-emerald-500">PAGADO</Text>
        </View>
      </View>

      <View className="px-5 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Cobrado</Text>
          <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-black")}>
            ${Number(venta.monto_pagado || 0).toFixed(2)}
          </Text>
        </View>
        <View className="items-end gap-1">
          <View className={cn("flex-row items-center gap-2 px-3 py-2 rounded-xl", isDark ? "bg-black/30" : "bg-zinc-50 border border-zinc-200")}>
            {esTarjeta
              ? <CreditCard color={isDark ? "#a1a1aa" : "#71717a"} size={14} />
              : <Banknote color={isDark ? "#a1a1aa" : "#71717a"} size={14} />
            }
            <Text className={cn("text-xs font-bold uppercase", isDark ? "text-zinc-300" : "text-zinc-700")}>
              {venta.metodo_pago || 'Efectivo'}
            </Text>
          </View>
          <Text className={cn("text-[10px] text-right", isDark ? "text-zinc-500" : "text-zinc-400")}>
            {totalItems} artículo{totalItems !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View className={cn("px-5 pb-4 flex-row items-center gap-2")}>
        <User color={isDark ? "#71717a" : "#a1a1aa"} size={13} />
        <Text className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-500")}>
          Atendió: <Text className="font-bold">{venta.nombre_mesero || 'Mesero'}</Text>
        </Text>
      </View>

      <View className={cn("border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="px-5 py-3.5 flex-row justify-between items-center">
          <Text className={cn("text-xs font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>
            {expanded ? 'Ocultar detalle' : 'Ver detalle completo'}
          </Text>
          {expanded
            ? <ChevronUp color={isDark ? "#71717a" : "#a1a1aa"} size={16} />
            : <ChevronDown color={isDark ? "#71717a" : "#a1a1aa"} size={16} />
          }
        </TouchableOpacity>

        {expanded && (
          <View className="px-5 pb-5">
            <View className={cn("rounded-2xl p-4 mb-3", isDark ? "bg-black/30" : "bg-zinc-50")}>
              <View className="flex-row items-center gap-2 mb-3">
                <MapPin color={primaryColor} size={13} />
                <Text style={{ color: primaryColor }} className="text-xs font-bold uppercase tracking-widest">Info de Mesa</Text>
              </View>
              <InfoRow icon={<Text className="text-xs">🔢</Text>} label="Número de mesa" value={`Mesa ${venta.numero_mesa}`} />
              {venta.nombre_mesa ? <InfoRow icon={<Text className="text-xs">🏷️</Text>} label="Nombre asignado" value={venta.nombre_mesa} /> : null}
              <InfoRow icon={<CalendarClock color={isDark ? "#71717a" : "#a1a1aa"} size={13} />} label="Hora de cierre" value={!isNaN(fechaVenta.getTime()) ? fechaVenta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'} />
            </View>

            <View className={cn("rounded-2xl p-4 mb-3", isDark ? "bg-black/30" : "bg-zinc-50")}>
              <View className="flex-row items-center gap-2 mb-3">
                <User color={primaryColor} size={13} />
                <Text style={{ color: primaryColor }} className="text-xs font-bold uppercase tracking-widest">Servicio</Text>
              </View>
              <InfoRow icon={<User color={isDark ? "#71717a" : "#a1a1aa"} size={13} />} label="Mesero" value={(venta.nombre_mesero || 'N/A').toUpperCase()} />
              <InfoRow icon={esTarjeta ? <CreditCard color={isDark ? "#71717a" : "#a1a1aa"} size={13} /> : <Banknote color={isDark ? "#71717a" : "#a1a1aa"} size={13} />} label="Método de pago" value={venta.metodo_pago || 'EFECTIVO'} />
              <InfoRow icon={<Text className="text-xs">🧾</Text>} label="Folio de venta" value={`#${String(venta._id).slice(-8).toUpperCase()}`} />
            </View>

            <View className={cn("rounded-2xl p-4", isDark ? "bg-black/30" : "bg-zinc-50")}>
              <View className="flex-row items-center gap-2 mb-3">
                <UtensilsCrossed color={primaryColor} size={13} />
                <Text style={{ color: primaryColor }} className="text-xs font-bold uppercase tracking-widest">Platillos Ordenados</Text>
              </View>
              {(venta.productos_cobrados || []).map((p, idx) => (
                <View
                  key={idx}
                  className="flex-row justify-between items-center py-1.5"
                  style={{
                    borderBottomWidth: idx < venta.productos_cobrados.length - 1 ? 0.5 : 0,
                    borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5',
                  }}
                >
                  <Text className={cn("text-xs flex-1", isDark ? "text-zinc-300" : "text-zinc-700")} numberOfLines={1}>
                    <Text className="font-bold">{p.cantidad}x</Text> {p.nombre}
                  </Text>
                  <Text className={cn("text-xs font-mono font-bold", isDark ? "text-zinc-400" : "text-zinc-600")}>
                    ${((Number(p.precio) || 0) * (Number(p.cantidad) || 1)).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View className="flex-row justify-between items-center mt-3 pt-2" style={{ borderTopWidth: 1, borderTopColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                <Text className={cn("text-sm font-bold", isDark ? "text-white" : "text-black")}>TOTAL</Text>
                <Text style={{ color: primaryColor }} className="text-lg font-mono font-bold">${Number(venta.monto_pagado || 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

// ==========================================
// 5. COMPONENTE PRINCIPAL
// ==========================================
export function WaiterOrders() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ventas, setVentas] = useState<VentaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'Ongoing' | 'History'>('Ongoing');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [selectedTicket, setSelectedTicket] = useState<OrderData | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<OrderData | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://menu-master-api.onrender.com/pedidos/activos');
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
          nombre_mesero: p.nombre_mesero || p.mesero_nombre || p.id_mesero?.nombre || 'Mesero',
          productos: Array.isArray(p.productos) ? p.productos : [],
          numero_mesa: p.numero_mesa || p.id_mesa?.numero_mesa || 0,
          nombre_mesa: p.nombre_mesa || p.id_mesa?.nombre_mesa || p.id_mesa?.nombre || '',
          ubicacion_mesa: p.ubicacion_mesa || p.id_mesa?.area || p.id_mesa?.ubicacion || 'General',
          id_mesa: p.id_mesa,
          originalIds: [p._id],
        };
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await fetch('https://menu-master-api.onrender.com/ventas');
      const data = await response.json();
      const arr = Array.isArray(data) ? data : [];
      setVentas(arr);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchVentas();
    const interval = setInterval(() => {
      fetchOrders();
      if (filter === 'History') fetchVentas();
    }, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCobrar = (order: OrderData) => {
    setPaymentOrder(order);
  };

  const procesarCobro = async (order: OrderData, metodoPago: 'EFECTIVO' | 'TARJETA') => {
    try {
      const payloadVenta = {
        id_pedido: order.originalIds?.[0] || order._id,
        id_mesero: user?.id || '000000000000000000000000',
        numero_mesa: order.numero_mesa,
        nombre_mesa: order.nombre_mesa || `Mesa ${order.numero_mesa}`,
        nombre_mesero: order.nombre_mesero || user?.name || 'Mesero',
        metodo_pago: metodoPago,
        division: false,
        monto_pagado: order.total,
        productos_cobrados: order.productos.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio_unitario || (item.subtotal / item.cantidad) || 0,
        })),
      };

      await fetch('https://menu-master-api.onrender.com/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadVenta),
      });

      const idsToPay = order.originalIds || [order._id];
      if (idsToPay.length > 1) {
        for (let i = 1; i < idsToPay.length; i++) {
          await fetch(`https://menu-master-api.onrender.com/pedidos/${idsToPay[i]}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'PAGADO' }),
          });
        }
      }

      setPaymentOrder(null);
      toast({
        title: "Pago Registrado",
        description: `Cobro con ${metodoPago === 'TARJETA' ? 'tarjeta' : 'efectivo'} registrado exitosamente.`,
      });
      fetchOrders();
      fetchVentas();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar el cobro.", variant: "destructive" });
    }
  };

  const getConsolidatedOrders = () => {
    const filtered = orders.filter(o => o.estado !== 'PAGADO');
    const groupedMap = new Map<string, OrderData>();

    filtered.forEach(o => {
      const key = o.numero_mesa ? String(o.numero_mesa) : o._id;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { ...o, _id: `MESA-${key}`, originalIds: [o._id], productos: [...o.productos.map(p => ({ ...p }))] });
      } else {
        const existing = groupedMap.get(key)!;
        existing.originalIds!.push(o._id);
        existing.total += o.total;
        if (o.estado === 'EN_COCINA') existing.estado = 'EN_COCINA';
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
                  {filter === 'Ongoing' ? 'Órdenes Activas' : 'Historial de Ventas'}
                </Text>
                <Text className="text-zinc-500">
                  {filter === 'Ongoing' ? 'Supervisa las órdenes en preparación y procesa cobros.' : 'Registro completo de cuentas cerradas.'}
                </Text>
              </View>
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
            </View>

            <View className={cn("flex-row p-1.5 rounded-xl border", isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-zinc-100 border-zinc-200")}>
              <TouchableOpacity
                onPress={() => setFilter('Ongoing')}
                className={cn("px-6 py-2.5 rounded-lg", filter === 'Ongoing' ? (isDark ? "bg-[#2A2A2A] shadow-sm" : "bg-white shadow-sm") : "")}
              >
                <Text className={cn("font-bold text-sm", filter === 'Ongoing' ? (isDark ? "text-white" : "text-zinc-900") : "text-zinc-500")}>Activas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setFilter('History'); fetchVentas(); }}
                className={cn("px-6 py-2.5 rounded-lg", filter === 'History' ? (isDark ? "bg-[#2A2A2A] shadow-sm" : "bg-white shadow-sm") : "")}
              >
                <Text className={cn("font-bold text-sm", filter === 'History' ? (isDark ? "text-white" : "text-zinc-900") : "text-zinc-500")}>Historial</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* HISTORIAL DE VENTAS */}
          {filter === 'History' && (
            <View className="px-2">
              {ventas.length === 0 && !isLoading && (
                <View className="py-32 items-center justify-center opacity-50">
                  <Receipt color={isDark ? "white" : "black"} size={64} className="mb-4" />
                  <Text className={cn("text-xl font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>El historial está vacío</Text>
                </View>
              )}
              {ventas.map((venta) => (
                <HistoryCard key={venta._id} venta={venta} isDark={isDark} primaryColor={primaryColor} />
              ))}
            </View>
          )}

          {/* GRID DE ÓRDENES ACTIVAS */}
          {filter === 'Ongoing' && (
            <View className="flex-row flex-wrap -mx-2">
              {!isLoading && displayedOrders.length === 0 && (
                <View className="w-full py-32 items-center justify-center opacity-50">
                  <Receipt color={isDark ? "white" : "black"} size={64} className="mb-4" />
                  <Text className={cn("text-xl font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>No hay órdenes activas</Text>
                </View>
              )}

              {displayedOrders.map((order) => {
                const isReady = order.estado === 'LISTO';
                const isExpanded = expandedCards[order._id];

                let fecha = new Date();
                try { if (order.fecha_creacion) fecha = new Date(order.fecha_creacion); } catch (e) { }
                const diffMins = Math.floor((Date.now() - fecha.getTime()) / 60000);
                const safeProductos = Array.isArray(order.productos) ? order.productos : [];
                const itemsCount = safeProductos.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0);
                const numMesa = order.numero_mesa || '?';

                return (
                  <View key={order._id} style={getCardWidth()} className="p-2 mb-2">
                    <Card className={cn("border-none rounded-[24px] flex flex-col", isDark ? "bg-[#1E1E1E]" : "bg-white shadow-md")}>

                      {/* Cabecera */}
                      <View className={cn("p-5 flex-row justify-between items-start border-b", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
                        <View className="flex-row items-center gap-4">
                          <View className={cn("w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm", isDark ? "bg-black/40" : "bg-zinc-100")}>
                            <Text style={{ color: primaryColor }} className="font-headline font-bold text-lg">T{numMesa}</Text>
                          </View>
                          <View>
                            <Text className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>Mesa Consolidada</Text>
                            <View className="flex-row items-center gap-1 mt-1">
                              <Clock color={isDark ? "#71717a" : "#a1a1aa"} size={12} />
                              <Text className={cn("text-[11px] font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>
                                Hace {isNaN(diffMins) ? 0 : diffMins} min
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className={cn("px-3 py-1.5 rounded-full border",
                          isReady ? "border-emerald-500/30 bg-emerald-500/10" : "border-amber-500/30 bg-amber-500/10"
                        )}>
                          <Text className={cn("text-[10px] font-bold tracking-widest uppercase",
                            isReady ? "text-emerald-500" : "text-amber-500"
                          )}>
                            {order.estado.replace(/_/g, ' ')}
                          </Text>
                        </View>
                      </View>

                      {/* Total */}
                      <View className="p-5 flex-row justify-between items-center">
                        <View>
                          <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Cuenta Total</Text>
                          <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-black")}>
                            ${Number(order.total || 0).toFixed(2)}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Items</Text>
                          <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>{itemsCount}</Text>
                        </View>
                      </View>

                      {/* Acordeón detalle */}
                      <View className={cn("px-5 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
                        <TouchableOpacity onPress={() => toggleExpand(order._id)} className="py-4 flex-row justify-between items-center">
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

                      {/* Botones */}
                      <View className="p-4 pt-0 flex-row gap-3 mt-2">
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setSelectedTicket(order)}
                          className={cn("flex-1 py-3.5 rounded-xl border flex-row items-center justify-center gap-2", isDark ? "border-[#3f3f46] bg-[#2A2A2A]" : "border-zinc-300 bg-white")}
                        >
                          <Receipt color={isDark ? "white" : "black"} size={16} />
                          <Text className={cn("font-bold text-sm", isDark ? "text-white" : "text-black")}>Ticket</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          disabled={!isReady}
                          onPress={() => handleCobrar(order)}
                          style={{ backgroundColor: isReady ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7') }}
                          className="flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
                        >
                          <Text className={cn("font-bold text-sm", isReady ? "text-white" : "text-zinc-500")}>Cobrar</Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* TICKET OVERLAY */}
      <TicketOverlay
        order={selectedTicket}
        visible={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        primaryColor={primaryColor}
        isDark={isDark}
      />

      {/* MODAL DE MÉTODO DE PAGO */}
      <PaymentMethodModal
        order={paymentOrder}
        visible={paymentOrder !== null}
        onClose={() => setPaymentOrder(null)}
        onConfirm={procesarCobro}
        primaryColor={primaryColor}
        isDark={isDark}
      />
    </View>
  );
}