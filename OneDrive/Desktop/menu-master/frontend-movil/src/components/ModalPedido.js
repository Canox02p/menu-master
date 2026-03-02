import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { COLORES_RESTO } from '../core/theme';

// Datos simulados de tu menú
const PRODUCTOS_MOCK = [
    { id: '1', nombre: 'Tacos de Pastor', precio: 150.00, categoria: 'Platillos' },
    { id: '2', nombre: 'Quesadillas', precio: 180.00, categoria: 'Entradas' },
    { id: '3', nombre: 'Flautas', precio: 120.00, categoria: 'Platillos' },
    { id: '4', nombre: 'Agua Fresca', precio: 45.00, categoria: 'Bebidas' },
    { id: '5', nombre: 'Pastel 3 leches', precio: 80.00, categoria: 'Postres' },
];

const CATEGORIAS = ['Todo', 'Entradas', 'Platillos', 'Bebidas', 'Postres'];

export default function ModalPedido({ visible, onClose, mesa }) {
    const [categoriaActiva, setCategoriaActiva] = useState('Todo');
    const [carrito, setCarrito] = useState([]);
    // Estado para guardar lo que el mesero escribe en el buscador
    const [busqueda, setBusqueda] = useState('');

    // Lógica de filtrado combinada: revisa la categoría Y el texto de búsqueda
    const productosFiltrados = PRODUCTOS_MOCK.filter(p => {
        const coincideCategoria = categoriaActiva === 'Todo' || p.categoria === categoriaActiva;
        const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideTexto;
    });

    // Lógica para agregar al carrito
    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
            setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cant: item.cant + 1 } : item));
        } else {
            setCarrito([...carrito, { ...producto, cant: 1 }]);
        }
    };

    // Calcular el total
    const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cant), 0);

    // Limpiar y cerrar
    const handleCerrar = () => {
        setCarrito([]);
        setBusqueda(''); // Limpiamos el buscador para la próxima vez
        onClose();
    };

    const handleGuardar = () => {
        // Aquí luego conectarás con el backend para enviar el pedido a cocina
        alert(`¡Pedido de $${totalCarrito} enviado a cocina para la Mesa ${mesa?.numero}!`);
        handleCerrar();
    };

    if (!visible) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleCerrar}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Tomar Pedido - Mesa {mesa?.numero}</Text>
                        <TouchableOpacity onPress={handleCerrar}>
                            <Text style={styles.closeBtn}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Buscador Conectado */}
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            placeholder="Buscar producto..."
                            placeholderTextColor="#4A5568"
                            style={styles.searchInput}
                            value={busqueda}
                            onChangeText={setBusqueda} // Actualiza el estado al escribir
                        />
                    </View>

                    {/* Categorías */}
                    <View style={styles.tabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {CATEGORIAS.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.tabBtn, categoriaActiva === cat && styles.tabBtnActive]}
                                    onPress={() => setCategoriaActiva(cat)}
                                >
                                    <Text style={[styles.tabText, categoriaActiva === cat && styles.tabTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Cuadrícula de Productos */}
                    <ScrollView style={styles.productosScroll}>
                        <View style={styles.productosGrid}>
                            {productosFiltrados.length === 0 ? (
                                <Text style={styles.emptyText}>No se encontraron productos</Text>
                            ) : (
                                productosFiltrados.map(prod => (
                                    <View key={prod.id} style={styles.productoCard}>
                                        <View style={styles.imgPlaceholder} />
                                        <View style={styles.prodInfo}>
                                            <Text style={styles.prodNombre}>{prod.nombre}</Text>
                                            <View style={styles.prodAction}>
                                                <Text style={styles.prodPrecio}>${prod.precio.toFixed(2)}</Text>
                                                <TouchableOpacity style={styles.addBtn} onPress={() => agregarAlCarrito(prod)}>
                                                    <Text style={styles.addBtnText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>

                    {/* Resumen del Pedido (Carrito) */}
                    <View style={styles.pedidoActualContainer}>
                        <Text style={styles.pedidoActualTitulo}>Pedido Actual</Text>
                        <ScrollView style={styles.carritoList}>
                            {carrito.length === 0 ? (
                                <Text style={styles.emptyText}>Agrega productos a la orden</Text>
                            ) : (
                                carrito.map((item, index) => (
                                    <View key={index} style={styles.carritoRow}>
                                        <Text style={styles.carritoItemText}>{item.cant}x {item.nombre}</Text>
                                        <Text style={styles.carritoItemText}>${(item.precio * item.cant).toFixed(2)}</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>

                        {/* Botones de acción */}
                        <View style={styles.footerActions}>
                            <TouchableOpacity style={styles.btnCancelar} onPress={handleCerrar}>
                                <Text style={styles.btnCancelarText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnGuardar, carrito.length === 0 && { opacity: 0.5 }]}
                                onPress={handleGuardar}
                                disabled={carrito.length === 0}
                            >
                                <Text style={styles.btnGuardarText}>Guardar y Enviar a Cocina</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '90%', maxWidth: 500, height: '85%', backgroundColor: '#151C24', borderRadius: 24, borderWidth: 1, borderColor: COLORES_RESTO.cian, overflow: 'hidden' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
    titulo: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    closeBtn: { color: COLORES_RESTO.grisTexto, fontSize: 20, fontWeight: 'bold' },
    searchBox: { flexDirection: 'row', backgroundColor: '#1A242D', margin: 15, borderRadius: 12, paddingHorizontal: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2D3748' },
    searchIcon: { color: COLORES_RESTO.cian, marginRight: 10 },
    searchInput: { color: '#FFF', height: 45, flex: 1 },
    tabsContainer: { paddingHorizontal: 15, marginBottom: 15 },
    tabBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#2D3748', marginRight: 10 },
    tabBtnActive: { borderColor: COLORES_RESTO.cian, backgroundColor: 'rgba(0, 255, 255, 0.1)' },
    tabText: { color: COLORES_RESTO.grisTexto, fontSize: 14 },
    tabTextActive: { color: COLORES_RESTO.cian, fontWeight: 'bold' },
    productosScroll: { flex: 1, paddingHorizontal: 15 },
    productosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
    productoCard: { width: '48%', backgroundColor: '#1A242D', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#2D3748', marginBottom: 10 },
    imgPlaceholder: { height: 80, backgroundColor: '#2D3748' },
    prodInfo: { padding: 10 },
    prodNombre: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
    prodAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    prodPrecio: { color: '#FFF', fontSize: 13 },
    addBtn: { backgroundColor: COLORES_RESTO.cian, width: 26, height: 26, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    pedidoActualContainer: { backgroundColor: '#1A242D', borderTopWidth: 1, borderColor: '#2D3748', padding: 20, maxHeight: '35%' },
    pedidoActualTitulo: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    carritoList: { flexGrow: 0, marginBottom: 15 },
    carritoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    carritoItemText: { color: '#FFF', fontSize: 14 },
    emptyText: { color: COLORES_RESTO.grisTexto, fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
    footerActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
    btnCancelar: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORES_RESTO.cian, alignItems: 'center' },
    btnCancelarText: { color: COLORES_RESTO.cian, fontWeight: 'bold' },
    btnGuardar: { flex: 2, backgroundColor: COLORES_RESTO.cian, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnGuardarText: { color: '#000', fontWeight: 'bold' }
});