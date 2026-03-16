import React, { useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    SafeAreaView,
    StatusBar,
    RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';

// IMPORTACIONES DESDE TU CARPETA SRC
import { usePedidosCocina } from '../src/hooks/usePedidosCocina';
import ChefHeader from '../src/components/cocina/ChefHeader';
import PedidoCard from '../src/components/cocina/PedidoCard';
import { COLORES_RESTO } from '../src/core/theme';

export default function PantallaCocina() {
    const router = useRouter();

    // 1. SIMULACIÓN DEL ROL
    const rolUsuarioActual = "cocina";

    // 2. EL CANDADO DE SEGURIDAD
    useEffect(() => {
        if (rolUsuarioActual !== "cocina") {
            console.warn("Acceso denegado. Solo personal de cocina.");
            router.replace("/");
        }
    }, [rolUsuarioActual]);

    // 3. LLAMAMOS AL HOOK
    const {
        pedidos,
        cargando,
        refrescando,
        onRefresh,
        actualizarEstado,
        eliminar
    } = usePedidosCocina();

    // 4. FUNCIÓN PARA EL BOTÓN DE SALIR
    const handleLogout = () => {
        console.log("Cerrando sesión del cocinero...");
        router.replace("/");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 🔥 FORZAMOS EL COLOR OSCURO EN LA BARRA DE ARRIBA */}
            <StatusBar barStyle="light-content" backgroundColor="#0B1015" />

            {/* --- EL ENCABEZADO --- */}
            <ChefHeader onLogout={handleLogout} />

            {/* --- EL CONTENIDO DE LA PANTALLA --- */}
            <View style={styles.content}>
                {cargando && pedidos.length === 0 ? (
                    <ActivityIndicator
                        size="large"
                        color={COLORES_RESTO?.cian || '#4DD0E1'}
                        style={{ marginTop: 50 }}
                    />
                ) : (
                    <FlatList
                        data={pedidos}
                        keyExtractor={(item: any) => item._id}
                        renderItem={({ item }: { item: any }) => (
                            <PedidoCard
                                pedido={item}
                                onActualizarEstado={actualizarEstado}
                                onEliminar={eliminar}
                            />
                        )}
                        contentContainerStyle={styles.listPadding}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No hay pedidos pendientes 👨‍🍳</Text>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refrescando}
                                onRefresh={onRefresh}
                                colors={[COLORES_RESTO?.cian || '#4DD0E1']}
                                tintColor={COLORES_RESTO?.cian || '#4DD0E1'}
                                progressBackgroundColor="#151C24"
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

// 5. ESTILOS DE LA PANTALLA
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // 🔥 FORZAMOS EL COLOR OSCURO PROFUNDO AQUÍ
        backgroundColor: '#0B1015',
    },
    content: {
        flex: 1,
        // 🔥 Y TAMBIÉN AQUÍ PARA QUE CUBRA TODO EL FONDO
        backgroundColor: '#0B1015',
    },
    listPadding: {
        padding: 16,
    },
    emptyText: {
        color: '#718096',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});