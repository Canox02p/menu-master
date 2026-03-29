import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Carousel = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
};
