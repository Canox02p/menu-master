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

    // Estado para saber si estamos editando (Guarda el ID de la mesa a editar)
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

            // Verificación segura en caso de que MongoDB regrese objetos vacíos
            const validMesas = Array.isArray(data) ? data.filter(m => m.numero_mesa != null) : [];
            setMesas(validMesas.sort((a: Mesa, b: Mesa) => a.numero_mesa - b.numero_mesa));
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

    // Función que maneja TANTO la creación como la EDICIÓN
    const handleGuardarMesa = async () => {
        if (!newMesa.numero_mesa || !newMesa.capacidad || !newMesa.ubicacion) {
            toast({ title: "Error", description: "El número, capacidad y zona son obligatorios.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                numero_mesa: Number(newMesa.numero_mesa),
                nombre: newMesa.nombre.trim(),
                capacidad: Number(newMesa.capacidad),
                ubicacion: newMesa.ubicacion.trim(),
                // Si estamos editando, NO mandamos el estado para no sobreescribir si está ocupada
                ...(editingId ? {} : { estado: 'LIBRE' })
            };

            // Determinamos URL y Método
            const url = editingId ? `${BASE_URL}/mesas/${editingId}` : `${BASE_URL}/mesas`;
            const method = editingId ? 'PUT' : 'POST'; // Usamos PUT para actualizar completo

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar la mesa en la base de datos.');
            }

            toast({
                title: "¡Éxito!",
                description: editingId ? `La Mesa ${payload.numero_mesa} ha sido actualizada.` : `Mesa ${payload.numero_mesa} registrada exitosamente.`
            });

            setIsModalVisible(false);
            loadMesas(); // Recargamos para ver los cambios
        } catch (error: any) {
            toast({ title: "Error de Guardado", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEliminar = async (id: string, numero_mesa: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`¿Seguro que deseas eliminar permanentemente la Mesa ${numero_mesa}?`)) {
                ejecutarEliminacion(id);
            }
        } else {
            Alert.alert(
                "Eliminar Mesa",
                `¿Seguro que deseas eliminar permanentemente la Mesa ${numero_mesa}?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Eliminar", style: "destructive", onPress: () => ejecutarEliminacion(id) }
                ]
            );
        }
    };

    const ejecutarEliminacion = async (id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/mesas/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast({ title: "Eliminada", description: "La mesa ha sido borrada del sistema." });
                loadMesas();
            } else {
                throw new Error("No se pudo eliminar");
            }
        } catch (e) {
            toast({ title: "Error", description: "Error al conectar con la base de datos.", variant: "destructive" });
        }
    };

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;

    const getCardWidth = (): { width: DimensionValue } => {
        if (isDesktop) return { width: '25%' };
        if (isTablet) return { width: '33.33%' };
        return { width: '100%' };
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
                            className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg w-full md:w-auto justify-center active:scale-95 transition-transform"
                        >
                            <Plus color="white" size={20} />
                            <Text className="text-white font-bold">Añadir Mesa</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap -mx-2">
                        {mesas.length === 0 && !isLoading && (
                            <View className="w-full py-20 items-center justify-center opacity-50">
                                <Text className={cn("text-xl font-bold font-headline mt-4", isDark ? "text-white" : "text-zinc-900")}>No hay mesas configuradas.</Text>
                            </View>
                        )}

                        {isLoading && (
                            <View className="w-full py-10 items-center justify-center">
                                <ActivityIndicator color={primaryColor} size="large" />
                            </View>
                        )}

                        {mesas.map((mesa) => (
                            <View key={mesa._id} style={getCardWidth()} className="p-2 mb-2">
                                <Card className={cn("border-none overflow-hidden rounded-[24px] shadow-sm transition-all hover:shadow-md", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                                    <CardContent className="p-5">

                                        {/* CABECERA DE LA TARJETA */}
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-row items-center gap-3">
                                                <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                                                    <Text style={{ color: primaryColor }} className="text-xl font-bold">{mesa.numero_mesa}</Text>
                                                </View>
                                                <View>
                                                    <Text className={cn("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")} numberOfLines={1}>
                                                        {mesa.nombre || `Mesa ${mesa.numero_mesa}`}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* BOTONES DE ACCIÓN (EDITAR Y ELIMINAR) */}
                                            <View className="flex-row gap-1.5">
                                                <TouchableOpacity
                                                    onPress={() => openEditModal(mesa)}
                                                    className={cn("p-2.5 rounded-xl active:scale-95", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}
                                                >
                                                    <Edit2 color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleEliminar(mesa._id, mesa.numero_mesa)}
                                                    className="p-2.5 bg-red-500/10 rounded-xl active:scale-95"
                                                >
                                                    <Trash2 color="#ef4444" size={16} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* DETALLES DE LA MESA */}
                                        <View className={cn("flex-row items-center justify-between pt-4 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>
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
                    <View className={cn("w-full max-w-md p-6 rounded-[32px] shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                        <View className="flex-row justify-between items-center mb-6 pb-4 border-b" style={{ borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5' }}>
                            <Text className={cn("text-xl font-bold font-headline", isDark ? "text-white" : "text-black")}>
                                {editingId ? "Editar Mesa" : "Registrar Nueva Mesa"}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className={cn("p-2 rounded-full", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                                <X color={isDark ? "#a1a1aa" : "#71717a"} size={20} />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4 mb-6">
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-widest">Número *</Text>
                                    <TextInput
                                        className={cn("px-4 py-4 rounded-xl text-sm font-bold", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                                        placeholder="Ej. 12"
                                        keyboardType="numeric"
                                        value={newMesa.numero_mesa}
                                        onChangeText={(t) => setNewMesa({ ...newMesa, numero_mesa: t })}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-widest">Capacidad *</Text>
                                    <TextInput
                                        className={cn("px-4 py-4 rounded-xl text-sm font-bold", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                                        placeholder="Pax"
                                        keyboardType="numeric"
                                        value={newMesa.capacidad}
                                        onChangeText={(t) => setNewMesa({ ...newMesa, capacidad: t })}
                                    />
                                </View>
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-widest">Nombre Opcional</Text>
                                <TextInput
                                    className={cn("px-4 py-4 rounded-xl text-sm font-bold", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                                    placeholder="Ej. VIP Esquina"
                                    value={newMesa.nombre}
                                    onChangeText={(t) => setNewMesa({ ...newMesa, nombre: t })}
                                />
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-widest">Zona Asignada *</Text>
                                <View className="flex-row flex-wrap gap-2 mt-1">
                                    {['Principal', 'Terraza', 'Barra', 'Privado'].map((zona) => (
                                        <TouchableOpacity
                                            key={zona}
                                            onPress={() => setNewMesa({ ...newMesa, ubicacion: zona })}
                                            style={{
                                                borderColor: newMesa.ubicacion === zona ? primaryColor : (isDark ? '#3f3f46' : '#d4d4d8'),
                                                backgroundColor: newMesa.ubicacion === zona ? `${primaryColor}22` : (isDark ? '#2A2A2A' : '#f4f4f5')
                                            }}
                                            className="px-4 py-3 rounded-xl border flex-grow items-center active:scale-95 transition-transform"
                                        >
                                            <Text style={{ color: newMesa.ubicacion === zona ? primaryColor : (isDark ? '#a1a1aa' : '#71717a') }} className="text-xs font-bold">
                                                {zona}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleGuardarMesa}
                            disabled={isSaving}
                            style={{ backgroundColor: primaryColor }}
                            className="p-4 rounded-xl items-center flex-row justify-center shadow-lg active:scale-95 transition-transform"
                        >
                            {isSaving ? <ActivityIndicator color="white" /> : (
                                <>
                                    <CheckCircle2 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-base">{editingId ? "Actualizar Mesa" : "Guardar Mesa"}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}