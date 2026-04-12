'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Shield, Star, Calendar, Phone, Mail } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

// ==========================================
// 1. INTERFACES (Tipado Fuerte)
// ==========================================

type StaffRole = 'ADMIN' | 'WAITER' | 'CHEF';
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

// ==========================================
// 2. DATOS MOCKEADOS
// ==========================================

const staffMembers: StaffMember[] = [
  { id: '1', name: 'Alex Admin', role: 'ADMIN', status: 'On Shift', email: 'alex@custoserve.com', phone: '+1 234 567 890', joined: 'Jan 2023', performance: 4.8 },
  { id: '2', name: 'Will Waiter', role: 'WAITER', status: 'On Shift', email: 'will@custoserve.com', phone: '+1 234 567 891', joined: 'Mar 2023', performance: 4.5 },
  { id: '3', name: 'Charlie Chef', role: 'CHEF', status: 'Off Duty', email: 'charlie@custoserve.com', phone: '+1 234 567 892', joined: 'Feb 2023', performance: 4.9 },
  { id: '4', name: 'Elena Sommelier', role: 'WAITER', status: 'On Shift', email: 'elena@custoserve.com', phone: '+1 234 567 893', joined: 'Jun 2023', performance: 4.7 },
  { id: '5', name: 'Marco Sous Chef', role: 'CHEF', status: 'Break', email: 'marco@custoserve.com', phone: '+1 234 567 894', joined: 'Jul 2023', performance: 4.6 },
];

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 3. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const StaffCard = ({ member, isDark, primaryColor, widthStyle, onSchedulesPress, onSettingsPress }: StaffCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determinamos colores de estado dinámicamente
  const statusColors = {
    'On Shift': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    'Break': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    'Off Duty': { bg: isDark ? 'bg-zinc-800' : 'bg-zinc-200', text: isDark ? 'text-zinc-400' : 'text-zinc-500' }
  };

  const currentStatus = statusColors[member.status];

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
                <AvatarImage source={{ uri: `https://picsum.photos/seed/${member.id}/100/100` }} />
                <AvatarFallback className={isDark ? "bg-zinc-800" : "bg-zinc-100"}>
                  <Text style={{ color: primaryColor }} className="font-headline font-bold text-xl">{member.name[0]}</Text>
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
              <Text className={cn("text-xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
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
                  <Text className={cn("text-xs font-medium", isDark ? "text-zinc-500" : "text-zinc-500")}>Since {member.joined}</Text>
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
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>Schedules</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onSettingsPress(member.id)}
                className={cn(
                  "flex-1 rounded-xl h-11 border items-center justify-center transition-colors",
                  isDark ? "border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                )}
              >
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>Settings</Text>
              </TouchableOpacity>
            </View>

          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL
// ==========================================

export function StaffManagement() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

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
                Team Directory
              </Text>
              <Text className="text-zinc-500">Manage roles, permissions, and shift schedules.</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{ backgroundColor: primaryColor }}
              className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg shadow-primary/30 mt-2 md:mt-0 w-full md:w-auto justify-center"
            >
              <UserPlus color="white" size={20} />
              <Text className="text-white font-bold tracking-wide">Add Member</Text>
            </TouchableOpacity>
          </View>

          {/* GRID DEL EQUIPO */}
          <View className="flex-row flex-wrap -mx-2">
            {staffMembers.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                isDark={isDark}
                primaryColor={primaryColor}
                widthStyle={getCardWidth()}
                onSchedulesPress={(id) => console.log(`Open schedules for ${id}`)}
                onSettingsPress={(id) => console.log(`Open settings for ${id}`)}
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}