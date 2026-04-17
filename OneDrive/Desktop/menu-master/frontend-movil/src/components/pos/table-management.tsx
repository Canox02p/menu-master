'use client';

import { MesaStatus } from './mesa-status'; // Componente compartido
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

    const loadMesas = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}/mesas`);
            const data = await response.json();
            const validMesas = Array.isArray(data) ? data.filter(m => m && m._id && m.numero_mesa != null) : [];
            setMesas(validMesas.sort((a: Mesa, b: Mesa) => a.numero_mesa - b.numero_mesa));
        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadMesas(); }, []);

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
            <ScrollView className="flex-1 px-4 pt-8">
                <View className="flex-row justify-between items-center mb-8 px-2">
                    <Text className={cn("text-3xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Gestión</Text>
                    <TouchableOpacity onPress={openCreateModal} style={{ backgroundColor: primaryColor }} className="rounded-2xl p-4 shadow-lg">
                        <Plus color="white" size={20} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap -mx-2">
                    {mesas.map((mesa) => (
                        <View key={mesa._id} style={getCardWidth()} className="p-2 mb-2">
                            <Card className={cn("border-none overflow-hidden rounded-[24px] shadow-sm", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                                <CardContent className="p-5">

                                    {/* CABECERA (Número y Editar) */}
                                    <View className="flex-row justify-between items-start mb-6">
                                        <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                                            <Text style={{ color: primaryColor }} className="text-xl font-bold">{mesa.numero_mesa}</Text>
                                        </View>
                                        <View>
                                            <Text className={cn("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")}>
                                                Mesa {mesa.numero_mesa}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => openEditModal(mesa)} className="p-2.5 rounded-xl bg-zinc-800/50">
                                            <Edit2 color="white" size={16} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* DETALLES INFERIORES MODULARES */}
                                    <MesaStatus mesa={mesa} isDark={isDark} />

                                </CardContent>
                            </Card>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Modal visible={isModalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/60 items-center justify-center p-4">
                    <View className={cn("w-full max-w-md p-6 rounded-[32px] shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
                        <Text className={cn("text-xl font-bold mb-6", isDark ? "text-white" : "text-black")}>Configurar Mesa</Text>
                        <TextInput placeholder="Nombre" placeholderTextColor="gray" className="bg-zinc-800 text-white p-4 rounded-xl mb-4 font-bold"
                            value={newMesa.nombre} onChangeText={(t) => setNewMesa({ ...newMesa, nombre: t })} />
                        <View className="flex-row gap-4 mb-4">
                            <TextInput placeholder="Núm" placeholderTextColor="gray" className="flex-1 bg-zinc-800 text-white p-4 rounded-xl font-bold"
                                value={newMesa.numero_mesa} onChangeText={(t) => setNewMesa({ ...newMesa, numero_mesa: t })} />
                            <TextInput placeholder="Cap" placeholderTextColor="gray" className="flex-1 bg-zinc-800 text-white p-4 rounded-xl font-bold"
                                value={newMesa.capacidad} onChangeText={(t) => setNewMesa({ ...newMesa, capacidad: t })} />
                        </View>
                        <TouchableOpacity onPress={handleGuardarMesa} style={{ backgroundColor: primaryColor }} className="p-4 rounded-xl">
                            <Text className="text-white text-center font-bold">Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}