import * as React from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// MÓVIL: Cambiamos 'inline-flex' por 'flex-row' para alinear texto e iconos correctamente.
// Se eliminaron los selectores web ([&_svg], focus-visible, etc.)
const buttonVariants = cva(
  "flex-row items-center justify-center gap-2 rounded-md disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
        destructive: "bg-destructive hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary hover:bg-secondary/80",
        ghost: "hover:bg-accent",
        link: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends TouchableOpacityProps, // MÓVIL: Heredamos de las propiedades nativas táctiles
  VariantProps<typeof buttonVariants> {
  // asChild se elimina permanentemente por incompatibilidad con el entorno nativo
}

const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <TouchableOpacity
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }