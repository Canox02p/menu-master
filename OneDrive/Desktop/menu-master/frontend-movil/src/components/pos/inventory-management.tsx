'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, useWindowDimensions, Platform, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, AlertTriangle, Search, Filter, ArrowRight, Plus, Minus, X, CheckCircle2, ThermometerSnowflake } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api';

const CHARCOAL_GRAY = "#171A1C";
const BASE_URL = 'https://menu-master-api.onrender.com';

// ==========================================
// 1. INTERFACES
// ==========================================
interface InventoryItem {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  stock_minimo: number;
  precio: number;
}

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
export function InventoryManagement() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtros
  const [filterType, setFilterType] = useState<'ALL' | 'LOW' | 'SUFFICIENT'>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modales
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null); // Para editar stock
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario Nuevo
  const [newItem, setNewItem] = useState({ nombre: '', categoria: 'Entradas', precio: '', stock: '50', stock_minimo: '10' });
  // Formulario Editar Stock
  const [editStock, setEditStock] = useState({ stock: 0, stock_minimo: 0 });

  const isDesktop = width >= 1024;

  // ==========================================
  // LÓGICA DE DATOS
  // ==========================================
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await api.productos.getAll();

      const mappedItems: InventoryItem[] = data.map((p: any) => ({
        id: p.id_producto?.toString() || p.id?.toString(),
        nombre: p.nombre,
        categoria: p.categoria || 'General',
        stock: Number(p.stock) || 0,
        stock_minimo: Number(p.stock_minimo) || 10, // Default visual si no hay
        precio: Number(p.precio) || 0,
      }));
      setItems(mappedItems);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo cargar el inventario.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ==========================================
  // CREAR NUEVO PRODUCTO
  // ==========================================
  const handleAddProduct = async () => {
    if (!newItem.nombre || !newItem.precio || !newItem.stock) {
      toast({ title: "Campos incompletos", description: "Llena los campos obligatorios.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.productos.create({
        nombre: newItem.nombre,
        categoria: newItem.categoria,
        precio: Number(newItem.precio),
        stock: Number(newItem.stock),
        stock_minimo: Number(newItem.stock_minimo)
      });
      toast({ title: "Producto creado", description: "El producto se ha añadido al inventario." });
      setIsAddModalVisible(false);
      setNewItem({ nombre: '', categoria: 'Entradas', precio: '', stock: '50', stock_minimo: '10' });
      fetchInventory();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear el producto.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // ACTUALIZAR STOCK (MODAL DE EDICIÓN)
  // ==========================================
  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditStock({ stock: item.stock, stock_minimo: item.stock_minimo });
  };

  const handleUpdateStock = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await fetch(`${BASE_URL}/productos/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock: editStock.stock,
          stock_minimo: editStock.stock_minimo
        })
      });
      toast({ title: "Stock actualizado", description: "Se han guardado los cambios." });
      setSelectedItem(null);
      fetchInventory();
    } catch (error) {
      toast({ title: "Error", description: "Fallo al actualizar el stock.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // CÁLCULOS Y FILTROS
  // ==========================================
  const totalItems = items.length;
  const totalStock = items.reduce((acc, item) => acc + item.stock, 0);
  const lowStockItems = items.filter(i => i.stock <= i.stock_minimo);
  const lowStockCount = lowStockItems.length;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || item.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL'
      ? true
      : filterType === 'LOW'
        ? item.stock <= item.stock_minimo
        : item.stock > item.stock_minimo;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER */}
          <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
            <View>
              <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>Bodega e Inventario</Text>
              <Text className="text-zinc-500">Gestión de catálogo y existencias en tiempo real.</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsAddModalVisible(true)}
              style={{ backgroundColor: primaryColor }}
              className="rounded-2xl flex-row items-center gap-2 px-6 py-3 shadow-lg active:scale-95 transition-transform"
            >
              <Plus color="white" size={20} />
              <Text className="text-white font-bold">Nuevo Producto</Text>
            </TouchableOpacity>
          </View>

          {/* ESTADÍSTICAS (KPIs) */}
          <View className="flex-row flex-wrap gap-4 mb-8">
            <Card className={cn("flex-1 min-w-[250px] border-none rounded-[24px]", isDark ? "bg-[#1E1E1E]" : "bg-white shadow-sm")}>
              <CardContent className="p-6 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-amber-500/10 items-center justify-center">
                  <Package color="#f59e0b" size={24} />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Productos</Text>
                  <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>{totalItems}</Text>
                </View>
              </CardContent>
            </Card>

            <Card className={cn("flex-1 min-w-[250px] border-none rounded-[24px]", isDark ? "bg-[#1E1E1E]" : "bg-white shadow-sm")}>
              <CardContent className="p-6 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-blue-500/10 items-center justify-center">
                  <ThermometerSnowflake color="#3b82f6" size={24} />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">En Stock</Text>
                  <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>{totalStock} <Text className="text-lg text-zinc-500">U.</Text></Text>
                </View>
              </CardContent>
            </Card>

            <Card className={cn("flex-1 min-w-[250px] border-none rounded-[24px]", isDark ? "bg-[#1E1E1E]" : "bg-white shadow-sm")}>
              <CardContent className="p-6 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-red-500/10 items-center justify-center">
                  <AlertTriangle color="#ef4444" size={24} />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Alertas (Stock Bajo)</Text>
                  <Text className={cn("text-3xl font-headline font-bold", lowStockCount > 0 ? "text-red-500" : (isDark ? "text-white" : "text-zinc-900"))}>
                    {lowStockCount} <Text className="text-lg text-zinc-500">Items</Text>
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>

          {/* BUSCADOR Y FILTROS */}
          <View className="flex-row items-center gap-3 mb-6 relative z-40">
            <View className={cn("flex-1 flex-row items-center rounded-2xl px-4 py-2 border", isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-white border-zinc-200")}>
              <Search color={isDark ? "#71717a" : "#a1a1aa"} size={20} />
              <TextInput
                placeholder="Buscar productos..."
                placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={cn("flex-1 h-10 ml-3 text-sm font-medium", isDark ? "text-white" : "text-zinc-900")}
              />
              {isLoading && <ActivityIndicator color={primaryColor} size="small" />}
            </View>

            <View className="relative">
              <TouchableOpacity
                onPress={() => setShowFilterMenu(!showFilterMenu)}
                className={cn("h-14 px-5 rounded-2xl items-center justify-center flex-row gap-2 border transition-colors",
                  isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-white border-zinc-200",
                  filterType !== 'ALL' && "border-blue-500"
                )}
              >
                <Filter color={filterType !== 'ALL' ? "#3b82f6" : (isDark ? "#d4d4d8" : "#52525b")} size={18} />
                <Text className={cn("font-bold text-sm hidden md:flex", filterType !== 'ALL' ? "text-blue-500" : (isDark ? "text-zinc-300" : "text-zinc-700"))}>Filtros</Text>
              </TouchableOpacity>

              {/* Menú Flotante de Filtros */}
              {showFilterMenu && (
                <View className={cn("absolute top-16 right-0 w-48 rounded-2xl shadow-xl border p-2 z-50", isDark ? "bg-[#2A2A2A] border-[#3f3f46]" : "bg-white border-zinc-200")}>
                  {[
                    { id: 'ALL', label: 'Todos los productos' },
                    { id: 'LOW', label: 'Stock Bajo' },
                    { id: 'SUFFICIENT', label: 'Stock Suficiente' }
                  ].map(f => (
                    <TouchableOpacity
                      key={f.id}
                      onPress={() => { setFilterType(f.id as any); setShowFilterMenu(false); }}
                      className={cn("px-4 py-3 rounded-xl mb-1", filterType === f.id ? (isDark ? "bg-[#3f3f46]" : "bg-zinc-100") : "")}
                    >
                      <Text className={cn("text-sm font-bold", filterType === f.id ? (isDark ? "text-white" : "text-black") : (isDark ? "text-zinc-400" : "text-zinc-500"))}>
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* TABLA DE INVENTARIO */}
          <View className={cn("rounded-[32px] overflow-hidden border", isDark ? "bg-[#1E1E1E] border-[#2A2A2A]" : "bg-white border-zinc-200 shadow-sm")}>

            {/* Headers de Tabla (Solo Desktop) */}
            {isDesktop && (
              <View className={cn("flex-row items-center px-6 py-4 border-b", isDark ? "border-[#2A2A2A] bg-black/20" : "border-zinc-100 bg-zinc-50")}>
                <Text className="flex-[2] text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Producto</Text>
                <Text className="flex-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categoría</Text>
                <Text className="flex-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stock Actual</Text>
                <Text className="flex-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estado</Text>
                <Text className="flex-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right mr-10">Precio Unit.</Text>
              </View>
            )}

            <View>
              {filteredItems.length === 0 && !isLoading && (
                <Text className="text-center text-zinc-500 py-10">No hay productos en inventario.</Text>
              )}
              {filteredItems.map((item, index) => {
                const isLow = item.stock <= item.stock_minimo;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => openEditModal(item)} // La flecha o toda la fila abre el modal
                    activeOpacity={0.7}
                    className={cn(
                      "flex-col md:flex-row items-start md:items-center px-6 py-5 border-b transition-colors",
                      isDark ? "border-[#2A2A2A] hover:bg-[#2A2A2A]/50" : "border-zinc-100 hover:bg-zinc-50",
                      index === filteredItems.length - 1 && "border-0"
                    )}
                  >
                    <View className="flex-[2] flex-row items-center gap-4 w-full md:w-auto mb-3 md:mb-0">
                      <View className={cn("w-10 h-10 rounded-xl items-center justify-center", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                        <Package color={isDark ? "#a1a1aa" : "#71717a"} size={18} />
                      </View>
                      <Text className={cn("font-bold text-base", isDark ? "text-zinc-200" : "text-zinc-800")}>{item.nombre}</Text>
                    </View>

                    <View className="flex-1 w-full md:w-auto mb-3 md:mb-0">
                      <Badge variant="outline" className={cn("self-start rounded-lg px-2.5 py-1", isDark ? "bg-[#2A2A2A] border-[#3f3f46]" : "bg-zinc-100 border-zinc-200")} label={item.categoria} />
                    </View>

                    <View className="flex-1 w-full md:w-auto mb-3 md:mb-0">
                      <Text className={cn("font-bold text-base", isDark ? "text-white" : "text-zinc-900")}>
                        {item.stock} <Text className="text-xs text-zinc-500 font-medium">Unid.</Text>
                      </Text>
                      <Text className="text-[10px] text-zinc-500 uppercase tracking-wider">Min: {item.stock_minimo}</Text>
                    </View>

                    <View className="flex-1 w-full md:w-auto mb-3 md:mb-0">
                      <View className={cn("flex-row items-center gap-1.5 px-3 py-1 rounded-full self-start", isLow ? "bg-red-500/10" : "bg-emerald-500/10")}>
                        <View className={cn("w-1.5 h-1.5 rounded-full", isLow ? "bg-red-500" : "bg-emerald-500")} />
                        <Text className={cn("text-[10px] font-bold uppercase tracking-wider", isLow ? "text-red-500" : "text-emerald-500")}>
                          {isLow ? 'Stock Bajo' : 'Suficiente'}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-1 w-full md:w-auto flex-row items-center justify-between md:justify-end">
                      <Text className={cn("font-bold text-base", isDark ? "text-zinc-300" : "text-zinc-700")}>
                        ${item.precio.toFixed(2)}
                      </Text>
                      <View className="ml-4 p-2">
                        <ArrowRight color={isDark ? "#71717a" : "#a1a1aa"} size={18} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ========================================== */}
      {/* MODAL: NUEVO PRODUCTO */}
      {/* ========================================== */}
      <Modal visible={isAddModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className={cn("w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
            <View className={cn("p-6 flex-row justify-between items-center border-b", isDark ? "border-[#2A2A2A]" : "border-zinc-200")}>
              <Text className={cn("text-xl font-bold", isDark ? "text-white" : "text-black")}>Nuevo Producto</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}><X color={isDark ? "#a1a1aa" : "#71717a"} size={24} /></TouchableOpacity>
            </View>

            <View className="p-6 space-y-4">
              <View className="space-y-2">
                <Label className={isDark ? "text-zinc-400" : "text-zinc-500"}>Nombre del Producto</Label>
                <Input value={newItem.nombre} onChangeText={t => setNewItem({ ...newItem, nombre: t })} className={isDark ? "bg-[#2A2A2A] border-[#3f3f46] text-white" : ""} placeholder="Ej. Coca Cola 600ml" />
              </View>
              <View className="flex-row gap-4">
                <View className="space-y-2 flex-1">
                  <Label className={isDark ? "text-zinc-400" : "text-zinc-500"}>Categoría</Label>
                  <Input value={newItem.categoria} onChangeText={t => setNewItem({ ...newItem, categoria: t })} className={isDark ? "bg-[#2A2A2A] border-[#3f3f46] text-white" : ""} placeholder="Bebidas" />
                </View>
                <View className="space-y-2 flex-1">
                  <Label className={isDark ? "text-zinc-400" : "text-zinc-500"}>Precio Venta ($)</Label>
                  <Input value={newItem.precio} keyboardType="numeric" onChangeText={t => setNewItem({ ...newItem, precio: t })} className={isDark ? "bg-[#2A2A2A] border-[#3f3f46] text-white" : ""} placeholder="0.00" />
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="space-y-2 flex-1">
                  <Label className={isDark ? "text-zinc-400" : "text-zinc-500"}>Stock Inicial (Unidades)</Label>
                  <Input value={newItem.stock} keyboardType="numeric" onChangeText={t => setNewItem({ ...newItem, stock: t })} className={isDark ? "bg-[#2A2A2A] border-[#3f3f46] text-white font-bold" : "font-bold"} />
                </View>
                <View className="space-y-2 flex-1">
                  <Label className={isDark ? "text-zinc-400" : "text-zinc-500"}>Alerta Stock Mínimo</Label>
                  <Input value={newItem.stock_minimo} keyboardType="numeric" onChangeText={t => setNewItem({ ...newItem, stock_minimo: t })} className={isDark ? "bg-[#2A2A2A] border-[#3f3f46] text-white" : ""} />
                </View>
              </View>
            </View>

            <View className={cn("p-6 pt-0 border-t mt-4", isDark ? "border-[#2A2A2A]" : "border-zinc-200")}>
              <TouchableOpacity onPress={handleAddProduct} disabled={isSubmitting} style={{ backgroundColor: primaryColor }} className="w-full mt-6 py-4 rounded-xl items-center justify-center flex-row shadow-lg">
                {isSubmitting ? <ActivityIndicator color="white" /> : <><CheckCircle2 color="white" size={20} className="mr-2" /><Text className="text-white font-bold text-lg">Guardar Producto</Text></>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL: EDITAR STOCK DE UN PRODUCTO */}
      {/* ========================================== */}
      <Modal visible={selectedItem !== null} transparent animationType="fade">
        {selectedItem && (
          <View className="flex-1 bg-black/60 items-center justify-center p-4">
            <View className={cn("w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}>
              <View className={cn("p-6 pb-4 border-b", isDark ? "border-[#2A2A2A]" : "border-zinc-200")}>
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-4">
                    <Text className={cn("text-xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")} numberOfLines={2}>{selectedItem.nombre}</Text>
                    <Text className="text-sm text-zinc-500 mt-1">Ajuste de Inventario</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedItem(null)} className={cn("p-2 rounded-full", isDark ? "bg-[#2A2A2A]" : "bg-zinc-100")}>
                    <X color={isDark ? "#a1a1aa" : "#71717a"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="p-6 space-y-6">
                {/* Control de Stock Actual */}
                <View>
                  <Text className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 text-center">Unidades en Bodega</Text>
                  <View className="flex-row items-center justify-center gap-6">
                    <TouchableOpacity onPress={() => setEditStock({ ...editStock, stock: Math.max(0, editStock.stock - 1) })} className={cn("w-12 h-12 rounded-full items-center justify-center border", isDark ? "border-[#3f3f46] bg-[#2A2A2A]" : "border-zinc-300 bg-white")}>
                      <Minus color={isDark ? "white" : "black"} size={24} />
                    </TouchableOpacity>
                    <Text className={cn("text-4xl font-bold w-20 text-center font-mono", isDark ? "text-white" : "text-black")}>
                      {editStock.stock}
                    </Text>
                    <TouchableOpacity onPress={() => setEditStock({ ...editStock, stock: editStock.stock + 1 })} style={{ backgroundColor: primaryColor }} className="w-12 h-12 rounded-full items-center justify-center shadow-lg">
                      <Plus color="white" size={24} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Control de Stock Mínimo */}
                <View className={cn("p-4 rounded-2xl border flex-row items-center justify-between", isDark ? "bg-[#2A2A2A] border-[#3f3f46]" : "bg-zinc-50 border-zinc-200")}>
                  <View>
                    <Text className={cn("font-bold text-sm", isDark ? "text-white" : "text-zinc-800")}>Alerta Mínima</Text>
                    <Text className="text-xs text-zinc-500">Notificar al llegar a este nivel</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => setEditStock({ ...editStock, stock_minimo: Math.max(0, editStock.stock_minimo - 1) })}><Minus color="#888" size={16} /></TouchableOpacity>
                    <Text className={cn("font-bold text-base w-6 text-center", isDark ? "text-white" : "text-black")}>{editStock.stock_minimo}</Text>
                    <TouchableOpacity onPress={() => setEditStock({ ...editStock, stock_minimo: editStock.stock_minimo + 1 })}><Plus color="#888" size={16} /></TouchableOpacity>
                  </View>
                </View>
              </View>

              <View className="p-6 pt-0">
                <TouchableOpacity onPress={handleUpdateStock} disabled={isSubmitting} style={{ backgroundColor: primaryColor }} className="w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg active:scale-95 transition-transform">
                  {isSubmitting ? <ActivityIndicator color="white" /> : <><Text className="text-white font-bold text-base">Actualizar Existencias</Text></>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}