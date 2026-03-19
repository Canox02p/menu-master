import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../src/core/api';

// 1. Definimos las "Interfaces" (SOLID: Segregación de Interfaces)
interface Producto {
    nombre: string;
    cantidad: number;
}

interface Pedido {
    _id: string;
    mesa: string | number;
    fecha: string;
    productos: Producto[];
}

export default function CocinaMonitor() {
    const params = useLocalSearchParams();
    // Le decimos a useState que manejaremos un array de Pedidos
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [cargando, setCargando] = useState(true);

    const fetchPedidos = async () => {
        try {
            const response = await fetch(`${API_URL}/pedidos/cocina`);
            const data = await response.json();
            setPedidos(data);
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    // Agregamos el tipo ': string' al parámetro id
    const completarPedido = async (id: string) => {
        try {
            await fetch(`${API_URL}/pedidos/${id}/completar`, { method: 'PATCH' });
            fetchPedidos();
        } catch (error) {
            console.error("Error al completar:", error);
        }
    };

    // Le decimos que item es de tipo Pedido
    const renderPedido = ({ item }: { item: Pedido }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.mesaText}>Mesa: {item.mesa}</Text>
                <Text style={styles.horaText}>🕒 {new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>

            <View style={styles.itemsContainer}>
                {item.productos.map((prod: Producto, index: number) => (
                    <Text key={index} style={styles.productoText}>
                        • {prod.cantidad}x {prod.nombre}
                    </Text>
                ))}
            </View>

            <TouchableOpacity
                style={styles.btnListo}
                onPress={() => completarPedido(item._id)}
            >
                <Text style={styles.btnListoText}>MARCAR COMO LISTO ✅</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ORDENES PENDIENTES 👨‍🍳</Text>
                <TouchableOpacity onPress={fetchPedidos} style={styles.refreshBtn}>
                    <Text style={{ fontSize: 20 }}>🔄</Text>
                </TouchableOpacity>
            </View>

            {cargando ? (
                <ActivityIndicator size="large" color="#4DD0E1" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={pedidos}
                    keyExtractor={(item) => item._id}
                    renderItem={renderPedido}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay pedidos por ahora...</Text>}
                />
            )}
        </SafeAreaView>
    );
}

// ... (los estilos se mantienen igual que antes)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F13' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
    headerTitle: { color: '#4DD0E1', fontSize: 18, fontWeight: 'bold' },
    refreshBtn: { padding: 5 },
    listContent: { padding: 15 },
    card: { backgroundColor: '#151C24', borderRadius: 12, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#4DD0E1' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    mesaText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    horaText: { color: '#718096', fontSize: 12 },
    itemsContainer: { marginBottom: 15 },
    productoText: { color: '#E2E8F0', fontSize: 15, marginBottom: 4 },
    btnListo: { backgroundColor: '#2D3748', padding: 12, borderRadius: 8, alignItems: 'center' },
    btnListoText: { color: '#4DD0E1', fontWeight: 'bold' },
    emptyText: { color: '#718096', textAlign: 'center', marginTop: 50 }
});