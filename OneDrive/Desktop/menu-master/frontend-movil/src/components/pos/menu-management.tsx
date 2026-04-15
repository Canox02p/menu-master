'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Trash2, Edit2, Filter, UtensilsCrossed } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

// ==========================================
// 1. INTERFACES (Tipado)
// ==========================================

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
}

interface MenuItemCardProps {
  item: MenuItem;
  widthStyle: StyleProp<ViewStyle>;
  isDark: boolean;
  primaryColor: string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string, name: string) => void;
}

interface AddItemFormProps {
  newItem: Partial<MenuItem>;
  setNewItem: (item: Partial<MenuItem>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  primaryColor: string;
  isDark: boolean;
}

const CHARCOAL_GRAY = "#171A1C";
const BASE_URL = 'https://menu-master-api.onrender.com';

// ==========================================
// 2. SUBCOMPONENTES INTERACTIVOS
// ==========================================

const TopHeader = ({ onAddPress, primaryColor, isDark }: { onAddPress: () => void, primaryColor: string, isDark: boolean }) => (
  <View className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <View>
      <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
        Gestión de Menú
      </Text>
      <Text className="text-zinc-500">Administra tu catálogo de platillos directamente en la base de datos.</Text>
    </View>
    <TouchableOpacity
      onPress={onAddPress}
      style={{ backgroundColor: primaryColor }}
      className="rounded-2xl px-6 py-3 flex-row items-center gap-2 shadow-lg active:scale-95 transition-transform"
    >
      <Plus color="white" size={20} />
      <Text className="text-white font-bold tracking-wide">Nuevo Platillo</Text>
    </TouchableOpacity>
  </View>
);

const SearchAndFilter = ({ searchQuery, setSearchQuery, isDark }: { searchQuery: string, setSearchQuery: (q: string) => void, isDark: boolean }) => (
  <View className={cn("flex-row gap-3 p-3 rounded-2xl mb-6", isDark ? "bg-zinc-900/50" : "bg-zinc-100")}>
    <View className="relative flex-1 flex-row items-center">
      <View className="absolute left-4 z-10">
        <Search color={isDark ? "#a1a1aa" : "#71717a"} size={18} />
      </View>
      <TextInput
        placeholder="Buscar platillos por nombre..."
        placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
        value={searchQuery}
        onChangeText={setSearchQuery}
        className={cn(
          "pl-12 pr-4 py-3.5 rounded-xl border-none w-full text-sm font-medium",
          isDark ? "bg-zinc-800 text-white" : "bg-white text-zinc-900 shadow-sm"
        )}
      />
    </View>
    <TouchableOpacity className={cn(
      "px-5 rounded-xl items-center justify-center flex-row gap-2 transition-colors",
      isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-white shadow-sm hover:bg-zinc-50"
    )}>
      <Filter color={isDark ? "#d4d4d8" : "#52525b"} size={18} />
      <Text className={cn("font-bold text-sm hidden md:flex", isDark ? "text-zinc-300" : "text-zinc-700")}>Filtrar</Text>
    </TouchableOpacity>
  </View>
);

const AddItemForm = ({ newItem, setNewItem, onSave, onCancel, isSubmitting, isEditing, primaryColor, isDark }: AddItemFormProps) => (
  <Card
    className={cn("mb-8 rounded-[32px] overflow-hidden border-2 shadow-xl", isDark ? "bg-zinc-950" : "bg-white")}
    style={{ borderColor: `${primaryColor}40` }}
  >
    <View className="p-4 border-b flex-row items-center gap-3" style={{ backgroundColor: `${primaryColor}15`, borderColor: isDark ? '#27272a' : '#f4f4f5' }}>
      <UtensilsCrossed color={primaryColor} size={20} />
      <Text style={{ color: primaryColor }} className="font-bold text-lg">
        {isEditing ? "Editar Platillo" : "Registrar Nuevo Platillo"}
      </Text>
    </View>

    <CardContent className="p-6 space-y-5">
      <View className="flex-col md:flex-row gap-5">
        <View className="space-y-2 flex-1">
          <Label className={cn("text-xs font-bold uppercase ml-1", isDark ? "text-zinc-400" : "text-zinc-500")}>Nombre del Platillo *</Label>
          <Input
            placeholder="Ej. Tacos al Pastor"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            className={cn("rounded-xl p-4", isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-50 text-black")}
          />
        </View>

        <View className="space-y-2 flex-1">
          <Label className={cn("text-xs font-bold uppercase ml-1", isDark ? "text-zinc-400" : "text-zinc-500")}>Categoría *</Label>
          <Input
            placeholder="Ej. Entradas, Platos Fuertes, Bebidas"
            value={newItem.category}
            onChangeText={(text) => setNewItem({ ...newItem, category: text })}
            className={cn("rounded-xl p-4", isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-50 text-black")}
          />
        </View>

        <View className="space-y-2 w-full md:w-40">
          <Label className={cn("text-xs font-bold uppercase ml-1", isDark ? "text-zinc-400" : "text-zinc-500")}>Precio ($) *</Label>
          <Input
            keyboardType="numeric"
            placeholder="0.00"
            value={newItem.price ? newItem.price.toString() : ''}
            onChangeText={(text) => setNewItem({ ...newItem, price: parseFloat(text) || 0 })}
            className={cn("rounded-xl p-4 font-mono font-bold", isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-50 text-black")}
          />
        </View>
      </View>

      <View className="space-y-2 mt-4">
        <Label className={cn("text-xs font-bold uppercase ml-1", isDark ? "text-zinc-400" : "text-zinc-500")}>Descripción</Label>
        <TextInput
          className={cn("w-full min-h-[100px] border rounded-xl p-4 text-sm", isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-black")}
          placeholder="Describe los ingredientes y método de preparación..."
          placeholderTextColor="#a1a1aa"
          multiline
          numberOfLines={4}
          value={newItem.description}
          onChangeText={(text) => setNewItem({ ...newItem, description: text })}
          style={{ textAlignVertical: 'top' }}
        />
      </View>

      <View className="flex-row justify-end gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <TouchableOpacity
          onPress={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl justify-center active:scale-95 transition-transform"
        >
          <Text className={cn("font-bold", isDark ? "text-zinc-400" : "text-zinc-500")}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSave}
          disabled={isSubmitting}
          style={{ backgroundColor: primaryColor }}
          className="px-8 py-3 rounded-xl justify-center shadow-lg active:scale-95 transition-transform flex-row items-center gap-2"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-bold tracking-wide">
              {isEditing ? "Actualizar Platillo" : "Guardar Platillo"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </CardContent>
  </Card>
);

const MenuItemCard = ({ item, widthStyle, isDark, primaryColor, onEdit, onDelete }: MenuItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={widthStyle} className="p-2 mb-3">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-300 rounded-[24px]",
            isDark ? "bg-zinc-900/50" : "bg-white",
            isHovered ? "shadow-xl" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : 'transparent',
            transform: [{ translateY: isHovered ? -4 : 0 }]
          }}
        >
          <View className="h-44 bg-zinc-800 relative overflow-hidden">
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}/400/300` }}
              className="w-full h-full opacity-80"
              resizeMode="cover"
            />
            {/* Gradiente Oscuro Inferior para que lea bien el texto encima */}
            <View className="absolute inset-0 bg-black/30" />

            <View className="absolute top-3 right-3">
              <Badge className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1" label={`$${item.price.toFixed(2)}`} />
            </View>

            {/* Botones Flotantes de Acción */}
            <View className="absolute top-3 left-3 flex-row gap-2">
              <TouchableOpacity
                onPress={() => onEdit(item)}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 items-center justify-center active:scale-95"
              >
                <Edit2 color="white" size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(item.id, item.name)}
                className="w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-md border border-white/20 items-center justify-center active:scale-95"
              >
                <Trash2 color="white" size={16} />
              </TouchableOpacity>
            </View>
          </View>

          <CardContent className="p-5">
            <View className="flex-row justify-between items-start mb-2">
              <Text className={cn("font-headline font-bold text-xl", isDark ? "text-white" : "text-zinc-900")} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <Text className={cn("text-sm mb-4 min-h-[40px]", isDark ? "text-zinc-400" : "text-zinc-500")} numberOfLines={2}>
              {item.description || "Sin descripción detallada."}
            </Text>

            <View className="flex-row flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className={cn("rounded-lg px-3 py-1", isDark ? "bg-zinc-800 border-zinc-700 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700")}
                label={item.category}
              />
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (Layout)
// ==========================================

export function MenuManagement() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  // Estados de Datos
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Formulario
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'Plato Fuerte',
    description: '',
    ingredients: [],
  });

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '25%' }; // 4 columnas en web
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // Cargar Menú desde Backend
  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/productos`);
      const data = await response.json();

      const mappedItems: MenuItem[] = data.map((p: any) => ({
        id: p.id_producto?.toString() || p.id?.toString(),
        name: p.nombre,
        price: Number(p.precio) || 0,
        category: p.categoria || 'General',
        description: p.descripcion || '',
        ingredients: []
      }));
      setItems(mappedItems);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo cargar el menú desde la base de datos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Abrir Formulario para Editar
  const handleEditPress = (item: MenuItem) => {
    setEditingId(item.id);
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
    });
    setIsAdding(true);
    // Hacemos scroll hacia arriba (esto en un ScrollView real requeriría un ref, por ahora es UX conceptual)
  };

  // Guardar (POST) o Actualizar (PUT) en la base de datos
  const handleSaveItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast({ title: "Atención", description: "El nombre y precio son obligatorios.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nombre: newItem.name.trim(),
        precio: Number(newItem.price),
        descripcion: newItem.description?.trim() || '',
        categoria: newItem.category?.trim() || 'General',
        stock: 100
      };

      const url = editingId ? `${BASE_URL}/productos/${editingId}` : `${BASE_URL}/productos`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Fallo en el servidor");

      toast({
        title: "¡Éxito!",
        description: editingId ? "Platillo actualizado correctamente." : "Nuevo platillo registrado."
      });

      // Limpiar y recargar
      setIsAdding(false);
      setEditingId(null);
      setNewItem({ name: '', price: 0, category: 'Plato Fuerte', description: '' });
      fetchMenu();

    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar el platillo.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Borrar con confirmación Segura
  const handleDeleteConfirmation = (id: string, name: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}" del menú permanentemente?`)) {
        ejecutarEliminacion(id);
      }
    } else {
      Alert.alert(
        "Eliminar Platillo",
        `¿Estás seguro de eliminar "${name}" permanentemente?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: () => ejecutarEliminacion(id) }
        ]
      );
    }
  };

  const ejecutarEliminacion = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/productos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("No se pudo eliminar.");

      setItems(items.filter(i => i.id !== id));
      toast({ title: "Eliminado", description: "El platillo ha sido borrado del sistema." });
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un problema al intentar borrar.", variant: "destructive" });
    }
  };

  // Filtro
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 : 80 }}
    >
      <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

        <TopHeader
          onAddPress={() => {
            setEditingId(null);
            setNewItem({ name: '', price: 0, category: 'Plato Fuerte', description: '' });
            setIsAdding(true);
          }}
          primaryColor={primaryColor}
          isDark={isDark}
        />

        <SearchAndFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} isDark={isDark} />

        {isAdding && (
          <AddItemForm
            newItem={newItem}
            setNewItem={setNewItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setIsAdding(false);
              setEditingId(null);
            }}
            isSubmitting={isSubmitting}
            isEditing={editingId !== null}
            primaryColor={primaryColor}
            isDark={isDark}
          />
        )}

        {isLoading ? (
          <View className="py-32 items-center justify-center">
            <ActivityIndicator size="large" color={primaryColor} />
            <Text className="text-zinc-500 mt-4 font-bold tracking-widest uppercase text-xs">Sincronizando Catálogo...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap -mx-2">
            {filteredItems.length === 0 && (
              <View className="items-center justify-center w-full py-20 opacity-50">
                <UtensilsCrossed color={isDark ? "white" : "black"} size={64} className="mb-4" />
                <Text className={cn("font-medium text-lg", isDark ? "text-zinc-400" : "text-zinc-500")}>
                  {searchQuery ? "No hay platillos que coincidan con tu búsqueda." : "El menú está vacío. ¡Agrega tu primer platillo!"}
                </Text>
              </View>
            )}

            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                widthStyle={getCardWidth()}
                isDark={isDark}
                primaryColor={primaryColor}
                onEdit={handleEditPress}
                onDelete={handleDeleteConfirmation}
              />
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}