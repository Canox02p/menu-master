import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, StyleSheet, TouchableOpacity,
    TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { COLORES_RESTO } from '../core/theme';
import { ENDPOINTS } from '../core/api'; // Conexión a tu IP 10.40.207.66

const CATEGORIAS = ['Todo', 'Entradas', 'Platillos', 'Bebidas', 'Postres'];

export default function ModalPedido({ visible, onClose, mesa }) {
    const [productos, setProductos] = useState([]); // Datos reales de MySQL
    const [categoriaActiva, setCategoriaActiva] = useState('Todo');
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);

    // 🔄 Cargar menú desde MySQL al abrir el modal
    useEffect(() => {
        if (visible) {
            obtenerMenuReal();
        }
    }, [visible]);

    const obtenerMenuReal = async () => {
        try {
            const respuesta = await fetch(ENDPOINTS.productos);
            const datos = await respuesta.json();
            setProductos(datos);
        } catch (error) {
            console.error("Error al conectar con MySQL:", error);
            Alert.alert("Error", "No se pudo obtener el menú del servidor.");
        }
    };

    const productosFiltrados = productos.filter(p => {
        const coincideCategoria = categoriaActiva === 'Todo' || p.categoria === categoriaActiva;
        const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideTexto;
    });

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
            setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cant: item.cant + 1 } : item));
        } else {
            setCarrito([...carrito, { ...producto, cant: 1 }]);
        }
    };

    const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cant), 0);

    const handleCerrar = () => {
        setCarrito([]);
        setBusqueda('');
        onClose();
    };

    // 🚀 ENVÍO AL BACKEND (Flujo Híbrido SOLID)
    const handleGuardar = async () => {
        if (carrito.length === 0) return;
        setCargando(true);

        try {
            const pedidoAEnviar = {
                id_mesa: mesa._id, // ID de MongoDB
                id_mesero: "65e123456789abcdef000000", // ID temporal
                estado: "EN_COCINA",
                productos: carrito.map(item => ({
                    id_producto: item.id, // ID de MySQL para descontar stock
                    nombre: item.nombre,
                    precio_unitario: item.precio,
                    cantidad: item.cant,
                    subtotal: item.precio * item.cant,
                    estado: "ACTIVO"
                })),
                total: totalCarrito,
                permite_division: true
            };

            const respuesta = await fetch(ENDPOINTS.pedidos, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoAEnviar)
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'Error al procesar el pedido');
            }

            Alert.alert("¡Pedido Enviado!", `La orden de la Mesa ${mesa?.numero} está en cocina.`);
            handleCerrar();

        } catch (error) {
            Alert.alert("Fallo en el pedido", error.message);
        } finally {
            setCargando(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleCerrar}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.titulo}>Mesa {mesa?.numero} - Nueva Orden</Text>
                        <TouchableOpacity onPress={handleCerrar}>
                            <Text style={styles.closeBtn}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Buscador */}
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            placeholder="Buscar en el menú..."
                            placeholderTextColor="#4A5568"
                            style={styles.searchInput}
                            value={busqueda}
                            onChangeText={setBusqueda}
                        />
                    </View>

                    {/* Filtros de Categoría */}
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

                    {/* Grid de Productos de MySQL */}
                    <ScrollView style={styles.productosScroll}>
                        <View style={styles.productosGrid}>
                            {productosFiltrados.map(prod => (
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
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer con Resumen y Botón de Envío */}
                    <View style={styles.pedidoActualContainer}>
                        <Text style={styles.pedidoActualTitulo}>Resumen del Pedido</Text>
                        <ScrollView style={styles.carritoList}>
                            {carrito.map((item, index) => (
                                <View key={index} style={styles.carritoRow}>
                                    <Text style={styles.carritoItemText}>{item.cant}x {item.nombre}</Text>
                                    <Text style={styles.carritoItemText}>${(item.precio * item.cant).toFixed(2)}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.footerActions}>
                            <TouchableOpacity style={styles.btnCancelar} onPress={handleCerrar} disabled={cargando}>
                                <Text style={styles.btnCancelarText}>Volver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnGuardar, (carrito.length === 0 || cargando) && { opacity: 0.5 }]}
                                onPress={handleGuardar}
                                disabled={carrito.length === 0 || cargando}
                            >
                                {cargando ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.btnGuardarText}>Enviar a Cocina (${totalCarrito.toFixed(2)})</Text>
                                )}
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
    tabBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#2D3748', marginRight: 10 },
    tabBtnActive: { borderColor: COLORES_RESTO.cian, backgroundColor: 'rgba(0, 255, 255, 0.1)' },
    tabText: { color: COLORES_RESTO.grisTexto, fontSize: 14 },
    tabTextActive: { color: COLORES_RESTO.cian, fontWeight: 'bold' },
    productosScroll: { flex: 1, paddingHorizontal: 15 },
    productosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
    productoCard: { width: '48%', backgroundColor: '#1A242D', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#2D3748', marginBottom: 10 },
    imgPlaceholder: { height: 70, backgroundColor: '#2D3748' },
    prodInfo: { padding: 10 },
    prodNombre: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
    prodAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    prodPrecio: { color: COLORES_RESTO.cian, fontSize: 14, fontWeight: 'bold' },
    addBtn: { backgroundColor: COLORES_RESTO.cian, width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 20 },
    pedidoActualContainer: { backgroundColor: '#1A242D', borderTopWidth: 2, borderColor: COLORES_RESTO.cian, padding: 20, maxHeight: '35%' },
    pedidoActualTitulo: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    carritoList: { flexGrow: 0, marginBottom: 15 },
    carritoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    carritoItemText: { color: '#FFF', fontSize: 14 },
    footerActions: { flexDirection: 'row', gap: 15 },
    btnCancelar: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORES_RESTO.cian, alignItems: 'center' },
    btnCancelarText: { color: COLORES_RESTO.cian, fontWeight: 'bold' },
    btnGuardar: { flex: 2, backgroundColor: COLORES_RESTO.cian, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnGuardarText: { color: '#000', fontWeight: 'bold' }
});