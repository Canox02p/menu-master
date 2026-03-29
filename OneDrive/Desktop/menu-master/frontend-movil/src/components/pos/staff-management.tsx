'use client';

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, Shield, Star, 
  Calendar, Phone, Mail 
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

const staffMembers = [
  { id: '1', name: 'Alex Admin', role: 'ADMIN', status: 'On Shift', email: 'alex@custoserve.com', phone: '+1 234 567 890', joined: 'Jan 2023', performance: 4.8 },
  { id: '2', name: 'Will Waiter', role: 'WAITER', status: 'On Shift', email: 'will@custoserve.com', phone: '+1 234 567 891', joined: 'Mar 2023', performance: 4.5 },
  { id: '3', name: 'Charlie Chef', role: 'CHEF', status: 'Off Duty', email: 'charlie@custoserve.com', phone: '+1 234 567 892', joined: 'Feb 2023', performance: 4.9 },
  { id: '4', name: 'Elena Sommelier', role: 'WAITER', status: 'On Shift', email: 'elena@custoserve.com', phone: '+1 234 567 893', joined: 'Jun 2023', performance: 4.7 },
  { id: '5', name: 'Marco Sous Chef', role: 'CHEF', status: 'Break', email: 'marco@custoserve.com', phone: '+1 234 567 894', joined: 'Jul 2023', performance: 4.6 },
];

export function StaffManagement() {
  return (
    <ScrollView className="space-y-8 max-w-7xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <View>
          <Text className="text-3xl font-headline font-bold text-foreground">Team Directory</Text>
          <Text className="text-muted-foreground">Manage roles, permissions, and shift schedules.</Text>
        </View>
        <Button className="rounded-xl flex-row gap-2 shadow-lg shadow-accent/20 bg-accent h-12 px-6">
          <UserPlus className="w-5 h-5 text-white" color="white" size={20} />
          <Text className="text-white font-medium">Add Member</Text>
        </Button>
      </View>

      <View className="flex-row flex-wrap gap-6 justify-between">
        {staffMembers.map((member) => (
          <Card key={member.id} className="border-none bg-card/40 w-full md:w-[48%] lg:w-[31%]">
            <CardContent className="p-6">
              <View className="flex-row justify-between items-start mb-6">
                <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/5">
                  <AvatarImage source={{ uri: `https://picsum.photos/seed/${member.id}/100/100` }} />
                  <AvatarFallback>
                    <Text className="text-primary font-bold text-lg">{member.name[0]}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className={cn(
                  "px-3 py-1 rounded-full",
                  member.status === 'On Shift' ? "bg-green-500/10" :
                  member.status === 'Break' ? "bg-amber-500/10" :
                  "bg-white/5"
                )}>
                  <Text className={cn(
                    "text-[10px] font-bold uppercase",
                    member.status === 'On Shift' ? "text-green-500" :
                    member.status === 'Break' ? "text-amber-500" :
                    "text-white/50"
                  )}>
                    {member.status}
                  </Text>
                </View>
              </View>

              <View className="space-y-1 mb-6">
                <Text className="text-xl font-headline font-bold text-foreground">{member.name}</Text>
                <View className="flex-row items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" color="#67A9FF" size={16} />
                  <Text className="text-xs font-bold tracking-widest uppercase text-primary">{member.role}</Text>
                </View>
              </View>

              <View className="space-y-3 pt-6 border-t border-border/50">
                <View className="flex-row items-center gap-3 mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" color="#888" size={16} />
                  <Text className="text-sm text-muted-foreground">{member.email}</Text>
                </View>
                <View className="flex-row items-center gap-3 mb-4">
                  <Phone className="w-4 h-4 text-muted-foreground" color="#888" size={16} />
                  <Text className="text-sm text-muted-foreground">{member.phone}</Text>
                </View>
                <View className="flex-row items-center justify-between pt-2">
                  <View className="flex-row items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" color="#f59e0b" size={16} />
                    <Text className="text-sm font-bold text-foreground">{member.performance}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" color="#888" size={16} />
                    <Text className="text-xs text-muted-foreground">Since {member.joined}</Text>
                  </View>
                </View>
              </View>

              <View className="mt-6 pt-4 flex-row gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-10 border-border">
                  <Text className="text-foreground text-xs">Schedules</Text>
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl h-10 border-border">
                  <Text className="text-foreground text-xs">Settings</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
