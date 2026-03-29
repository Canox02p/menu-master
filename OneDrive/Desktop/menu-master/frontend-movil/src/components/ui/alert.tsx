import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Alert = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export {
  Alert,
  AlertTitle,
  AlertDescription
};
