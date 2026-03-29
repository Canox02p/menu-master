'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Plus, ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { OrderTaking } from './order-taking';

const tables = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  status: Math.random() > 0.6 ? 'Occupied' : ' अवेलेबल', // just dummy logic, replacing to simple English for reliability
  capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
  time: Math.random() > 0.6 ? '45m' : '-',
  total: Math.random() > 0.6 ? Math.floor(Math.random() * 150) + 20 : 0,
})).map(t => ({...t, status: t.status === 'Occupied' ? 'Occupied' : 'Available'}));

export function WaiterTables() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showOrderTaking, setShowOrderTaking] = useState(false);

  return (
    <View className="flex-1">
      <ScrollView className="space-y-8 max-w-6xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <View>
            <Text className="text-3xl font-headline font-bold text-foreground">Floor Plan</Text>
            <Text className="text-muted-foreground">Select a table to start or manage an order.</Text>
          </View>
          <View className="flex-row gap-2 mt-2 md:mt-0">
            <Badge variant="outline" className="bg-green-500/10 border-green-500/20 px-3 py-1 mr-2" label="Available" />
            <Badge variant="outline" className="bg-red-500/10 border-red-500/20 px-3 py-1" label="Occupied" />
          </View>
        </View>

        <View className="flex-row flex-wrap justify-center sm:justify-between gap-4">
          {tables.map((table) => (
            <TouchableOpacity
              key={table.id}
              activeOpacity={0.7}
              onPress={() => setSelectedTable(table.id)}
              className={cn(
                "w-full sm:w-[46%] md:w-[23%] aspect-square rounded-3xl p-6 transition-all border flex-col justify-between overflow-hidden",
                table.status === 'Occupied' 
                  ? "bg-card/50 border-primary/40 shadow-xl" 
                  : "bg-card border-dashed border-muted"
              )}
            >
              {table.status === 'Occupied' && (
                <View className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full items-end pr-3 pt-3">
                  <Users className="w-5 h-5 text-primary" color="#67A9FF" size={20} />
                </View>
              )}
              
              <Text className="text-2xl font-headline font-bold text-foreground">#{table.id}</Text>
              
              <View>
                <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{table.capacity} Seats</Text>
                {table.status === 'Occupied' ? (
                  <View className="space-y-1">
                    <View className="flex-row items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-primary" color="#67A9FF" size={12} />
                      <Text className="text-[10px] text-primary font-bold">{table.time}</Text>
                    </View>
                    <Text className="text-sm font-bold text-foreground">${table.total.toFixed(2)}</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs text-green-500 font-bold">Ready</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedTable && !showOrderTaking && (
        <View className="absolute bottom-8 left-4 right-4 items-center justify-center z-50">
          <Card className="bg-primary border-none shadow-2xl rounded-3xl overflow-hidden w-full max-w-lg">
            <CardContent className="p-6">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
                    <Text className="text-xl font-headline font-bold text-white max-w-full text-center">{selectedTable}</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-white">Table #{selectedTable}</Text>
                    <Text className="text-xs text-white/70">Main Dining Hall</Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <Button variant="ghost" className="rounded-xl items-center justify-center" onPress={() => setSelectedTable(null)}>
                    <Text className="text-white">Close</Text>
                  </Button>
                  <Button className="rounded-xl bg-white items-center justify-center flex-row px-4 gap-1" onPress={() => setShowOrderTaking(true)}>
                    <Plus className="w-4 h-4 text-primary" color="#67A9FF" size={16} />
                    <Text className="text-primary font-bold">Order</Text>
                    <ChevronRight className="w-4 h-4 text-primary ml-1" color="#67A9FF" size={16} />
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      )}

      {selectedTable && showOrderTaking && (
        <OrderTaking 
          tableId={selectedTable} 
          onClose={() => {
            setShowOrderTaking(false);
            setSelectedTable(null);
          }} 
        />
      )}
    </View>
  );
}
