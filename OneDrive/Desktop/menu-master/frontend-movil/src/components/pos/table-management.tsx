'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, DimensionValue } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users, MapPin, CheckCircle2, X, Trash2, Edit2 } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/hooks/use-toast';

interface Mesa {
    _id: string;
    numero_mesa: number;
    nombre_mesa?: string;
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
            const validMesas = Array.isArray(data) ? data.filter(m => m && m._id) : [];
            setMesas(validMesas.sort((a, b) => a.numero_mesa - b.numero_mesa));
        } catch (error) {
            toast({ title: "Error", description: "No se cargaron las mesas.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadMesas(); }, []);

    const openEditModal = (mesa: Mesa) => {
        setEditingId(mesa._id);
        setNewMesa({
            numero_mesa: String(mesa.numero_mesa),
            nombre: mesa.nombre_mesa || '',
            capacidad: String(mesa.capacidad),
            ubicacion: mesa.ubicacion || 'Principal'
        });
        setIsModalVisible(true);
    };

    const handleGuardarMesa = async () => {
        setIsSaving(true);
        try {
            const payload = {
                numero_mesa: Number(newMesa.numero_mesa),
                nombre: newMesa.nombre.trim(),
                capacidad: Number(newMesa.capacidad),
                ubicacion: newMesa.ubicacion
            };

            const url = editingId ? `${BASE_URL}/mesas/${editingId}` : `${BASE_URL}/mesas`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Error en el servidor.");

            toast({ title: "¡Éxito!", description: "Cambios guardados." });
            setIsModalVisible(false);
            loadMesas();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const isDesktop = width >= 1024;
    const getCardWidth = (): { width: DimensionValue } => {
        return isDesktop ? { width: '25%' } : { width: '100%' };
    };

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
            <ScrollView className="flex-1 px-4 pt-8">

                <View className="flex-row justify-between items-center mb-8">
                    <Text className={cn("text-3xl font-bold", isDark ? "text-white" : "text-black")}>Mesas</Text>
                    <TouchableOpacity onPress={() => { setEditingId(null); setIsModalVisible(true); }}
                        style={{ backgroundColor: primaryColor }} className="px-6 py-3 rounded-2xl shadow-lg">
                        <Plus color="white" size={20} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap -mx-2">
                    {mesas.map((mesa) => (
                        <View key={mesa._id} style={getCardWidth()} className="p-2 mb-2">
                            <Card className={cn("border-none overflow-hidden rounded-[24px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                                <CardContent className="p-5">

                                    {/* CABECERA: SOLO NÚMERO Y ACCIONES */}
                                    <View className="flex-row justify-between items-start mb-6">
                                        <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                                            <Text style={{ color: primaryColor }} className="text-xl font-bold">{mesa.numero_mesa}</Text>
                                        </View>
                                        <View className="flex-row gap-1.5">
                                            <TouchableOpacity onPress={() => openEditModal(mesa)} className="p-2.5 rounded-xl bg-zinc-800/50">
                                                <Edit2 color="white" size={16} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* PARTE DE ABAJO: NOMBRE, ZONA Y NÚMERO */}
                                    <View className={cn("pt-4 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>

                                        {/* NOMBRE DE LA MESA */}
                                        <Text className={cn("text-sm font-bold mb-3", isDark ? "text-white" : "text-black")} numberOfLines={1}>
                                            {mesa.nombre_mesa || `Mesa ${mesa.numero_mesa}`}
                                        </Text>

                                        <View className="flex-row items-center justify-between">
                                            {/* ZONA */}
                                            <View className="flex-row items-center gap-1.5">
                                                <MapPin color="gray" size={14} />
                                                <Text className="text-zinc-500 text-xs">{mesa.ubicacion || "Principal"}</Text>
                                            </View>

                                            {/* CAPACIDAD (SOLO NÚMERO) */}
                                            <View className="flex-row items-center gap-1.5">
                                                <Users color="gray" size={14} />
                                                <View className="bg-zinc-800 px-2 py-0.5 rounded-md">
                                                    <Text className="text-white text-xs font-bold">{mesa.capacidad || 0}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </CardContent>
                            </Card>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Modal de Edición */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/70 justify-center p-6">
                    <View className={cn("p-6 rounded-[32px]", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                        <Text className={cn("text-xl font-bold mb-6", isDark ? "text-white" : "text-black")}>Configurar Mesa</Text>

                        <TextInput placeholder="Número" placeholderTextColor="gray"
                            className="bg-zinc-800 text-white p-4 rounded-xl mb-4 font-bold"
                            value={newMesa.numero_mesa} onChangeText={(t) => setNewMesa({ ...newMesa, numero_mesa: t })} />

                        <TextInput placeholder="Nombre (ej. VIP Esquina)" placeholderTextColor="gray"
                            className="bg-zinc-800 text-white p-4 rounded-xl mb-4 font-bold"
                            value={newMesa.nombre} onChangeText={(t) => setNewMesa({ ...newMesa, nombre: t })} />

                        <TextInput placeholder="Capacidad" placeholderTextColor="gray"
                            className="bg-zinc-800 text-white p-4 rounded-xl mb-4 font-bold"
                            value={newMesa.capacidad} onChangeText={(t) => setNewMesa({ ...newMesa, capacidad: t })} />

                        <View className="flex-row flex-wrap gap-2 mb-8">
                            {['Principal', 'Terraza', 'Barra', 'Privado'].map((z) => (
                                <TouchableOpacity key={z} onPress={() => setNewMesa({ ...newMesa, ubicacion: z })}
                                    style={{ backgroundColor: newMesa.ubicacion === z ? primaryColor : '#2A2A2A' }}
                                    className="px-4 py-2 rounded-lg">
                                    <Text className="text-white text-xs font-bold">{z}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={handleGuardarMesa} style={{ backgroundColor: primaryColor }} className="p-4 rounded-xl shadow-lg">
                            <Text className="text-white text-center font-bold">Actualizar Mesa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}