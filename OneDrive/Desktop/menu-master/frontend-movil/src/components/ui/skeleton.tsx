import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Skeleton.displayName = "Skeleton";

export {
  Skeleton
};
