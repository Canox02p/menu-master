'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, ActivityIndicator, TouchableOpacity, Modal, DimensionValue } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Plus, MapPin, User } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { OrderTaking } from './order-taking';
import { useToast } from '@/hooks/use-toast';

// ==========================================
// 1. INTERFACES
// ==========================================
interface TableData {
  _id: string;
  numero_mesa: number;
  nombre?: string;
  ubicacion?: string;
  status: 'Occupied' | 'Available';
  capacity: number;
  mesero_nombre?: string; // Nombre del mesero que atiende actualmente
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTE: TARJETA DE MESA
// ==========================================
const TableCard = ({ table, isSelected, onPress, isDark, primaryColor, widthStyle }: { table: TableData, isSelected: boolean, onPress: () => void, isDark: boolean, primaryColor: string, widthStyle: any }) => {
  const isOccupied = table.status === 'Occupied';

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable onPress={onPress}>
        <View
          className={cn(
            "aspect-square rounded-[32px] p-5 transition-all border flex-col justify-between overflow-hidden",
            isOccupied
              ? (isDark ? "bg-zinc-800/80 border-transparent shadow-xl" : "bg-white shadow-lg border-transparent")
              : (isDark ? "bg-zinc-900/40 border-dashed border-zinc-700" : "bg-card/50 border-dashed border-zinc-300")
          )}
          style={{
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? primaryColor : (isOccupied ? 'transparent' : undefined),
            transform: [{ scale: isSelected ? 0.98 : 1 }]
          }}
        >
          <View className="flex-row justify-between items-start">
            <Text className={cn("text-4xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
              {table.numero_mesa}
            </Text>
            {isOccupied && (
              <View className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}15` }}>
                <User color={primaryColor} size={18} />
              </View>
            )}
          </View>

          <View>
            {isOccupied && (
              <View className="mb-2">
                <Text className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Atiende:</Text>
                <Text className={cn("text-[11px] font-bold", isDark ? "text-zinc-300" : "text-zinc-700")} numberOfLines={1}>
                  {table.mesero_nombre || 'Mesero'}
                </Text>
              </View>
            )}

            <View className={cn("flex-row items-center gap-1.5 px-2.5 py-1 rounded-full self-start", isOccupied ? "bg-rose-500/10" : "bg-emerald-500/10")}>
              <View className={cn("w-1.5 h-1.5 rounded-full", isOccupied ? "bg-rose-500" : "bg-emerald-500")} />
              <Text className={cn("text-[10px] font-bold uppercase", isOccupied ? "text-rose-500" : "text-emerald-500")}>
                {isOccupied ? 'Ocupada' : 'Libre'}
              </Text>
            </View>
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
  const { toast } = useToast();

  // Extraemos el usuario para saber quién está operando
  const { user } = useAuth();

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
        capacity: t.capacidad,
        mesero_nombre: t.mesero_nombre // Traemos el nombre del mesero desde el backend
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

  const getCardWidth = (): { width: DimensionValue } => {
    if (width >= 1024) return { width: '20%' };
    if (width >= 768) return { width: '33.33%' };
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
              <Text className="text-zinc-500">Selecciona una mesa para gestionar la comanda.</Text>
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

      {/* POPUP INFERIOR: ACCIÓN SOBRE MESA */}
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
                      {selectedTable.status === 'Available' ? 'ESTADO: LIBRE' : `ATIENDE: ${selectedTable.mesero_nombre || 'MESERO'}`}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="h-12 w-12 rounded-full items-center justify-center bg-black/10"
                  onPress={() => setSelectedTable(null)}
                >
                  <Plus color="white" size={24} style={{ transform: [{ rotate: '45deg' }] }} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full rounded-xl bg-white items-center justify-center flex-row py-4 shadow-lg shadow-black/10 transition-transform active:scale-95"
                onPress={() => setShowOrderTaking(true)}
              >
                <Plus color={primaryColor} size={20} strokeWidth={3} />
                <Text style={{ color: primaryColor }} className="font-bold text-lg ml-2">
                  {selectedTable.status === 'Available' ? 'Tomar Nueva Orden' : 'Añadir a la Cuenta'}
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>
      )}

      {/* MODAL DE TOMA DE PEDIDO */}
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
    </View>
  );
}