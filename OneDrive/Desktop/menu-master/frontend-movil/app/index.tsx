import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORES_RESTO } from '../src/core/theme';
import { API_URL } from '../src/core/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const router = useRouter();
    const params = useLocalSearchParams(); // 🛰️ El radar para el "salto" desde la Web

    // --- 1. CONEXIÓN MÁGICA CON LA WEB ---
    useEffect(() => {
        if (params.rol) {
            console.log("¡Acceso automático desde la Web detectado!");
            if (params.rol === 'COCINA') {
                router.replace({ pathname: '/cocina', params: params });
            } else if (params.rol === 'MESERO') {
                router.replace({ pathname: '/(tabs)', params: params });
            }
        }
    }, [params]);

    // --- 2. LOGUEO MANUAL (Para cuando usen solo el móvil) ---
    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Atención", "Ingresa usuario y contraseña");

        setCargando(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.error || "Credenciales incorrectas");
                setCargando(false);
                return;
            }

            const rol = data.usuario.rol;
            if (rol === 'COCINA') {
                router.replace({ pathname: '/cocina', params: { rol: 'COCINA' } });
            } else if (rol === 'MESERO') {
                router.replace({ pathname: '/(tabs)', params: { rol: 'MESERO' } });
            }
        } catch (error) {
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.title}>Menu <Text style={styles.subtitle}>Master</Text></Text>
                <Text style={styles.instruccion}>Acceso de Empleados</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Usuario o Email"
                    placeholderTextColor="#718096"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#718096"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={cargando}>
                    {cargando ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>INICIAR SESIÓN</Text>}
                </TouchableOpacity>

                {/* ❌ SE ELIMINÓ EL BOTÓN DE REGISTRO POR ORDEN DEL ADMIN */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F13', justifyContent: 'center', alignItems: 'center', padding: 20 },
    loginBox: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#151C24',
        padding: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#2D3748',
        elevation: 10, // Sombrita para que se vea pro
    },
    title: { color: '#FFF', fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 5 },
    subtitle: { color: '#4DD0E1' },
    instruccion: { color: '#718096', textAlign: 'center', marginBottom: 30 },
    input: { backgroundColor: '#0B0F13', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#2D3748' },
    btn: { backgroundColor: '#4DD0E1', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#000', fontWeight: 'bold' }
});