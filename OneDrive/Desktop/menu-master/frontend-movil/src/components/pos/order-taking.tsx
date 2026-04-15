'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, StyleProp, ViewStyle, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Send, ReceiptText, ChevronLeft, MapPin, User, Clock } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { api } from '@/lib/api';

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
  tableName?: string; // Nombre opcional
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
}

const CHARCOAL_GRAY = "#171A1C";

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
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-200 rounded-[24px] h-36 flex-col justify-between",
            isDark ? "bg-zinc-900/60" : "bg-white",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : 'transparent',
            transform: [{ scale: isHovered ? 0.97 : 1 }]
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

  const [currentTime, setCurrentTime] = useState('');

  // FETCH DEL MENÚ DESDE MYSQL (VÍA TU API) Y RELOJ
  useEffect(() => {
    // Reloj para la cabecera
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
    return () => clearInterval(timer);
  }, []);

  // DIMENSIONES FIJAS PARA EVITAR CRECIMIENTO INFINITO
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

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // ==========================================
  // ENVÍO DE ORDEN COMPLETA A MONGODB
  // ==========================================
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

      // 1. Crear Pedido en MongoDB
      const resPedido = await fetch('https://menu-master-api.onrender.com/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resPedido.ok) throw new Error("No se pudo crear el pedido.");

      // 2. Cambiar Mesa a OCUPADA
      await fetch(`https://menu-master-api.onrender.com/mesas/${tableId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'OCUPADA' })
      });

      toast({ title: "¡Éxito!", description: "Pedido enviado a cocina." });
      onClose(); // Cerramos el modal
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
      style={{ backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}
    >
      <View className="flex-col h-full w-full max-w-[1600px] mx-auto">

        {/* TOP HEADER */}
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
                {tableName || `Mesa #${tableNumber}`}
              </Text>
              <Text className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Nueva Orden
              </Text>
            </View>
          </View>

          {/* INDICADORES INFO (Mesero y Reloj) */}
          <View className="hidden md:flex flex-row items-center gap-6 mr-4">
            <View className="flex-row items-center gap-2">
              <User color={isDark ? "#71717a" : "#a1a1aa"} size={16} />
              <Text className={cn("text-sm font-bold uppercase", isDark ? "text-zinc-300" : "text-zinc-700")}>{waiterName}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Clock color={isDark ? "#71717a" : "#a1a1aa"} size={16} />
              <Text className={cn("text-sm font-mono font-bold", isDark ? "text-zinc-300" : "text-zinc-700")}>{currentTime}</Text>
            </View>
          </View>

          <Badge
            variant="outline"
            className={cn("rounded-full px-4 py-1.5 md:hidden", isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-100")}
            label={`${cart.length} Items`}
          />
        </View>

        {/* CONTENIDO PRINCIPAL */}
        <View className="flex-1 flex-col md:flex-row h-full">

          {/* LADO IZQUIERDO: MENÚ */}
          <View className="flex-1 flex-col p-4 h-full">

            {/* Categorías Fijas */}
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
                {categories.map(cat => {
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

            {/* Grid de Platillos con ScrollView Flexible */}
            <View className="flex-1">
              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color={primaryColor} />
                  <Text className="text-zinc-500 mt-4">Cargando menú desde la base de datos...</Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
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

          {/* LADO DERECHO: TICKET DE ORDEN (Ancho fijo en Desktop) */}
          <View className={cn(
            "w-full md:w-[400px] border-t md:border-t-0 md:border-l flex-col shadow-2xl h-[400px] md:h-full",
            isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
          )}>

            <View className={cn("p-6 pb-4 border-b flex-row justify-between items-center", isDark ? "border-zinc-800" : "border-zinc-200")}>
              <View className="flex-row items-center gap-3">
                <ReceiptText color={primaryColor} size={24} />
                <Text className={cn("font-headline font-bold text-xl", isDark ? "text-white" : "text-zinc-900")}>
                  Resumen
                </Text>
              </View>
              {/* Botón de limpiar carrito */}
              {cart.length > 0 && (
                <TouchableOpacity onPress={() => setCart([])}>
                  <Text className="text-xs font-bold text-red-500">Limpiar</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
              {cart.length === 0 ? (
                <View className="flex-col items-center justify-center flex-1 opacity-60 space-y-4 min-h-[200px]">
                  <View className={cn("w-20 h-20 rounded-full items-center justify-center mb-2", isDark ? "bg-zinc-800" : "bg-zinc-200")}>
                    <ReceiptText color={isDark ? "#52525b" : "#a1a1aa"} size={36} />
                  </View>
                  <Text className={cn("font-bold text-base", isDark ? "text-zinc-400" : "text-zinc-500")}>
                    Aún no hay productos
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

            {/* PIE DE CARRITO (Totales y Botón Fijo Abajo) */}
            <View className={cn("p-6 border-t", isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200")}>
              <View className="flex-row justify-between items-center mb-4">
                <Text className={cn("text-sm font-bold text-zinc-500 uppercase tracking-widest")}>Total</Text>
                <Text className={cn("text-3xl font-mono font-bold", isDark ? "text-white" : "text-black")}>
                  ${total.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSendOrder} // <--- CAMBIA ESTO
                disabled={isSubmitting || cart.length === 0}
                style={{ backgroundColor: cart.length > 0 ? primaryColor : (isDark ? '#3f3f46' : '#e4e4e7') }}
                className="w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg active:scale-95 transition-transform"
              >
                {isSubmitting ? <ActivityIndicator color="white" /> : (
                  <>
                    <View className="mr-2">
                      <Send color={cart.length === 0 ? (isDark ? '#a1a1aa' : '#a1a1aa') : "white"} size={20} />
                    </View>
                    <Text className={cn("text-lg font-bold tracking-wide", cart.length === 0 ? (isDark ? "text-zinc-400" : "text-zinc-400") : "text-white")}>
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