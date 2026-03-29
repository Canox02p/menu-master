import * as React from "react"
import { TouchableOpacity, View } from "react-native"

import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Switch = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      ref={ref}
      className={cn(
        "h-6 w-11 rounded-full border-2 border-transparent justify-center",
        checked ? "bg-primary" : "bg-input",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <View
        className={cn(
          "h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </TouchableOpacity>
  )
)
Switch.displayName = "Switch"

export { Switch }
