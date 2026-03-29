import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
TabsContent.displayName = "TabsContent";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
};
