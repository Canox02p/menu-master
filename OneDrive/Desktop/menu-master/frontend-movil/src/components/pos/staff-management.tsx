'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Shield, Star, Calendar, Store, Mail, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// ==========================================
// 1. INTERFACES (Tipado Fuerte)
// ==========================================

type StaffStatus = 'On Shift' | 'Off Duty' | 'Break';

interface StaffMember {
  id: string;
  name: string;
  roles: string[]; // <-- AHORA ES UN ARREGLO DE ROLES
  status: StaffStatus;
  email: string;
  restaurante: string; // <-- PARA MOSTRAR LA EMPRESA
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
// 2. TARJETAS DE PERSONAL
// ==========================================

const StaffCard = ({ member, isDark, primaryColor, widthStyle, onSchedulesPress, onSettingsPress }: StaffCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    'On Shift': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    'Break': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    'Off Duty': { bg: isDark ? 'bg-zinc-800' : 'bg-zinc-200', text: isDark ? 'text-zinc-400' : 'text-zinc-500' }
  };

  const currentStatus = statusColors[member.status as keyof typeof statusColors] || statusColors['Off Duty'];

  // Extraemos el rol principal para mostrarlo en grande (Prioridad: ADMIN > COCINERO > MESERO)
  const mainRole = member.roles.includes('ADMIN') ? 'ADMIN' : member.roles.includes('COCINERO') ? 'COCINERO' : member.roles.includes('MESERO') ? 'MESERO' : 'EMPLEADO';

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

            {/* CABECERA (Avatar y Estado) */}
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
                  {mainRole}
                </Text>
              </View>
            </View>

            {/* DATOS DE CONTACTO */}
            <View className={cn("space-y-3 pt-5 border-t", isDark ? "border-zinc-800/60" : "border-zinc-100")}>
              <View className="flex-row items-center gap-3">
                <Mail color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                <Text className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")} numberOfLines={1}>{member.email}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Store color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                <Text className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")} numberOfLines={1}>{member.restaurante}</Text>
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
                onPress={() => onSettingsPress(member.id)}
                className={cn(
                  "flex-1 rounded-xl h-11 border items-center justify-center transition-colors",
                  isDark ? "border-zinc-700 bg-red-500/10 hover:bg-red-500/20" : "border-zinc-200 bg-red-50 hover:bg-red-100"
                )}
              >
                <Text className={cn("text-xs font-bold text-red-500")}>Eliminar</Text>
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
  const { toast } = useToast();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Formulario de Nuevo Miembro
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['MESERO']);

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const data = await api.usuarios.getAll();

      const mappedStaff: StaffMember[] = data.map((u: any) => ({
        id: u._id,
        name: u.nombre || 'Sin Nombre',
        // Aseguramos que lea el nuevo esquema 'roles', o caiga en el viejo 'rol'
        roles: u.roles || (u.rol ? [u.rol] : ['EMPLEADO']),
        email: u.email || 'sin@correo.com',
        restaurante: u.restaurante_nombre || 'Sin asignar', // <-- EXTRAE EMPRESA
        status: 'On Shift',
        joined: new Date(u.fecha_creacion).getFullYear().toString() || '2026',
        performance: 5.0
      }));

      setStaff(mappedStaff);
    } catch (error) {
      console.error("Error al cargar personal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) { // Previene quitar todos los roles
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSaveMember = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      toast({ title: "Error", description: "Todos los campos son obligatorios", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('https://menu-master-api.onrender.com/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newName.trim(),
          email: newEmail.trim().toLowerCase(),
          password_hash: newPassword.trim(),
          roles: selectedRoles,
          restaurante_nombre: "Registrado por Admin" // Aquí idealmente pasas el del Admin actual
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast({ title: "¡Éxito!", description: "Empleado registrado correctamente" });

      // Limpiamos y cerramos
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setSelectedRoles(['MESERO']);
      setIsModalVisible(false);

      // Recargamos la lista
      loadStaff();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://menu-master-api.onrender.com/usuarios/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Eliminado", description: "Usuario eliminado de la base de datos." });
        loadStaff();
      }
    } catch (e) {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    }
  }

  // Grid Responsivo
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                onPress={() => setIsModalVisible(true)}
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
                onSettingsPress={() => handleDelete(member.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE NUEVO EMPLEADO */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className={cn("w-full max-w-md p-6 rounded-[24px] shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>

            <View className="flex-row justify-between items-center mb-6">
              <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>Nuevo Empleado</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-2">
                <X color={isDark ? "#a1a1aa" : "#71717a"} size={24} />
              </TouchableOpacity>
            </View>

            <View className="space-y-4 mb-6">
              <View>
                <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">Nombre Completo</Text>
                <TextInput
                  className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                  placeholder="Ej. Carlos Slim"
                  placeholderTextColor="#71717a"
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              <View>
                <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">Correo Electrónico</Text>
                <TextInput
                  className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                  placeholder="carlos@empresa.com"
                  placeholderTextColor="#71717a"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={newEmail}
                  onChangeText={setNewEmail}
                />
              </View>

              <View>
                <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">Contraseña Temporal</Text>
                <TextInput
                  className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                  placeholder="••••••••"
                  placeholderTextColor="#71717a"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View>
                <Text className="text-zinc-500 text-xs font-bold mb-2 ml-1 uppercase">Asignar Roles</Text>
                <View className="flex-row gap-2">
                  {['ADMIN', 'COCINERO', 'MESERO'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => toggleRole(role)}
                      className={cn(
                        "flex-1 p-3 rounded-xl border items-center justify-center",
                        selectedRoles.includes(role)
                          ? `bg-blue-500/20 border-blue-500`
                          : (isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-300 bg-zinc-50")
                      )}
                    >
                      <Text className={cn("text-xs font-bold", selectedRoles.includes(role) ? "text-blue-500" : "text-zinc-500")}>
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSaveMember}
              disabled={isSaving}
              className="bg-blue-600 p-4 rounded-xl items-center flex-row justify-center"
            >
              {isSaving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Guardar Empleado</Text>}
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}