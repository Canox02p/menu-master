import * as React from "react"
import { Text, TextProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none"
)

const Label = React.forwardRef<Text, TextProps & VariantProps<typeof labelVariants>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
