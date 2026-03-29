import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Popover = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
PopoverContent.displayName = "PopoverContent";

export {
  Popover,
  PopoverTrigger,
  PopoverContent
};
