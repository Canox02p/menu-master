import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Tooltip = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Tooltip.displayName = "Tooltip";

const TooltipTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
TooltipContent.displayName = "TooltipContent";

const TooltipProvider = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
TooltipProvider.displayName = "TooltipProvider";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
};
