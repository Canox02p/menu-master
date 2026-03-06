import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { COLORES_RESTO } from '../core/theme';
import { usePedidoMesa } from '../hooks/usePedidoMesa';

// Importamos nuestros nuevos componentes limpios
import ListaProductos from './pedido/ListaProductos';
import CarritoPanel from './pedido/CarritoPanel';

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

                    {/* HEADER Y BUSCADOR */}
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Mesa {mesa?.numero} - Nueva Orden</Text>
                        <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
                    </View>
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput placeholder="Buscar en el menú..." placeholderTextColor="#4A5568" style={styles.searchInput} value={busqueda} onChangeText={setBusqueda} />
                    </View>

                    {/* CATEGORÍAS */}
                    <View style={styles.tabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categoriasDinamicas.map(cat => (
                                <TouchableOpacity key={cat} style={[styles.tabBtn, categoriaActiva === cat && styles.tabBtnActive]} onPress={() => setCategoriaActiva(cat)}>
                                    <Text style={[styles.tabText, categoriaActiva === cat && styles.tabTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* CUADRÍCULA DE PRODUCTOS (Importada) */}
                    <ListaProductos
                        productos={productosFiltrados}
                        onAgregar={agregarAlCarrito}
                    />

                    {/* PANEL DE CARRITO Y BOTONES (Importado) */}
                    <CarritoPanel
                        carrito={carrito}
                        total={totalCarrito}
                        cargando={cargando}
                        onQuitar={quitarDelCarrito}
                        onAgregar={agregarAlCarrito}
                        onCancelar={onClose}
                        onEnviar={enviarPedido}
                    />

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
    tabTextActive: { color: COLORES_RESTO.cian, fontWeight: 'bold' }
});