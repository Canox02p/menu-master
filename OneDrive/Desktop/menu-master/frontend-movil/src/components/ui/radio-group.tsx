import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
RadioGroupItem.displayName = "RadioGroupItem";

export {
  RadioGroup,
  RadioGroupItem
};
