'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Minus, Plus, Send, ReceiptText, ChevronLeft, Trash2, UtensilsCrossed } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge'; // <-- AQUÍ ESTÁ LA IMPORTACIÓN FALTANTE

// ==========================================
// 1. INTERFACES (Tipado Estricto)
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
// 2. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const MenuItemCard = ({ item, isDark, primaryColor, widthStyle, onAdd }: MenuItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        onPress={() => onAdd(item)}
      >
        <View
          className={cn(
            "rounded-[20px] p-5 transition-all duration-200 h-36 flex-col justify-between border",
            isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-white border-zinc-200"
          )}
          style={{
            borderColor: isHovered ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7'),
            transform: [{ scale: isHovered ? 0.98 : 1 }]
          }}
        >
          <Text className={cn("font-bold text-base leading-tight", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={2}>
            {item.name}
          </Text>

          <View className="flex-row justify-between items-end mt-auto w-full">
            <Text style={{ color: primaryColor }} className="text-lg font-headline font-bold">
              ${item.price.toFixed(2)}
            </Text>
            <View
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: isDark ? '#2A2A2A' : '#f4f4f5' }}
            >
              <Plus color={isDark ? "#a1a1aa" : "#71717a"} size={16} strokeWidth={3} />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const CartItemRow = ({ item, isDark, primaryColor, onIncrease, onDecrease, onRemove }: CartItemRowProps) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b" style={{ borderBottomColor: isDark ? '#2A2A2A' : '#f4f4f5' }}>
      <View className="flex-1 pr-3">
        <Text className={cn("font-bold text-sm mb-1", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={2}>
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
          <Minus color={isDark ? "#d4d4d8" : "#52525b"} size={14} strokeWidth={3} />
        </TouchableOpacity>

        <Text className={cn("font-bold text-sm w-8 text-center", isDark ? "text-white" : "text-zinc-900")}>
          {item.qty}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onIncrease}
          style={{ backgroundColor: primaryColor }}
          className="w-8 h-8 rounded-full items-center justify-center"
        >
          <Plus color="white" size={14} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (Overlay/Modal)
// ==========================================

export function OrderTaking({ tableId, tableNumber, tableName, waiterId, waiterName, onClose }: OrderTakingProps) {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  // ESTADOS REALES
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FETCH DEL MENÚ DESDE MYSQL (VÍA TU API)
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
        toast({ title: "Error", description: "No se pudo cargar el menú", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
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
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0));
  };

  const deleteFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // ENVÍO DE ORDEN COMPLETA A MONGODB
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

  const displayedMenu = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === selectedCategory);

  return (
    <SafeAreaView
      className="absolute z-[100] top-0 bottom-0 left-0 right-0 h-full w-full"
      style={{ backgroundColor: isDark ? "#121212" : "#f4f4f5" }}
    >
      <View className="flex-col h-full w-full mx-auto">

        {/* TOP HEADER SÚTIL */}
        <View className={cn(
          "p-6 flex-row items-center justify-between",
          isDark ? "bg-[#121212]" : "bg-[#f4f4f5]"
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
                {tableName || `Table #${tableNumber}`}
              </Text>
              <Text className="text-xs text-zinc-500 tracking-wide uppercase mt-1">
                New Order Entry
              </Text>
            </View>
          </View>

          <Badge
            variant="outline"
            className={cn("rounded-full px-4 py-1.5 md:hidden", isDark ? "border-[#2A2A2A] bg-[#1E1E1E]" : "border-zinc-300 bg-white")}
            label={`${cart.length} Items Selected`}
          />
          <View className="hidden md:flex">
            <Badge
              variant="outline"
              className={cn("rounded-full px-4 py-1.5", isDark ? "border-[#2A2A2A] bg-[#1E1E1E]" : "border-zinc-300 bg-white")}
              label={`${cart.length} Items Selected`}
            />
          </View>
        </View>

        {/* CONTENIDO PRINCIPAL */}
        <View className="flex-1 flex-col md:flex-row h-full">

          {/* LADO IZQUIERDO: MENÚ */}
          <View className="flex-1 flex-col px-6 h-full">

            {/* Categorías tipo "Tabs" */}
            <View className="mb-6 border-b" style={{ borderBottomColor: isDark ? '#2A2A2A' : '#e4e4e7' }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
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
                      }}
                      className="px-6 py-4 mr-2"
                    >
                      <Text className={cn(
                        "text-sm font-bold",
                        isSelected ? "text-white" : (isDark ? "text-zinc-400" : "text-zinc-600")
                      )}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Grid de Platillos */}
            <View className="flex-1">
              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color={primaryColor} />
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                  <View className="flex-row flex-wrap -mx-2">
                    {displayedMenu.map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        primaryColor={primaryColor}
                        widthStyle={getCardWidth()}
                        onAdd={addToCart}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>

          {/* LADO DERECHO: RESUMEN DE ORDEN FIJO */}
          <View className={cn(
            "w-full md:w-[380px] border-t md:border-t-0 md:border-l flex-col h-[400px] md:h-full",
            isDark ? "bg-[#161616] border-[#2A2A2A]" : "bg-white border-zinc-200 shadow-xl"
          )}>

            <View className={cn("p-6 pb-4 flex-row justify-between items-center")}>
              <View className="flex-row items-center gap-3">
                <ReceiptText color={primaryColor} size={22} />
                <Text className={cn("font-headline font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>
                  Order Summary
                </Text>
              </View>
              {cart.length > 0 && (
                <TouchableOpacity onPress={() => setCart([])}>
                  <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
              {cart.length === 0 ? (
                <View className="flex-col items-center justify-center flex-1 opacity-40 space-y-4">
                  <ReceiptText color={isDark ? "#a1a1aa" : "#71717a"} size={48} />
                  <Text className={cn("font-medium text-base", isDark ? "text-zinc-400" : "text-zinc-500")}>
                    No items added yet
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

            <View className={cn("p-6 border-t", isDark ? "border-[#2A2A2A]" : "border-zinc-200")}>
              <View className="flex-row justify-between items-center mb-6">
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
                onPress={handleSendOrder}
                disabled={isSubmitting || cart.length === 0}
                style={{ backgroundColor: cart.length > 0 ? primaryColor : (isDark ? '#2A2A2A' : '#e4e4e7') }}
                className="w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg active:scale-95 transition-transform"
              >
                {isSubmitting ? <ActivityIndicator color="white" /> : (
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
      </View>
    </SafeAreaView>
  );
}