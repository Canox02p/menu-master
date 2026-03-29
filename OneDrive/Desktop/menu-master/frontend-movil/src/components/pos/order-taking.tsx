'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Minus, Send, ReceiptText, ChevronLeft } from 'lucide-react-native';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OrderTakingProps {
  tableId: number;
  onClose: () => void;
}

const MENU_CATEGORIES = ['Main', 'Appetizers', 'Drinks', 'Desserts'];

const MOCK_MENU = [
  { id: '1', name: 'Signature Burger', price: 18.5, category: 'Main' },
  { id: '2', name: 'Truffle Pasta', price: 22.0, category: 'Main' },
  { id: '3', name: 'Caesar Salad', price: 14.0, category: 'Appetizers' },
  { id: '4', name: 'Lobster Risotto', price: 32.0, category: 'Main' },
  { id: '5', name: 'Margarita Pizza', price: 16.5, category: 'Main' },
  { id: '6', name: 'Artisan Latte', price: 5.5, category: 'Drinks' },
  { id: '7', name: 'Chocolate Cake', price: 9.0, category: 'Desserts' },
];

export function OrderTaking({ tableId, onClose }: OrderTakingProps) {
  const [cart, setCart] = useState<{id: string, name: string, price: number, qty: number}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Main');
  const { toast } = useToast();

  const addToCart = (item: any) => {
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
    // Note: useToast is not fully compatible out of the box with React Native without standard adaptations
    onClose();
  };

  return (
    <View className="absolute z-[100] bg-background justify-between left-0 right-0 top-0 bottom-0 h-full w-full">
      <View className="flex-col h-full">
        <View className="p-4 border-b border-border flex-row items-center justify-between bg-card/50">
          <View className="flex-row items-center gap-4">
            <Button variant="ghost" size="icon" onPress={onClose} className="rounded-xl">
              <ChevronLeft className="w-6 h-6 text-foreground" color="#888" size={24} />
            </Button>
            <View>
              <Text className="text-xl font-headline font-bold text-foreground">Table #{tableId}</Text>
              <Text className="text-xs text-muted-foreground">New Order Entry</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
             <Badge variant="outline" className="rounded-full px-3 py-1" label={`${cart.length} Items Selected`} />
          </View>
        </View>

        <View className="flex-1 flex-col md:flex-row">
          <View className="flex-1 flex-col bg-accent/5 p-4 md:p-6 pb-24 md:pb-6">
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
                {MENU_CATEGORIES.map(cat => (
                  <Button 
                    key={cat} 
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className="rounded-full px-6 mr-2 mb-2"
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text className={cn("font-medium", selectedCategory === cat ? "text-white" : "text-foreground")}>{cat}</Text>
                  </Button>
                ))}
              </ScrollView>
            </View>

            <ScrollView className="flex-1 pr-0 md:pr-4" contentContainerStyle={{ paddingBottom: 60 }}>
              <View className="flex-row flex-wrap justify-between gap-4">
                {MOCK_MENU.filter(i => i.category === selectedCategory).map(item => (
                  <TouchableOpacity 
                    key={item.id}
                    onPress={() => addToCart(item)}
                    className="bg-card p-4 flex-col rounded-2xl justify-between h-32 shadow-sm w-full sm:w-[48%] lg:w-[31%]"
                  >
                    <Text className="font-bold text-foreground">{item.name}</Text>
                    <View className="flex-row justify-between items-center mt-auto">
                      <Text className="text-lg font-headline font-bold text-primary">${item.price.toFixed(2)}</Text>
                      <View className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary" color="#67A9FF" size={20} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-border bg-card flex-col p-6 shadow-2xl h-80 md:h-auto">
            <View className="flex-row items-center gap-2 mb-6">
              <ReceiptText className="w-5 h-5 text-muted-foreground" color="#888" size={20} />
              <Text className="font-headline font-bold text-lg text-foreground">Order Summary</Text>
            </View>

            <ScrollView className="flex-1 -mx-2 px-2" contentContainerStyle={{flexGrow: 1}}>
              {cart.length === 0 ? (
                <View className="flex-col items-center justify-center h-full opacity-50 space-y-4">
                  <ReceiptText className="w-12 h-12 text-muted-foreground mb-4" color="#888" size={48} />
                  <Text className="text-muted-foreground">No items added yet</Text>
                </View>
              ) : (
                <View className="space-y-4">
                  {cart.map(item => (
                    <View key={item.id} className="flex-row items-center justify-between p-3 rounded-xl bg-accent/5 border border-border mb-3">
                      <View className="flex-1">
                        <Text className="font-bold text-sm text-foreground">{item.name}</Text>
                        <Text className="text-xs text-primary font-bold mt-1">${(item.price * item.qty).toFixed(2)}</Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onPress={() => removeFromCart(item.id)}>
                          <Minus className="w-4 h-4 text-foreground" color="#888" size={16} />
                        </Button>
                        <Text className="font-bold text-sm w-4 text-center text-foreground">{item.qty}</Text>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onPress={() => addToCart(item)}>
                          <Plus className="w-4 h-4 text-foreground" color="#888" size={16} />
                        </Button>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View className="pt-6 mt-6 border-t border-border space-y-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-medium text-muted-foreground">Subtotal</Text>
                <Text className="text-sm font-medium text-muted-foreground">${total.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-headline font-bold text-foreground">Total</Text>
                <Text className="text-2xl font-headline font-bold text-foreground">${total.toFixed(2)}</Text>
              </View>
              <Button 
                className="w-full h-14 rounded-2xl flex-row justify-center items-center shadow-xl shadow-primary/20"
                disabled={cart.length === 0}
                onPress={handleSendOrder}
              >
                <Send className="w-6 h-6 text-primary-foreground mr-2" color="white" size={24} />
                <Text className="text-lg font-bold text-primary-foreground">Send to Kitchen</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
