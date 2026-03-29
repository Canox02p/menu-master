import * as React from "react"
import { ScrollView, ScrollViewProps } from "react-native"

import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends ScrollViewProps {}

const ScrollArea = React.forwardRef<ScrollView, ScrollAreaProps>(({ className, children, ...props }, ref) => (
  <ScrollView
    ref={ref}
    className={cn("relative", className)}
    {...props}
  >
    {children}
  </ScrollView>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = () => null; 

export { ScrollArea, ScrollBar }
