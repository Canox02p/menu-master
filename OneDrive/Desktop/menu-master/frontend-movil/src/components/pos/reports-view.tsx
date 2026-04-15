'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp, DollarSign, ShoppingBag, Award,
    Download, FileText, Calendar, CreditCard, ChevronRight
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 1. INTERFACES
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
    id_mesa?: { numero_mesa: number }; // Populated data
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
// 2. COMPONENTES HIJOS
// ==========================================
const StatCard = ({ title, value, subtitle, icon: Icon, color, isDark, widthStyle }: StatCardProps) => (
    <View style={widthStyle} className="p-2">
        <Card className={cn("border-none rounded-[24px]", isDark ? "bg-zinc-900/40" : "bg-white shadow-sm")}>
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
    const [filtroTiempo, setFiltroTiempo] = useState<'Hoy' | 'Semana' | 'Mes'>('Hoy');

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;

    const getCardWidth = (): StyleProp<ViewStyle> => {
        if (isDesktop) return { width: '25%' };
        if (isTablet) return { width: '50%' };
        return { width: '100%' };
    };

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            setIsLoading(true);
            // Hacemos fetch a tu endpoint de Node.js
            const response = await fetch('https://menu-master-api.onrender.com/admin/stats-completo');
            const data = await response.json();

            if (data.kpis) setKpis(data.kpis);
            if (data.recientes) setRecientes(data.recientes);

        } catch (error) {
            console.error("Error al cargar reportes:", error);
            toast({ title: "Error", description: "No se pudieron cargar las estadísticas", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportarPDF = () => {
        toast({ title: "Exportando...", description: "Generando reporte en PDF. (Requiere librería expo-print)" });
        // Aquí a futuro integrarás expo-print o html-to-pdf
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
                                className={cn("flex-row items-center justify-center gap-2 px-5 py-3 rounded-2xl border flex-1 md:flex-none",
                                    isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-white border-zinc-200 shadow-sm")}
                            >
                                <FileText color={isDark ? "#d4d4d8" : "#52525b"} size={18} />
                                <Text className={cn("font-bold text-sm", isDark ? "text-zinc-300" : "text-zinc-700")}>Exportar PDF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ backgroundColor: primaryColor }}
                                className="flex-row items-center justify-center gap-2 px-5 py-3 rounded-2xl shadow-lg shadow-primary/30 flex-1 md:flex-none"
                            >
                                <Download color="white" size={18} />
                                <Text className="text-white font-bold text-sm">Excel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* SELECTOR DE TIEMPO */}
                    <View className="px-2 mb-6 flex-row gap-2">
                        {['Hoy', 'Semana', 'Mes'].map((rango) => (
                            <TouchableOpacity
                                key={rango}
                                onPress={() => setFiltroTiempo(rango as any)}
                                className={cn("px-4 py-2 rounded-xl border",
                                    filtroTiempo === rango
                                        ? `bg-blue-500/20 border-blue-500`
                                        : (isDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-white")
                                )}
                            >
                                <Text className={cn("text-xs font-bold", filtroTiempo === rango ? "text-blue-500" : "text-zinc-500")}>
                                    {rango}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {isLoading && <ActivityIndicator color={primaryColor} className="ml-4" />}
                    </View>

                    {/* TARJETAS DE KPIs */}
                    <View className="flex-row flex-wrap -mx-2 mb-8">
                        <StatCard
                            title="Ventas del Día"
                            value={formatearDinero(kpis?.ventasHoy || 0)}
                            subtitle="Ingresos totales de hoy"
                            icon={TrendingUp} color="#10b981" isDark={isDark} widthStyle={getCardWidth()}
                        />
                        <StatCard
                            title="Pedidos Atendidos"
                            value={`${kpis?.pedidosDia || 0}`}
                            subtitle="Tickets generados hoy"
                            icon={ShoppingBag} color="#3b82f6" isDark={isDark} widthStyle={getCardWidth()}
                        />
                        <StatCard
                            title="Ticket Promedio"
                            value={formatearDinero(kpis?.ticketPromedio || 0)}
                            subtitle="Gasto promedio por mesa"
                            icon={DollarSign} color="#f59e0b" isDark={isDark} widthStyle={getCardWidth()}
                        />
                        <StatCard
                            title="Producto Estrella"
                            value={kpis?.crack || 'Ninguno'}
                            subtitle="Más rentable en inventario"
                            icon={Award} color="#8b5cf6" isDark={isDark} widthStyle={getCardWidth()}
                        />
                    </View>

                    {/* HISTORIAL DE VENTAS */}
                    <View className="px-2">
                        <Card className={cn("border-none overflow-hidden rounded-[32px]", isDark ? "bg-zinc-900/40" : "bg-white shadow-sm")}>
                            <View className={cn("p-6 border-b flex-row justify-between items-center", isDark ? "border-zinc-800/60" : "border-zinc-100")}>
                                <View>
                                    <Text className={cn("text-lg font-bold font-headline", isDark ? "text-white" : "text-zinc-900")}>Historial de Ventas Recientes</Text>
                                    <Text className="text-sm text-zinc-500">Últimas transacciones procesadas</Text>
                                </View>
                                <Calendar color={isDark ? "#71717a" : "#a1a1aa"} size={20} />
                            </View>

                            <View className="p-2">
                                {recientes.length === 0 && !isLoading && (
                                    <Text className="text-zinc-500 text-center py-10">No hay ventas registradas aún.</Text>
                                )}

                                {recientes.map((venta, index) => (
                                    <TouchableOpacity
                                        key={venta._id || index}
                                        className={cn("flex-row items-center justify-between p-4 rounded-2xl mb-1",
                                            isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50")}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View className={cn("w-12 h-12 rounded-xl items-center justify-center", isDark ? "bg-zinc-800" : "bg-zinc-100")}>
                                                <CreditCard color={primaryColor} size={20} />
                                            </View>
                                            <View>
                                                <Text className={cn("font-bold text-base", isDark ? "text-zinc-200" : "text-zinc-800")}>
                                                    Mesa {venta.id_mesa?.numero_mesa || 'N/A'}
                                                </Text>
                                                <Text className="text-xs text-zinc-500">
                                                    {new Date(venta.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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