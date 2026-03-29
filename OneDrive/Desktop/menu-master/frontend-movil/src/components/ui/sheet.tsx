import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Sheet = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Sheet.displayName = "Sheet";

const SheetPortal = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetPortal.displayName = "SheetPortal";

const SheetOverlay = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetOverlay.displayName = "SheetOverlay";

const SheetTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetClose.displayName = "SheetClose";

const SheetContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetContent.displayName = "SheetContent";

const SheetHeader = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetHeader.displayName = "SheetHeader";

const SheetFooter = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
};
