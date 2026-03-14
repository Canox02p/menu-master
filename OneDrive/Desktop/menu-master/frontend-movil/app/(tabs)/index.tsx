import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Image, ActivityIndicator } from 'react-native';
import Mesa from '../../src/components/Mesa';
import ModalPedido from '../../src/components/ModalPedido';
import { COLORES_RESTO } from '../../src/core/theme';

import { useMesasDashboard } from '../../src/hooks/useMesasDashboard';

const getColorPorEstado = (estado) => {
  if (!estado) return COLORES_RESTO.grisTexto;
  const e = estado.toUpperCase();
  if (e === 'PAGADO') return COLORES_RESTO.cian;
  if (e === 'EN_COCINA' || e === 'EN_PROCESO') return COLORES_RESTO.naranja;
  if (e === 'LISTO') return COLORES_RESTO.verde;
  return COLORES_RESTO.grisTexto;
};

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const { mesas, pedidosRecientes, cargando, recargarDatos } = useMesasDashboard();

  const [modalVisible, setModalVisible] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const abrirModal = (mesa) => {
    setMesaSeleccionada(mesa);
    setModalVisible(true);
  };

  const paddingMain = 30;
  const sidebarWidth = isPortrait ? 0 : 350;
  const marginSidebar = isPortrait ? 0 : 20;

  const contenedorMesasWidth = isPortrait
    ? width - paddingMain
    : width - paddingMain - sidebarWidth - marginSidebar;

  let numColumnas = 2;
  if (contenedorMesasWidth >= 1200) numColumnas = 5;
  else if (contenedorMesasWidth >= 900) numColumnas = 4;
  else if (contenedorMesasWidth >= 600) numColumnas = 3;

  const gap = 10;
  const espacioTotalGaps = gap * (numColumnas - 1);
  const anchoTarjeta = (contenedorMesasWidth - espacioTotalGaps) / numColumnas;

  // Adaptamos los pedidos recientes para la tabla
  const pedidosAdaptados = pedidosRecientes.map(p => ({
    id: p._id ? p._id.substring(p._id.length - 4) : '...',
    mesa: p.id_mesa?.numero_mesa || p.id_mesa || '?',
    estado: p.estado || 'PENDIENTE',
    color: getColorPorEstado(p.estado)
  }));

  return (
    <View style={styles.main}>
      <View style={[styles.topNav, { paddingBottom: isPortrait ? 15 : 10 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.brandGroup}>
            <Image
              source={require('../../src/assets/logo_sin_letras.png')}
              style={[styles.logoImg, { width: isPortrait ? 50 : 70, height: isPortrait ? 50 : 70 }]}
              resizeMode="contain"
            />
            <Text style={[styles.brandText, { fontSize: isPortrait ? 18 : 22 }]}>
              Menu <Text style={{ color: COLORES_RESTO.cian }}>Master</Text>
            </Text>
          </View>

          <View style={styles.userActionsMinimal}>
            <View style={styles.userInfoText}>
              <Text style={[styles.welcomeText, { fontSize: isPortrait ? 12 : 14 }]}>Bienvenido,</Text>
              <Text style={[styles.userName, { fontSize: isPortrait ? 14 : 16 }]}>Uriel</Text>
            </View>
            <View style={[styles.avatar, { width: isPortrait ? 40 : 50, height: isPortrait ? 40 : 50 }]} />
          </View>
        </View>

        <View style={[styles.actionRow, { marginTop: 15 }]}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Buscar mesa o pedido..."
              placeholderTextColor="#4A5568"
              style={[styles.input, { fontSize: isPortrait ? 14 : 16 }]}
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>

          <TouchableOpacity style={[styles.btnCliente, { marginLeft: 15 }]} onPress={recargarDatos}>
            <Text style={styles.btnClienteText}>↻ Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.contentLayout, { flexDirection: isPortrait ? 'column' : 'row' }]}>

        <View style={[styles.mesasContainer, { flex: 1 }]}>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}><Text style={[styles.tabText, styles.tabTextActive]}>Todos</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Planta base</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Terraza 3</Text></TouchableOpacity>
          </View>

          {cargando ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={COLORES_RESTO.cian} />
              <Text style={{ color: COLORES_RESTO.grisTexto, marginTop: 10 }}>Cargando distribución...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: gap }}>
                {mesas.map((mesa) => (
                  <Mesa
                    key={mesa._id}
                    numero={mesa.numero_mesa} /* 🔥 CORREGIDO PARA LEER DE MONGODB */
                    area={mesa.area || 'Principal'} /* 🔥 AHORA LEE EL ÁREA REAL */
                    estado={mesa.estado || 'LIBRE'}
                    subEstado={mesa.estado === 'OCUPADA' ? 'CON COMENSALES' : ''}
                    mesero={mesa.mesero || '---'}
                    platillos={mesa.platillos || 0}
                    personas={mesa.capacidad || 0}
                    total={mesa.total || '0.00'}
                    botonTexto={mesa.estado === 'OCUPADA' ? '+ Nueva orden' : '+ Iniciar orden'}
                    customWidth={anchoTarjeta}
                    onAccion={() => abrirModal(mesa)}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        <View style={[styles.sidebarContainer, {
          width: isPortrait ? '100%' : 350,
          marginLeft: isPortrait ? 0 : marginSidebar,
          marginTop: isPortrait ? 10 : 0
        }]}>
          <SidebarTable titulo="PEDIDOS RECIENTES" pedidos={pedidosAdaptados} cargando={cargando} />
        </View>

      </View>

      <ModalPedido
        visible={modalVisible}
        mesa={mesaSeleccionada}
        onClose={() => {
          setModalVisible(false);
          recargarDatos();
        }}
      />

    </View>
  );
}

const SidebarTable = ({ titulo, pedidos, cargando }) => (
  <View style={styles.tablaCard}>
    <Text style={styles.tituloTabla}>{titulo}</Text>
    <View style={styles.filaHeader}>
      <Text style={styles.col}>ID</Text>
      <Text style={styles.col}>MESA</Text>
      <Text style={[styles.col, { textAlign: 'right' }]}>ESTADO</Text>
    </View>

    {cargando ? (
      <ActivityIndicator color={COLORES_RESTO.cian} style={{ marginTop: 20 }} />
    ) : (
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
        {pedidos && pedidos.map((pedido, index) => (
          <FilaPedido
            key={pedido.id || index}
            id={pedido.id}
            mesa={pedido.mesa}
            estado={pedido.estado}
            color={pedido.color}
          />
        ))}
      </ScrollView>
    )}
  </View>
);

const FilaPedido = ({ id, mesa, estado, color }) => (
  <View style={styles.fila}>
    <Text style={[styles.colVal, { color: COLORES_RESTO.cian }]}>{id}</Text>
    <Text style={styles.colVal}>{mesa}</Text>
    <View style={[styles.badgeSmall, { borderColor: color }]}>
      <Text style={{ color: color, fontSize: 11, fontWeight: 'bold' }}>{estado}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: COLORES_RESTO.fondo, padding: 15, paddingTop: 40 },
  topNav: { borderBottomWidth: 1, borderBottomColor: '#1A242D' },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandGroup: { flexDirection: 'row', alignItems: 'center' },
  logoImg: { marginRight: 10 },
  brandText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 },
  userActionsMinimal: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userInfoText: { alignItems: 'flex-end' },
  welcomeText: { color: COLORES_RESTO.grisTexto, fontWeight: '500' },
  userName: { color: '#FFF', fontWeight: '800' },
  avatar: { borderRadius: 25, backgroundColor: '#2D3748', borderWidth: 2, borderColor: COLORES_RESTO.cian },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  searchBar: { backgroundColor: '#1A242D', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 12, height: 50, borderWidth: 1, borderColor: '#2D3748', flex: 1 },
  input: { color: '#FFF', flex: 1 },
  searchIcon: { fontSize: 18, color: COLORES_RESTO.cian },
  btnCliente: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORES_RESTO.cian, paddingHorizontal: 20, height: 50, justifyContent: 'center', borderRadius: 12 },
  btnClienteText: { color: COLORES_RESTO.cian, fontWeight: 'bold', fontSize: 14 },
  contentLayout: { flex: 1, marginTop: 15 },
  mesasContainer: { flex: 1 },
  tabs: { flexDirection: 'row', gap: 20, marginBottom: 15 },
  tab: { paddingBottom: 10, paddingHorizontal: 5 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORES_RESTO.cian },
  tabText: { color: COLORES_RESTO.grisTexto, fontSize: 15, fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  sidebarContainer: { alignSelf: 'stretch' },
  tablaCard: { backgroundColor: '#151C24', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#2D3748' },
  tituloTabla: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1, marginBottom: 15 },
  filaHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#2D3748', paddingBottom: 10 },
  col: { color: COLORES_RESTO.grisTexto, fontSize: 11, fontWeight: '800', flex: 1 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#2D3748' },
  colVal: { color: '#FFF', fontWeight: '700', flex: 1, fontSize: 14 },
  badgeSmall: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, alignItems: 'center', minWidth: 85 }
});