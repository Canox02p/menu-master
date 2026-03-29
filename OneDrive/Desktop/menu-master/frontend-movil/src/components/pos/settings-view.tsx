'use client';

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/theme-provider';
import { Moon, Sun, Palette, Smartphone, ShieldCheck, Database, Users } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';

const colorPresets = [
  { name: 'Classic Blue', hex: '#67A9FF' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
];

export function SettingsView() {
  const { theme, toggleTheme, primaryColor, setPrimaryColor } = useTheme();

  return (
    <ScrollView className="space-y-8 max-w-4xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="mb-8">
        <Text className="text-3xl font-headline font-bold text-foreground">Application Settings</Text>
        <Text className="text-muted-foreground">Customize the look and feel of your POS.</Text>
      </View>

      <View className="flex-col md:flex-row gap-6">
        <Card className="border-none bg-card/50 flex-1 mb-6 md:mb-0">
          <CardHeader>
            <View className="p-2 w-10 h-10 items-center justify-center rounded-xl bg-primary/10 mb-2">
              <Palette className="w-5 h-5 text-primary" color="#67A9FF" size={20} />
            </View>
            <CardTitle>
               <Text className="font-headline text-foreground">Appearance</Text>
            </CardTitle>
            <CardDescription>
               <Text className="text-muted-foreground">Visual customization and themes.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <View className="flex-row items-center justify-between p-4 rounded-2xl bg-background border border-border/50 mb-6">
              <View className="flex-row items-center gap-3">
                {theme === 'dark' ? <Moon className="text-primary" size={20} /> : <Sun className="text-amber-500" size={20} />}
                <View>
                  <Text className="font-bold text-sm text-foreground">Dark Mode</Text>
                  <Text className="text-xs text-muted-foreground">Easier on the eyes in dark kitchens.</Text>
                </View>
              </View>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </View>

            <View className="space-y-4">
              <Label>Primary Brand Color</Label>
              <View className="flex-row flex-wrap gap-3 mt-4 mb-4">
                {colorPresets.map((color) => (
                  <TouchableOpacity
                    key={color.hex}
                    onPress={() => setPrimaryColor(color.hex)}
                    className={cn(
                      "w-12 h-12 rounded-2xl items-center justify-center",
                      primaryColor === color.hex ? "border-4 border-primary/50" : ""
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </View>
              <View className="pt-2">
                <Text className="text-xs text-muted-foreground mb-2 block">Custom Hex Code</Text>
                <View className="flex-row gap-2">
                  <Input 
                    value={primaryColor} 
                    onChangeText={setPrimaryColor}
                    className="flex-1 rounded-xl font-mono uppercase text-foreground"
                  />
                  <View className="w-10 h-10 rounded-xl border border-border" style={{ backgroundColor: primaryColor }} />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/50 flex-1">
          <CardHeader>
            <View className="p-2 w-10 h-10 items-center justify-center rounded-xl bg-accent/10 mb-2">
              <Smartphone className="w-5 h-5 text-accent" color="#8B5CF6" size={20} />
            </View>
            <CardTitle>
               <Text className="font-headline text-foreground">System Control</Text>
            </CardTitle>
            <CardDescription>
               <Text className="text-muted-foreground">Operational and security toggles.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <View className="space-y-4 mb-6">
                {[
                  { label: 'Auto-Print Receipts', icon: ShieldCheck, desc: 'Send to thermal printer immediately.', default: true },
                  { label: 'Cloud Sync', icon: Database, desc: 'Real-time backup of all orders.', default: true },
                  { label: 'Guest WiFi Login', icon: Users, desc: 'Allow QR code table scanning.', default: false }
                ].map((item, i) => (
                  <View key={i} className="flex-row items-center justify-between p-4 rounded-2xl bg-background border border-border/50 mb-3">
                    <View className="flex-row items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground" color="#888" size={20} />
                      <View>
                        <Text className="font-bold text-sm text-foreground">{item.label}</Text>
                        <Text className="text-xs text-muted-foreground">{item.desc}</Text>
                      </View>
                    </View>
                    <Switch checked={item.default} />
                  </View>
                ))}
             </View>
             <Button className="w-full mt-4 rounded-xl border border-primary bg-transparent text-primary items-center justify-center h-12">
               <Text className="text-primary font-bold">Save System Settings</Text>
             </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
