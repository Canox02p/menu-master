'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Shield, Star, Calendar, Phone, Mail } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api'; // Conexión a tu backend

// ==========================================
// 1. INTERFACES (Tipado Fuerte)
// ==========================================

type StaffRole = 'ADMIN' | 'WAITER' | 'CHEF' | string;
type StaffStatus = 'On Shift' | 'Off Duty' | 'Break';

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  email: string;
  phone: string;
  joined: string;
  performance: number;
}

interface StaffCardProps {
  member: StaffMember;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onSchedulesPress: (id: string) => void;
  onSettingsPress: (id: string) => void;
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const StaffCard = ({ member, isDark, primaryColor, widthStyle, onSchedulesPress, onSettingsPress }: StaffCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determinamos colores de estado dinámicamente
  const statusColors = {
    'On Shift': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    'Break': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    'Off Duty': { bg: isDark ? 'bg-zinc-800' : 'bg-zinc-200', text: isDark ? 'text-zinc-400' : 'text-zinc-500' }
  };

  const currentStatus = statusColors[member.status as keyof typeof statusColors] || statusColors['Off Duty'];

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
            "border-none overflow-hidden transition-all duration-300 rounded-[24px]",
            isDark ? "bg-zinc-900/40" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : 'transparent',
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          <CardContent className="p-6">

            {/* CABECERA DE LA TARJETA (Avatar y Estado) */}
            <View className="flex-row justify-between items-start mb-5">
              <Avatar className={cn("w-16 h-16 rounded-[18px] border-2", isDark ? "border-zinc-800" : "border-zinc-100")}>
                <AvatarImage source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random` }} />
                <AvatarFallback className={isDark ? "bg-zinc-800" : "bg-zinc-100"}>
                  <Text style={{ color: primaryColor }} className="font-headline font-bold text-xl">{member.name.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
              <View className={cn("px-3 py-1.5 rounded-full", currentStatus.bg)}>
                <Text className={cn("text-[10px] font-bold uppercase tracking-wider", currentStatus.text)}>
                  {member.status}
                </Text>
              </View>
            </View>

            {/* INFO DEL USUARIO */}
            <View className="space-y-1.5 mb-5">
              <Text className={cn("text-xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")} numberOfLines={1}>
                {member.name}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Shield color={primaryColor} size={14} />
                <Text style={{ color: primaryColor }} className="text-[11px] font-bold tracking-widest uppercase">
                  {member.role}
                </Text>
              </View>
            </View>

            {/* DATOS DE CONTACTO Y RENDIMIENTO */}
            <View className={cn("space-y-3 pt-5 border-t", isDark ? "border-zinc-800/60" : "border-zinc-100")}>
              <View className="flex-row items-center gap-3">
                <Mail color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                <Text className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")} numberOfLines={1}>{member.email}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Phone color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                <Text className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}>{member.phone}</Text>
              </View>

              <View className="flex-row items-center justify-between pt-3">
                <View className="flex-row items-center gap-2">
                  <Star color="#f59e0b" fill="#f59e0b" size={16} />
                  <Text className={cn("text-sm font-bold", isDark ? "text-white" : "text-zinc-900")}>{member.performance}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Calendar color={isDark ? "#a1a1aa" : "#71717a"} size={14} />
                  <Text className={cn("text-xs font-medium", isDark ? "text-zinc-500" : "text-zinc-500")}>Desde {member.joined}</Text>
                </View>
              </View>
            </View>

            {/* BOTONES DE ACCIÓN */}
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onSchedulesPress(member.id)}
                className={cn(
                  "flex-1 rounded-xl h-11 border items-center justify-center transition-colors",
                  isDark ? "border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                )}
              >
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>Horarios</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onSettingsPress(member.id)}
                className={cn(
                  "flex-1 rounded-xl h-11 border items-center justify-center transition-colors",
                  isDark ? "border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                )}
              >
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>Ajustes</Text>
              </TouchableOpacity>
            </View>

          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export function StaffManagement() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  // Estados reales
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga de usuarios desde MongoDB
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const data = await api.usuarios.getAll();

        // Mapeo adaptando los datos de la base de datos a la UI
        const mappedStaff: StaffMember[] = data.map((u: any) => ({
          id: u._id,
          name: u.nombre || 'Sin Nombre',
          role: (u.rol || 'EMPLEADO').toUpperCase(),
          email: u.email || 'sin@correo.com',
          // Valores por defecto (fallbacks) ya que Mongo no los tiene aún
          status: 'On Shift',
          phone: '+52 000 000 0000',
          joined: '2026',
          performance: 5.0
        }));

        setStaff(mappedStaff);
      } catch (error) {
        console.error("Error al cargar personal:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Grid Responsivo
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' }; // 3 columnas
    if (isTablet) return { width: '50%' };     // 2 columnas
    return { width: '100%' };                  // 1 columna en móvil
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
                Directorio del Equipo
              </Text>
              <Text className="text-zinc-500">Administra roles y personal desde MongoDB.</Text>
            </View>

            <View className="flex-row items-center gap-4 mt-2 md:mt-0 w-full md:w-auto">
              {isLoading && <ActivityIndicator color={primaryColor} />}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ backgroundColor: primaryColor }}
                className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg shadow-primary/30 flex-1 md:flex-none justify-center"
              >
                <UserPlus color="white" size={20} />
                <Text className="text-white font-bold tracking-wide">Añadir Miembro</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GRID DEL EQUIPO */}
          <View className="flex-row flex-wrap -mx-2">
            {!isLoading && staff.length === 0 && (
              <Text className="text-zinc-500 text-center w-full py-10">No hay personal registrado en la base de datos.</Text>
            )}

            {staff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
                onSchedulesPress={(id) => console.log(`Abrir horarios para ${id}`)}
                onSettingsPress={(id) => console.log(`Abrir ajustes para ${id}`)}
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}