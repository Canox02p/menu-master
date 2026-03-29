'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const initialOrders = [
  { 
    id: '101', 
    table: 4, 
    time: '12m ago', 
    items: [
      { name: 'Signature Burger', qty: 2, status: 'Preparing', mods: 'No onions' },
      { name: 'Caesar Salad', qty: 1, status: 'Completed', mods: '' }
    ],
    urgency: 'high'
  },
  { 
    id: '102', 
    table: 12, 
    time: '8m ago', 
    items: [
      { name: 'Truffle Pasta', qty: 1, status: 'Preparing', mods: 'Extra sauce' },
      { name: 'Margarita Pizza', qty: 1, status: 'Preparing', mods: '' }
    ],
    urgency: 'normal'
  },
  { 
    id: '103', 
    table: 2, 
    time: '2m ago', 
    items: [
      { name: 'Lobster Risotto', qty: 2, status: 'Preparing', mods: '' }
    ],
    urgency: 'normal'
  }
];

export function ChefKDS() {
  const [orders, setOrders] = useState(initialOrders);

  const completeItem = (orderId: string, itemName: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          items: o.items.map(i => i.name === itemName ? { ...i, status: 'Completed' } : i)
        };
      }
      return o;
    }));
  };

  return (
    <ScrollView className="space-y-8 max-w-7xl mx-auto h-full flex flex-col" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-3xl font-headline font-bold text-foreground">Kitchen Display</Text>
          <Text className="text-muted-foreground">Monitor and complete incoming dish requests.</Text>
        </View>
        <View className="flex-row gap-4">
          <View className="text-center">
            <Text className="text-xs text-muted-foreground font-bold uppercase mb-1">Pending</Text>
            <Text className="text-2xl font-headline font-bold text-foreground">14</Text>
          </View>
          <View className="h-10 w-px bg-border mx-2" />
          <View className="text-center">
            <Text className="text-xs text-muted-foreground font-bold uppercase mb-1">Avg Speed</Text>
            <Text className="text-2xl font-headline font-bold text-primary">18m</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 flex-row flex-wrap gap-6">
        {orders.map((order) => (
          <Card key={order.id} className={cn(
            "border-none bg-card/50 overflow-hidden flex flex-col w-full md:w-[48%] lg:w-[31%]",
            order.urgency === 'high' && "border-2 border-red-500/50 shadow-lg shadow-red-500/10"
          )}>
            <CardHeader className={cn(
              "flex flex-row items-center justify-between py-4",
              order.urgency === 'high' ? "bg-red-500/10" : "bg-primary/10"
            )}>
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                  <Text className="font-headline font-bold text-foreground">T{order.table}</Text>
                </View>
                <View>
                  <CardTitle className="text-sm font-bold text-foreground">Order #{order.id}</CardTitle>
                  <View className="flex-row items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" color="#888" size={12} />
                    <Text className="text-[10px] text-muted-foreground font-bold">{order.time}</Text>
                  </View>
                </View>
              </View>
              {order.urgency === 'high' && (
                <Badge variant="destructive" className="rounded-full px-2" label="URGENT" />
              )}
            </CardHeader>
            <CardContent className="p-4 flex-1 space-y-4">
              {order.items.map((item, i) => (
                <View key={i} className={cn(
                  "p-3 rounded-2xl flex-row items-start justify-between gap-4 mb-3",
                  item.status === 'Completed' ? "bg-green-500/5 opacity-50" : "bg-background shadow-sm border border-border/50"
                )}>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Text className="text-accent text-[10px] font-bold">{item.qty}</Text>
                      </View>
                      <Text className={cn("font-bold text-sm text-foreground", item.status === 'Completed' && "line-through text-muted-foreground")}>
                        {item.name}
                      </Text>
                    </View>
                    {item.mods ? (
                      <View className="flex-row items-center gap-1 ml-8 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-400" color="#f87171" size={12} />
                        <Text className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{item.mods}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className={cn(
                      "w-10 h-10 rounded-xl",
                      item.status === 'Completed' ? "bg-green-500/10" : "bg-background"
                    )}
                    onPress={() => completeItem(order.id, item.name)}
                    disabled={item.status === 'Completed'}
                  >
                    <CheckCircle2 color={item.status === 'Completed' ? "#22c55e" : "#888"} size={24} />
                  </Button>
                </View>
              ))}
              <View className="pt-4 mt-auto">
                 <Button className="w-full rounded-2xl h-12 flex-row justify-center items-center shadow-lg shadow-primary/20">
                   <Text className="text-white font-bold">Complete Order</Text>
                 </Button>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
