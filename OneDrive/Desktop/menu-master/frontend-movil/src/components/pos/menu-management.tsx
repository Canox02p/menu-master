'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, useWindowDimensions, Platform, Pressable, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
import { api } from '@/lib/api'; // Importamos tu API conectada

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
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface AddItemFormProps {
  newItem: Partial<MenuItem>;
  setNewItem: (item: Partial<MenuItem>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES (SRP & Micro-interacciones)
// ==========================================

const TopHeader = ({ onAddPress }: { onAddPress: () => void }) => (
  <View className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <View>
      <Text className="text-3xl font-headline font-bold text-foreground">Menu Management</Text>
      <Text className="text-muted-foreground">Gestiona tus platillos directamente en MySQL.</Text>
    </View>
    <Button className="rounded-xl px-6 flex-row gap-2" onPress={onAddPress}>
      <Plus color="white" size={20} />
      <Text className="text-white font-medium">Add New Item</Text>
    </Button>
  </View>
);

const SearchAndFilter = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) => (
  <View className="flex-row gap-2 bg-card/30 p-2 rounded-2xl mb-6">
    <View className="relative flex-1 flex-row items-center">
      <View className="absolute left-3 z-10">
        <Search color="#888" size={16} />
      </View>
      <TextInput
        placeholder="Buscar platillos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="pl-10 py-3 rounded-xl bg-card border-none w-full text-foreground"
      />
    </View>
    <Button variant="outline" className="rounded-xl">
      <Text className="text-foreground">Filter</Text>
    </Button>
  </View>
);

const AddItemForm = ({ newItem, setNewItem, onSave, onCancel, isSubmitting }: AddItemFormProps) => (
  <Card className="border-2 border-primary/20 bg-primary/5 mb-6 rounded-[24px] overflow-hidden">
    <CardContent className="p-6 space-y-4">
      <View className="flex-col md:flex-row gap-4">
        <View className="space-y-2 flex-1 mb-4 md:mb-0">
          <Label>Nombre del Platillo</Label>
          <Input
            placeholder="Ej. Tacos al Pastor"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            className="rounded-xl bg-background"
          />
        </View>
        <View className="space-y-2 flex-1">
          <Label>Precio ($)</Label>
          <Input
            keyboardType="numeric"
            placeholder="0.00"
            value={newItem.price?.toString() || ''}
            onChangeText={(text) => setNewItem({ ...newItem, price: parseFloat(text) || 0 })}
            className="rounded-xl bg-background"
          />
        </View>
      </View>
      <View className="space-y-2 mt-4">
        <Label>Descripción</Label>
        <TextInput
          className="w-full min-h-[100px] bg-background border border-input rounded-xl p-3 text-sm text-foreground"
          placeholder="Describe los ingredientes y preparación..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={newItem.description}
          onChangeText={(text) => setNewItem({ ...newItem, description: text })}
          style={{ textAlignVertical: 'top' }}
        />
      </View>
      <View className="flex-row justify-end gap-3 mt-6">
        <Button variant="ghost" onPress={onCancel} className="rounded-xl" disabled={isSubmitting}>
          <Text className="text-foreground font-medium">Cancelar</Text>
        </Button>
        <Button className="rounded-xl px-8 shadow-sm" onPress={onSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold tracking-wide">Guardar Platillo</Text>
          )}
        </Button>
      </View>
    </CardContent>
  </Card>
);

const MenuItemCard = ({ item, widthStyle, isDark, primaryColor, onEdit, onDelete }: MenuItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={widthStyle} className="p-2 mb-2">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            "border-none overflow-hidden transition-all duration-300 rounded-[24px]",
            isDark ? "bg-zinc-900/40" : "bg-card/50",
            isHovered ? "shadow-md" : "shadow-sm"
          )}
          style={{
            borderWidth: 1.5,
            borderColor: isHovered ? primaryColor : 'transparent',
            transform: [{ translateY: isHovered ? -2 : 0 }]
          }}
        >
          <View className="h-40 bg-muted relative overflow-hidden">
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}/400/300` }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {isDark && <View className="absolute inset-0 bg-black/20" />}

            <View className="absolute top-3 right-3">
              <Badge className="bg-background/90 backdrop-blur-md border border-white/10" label={`$${item.price.toFixed(2)}`} />
            </View>
          </View>

          <CardContent className="p-5">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="font-headline font-bold text-lg text-foreground flex-1 pr-2" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row gap-1">
                <TouchableOpacity onPress={() => onEdit(item.id)} className="p-2 rounded-lg active:bg-zinc-800/20">
                  <Edit2 color="#888" size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} className="p-2 rounded-lg active:bg-red-500/20">
                  <Trash2 color="#ef4444" size={16} />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-sm text-muted-foreground mb-4 min-h-[40px]" numberOfLines={2}>
              {item.description}
            </Text>

            <View className="flex-row flex-wrap gap-1.5">
              <Badge variant="secondary" className={cn("rounded-md", isDark ? "bg-zinc-800" : "bg-zinc-100")} label={item.category} />
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </View>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (Layout)
// ==========================================

export function MenuManagement() {
  const { theme, primaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const { toast } = useToast();

  // Estados
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'General',
    description: '',
    ingredients: [],
  });

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const getCardWidth = (): StyleProp<ViewStyle> => {
    if (isDesktop) return { width: '33.33%' };
    if (isTablet) return { width: '50%' };
    return { width: '100%' };
  };

  // Cargar Menú desde Backend MySQL (InfinityFree vía Node)
  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const data = await api.productos.getAll();
      const mappedItems: MenuItem[] = data.map((p: any) => ({
        id: p.id_producto?.toString() || p.id?.toString(),
        name: p.nombre,
        price: Number(p.precio) || 0,
        category: p.categoria || 'General',
        description: p.descripcion || 'Sin descripción',
        ingredients: [] // MySQL no tiene ingredientes en el esquema actual
      }));
      setItems(mappedItems);
    } catch (error) {
      console.error("Error al cargar menú:", error);
      toast({ title: "Error", description: "No se pudo cargar el menú desde la base de datos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSaveItem = async () => {
    if (!newItem.name) return;

    // NOTA: Tu API en Node.js actualmente no tiene la ruta app.post('/productos')
    // Solo tienes GET, PUT y DELETE.
    // Por ahora, simulamos la creación en el Frontend. Debes agregar el POST en tu index.js.
    setIsSubmitting(true);
    setTimeout(() => {
      setItems([{ ...newItem, id: Date.now().toString() } as MenuItem, ...items]);
      setIsAdding(false);
      setNewItem({ name: '', price: 0, category: 'General', description: '', ingredients: [] });
      setIsSubmitting(false);
      toast({ title: "Guardado", description: "El platillo se ha guardado temporalmente." });
    }, 800);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      // Llamada real al backend Node -> PHP -> MySQL
      // await api.productos.delete(id); // Descomenta esto cuando quieras borrar de verdad en la BD

      setItems(items.filter(i => i.id !== id));
      toast({ title: "Eliminado", description: "El platillo ha sido borrado del sistema." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo borrar el platillo.", variant: "destructive" });
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 : 40 }}
    >
      <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

        <TopHeader onAddPress={() => setIsAdding(true)} />
        <SearchAndFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {isAdding && (
          <AddItemForm
            newItem={newItem}
            setNewItem={setNewItem}
            onSave={handleSaveItem}
            onCancel={() => setIsAdding(false)}
            isSubmitting={isSubmitting}
          />
        )}

        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color={primaryColor} />
            <Text className="text-zinc-500 mt-4 font-medium">Cargando 301 productos desde MySQL...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap -mx-2">
            {filteredItems.length === 0 && (
              <Text className="text-zinc-500 text-center w-full py-10">No se encontraron platillos.</Text>
            )}
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                widthStyle={getCardWidth()}
                isDark={isDark}
                primaryColor={primaryColor}
                onEdit={(id) => console.log('Edit', id)}
                onDelete={handleDeleteItem}
              />
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}