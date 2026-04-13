import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Platform, StyleProp, ViewStyle, Pressable, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock, LucideIcon, Star } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
// Importación corregida: ahora traemos el objeto 'api' completo
import { api } from '@/lib/api';

// ==========================================
// 1. INTERFACES (Tipado Fuerte)
// ==========================================

interface ChartData {
  name: string;
  sales: number;
}

interface StatData {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
}

interface RecentOrder {
  id: string;
  mesa: string;
  estado: string;
}

interface StatCardProps {
  stat: StatData;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
}

interface WeeklyChartProps {
  data: ChartData[];
  isDark: boolean;
  primaryColor: string;
}

interface RecentOrdersListProps {
  items: RecentOrder[];
  isDark: boolean;
  primaryColor: string;
}

const CHARCOAL_GRAY = "#171A1C";

// Datos simulados para la gráfica
const MOCK_CHART_DATA: ChartData[] = [
  { name: 'LUN', sales: 3800 },
  { name: 'MAR', sales: 3000 },
  { name: 'MIÉ', sales: 2100 },
  { name: 'JUE', sales: 2800 },
  { name: 'VIE', sales: 3400 },
  { name: 'SÁB', sales: 4000 },
  { name: 'DOM', sales: 3200 },
];

// ==========================================
// 2. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const StatCard = ({ stat, isDark, primaryColor, widthStyle }: StatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            "rounded-[24px] overflow-hidden transition-all duration-300",
            isDark ? "bg-zinc-900/40" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : (isDark ? 'rgba(39, 39, 42, 0.4)' : '#e4e4e7'),
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          <CardContent className="p-5">
            <View className="flex-row justify-between items-start">
              <View style={{ backgroundColor: `${primaryColor}20` }} className="p-3 rounded-2xl">
                {/* LIMPIEZA NATIVEWIND: Icono sin className, solo color y size */}
                <stat.icon size={22} color={primaryColor} />
              </View>
              <View className={cn(
                "flex-row items-center px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-500/10" :
                  stat.trend === 'down' ? "bg-rose-500/10" : "bg-blue-500/10"
              )}>
                <Text className={cn(
                  "text-[10px] font-bold",
                  stat.trend === 'up' ? "text-emerald-500" :
                    stat.trend === 'down' ? "text-rose-500" : "text-blue-500"
                )}>
                  {stat.change}
                </Text>
              </View>
            </View>
            <View className="mt-5">
              <Text className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</Text>
              <Text className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-zinc-900")}>
                {stat.value}
              </Text>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

const WeeklyChart = ({ data, isDark, primaryColor }: WeeklyChartProps) => {
  const maxAxis = 4000;
  const gridLines = [4000, 3000, 2000, 1000, 0];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(4);

  return (
    <Card className={cn("border-zinc-800/40 rounded-[32px] p-2 flex-1", isDark ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
      <CardHeader className="pb-2">
        <CardTitle><Text className={cn("font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>Ingresos Semanales</Text></CardTitle>
        <CardDescription><Text className="text-zinc-500 text-xs">Datos simulados (Próximamente en API)</Text></CardDescription>
      </CardHeader>
      <CardContent className="pt-8 pb-4">
        <View className="flex-row h-[240px] w-full">
          <View className="justify-between pr-4 pb-8">
            {gridLines.map((val) => (
              <Text key={val} className="text-zinc-600 text-[10px] font-bold text-right w-8">{val}</Text>
            ))}
          </View>
          <View className="flex-1 relative">
            <View className="absolute inset-0 justify-between pb-9">
              {gridLines.map((val) => (
                <View key={val} className={cn("w-full h-[1px]", isDark ? "bg-zinc-800/20" : "bg-zinc-200")} />
              ))}
            </View>
            <View className="flex-1 flex-row items-end justify-between px-1 pb-8">
              {data.map((entry: ChartData, index: number) => {
                const heightPercent = Math.max((entry.sales / maxAxis) * 100, 5);
                const isActive = hoveredIndex === index || selectedIndex === index;

                return (
                  <Pressable
                    key={index}
                    className="items-center flex-1 h-full justify-end relative"
                    onHoverIn={() => setHoveredIndex(index)}
                    onHoverOut={() => setHoveredIndex(null)}
                    onPress={() => setSelectedIndex(index)}
                  >
                    <View
                      style={{
                        height: `${heightPercent}%`,
                        width: '75%',
                        backgroundColor: isActive ? primaryColor : `${primaryColor}40`,
                        borderRadius: 9999,
                      }}
                      className="transition-all duration-300"
                    />
                    <Text className={cn(
                      "text-[10px] mt-4 font-bold uppercase transition-colors",
                      isActive ? (isDark ? "text-white" : "text-black") : "text-zinc-500"
                    )}>
                      {entry.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const RecentOrdersList = ({ items, isDark, primaryColor }: RecentOrdersListProps) => {
  const [isHoveredBtn, setIsHoveredBtn] = useState(false);

  return (
    <Card className={cn("border-zinc-800/40 rounded-[32px] p-2 flex-1", isDark ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
      <CardHeader>
        <CardTitle><Text className={cn("font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>Actividad Reciente</Text></CardTitle>
        <CardDescription><Text className="text-zinc-500 text-xs">Últimos pedidos del día.</Text></CardDescription>
      </CardHeader>
      <CardContent>
        <View className="space-y-1">
          {items.length === 0 && (
            <Text className="text-zinc-500 text-center py-4">No hay pedidos recientes</Text>
          )}
          {items.map((item: RecentOrder, i: number) => (
            <View key={i} className="flex-row items-center justify-between py-3 border-b border-zinc-800/20 last:border-0">
              <View className="flex-row items-center gap-4">
                <View style={{ backgroundColor: `${primaryColor}15` }} className="w-9 h-9 rounded-xl items-center justify-center">
                  {/* LIMPIEZA NATIVEWIND: Icono sin className */}
                  <Star color={primaryColor} size={16} />
                </View>
                <View>
                  <Text className={cn("font-bold text-sm", isDark ? "text-white" : "text-zinc-900")}>Pedido {item.id.slice(-4)}</Text>
                  <Text className="text-[10px] text-zinc-500 font-medium">{item.mesa}</Text>
                </View>
              </View>
              <Text className={cn(
                "text-[10px] font-black px-2 py-1 rounded-md",
                item.estado === 'PAGADO' ? "bg-emerald-500/20 text-emerald-500" : "bg-blue-500/20 text-blue-500"
              )}>
                {item.estado}
              </Text>
            </View>
          ))}
          <Pressable
            onHoverIn={() => setIsHoveredBtn(true)}
            onHoverOut={() => setIsHoveredBtn(false)}
            onPressIn={() => setIsHoveredBtn(true)}
            onPressOut={() => setIsHoveredBtn(false)}
            style={{ backgroundColor: primaryColor, transform: [{ scale: isHoveredBtn ? 0.98 : 1 }] }}
            className="w-full mt-6 p-4 rounded-2xl items-center shadow-lg transition-transform"
          >
            <Text className="text-white font-bold tracking-wide">Ver Todos los Reportes</Text>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (Layout)
// ==========================================

export function AdminDashboard() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getStatCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '25%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // FETCH DE DATOS REALES (Uso correcto de la API refactorizada)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Llamada a tu API real
        const response = await api.stats.getCompleto();

        const kpis = response.kpis;
        setStatsData([
          {
            label: 'Ingresos de Hoy',
            value: `$${kpis.ventasHoy.toFixed(2)}`,
            change: `Mes: $${kpis.ingresosMes.toFixed(2)}`,
            icon: DollarSign,
            trend: 'up'
          },
          {
            label: 'Ocupación de Mesas',
            value: `${kpis.ocupacion.ocupadas} Mesas`,
            change: `${kpis.ocupacion.porcentaje}% cap.`,
            icon: Users,
            trend: kpis.ocupacion.porcentaje > 50 ? 'up' : 'neutral'
          },
          {
            label: 'Ticket Promedio',
            value: `$${kpis.ticketPromedio.toFixed(2)}`,
            change: 'Diario',
            icon: Clock,
            trend: 'neutral'
          },
          {
            label: 'Pedidos Hoy',
            value: `${kpis.pedidosDia}`,
            change: kpis.crack !== "Sin datos" ? `Top: ${kpis.crack.substring(0, 10)}.` : 'Sin datos PHP',
            icon: TrendingUp,
            trend: 'up'
          },
        ]);

        const mappedOrders = response.recientes.map((p: any) => ({
          id: p._id,
          mesa: p.id_mesa?.numero_mesa ? `Mesa ${p.id_mesa.numero_mesa}` : 'Mesa N/A',
          estado: p.estado
        }));
        setRecentOrders(mappedOrders);

      } catch (error) {
        console.error("Error al cargar estadísticas reales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 24 : 0 }}
      >
        <View className="px-4 pb-12 max-w-[1400px] mx-auto w-full" style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 32 }}>

          <View className="mb-8 px-2 flex-row justify-between items-center">
            <View>
              <Text className={cn("text-3xl font-headline font-bold mb-1 tracking-tight", isDark ? "text-white" : "text-zinc-900")}>
                Dashboard Administrativo
              </Text>
              <Text className="text-zinc-500 text-sm">
                Métricas en tiempo real desde MongoDB y MySQL.
              </Text>
            </View>
            {isLoading && <ActivityIndicator color={primaryColor} />}
          </View>

          {/* Tarjetas Superiores */}
          <View className="flex-row flex-wrap mb-4 -mx-2">
            {!isLoading && statsData.map((stat: StatData, i: number) => (
              <StatCard
                key={i}
                stat={stat}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getStatCardWidth()}
              />
            ))}
          </View>

          {/* Gráficas y Listas */}
          <View className="px-2" style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
            <View style={{ flex: isDesktop ? 1.6 : 1 }}>
              <WeeklyChart data={MOCK_CHART_DATA} isDark={isDark} primaryColor={primaryColor} />
            </View>

            <View style={{ flex: isDesktop ? 1 : 1 }}>
              <RecentOrdersList items={recentOrders} isDark={isDark} primaryColor={primaryColor} />
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}