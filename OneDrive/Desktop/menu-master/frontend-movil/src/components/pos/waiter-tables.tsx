'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Plus, ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { OrderTaking } from './order-taking';

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface TableData {
  id: number;
  status: 'Occupied' | 'Available';
  capacity: number;
  time: string;
  total: number;
}

interface TableCardProps {
  table: TableData;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
}

// ==========================================
// 2. DATOS MOCKEADOS
// ==========================================

const tables: TableData[] = Array.from({ length: 16 }, (_, i) => {
  const isOccupied = Math.random() > 0.6;
  return {
    id: i + 1,
    status: isOccupied ? 'Occupied' : 'Available', // Corregido el string raro
    capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
    time: isOccupied ? '45m' : '-',
    total: isOccupied ? Math.floor(Math.random() * 150) + 20 : 0,
  };
});

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 3. SUBCOMPONENTES (SRP & Interacciones)
// ==========================================

const TableCard = ({ table, isSelected, onPress, isDark, primaryColor, widthStyle }: TableCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isOccupied = table.status === 'Occupied';

  // La tarjeta está "activa" visualmente si pasas el mouse o si la seleccionaste
  const isActive = isHovered || isSelected;

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        onPress={onPress}
      >
        <View
          className={cn(
            "aspect-square rounded-[32px] p-5 transition-all border flex-col justify-between overflow-hidden",
            isOccupied
              ? (isDark ? "bg-zinc-800/80 border-transparent shadow-xl" : "bg-card shadow-lg border-transparent")
              : (isDark ? "bg-zinc-900/40 border-dashed border-zinc-700" : "bg-card/50 border-dashed border-muted")
          )}
          style={{
            // Iluminamos el borde si está seleccionado o en hover
            borderWidth: isActive ? 2 : 1,
            borderColor: isActive ? primaryColor : (isOccupied ? 'transparent' : undefined),
            transform: [{ scale: isActive ? 0.98 : 1 }] // Pequeño efecto de presión
          }}
        >
          {isOccupied && (
            <View
              className="absolute top-0 right-0 w-16 h-16 rounded-bl-[32px] items-end pr-4 pt-4"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Users className="w-5 h-5" color={primaryColor} size={20} />
            </View>
          )}

          <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
            #{table.id}
          </Text>

          <View>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              {table.capacity} Seats
            </Text>

            {isOccupied ? (
              <View className="space-y-1.5">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Clock className="w-3 h-3" color={primaryColor} size={14} />
                  <Text style={{ color: primaryColor }} className="text-[11px] font-bold">{table.time}</Text>
                </View>
                <Text className={cn("text-base font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  ${table.total.toFixed(2)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 py-1">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-xs text-emerald-500 font-bold">Ready</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL
// ==========================================

export function WaiterTables() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showOrderTaking, setShowOrderTaking] = useState(false);

  // Grid responsivo exacto nativo
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '25%' };    // 4 columnas
    if (isTablet) return { width: '33.33%' };  // 3 columnas
    return { width: '50%' };                   // 2 columnas en celular
  };

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
                Floor Plan
              </Text>
              <Text className="text-zinc-500">Select a table to start or manage an order.</Text>
            </View>
            <View className="flex-row gap-2 mt-2 md:mt-0">
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 px-3 py-1 mr-2" label="Available" />
              <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 px-3 py-1" label="Occupied" />
            </View>
          </View>

          {/* GRID DE MESAS */}
          <View className="flex-row flex-wrap -mx-2">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={selectedTable === table.id}
                onPress={() => setSelectedTable(table.id)}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
              />
            ))}
          </View>

        </View>
      </ScrollView>

      {/* POPUP INFERIOR: MESA SELECCIONADA */}
      {selectedTable && !showOrderTaking && (
        <View className="absolute bottom-8 left-4 right-4 items-center justify-center z-50">
          <Card
            className="border-none shadow-2xl rounded-[32px] overflow-hidden w-full max-w-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <CardContent className="p-5">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-4">
                  <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                    <Text className="text-2xl font-headline font-bold text-white max-w-full text-center">
                      {selectedTable}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-lg text-white">Table #{selectedTable}</Text>
                    <Text className="text-xs text-white/70 font-medium tracking-wider">MAIN DINING</Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <Button
                    variant="ghost"
                    className="rounded-xl items-center justify-center hover:bg-white/10"
                    onPress={() => setSelectedTable(null)}
                  >
                    <Text className="text-white font-medium">Close</Text>
                  </Button>
                  <Button
                    className="rounded-xl bg-white items-center justify-center flex-row px-5 py-6 gap-1 shadow-lg shadow-black/10 active:scale-95 transition-transform"
                    onPress={() => setShowOrderTaking(true)}
                  >
                    <Plus color={primaryColor} size={18} strokeWidth={3} />
                    <Text style={{ color: primaryColor }} className="font-bold text-base ml-1">Order</Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      )}

      {/* VISTA DE ORDENES (Cubre la pantalla si se activa) */}
      {selectedTable && showOrderTaking && (
        <OrderTaking
          tableId={selectedTable}
          onClose={() => {
            setShowOrderTaking(false);
            setSelectedTable(null);
          }}
        />
      )}
    </View>
  );
}