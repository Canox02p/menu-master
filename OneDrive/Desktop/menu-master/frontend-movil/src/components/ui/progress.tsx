import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Progress.displayName = "Progress";

export {
  Progress
};
