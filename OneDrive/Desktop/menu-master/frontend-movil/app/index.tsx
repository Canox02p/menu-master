import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Linking, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORES_RESTO } from '../src/core/theme';
import { API_URL } from '../src/core/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plataforma, setPlataforma] = useState('movil');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (params.rol) {
                console.log("¡Acceso automático desde la Web detectado!");
                if (params.rol === 'COCINA') {
                    router.replace({ pathname: '/cocina', params: params });
                } else if (params.rol === 'MESERO') {
                    router.replace({ pathname: '/(tabs)', params: params });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [params, router]);

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

            if (plataforma === 'web') {
                const urlWeb = `http://localhost:5173/?token=${data.token}&rol=${rol}`;
                Linking.openURL(urlWeb).catch(() => {
                    Alert.alert("Error", "No se pudo abrir el navegador web.");
                });
                setCargando(false);
                return;
            }

            if (rol === 'COCINA') {
                router.replace({ pathname: '/cocina', params: { rol: 'COCINA' } });
            } else if (rol === 'MESERO') {
                router.replace({ pathname: '/(tabs)', params: { rol: 'MESERO' } });
            } else {
                Alert.alert("Acceso Restringido", "La plataforma móvil es exclusiva para meseros y cocina.");
            }
        } catch (error) {
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* --- LOGO Y TÍTULO --- */}
            <View style={styles.brandHeader}>
                <Image
                    source={require('../src/assets/logo_sin_letras.png')}
                    style={styles.brandLogo}
                    resizeMode="contain"
                />
                <Text style={styles.brandTitle}>Menu <Text style={styles.brandTitleAccent}>Master</Text></Text>
            </View>

            <View style={styles.loginBox}>

                {/* --- SELECTOR DE PLATAFORMA --- */}
                <View style={styles.platformSelector}>
                    <TouchableOpacity
                        style={[styles.platformBtn, plataforma === 'web' && styles.platformBtnActive]}
                        onPress={() => setPlataforma('web')}
                    >
                        <Ionicons name="desktop-outline" size={18} color={plataforma === 'web' ? '#12171A' : '#8C99A6'} />
                        <Text style={[styles.platformText, plataforma === 'web' && styles.platformTextActive]}>Web</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.platformBtn, plataforma === 'movil' && styles.platformBtnActive]}
                        onPress={() => setPlataforma('movil')}
                    >
                        <Ionicons name="phone-portrait-outline" size={18} color={plataforma === 'movil' ? '#12171A' : '#8C99A6'} />
                        <Text style={[styles.platformText, plataforma === 'movil' && styles.platformTextActive]}>Móvil</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.loginTitle}>Iniciar Sesión</Text>

                {/* --- INPUT USUARIO --- */}
                <View style={styles.inputGroup}>
                    <Ionicons name="person-outline" size={18} color="#8C99A6" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Usuario o Email"
                        placeholderTextColor="#8C99A6"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>

                {/* --- INPUT CONTRASEÑA CON OJITO --- */}
                <View style={styles.inputGroup}>
                    <Ionicons name="lock-closed-outline" size={18} color="#8C99A6" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#8C99A6"
                        secureTextEntry={!mostrarPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
                        <Ionicons
                            name={mostrarPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#8C99A6"
                        />
                    </TouchableOpacity>
                </View>

                {/* --- BOTÓN INGRESAR --- */}
                <TouchableOpacity style={styles.btnSubmit} onPress={handleLogin} disabled={cargando}>
                    {cargando ? (
                        <ActivityIndicator color="#12171A" />
                    ) : (
                        <Text style={styles.btnSubmitText}>INGRESAR ({plataforma.toUpperCase()})</Text>
                    )}
                </TouchableOpacity>

                {/* --- ENLACES INFERIORES --- */}
                <View style={styles.loginLinks}>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>¿Olvidé mi contraseña?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Soporte técnico</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#12171A',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    brandHeader: {
        marginBottom: 30,
        alignItems: 'center',
    },
    brandLogo: {
        width: 60,
        height: 60,
        marginBottom: 15,
        tintColor: '#FFFFFF',
    },
    brandTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '400',
    },
    brandTitleAccent: {
        color: '#40E0D0'
    },
    loginBox: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#242D32',
        padding: 30,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    platformSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        padding: 5,
        marginBottom: 25,
    },
    platformBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    platformBtnActive: {
        backgroundColor: '#40E0D0',
    },
    platformText: {
        color: '#8C99A6',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    platformTextActive: {
        color: '#12171A',
        fontWeight: 'bold',
    },
    loginTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 25
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#40E0D0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 48,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
    },
    btnSubmit: {
        backgroundColor: '#40E0D0',
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    btnSubmitText: {
        color: '#12171A',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    loginLinks: {
        alignItems: 'center',
        marginTop: 25,
        gap: 12,
    },
    linkText: {
        color: '#8C99A6',
        fontSize: 13,
        textDecorationLine: 'underline',
    }
});