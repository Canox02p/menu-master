import * as React from "react"
import { View, Text, ViewProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// MÓVIL: Eliminamos estilos de foco (ring) y transiciones que son exclusivos de web.
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary",
        secondary: "border-transparent bg-secondary",
        destructive: "border-transparent bg-destructive",
        outline: "border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends ViewProps,
  VariantProps<typeof badgeVariants> {
  label?: string; // MÓVIL: Agregamos una prop label para manejar el texto fácilmente
}

function Badge({ className, variant, children, label, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {/* MÓVIL: Si pasas un string como children o usas la prop label, lo envolvemos en Text */}
      {label || typeof children === 'string' ? (
        <Text className={cn(
          "text-[10px] font-bold",
          variant === 'default' && "text-primary-foreground",
          variant === 'secondary' && "text-secondary-foreground",
          variant === 'destructive' && "text-destructive-foreground",
          variant === 'outline' && "text-foreground"
        )}>
          {label || children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}

export { Badge, badgeVariants }