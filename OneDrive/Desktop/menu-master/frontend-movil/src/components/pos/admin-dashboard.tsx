import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

const chartData = [
  { name: 'LUN', sales: 3800 },
  { name: 'MAR', sales: 3000 },
  { name: 'MIÉ', sales: 2100 },
  { name: 'JUE', sales: 2800 },
  { name: 'VIE', sales: 3400 },
  { name: 'SÁB', sales: 4000 },
  { name: 'DOM', sales: 3200 },
];

export function AdminDashboard() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';

  const charcoalGray = "#171A1C";

  const maxAxis = 4000;
  const gridLines = [4000, 3000, 2000, 1000, 0];
  const peakValue = Math.max(...chartData.map(d => d.sales));

  const stats = [
    { label: 'Ingresos Totales', value: '$24,560', change: '+12.5%', icon: DollarSign, trend: 'up' },
    { label: 'Mesas Activas', value: '18/25', change: '72% de capacidad', icon: Users, trend: 'neutral' },
    { label: 'Pedido Promedio', value: '$42.50', change: '-2.1%', icon: Clock, trend: 'down' },
    { label: 'Artículos Vendidos', value: '1,240', change: '+18.4%', icon: TrendingUp, trend: 'up' },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? charcoalGray : "#f3f4f6" }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-8 pb-12 max-w-[1400px] mx-auto w-full">

        {/* ENCABEZADO */}
        <View className="mb-10">
          <Text className={cn("text-3xl font-headline font-bold mb-1 tracking-tight", isDark ? "text-white" : "text-zinc-900")}>
            Descripción General Operativa
          </Text>
          <Text className="text-zinc-500 text-sm">
            Métricas de rendimiento en tiempo real para su restaurante.
          </Text>
        </View>

        {/* 1. MÉTRICAS (GRID RESPONSIVO) */}
        <View className="flex-row flex-wrap justify-between mb-2">
          {stats.map((stat, i) => (
            <View key={i} className="w-full sm:w-[48%] lg:w-[23.5%] mb-6">
              <Card className={cn(
                "border-zinc-800/40 rounded-[24px] overflow-hidden shadow-sm",
                // La tarjeta es ligeramente más clara que el fondo para dar profundidad
                isDark ? "bg-zinc-900/40" : "bg-white border-zinc-200"
              )}>
                <CardContent className="p-6">
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
                  <View className="mt-6">
                    <Text className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</Text>
                    <Text className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-zinc-900")}>
                      {stat.value}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>

        {/* 2. GRÁFICA Y ARTÍCULOS POPULARES */}
        <View className="flex-col lg:flex-row gap-8">

          {/* GRÁFICA SEMANAL */}
          <View className="flex-1 lg:flex-[1.6]">
            <Card className={cn(
              "border-zinc-800/40 rounded-[32px] p-2",
              isDark ? "bg-zinc-900/40" : "bg-white border-zinc-200"
            )}>
              <CardHeader className="pb-2">
                <CardTitle><Text className={cn("font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>Ingresos Semanales</Text></CardTitle>
                <CardDescription><Text className="text-zinc-500 text-xs">Últimos 7 días de rendimiento.</Text></CardDescription>
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

                    <View className="flex-1 flex-row items-end justify-between px-2 pb-8">
                      {chartData.map((entry, index) => {
                        const heightPercent = (entry.sales / maxAxis) * 100;
                        const isPeak = entry.sales === peakValue;
                        return (
                          <View key={index} className="items-center flex-1 h-full justify-end">
                            <View
                              style={{
                                height: `${heightPercent}%`,
                                width: '45%',
                                maxWidth: 22,
                                backgroundColor: isPeak ? primaryColor : `${primaryColor}40`
                              }}
                              className="rounded-t-sm"
                            />
                            <Text className="text-[10px] text-zinc-500 mt-4 font-bold uppercase">{entry.name}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>

          {/* ARTÍCULOS POPULARES */}
          <View className="flex-1">
            <Card className={cn(
              "border-zinc-800/40 rounded-[32px] p-2",
              isDark ? "bg-zinc-900/40" : "bg-white border-zinc-200"
            )}>
              <CardHeader>
                <CardTitle><Text className={cn("font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>Populares</Text></CardTitle>
                <CardDescription><Text className="text-zinc-500 text-xs">Lo más pedido este mes.</Text></CardDescription>
              </CardHeader>
              <CardContent>
                <View className="space-y-1">
                  {[
                    { name: 'Hamburguesa de la casa', orders: 154, trend: 15 },
                    { name: 'Pasta con trufa', orders: 128, trend: 8 },
                    { name: 'Pizza Margarita', orders: 110, trend: -5 },
                    { name: 'Ensalada César', orders: 94, trend: 20 },
                  ].map((item, i) => (
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
                  <TouchableOpacity
                    style={{ backgroundColor: primaryColor }}
                    className="w-full mt-6 p-4 rounded-2xl items-center active:opacity-80 shadow-lg shadow-black/20"
                  >
                    <Text className="text-white font-bold tracking-wide">Ver Todos los Reportes</Text>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}