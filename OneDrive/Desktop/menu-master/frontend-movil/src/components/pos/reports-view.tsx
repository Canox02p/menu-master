'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import {
    TrendingUp, DollarSign, ShoppingBag, Award,
    Download, FileText, Calendar, CreditCard, ChevronRight, BarChart3
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 1. INTERFACES Y MOCKS
// ==========================================
interface KpiStats {
    ventasHoy: number;
    pedidosDia: number;
    ingresosMes: number;
    ticketPromedio: number;
    crack: string;
}

interface VentaReciente {
    _id: string;
    total: number;
    estado: string;
    fecha_creacion: string;
    id_mesa?: { numero_mesa: number };
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

// Datos falsos para la gráfica mientras conectas el backend real
const MOCK_CHART_DATA = [
    { label: 'Lun', value: 1200 },
    { label: 'Mar', value: 1900 },
    { label: 'Mié', value: 1500 },
    { label: 'Jue', value: 2200 },
    { label: 'Vie', value: 3800 },
    { label: 'Sáb', value: 4500 },
    { label: 'Dom', value: 4100 },
];

const MOCK_TOP_PRODUCTS = [
    { name: 'Tacos al Pastor', sales: 145, revenue: 3625 },
    { name: 'Margarita Clásica', sales: 98, revenue: 4900 },
    { name: 'Guacamole c/ Totopos', sales: 85, revenue: 1275 },
    { name: 'Ceviche de Pescado', sales: 64, revenue: 5760 },
];

// ==========================================
// 2. COMPONENTES HIJOS
// ==========================================
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
                    <Text className={cn("text-3xl font-headline font-bold mb-1", isDark ? "text-white" : "text-zinc-900")} numberOfLines={1} adjustsFontSizeToFit>
                        {value}
                    </Text>
                    <Text className="text-xs font-medium text-zinc-500">{subtitle}</Text>
                </View>
            </CardContent>
        </Card>
    </View>
);

// Gráfica de barras responsiva sin librerías externas
const SimpleBarChart = ({ data, primaryColor, isDark }: { data: { label: string, value: number }[], primaryColor: string, isDark: boolean }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <View className="flex-row items-end justify-between h-48 mt-4 pt-4 border-t" style={{ borderTopColor: isDark ? '#2A2A2A' : '#f4f4f5' }}>
            {data.map((item, i) => {
                const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                    <View key={i} className="items-center flex-1">
                        {/* Tooltip invisible (solo se ve el texto arriba) */}
                        <Text className="text-[9px] font-bold text-zinc-500 mb-2">${(item.value / 1000).toFixed(1)}k</Text>

                        {/* Barra */}
                        <View className="w-8 md:w-12 bg-zinc-200 dark:bg-[#2A2A2A] rounded-t-lg overflow-hidden justify-end">
                            <View
                                style={{ height: `${heightPercentage}%`, backgroundColor: primaryColor }}
                                className="w-full rounded-t-lg opacity-80"
                            />
                        </View>

                        {/* Etiqueta Eje X */}
                        <Text className={cn("text-xs font-bold mt-3", isDark ? "text-zinc-400" : "text-zinc-600")}>{item.label}</Text>
                    </View>
                );
            })}
        </View>
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
    const [kpis, setKpis] = useState<KpiStats | null>(null);
    const [recientes, setRecientes] = useState<VentaReciente[]>([]);
    const [filtroTiempo, setFiltroTiempo] = useState<'Hoy' | 'Semana' | 'Mes'>('Semana');

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;

    const getCardWidth = (): StyleProp<ViewStyle> => {
        if (isDesktop) return { width: '25%' };
        if (isTablet) return { width: '50%' };
        return { width: '100%' };
    };

    useEffect(() => {
        cargarEstadisticas();
    }, [filtroTiempo]); // Recarga si cambias de filtro

    const cargarEstadisticas = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://menu-master-api.onrender.com/admin/stats-completo');
            const data = await response.json();

            if (data.kpis) setKpis(data.kpis);
            if (data.recientes) setRecientes(data.recientes);

        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar las estadísticas", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // LÓGICA DE EXPORTACIÓN
    // ==========================================
    const handleExportarPDF = () => {
        if (Platform.OS === 'web') {
            // En web, abrimos el diálogo nativo de impresión del navegador
            window.print();
            toast({ title: "Preparando PDF", description: "Configura la orientación en el panel de impresión." });
        } else {
            toast({ title: "Versión Móvil", description: "Para exportar a PDF en móvil, se requiere configurar expo-print en el futuro." });
        }
    };

    const handleExportarExcel = () => {
        if (Platform.OS === 'web') {
            // Construimos un CSV manualmente
            let csvContent = "Fecha,ID Mesa,Total ($),Estado\n";
            recientes.forEach(v => {
                const fecha = new Date(v.fecha_creacion).toLocaleString();
                const mesa = v.id_mesa?.numero_mesa || 'N/A';
                csvContent += `"${fecha}","${mesa}","${v.total}","${v.estado}"\n`;
            });

            // Creamos un Blob y forzamos la descarga
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Reporte_Ventas_${filtroTiempo}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({ title: "Descarga Iniciada", description: "El reporte CSV se ha guardado en tu equipo." });
        } else {
            toast({ title: "Versión Móvil", description: "La exportación a Excel directa requiere expo-file-system." });
        }
    };

    const formatearDinero = (monto: number) => `$${(monto || 0).toFixed(2)}`;

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full pb-24">

                    {/* HEADER Y EXPORTACIÓN */}
                    <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
                        <View>
                            <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                                Reportes y Analíticas
                            </Text>
                            <Text className="text-zinc-500">Visualiza el rendimiento financiero del restaurante.</Text>
                        </View>

                        <View className="flex-row items-center gap-3 w-full md:w-auto">
                            <TouchableOpacity
                                onPress={handleExportarPDF}
                                className={cn("flex-row items-center justify-center gap-2 px-5 py-3 rounded-2xl border flex-1 md:flex-none active:scale-95 transition-transform",
                                    isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-white border-zinc-200 shadow-sm")}
                            >
                                <FileText color={isDark ? "#d4d4d8" : "#52525b"} size={18} />
                                <Text className={cn("font-bold text-sm", isDark ? "text-zinc-300" : "text-zinc-700")}>PDF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleExportarExcel}
                                style={{ backgroundColor: primaryColor }}
                                className="flex-row items-center justify-center gap-2 px-5 py-3 rounded-2xl shadow-lg active:scale-95 transition-transform flex-1 md:flex-none"
                            >
                                <Download color="white" size={18} />
                                <Text className="text-white font-bold text-sm">Excel CSV</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* SELECTOR DE TIEMPO */}
                    <View className="px-2 mb-6 flex-row items-center gap-2">
                        {['Hoy', 'Semana', 'Mes'].map((rango) => {
                            const isSelected = filtroTiempo === rango;
                            return (
                                <TouchableOpacity
                                    key={rango}
                                    onPress={() => setFiltroTiempo(rango as any)}
                                    className={cn("px-5 py-2.5 rounded-xl border transition-colors",
                                        isSelected
                                            ? `bg-blue-500/20 border-blue-500`
                                            : (isDark ? "border-[#2A2A2A] bg-[#1E1E1E]" : "border-zinc-200 bg-white")
                                    )}
                                >
                                    <Text className={cn("text-xs font-bold", isSelected ? "text-blue-500" : (isDark ? "text-zinc-400" : "text-zinc-500"))}>
                                        {rango}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                        {isLoading && <ActivityIndicator color={primaryColor} className="ml-4" />}
                    </View>

                    {/* TARJETAS DE KPIs */}
                    <View className="flex-row flex-wrap -mx-2 mb-6">
                        <StatCard
                            title="Ventas del Período"
                            value={formatearDinero(kpis?.ventasHoy || 12450)} // Puesto un valor por defecto para que no se vea vacío
                            subtitle="Ingresos brutos acumulados"
                            icon={TrendingUp} color="#10b981" isDark={isDark} widthStyle={getCardWidth()}
                        />
                        <StatCard
                            title="Pedidos Completados"
                            value={`${kpis?.pedidosDia || 48}`}
                            subtitle="Tickets generados exitosamente"
                            icon={ShoppingBag} color="#3b82f6" isDark={isDark} widthStyle={getCardWidth()}
                        />
                        <StatCard
                            title="Ticket Promedio"
                            value={formatearDinero(kpis?.ticketPromedio || 259)}
                            subtitle="Gasto promedio por mesa"
                            icon={DollarSign} color="#f59e0b" isDark={isDark} widthStyle={getCardWidth()}
                        />
                        <StatCard
                            title="Producto Estrella"
                            value={kpis?.crack || 'Margarita'}
                            subtitle="El más rentable del inventario"
                            icon={Award} color="#8b5cf6" isDark={isDark} widthStyle={getCardWidth()}
                        />
                    </View>

                    {/* SECCIÓN DE GRÁFICAS Y TOP PRODUCTOS */}
                    <View className="flex-col lg:flex-row gap-4 mb-6 px-2">

                        {/* GRÁFICA DE BARRAS */}
                        <Card className={cn("border-none flex-1 rounded-[32px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                            <CardContent className="p-6">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View>
                                        <Text className={cn("text-lg font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>
                                            Tendencia de Ingresos
                                        </Text>
                                        <Text className="text-sm text-zinc-500">Comparativa diaria de la semana actual</Text>
                                    </View>
                                    <View className="p-3 bg-blue-500/10 rounded-xl">
                                        <BarChart3 color="#3b82f6" size={20} />
                                    </View>
                                </View>

                                <SimpleBarChart data={MOCK_CHART_DATA} primaryColor={primaryColor} isDark={isDark} />
                            </CardContent>
                        </Card>

                        {/* LISTA DE PRODUCTOS TOP */}
                        <Card className={cn("border-none w-full lg:w-96 rounded-[32px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                            <CardContent className="p-6">
                                <Text className={cn("text-lg font-bold font-headline mb-1", isDark ? "text-white" : "text-zinc-900")}>
                                    Top Vendidos
                                </Text>
                                <Text className="text-sm text-zinc-500 mb-6">Productos con mayor volumen</Text>

                                <View className="space-y-5">
                                    {MOCK_TOP_PRODUCTS.map((prod, index) => {
                                        const maxSales = MOCK_TOP_PRODUCTS[0].sales;
                                        const progress = (prod.sales / maxSales) * 100;
                                        return (
                                            <View key={index}>
                                                <View className="flex-row justify-between mb-1.5">
                                                    <Text className={cn("font-bold text-sm", isDark ? "text-zinc-200" : "text-zinc-800")}>{prod.name}</Text>
                                                    <Text className="text-sm font-bold text-zinc-500">{prod.sales} u.</Text>
                                                </View>
                                                <View className={cn("h-2 w-full rounded-full overflow-hidden", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                                                    <View
                                                        style={{ width: `${progress}%`, backgroundColor: index === 0 ? primaryColor : '#8b5cf6' }}
                                                        className="h-full rounded-full opacity-80"
                                                    />
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </CardContent>
                        </Card>
                    </View>

                    {/* HISTORIAL DE VENTAS DETALLADO */}
                    <View className="px-2">
                        <Card className={cn("border-none overflow-hidden rounded-[32px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                            <View className={cn("p-6 border-b flex-row justify-between items-center", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
                                <View>
                                    <Text className={cn("text-lg font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>Historial de Transacciones</Text>
                                    <Text className="text-sm text-zinc-500">Listado de los tickets más recientes</Text>
                                </View>
                                <Calendar color={isDark ? "#71717a" : "#a1a1aa"} size={20} />
                            </View>

                            <View className="p-2">
                                {recientes.length === 0 && !isLoading && (
                                    <Text className="text-zinc-500 text-center py-10 font-medium">No hay ventas registradas en este período.</Text>
                                )}

                                {recientes.map((venta, index) => (
                                    <TouchableOpacity
                                        key={venta._id || index}
                                        activeOpacity={0.7}
                                        className={cn("flex-row items-center justify-between p-4 rounded-2xl mb-1 transition-colors",
                                            isDark ? "hover:bg-[#2A2A2A]" : "hover:bg-zinc-50")}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View className={cn("w-12 h-12 rounded-xl items-center justify-center", isDark ? "bg-black/40" : "bg-zinc-100")}>
                                                <CreditCard color={primaryColor} size={20} />
                                            </View>
                                            <View>
                                                <Text className={cn("font-bold text-base", isDark ? "text-zinc-200" : "text-zinc-800")}>
                                                    Mesa {venta.id_mesa?.numero_mesa || 'N/A'}
                                                </Text>
                                                <Text className="text-xs text-zinc-500 font-medium">
                                                    {new Date(venta.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Efectivo
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center gap-6">
                                            <View className="items-end">
                                                <Text className={cn("font-mono font-bold text-lg", isDark ? "text-white" : "text-zinc-900")}>
                                                    {formatearDinero(venta.total)}
                                                </Text>
                                                <Text className={cn("text-[10px] font-bold uppercase", venta.estado === 'PAGADO' ? "text-emerald-500" : "text-amber-500")}>
                                                    {venta.estado}
                                                </Text>
                                            </View>
                                            <ChevronRight color={isDark ? "#52525b" : "#d4d4d8"} size={20} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Card>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}