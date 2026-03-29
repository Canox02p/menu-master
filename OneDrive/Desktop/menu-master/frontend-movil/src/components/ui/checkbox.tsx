import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Checkbox.displayName = "Checkbox";

export {
  Checkbox
};
