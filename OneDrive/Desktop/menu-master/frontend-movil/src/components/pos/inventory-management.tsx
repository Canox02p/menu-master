'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Wine, Package, Thermometer, 
  AlertTriangle, ArrowDown, ArrowUp, Filter, Droplets
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

const inventoryItems = [
  { id: '1', name: 'Cabernet Sauvignon 2018', category: 'Wine Cellar', stock: 24, minStock: 12, unit: 'Bottles', price: 45.00, status: 'Healthy' },
  { id: '2', name: 'Wagyu Beef Ribeye', category: 'Cold Storage', stock: 5, minStock: 8, unit: 'kg', price: 120.00, status: 'Low' },
  { id: '3', name: 'Truffle Oil (White)', category: 'Dry Goods', stock: 2, minStock: 3, unit: 'Liters', price: 85.00, status: 'Low' },
  { id: '4', name: 'San Pellegrino 500ml', category: 'Beverages', stock: 120, minStock: 50, unit: 'Bottles', price: 2.50, status: 'Healthy' },
  { id: '5', name: 'Artisanal Flour', category: 'Bakery', stock: 45, minStock: 20, unit: 'kg', price: 3.20, status: 'Healthy' },
];

export function InventoryManagement() {
  return (
    <ScrollView className="space-y-8 max-w-7xl mx-auto" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View>
          <Text className="text-3xl font-headline font-bold text-foreground">Cellar & Inventory</Text>
          <Text className="text-muted-foreground">Manage stock levels, storage conditions, and procurement.</Text>
        </View>
        <View className="flex-row gap-3">
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5">
            <Text className="text-foreground font-medium">Export Report</Text>
          </Button>
          <Button className="rounded-xl flex-row gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 text-white" color="white" size={16} />
            <Text className="text-white font-medium">Stock Intake</Text>
          </Button>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
        <Card className="border-none bg-card/40 w-full md:w-[32%]">
          <CardContent className="p-6 flex-row items-center gap-4">
            <View className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Thermometer className="w-6 h-6 text-amber-500" color="#f59e0b" size={24} />
            </View>
            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase">Cellar Temp</Text>
              <Text className="text-2xl font-headline font-bold text-foreground">14.2°C</Text>
            </View>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/40 w-full md:w-[32%]">
          <CardContent className="p-6 flex-row items-center gap-4">
            <View className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <Droplets className="w-6 h-6 text-blue-500" color="#3b82f6" size={24} />
            </View>
            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase">Humidity</Text>
              <Text className="text-2xl font-headline font-bold text-foreground">62%</Text>
            </View>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/40 w-full md:w-[32%]">
          <CardContent className="p-6 flex-row items-center gap-4">
            <View className="p-3 rounded-2xl bg-red-500/10 text-red-500">
              <AlertTriangle className="w-6 h-6 text-red-500" color="#ef4444" size={24} />
            </View>
            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase">Low Stock Alerts</Text>
              <Text className="text-2xl font-headline font-bold text-foreground">8 Items</Text>
            </View>
          </CardContent>
        </Card>
      </View>

      <Card className="border-none bg-card/50 overflow-hidden">
        <View className="p-6 border-b border-white/5 flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <View className="relative w-full md:w-96 flex-row items-center">
            <View className="absolute left-3 z-10">
              <Search className="w-4 h-4 text-muted-foreground" color="#888" size={16} />
            </View>
            <Input placeholder="Search inventory..." className="pl-10 rounded-xl bg-background/50 border-none w-full" />
          </View>
          <View className="flex-row gap-2 mt-4 md:mt-0">
            <Button variant="ghost" className="rounded-xl flex-row gap-2 h-10 px-4">
              <Filter className="w-4 h-4 text-foreground" color="#888" size={16} />
              <Text className="text-foreground">Filters</Text>
            </Button>
            <Button variant="ghost" className="rounded-xl flex-row gap-2 h-10 px-4">
              <ArrowDown className="w-4 h-4 text-foreground" color="#888" size={16} />
              <Text className="text-foreground">Category</Text>
            </Button>
          </View>
        </View>
        <ScrollView horizontal className="w-full">
          <View className="min-w-[800px] w-full">
            <View className="flex-row bg-black/20 px-6 py-4">
              <Text className="flex-2 text-xs font-bold text-muted-foreground uppercase tracking-wider w-[25%]">Item Name</Text>
              <Text className="flex-1 text-xs font-bold text-muted-foreground uppercase tracking-wider w-[20%]">Category</Text>
              <Text className="flex-1 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center w-[20%]">Current Stock</Text>
              <Text className="flex-1 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center w-[15%]">Status</Text>
              <Text className="flex-1 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right w-[15%]">Unit Price</Text>
              <View className="w-[5%]" />
            </View>
            <View className="divide-y divide-white/5">
              {inventoryItems.map((item) => (
                <View key={item.id} className="flex-row items-center px-6 py-4">
                  <View className="flex-row items-center gap-3 flex-2 w-[25%]">
                    <View className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {item.category === 'Wine Cellar' ? <Wine className="w-5 h-5" color="#67A9FF" /> : <Package className="w-5 h-5" color="#67A9FF" />}
                    </View>
                    <Text className="font-bold text-foreground" numberOfLines={1}>{item.name}</Text>
                  </View>
                  <View className="flex-1 w-[20%]">
                    <Badge variant="outline" className="rounded-lg border-white/10 self-start" label={item.category} />
                  </View>
                  <View className="flex-1 items-center w-[20%]">
                    <Text className={cn(
                      "font-headline font-bold",
                      item.status === 'Low' ? "text-red-400" : "text-foreground"
                    )}>
                      {item.stock} {item.unit}
                    </Text>
                    <Text className="text-[10px] text-muted-foreground font-bold mt-1">MIN: {item.minStock}</Text>
                  </View>
                  <View className="flex-1 items-center w-[15%]">
                    <View className={cn(
                      "flex-row items-center gap-1.5 px-3 py-1 rounded-full",
                      item.status === 'Low' ? "bg-red-500/10" : "bg-green-500/10"
                    )}>
                      <View className={cn("w-1.5 h-1.5 rounded-full", item.status === 'Low' ? "bg-red-500" : "bg-green-500")} />
                      <Text className={cn("text-[10px] font-bold uppercase", item.status === 'Low' ? "text-red-500" : "text-green-500")}>{item.status}</Text>
                    </View>
                  </View>
                  <View className="flex-1 items-end justify-center w-[15%]">
                    <Text className="font-mono font-bold text-foreground">
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                  <View className="w-[5%] items-end justify-center">
                    <Button variant="ghost" size="icon" className="rounded-xl w-8 h-8">
                      <ArrowUp className="w-4 h-4 text-foreground" color="#fff" size={16} />
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Card>
    </ScrollView>
  );
}
