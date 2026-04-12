import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Platform, StyleProp, ViewStyle, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock, LucideIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

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

interface PopularItem {
  name: string;
  orders: number;
  trend: number;
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

interface PopularItemsListProps {
  items: PopularItem[];
  isDark: boolean;
  primaryColor: string;
}

// ==========================================
// 2. DATOS (Mocks)
// ==========================================
const CHART_DATA: ChartData[] = [
  { name: 'LUN', sales: 3800 },
  { name: 'MAR', sales: 3000 },
  { name: 'MIÉ', sales: 2100 },
  { name: 'JUE', sales: 2800 },
  { name: 'VIE', sales: 3400 },
  { name: 'SÁB', sales: 4000 },
  { name: 'DOM', sales: 3200 },
];

const STATS_DATA: StatData[] = [
  { label: 'Ingresos Totales', value: '$24,560', change: '+12.5%', icon: DollarSign, trend: 'up' },
  { label: 'Mesas Activas', value: '18/25', change: '72% cap.', icon: Users, trend: 'neutral' },
  { label: 'Pedido Promedio', value: '$42.50', change: '-2.1%', icon: Clock, trend: 'down' },
  { label: 'Artículos Vend.', value: '1,240', change: '+18.4%', icon: TrendingUp, trend: 'up' },
];

const POPULAR_ITEMS: PopularItem[] = [
  { name: 'Hamburguesa de la casa', orders: 154, trend: 15 },
  { name: 'Pasta con trufa', orders: 128, trend: 8 },
  { name: 'Pizza Margarita', orders: 110, trend: -5 },
  { name: 'Ensalada César', orders: 94, trend: 20 },
];

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 3. SUBCOMPONENTES INTERACTIVOS
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
        <CardDescription><Text className="text-zinc-500 text-xs">Selecciona un día o pasa el cursor para ver detalles.</Text></CardDescription>
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

                const isHovered = hoveredIndex === index;
                const isSelected = selectedIndex === index;
                const isActive = isHovered || isSelected;

                return (
                  <Pressable
                    key={index}
                    className="items-center flex-1 h-full justify-end relative"
                    onHoverIn={() => setHoveredIndex(index)}
                    onHoverOut={() => setHoveredIndex(null)}
                    onPress={() => setSelectedIndex(index)}
                  >
                    {isHovered && (
                      <View
                        className="absolute -top-12 px-3 py-2 rounded-xl z-50 shadow-lg items-center justify-center min-w-[70px]"
                        style={{ backgroundColor: isDark ? '#3f3f46' : '#18181b' }}
                      >
                        <Text className="text-white text-xs font-bold">{entry.name}</Text>
                        <Text className="text-zinc-300 text-[10px]">${entry.sales}</Text>
                        <View
                          className="absolute -bottom-1 w-2 h-2 rotate-45"
                          style={{ backgroundColor: isDark ? '#3f3f46' : '#18181b' }}
                        />
                      </View>
                    )}

                    <View
                      style={{
                        height: `${heightPercent}%`,
                        width: '75%',
                        backgroundColor: isActive ? primaryColor : `${primaryColor}40`,
                        borderRadius: 9999,
                        transform: [{ scaleY: isHovered ? 1.03 : 1 }, { translateY: isHovered ? -2 : 0 }]
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

const PopularItemsList = ({ items, isDark, primaryColor }: PopularItemsListProps) => {
  const [isHoveredBtn, setIsHoveredBtn] = useState(false);

  return (
    <Card className={cn("border-zinc-800/40 rounded-[32px] p-2 flex-1", isDark ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
      <CardHeader>
        <CardTitle><Text className={cn("font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>Populares</Text></CardTitle>
        <CardDescription><Text className="text-zinc-500 text-xs">Lo más pedido este mes.</Text></CardDescription>
      </CardHeader>
      <CardContent>
        <View className="space-y-1">
          {items.map((item: PopularItem, i: number) => (
            <View key={i} className="flex-row items-center justify-between py-3 border-b border-zinc-800/20 last:border-0">
              <View className="flex-row items-center gap-4">
                <View style={{ backgroundColor: `${primaryColor}15` }} className="w-9 h-9 rounded-xl items-center justify-center">
                  <Text style={{ color: primaryColor }} className="text-xs font-black">#{i + 1}</Text>
                </View>
                <View>
                  <Text className={cn("font-bold text-sm", isDark ? "text-white" : "text-zinc-900")}>{item.name}</Text>
                  <Text className="text-[10px] text-zinc-500 font-medium">{item.orders} pedidos</Text>
                </View>
              </View>
              <Text className={cn("text-xs font-black", item.trend > 0 ? "text-emerald-500" : "text-rose-500")}>
                {item.trend > 0 ? '+' : ''}{item.trend}%
              </Text>
            </View>
          ))}

          <Pressable
            onHoverIn={() => setIsHoveredBtn(true)}
            onHoverOut={() => setIsHoveredBtn(false)}
            onPressIn={() => setIsHoveredBtn(true)}
            onPressOut={() => setIsHoveredBtn(false)}
            style={{
              backgroundColor: primaryColor,
              transform: [{ scale: isHoveredBtn ? 0.98 : 1 }]
            }}
            className="w-full mt-6 p-4 rounded-2xl items-center shadow-lg shadow-black/20 transition-transform"
          >
            <Text className="text-white font-bold tracking-wide">Ver Todos los Reportes</Text>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (Layout)
// ==========================================

export function AdminDashboard() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';

  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getStatCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '25%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  return (
    // Se añade SafeAreaView como contenedor principal
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      {/* Se añade StatusBar para respetar los iconos del celular */}
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 24 : 0 }}
      >
        <View
          className="px-4 pb-12 max-w-[1400px] mx-auto w-full"
          // Aquí aplicamos el empuje dinámico para Android (StatusBar.currentHeight) o iOS
          style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 32 }}
        >

          <View className="mb-8 px-2">
            <Text className={cn("text-3xl font-headline font-bold mb-1 tracking-tight", isDark ? "text-white" : "text-zinc-900")}>
              Descripción General Operativa
            </Text>
            <Text className="text-zinc-500 text-sm">
              Métricas de rendimiento en tiempo real para su restaurante.
            </Text>
          </View>

          <View className="flex-row flex-wrap mb-4 -mx-2">
            {STATS_DATA.map((stat: StatData, i: number) => (
              <StatCard
                key={i}
                stat={stat}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getStatCardWidth()}
              />
            ))}
          </View>

          <View
            className="px-2"
            style={{
              flexDirection: isDesktop ? 'row' : 'column',
              gap: 24
            }}
          >
            <View style={{ flex: isDesktop ? 1.6 : 1 }}>
              <WeeklyChart data={CHART_DATA} isDark={isDark} primaryColor={primaryColor} />
            </View>

            <View style={{ flex: isDesktop ? 1 : 1 }}>
              <PopularItemsList items={POPULAR_ITEMS} isDark={isDark} primaryColor={primaryColor} />
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}