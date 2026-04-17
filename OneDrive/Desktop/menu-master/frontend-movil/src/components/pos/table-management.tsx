'use client';

import { MesaStatus } from './mesa-status';
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
    nombre_mesa: string;
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

    // Función de carga (con opción de carga silenciosa para el tiempo real)
    const loadMesas = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
            const response = await fetch(`${BASE_URL}/mesas`);
            const data = await response.json();
            const validMesas = Array.isArray(data) ? data.filter(m => m && m._id) : [];
            setMesas(validMesas.sort((a: Mesa, b: Mesa) => a.numero_mesa - b.numero_mesa));
        } catch (error) {
            if (!silent) toast({ title: "Error", description: "No se pudieron cargar.", variant: "destructive" });
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    // ACTUALIZACIÓN AUTOMÁTICA (Cada 5 segundos)
    useEffect(() => {
        loadMesas();
        const interval = setInterval(() => loadMesas(true), 5000);
        return () => clearInterval(interval);
    }, []);

    const openCreateModal = () => {
        setEditingId(null);
        setNewMesa({ numero_mesa: '', nombre: '', capacidad: '4', ubicacion: 'Principal' });
        setIsModalVisible(true);
    };

    const openEditModal = (mesa: Mesa) => {
        if (!mesa) return;
        setEditingId(mesa._id);
        setNewMesa({
            numero_mesa: String(mesa.numero_mesa ?? ''),
            nombre: mesa.nombre_mesa || '',
            capacidad: String(mesa.capacidad ?? '4'),
            ubicacion: mesa.ubicacion || 'Principal'
        });
        setIsModalVisible(true);
    };

    const handleGuardarMesa = async () => {
        if (!newMesa.numero_mesa || !newMesa.capacidad || !newMesa.ubicacion) return;
        setIsSaving(true);
        try {
            const payload = {
                numero_mesa: Number(newMesa.numero_mesa),
                nombre: newMesa.nombre.trim(),
                capacidad: Number(newMesa.capacidad),
                ubicacion: newMesa.ubicacion.trim(),
                ...(editingId ? {} : { estado: 'LIBRE' })
            };
            const url = editingId ? `${BASE_URL}/mesas/${editingId}` : `${BASE_URL}/mesas`;
            const method = editingId ? 'PUT' : 'POST';
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            setIsModalVisible(false);
            loadMesas();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        } finally {
            setIsSaving(false);
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
                            <Text className={cn("text-3xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Gestión de Mesas</Text>
                            <Text className="text-zinc-500">Visualización en tiempo real del estado de sala.</Text>
                        </View>
                        <TouchableOpacity onPress={openCreateModal} style={{ backgroundColor: primaryColor }} className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg active:scale-95">
                            <Plus color="white" size={20} />
                            <Text className="text-white font-bold">Añadir Mesa</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap -mx-2">
                        {mesas.map((mesa) => (
                            <View key={mesa._id} style={getCardWidth()} className="p-2 mb-2">
                                <Card className={cn("border-none overflow-hidden rounded-[24px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                                    <CardContent className="p-5">

                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-row items-center gap-3">
                                                <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                                                    <Text style={{ color: primaryColor }} className="text-xl font-bold">{mesa.numero_mesa}</Text>
                                                </View>
                                                <View>
                                                    <Text className={cn("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")} numberOfLines={1}>
                                                        {`Mesa ${mesa.numero_mesa}`}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="flex-row gap-1.5">
                                                <TouchableOpacity onPress={() => openEditModal(mesa)} className={cn("p-2.5 rounded-xl", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                                                    <Edit2 color={isDark ? "#a1a1aa" : "#71717a"} size={16} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* SOLO AGREGAMOS ESTO: ETIQUETA DE ESTADO AUTOMÁTICA */}
                                        <MesaStatus mesa={mesa} isDark={isDark} />

                                    </CardContent>
                                </Card>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* MODAL RESTAURADO AL DISEÑO ORIGINAL "BONITO" */}
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/60 items-center justify-center p-4">
                    <View className={cn("w-full max-w-md p-6 rounded-[32px] shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                        <View className="flex-row justify-between items-center mb-6 pb-4 border-b" style={{ borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5' }}>
                            <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>
                                {editingId ? "Editar Mesa" : "Registrar Nueva Mesa"}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className={cn("p-2 rounded-full", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                                <X color={isDark ? "#a1a1aa" : "#71717a"} size={20} />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4 mb-6">
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase">Número *</Text>
                                    <TextInput
                                        className={cn("px-4 py-4 rounded-xl font-bold", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                                        keyboardType="numeric"
                                        value={newMesa.numero_mesa}
                                        onChangeText={(t) => setNewMesa({ ...newMesa, numero_mesa: t })}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase">Capacidad *</Text>
                                    <TextInput
                                        className={cn("px-4 py-4 rounded-xl font-bold", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                                        keyboardType="numeric"
                                        value={newMesa.capacidad}
                                        onChangeText={(t) => setNewMesa({ ...newMesa, capacidad: t })}
                                    />
                                </View>
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase">Nombre Personalizado</Text>
                                <TextInput
                                    className={cn("px-4 py-4 rounded-xl font-bold", isDark ? "bg-[#2A2A2A] text-white" : "bg-zinc-100 text-black")}
                                    placeholder="Ej. VIP Esquina"
                                    value={newMesa.nombre}
                                    onChangeText={(t) => setNewMesa({ ...newMesa, nombre: t })}
                                />
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-xs font-bold mb-2 uppercase">Zona *</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {['Principal', 'Terraza', 'Barra', 'Privado'].map((zona) => (
                                        <TouchableOpacity
                                            key={zona}
                                            onPress={() => setNewMesa({ ...newMesa, ubicacion: zona })}
                                            style={{
                                                borderColor: newMesa.ubicacion === zona ? primaryColor : (isDark ? '#3f3f46' : '#d4d4d8'),
                                                backgroundColor: newMesa.ubicacion === zona ? `${primaryColor}15` : (isDark ? '#2A2A2A' : '#f4f4f5')
                                            }}
                                            className="px-4 py-2 rounded-xl border flex-grow items-center"
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
                            className="p-4 rounded-xl items-center flex-row justify-center shadow-lg active:scale-95"
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