'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users, MapPin, Hash, CheckCircle2, X, Trash2, Edit2 } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/hooks/use-toast';

interface Mesa {
    _id: string;
    numero_mesa: number;
    nombre?: string;
    capacidad: number;
    ubicacion: string;
    estado: 'LIBRE' | 'OCUPADA';
}

const CHARCOAL_GRAY = "#171A1C";
const BASE_URL = 'https://menu-master-api.onrender.com';

export function TableManagement() {
    const { theme, primaryColor } = useTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const { toast } = useToast();

    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // NUEVO: Estado para saber si estamos editando
    const [editingId, setEditingId] = useState<string | null>(null);

    const [newMesa, setNewMesa] = useState({
        numero_mesa: '',
        nombre: '',
        capacidad: '4',
        ubicacion: 'Principal'
    });

    const loadMesas = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}/mesas`);
            const data = await response.json();
            setMesas(data.sort((a: Mesa, b: Mesa) => a.numero_mesa - b.numero_mesa));
        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar las mesas.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadMesas(); }, []);

    // Función para abrir el modal en modo "Crear"
    const openCreateModal = () => {
        setEditingId(null);
        setNewMesa({ numero_mesa: '', nombre: '', capacidad: '4', ubicacion: 'Principal' });
        setIsModalVisible(true);
    };

    // Función para abrir el modal en modo "Editar"
    const openEditModal = (mesa: Mesa) => {
        setEditingId(mesa._id);
        setNewMesa({
            numero_mesa: mesa.numero_mesa.toString(),
            nombre: mesa.nombre || '',
            capacidad: mesa.capacidad.toString(),
            ubicacion: mesa.ubicacion || 'Principal'
        });
        setIsModalVisible(true);
    };

    const handleGuardarMesa = async () => {
        if (!newMesa.numero_mesa || !newMesa.capacidad || !newMesa.ubicacion) {
            toast({ title: "Error", description: "Llena los campos obligatorios.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                numero_mesa: Number(newMesa.numero_mesa),
                nombre: newMesa.nombre.trim(),
                capacidad: Number(newMesa.capacidad),
                ubicacion: newMesa.ubicacion.trim(),
                estado: 'LIBRE' // Se asume libre al crear/editar su estructura
            };

            // Determinamos si es POST (Crear) o PUT (Editar)
            const url = editingId ? `${BASE_URL}/mesas/${editingId}` : `${BASE_URL}/mesas`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Error al guardar la mesa.');

            toast({
                title: "Éxito",
                description: editingId ? `Mesa ${payload.numero_mesa} actualizada.` : `Mesa ${payload.numero_mesa} añadida.`
            });

            setIsModalVisible(false);
            loadMesas();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEliminar = async (id: string, numero_mesa: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`¿Seguro que deseas eliminar la Mesa ${numero_mesa}?`)) ejecutarEliminacion(id);
        } else {
            Alert.alert("Eliminar", `¿Seguro que deseas eliminar la Mesa ${numero_mesa}?`, [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => ejecutarEliminacion(id) }
            ]);
        }
    };

    const ejecutarEliminacion = async (id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/mesas/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast({ title: "Eliminada", description: "Mesa borrada del sistema." });
                loadMesas();
            }
        } catch (e) {
            toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
        }
    };

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;

    const getCardWidth = (): { width: DimensionValue } => {
        if (isDesktop) return { width: '25%' };
        if (isTablet) return { width: '33.33%' };
        return { width: '100%' }; // En móvil mejor 1 columna para que quepan bien los botones
    };

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

                    <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
                        <View>
                            <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>Gestión de Mesas</Text>
                            <Text className="text-zinc-500">Añade, edita y organiza los espacios físicos del restaurante.</Text>
                        </View>
                        <TouchableOpacity
                            onPress={openCreateModal}
                            style={{ backgroundColor: primaryColor }}
                            className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg w-full md:w-auto justify-center"
                        >
                            <Plus color="white" size={20} />
                            <Text className="text-white font-bold">Añadir Mesa</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap -mx-2">
                        {mesas.length === 0 && !isLoading && (
                            <Text className="text-zinc-500 p-4 w-full text-center">No hay mesas configuradas.</Text>
                        )}

                        {mesas.map((mesa) => (
                            <View key={mesa._id} style={getCardWidth()} className="p-2 mb-2">
                                <Card className={cn("border-none overflow-hidden rounded-[24px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                                    <CardContent className="p-5">

                                        {/* CABECERA DE LA TARJETA */}
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-row items-center gap-3">
                                                <View className="w-12 h-12 rounded-[14px] bg-blue-500/10 items-center justify-center">
                                                    <Text className="text-xl font-bold text-blue-500">{mesa.numero_mesa}</Text>
                                                </View>
                                                <View>
                                                    <Text className={cn("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")}>
                                                        {mesa.nombre || `Mesa ${mesa.numero_mesa}`}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* BOTONES DE ACCIÓN (EDITAR Y ELIMINAR) */}
                                            <View className="flex-row gap-1">
                                                <TouchableOpacity onPress={() => openEditModal(mesa)} className={cn("p-2 rounded-xl", isDark ? "bg-zinc-800" : "bg-zinc-100")}>
                                                    <Edit2 color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleEliminar(mesa._id, mesa.numero_mesa)} className="p-2 bg-red-500/10 rounded-xl">
                                                    <Trash2 color="#ef4444" size={16} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* DETALLES DE LA MESA */}
                                        <View className={cn("flex-row items-center justify-between pt-4 border-t", isDark ? "border-zinc-800" : "border-zinc-100")}>
                                            <View className="flex-row items-center gap-1.5">
                                                <MapPin color={isDark ? "#71717a" : "#a1a1aa"} size={14} />
                                                <Text className={cn("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-600")}>{mesa.ubicacion}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1.5">
                                                <Users color={isDark ? "#71717a" : "#a1a1aa"} size={14} />
                                                <Text className={cn("text-sm font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>{mesa.capacidad} pax</Text>
                                            </View>
                                        </View>

                                    </CardContent>
                                </Card>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* MODAL (CREAR / EDITAR) */}
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/60 items-center justify-center p-4">
                    <View className={cn("w-full max-w-md p-6 rounded-[24px] shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>
                                {editingId ? "Editar Mesa" : "Registrar Nueva Mesa"}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-2">
                                <X color={isDark ? "#a1a1aa" : "#71717a"} size={24} />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4 mb-6">
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs font-bold mb-1 uppercase">Número *</Text>
                                    <TextInput className={cn("px-4 py-4 rounded-xl text-sm", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100")} placeholder="Ej. 12" keyboardType="numeric" value={newMesa.numero_mesa} onChangeText={(t) => setNewMesa({ ...newMesa, numero_mesa: t })} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs font-bold mb-1 uppercase">Capacidad *</Text>
                                    <TextInput className={cn("px-4 py-4 rounded-xl text-sm", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100")} placeholder="Pax" keyboardType="numeric" value={newMesa.capacidad} onChangeText={(t) => setNewMesa({ ...newMesa, capacidad: t })} />
                                </View>
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-xs font-bold mb-1 uppercase">Nombre (Opcional)</Text>
                                <TextInput className={cn("p-4 rounded-xl text-sm", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100")} placeholder="Ej. VIP Esquina" value={newMesa.nombre} onChangeText={(t) => setNewMesa({ ...newMesa, nombre: t })} />
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-xs font-bold mb-1 uppercase">Zona *</Text>
                                <View className="flex-row flex-wrap gap-2 mt-1">
                                    {['Principal', 'Terraza', 'Barra', 'Privado'].map((zona) => (
                                        <TouchableOpacity key={zona} onPress={() => setNewMesa({ ...newMesa, ubicacion: zona })} style={{ borderColor: newMesa.ubicacion === zona ? primaryColor : (isDark ? '#3f3f46' : '#d4d4d8'), backgroundColor: newMesa.ubicacion === zona ? `${primaryColor}22` : (isDark ? '#2A2A2A' : '#f4f4f5') }} className="px-4 py-2.5 rounded-xl border flex-grow items-center">
                                            <Text style={{ color: newMesa.ubicacion === zona ? primaryColor : '#71717a' }} className="text-xs font-bold">{zona}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleGuardarMesa} disabled={isSaving} style={{ backgroundColor: primaryColor }} className="p-4 rounded-xl items-center flex-row justify-center">
                            {isSaving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">{editingId ? "Actualizar Mesa" : "Crear Mesa"}</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}