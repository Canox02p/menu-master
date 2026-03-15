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
import { useRouter } from 'expo-router'; // <-- Importamos el router para la seguridad

// IMPORTACIONES DESDE TU CARPETA SRC (Arquitectura Limpia)
import { usePedidosCocina } from '../src/hooks/usePedidosCocina';
import ChefHeader from '../src/components/cocina/ChefHeader';
import PedidoCard from '../src/components/cocina/PedidoCard';
import { COLORES_RESTO } from '../src/core/theme';

export default function PantallaCocina() {
    const router = useRouter(); // Inicializamos el candado de seguridad

    // 1. SIMULACIÓN DEL ROL (Luego lo conectarás con el Login real)
    const rolUsuarioActual = "cocina";

    // 2. EL CANDADO DE SEGURIDAD
    useEffect(() => {
        // Si alguien que no es de cocina intenta entrar, lo regresamos al inicio
        if (rolUsuarioActual !== "cocina") {
            console.warn("Acceso denegado. Solo personal de cocina.");
            router.replace("/");
        }
    }, [rolUsuarioActual]);

    // 3. LLAMAMOS AL HOOK (Tu lógica de Node.js y la web)
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
        router.replace("/"); // Al salir, lo mandamos a la pantalla principal
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORES_RESTO?.fondo || '#0B0F13'} />

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
                        // CORRECCIÓN TYPESCRIPT: Evita el error rojo del _id
                        keyExtractor={(item: any) => item._id}

                        // RENDERIZAMOS UNA TARJETA POR CADA PEDIDO
                        renderItem={({ item }: { item: any }) => (
                            <PedidoCard
                                pedido={item}
                                onActualizarEstado={actualizarEstado}
                                onEliminar={eliminar}
                            />
                        )}

                        contentContainerStyle={styles.listPadding}

                        // MENSAJE CUANDO LA COCINA ESTÁ VACÍA
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No hay pedidos pendientes 👨‍🍳</Text>
                        }

                        // FUNCIÓN DE DESLIZAR PARA ACTUALIZAR
                        refreshControl={
                            <RefreshControl
                                refreshing={refrescando}
                                onRefresh={onRefresh}
                                colors={[COLORES_RESTO?.cian || '#4DD0E1']}
                                tintColor={COLORES_RESTO?.cian || '#4DD0E1'}
                                progressBackgroundColor={COLORES_RESTO?.tarjeta || '#151C24'}
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
        backgroundColor: COLORES_RESTO?.fondo || '#0B0F13',
    },
    content: {
        flex: 1,
    },
    listPadding: {
        padding: 16,
    },
    emptyText: {
        color: COLORES_RESTO?.grisTexto || '#718096',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});