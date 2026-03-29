import * as React from "react"
import { TextInput, TextInputProps } from "react-native"

import { cn } from "@/lib/utils"

export interface InputProps extends TextInputProps {}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring md:text-sm",
          className
        )}
        placeholderTextColor="#888"
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
