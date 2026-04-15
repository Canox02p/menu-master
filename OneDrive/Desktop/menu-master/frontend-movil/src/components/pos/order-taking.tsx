'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, SafeAreaView, ActivityIndicator } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Send, ReceiptText, ChevronLeft, ScrollText } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { api } from '@/lib/api';

// ==========================================
// 1. INTERFACES
// ==========================================

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

interface OrderTakingProps {
  tableId: string;
  tableNumber: number;
  onClose: () => void;
}

interface MenuItemCardProps {
  item: MenuItem;
  isDark: boolean;
  primaryColor: string;
  widthStyle: StyleProp<ViewStyle>;
  onAdd: (item: MenuItem) => void;
}

interface CartItemRowProps {
  item: CartItem;
  isDark: boolean;
  primaryColor: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

// Colores base para igualar la referencia
const MAIN_BG = "#13151A"; // Fondo principal súper oscuro
const PANEL_BG = "#1A1D24"; // Fondo de las tarjetas y barra lateral

// ==========================================
// 2. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const MenuItemCard = ({ item, isDark, primaryColor, widthStyle, onAdd }: MenuItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={widthStyle} className="p-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        onPress={() => onAdd(item)}
      >
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-200 rounded-2xl h-[120px] flex-col justify-between",
            isDark ? "bg-[#1A1D24]" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            transform: [{ scale: isHovered ? 0.98 : 1 }]
          }}
        >
          <CardContent className="p-4 flex-1 justify-between">
            {/* Título del Platillo */}
            <Text className={cn("font-bold text-sm", isDark ? "text-zinc-100" : "text-zinc-800")} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Precio y Botón (+) */}
            <View className="flex-row justify-between items-end mt-auto">
              <Text style={{ color: primaryColor }} className="text-base font-bold">
                ${item.price.toFixed(2)}
              </Text>

              {/* Botón Circular Exacto a la Referencia */}
              <View
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: isDark ? '#252A36' : `${primaryColor}15` }}
              >
                <Plus color={primaryColor} size={18} strokeWidth={3} />
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

const CartItemRow = ({ item, isDark, primaryColor, onIncrease, onDecrease }: CartItemRowProps) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-zinc-800/50 mb-1">
      <View className="flex-1 pr-2">
        <Text className={cn("font-bold text-sm mb-1", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ color: primaryColor }} className="text-xs font-bold">
          ${(item.price * item.qty).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onDecrease}
          className={cn("w-7 h-7 rounded-full items-center justify-center border", isDark ? "border-zinc-700 bg-transparent" : "border-zinc-300 bg-white")}
        >
          <Minus color={isDark ? "#d4d4d8" : "#52525b"} size={14} strokeWidth={2} />
        </TouchableOpacity>

        <Text className={cn("font-bold text-sm w-4 text-center", isDark ? "text-white" : "text-zinc-900")}>
          {item.qty}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onIncrease}
          style={{ backgroundColor: primaryColor }}
          className="w-7 h-7 rounded-full items-center justify-center shadow-sm"
        >
          <Plus color="white" size={14} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export function OrderTaking({ tableId, tableNumber, onClose }: OrderTakingProps) {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const data = await api.productos.getAll();
        const mappedItems: MenuItem[] = data.map((p: any) => ({
          id: p.id_producto?.toString() || p.id?.toString() || Math.random().toString(),
          name: p.nombre,
          price: Number(p.precio) || 0,
          category: p.categoria || 'General'
        }));
        setMenuItems(mappedItems);
        const uniqueCategories = Array.from(new Set(mappedItems.map(i => i.category)));
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        console.error("Error cargando menú:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Forzar 3 columnas en pantallas grandes como en tu referencia
  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (width >= 1024) return { width: '33.33%' };
    if (width >= 768) return { width: '50%' };
    return { width: '100%' };
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    try {
      setIsSubmitting(true);
      await api.pedidos.crear({
        id_mesa: tableId,
        id_mesero: user?.id || 'mesero_123',
        productos: cart.map(item => ({ id_producto: item.id, cantidad: item.qty, precio_unitario: item.price }))
      });
      toast({ title: "¡Éxito!", description: "Pedido enviado a cocina." });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo enviar el pedido.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedMenu = selectedCategory === 'All' ? menuItems : menuItems.filter(i => i.category === selectedCategory);

  return (
    <SafeAreaView
      className="absolute z-[100] top-0 bottom-0 left-0 right-0 h-full w-full flex-col"
      style={{ backgroundColor: isDark ? MAIN_BG : "#f3f4f6" }}
    >
      {/* ================= TOP HEADER ================= */}
      <View className={cn("px-6 py-4 flex-row items-center justify-between border-b", isDark ? "border-[#1A1D24]" : "border-zinc-200")}>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity activeOpacity={0.7} onPress={onClose} className={cn("w-10 h-10 rounded-xl items-center justify-center", isDark ? "bg-[#1A1D24]" : "bg-zinc-100")}>
            <ChevronLeft color={isDark ? "#d4d4d8" : "#52525b"} size={24} />
          </TouchableOpacity>
          <View>
            <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Table #{tableNumber}</Text>
            <Text className="text-xs text-zinc-500 uppercase">New Order Entry</Text>
          </View>
        </View>

        <View className={cn("rounded-full px-4 py-2", isDark ? "bg-[#1A1D24]" : "bg-zinc-200")}>
          <Text className={cn("text-xs font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>
            {cart.length === 0 ? "0 Items Selected" : `${cart.length} Items Selected`}
          </Text>
        </View>
      </View>

      {/* ================= CONTENIDO SPLIT ================= */}
      {/* Forzamos row para que el carrito siempre esté a la derecha como en la imagen */}
      <View className="flex-1 flex-row">

        {/* === LADO IZQUIERDO: MENÚ === */}
        <View className="flex-1 flex-col p-6">

          {/* Pills de Categorías */}
          <View className="mb-6 h-10">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.8}
                    onPress={() => setSelectedCategory(cat)}
                    style={{ backgroundColor: isSelected ? primaryColor : (isDark ? 'transparent' : 'white') }}
                    className={cn(
                      "rounded-full px-6 py-2 mr-3 justify-center items-center transition-all",
                      !isSelected && (isDark ? "border border-zinc-700" : "border border-zinc-300")
                    )}
                  >
                    <Text className={cn("font-semibold text-sm", isSelected ? "text-white" : (isDark ? "text-zinc-400" : "text-zinc-600"))}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Grid de Platillos */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : (
              <View className="flex-row flex-wrap -mx-2">
                {displayedMenu.map(item => (
                  <MenuItemCard key={item.id} item={item} isDark={isDark} primaryColor={primaryColor} widthStyle={getCardWidth()} onAdd={addToCart} />
                ))}
              </View>
            )}
          </ScrollView>
        </View>

        {/* === LADO DERECHO: ORDER SUMMARY === */}
        <View className={cn("w-[360px] lg:w-[400px] h-full flex-col border-l", isDark ? "bg-[#13151A] border-[#1A1D24]" : "bg-white border-zinc-200")}>

          <View className={cn("p-6 pb-4 border-b", isDark ? "border-[#1A1D24]" : "border-zinc-200")}>
            <View className="flex-row items-center gap-3">
              <ScrollText color={primaryColor} size={22} />
              <Text className={cn("font-bold text-lg", isDark ? "text-white" : "text-zinc-900")}>Order Summary</Text>
            </View>
          </View>

          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View className="flex-col items-center justify-center h-full opacity-50 pt-20">
                <ReceiptText color={isDark ? "#52525b" : "#a1a1aa"} size={48} strokeWidth={1} className="mb-4" />
                <Text className={cn("font-medium text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>
                  No items added yet
                </Text>
              </View>
            ) : (
              <View>
                {cart.map(item => (
                  <CartItemRow key={item.id} item={item} isDark={isDark} primaryColor={primaryColor} onIncrease={() => addToCart(item)} onDecrease={() => removeFromCart(item.id)} />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer del Ticket */}
          <View className="p-6 pt-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs font-semibold text-zinc-500">Subtotal</Text>
              <Text className={cn("text-sm font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>${total.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Total</Text>
              <Text className="text-2xl font-bold text-white">${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={cart.length === 0 || isSubmitting}
              onPress={handleSendOrder}
              style={{ backgroundColor: cart.length === 0 ? (isDark ? '#252A36' : '#e4e4e7') : '#5C7CFA' }}
              className="w-full h-14 rounded-xl flex-row justify-center items-center"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Send color={cart.length === 0 ? (isDark ? '#52525b' : '#a1a1aa') : "white"} size={18} className="mr-2" />
                  <Text className={cn("text-base font-bold", cart.length === 0 ? (isDark ? "text-zinc-500" : "text-zinc-400") : "text-white")}>
                    Send to Kitchen
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}