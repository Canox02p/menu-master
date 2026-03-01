import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORES_RESTO } from '../core/theme';

const Mesa = ({ numero, area, estado, mesero, platillos, personas, total, botonTexto, customWidth }) => {
    const estadoUpper = estado.toUpperCase();
    const colorEstado = estadoUpper === 'OCUPADO' ? COLORES_RESTO.naranja :
        estadoUpper === 'RESERVADA' ? '#5C6BC0' :
            estadoUpper === 'LIBRE' ? COLORES_RESTO.verde :
                COLORES_RESTO.rojo;

    return (
        <View style={[
            styles.card,
            {
                borderColor: estadoUpper === 'OCUPADO' ? colorEstado + '50' : '#2D3748',
                // Aquí aplicamos el ancho exacto que le manda HomeScreen
                width: customWidth
            }
        ]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.mesaNum}>Mesa {numero}</Text>
                    <Text style={styles.areaText}>{area}</Text>
                </View>
                <View style={[styles.badge, { borderColor: colorEstado }]}>
                    <Text style={[styles.badgeText, { color: colorEstado }]}>{estadoUpper}</Text>
                </View>
            </View>

            <View style={styles.dataGrid}>
                <DataRow label="Mesero" value={mesero || '---'} />
                <DataRow label="Plat." value={platillos || '0'} />
                <DataRow label="Pers." value={personas || '0'} />
            </View>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${total}</Text>
                </View>
                {botonTexto && (
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>{botonTexto}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Subcomponente para las filas de datos
const DataRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORES_RESTO.tarjeta,
        borderRadius: 14,
        padding: 15,
        borderWidth: 1,
        // Eliminados margin y minWidth para permitir el cálculo dinámico
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    mesaNum: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    areaText: { color: COLORES_RESTO.grisTexto, fontSize: 12 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
    badgeText: { fontSize: 10, fontWeight: '900' },
    dataGrid: { gap: 6, marginBottom: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { color: COLORES_RESTO.grisTexto, fontSize: 12 },
    value: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    footer: { marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2D3748', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { color: COLORES_RESTO.grisTexto, fontSize: 12 },
    totalValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    actionButton: { backgroundColor: COLORES_RESTO.cian, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    actionButtonText: { color: '#000', fontWeight: 'bold', fontSize: 12 }
});

export default Mesa;