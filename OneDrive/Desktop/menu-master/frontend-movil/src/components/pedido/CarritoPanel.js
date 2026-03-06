import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORES_RESTO } from '../../core/theme';

export default function CarritoPanel({ carrito, total, cargando, onQuitar, onAgregar, onCancelar, onEnviar }) {
    return (
        <View style={styles.pedidoActualContainer}>
            <Text style={styles.pedidoActualTitulo}>Resumen del Pedido</Text>
            <ScrollView style={styles.carritoList}>
                {carrito.length === 0 ? (
                    <Text style={styles.emptyText}>El carrito está vacío</Text>
                ) : (
                    carrito.map((item, index) => (
                        <View key={index} style={styles.carritoRow}>
                            <View style={styles.controlesCantidad}>
                                <TouchableOpacity onPress={() => onQuitar(item)} style={styles.btnMenos}>
                                    <Text style={styles.btnMenosText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.cantidadTexto}>{item.cant}</Text>
                                <TouchableOpacity onPress={() => onAgregar(item)} style={styles.btnMas}>
                                    <Text style={styles.btnMasText}>+</Text>
                                </TouchableOpacity>
                                <Text style={styles.nombreItemCarrito} numberOfLines={1}>{item.nombre}</Text>
                            </View>
                            <Text style={styles.precioItemCarrito}>${(item.precio * item.cant).toFixed(2)}</Text>
                        </View>
                    ))
                )}
            </ScrollView>

            <View style={styles.footerActions}>
                <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar} disabled={cargando}>
                    <Text style={styles.btnCancelarText}>Volver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btnGuardar, (carrito.length === 0 || cargando) && { opacity: 0.5 }]}
                    onPress={onEnviar}
                    disabled={carrito.length === 0 || cargando}
                >
                    {cargando ? <ActivityIndicator color="#000" /> : <Text style={styles.btnGuardarText}>Enviar a Cocina (${total.toFixed(2)})</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pedidoActualContainer: { backgroundColor: '#1A242D', borderTopWidth: 2, borderColor: COLORES_RESTO.cian, padding: 20, maxHeight: '35%' },
    pedidoActualTitulo: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    carritoList: { flexGrow: 0, marginBottom: 15 },
    carritoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    controlesCantidad: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    btnMenos: { backgroundColor: '#2D3748', width: 28, height: 28, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    btnMenosText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    btnMas: { backgroundColor: COLORES_RESTO.cian, width: 28, height: 28, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    btnMasText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    cantidadTexto: { color: '#FFF', fontSize: 15, fontWeight: 'bold', width: 30, textAlign: 'center' },
    nombreItemCarrito: { color: '#FFF', fontSize: 14, marginLeft: 10, flex: 1 },
    precioItemCarrito: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    emptyText: { color: COLORES_RESTO.grisTexto, fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
    footerActions: { flexDirection: 'row', gap: 15 },
    btnCancelar: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORES_RESTO.cian, alignItems: 'center' },
    btnCancelarText: { color: COLORES_RESTO.cian, fontWeight: 'bold' },
    btnGuardar: { flex: 2, backgroundColor: COLORES_RESTO.cian, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnGuardarText: { color: '#000', fontWeight: 'bold' }
});