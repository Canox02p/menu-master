'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, useWindowDimensions, Platform, TouchableOpacity, Pressable } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/theme-provider';
import { Moon, Sun, Palette, Smartphone, ShieldCheck, Database, Users, Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

// ==========================================
// 1. INTERFACES Y DATOS
// ==========================================

interface ColorPreset {
  name: string;
  hex: string;
}

interface SystemToggleProps {
  label: string;
  desc: string;
  icon: any;
  value: boolean;
  onValueChange: (val: boolean) => void;
  isDark: boolean;
  primaryColor: string;
}

const colorPresets: ColorPreset[] = [
  { name: 'Classic Blue', hex: '#3b82f6' }, // Ajusté a un azul más vibrante
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Slate', hex: '#3f3f46' },
];

const CHARCOAL_GRAY = "#171A1C";

// ==========================================
// 2. SUBCOMPONENTES
// ==========================================

const SystemToggle = ({ label, desc, icon: Icon, value, onValueChange, isDark, primaryColor }: SystemToggleProps) => (
  <View className={cn(
    "flex-row items-center justify-between p-4 rounded-2xl border mb-3 transition-colors",
    isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-100 shadow-sm"
  )}>
    <View className="flex-row items-center gap-4 flex-1 pr-4">
      <View
        className={cn("w-10 h-10 rounded-[12px] items-center justify-center transition-colors", value ? "" : (isDark ? "bg-zinc-800" : "bg-zinc-100"))}
        style={value ? { backgroundColor: `${primaryColor}15` } : {}}
      >
        <Icon color={value ? primaryColor : (isDark ? "#a1a1aa" : "#71717a")} size={20} />
      </View>
      <View className="flex-1">
        <Text className={cn("font-bold text-sm", isDark ? "text-zinc-200" : "text-zinc-800")}>{label}</Text>
        <Text className={cn("text-xs mt-0.5", isDark ? "text-zinc-500" : "text-zinc-500")}>{desc}</Text>
      </View>
    </View>
    <Switch checked={value} onCheckedChange={onValueChange} />
  </View>
);

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export function SettingsView() {
  const { theme, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();

  // Estados locales para los toggles del sistema
  const [autoPrint, setAutoPrint] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [guestWifi, setGuestWifi] = useState(false);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isLargeScreen = isDesktop || isTablet;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? CHARCOAL_GRAY : "#f3f4f6" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 140 : 120 }}
      >
        <View className="px-4 pt-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER */}
          <View className="mb-8 px-2">
            <Text className={cn("text-3xl font-headline font-bold", isDark ? "text-white" : "text-zinc-900")}>
              Application Settings
            </Text>
            <Text className="text-zinc-500">Customize the look, feel, and behavior of your POS.</Text>
          </View>

          {/* CONTENEDOR DE TARJETAS (A dos columnas en pantallas grandes) */}
          <View
            style={{
              flexDirection: isLargeScreen ? 'row' : 'column',
              gap: 24
            }}
          >
            {/* ---------------------------------------------------- */}
            {/* TARJETA 1: APARIENCIA                               */}
            {/* ---------------------------------------------------- */}
            <Card className={cn(
              "border-none flex-1 rounded-[32px] overflow-hidden",
              isDark ? "bg-zinc-900/40" : "bg-white shadow-sm"
            )}>
              <CardHeader className={cn("border-b pb-6", isDark ? "border-zinc-800/60" : "border-zinc-100")}>
                <View className="flex-row items-center gap-4">
                  <View style={{ backgroundColor: `${primaryColor}15` }} className="w-12 h-12 items-center justify-center rounded-[14px]">
                    <Palette color={primaryColor} size={24} />
                  </View>
                  <View>
                    <CardTitle className={cn("font-headline text-xl", isDark ? "text-white" : "text-zinc-900")}>
                      Appearance
                    </CardTitle>
                    <CardDescription className="text-zinc-500">
                      Visual customization and themes.
                    </CardDescription>
                  </View>
                </View>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                {/* DARK MODE TOGGLE */}
                <View>
                  <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Display Mode</Text>
                  <View className={cn(
                    "flex-row items-center justify-between p-4 rounded-2xl border",
                    isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-100 shadow-sm"
                  )}>
                    <View className="flex-row items-center gap-4">
                      <View className={cn("w-10 h-10 rounded-[12px] items-center justify-center", isDark ? "bg-indigo-500/10" : "bg-amber-500/10")}>
                        {isDark ? <Moon color="#818cf8" size={20} /> : <Sun color="#f59e0b" size={20} />}
                      </View>
                      <View>
                        <Text className={cn("font-bold text-sm", isDark ? "text-zinc-200" : "text-zinc-800")}>Dark Mode</Text>
                        <Text className="text-xs text-zinc-500">Easier on the eyes in low light.</Text>
                      </View>
                    </View>
                    <Switch checked={isDark} onCheckedChange={toggleTheme} />
                  </View>
                </View>

                {/* BRAND COLOR */}
                <View>
                  <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Brand Color</Text>

                  {/* Selector de Presets */}
                  <View className="flex-row flex-wrap gap-3 mb-5">
                    {colorPresets.map((color) => {
                      const isActive = primaryColor.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <TouchableOpacity
                          key={color.hex}
                          activeOpacity={0.8}
                          onPress={() => setPrimaryColor(color.hex)}
                          style={{ backgroundColor: color.hex }}
                          className={cn(
                            "w-12 h-12 rounded-[16px] items-center justify-center shadow-sm",
                            isActive ? "border-2 border-white dark:border-zinc-900 scale-110" : "opacity-90"
                          )}
                        >
                          {isActive && <Check color="white" size={20} strokeWidth={3} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Input Custom Hex */}
                  <View className={cn("p-4 rounded-2xl border flex-row items-center gap-4", isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                    <View className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: primaryColor }} />
                    <View className="flex-1">
                      <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Custom Hex</Text>
                      <TextInput
                        value={primaryColor}
                        onChangeText={setPrimaryColor}
                        className={cn("p-0 m-0 font-mono text-sm font-bold uppercase", isDark ? "text-white" : "text-zinc-900")}
                        placeholder="#000000"
                        placeholderTextColor="#a1a1aa"
                        maxLength={7}
                      />
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* ---------------------------------------------------- */}
            {/* TARJETA 2: CONTROL DEL SISTEMA                      */}
            {/* ---------------------------------------------------- */}
            <Card className={cn(
              "border-none flex-1 rounded-[32px] overflow-hidden",
              isDark ? "bg-zinc-900/40" : "bg-white shadow-sm"
            )}>
              <CardHeader className={cn("border-b pb-6", isDark ? "border-zinc-800/60" : "border-zinc-100")}>
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 items-center justify-center rounded-[14px] bg-indigo-500/10">
                    <Smartphone color="#8b5cf6" size={24} />
                  </View>
                  <View>
                    <CardTitle className={cn("font-headline text-xl", isDark ? "text-white" : "text-zinc-900")}>
                      System Control
                    </CardTitle>
                    <CardDescription className="text-zinc-500">
                      Operational and security toggles.
                    </CardDescription>
                  </View>
                </View>
              </CardHeader>

              <CardContent className="p-6 flex-col justify-between flex-1">
                <View className="space-y-1">
                  <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Hardware & Network</Text>

                  <SystemToggle
                    label="Auto-Print Receipts"
                    desc="Send to thermal printer immediately."
                    icon={ShieldCheck}
                    value={autoPrint}
                    onValueChange={setAutoPrint}
                    isDark={isDark}
                    primaryColor={primaryColor}
                  />
                  <SystemToggle
                    label="Cloud Sync"
                    desc="Real-time backup of all orders."
                    icon={Database}
                    value={cloudSync}
                    onValueChange={setCloudSync}
                    isDark={isDark}
                    primaryColor={primaryColor}
                  />
                  <SystemToggle
                    label="Guest WiFi Login"
                    desc="Allow QR code table scanning."
                    icon={Users}
                    value={guestWifi}
                    onValueChange={setGuestWifi}
                    isDark={isDark}
                    primaryColor={primaryColor}
                  />
                </View>

                <View className="pt-6 mt-4">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ backgroundColor: primaryColor }}
                    className="w-full rounded-[16px] h-14 flex-row justify-center items-center shadow-lg shadow-primary/30"
                  >
                    <Text className="text-white font-bold tracking-wide text-base">Save Settings</Text>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}