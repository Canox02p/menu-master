'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Plus, MapPin } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider'; // <-- IMPORTANTE: Importamos el auth
import { OrderTaking } from './order-taking';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TableData {
  _id: string;
  numero_mesa: number;
  nombre?: string;
  ubicacion?: string;
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

const TableCard = ({ table, isSelected, onPress, isDark, primaryColor, widthStyle }: TableCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isOccupied = table.status === 'Occupied';
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
              ? (isDark ? "bg-zinc-800/80 border-transparent shadow-xl" : "bg-white shadow-lg border-transparent")
              : (isDark ? "bg-zinc-900/40 border-dashed border-zinc-700" : "bg-card/50 border-dashed border-zinc-300")
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
              <Users color={primaryColor} size={20} />
            </View>
          )}

          <View>
            <Text className={cn("text-4xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
              {table.numero_mesa}
            </Text>
            {table.nombre && (
              <Text className={cn("text-xs font-bold mt-1", isDark ? "text-zinc-400" : "text-zinc-500")} numberOfLines={1}>
                {table.nombre}
              </Text>
            )}
          </View>

          <View>
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <Users color={isDark ? "#71717a" : "#a1a1aa"} size={12} />
              <Text className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {table.capacity} Pax
              </Text>
            </View>

            {table.ubicacion && (
              <View className="flex-row items-center gap-1.5 mb-2">
                <MapPin color={isDark ? "#71717a" : "#a1a1aa"} size={12} />
                <Text className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {table.ubicacion}
                </Text>
              </View>
            )}

            {isOccupied ? (
              <View className="flex-row items-center gap-1.5 mt-2 bg-rose-500/10 self-start px-2 py-1 rounded-full">
                <Clock color="#f43f5e" size={12} />
                <Text className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Ocupada</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1.5 mt-2 bg-emerald-500/10 self-start px-2 py-1 rounded-full">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <Text className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Libre</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export function WaiterTables() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  const { user } = useAuth(); // <-- IMPORTANTE: Sacamos al usuario de la sesión

  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [showOrderTaking, setShowOrderTaking] = useState(false);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://menu-master-api.onrender.com/mesas');
      const data = await response.json();

      const mappedTables: TableData[] = data.map((t: any) => ({
        _id: t._id,
        numero_mesa: t.numero_mesa,
        nombre: t.nombre,
        ubicacion: t.ubicacion,
        status: t.estado === 'LIBRE' ? 'Available' : 'Occupied',
        capacity: t.capacidad
      }));

      setTables(mappedTables.sort((a, b) => a.numero_mesa - b.numero_mesa));
    } catch (error) {
      toast({ title: "Error", description: "No se pudo conectar con el servidor.", variant: "destructive" });
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
    if (isDesktop) return { width: '20%' };
    if (isTablet) return { width: '33.33%' };
    return { width: '50%' };
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 140 : 120 }}
      >
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View>
              <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Plano de Mesas
              </Text>
              <Text className="text-zinc-500">Selecciona una mesa libre para tomar la orden.</Text>
            </View>
            <View className="flex-row items-center gap-3 mt-2 md:mt-0">
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 px-3 py-1" label="Libres" />
              <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 px-3 py-1" label="Ocupadas" />
            </View>
          </View>

          <View className="flex-row flex-wrap -mx-2">
            {!isLoading && tables.length === 0 && (
              <Text className="text-zinc-500 p-4 w-full text-center">No hay mesas configuradas. El administrador debe agregarlas.</Text>
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

      {selectedTable && !showOrderTaking && (
        <View className="absolute bottom-8 left-4 right-4 items-center justify-center z-50">
          <Card
            className="border-none shadow-2xl rounded-[32px] overflow-hidden w-full max-w-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <CardContent className="p-5 flex-col gap-4">
              <View className="flex-row justify-between items-center w-full">
                <View className="flex-row items-center gap-4">
                  <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                    <Text className="text-2xl font-headline font-bold text-white text-center">
                      {selectedTable.numero_mesa}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-lg text-white">Mesa #{selectedTable.numero_mesa}</Text>
                    <Text className="text-xs text-white/80 font-medium uppercase tracking-widest mt-0.5">
                      {selectedTable.status === 'Available' ? 'ESTADO: LIBRE' : 'ESTADO: OCUPADA'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="h-12 px-4 rounded-xl items-center justify-center bg-black/10"
                    onPress={() => setSelectedTable(null)}
                  >
                    <Text className="text-white font-bold text-sm">Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {selectedTable.status === 'Available' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-full rounded-xl bg-white items-center justify-center flex-row py-4 shadow-lg shadow-black/10 transition-transform active:scale-95"
                  onPress={() => setShowOrderTaking(true)}
                >
                  <Plus color={primaryColor} size={20} strokeWidth={3} />
                  <Text style={{ color: primaryColor }} className="font-bold text-lg ml-2">Tomar Nueva Orden</Text>
                </TouchableOpacity>
              ) : (
                <View className="w-full rounded-xl bg-black/20 items-center justify-center py-4">
                  <Text className="text-white/80 font-bold text-sm">Esta mesa ya tiene una orden activa.</Text>
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      )}

      {/* MODAL CERRADO CORRECTAMENTE */}
      <Modal
        visible={selectedTable !== null && showOrderTaking}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowOrderTaking(false);
          setSelectedTable(null);
          fetchTables();
        }}
      >
        {selectedTable && showOrderTaking && (
          <OrderTaking
            tableId={selectedTable._id}
            tableNumber={selectedTable.numero_mesa}
            tableName={selectedTable.nombre || `Mesa ${selectedTable.numero_mesa}`}
            waiterId={user?.id || ''}
            waiterName={user?.name || 'Mesero'}
            onClose={() => {
              setShowOrderTaking(false);
              setSelectedTable(null);
              fetchTables();
            }}
          />
        )}
      </Modal>
    </View> // <-- AQUÍ ESTABA EL ETIQUETA QUE FALTABA
  );
}