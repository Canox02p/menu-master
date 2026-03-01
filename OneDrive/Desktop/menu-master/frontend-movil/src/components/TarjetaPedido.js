import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { obtenerColorTexto } from '../core/colorUtils';
import { COLORES_RESTO } from '../core/theme';

// S de SOLID: Solo muestra la información de un pedido.
const TarjetaPedido = ({ mesa, estado, total }) => {
    const colorEstado = obtenerColorTexto(estado);

    return (
        <TouchableOpacity style={styles.tarjeta} activeOpacity={0.7}>
            <View style={styles.topInfo}>
                <Text style={styles.textoMesa}>Mesa {mesa}</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: colorEstado }]} />
                    <Text style={[styles.textoEstado, { color: colorEstado }]}>
                        {estado.toUpperCase()}
                    </Text>
                </View>
            </View>
            <Text style={styles.textoTotal}>${total}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tarjeta: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20,
        borderRadius: 12,
        marginVertical: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)', // Borde sutil sutil como en wireframe
    },
    topInfo: {
        gap: 5,
    },
    textoMesa: {
        color: COLORES_RESTO.textoBlanco,
        fontSize: 18,
        fontWeight: '700',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    textoEstado: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    textoTotal: {
        color: COLORES_RESTO.textoBlanco,
        fontSize: 24,
        fontWeight: '900',
    },
});

export default TarjetaPedido;