import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORES_RESTO } from '../../core/theme';

export default function ListaProductos({ productos, onAgregar }) {
    return (
        <ScrollView style={styles.productosScroll}>
            <View style={styles.productosGrid}>
                {productos.length === 0 ? (
                    <Text style={styles.emptyText}>No hay productos disponibles</Text>
                ) : (
                    productos.map(prod => (
                        <View key={prod.id} style={styles.productoCard}>
                            <View style={styles.imgPlaceholder} />
                            <View style={styles.prodInfo}>
                                <Text style={styles.prodNombre} numberOfLines={2}>{prod.nombre}</Text>
                                <View style={styles.prodAction}>
                                    <Text style={styles.prodPrecio}>${(prod.precio || 0).toFixed(2)}</Text>
                                    <TouchableOpacity style={styles.addBtn} onPress={() => onAgregar(prod)}>
                                        <Text style={styles.addBtnText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    productosScroll: { flex: 1, paddingHorizontal: 15 },
    productosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-start' },
    productoCard: { width: '23.5%', backgroundColor: '#1A242D', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#2D3748', marginBottom: 10 },
    imgPlaceholder: { height: 60, backgroundColor: '#2D3748' },
    prodInfo: { padding: 10 },
    prodNombre: { color: '#FFF', fontSize: 12, fontWeight: 'bold', minHeight: 32 },
    prodAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    prodPrecio: { color: COLORES_RESTO.cian, fontSize: 13, fontWeight: 'bold' },
    addBtn: { backgroundColor: COLORES_RESTO.cian, width: 26, height: 26, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
    emptyText: { color: COLORES_RESTO.grisTexto, fontStyle: 'italic', textAlign: 'center', marginTop: 10, width: '100%' }
});