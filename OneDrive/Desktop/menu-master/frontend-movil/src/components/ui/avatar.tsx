import * as React from "react"
import { View, Image, Text, ViewProps, ImageProps, TextProps } from "react-native"

import { cn } from "@/lib/utils"

// 1. CONTENEDOR PRINCIPAL DEL AVATAR
const Avatar = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
)
Avatar.displayName = "Avatar"

// 2. LA IMAGEN DEL AVATAR
const AvatarImage = React.forwardRef<Image, ImageProps>(
  ({ className, ...props }, ref) => (
    <Image
      ref={ref as any}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
)
AvatarImage.displayName = "AvatarImage"

// 3. EL CONTENIDO DE RESPALDO (Iniciales o icono)
const AvatarFallback = React.forwardRef<View, ViewProps>(
  ({ className, children, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {/* MÓVIL: Si pasas texto como iniciales, asegúrate de que sea un componente <Text> */}
      {typeof children === 'string' ? (
        <Text className="text-xs font-medium text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }