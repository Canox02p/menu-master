import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react-native';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <View className="absolute top-10 left-4 right-4 z-[100] pb-4" pointerEvents="box-none">
      {toasts.map(({ id, title, description, action, variant }) => (
        <View 
          key={id} 
          className={`flex-row justify-between p-4 rounded-2xl shadow-xl mt-2 w-full ${variant === 'destructive' ? 'bg-destructive' : 'bg-card border border-border'}`}
        >
          <View className="flex-1 mr-2">
            {title && <Text className="font-bold text-foreground">{title}</Text>}
            {description && <Text className="text-sm text-muted-foreground">{description}</Text>}
          </View>
          <View className="flex-row items-center gap-2">
            {action}
            <TouchableOpacity onPress={() => dismiss(id)} className="p-1">
              <X color={variant === 'destructive' ? 'white' : '#888'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
