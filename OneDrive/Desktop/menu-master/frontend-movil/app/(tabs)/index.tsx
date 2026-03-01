import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import Mesa from '../../src/components/Mesa';
import { COLORES_RESTO } from '../../src/core/theme';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // 1. Calcular el espacio real disponible
  const paddingMain = 30; // 15 de padding izquierdo + 15 derecho
  const sidebarWidth = isPortrait ? 0 : 350;
  const marginSidebar = isPortrait ? 0 : 20;

  // Ancho del contenedor donde van las mesas
  const contenedorMesasWidth = isPortrait
    ? width - paddingMain
    : width - paddingMain - sidebarWidth - marginSidebar;

  // 2. Lógica responsiva: Cuántas columnas queremos según el ancho disponible
  let numColumnas = 2; // Por defecto en celulares (siempre 2)
  if (contenedorMesasWidth >= 1200) numColumnas = 5; // Límite máximo en pantallas muy grandes
  else if (contenedorMesasWidth >= 900) numColumnas = 4; // Laptops / Monitores estándar
  else if (contenedorMesasWidth >= 600) numColumnas = 3; // Tablets o celulares rotados

  // 3. Calcular el ancho exacto de cada tarjeta de mesa
  const gap = 10; // Espacio entre tarjetas
  const espacioTotalGaps = gap * (numColumnas - 1);
  const anchoTarjeta = (contenedorMesasWidth - espacioTotalGaps) / numColumnas;

  return (
    <View style={styles.main}>
      {/* HEADER DINÁMICO */}
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

          <TouchableOpacity style={[styles.btnCliente, { marginLeft: 15 }]}>
            <Text style={styles.btnClienteText}>+ Cliente</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CUERPO RESPONSIVO */}
      <View style={[styles.contentLayout, { flexDirection: isPortrait ? 'column' : 'row' }]}>

        {/* SECCIÓN DE MESAS */}
        <View style={[styles.mesasContainer, { flex: 1 }]}>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}><Text style={[styles.tabText, styles.tabTextActive]}>Todos</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Planta base</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Terraza 3</Text></TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Contenedor Flex que usa el gap y el ancho calculado */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: gap }}>
              <Mesa numero="1" area="Terraza A" estado="OCUPADO" mesero="Juan Sr." platillos={12} personas={4} total="12,400.00" botonTexto="+ Nueva orden" customWidth={anchoTarjeta} />
              <Mesa numero="2" area="Barra 1" estado="OCUPADO" subEstado="EN COCINA" mesero="Ana Sr." platillos={4} personas={2} total="450.00" botonTexto="+ Nueva orden" customWidth={anchoTarjeta} />
              <Mesa numero="3" area="Terraza B" estado="LIBRE" total="0.00" botonTexto="+ Nueva orden" customWidth={anchoTarjeta} />
              <Mesa numero="4" area="Barra 1" estado="RESERVADA" total="0.00" botonTexto="+ Iniciar orden" customWidth={anchoTarjeta} />
              {/* Puedes agregar más mesas aquí para probar cómo se adaptan */}
            </View>
          </ScrollView>
        </View>

        {/* TABLA DE PEDIDOS */}
        <View style={[styles.sidebarContainer, {
          width: isPortrait ? '100%' : 350,
          marginLeft: isPortrait ? 0 : marginSidebar,
          marginTop: isPortrait ? 10 : 0
        }]}>
          <SidebarTable titulo="PEDIDOS RECIENTES" />
        </View>

      </View>
    </View>
  );
}

// Subcomponentes para la tabla de pedidos
const SidebarTable = ({ titulo }) => (
  <View style={styles.tablaCard}>
    <Text style={styles.tituloTabla}>{titulo}</Text>
    <View style={styles.filaHeader}>
      <Text style={styles.col}>ID</Text>
      <Text style={styles.col}>MESA</Text>
      <Text style={[styles.col, { textAlign: 'right' }]}>ESTADO</Text>
    </View>
    <FilaPedido id="222" mesa="1" estado="Pagado" color={COLORES_RESTO.cian} />
    <FilaPedido id="223" mesa="2" estado="En cocina" color={COLORES_RESTO.naranja} />
    <FilaPedido id="224" mesa="3" estado="Pendiente" color={COLORES_RESTO.grisTexto} />
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

// Estilos
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