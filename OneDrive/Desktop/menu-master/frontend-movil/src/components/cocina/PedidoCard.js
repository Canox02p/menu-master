// src/components/cocina/PedidoCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORES_RESTO } from '../../core/theme';

export default function PedidoCard({ pedido, onActualizarEstado, onEliminar }) {
    // Si la API de Node.js te devuelve los productos en 'detalle_productos'
    const platillos = pedido.detalle_productos || [];

    // Función nativa para confirmar antes de eliminar
    const confirmarEliminacion = () => {
        Alert.alert(
            "Cancelar Pedido",
            `¿Estás seguro de cancelar el pedido de la Mesa ${pedido.numero_mesa || '?'}?`,
            [
                { text: "No", style: "cancel" },
                { text: "Sí, cancelar", onPress: () => onEliminar(pedido._id), style: "destructive" }
            ]
        );
    };

    return (
        <View style={styles.card}>
            {/* --- CABECERA: MESA Y ESTADO --- */}
            <View style={styles.cardHeader}>
                <Text style={styles.mesaText}>
                    Mesa {pedido.numero_mesa || pedido.id_mesa?.numero_mesa || '?'}
                </Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pedido.estado}</Text>
                </View>
            </View>

            <View style={styles.divisor} />

            {/* --- CUERPO: LISTA DE PLATILLOS --- */}
            <View style={styles.platillosList}>
                {platillos.length > 0 ? (
                    platillos.map((item, index) => (
                        <Text key={index} style={styles.platilloText}>
                            <Text style={styles.cantidad}> {item.cantidad}x </Text>
                            {item.nombre_producto}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.platilloText}>Sin detalles de platillos.</Text>
                )}
            </View>

            {/* --- PIE: BOTONES DE ACCIÓN --- */}
            <View style={styles.actionsContainer}>
                {/* Botón de Cancelar / Eliminar (Rojo) */}
                <TouchableOpacity
                    style={[styles.btnAccion, styles.btnEliminar]}
                    onPress={confirmarEliminacion}
                >
                    <Text style={styles.btnTextEliminar}>CANCELAR</Text>
                </TouchableOpacity>

                {/* Botón Principal de Listo (Cian Neón) */}
                <TouchableOpacity
                    style={[styles.btnAccion, styles.btnListo]}
                    onPress={() => onActualizarEstado(pedido._id, 'LISTO')}
                >
                    <Text style={styles.btnTextListo}>MARCAR LISTO</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORES_RESTO?.tarjeta || '#151C24',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 5,
        borderLeftColor: COLORES_RESTO?.cian || '#4DD0E1',
        // Sombras para darle profundidad en el móvil
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    mesaText: {
        color: COLORES_RESTO?.textoClaro || '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: 'rgba(77, 208, 225, 0.15)', // Cian con transparencia
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORES_RESTO?.cian || '#4DD0E1',
    },
    badgeText: {
        color: COLORES_RESTO?.cian || '#4DD0E1',
        fontSize: 12,
        fontWeight: 'bold',
    },
    divisor: {
        height: 1,
        backgroundColor: COLORES_RESTO?.borde || '#2D3748',
        marginBottom: 12,
    },
    platillosList: {
        marginBottom: 20,
    },
    platilloText: {
        color: COLORES_RESTO?.textoClaro || '#FFFFFF',
        fontSize: 16,
        marginBottom: 8,
    },
    cantidad: {
        color: COLORES_RESTO?.naranja || '#FFB74D',
        fontWeight: 'bold',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10, // Espacio entre botones
    },
    btnAccion: {
        flex: 1, // Para que ambos botones midan lo mismo
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnEliminar: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORES_RESTO?.rojo || '#FF5252',
    },
    btnTextEliminar: {
        color: COLORES_RESTO?.rojo || '#FF5252',
        fontWeight: 'bold',
        fontSize: 14,
    },
    btnListo: {
        backgroundColor: COLORES_RESTO?.cian || '#4DD0E1',
    },
    btnTextListo: {
        color: COLORES_RESTO?.fondo || '#0B0F13',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 0.5,
    }
});