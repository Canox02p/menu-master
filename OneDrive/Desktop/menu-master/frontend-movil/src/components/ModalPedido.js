import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { COLORES_RESTO } from '../core/theme';
import { usePedidoMesa } from '../hooks/usePedidoMesa';

export default function ModalPedido({ visible, onClose, mesa }) {
    const {
        busqueda, setBusqueda, categoriaActiva, setCategoriaActiva,
        categoriasDinamicas, productosFiltrados, carrito, cargando, totalCarrito,
        agregarAlCarrito, quitarDelCarrito, enviarPedido, cargarMenu
    } = usePedidoMesa(mesa, onClose);

    useEffect(() => {
        if (visible) cargarMenu();
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    {/* 1. HEADER Y BUSCADOR */}
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Mesa {mesa?.numero} - Nueva Orden</Text>
                        <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
                    </View>
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput placeholder="Buscar en el menú..." placeholderTextColor="#4A5568" style={styles.searchInput} value={busqueda} onChangeText={setBusqueda} />
                    </View>

                    {/* 2. CATEGORÍAS */}
                    <View style={styles.tabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categoriasDinamicas.map(cat => (
                                <TouchableOpacity key={cat} style={[styles.tabBtn, categoriaActiva === cat && styles.tabBtnActive]} onPress={() => setCategoriaActiva(cat)}>
                                    <Text style={[styles.tabText, categoriaActiva === cat && styles.tabTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* 3. PRODUCTOS */}
                    <ScrollView style={styles.productosScroll}>
                        <View style={styles.productosGrid}>
                            {productosFiltrados.length === 0 ? <Text style={styles.emptyText}>No hay productos</Text> :
                                productosFiltrados.map(prod => (
                                    <View key={prod.id} style={styles.productoCard}>
                                        <View style={styles.imgPlaceholder} />
                                        <View style={styles.prodInfo}>
                                            <Text style={styles.prodNombre} numberOfLines={2}>{prod.nombre}</Text>
                                            <View style={styles.prodAction}>
                                                <Text style={styles.prodPrecio}>${(prod.precio || 0).toFixed(2)}</Text>
                                                <TouchableOpacity style={styles.addBtn} onPress={() => agregarAlCarrito(prod)}>
                                                    <Text style={styles.addBtnText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>

                    {/* 4. CARRITO */}
                    <View style={styles.pedidoActualContainer}>
                        <Text style={styles.pedidoActualTitulo}>Resumen del Pedido</Text>
                        <ScrollView style={styles.carritoList}>
                            {carrito.length === 0 ? <Text style={styles.emptyText}>El carrito está vacío</Text> :
                                carrito.map((item, index) => (
                                    <View key={index} style={styles.carritoRow}>
                                        <View style={styles.controlesCantidad}>
                                            <TouchableOpacity onPress={() => quitarDelCarrito(item)} style={styles.btnMenos}><Text style={styles.btnMenosText}>-</Text></TouchableOpacity>
                                            <Text style={styles.cantidadTexto}>{item.cant}</Text>
                                            <TouchableOpacity onPress={() => agregarAlCarrito(item)} style={styles.btnMas}><Text style={styles.btnMasText}>+</Text></TouchableOpacity>
                                            <Text style={styles.nombreItemCarrito} numberOfLines={1}>{item.nombre}</Text>
                                        </View>
                                        <Text style={styles.precioItemCarrito}>${(item.precio * item.cant).toFixed(2)}</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                        <View style={styles.footerActions}>
                            <TouchableOpacity style={styles.btnCancelar} onPress={onClose} disabled={cargando}><Text style={styles.btnCancelarText}>Volver</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.btnGuardar, (carrito.length === 0 || cargando) && { opacity: 0.5 }]} onPress={enviarPedido} disabled={carrito.length === 0 || cargando}>
                                {cargando ? <ActivityIndicator color="#000" /> : <Text style={styles.btnGuardarText}>Enviar a Cocina (${totalCarrito.toFixed(2)})</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '95%', height: '90%', backgroundColor: '#151C24', borderRadius: 20, borderWidth: 1, borderColor: COLORES_RESTO.cian, overflow: 'hidden' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
    titulo: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    closeBtn: { color: '#FFF', fontSize: 22 },
    searchBox: { flexDirection: 'row', backgroundColor: '#1A242D', margin: 15, borderRadius: 12, paddingHorizontal: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2D3748' },
    searchIcon: { marginRight: 10 },
    searchInput: { color: '#FFF', height: 45, flex: 1 },
    tabsContainer: { paddingHorizontal: 15, marginBottom: 15 },
    tabBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#2D3748', marginRight: 10, minWidth: 80, alignItems: 'center' },
    tabBtnActive: { borderColor: COLORES_RESTO.cian, backgroundColor: 'rgba(0, 255, 255, 0.1)' },
    tabText: { color: COLORES_RESTO.grisTexto, fontSize: 13 },
    tabTextActive: { color: COLORES_RESTO.cian, fontWeight: 'bold' },
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