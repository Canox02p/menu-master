'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search, Plus, Wine, Package, Thermometer,
  AlertTriangle, Filter, ArrowRight
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api'; // Importamos la API centralizada

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  status: 'Suficiente' | 'Bajo'; // Traducido
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: any;
  colorTheme: 'amber' | 'blue' | 'red';
  isDark: boolean;
  widthStyle: StyleProp<ViewStyle>;
}

interface InventoryRowProps {
  item: InventoryItem;
  isDark: boolean;
  primaryColor: string;
  isLast: boolean;
  onAction: (id: string) => void;
  isMobile: boolean; // Prop para diseño adaptativo
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const SummaryCard = ({ title, value, icon: Icon, colorTheme, isDark, widthStyle }: SummaryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', hex: '#f59e0b' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hex: '#3b82f6' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', hex: '#ef4444' }
  };

  const themeColors = colors[colorTheme];

  return (
    <View style={widthStyle} className="p-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            "border-none transition-all duration-300 rounded-[24px]",
            isDark ? "bg-zinc-900/40" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? themeColors.hex : 'transparent',
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          <CardContent className="p-5 flex-row items-center gap-4">
            <View className={cn("p-3 rounded-2xl", themeColors.bg)}>
              <Icon color={themeColors.hex} size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{title}</Text>
              <Text className={cn("text-2xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")} numberOfLines={1} adjustsFontSizeToFit>
                {value}
              </Text>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

const InventoryRow = ({ item, isDark, primaryColor, isLast, onAction, isMobile }: InventoryRowProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLow = item.status === 'Bajo';

  // --- VISTA MÓVIL (Tarjeta Compacta) ---
  if (isMobile) {
    return (
      <Pressable
        onPress={() => onAction(item.id)}
        className={cn(
          "p-4 mx-4 mb-3 rounded-2xl border",
          isDark ? "bg-zinc-800/40 border-zinc-700/50" : "bg-white border-zinc-200 shadow-sm"
        )}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <View
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              {item.category.includes('Wine') || item.category.toLowerCase().includes('bebida')
                ? <Wine color={primaryColor} size={18} />
                : <Package color={primaryColor} size={18} />
              }
            </View>
            <View className="flex-1">
              <Text className={cn("font-bold text-base", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-xs text-zinc-500 mt-0.5">{item.category}</Text>
            </View>
          </View>
          <View className={cn(
            "flex-row items-center gap-1.5 px-2.5 py-1 rounded-full",
            isLow ? "bg-red-500/10" : "bg-emerald-500/10"
          )}>
            <View className={cn("w-1.5 h-1.5 rounded-full", isLow ? "bg-red-500" : "bg-emerald-500")} />
            <Text className={cn("text-[10px] font-bold uppercase", isLow ? "text-red-500" : "text-emerald-500")}>
              {item.status}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center pt-3 border-t border-zinc-500/20">
          <View>
            <Text className="text-[10px] font-bold text-zinc-500 uppercase">Stock Actual</Text>
            <Text className={cn("font-bold text-lg", isLow ? "text-red-500" : (isDark ? "text-white" : "text-zinc-900"))}>
              {item.stock} <Text className="text-xs font-medium text-zinc-500">{item.unit}</Text>
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] font-bold text-zinc-500 uppercase">Precio</Text>
            <Text className={cn("font-mono font-bold text-lg", isDark ? "text-zinc-300" : "text-zinc-700")}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // --- VISTA ESCRITORIO/TABLET (Fila de Tabla) ---
  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      onPress={() => onAction(item.id)}
      className={cn(
        "flex-row items-center px-6 py-4 transition-colors",
        !isLast && (isDark ? "border-b border-zinc-800/50" : "border-b border-zinc-100"),
        isHovered && (isDark ? "bg-zinc-800/30" : "bg-zinc-50")
      )}
    >
      <View className="flex-row items-center gap-4 w-[25%] pr-2">
        <View
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          {item.category.includes('Wine') || item.category.toLowerCase().includes('bebida')
            ? <Wine color={primaryColor} size={18} />
            : <Package color={primaryColor} size={18} />
          }
        </View>
        <Text className={cn("font-bold flex-1", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={1}>
          {item.name}
        </Text>
      </View>

      <View className="w-[20%] pr-2 justify-center">
        <Badge
          variant="outline"
          className={cn("rounded-lg self-start", isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-100")}
          label={item.category}
        />
      </View>

      <View className="w-[20%] items-center px-2">
        <Text className={cn(
          "font-headline font-bold text-base",
          isLow ? "text-red-500" : (isDark ? "text-white" : "text-zinc-900")
        )}>
          {item.stock} <Text className="text-xs font-medium text-zinc-500">{item.unit}</Text>
        </Text>
        <Text className="text-[10px] text-zinc-500 font-bold mt-1 tracking-widest">MIN: {item.minStock}</Text>
      </View>

      <View className="w-[15%] items-center px-2">
        <View className={cn(
          "flex-row items-center gap-1.5 px-3 py-1.5 rounded-full",
          isLow ? "bg-red-500/10" : "bg-emerald-500/10"
        )}>
          <View className={cn("w-1.5 h-1.5 rounded-full", isLow ? "bg-red-500" : "bg-emerald-500")} />
          <Text className={cn("text-[10px] font-bold uppercase tracking-wider", isLow ? "text-red-500" : "text-emerald-500")}>
            {item.status}
          </Text>
        </View>
      </View>

      <View className="w-[15%] items-end justify-center px-2">
        <Text className={cn("font-mono font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>
          ${item.price.toFixed(2)}
        </Text>
      </View>

      <View className="w-[5%] items-end justify-center pl-2">
        <View className={cn(
          "w-8 h-8 rounded-lg items-center justify-center transition-all",
          isHovered ? (isDark ? "bg-zinc-700" : "bg-zinc-200") : "bg-transparent"
        )}>
          <ArrowRight color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
        </View>
      </View>
    </Pressable>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export function InventoryManagement() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  // Estados para datos reales
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Breakpoints para diseño responsivo
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // Carga de inventario
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const data = await api.productos.getAll();

        const mappedItems: InventoryItem[] = data.map((prod: any) => {
          const stock = Number(prod.stock) || 0;
          const minStock = 10;

          return {
            id: prod.id_producto?.toString() || prod.id?.toString() || Math.random().toString(),
            name: prod.nombre,
            category: prod.categoria || 'General',
            stock: stock,
            minStock: minStock,
            unit: 'Unid.',
            price: Number(prod.precio) || 0,
            status: stock <= minStock ? 'Bajo' : 'Suficiente' // Status Traducido
          };
        });

        setItems(mappedItems);
      } catch (error) {
        console.error("Error al cargar inventario de MySQL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.status === 'Bajo').length;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 140 : 120 }}
      >
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View>
              <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Bodega e Inventario
              </Text>
              <Text className="text-zinc-500">Gestión de catálogo y existencias en tiempo real.</Text>
            </View>
            <View className="flex-row flex-wrap gap-3 mt-2 md:mt-0 w-full md:w-auto">
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ backgroundColor: primaryColor }}
                className="rounded-2xl flex-row items-center justify-center gap-2 px-5 py-3 shadow-lg shadow-primary/30 flex-1 md:flex-none"
              >
                <Plus color="white" size={18} strokeWidth={3} />
                <Text className="text-white font-bold text-sm tracking-wide">Nuevo Producto</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TARJETAS DE RESUMEN */}
          <View className="flex-row flex-wrap -mx-2 mb-6">
            <SummaryCard title="Total Productos" value={`${items.length}`} icon={Package} colorTheme="amber" isDark={isDark} widthStyle={getCardWidth()} />
            <SummaryCard title="En Stock" value={`${items.reduce((acc, curr) => acc + curr.stock, 0)} U.`} icon={Thermometer} colorTheme="blue" isDark={isDark} widthStyle={getCardWidth()} />
            <SummaryCard title="Alertas (Stock Bajo)" value={`${lowStockCount} Items`} icon={AlertTriangle} colorTheme="red" isDark={isDark} widthStyle={getCardWidth()} />
          </View>

          {/* ÁREA DE INVENTARIO */}
          <Card className={cn(
            "border-none overflow-hidden rounded-[32px] mb-8",
            isDark ? "bg-zinc-900/40" : "bg-white shadow-sm"
          )}>
            {/* Barra de Búsqueda y Filtros */}
            <View className={cn(
              "p-5 border-b flex-col lg:flex-row justify-between items-start lg:items-center gap-4",
              isDark ? "border-zinc-800/60" : "border-zinc-100"
            )}>
              <View className="relative w-full lg:w-96 flex-row items-center">
                <View className="absolute left-4 z-10">
                  <Search color={isDark ? "#a1a1aa" : "#71717a"} size={18} />
                </View>
                <TextInput
                  placeholder="Buscar productos..."
                  placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className={cn(
                    "pl-12 pr-4 py-3.5 rounded-2xl w-full text-sm font-medium",
                    isDark ? "bg-zinc-800/50 text-white" : "bg-zinc-50 text-zinc-900"
                  )}
                />
              </View>
              <View className="flex-row gap-3 w-full lg:w-auto">
                <TouchableOpacity className={cn("rounded-xl flex-row items-center justify-center gap-2 h-11 px-4 flex-1 lg:flex-none", isDark ? "bg-zinc-800/50" : "bg-zinc-50")}>
                  <Filter color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                  <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>Filtros</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LISTA/TABLA DE PRODUCTOS */}
            {isMobile ? (
              // Vista Móvil: Tarjetas apiladas
              <View className="py-4">
                {filteredItems.length === 0 && !isLoading && (
                  <Text className="text-zinc-500 text-center py-8">No se encontraron productos.</Text>
                )}
                {filteredItems.map((item, index) => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    isDark={isDark}
                    primaryColor={primaryColor}
                    isLast={index === filteredItems.length - 1}
                    isMobile={true}
                    onAction={(id) => console.log(`Gestionar item ${id}`)}
                  />
                ))}
              </View>
            ) : (
              // Vista Escritorio/Tablet: Tabla con Scroll Horizontal
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
                <View className="min-w-[900px] w-full pb-2">
                  <View className={cn("flex-row px-6 py-4 border-b", isDark ? "bg-zinc-950/20 border-zinc-800/60" : "bg-zinc-50/80 border-zinc-100")}>
                    <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[25%] pr-2">Producto</Text>
                    <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[20%] pr-2">Categoría</Text>
                    <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[20%] text-center px-2">Stock Actual</Text>
                    <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[15%] text-center px-2">Estado</Text>
                    <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[15%] text-right px-2">Precio Unit.</Text>
                    <View className="w-[5%] pl-2" />
                  </View>

                  <View>
                    {filteredItems.length === 0 && !isLoading && (
                      <Text className="text-zinc-500 text-center py-8">No se encontraron productos.</Text>
                    )}
                    {filteredItems.map((item, index) => (
                      <InventoryRow
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        primaryColor={primaryColor}
                        isLast={index === filteredItems.length - 1}
                        isMobile={false}
                        onAction={(id) => console.log(`Gestionar item ${id}`)}
                      />
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </Card>

        </View>
      </ScrollView>
    </View>
  );
}