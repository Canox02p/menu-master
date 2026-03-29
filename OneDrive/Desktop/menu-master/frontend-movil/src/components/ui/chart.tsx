import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
ChartLegend.displayName = "ChartLegend";

const ChartLegendContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
ChartLegendContent.displayName = "ChartLegendContent";

const ChartStyle = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
ChartStyle.displayName = "ChartStyle";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle
};
