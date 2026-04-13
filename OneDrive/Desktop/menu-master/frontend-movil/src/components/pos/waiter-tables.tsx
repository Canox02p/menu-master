'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, ActivityIndicator } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Plus } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { OrderTaking } from './order-taking';
import { api } from '@/lib/api'; // Importamos la API real

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface TableData {
  _id: string; // ID real de MongoDB
  numero_mesa: number; // Número visual de la mesa
  status: 'Occupied' | 'Available';
  capacity: number;
}

interface TableCardProps {
  table: TableData;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES (SRP & Interacciones)
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
            borderWidth: isActive ? 2 : 1,
            borderColor: isActive ? primaryColor : (isOccupied ? 'transparent' : undefined),
            transform: [{ scale: isActive ? 0.98 : 1 }]
          }}
        >
          {isOccupied && (
            <View
              className="absolute top-0 right-0 w-16 h-16 rounded-bl-[32px] items-end pr-4 pt-4"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              {/* LIMPIEZA NATIVEWIND: Sin className */}
              <Users color={primaryColor} size={20} />
            </View>
          )}

          <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
            #{table.numero_mesa}
          </Text>

          <View>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              {table.capacity} Seats
            </Text>

            {isOccupied ? (
              <View className="space-y-1.5 mt-2">
                <View className="flex-row items-center gap-1.5 mb-1">
                  {/* LIMPIEZA NATIVEWIND: Sin className */}
                  <Clock color={primaryColor} size={14} />
                  <Text style={{ color: primaryColor }} className="text-[11px] font-bold">Activa</Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 py-1 mt-2">
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
// 3. COMPONENTE PRINCIPAL
// ==========================================

export function WaiterTables() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  // Estados Reales
  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [showOrderTaking, setShowOrderTaking] = useState(false);

  // Carga de datos desde MongoDB
  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const data = await api.mesas.getAll();

      // Mapeamos los datos de MongoDB a la interfaz UI
      const mappedTables: TableData[] = data.map((t: any) => ({
        _id: t._id,
        numero_mesa: t.numero_mesa,
        status: t.estado === 'LIBRE' ? 'Available' : 'Occupied',
        capacity: t.capacidad
      }));

      // Ordenamos las mesas por número
      setTables(mappedTables.sort((a, b) => a.numero_mesa - b.numero_mesa));
    } catch (error) {
      console.error("Error al cargar las mesas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

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
              <Text className="text-zinc-500">Selecciona una mesa para gestionar un pedido.</Text>
            </View>
            <View className="flex-row items-center gap-3 mt-2 md:mt-0">
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 px-3 py-1" label="Available" />
              <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 px-3 py-1" label="Occupied" />
            </View>
          </View>

          {/* GRID DE MESAS */}
          <View className="flex-row flex-wrap -mx-2">
            {!isLoading && tables.length === 0 && (
              <Text className="text-zinc-500 p-4 w-full text-center">No hay mesas configuradas en la base de datos.</Text>
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
                      {selectedTable.numero_mesa}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-lg text-white">Mesa #{selectedTable.numero_mesa}</Text>
                    <Text className="text-xs text-white/70 font-medium tracking-wider uppercase">
                      {selectedTable.status === 'Available' ? 'LIBRE' : 'OCUPADA'}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <Button
                    variant="ghost"
                    className="rounded-xl items-center justify-center hover:bg-white/10"
                    onPress={() => setSelectedTable(null)}
                  >
                    <Text className="text-white font-medium">Cerrar</Text>
                  </Button>

                  {/* Solo permitimos tomar orden si la mesa está libre */}
                  {selectedTable.status === 'Available' && (
                    <Button
                      className="rounded-xl bg-white items-center justify-center flex-row px-5 py-6 gap-1 shadow-lg shadow-black/10 active:scale-95 transition-transform"
                      onPress={() => setShowOrderTaking(true)}
                    >
                      {/* LIMPIEZA NATIVEWIND: Sin className */}
                      <Plus color={primaryColor} size={18} strokeWidth={3} />
                      <Text style={{ color: primaryColor }} className="font-bold text-base ml-1">Orden</Text>
                    </Button>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      )}

      {/* VISTA DE TOMA DE ORDENES (Le pasamos el objeto mesa completo) */}
      {selectedTable && showOrderTaking && (
        <OrderTaking
          tableId={selectedTable._id} // ID de Mongo para el backend
          tableNumber={selectedTable.numero_mesa} // Número visual
          onClose={() => {
            setShowOrderTaking(false);
            setSelectedTable(null);
            fetchTables(); // Recargamos para actualizar el estado a OCUPADA
          }}
        />
      )}
    </View>
  );
}