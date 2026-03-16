import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORES_RESTO } from '../../core/theme';

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
                {/* Campana de Notificaciones (Usando un Emoji para evitar el error) */}
                <TouchableOpacity style={styles.bellBtn}>
                    <Text style={{ fontSize: 16 }}>🔔</Text>
                    <View style={styles.notificationDot} />
                </TouchableOpacity>

                {/* Botón de Salir (Usando Texto estilizado) */}
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <Text style={styles.logoutText}>SALIR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#0B1015', // Forzado al oscuro de la web
        borderBottomWidth: 1,
        borderBottomColor: '#2D3748',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#4DD0E1',
        fontWeight: 'normal',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    bellBtn: {
        backgroundColor: '#F56565', // Un naranja/rojo suave para la campana
        padding: 8,
        borderRadius: 8,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        backgroundColor: '#FF0000',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#0B1015',
    },
    logoutBtn: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#FF4444',
        borderRadius: 6,
    },
    logoutText: {
        color: '#FF4444',
        fontWeight: 'bold',
        fontSize: 12,
    }
});