'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, SafeAreaView } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Send, ReceiptText, ChevronLeft } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

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
  tableId: number;
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

// ==========================================
// 2. DATOS MOCKEADOS
// ==========================================

const MENU_CATEGORIES = ['Main', 'Appetizers', 'Drinks', 'Desserts'];

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Signature Burger', price: 18.5, category: 'Main' },
  { id: '2', name: 'Truffle Pasta', price: 22.0, category: 'Main' },
  { id: '3', name: 'Caesar Salad', price: 14.0, category: 'Appetizers' },
  { id: '4', name: 'Lobster Risotto', price: 32.0, category: 'Main' },
  { id: '5', name: 'Margarita Pizza', price: 16.5, category: 'Main' },
  { id: '6', name: 'Artisan Latte', price: 5.5, category: 'Drinks' },
  { id: '7', name: 'Chocolate Cake', price: 9.0, category: 'Desserts' },
];

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 3. SUBCOMPONENTES INTERACTIVOS
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
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-200 rounded-[24px] h-36 flex-col justify-between",
            isDark ? "bg-zinc-900/60" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : 'transparent',
            transform: [{ scale: isHovered ? 0.97 : 1 }] // Efecto "botón" al presionarlo
          }}
        >
          <CardContent className="p-5 flex-1 justify-between">
            <Text className={cn("font-bold text-base", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={2}>
              {item.name}
            </Text>

            <View className="flex-row justify-between items-center mt-auto">
              <Text style={{ color: primaryColor }} className="text-lg font-headline font-bold">
                ${item.price.toFixed(2)}
              </Text>
              <View
                className="w-9 h-9 rounded-[12px] flex items-center justify-center transition-colors"
                style={{ backgroundColor: isHovered ? primaryColor : `${primaryColor}15` }}
              >
                <Plus color={isHovered ? "white" : primaryColor} size={20} strokeWidth={3} />
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
    <View className={cn(
      "flex-row items-center justify-between p-3.5 rounded-2xl mb-3",
      isDark ? "bg-zinc-900/60 border border-zinc-800" : "bg-white border border-zinc-100 shadow-sm"
    )}>
      <View className="flex-1 pr-2">
        <Text className={cn("font-bold text-sm mb-1", isDark ? "text-zinc-200" : "text-zinc-800")} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ color: primaryColor }} className="text-xs font-bold">
          ${(item.price * item.qty).toFixed(2)}
        </Text>
      </View>

      <View className={cn("flex-row items-center gap-3 p-1 rounded-xl", isDark ? "bg-zinc-950/50" : "bg-zinc-50")}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onDecrease}
          className={cn("w-8 h-8 rounded-lg items-center justify-center", isDark ? "bg-zinc-800" : "bg-white shadow-sm")}
        >
          <Minus color={isDark ? "#d4d4d8" : "#52525b"} size={16} strokeWidth={3} />
        </TouchableOpacity>

        <Text className={cn("font-bold text-sm w-4 text-center", isDark ? "text-white" : "text-zinc-900")}>
          {item.qty}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onIncrease}
          style={{ backgroundColor: primaryColor }}
          className="w-8 h-8 rounded-lg items-center justify-center shadow-sm"
        >
          <Plus color="white" size={16} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (Overlay/Modal)
// ==========================================

export function OrderTaking({ tableId, onClose }: OrderTakingProps) {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Main');

  // Cálculos Responsivos
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '50%' }; // 2 columnas incluso en celular para el menú
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

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleSendOrder = () => {
    // Aquí iría la lógica de enviar al backend
    onClose();
  };

  return (
    <SafeAreaView
      className="absolute z-[100] top-0 bottom-0 left-0 right-0 h-full w-full"
      style={{ backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}
    >
      <View className="flex-col h-full w-full max-w-[1600px] mx-auto">

        {/* TOP HEADER (Botón volver y Mesa) */}
        <View className={cn(
          "p-4 border-b flex-row items-center justify-between",
          isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        )}>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className={cn("w-10 h-10 rounded-xl items-center justify-center", isDark ? "bg-zinc-800" : "bg-zinc-100")}
            >
              <ChevronLeft color={isDark ? "#d4d4d8" : "#52525b"} size={24} />
            </TouchableOpacity>
            <View>
              <Text className={cn("text-xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Table #{tableId}
              </Text>
              <Text className="text-xs font-medium text-zinc-500 tracking-wide uppercase">New Order Entry</Text>
            </View>
          </View>
          <Badge
            variant="outline"
            className={cn("rounded-full px-4 py-1.5", isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-100")}
            label={`${cart.length} Items`}
          />
        </View>

        {/* CONTENIDO PRINCIPAL (Dividido en Menú y Ticket) */}
        <View className="flex-1 flex-col md:flex-row">

          {/* LADO IZQUIERDO: MENÚ */}
          <View className="flex-1 flex-col p-4">

            {/* Categorías (Scroll Horizontal) */}
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
                {MENU_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      activeOpacity={0.8}
                      onPress={() => setSelectedCategory(cat)}
                      style={{ backgroundColor: isSelected ? primaryColor : (isDark ? '#27272a' : 'white') }}
                      className={cn(
                        "rounded-full px-6 py-3 mr-3 shadow-sm transition-all",
                        !isSelected && (isDark ? "border border-zinc-700" : "border border-zinc-200")
                      )}
                    >
                      <Text className={cn(
                        "font-bold",
                        isSelected ? "text-white" : (isDark ? "text-zinc-300" : "text-zinc-600")
                      )}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Grid de Platillos */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View className="flex-row flex-wrap -mx-2">
                {MOCK_MENU.filter(i => i.category === selectedCategory).map(item => (
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
          </View>

          {/* LADO DERECHO: TICKET DE ORDEN */}
          <View className={cn(
            "w-full md:w-[400px] border-t md:border-t-0 md:border-l flex-col shadow-2xl h-80 md:h-auto",
            isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
          )}>

            {/* Título del Ticket */}
            <View className={cn("p-6 pb-4 border-b", isDark ? "border-zinc-800" : "border-zinc-200")}>
              <View className="flex-row items-center gap-3">
                <ReceiptText color={primaryColor} size={24} />
                <Text className={cn("font-headline font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>
                  Order Summary
                </Text>
              </View>
            </View>

            {/* Lista de Items en el carrito */}
            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              {cart.length === 0 ? (
                <View className="flex-col items-center justify-center h-full opacity-60 space-y-4 py-10">
                  <View className={cn("w-20 h-20 rounded-full items-center justify-center mb-2", isDark ? "bg-zinc-800" : "bg-zinc-200")}>
                    <ReceiptText color={isDark ? "#52525b" : "#a1a1aa"} size={36} />
                  </View>
                  <Text className={cn("font-bold text-base", isDark ? "text-zinc-400" : "text-zinc-500")}>
                    No items added yet
                  </Text>
                  <Text className={cn("text-xs text-center px-8", isDark ? "text-zinc-600" : "text-zinc-400")}>
                    Select items from the menu to start building the order.
                  </Text>
                </View>
              ) : (
                <View>
                  {cart.map(item => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      isDark={isDark}
                      primaryColor={primaryColor}
                      onIncrease={() => addToCart(item)}
                      onDecrease={() => removeFromCart(item.id)}
                    />
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Footer: Totales y Botón Enviar */}
            <View className={cn("p-6 border-t space-y-4", isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200")}>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Subtotal</Text>
                <Text className={cn("text-base font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>
                  ${total.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-6">
                <Text className={cn("text-2xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  Total
                </Text>
                <Text style={{ color: primaryColor }} className="text-3xl font-headline font-bold">
                  ${total.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={cart.length === 0}
                onPress={handleSendOrder}
                style={{ backgroundColor: cart.length === 0 ? (isDark ? '#3f3f46' : '#e4e4e7') : primaryColor }}
                className="w-full h-14 rounded-[20px] flex-row justify-center items-center shadow-lg"
              >
                <Send color={cart.length === 0 ? (isDark ? '#a1a1aa' : '#a1a1aa') : "white"} size={20} className="mr-3" />
                <Text className={cn("text-lg font-bold tracking-wide", cart.length === 0 ? (isDark ? "text-zinc-400" : "text-zinc-400") : "text-white")}>
                  Send to Kitchen
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}