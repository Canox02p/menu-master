import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORES_RESTO } from '../../core/theme';

// 🧩 PRINCIPIO SOLID (OCP): Diccionario de configuración de estados 100% JS.
// Abierto para extensión (puedes agregar más estados aquí), cerrado para modificación (no tocas el código de abajo).
const ESTADOS_CONFIG = {
    'EN_COCINA': { color: COLORES_RESTO.cian || '#4DD0E1', texto: 'EN ESPERA', mostrarTomar: true },
    'EN_PROCESO': { color: COLORES_RESTO.verde || '#48BB78', texto: 'PREPARANDO...', mostrarTomar: false },
    'PREPARANDO': { color: COLORES_RESTO.verde || '#48BB78', texto: 'PREPARANDO...', mostrarTomar: false },
    'DEFAULT': { color: '#718096', texto: 'DESCONOCIDO', mostrarTomar: false }
};

export default function PedidoCard({ pedido, onActualizarEstado, onEliminar }) {
    // 1. Obtenemos la configuración según el estado actual, o por defecto si no existe
    const config = ESTADOS_CONFIG[pedido.estado] || ESTADOS_CONFIG['DEFAULT'];

    // 2. Extraer datos seguros (para evitar errores si algo viene vacío de Mongo)
    const idTicket = pedido._id ? pedido._id.substring(pedido._id.length - 4) : '0000';
    const numMesa = pedido.id_mesa?.numero_mesa || pedido.numero_mesa || '?';
    // Asumimos un nombre por defecto si no viene del populate, igual que en tu diseño web
    const nombreMesero = pedido.nombre_mesero || 'Juan Sr.';

    return (
        <View style={styles.cardContainer}>
            {/* CABECERA DE COLOR (Cian o Verde según el diccionario) */}
            <View style={[styles.headerColor, { backgroundColor: config.color }]}>
                <Text style={styles.headerText}>{config.texto}</Text>
            </View>

            {/* CONTENIDO PRINCIPAL DE LA TARJETA */}
            <View style={styles.body}>

                {/* INFO DEL TICKET Y MESA */}
                <View style={styles.infoRow}>
                    {/* Avatar CH simulado */}
                    <View style={styles.avatarCH}>
                        <Text style={styles.avatarText}>CH</Text>
                    </View>
                    <View>
                        <Text style={styles.ticketText}>Ticket: #{idTicket} / Mesa: m{numMesa}</Text>
                        <Text style={styles.meseroText}>Mesero: {nombreMesero}</Text>
                    </View>
                </View>

                {/* LISTA DE PLATILLOS */}
                <View style={styles.itemsContainer}>
                    {pedido.productos && pedido.productos.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            {/* La barrita verde lateral y cantidad de tu diseño web */}
                            <View style={styles.cantidadBadge}>
                                <Text style={styles.cantidadText}>{item.cantidad || 1}x</Text>
                            </View>
                            <Text style={styles.itemNombre}>
                                {item.nombre?.toUpperCase() || 'PRODUCTO SIN NOMBRE'}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* BOTONES DE ACCIÓN (Replican el diseño web de botones de ancho completo) */}
                <View style={styles.actionRow}>
                    {/* Botón Tomar: Solo se muestra si el diccionario dice que sí */}
                    {config.mostrarTomar && (
                        <TouchableOpacity
                            style={[styles.btnAccion, { backgroundColor: COLORES_RESTO.verde || '#48BB78' }]}
                            onPress={() => onActualizarEstado(pedido._id, 'EN_PROCESO')}
                        >
                            <Text style={styles.btnTextBlack}>Tomar</Text>
                        </TouchableOpacity>
                    )}

                    {/* Botón Terminar: Siempre visible para marcar como listo */}
                    <TouchableOpacity
                        style={[styles.btnAccion, { backgroundColor: COLORES_RESTO.cian || '#4DD0E1' }]}
                        onPress={() => onActualizarEstado(pedido._id, 'LISTO')}
                    >
                        <Text style={styles.btnTextBlack}>Terminar</Text>
                    </TouchableOpacity>
                </View>

                {/* BOTÓN CANCELAR PEDIDO */}
                <TouchableOpacity
                    style={styles.btnCancelar}
                    onPress={() => onEliminar(pedido._id)}
                >
                    <Text style={styles.btnTextCancelar}>CANCELAR PEDIDO</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

// 🎨 ESTILOS NATIVOS CLONADOS DE TU DISEÑO WEB
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#151C24', // Fondo oscuro de la tarjeta de tu diseño web
        borderRadius: 8,
        marginBottom: 20,
        overflow: 'hidden', // Para que la cabecera respete los bordes redondeados
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    headerColor: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: '#000000', // Texto negro en cabecera de color
        fontWeight: '900',
        letterSpacing: 1,
        fontSize: 14,
    },
    body: {
        padding: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2D3748',
        paddingBottom: 15,
        marginBottom: 15,
    },
    avatarCH: {
        backgroundColor: '#2D3748',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    ticketText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    meseroText: {
        color: '#718096',
        fontSize: 13,
        marginTop: 2,
    },
    itemsContainer: {
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A242D', // Fondo un poco más claro para cada platillo
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#48BB78', // La barrita verde de tu diseño web
    },
    cantidadBadge: {
        width: 35,
    },
    cantidadText: {
        color: '#48BB78', // Texto verde para la cantidad
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemNombre: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    btnAccion: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    btnTextBlack: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 15,
    },
    btnCancelar: {
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 5,
    },
    btnTextCancelar: {
        color: '#A0AEC0', // Texto gris para cancelar
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
    }
});