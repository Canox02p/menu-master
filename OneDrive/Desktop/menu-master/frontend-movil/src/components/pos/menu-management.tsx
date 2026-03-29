'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
}

const initialItems: MenuItem[] = [
  { id: '1', name: 'Signature Burger', price: 18.5, category: 'Main', description: 'Gourmet beef patty with melted cheddar.', ingredients: ['Beef', 'Cheddar', 'Lettuce'] },
  { id: '2', name: 'Truffle Pasta', price: 22.0, category: 'Main', description: 'Handmade fettuccine in truffle cream sauce.', ingredients: ['Fettuccine', 'Truffle Oil', 'Cream'] },
];

export function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'Main',
    description: '',
    ingredients: [],
  });

  return (
    <ScrollView className="space-y-6 max-w-6xl mx-auto" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <View>
          <Text className="text-3xl font-headline font-bold text-foreground">Menu Management</Text>
          <Text className="text-muted-foreground">Manage your dishes, pricing, and ingredients.</Text>
        </View>
        <Button className="rounded-xl px-6 flex-row gap-2" onPress={() => setIsAdding(true)}>
          <Plus className="w-5 h-5 text-white" color="white" size={20} />
          <Text className="text-white font-medium">Add New Item</Text>
        </Button>
      </View>

      <View className="flex-row gap-2 bg-card/30 p-2 rounded-2xl mb-6">
        <View className="relative flex-1 flex-row items-center">
          <View className="absolute left-3 z-10">
            <Search className="text-muted-foreground" color="#888" size={16} />
          </View>
          <Input placeholder="Search menu items..." className="pl-10 rounded-xl bg-card border-none w-full" />
        </View>
        <Button variant="outline" className="rounded-xl">
          <Text className="text-foreground">Filter</Text>
        </Button>
      </View>

      {isAdding && (
        <Card className="border-2 border-primary/20 bg-primary/5 mb-6">
          <CardContent className="p-6 space-y-4">
            <View className="flex-col md:flex-row gap-4">
              <View className="space-y-2 flex-1 mb-4 md:mb-0">
                <Label>Item Name</Label>
                <Input 
                  placeholder="e.g. Lobster Risotto" 
                  value={newItem.name}
                  onChangeText={(text) => setNewItem({...newItem, name: text})}
                />
              </View>
              <View className="space-y-2 flex-1">
                <Label>Price ($)</Label>
                <Input 
                  keyboardType="numeric" 
                  placeholder="0.00" 
                  value={newItem.price?.toString()}
                  onChangeText={(text) => setNewItem({...newItem, price: parseFloat(text) || 0})}
                />
              </View>
            </View>
            <View className="space-y-2 mt-4">
              <Label>Description</Label>
              <TextInput 
                className="w-full min-h-[100px] bg-background border border-input rounded-xl p-3 text-sm text-foreground"
                placeholder="Describe your dish..."
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
                value={newItem.description}
                onChangeText={(text) => setNewItem({...newItem, description: text})}
                style={{ textAlignVertical: 'top' }}
              />
            </View>
            <View className="flex-row justify-end gap-3 mt-6">
              <Button variant="ghost" onPress={() => setIsAdding(false)}>
                <Text className="text-foreground">Cancel</Text>
              </Button>
              <Button className="rounded-xl px-8" onPress={() => {
                if (!newItem.name) {
                  return; // Simple fail silently for now as toast needs to be adapted
                }
                setItems([...items, { ...newItem, id: Date.now().toString() } as MenuItem]);
                setIsAdding(false);
                setNewItem({ name: '', price: 0, category: 'Main', description: '', ingredients: [] });
              }}>
                <Text className="text-white font-bold">Save Item</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      )}

      <View className="flex-row flex-wrap gap-6 justify-between">
        {items.map((item) => (
          <Card key={item.id} className="border-none bg-card/50 overflow-hidden w-full md:w-[48%] lg:w-[31%]">
            <View className="h-40 bg-muted relative overflow-hidden">
               <Image 
                 source={{ uri: `https://picsum.photos/seed/${item.id}/400/300` }} 
                 className="w-full h-full"
                 resizeMode="cover"
               />
               <View className="absolute top-3 right-3">
                 <Badge className="bg-background/80" label={`$${item.price.toFixed(2)}`} />
               </View>
            </View>
            <CardContent className="p-5">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-headline font-bold text-lg text-foreground flex-1">{item.name}</Text>
                <View className="flex-row gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                    <Edit2 className="w-4 h-4" color="#888" size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                    <Trash2 className="w-4 h-4 text-destructive" color="#ef4444" size={16} />
                  </Button>
                </View>
              </View>
              <Text className="text-sm text-muted-foreground mb-4" numberOfLines={2}>
                {item.description}
              </Text>
              <View className="flex-row flex-wrap gap-1">
                {item.ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary" className="rounded-md" label={ing} />
                ))}
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
