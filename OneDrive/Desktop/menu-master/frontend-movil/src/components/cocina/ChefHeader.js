import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORES_RESTO } from '../../core/theme';
// Importamos los iconos. Si tu compañero usó otra librería, puedes cambiar 'lucide-react-native'
import { Bell, LogOut } from 'lucide-react-native';

export default function ChefHeader({ onLogout }) {
    return (
        <View style={styles.headerContainer}>
            {/* 1. TÍTULO Y MARCA */}
            <View>
                <Text style={styles.title}>
                    MENU MASTER <Text style={styles.subtitle}>| COCINERO</Text>
                </Text>
            </View>

            {/* 2. BOTONES DE ACCIÓN */}
            <View style={styles.actions}>
                {/* Campana de Notificaciones */}
                <TouchableOpacity style={styles.bellBtn}>
                    <Bell color={COLORES_RESTO.fondo} size={20} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>

                {/* Botón de Salir */}
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <LogOut color={COLORES_RESTO.rojo} size={22} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// 3. ESTILOS NATIVOS
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORES_RESTO.fondo,
        borderBottomWidth: 1,
        borderBottomColor: COLORES_RESTO.borde,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        color: COLORES_RESTO.cian,
        fontWeight: 'normal',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    bellBtn: {
        backgroundColor: COLORES_RESTO.naranja,
        padding: 8,
        borderRadius: 8,
        position: 'relative', // Necesario para poner el puntito rojo encima
    },
    notificationDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        backgroundColor: COLORES_RESTO.rojo,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORES_RESTO.fondo,
    },
    logoutBtn: {
        padding: 8,
    }
});