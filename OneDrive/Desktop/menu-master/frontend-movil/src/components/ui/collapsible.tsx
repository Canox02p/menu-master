import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Collapsible = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
CollapsibleContent.displayName = "CollapsibleContent";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
};
