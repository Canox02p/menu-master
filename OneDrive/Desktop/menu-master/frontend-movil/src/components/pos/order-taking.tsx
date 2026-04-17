'use client';

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, useWindowDimensions,
  Pressable, StyleProp, ViewStyle, SafeAreaView, ActivityIndicator,
  Alert, Platform, TextInput
} from 'react-native';
import {
  Minus, Plus, Send, ReceiptText, ChevronLeft, Trash2,
  Clock, User, CheckCircle2, Search, X, Package
} from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

// ==========================================
// 1. INTERFACES
// ==========================================

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
}

interface CartItem extends MenuItem {
  qty: number;
}

interface OrderTakingProps {
  tableId: string;
  tableNumber: number;
  tableName?: string;
  waiterId: string;
  waiterName: string;
  onClose: () => void;
}

interface MenuItemCardProps {
  item: MenuItem;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onAdd: (item: MenuItem) => void;
  cartQty: number;
}

interface CartItemRowProps {
  item: CartItem;
  isDark: boolean;
  primaryColor: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

// ==========================================
// 2. BADGE DE STOCK
// ==========================================
const StockBadge = ({ stock, isDark }: { stock: number | undefined; isDark: boolean }) => {
  if (stock === undefined || stock === null) return null;

  let bgColor = 'rgba(16,185,129,0.12)';
  let textColor = '#10b981';
  let label = `${stock} disponibles`;

  if (stock === 0) {
    bgColor = 'rgba(239,68,68,0.12)';
    textColor = '#ef4444';
    label = 'Sin stock';
  } else if (stock <= 5) {
    bgColor = 'rgba(245,158,11,0.12)';
    textColor = '#f59e0b';
    label = `Solo ${stock}`;
  }

  return (
    <View
      className="flex-row items-center gap-1 px-2 py-0.5 rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <Package color={textColor} size={9} />
      <Text style={{ color: textColor, fontSize: 9, fontWeight: '700' }}>{label}</Text>
    </View>
  );
};

// ==========================================
// 3. TARJETA DE PRODUCTO
// ==========================================
const MenuItemCard = ({ item, isDark, primaryColor, widthStyle, onAdd, cartQty }: MenuItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const sinStock = item.stock !== undefined && item.stock === 0;

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        onPress={() => !sinStock && onAdd(item)}
        disabled={sinStock}
      >
        <View
          className="rounded-[20px] p-5 h-36 flex-col justify-between border"
          style={{
            backgroundColor: sinStock
              ? (isDark ? '#161616' : '#fafafa')
              : (isDark ? '#1E1E1E' : '#ffffff'),
            borderColor: isHovered && !sinStock
              ? primaryColor
              : cartQty > 0
                ? `${primaryColor}55`
                : (isDark ? '#2A2A2A' : '#e4e4e7'),
            opacity: sinStock ? 0.55 : 1,
            transform: [{ scale: isHovered && !sinStock ? 0.98 : 1 }],
          }}
        >
          {/* Indicador de cantidad en carrito */}
          {cartQty > 0 && (
            <View
              className="absolute top-3 right-3 w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="text-white font-bold" style={{ fontSize: 10 }}>{cartQty}</Text>
            </View>
          )}

          <View className="flex-1">
            <Text
              className={cn('font-bold text-base leading-tight', isDark ? 'text-zinc-200' : 'text-zinc-800')}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </View>

          <View className="flex-row justify-between items-end mt-auto w-full">
            <View className="flex-col gap-1">
              <Text style={{ color: sinStock ? (isDark ? '#52525b' : '#a1a1aa') : primaryColor }} className="text-lg font-headline font-bold">
                ${item.price.toFixed(2)}
              </Text>
              {/* BADGE DE STOCK */}
              <StockBadge stock={item.stock} isDark={isDark} />
            </View>
            <View
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: sinStock ? (isDark ? '#1a1a1a' : '#f0f0f0') : (isDark ? '#2A2A2A' : '#f4f4f5') }}
            >
              <Plus
                color={sinStock ? (isDark ? '#3f3f46' : '#d4d4d8') : (isDark ? '#a1a1aa' : '#71717a')}
                size={16}
                strokeWidth={3}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

// ==========================================
// 4. FILA DEL CARRITO
// ==========================================
const CartItemRow = ({ item, isDark, primaryColor, onIncrease, onDecrease, onRemove }: CartItemRowProps) => {
  return (
    <View
      className="flex-row items-center justify-between py-3 border-b"
      style={{ borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5' }}
    >
      <View className="flex-1 pr-3">
        <Text className={cn('font-bold text-sm mb-1', isDark ? 'text-zinc-200' : 'text-zinc-800')} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={{ color: primaryColor }} className="text-sm font-bold">
          ${(item.price * item.qty).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onDecrease}
          className="w-8 h-8 rounded-full border items-center justify-center"
          style={{ borderColor: isDark ? '#3f3f46' : '#d4d4d8' }}
        >
          <Minus color={isDark ? '#d4d4d8' : '#52525b'} size={14} strokeWidth={3} />
        </TouchableOpacity>

        <Text className={cn('font-bold text-sm w-8 text-center', isDark ? 'text-white' : 'text-zinc-900')}>
          {item.qty}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onIncrease}
          style={{ backgroundColor: primaryColor }}
          className="w-8 h-8 rounded-full items-center justify-center shadow-sm"
        >
          <Plus color="white" size={14} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==========================================
// 5. COMPONENTE PRINCIPAL
// ==========================================
export function OrderTaking({ tableId, tableNumber, tableName, waiterId, waiterName, onClose }: OrderTakingProps) {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // --- NUEVO: barra de búsqueda ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const data = await api.productos.getAll();

        const mappedItems: MenuItem[] = data.map((p: any) => ({
          id: p.id_producto?.toString() || p.id?.toString() || Math.random().toString(),
          name: p.nombre,
          price: Number(p.precio) || 0,
          category: p.categoria || 'General',
          // Mapear el stock desde la API (puede venir como cantidad, stock, inventario, etc.)
          stock: p.cantidad !== undefined
            ? Number(p.cantidad)
            : p.stock !== undefined
              ? Number(p.stock)
              : p.inventario !== undefined
                ? Number(p.inventario)
                : undefined,
        }));

        setMenuItems(mappedItems);
        const uniqueCategories = Array.from(new Set(mappedItems.map(i => i.category)));
        setCategories(['Todas', ...uniqueCategories]);
      } catch (error) {
        toast({ title: "Error", description: "No se pudo cargar el menú.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
    return () => clearInterval(timer);
  }, []);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0)
    );
  };

  const deleteFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // --- NUEVO: filtrado con búsqueda + categoría ---
  const displayedMenu = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    try {
      setIsSubmitting(true);
      const payload = {
        id_mesa: tableId,
        id_mesero: waiterId,
        nombre_mesero: waiterName,
        numero_mesa: tableNumber,
        nombre_mesa: tableName,
        productos: cart.map(item => ({
          nombre: item.name,
          cantidad: item.qty,
          precio_unitario: item.price,
          subtotal: item.price * item.qty
        })),
        total: total,
        estado: 'EN_COCINA'
      };

      const resPedido = await fetch('https://menu-master-api.onrender.com/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resPedido.ok) throw new Error("No se pudo crear el pedido.");

      // --- AQUÍ SE AGREGÓ EL DESCUENTO DE INVENTARIO ---
      const itemsInventario = cart.map(item => ({
        id_producto: item.id.toString(),
        cantidad: item.qty
      }));
      await api.productos.descontarInventarioPorPedido(itemsInventario);
      // ------------------------------------------------

      await fetch(`https://menu-master-api.onrender.com/mesas/${tableId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'OCUPADA' })
      });

      toast({ title: "¡Éxito!", description: "Pedido enviado a cocina." });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo enviar el pedido a la cocina.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Registrar pago y liberar la ${tableName || `Mesa #${tableNumber}`}?`)) {
        processCheckout();
      }
    } else {
      Alert.alert("Cobrar Mesa", `¿Registrar pago y liberar la ${tableName || `Mesa #${tableNumber}`}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Cobrar", style: "default", onPress: processCheckout }
      ]);
    }
  };

  const processCheckout = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`https://menu-master-api.onrender.com/mesas/${tableId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'LIBRE', mesero_nombre: '' })
      });
      toast({ title: "Pago Exitoso", description: `La ${tableName || `Mesa #${tableNumber}`} ha sido cobrada y liberada.` });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar el pago.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      className="absolute z-[100] top-0 bottom-0 left-0 right-0"
      style={{ backgroundColor: isDark ? "#121212" : "#f4f4f5", flex: 1 }}
    >
      <View style={{ flex: 1, flexDirection: 'column' }} className="w-full mx-auto">

        {/* ====== HEADER SUPERIOR ====== */}
        <View className={cn(
          "px-6 py-4 flex-row items-center justify-between border-b",
          isDark ? "bg-[#121212] border-[#2A2A2A]" : "bg-[#f4f4f5] border-zinc-200"
        )}>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className={cn("w-10 h-10 rounded-full items-center justify-center border", isDark ? "border-[#2A2A2A] bg-[#1E1E1E]" : "border-zinc-300 bg-white")}
            >
              <ChevronLeft color={isDark ? "#d4d4d8" : "#52525b"} size={20} />
            </TouchableOpacity>
            <View>
              <Text className={cn("text-2xl font-bold", isDark ? "text-white" : "text-zinc-900")}>
                {tableName || `Mesa #${tableNumber}`}
              </Text>
              <Text className="text-xs text-zinc-500 tracking-wide uppercase mt-1">Nueva Comanda</Text>
            </View>
          </View>

          <View className="hidden md:flex flex-row items-center gap-6">
            <View className="flex-row items-center gap-4 border-r pr-6" style={{ borderColor: isDark ? '#2A2A2A' : '#e4e4e7' }}>
              <View className="flex-row items-center gap-2">
                <User color={isDark ? "#71717a" : "#a1a1aa"} size={16} />
                <Text className={cn("text-sm font-bold uppercase", isDark ? "text-zinc-300" : "text-zinc-700")}>{waiterName}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock color={isDark ? "#71717a" : "#a1a1aa"} size={16} />
                <Text className={cn("text-sm font-mono font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>{currentTime}</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCheckout}
              disabled={isSubmitting}
              className="flex-row items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl"
            >
              {isSubmitting ? <ActivityIndicator color="#10b981" size="small" /> : <CheckCircle2 color="#10b981" size={18} />}
              <Text className="text-emerald-500 font-bold text-sm">Cobrar Mesa</Text>
            </TouchableOpacity>
          </View>

          <Badge
            variant="outline"
            className={cn("rounded-full px-4 py-1.5 md:hidden", isDark ? "border-[#2A2A2A] bg-[#1E1E1E]" : "border-zinc-300 bg-white")}
            label={`${cart.length} Ítems`}
          />
        </View>

        {/* ====== CUERPO PRINCIPAL ====== */}
        <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', overflow: 'hidden' }}>

          {/* LADO IZQUIERDO: MENÚ */}
          <View style={{ flex: 1, flexDirection: 'column', padding: 24 }}>

            {/* TABS DE CATEGORÍAS */}
            <View style={{ height: 60, borderBottomWidth: 1, borderBottomColor: isDark ? '#2A2A2A' : '#e4e4e7', marginBottom: 12 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      activeOpacity={0.8}
                      onPress={() => setSelectedCategory(cat)}
                      style={{
                        borderBottomWidth: isSelected ? 3 : 0,
                        borderBottomColor: isSelected ? primaryColor : 'transparent',
                        paddingHorizontal: 24,
                        justifyContent: 'center',
                      }}
                    >
                      <Text className={cn("text-sm font-bold", isSelected ? "text-white" : (isDark ? "text-zinc-400" : "text-zinc-600"))}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ====== BARRA DE BÚSQUEDA (NUEVA) ====== */}
            <View className="mb-4">
              <View
                className="flex-row items-center rounded-2xl px-4 border"
                style={{
                  backgroundColor: isDark ? '#1E1E1E' : '#ffffff',
                  borderColor: searchFocused
                    ? primaryColor
                    : isDark ? '#2A2A2A' : '#e4e4e7',
                  height: 48,
                }}
              >
                <Search color={searchFocused ? primaryColor : (isDark ? '#52525b' : '#a1a1aa')} size={18} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Buscar platillo..."
                  placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    fontSize: 14,
                    fontWeight: '500',
                    color: isDark ? '#e4e4e7' : '#18181b',
                    //  outline: 'none',
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                    <X color={isDark ? '#71717a' : '#a1a1aa'} size={16} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Contador de resultados */}
              {searchQuery.length > 0 && (
                <Text className="text-xs text-zinc-500 mt-2 ml-1">
                  {displayedMenu.length === 0
                    ? 'Sin resultados'
                    : `${displayedMenu.length} resultado${displayedMenu.length !== 1 ? 's' : ''}`}
                </Text>
              )}
            </View>

            {/* PRODUCTOS */}
            <View style={{ flex: 1 }}>
              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color={primaryColor} />
                </View>
              ) : displayedMenu.length === 0 ? (
                <View className="flex-1 items-center justify-center opacity-40 pb-20">
                  <Search color={isDark ? '#a1a1aa' : '#71717a'} size={48} />
                  <Text className={cn("font-bold text-base mt-4", isDark ? "text-zinc-400" : "text-zinc-500")}>
                    No se encontró "{searchQuery}"
                  </Text>
                </View>
              ) : (
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                  <View className="flex-row flex-wrap -mx-2">
                    {displayedMenu.map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        primaryColor={primaryColor}
                        widthStyle={getCardWidth()}
                        onAdd={addToCart}
                        cartQty={cart.find(c => c.id === item.id)?.qty || 0}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>

          {/* LADO DERECHO: TICKET DE ORDEN */}
          <View
            style={{
              width: isDesktop ? 400 : '100%',
              height: isDesktop ? '100%' : 400,
              borderLeftWidth: isDesktop ? 1 : 0,
              borderTopWidth: !isDesktop ? 1 : 0
            }}
            className={cn("flex-col shadow-2xl", isDark ? "bg-[#161616] border-[#2A2A2A]" : "bg-white border-zinc-200")}
          >
            <View className="p-6 pb-4 flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <ReceiptText color={primaryColor} size={22} />
                <Text className={cn("font-headline font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>
                  Resumen de Orden
                </Text>
              </View>
              {cart.length > 0 && (
                <TouchableOpacity onPress={() => setCart([])} className="p-2">
                  <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                {cart.length === 0 ? (
                  <View className="flex-col items-center justify-center flex-1 opacity-40 space-y-4 py-20">
                    <ReceiptText color={isDark ? "#a1a1aa" : "#71717a"} size={48} />
                    <Text className={cn("font-medium text-base", isDark ? "text-zinc-400" : "text-zinc-500")}>
                      Aún no hay productos
                    </Text>
                  </View>
                ) : (
                  <View className="space-y-1">
                    {cart.map(item => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        primaryColor={primaryColor}
                        onIncrease={() => addToCart(item)}
                        onDecrease={() => removeFromCart(item.id)}
                        onRemove={() => deleteFromCart(item.id)}
                      />
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>

            <View className={cn("p-6 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-200")}>
              <View className="flex-row justify-between items-center mb-4">
                <Text className={cn("text-base font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>Subtotal</Text>
                <Text className={cn("text-xl font-bold", isDark ? "text-zinc-300" : "text-zinc-600")}>
                  ${total.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-6">
                <Text className={cn("text-2xl font-bold", isDark ? "text-white" : "text-black")}>Total</Text>
                <Text style={{ color: primaryColor }} className="text-3xl font-bold">
                  ${total.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSendOrder}
                disabled={isSubmitting || cart.length === 0}
                style={{ backgroundColor: cart.length > 0 ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7') }}
                className="w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg"
              >
                {isSubmitting ? <ActivityIndicator color="white" /> : (
                  <>
                    <Send
                      color={cart.length === 0 ? (isDark ? '#52525b' : '#a1a1aa') : "white"}
                      size={18}
                      className="mr-2"
                    />
                    <Text className={cn("text-base font-bold", cart.length === 0 ? (isDark ? "text-zinc-500" : "text-zinc-400") : "text-white")}>
                      Enviar a Cocina
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}