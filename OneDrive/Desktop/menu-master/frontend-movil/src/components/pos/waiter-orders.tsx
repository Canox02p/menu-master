'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Receipt, CircleDollarSign } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const mockOrders = [
  { id: 'ORD-1234', table: 5, total: 45.50, items: 3, status: 'Preparing', time: '12m ago', priority: 'high' },
  { id: 'ORD-1235', table: 2, total: 12.00, items: 1, status: 'Ready', time: '2m ago', priority: 'normal' },
  { id: 'ORD-1236', table: 8, total: 88.20, items: 5, status: 'Preparing', time: '22m ago', priority: 'normal' },
];

export function WaiterOrders() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  return (
    <ScrollView className="space-y-8 max-w-7xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <View>
          <Text className="text-3xl font-headline font-bold text-foreground">Active Orders</Text>
          <Text className="text-muted-foreground">Monitor dish statuses and manage billing.</Text>
        </View>
        <View className="flex-row bg-card p-1 rounded-xl mt-4 md:mt-0">
          <Button 
            variant={activeTab === 'active' ? 'secondary' : 'ghost'} 
            className="rounded-lg px-6"
            onPress={() => setActiveTab('active')}
          >
            <Text className={activeTab === 'active' ? "text-foreground font-medium" : "text-muted-foreground"}>Ongoing</Text>
          </Button>
          <Button 
            variant={activeTab === 'completed' ? 'secondary' : 'ghost'} 
            className="rounded-lg px-6"
            onPress={() => setActiveTab('completed')}
          >
            <Text className={activeTab === 'completed' ? "text-foreground font-medium" : "text-muted-foreground"}>History</Text>
          </Button>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-6 justify-between">
        {mockOrders.map((order) => (
          <Card key={order.id} className="border-none bg-card/50 overflow-hidden w-full md:w-[48%] lg:w-[31%]">
            <CardHeader className="flex-row items-center justify-between py-4 border-b border-white/5">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Text className="text-primary font-headline font-bold">T{order.table}</Text>
                </View>
                <View>
                  <CardTitle className="text-sm font-bold text-foreground">{order.id}</CardTitle>
                  <View className="flex-row items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" color="#888" size={12} />
                    <Text className="text-[10px] text-muted-foreground font-bold">{order.time}</Text>
                  </View>
                </View>
              </View>
              <Badge 
                variant={order.status === 'Ready' ? 'default' : 'outline'}
                className={cn(
                  "rounded-full px-3",
                  order.status === 'Ready' ? "bg-green-500" : "border-primary/20"
                )}
                label={order.status.toUpperCase()}
              />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <View className="flex-row justify-between items-center mb-6">
                <View className="space-y-1">
                  <Text className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Order Value</Text>
                  <Text className="text-2xl font-headline font-bold text-foreground">${order.total.toFixed(2)}</Text>
                </View>
                <View className="items-end space-y-1">
                  <Text className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Items</Text>
                  <Text className="text-lg font-bold text-foreground">{order.items}</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Button variant="outline" className="flex-1 flex-row rounded-xl gap-2 h-11 border-border bg-transparent">
                  <Receipt className="text-foreground" color="#888" size={16} />
                  <Text className="text-foreground text-xs font-bold">Print Bill</Text>
                </Button>
                <Button className="flex-1 flex-row rounded-xl gap-2 h-11 bg-primary">
                  <CircleDollarSign className="text-primary-foreground" color="white" size={16} />
                  <Text className="text-primary-foreground text-xs font-bold">Pay Now</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
