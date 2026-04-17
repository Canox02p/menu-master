import React from 'react';
import { View, Text } from 'react-native';
import { MapPin, Users } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface MesaStatusProps {
    mesa: any;
    isDark: boolean;
}

export function MesaStatus({ mesa, isDark }: MesaStatusProps) {
    return (
        <View className={cn("pt-4 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-100")}>

            {/* NOMBRE DE LA MESA */}
            <View className="mb-2 flex-row">
                <Text className={cn("text-xs font-bold", isDark ? "text-zinc-500" : "text-zinc-400")}>Nombre: </Text>
                <Text className={cn("text-xs font-bold", isDark ? "text-white" : "text-zinc-900")}>
                    {mesa.nombre_mesa || "Sin asignar"}
                </Text>
            </View>

            {/* ATIENDE (Solo si está ocupada) */}
            {mesa.estado === 'OCUPADA' && (
                <View className="mb-2">
                    <Text className="text-[9px] font-bold text-zinc-500 uppercase">Atiende:</Text>
                    <Text className={cn("text-xs font-black uppercase", isDark ? "text-white" : "text-zinc-900")}>
                        {mesa.id_mesero_actual?.nombre || "MESERO"}
                    </Text>
                </View>
            )}

            {/* ETIQUETA DE ESTADO (PILL) */}
            <View className="mb-4 flex-row">
                <View className={cn(
                    "flex-row items-center px-3 py-1 rounded-full",
                    mesa.estado === 'OCUPADA' ? "bg-red-500/10" : "bg-emerald-500/10"
                )}>
                    <View className={cn("w-2 h-2 rounded-full mr-2", mesa.estado === 'OCUPADA' ? "bg-red-500" : "bg-emerald-500")} />
                    <Text className={cn("text-[10px] font-black uppercase tracking-widest", mesa.estado === 'OCUPADA' ? "text-red-500" : "text-emerald-500")}>
                        {mesa.estado || 'LIBRE'}
                    </Text>
                </View>
            </View>

            {/* ZONA Y CAPACIDAD */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                    <MapPin color="gray" size={14} />
                    <Text className="text-zinc-500 text-xs">{mesa.ubicacion || "Principal"}</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <Users color="gray" size={14} />
                    <View className="bg-zinc-800 px-2 py-0.5 rounded-md">
                        <Text className="text-white text-xs font-bold">{mesa.capacidad || 0}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}