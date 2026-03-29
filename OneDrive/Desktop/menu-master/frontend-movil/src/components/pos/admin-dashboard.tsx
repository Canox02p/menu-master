import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const stats = [
  { label: 'Total Revenue', value: '$24,560', change: '+12.5%', icon: DollarSign, trend: 'up' },
  { label: 'Active Tables', value: '18/25', change: '72% capacity', icon: Users, trend: 'neutral' },
  { label: 'Average Order', value: '$42.50', change: '-2.1%', icon: Clock, trend: 'down' },
  { label: 'Items Sold', value: '1,240', change: '+18.4%', icon: TrendingUp, trend: 'up' },
];

export function AdminDashboard() {
  const maxSales = Math.max(...data.map(d => d.sales));

  return (
    <ScrollView className="space-y-8 max-w-7xl mx-auto" showsVerticalScrollIndicator={false}>
      <View>
        <Text className="text-3xl font-headline font-bold mb-2 text-foreground">Operational Overview</Text>
        <Text className="text-muted-foreground">Real-time performance metrics for your restaurant.</Text>
      </View>

      <View className="flex-row flex-wrap justify-between gap-y-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none bg-card/50 backdrop-blur-sm overflow-hidden group w-full md:w-[48%] lg:w-[23%]">
            <CardContent className="p-6">
              <View className="flex-row justify-between items-start">
                <View className="p-3 rounded-xl bg-primary/10 text-primary">
                  <stat.icon size={24} color="#67A9FF" />
                </View>
                <View className={cn(
                  "flex-row items-center px-2 py-1 rounded-full",
                  stat.trend === 'up' ? "bg-green-500/10" :
                    stat.trend === 'down' ? "bg-red-500/10" :
                      "bg-blue-500/10"
                )}>
                  {stat.trend === 'up' && <ArrowUpRight size={12} color="#22c55e" />}
                  {stat.trend === 'down' && <ArrowDownRight size={12} color="#ef4444" />}
                  <Text className={cn(
                    "text-xs font-bold ml-1",
                    stat.trend === 'up' ? "text-green-500" :
                      stat.trend === 'down' ? "text-red-500" :
                        "text-blue-500"
                  )}>
                    {stat.change}
                  </Text>
                </View>
              </View>
              <View className="mt-4">
                <Text className="text-sm text-muted-foreground font-medium">{stat.label}</Text>
                <Text className="text-2xl font-headline font-bold mt-1 text-foreground">{stat.value}</Text>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      <View className="flex-col lg:flex-row gap-6 mb-8">
        <Card className="lg:col-span-2 border-none bg-card/50 flex-1">
          <CardHeader>
            <CardTitle>
              <Text className="font-headline text-xl text-foreground">Weekly Sales Revenue</Text>
            </CardTitle>
            <CardDescription>
              <Text className="text-muted-foreground">Comparison of revenue generated over the last 7 days.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">

            <View className="flex-1 flex-row items-end justify-between border-b border-white/10 pb-2">
              {data.map((entry, index) => {
                const heightPercent = (entry.sales / maxSales) * 100;
                return (
                  <View key={`cell-${index}`} className="items-center flex-1">
                    <View
                      style={{ height: `${heightPercent}%` }}
                      className={cn("w-6 sm:w-8 rounded-t-md", index === 4 ? "bg-accent" : "bg-primary")}
                    />
                    <Text className="text-[10px] text-muted-foreground mt-2">{entry.name}</Text>
                  </View>
                );
              })}
            </View>

          </CardContent>
        </Card>

        <Card className="border-none bg-card/50 flex-1 mt-6 lg:mt-0">
          <CardHeader>
            <CardTitle>
              <Text className="font-headline text-xl text-foreground">Popular Items</Text>
            </CardTitle>
            <CardDescription>
              <Text className="text-muted-foreground">Best sellers this month.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="space-y-6">
              {[
                { name: 'Signature Burger', orders: 154, trend: 15 },
                { name: 'Truffle Pasta', orders: 128, trend: 8 },
                { name: 'Margarita Pizza', orders: 110, trend: -5 },
                { name: 'Caesar Salad', orders: 94, trend: 20 },
                { name: 'Artisan Latte', orders: 88, trend: 12 },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Text className="text-accent font-bold">#{i + 1}</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-sm text-foreground">{item.name}</Text>
                      <Text className="text-xs text-muted-foreground">{item.orders} orders</Text>
                    </View>
                  </View>
                  <Text className={cn("text-xs font-bold", item.trend > 0 ? "text-green-500" : "text-red-500")}>
                    {item.trend > 0 ? '+' : ''}{item.trend}%
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity className="w-full mt-8 p-3 rounded-xl bg-accent items-center">
              <Text className="text-white font-medium">View All Reports</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}