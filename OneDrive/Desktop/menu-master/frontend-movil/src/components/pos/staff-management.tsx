'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Shield, Star, Calendar, Store, Mail, X, Edit, Phone, CheckCircle, XCircle } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// ==========================================
// 1. INTERFACES
// ==========================================

interface StaffMember {
  id: string;
  name: string;
  roles: string[];
  estado: string; // 'ACTIVO' o 'INACTIVO'
  email: string;
  phone: string;
  restaurante: string;
  joined: string;
  performance: number;
}

interface StaffCardProps {
  member: StaffMember;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onEditPress: (member: StaffMember) => void;
  onDeletePress: (id: string, name: string) => void;
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. TARJETAS DE PERSONAL
// ==========================================

const StaffCard = ({ member, isDark, primaryColor, widthStyle, onEditPress, onDeletePress }: StaffCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Estado Activo/Inactivo
  const isActive = member.estado === 'ACTIVO';

  // Extraemos el rol principal
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
              <View className={cn("px-3 py-1.5 rounded-full flex-row items-center gap-1.5", isActive ? "bg-emerald-500/10" : "bg-zinc-500/10")}>
                {isActive ? <CheckCircle color="#10b981" size={12} /> : <XCircle color="#71717a" size={12} />}
                <Text className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-emerald-500" : "text-zinc-500")}>
                  {member.estado}
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
                <Phone color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                <Text className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")} numberOfLines={1}>{member.phone}</Text>
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
                onPress={() => onEditPress(member)}
                className={cn(
                  "flex-1 rounded-xl h-11 border items-center justify-center flex-row gap-2 transition-colors",
                  isDark ? "border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                )}
              >
                <Edit color={isDark ? "#d4d4d8" : "#52525b"} size={14} />
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onDeletePress(member.id, member.name)}
                className={cn(
                  "flex-1 rounded-xl h-11 border items-center justify-center transition-colors",
                  isDark ? "border-red-900/50 bg-red-500/10 hover:bg-red-500/20" : "border-red-200 bg-red-50 hover:bg-red-100"
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
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulario
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['MESERO']);
  const [isActive, setIsActive] = useState(true);

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const data = await api.usuarios.getAll();

      const mappedStaff: StaffMember[] = data.map((u: any) => ({
        id: u._id,
        name: u.nombre || 'Sin Nombre',
        roles: u.roles || (u.rol ? [u.rol] : ['EMPLEADO']),
        email: u.email || 'sin@correo.com',
        phone: u.telefono || 'Sin registro', // Lee el teléfono de la BD
        estado: u.estado || 'ACTIVO',
        restaurante: u.restaurante_nombre || 'Sin asignar',
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
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setSelectedRoles(['MESERO']);
    setIsActive(true);
    setIsModalVisible(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingId(member.id);
    setNewName(member.name);
    setNewEmail(member.email);
    setNewPhone(member.phone === 'Sin registro' ? '' : member.phone);
    setSelectedRoles(member.roles);
    setIsActive(member.estado === 'ACTIVO');
    setNewPassword(''); // La contraseña se deja en blanco al editar
    setIsModalVisible(true);
  };

  const validateForm = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast({ title: "Error", description: "El nombre y el correo son obligatorios.", variant: "destructive" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({ title: "Error", description: "El formato del correo es inválido.", variant: "destructive" });
      return false;
    }
    if (!editingId && newPassword.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSaveMember = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload: any = {
        nombre: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        telefono: newPhone.trim(),
        roles: selectedRoles,
        estado: isActive ? 'ACTIVO' : 'INACTIVO'
      };

      // Si es nuevo, la contraseña es obligatoria. Si es edición, solo se envía si escribió algo.
      if (!editingId) {
        payload.password_hash = newPassword.trim();
        payload.restaurante_nombre = "Registrado por Admin";
      } else if (newPassword.trim().length > 0) {
        payload.password_hash = newPassword.trim();
      }

      const url = editingId
        ? `https://menu-master-api.onrender.com/usuarios/${editingId}`
        : `https://menu-master-api.onrender.com/usuarios`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al guardar el empleado.');

      toast({ title: "¡Éxito!", description: editingId ? "Empleado actualizado." : "Empleado registrado." });
      setIsModalVisible(false);
      loadStaff();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmation = (id: string, name: string) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${name}? Esta acción no se puede deshacer.`);
      if (confirm) ejecutarEliminacion(id);
    } else {
      Alert.alert(
        "Eliminar Empleado",
        `¿Estás seguro de que deseas eliminar a ${name}? Esta acción no se puede deshacer.`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: () => ejecutarEliminacion(id) }
        ]
      );
    }
  };

  const ejecutarEliminacion = async (id: string) => {
    try {
      const response = await fetch(`https://menu-master-api.onrender.com/usuarios/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Eliminado", description: "El empleado ha sido removido del sistema." });
        loadStaff();
      } else {
        throw new Error("No se pudo eliminar de la base de datos.");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

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
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full pb-24">

          {/* HEADER */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View>
              <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Directorio del Equipo
              </Text>
              <Text className="text-zinc-500">Administra roles, estado y personal de tu sucursal.</Text>
            </View>

            <View className="flex-row items-center gap-4 mt-2 md:mt-0 w-full md:w-auto">
              {isLoading && <ActivityIndicator color={primaryColor} />}
              <TouchableOpacity
                onPress={openAddModal}
                activeOpacity={0.8}
                style={{ backgroundColor: primaryColor }}
                className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg flex-1 md:flex-none justify-center"
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
                onEditPress={openEditModal}
                onDeletePress={handleDeleteConfirmation}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE EMPLEADO (Crear / Editar) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className={cn("w-full max-w-md p-6 rounded-[24px] shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>

            <View className="flex-row justify-between items-center mb-6">
              <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>
                {editingId ? "Editar Empleado" : "Nuevo Empleado"}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-2">
                <X color={isDark ? "#a1a1aa" : "#71717a"} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[70vh] mb-4" showsVerticalScrollIndicator={false}>
              <View className="space-y-4">

                <View>
                  <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">Nombre Completo *</Text>
                  <TextInput
                    className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                    placeholder="Ej. Juan Pérez"
                    placeholderTextColor="#71717a"
                    value={newName}
                    onChangeText={setNewName}
                  />
                </View>

                <View>
                  <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">Correo Electrónico *</Text>
                  <TextInput
                    className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                    placeholder="correo@empresa.com"
                    placeholderTextColor="#71717a"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={newEmail}
                    onChangeText={setNewEmail}
                  />
                </View>

                <View>
                  <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">Teléfono</Text>
                  <TextInput
                    className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                    placeholder="771 000 0000"
                    placeholderTextColor="#71717a"
                    keyboardType="phone-pad"
                    value={newPhone}
                    onChangeText={setNewPhone}
                  />
                </View>

                <View>
                  <Text className="text-zinc-500 text-xs font-bold mb-1 ml-1 uppercase">
                    {editingId ? "Nueva Contraseña (Opcional)" : "Contraseña Temporal *"}
                  </Text>
                  <TextInput
                    className={cn("p-4 rounded-xl text-sm font-medium", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                    placeholder={editingId ? "Dejar en blanco para no cambiar" : "••••••••"}
                    placeholderTextColor="#71717a"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                {/* BOTÓN DE ESTADO (ACTIVO/INACTIVO) */}
                <View>
                  <Text className="text-zinc-500 text-xs font-bold mb-2 ml-1 uppercase">Estado en la empresa</Text>
                  <TouchableOpacity
                    onPress={() => setIsActive(!isActive)}
                    style={{
                      borderColor: isActive ? '#10b981' : '#71717a',
                      backgroundColor: isActive ? '#10b9811A' : (isDark ? '#2A2A2A' : '#f4f4f5')
                    }}
                    className="flex-row items-center justify-between p-4 rounded-xl border"
                  >
                    <View className="flex-row items-center gap-3">
                      {isActive ? <CheckCircle color="#10b981" size={20} /> : <XCircle color="#71717a" size={20} />}
                      <Text className={cn("font-bold", isActive ? "text-emerald-500" : "text-zinc-500")}>
                        {isActive ? "Cuenta Activa" : "Cuenta Suspendida"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="text-zinc-500 text-xs font-bold mb-2 ml-1 uppercase">Asignar Roles</Text>
                  <View className="flex-row gap-2">
                    {['ADMIN', 'COCINERO', 'MESERO'].map((role) => {
                      const isSelected = selectedRoles.includes(role);
                      return (
                        <TouchableOpacity
                          key={role}
                          onPress={() => toggleRole(role)}
                          style={{
                            borderColor: isSelected ? primaryColor : (isDark ? '#3f3f46' : '#d4d4d8'),
                            backgroundColor: isSelected ? `${primaryColor}22` : (isDark ? '#2A2A2A' : '#f4f4f5')
                          }}
                          className="flex-1 p-3 rounded-xl border items-center justify-center"
                        >
                          <Text style={{ color: isSelected ? primaryColor : '#71717a' }} className="text-xs font-bold">
                            {role}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleSaveMember}
              disabled={isSaving}
              style={{ backgroundColor: primaryColor }}
              className="p-4 rounded-xl items-center flex-row justify-center mt-2"
            >
              {isSaving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Guardar Cambios</Text>}
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}