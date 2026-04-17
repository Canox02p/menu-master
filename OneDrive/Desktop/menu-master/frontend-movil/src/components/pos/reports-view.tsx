'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import {
    TrendingUp, DollarSign, ShoppingBag, Award,
    Download, FileText, Calendar, CreditCard, ChevronRight, BarChart3,
    MapPin, User, CalendarClock, UtensilsCrossed, ChevronDown, ChevronUp, Banknote
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/hooks/use-toast';

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 1. INTERFACES
// ==========================================
interface ProductoVenta {
    nombre?: string;
    name?: string;           // ← campo alternativo del API
    cantidad?: number;
    qty?: number;            // ← campo alternativo
    quantity?: number;       // ← campo alternativo
    precio?: number;
    precio_unitario?: number;
    price?: number;          // ← campo alternativo
    unit_price?: number;     // ← campo alternativo
    subtotal?: number;
    total?: number;          // ← campo alternativo
}

interface VentaData {
    _id: string;
    total?: number;
    monto_pagado?: number;
    amount?: number;         // ← campo alternativo
    estado?: string;
    status?: string;         // ← campo alternativo
    fecha_creacion?: string;
    fecha_venta?: string;
    createdAt?: string;      // ← campo alternativo
    date?: string;           // ← campo alternativo
    id_mesa?: { numero_mesa?: number; nombre_mesa?: string; area?: string; number?: number; name?: string };
    mesa?: { numero?: number; nombre?: string };  // ← campo alternativo
    numero_mesa?: number;
    nombre_mesa?: string;
    nombre_mesero?: string;
    waiter?: string;         // ← campo alternativo
    metodo_pago?: string;
    payment_method?: string; // ← campo alternativo
    productos_cobrados?: ProductoVenta[];
    productos?: ProductoVenta[];
    items?: ProductoVenta[];  // ← campo alternativo
    products?: ProductoVenta[]; // ← campo alternativo
    order_items?: ProductoVenta[]; // ← campo alternativo
}

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    color: string;
    isDark: boolean;
    widthStyle: StyleProp<ViewStyle>;
}

// ==========================================
// HELPERS: Normalizar campos del API
// ==========================================

/** Devuelve el array de productos sin importar el nombre del campo */
function getProductos(venta: VentaData): ProductoVenta[] {
    return (
        venta.productos_cobrados ||
        venta.productos ||
        venta.items ||
        venta.products ||
        venta.order_items ||
        []
    );
}

/** Devuelve el nombre del producto */
function getNombreProducto(p: ProductoVenta): string {
    return p.nombre || p.name || 'Producto';
}

/** Devuelve la cantidad del producto */
function getCantidad(p: ProductoVenta): number {
    return Number(p.cantidad ?? p.qty ?? p.quantity ?? 1);
}

/** Devuelve el precio unitario del producto */
function getPrecioUnitario(p: ProductoVenta): number {
    return Number(p.precio ?? p.precio_unitario ?? p.price ?? p.unit_price ?? 0);
}

/** Devuelve el subtotal del ítem */
function getSubtotalItem(p: ProductoVenta): number {
    if (p.subtotal) return Number(p.subtotal);
    if ((p as any).total) return Number((p as any).total);
    return getCantidad(p) * getPrecioUnitario(p);
}

/** Devuelve el total de la venta */
function getTotalVenta(v: VentaData): number {
    return Number(v.monto_pagado ?? v.total ?? (v as any).amount ?? 0);
}

/** Devuelve la fecha de la venta */
function getFechaVenta(v: VentaData): Date {
    const raw = v.fecha_venta ?? v.fecha_creacion ?? (v as any).createdAt ?? (v as any).date;
    if (!raw) return new Date();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date() : d;
}

/** Devuelve número de mesa */
function getNumMesa(v: VentaData): string | number {
    return v.numero_mesa ?? v.id_mesa?.numero_mesa ?? v.id_mesa?.number ?? v.mesa?.numero ?? '?';
}

/** Devuelve nombre de mesa */
function getNombreMesa(v: VentaData): string {
    return v.nombre_mesa ?? v.id_mesa?.nombre_mesa ?? v.id_mesa?.name ?? v.mesa?.nombre ?? '';
}

/** Devuelve nombre del mesero */
function getMesero(v: VentaData): string {
    return v.nombre_mesero ?? (v as any).waiter ?? 'Mesero';
}

/** Devuelve método de pago */
function getMetodoPago(v: VentaData): string {
    return v.metodo_pago ?? (v as any).payment_method ?? 'EFECTIVO';
}

// ==========================================
// 2. COMPONENTES HIJOS
// ==========================================

// --- Tarjeta de KPI ---
const StatCard = ({ title, value, subtitle, icon: Icon, color, isDark, widthStyle }: StatCardProps) => (
    <View style={widthStyle} className="p-2">
        <Card className={cn("border-none rounded-[24px]", isDark ? "bg-[#1E1E1E]" : "bg-white shadow-sm")}>
            <CardContent className="p-6">
                <View className="flex-row justify-between items-start mb-4">
                    <View className="p-3 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
                        <Icon color={color} size={24} />
                    </View>
                </View>
                <View>
                    <Text className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{title}</Text>
                    <Text
                        className={cn("text-3xl font-headline font-bold mb-1", isDark ? "text-white" : "text-zinc-900")}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {value}
                    </Text>
                    <Text className="text-xs font-medium text-zinc-500">{subtitle}</Text>
                </View>
            </CardContent>
        </Card>
    </View>
);

// ==========================================
// GRÁFICA DE BARRAS — Estilo cápsula/pill con grid y eje Y
// ==========================================
const SimpleBarChart = ({
    data,
    primaryColor,
    isDark,
}: {
    data: { label: string; value: number }[];
    primaryColor: string;
    isDark: boolean;
}) => {
    const maxValue = Math.max(...data.map((d) => d.value), 1);

    // Calcular marcas del eje Y (4 niveles)
    const yTicks = [0, 1, 2, 3, 4].map((i) => Math.round((maxValue / 4) * i));

    // Color inactivo de las barras
    const inactiveBarColor = isDark ? '#1e3a5f' : '#cbd5e1';

    // El índice del valor más alto se destaca con el primaryColor
    const maxIndex = data.reduce((best, cur, i) => (cur.value > data[best].value ? i : best), 0);

    const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const axisTextColor = isDark ? '#6b7280' : '#9ca3af';

    const CHART_HEIGHT = 200;
    const Y_AXIS_WIDTH = 44;

    return (
        <View style={{ marginTop: 16 }}>
            {/* Cuerpo de la gráfica */}
            <View style={{ flexDirection: 'row' }}>
                {/* Eje Y */}
                <View
                    style={{
                        width: Y_AXIS_WIDTH,
                        height: CHART_HEIGHT,
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        paddingRight: 8,
                        paddingBottom: 2,
                    }}
                >
                    {[...yTicks].reverse().map((tick, i) => (
                        <Text key={i} style={{ fontSize: 10, color: axisTextColor, fontWeight: '600' }}>
                            {tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}
                        </Text>
                    ))}
                </View>

                {/* Área de barras con grid */}
                <View style={{ flex: 1, height: CHART_HEIGHT, position: 'relative' }}>
                    {/* Líneas horizontales del grid */}
                    {[0, 1, 2, 3, 4].map((i) => (
                        <View
                            key={i}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: (CHART_HEIGHT / 4) * i,
                                height: 1,
                                backgroundColor: gridColor,
                            }}
                        />
                    ))}

                    {/* Barras */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            height: '100%',
                            paddingHorizontal: 4,
                            gap: 6,
                        }}
                    >
                        {data.map((item, i) => {
                            const heightPct = (item.value / maxValue) * 100;
                            const isHighlight = i === maxIndex && item.value > 0;
                            const barColor = isHighlight ? primaryColor : inactiveBarColor;

                            return (
                                <View
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: '100%',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '100%',
                                            height: `${Math.max(heightPct, 4)}%`,
                                            backgroundColor: barColor,
                                            borderRadius: 999,  // ← forma cápsula/pill
                                            opacity: isHighlight ? 1 : 0.7,
                                        }}
                                    />
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Etiquetas del eje X */}
            <View style={{ flexDirection: 'row', marginTop: 10, paddingLeft: Y_AXIS_WIDTH }}>
                {data.map((item, i) => {
                    const isHighlight = i === maxIndex && item.value > 0;
                    return (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 10,
                                    fontWeight: isHighlight ? '800' : '600',
                                    color: isHighlight ? primaryColor : axisTextColor,
                                    textTransform: 'uppercase',
                                }}
                                numberOfLines={1}
                            >
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// --- Tarjeta de Historial Detallada ---
const HistoryCard = ({
    venta,
    isDark,
    primaryColor,
}: {
    venta: VentaData;
    isDark: boolean;
    primaryColor: string;
}) => {
    const [expanded, setExpanded] = useState(false);

    const fechaVenta = getFechaVenta(venta);
    const productosArr = getProductos(venta);
    const totalItems = productosArr.reduce((acc, p) => acc + getCantidad(p), 0);
    const montoTotal = getTotalVenta(venta);
    const metodoPago = getMetodoPago(venta);
    const esTarjeta =
        metodoPago.toUpperCase().includes('TARJETA') ||
        metodoPago.toUpperCase().includes('CARD');
    const numMesa = getNumMesa(venta);
    const nomMesa = getNombreMesa(venta);
    const mesero = getMesero(venta);

    const InfoRow = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value: string;
    }) => (
        <View
            className="flex-row items-center gap-3 py-2"
            style={{
                borderBottomWidth: 0.5,
                borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5',
            }}
        >
            <View style={{ opacity: 0.5 }}>{icon}</View>
            <Text className={cn('text-xs flex-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                {label}
            </Text>
            <Text
                className={cn(
                    'text-xs font-bold text-right',
                    isDark ? 'text-zinc-200' : 'text-zinc-800'
                )}
            >
                {value}
            </Text>
        </View>
    );

    return (
        <Card
            className={cn(
                'border-none rounded-[24px] mb-3 overflow-hidden',
                isDark ? 'bg-[#1E1E1E]' : 'bg-white shadow-md'
            )}
        >
            {/* Cabecera */}
            <View
                className={cn(
                    'p-5 flex-row justify-between items-start border-b',
                    isDark ? 'border-[#2A2A2A]' : 'border-zinc-100'
                )}
            >
                <View className="flex-row items-center gap-4">
                    <View
                        className={cn(
                            'w-12 h-12 rounded-[14px] items-center justify-center',
                            isDark ? 'bg-black/40' : 'bg-zinc-100'
                        )}
                    >
                        <Text
                            style={{ color: primaryColor }}
                            className="font-headline font-bold text-lg"
                        >
                            T{numMesa}
                        </Text>
                    </View>
                    <View>
                        <Text
                            className={cn(
                                'text-base font-bold',
                                isDark ? 'text-white' : 'text-zinc-900'
                            )}
                        >
                            Mesa {numMesa}
                            {nomMesa ? ` · ${nomMesa}` : ''}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                            <CalendarClock color={isDark ? '#71717a' : '#a1a1aa'} size={11} />
                            <Text
                                className={cn(
                                    'text-[11px] font-bold',
                                    isDark ? 'text-zinc-400' : 'text-zinc-500'
                                )}
                            >
                                {fechaVenta.toLocaleString([], {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                    <Text className="text-[10px] font-bold tracking-widest uppercase text-emerald-500">
                        PAGADO
                    </Text>
                </View>
            </View>

            {/* Monto y método de pago */}
            <View className="px-5 py-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                        Total Cobrado
                    </Text>
                    <Text
                        className={cn(
                            'text-3xl font-headline font-bold',
                            isDark ? 'text-white' : 'text-black'
                        )}
                    >
                        ${montoTotal.toFixed(2)}
                    </Text>
                </View>
                <View className="items-end gap-1">
                    <View
                        className={cn(
                            'flex-row items-center gap-2 px-3 py-2 rounded-xl',
                            isDark ? 'bg-black/30' : 'bg-zinc-50 border border-zinc-200'
                        )}
                    >
                        {esTarjeta ? (
                            <CreditCard color={isDark ? '#a1a1aa' : '#71717a'} size={14} />
                        ) : (
                            <Banknote color={isDark ? '#a1a1aa' : '#71717a'} size={14} />
                        )}
                        <Text
                            className={cn(
                                'text-xs font-bold uppercase',
                                isDark ? 'text-zinc-300' : 'text-zinc-700'
                            )}
                        >
                            {metodoPago}
                        </Text>
                    </View>
                    <Text
                        className={cn(
                            'text-[10px] text-right',
                            isDark ? 'text-zinc-500' : 'text-zinc-400'
                        )}
                    >
                        {totalItems} artículo{totalItems !== 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            {/* Expandible */}
            <View
                className={cn('border-t', isDark ? 'border-[#2A2A2A]' : 'border-zinc-100')}
            >
                <TouchableOpacity
                    onPress={() => setExpanded(!expanded)}
                    className="px-5 py-3.5 flex-row justify-between items-center"
                >
                    <Text
                        className={cn(
                            'text-xs font-bold',
                            isDark ? 'text-zinc-400' : 'text-zinc-500'
                        )}
                    >
                        {expanded ? 'Ocultar detalle' : 'Ver detalle completo'}
                    </Text>
                    {expanded ? (
                        <ChevronUp color={isDark ? '#71717a' : '#a1a1aa'} size={16} />
                    ) : (
                        <ChevronDown color={isDark ? '#71717a' : '#a1a1aa'} size={16} />
                    )}
                </TouchableOpacity>

                {expanded && (
                    <View className="px-5 pb-5">
                        {/* Info de servicio */}
                        <View
                            className={cn(
                                'rounded-2xl p-4 mb-3',
                                isDark ? 'bg-black/30' : 'bg-zinc-50'
                            )}
                        >
                            <View className="flex-row items-center gap-2 mb-3">
                                <User color={primaryColor} size={13} />
                                <Text
                                    style={{ color: primaryColor }}
                                    className="text-xs font-bold uppercase tracking-widest"
                                >
                                    Servicio
                                </Text>
                            </View>
                            <InfoRow
                                icon={<User color={isDark ? '#71717a' : '#a1a1aa'} size={13} />}
                                label="Atendió"
                                value={mesero.toUpperCase()}
                            />
                            <InfoRow
                                icon={<Text className="text-xs">🧾</Text>}
                                label="Folio de venta"
                                value={`#${String(venta._id).slice(-8).toUpperCase()}`}
                            />
                        </View>

                        {/* Platillos */}
                        <View
                            className={cn(
                                'rounded-2xl p-4',
                                isDark ? 'bg-black/30' : 'bg-zinc-50'
                            )}
                        >
                            <View className="flex-row items-center gap-2 mb-3">
                                <UtensilsCrossed color={primaryColor} size={13} />
                                <Text
                                    style={{ color: primaryColor }}
                                    className="text-xs font-bold uppercase tracking-widest"
                                >
                                    Platillos Ordenados
                                </Text>
                            </View>

                            {productosArr.length === 0 ? (
                                <Text
                                    className={cn(
                                        'text-xs text-center py-2',
                                        isDark ? 'text-zinc-500' : 'text-zinc-400'
                                    )}
                                >
                                    Sin detalle de platillos
                                </Text>
                            ) : (
                                productosArr.map((p, idx) => {
                                    const nombre = getNombreProducto(p);
                                    const cantidad = getCantidad(p);
                                    const subtotal = getSubtotalItem(p);

                                    return (
                                        <View
                                            key={idx}
                                            className="flex-row justify-between items-center py-1.5"
                                            style={{
                                                borderBottomWidth:
                                                    idx < productosArr.length - 1 ? 0.5 : 0,
                                                borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5',
                                            }}
                                        >
                                            <Text
                                                className={cn(
                                                    'text-xs flex-1 pr-2',
                                                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                                                )}
                                                numberOfLines={1}
                                            >
                                                <Text className="font-bold">{cantidad}x</Text>{' '}
                                                {nombre}
                                            </Text>
                                            <Text
                                                className={cn(
                                                    'text-xs font-mono font-bold',
                                                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                                                )}
                                            >
                                                {subtotal > 0 ? `$${subtotal.toFixed(2)}` : '—'}
                                            </Text>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    </View>
                )}
            </View>
        </Card>
    );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
export function ReportsView() {
    const { theme, primaryColor } = useTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [todasLasVentas, setTodasLasVentas] = useState<VentaData[]>([]);
    const [filtroTiempo, setFiltroTiempo] = useState<'Hoy' | 'Semana' | 'Mes'>('Semana');

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;

    const getCardWidth = (): StyleProp<ViewStyle> => {
        if (isDesktop) return { width: '25%' };
        if (isTablet) return { width: '50%' };
        return { width: '100%' };
    };

    // Cargar ventas al montar
    useEffect(() => {
        const cargarVentas = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://menu-master-api.onrender.com/ventas');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setTodasLasVentas(data);
                } else if (Array.isArray(data?.ventas)) {
                    setTodasLasVentas(data.ventas);
                } else if (Array.isArray(data?.data)) {
                    setTodasLasVentas(data.data);
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'No se pudo sincronizar el historial.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };
        cargarVentas();
    }, []);

    // ==========================================
    // PROCESAMIENTO DINÁMICO
    // ==========================================
    const dataProcesada = useMemo(() => {
        const now = new Date();
        const inicioHoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. Filtrar ventas por período
        const ventasFiltradas = todasLasVentas.filter((v) => {
            const fechaVenta = getFechaVenta(v);
            if (filtroTiempo === 'Hoy') {
                return fechaVenta >= inicioHoy;
            } else if (filtroTiempo === 'Semana') {
                const hace7Dias = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return fechaVenta >= hace7Dias;
            } else {
                return (
                    fechaVenta.getMonth() === now.getMonth() &&
                    fechaVenta.getFullYear() === now.getFullYear()
                );
            }
        });

        // 2. KPIs
        let ingresos = 0;
        ventasFiltradas.forEach((v) => (ingresos += getTotalVenta(v)));
        const pedidos = ventasFiltradas.length;
        const ticketPromedio = pedidos > 0 ? ingresos / pedidos : 0;

        // 3. Top Productos — usa helpers para normalizar campos
        const mapaProductos: Record<string, { sales: number; revenue: number }> = {};
        ventasFiltradas.forEach((v) => {
            const prods = getProductos(v);
            prods.forEach((p) => {
                const nombre = getNombreProducto(p);
                const cant = getCantidad(p);
                const precio = getPrecioUnitario(p);
                if (!mapaProductos[nombre]) mapaProductos[nombre] = { sales: 0, revenue: 0 };
                mapaProductos[nombre].sales += cant;
                mapaProductos[nombre].revenue += cant * precio;
            });
        });

        const topProducts = Object.keys(mapaProductos)
            .map((k) => ({ name: k, ...mapaProductos[k] }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 4);

        const productoEstrella = topProducts.length > 0 ? topProducts[0].name : 'Sin datos';

        // 4. Datos para la gráfica
        const chartMap: Record<string, number> = {};
        ventasFiltradas.forEach((v) => {
            const date = getFechaVenta(v);
            let key = '';
            if (filtroTiempo === 'Hoy') {
                key = `${date.getHours()}h`;
            } else if (filtroTiempo === 'Semana') {
                const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                key = dias[date.getDay()];
            } else {
                key = `${date.getDate()}`;
            }
            chartMap[key] = (chartMap[key] || 0) + getTotalVenta(v);
        });

        let chartData = Object.keys(chartMap).map((k) => ({ label: k, value: chartMap[k] }));
        if (chartData.length === 0) {
            chartData = [{ label: 'N/A', value: 0 }];
        }

        return { ventasFiltradas, kpis: { ventasHoy: ingresos, pedidosDia: pedidos, ticketPromedio, crack: productoEstrella }, topProducts, chartData };
    }, [todasLasVentas, filtroTiempo]);

    const { ventasFiltradas, kpis, topProducts, chartData } = dataProcesada;

    // ==========================================
    // EXPORTACIÓN
    // ==========================================
    const handleExportarPDF = () => {
        if (Platform.OS === 'web') {
            window.print();
            toast({ title: 'Preparando PDF', description: 'Configura la orientación en el panel de impresión.' });
        } else {
            toast({ title: 'Versión Móvil', description: 'Configura expo-print para exportar en dispositivos móviles.' });
        }
    };

    const handleExportarExcel = () => {
        if (Platform.OS === 'web') {
            let csvContent = 'Fecha,ID Mesa,Mesero,Metodo Pago,Total ($)\n';
            ventasFiltradas.forEach((v) => {
                const fecha = getFechaVenta(v).toLocaleString();
                const mesa = getNumMesa(v);
                const mesero = getMesero(v);
                const metodo = getMetodoPago(v);
                const total = getTotalVenta(v);
                csvContent += `"${fecha}","${mesa}","${mesero}","${metodo}","${total}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', `Reporte_Ventas_${filtroTiempo}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({ title: 'Descarga Iniciada', description: 'El reporte CSV se ha guardado en tu equipo.' });
        } else {
            toast({ title: 'Versión Móvil', description: 'La exportación requiere expo-file-system en app móvil.' });
        }
    };

    const formatearDinero = (monto: number) => `$${(monto || 0).toFixed(2)}`;

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : '#f3f4f6' }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full pb-24">

                    {/* HEADER */}
                    <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
                        <View>
                            <Text className={cn('text-3xl font-headline font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
                                Reportes y Analíticas
                            </Text>
                            <Text className="text-zinc-500">
                                Visualiza el rendimiento financiero del restaurante en tiempo real.
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-3 w-full md:w-auto">
                            <TouchableOpacity
                                onPress={handleExportarPDF}
                                className={cn(
                                    'flex-row items-center justify-center gap-2 px-5 py-3 rounded-2xl border flex-1 md:flex-none active:scale-95',
                                    isDark ? 'bg-[#1E1E1E] border-[#2A2A2A]' : 'bg-white border-zinc-200 shadow-sm'
                                )}
                            >
                                <FileText color={isDark ? '#d4d4d8' : '#52525b'} size={18} />
                                <Text className={cn('font-bold text-sm', isDark ? 'text-zinc-300' : 'text-zinc-700')}>PDF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleExportarExcel}
                                style={{ backgroundColor: primaryColor }}
                                className="flex-row items-center justify-center gap-2 px-5 py-3 rounded-2xl shadow-lg active:scale-95 flex-1 md:flex-none"
                            >
                                <Download color="white" size={18} />
                                <Text className="text-white font-bold text-sm">Excel CSV</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* FILTRO DE TIEMPO */}
                    <View className="px-2 mb-6 flex-row items-center gap-2">
                        {(['Hoy', 'Semana', 'Mes'] as const).map((rango) => {
                            const isSelected = filtroTiempo === rango;
                            return (
                                <TouchableOpacity
                                    key={rango}
                                    onPress={() => setFiltroTiempo(rango)}
                                    className={cn(
                                        'px-5 py-2.5 rounded-xl border',
                                        isSelected
                                            ? 'bg-blue-500/20 border-blue-500'
                                            : isDark
                                                ? 'border-[#2A2A2A] bg-[#1E1E1E]'
                                                : 'border-zinc-200 bg-white'
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            'text-xs font-bold',
                                            isSelected ? 'text-blue-500' : isDark ? 'text-zinc-400' : 'text-zinc-500'
                                        )}
                                    >
                                        {rango}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        {isLoading && <ActivityIndicator color={primaryColor} style={{ marginLeft: 16 }} />}
                    </View>

                    {/* KPIs */}
                    <View className="flex-row flex-wrap -mx-2 mb-6">
                        <StatCard title="Ventas del Período" value={formatearDinero(kpis.ventasHoy)} subtitle="Ingresos brutos acumulados" icon={TrendingUp} color="#10b981" isDark={isDark} widthStyle={getCardWidth()} />
                        <StatCard title="Pedidos Completados" value={`${kpis.pedidosDia}`} subtitle="Tickets generados exitosamente" icon={ShoppingBag} color="#3b82f6" isDark={isDark} widthStyle={getCardWidth()} />
                        <StatCard title="Ticket Promedio" value={formatearDinero(kpis.ticketPromedio)} subtitle="Gasto promedio por mesa" icon={DollarSign} color="#f59e0b" isDark={isDark} widthStyle={getCardWidth()} />
                        <StatCard title="Producto Estrella" value={kpis.crack} subtitle="El más vendido en volumen" icon={Award} color="#8b5cf6" isDark={isDark} widthStyle={getCardWidth()} />
                    </View>

                    {/* GRÁFICA + TOP PRODUCTOS */}
                    <View className="flex-col lg:flex-row gap-4 mb-6 px-2">

                        {/* Gráfica pill/cápsula */}
                        <Card className={cn('border-none flex-1 rounded-[32px] shadow-sm', isDark ? 'bg-[#1E1E1E]' : 'bg-white')}>
                            <CardContent className="p-6">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View>
                                        <Text className={cn('text-lg font-bold font-headline', isDark ? 'text-white' : 'text-zinc-900')}>
                                            Tendencia de Ingresos
                                        </Text>
                                        <Text className="text-sm text-zinc-500">
                                            Comportamiento en el período: {filtroTiempo}
                                        </Text>
                                    </View>
                                    <View className="p-3 bg-blue-500/10 rounded-xl">
                                        <BarChart3 color="#3b82f6" size={20} />
                                    </View>
                                </View>

                                {/* ← Gráfica nueva con pill bars + grid + eje Y + primaryColor */}
                                <SimpleBarChart
                                    data={chartData}
                                    primaryColor={primaryColor}
                                    isDark={isDark}
                                />
                            </CardContent>
                        </Card>

                        {/* Top Vendidos */}
                        <Card className={cn('border-none w-full lg:w-96 rounded-[32px] shadow-sm', isDark ? 'bg-[#1E1E1E]' : 'bg-white')}>
                            <CardContent className="p-6">
                                <Text className={cn('text-lg font-bold font-headline mb-1', isDark ? 'text-white' : 'text-zinc-900')}>
                                    Top Vendidos
                                </Text>
                                <Text className="text-sm text-zinc-500 mb-6">Productos con mayor volumen</Text>

                                {topProducts.length === 0 ? (
                                    <Text className="text-zinc-500 text-center py-4">
                                        No hay ventas registradas.
                                    </Text>
                                ) : (
                                    <View className="space-y-5">
                                        {topProducts.map((prod, index) => {
                                            const maxSales = topProducts[0].sales;
                                            const progress = (prod.sales / maxSales) * 100;
                                            return (
                                                <View key={index}>
                                                    <View className="flex-row justify-between mb-1.5">
                                                        <Text
                                                            className={cn(
                                                                'font-bold text-sm flex-1 mr-2',
                                                                isDark ? 'text-zinc-200' : 'text-zinc-800'
                                                            )}
                                                            numberOfLines={1}
                                                        >
                                                            {prod.name}
                                                        </Text>
                                                        <Text className="text-sm font-bold text-zinc-500">
                                                            {prod.sales} u.
                                                        </Text>
                                                    </View>
                                                    <View
                                                        className={cn(
                                                            'h-2 w-full rounded-full overflow-hidden',
                                                            isDark ? 'bg-[#2A2A2A]' : 'bg-zinc-100'
                                                        )}
                                                    >
                                                        <View
                                                            style={{
                                                                width: `${progress}%`,
                                                                backgroundColor:
                                                                    index === 0 ? primaryColor : '#8b5cf6',
                                                            }}
                                                            className="h-full rounded-full opacity-80"
                                                        />
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </CardContent>
                        </Card>
                    </View>

                    {/* HISTORIAL */}
                    <View className="px-2">
                        <Card className={cn('border-none overflow-hidden rounded-[32px] shadow-sm', isDark ? 'bg-[#1E1E1E]' : 'bg-white')}>
                            <View
                                className={cn(
                                    'p-6 border-b flex-row justify-between items-center',
                                    isDark ? 'border-[#2A2A2A]' : 'border-zinc-100'
                                )}
                            >
                                <View>
                                    <Text className={cn('text-lg font-bold font-headline', isDark ? 'text-white' : 'text-zinc-900')}>
                                        Historial de Transacciones
                                    </Text>
                                    <Text className="text-sm text-zinc-500">
                                        Listado de los tickets del período seleccionado
                                    </Text>
                                </View>
                                <Calendar color={isDark ? '#71717a' : '#a1a1aa'} size={20} />
                            </View>

                            <View
                                style={{
                                    padding: 16,
                                    backgroundColor: isDark ? '#121212' : '#f9fafb',
                                }}
                            >
                                {ventasFiltradas.length === 0 && !isLoading && (
                                    <Text className="text-zinc-500 text-center py-10 font-medium">
                                        No hay ventas registradas en este período.
                                    </Text>
                                )}
                                {ventasFiltradas.map((venta, index) => (
                                    <HistoryCard
                                        key={venta._id || index}
                                        venta={venta}
                                        isDark={isDark}
                                        primaryColor={primaryColor}
                                    />
                                ))}
                            </View>
                        </Card>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}