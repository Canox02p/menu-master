import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

const Menubar = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
Menubar.displayName = "Menubar";

const MenubarMenu = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarMenu.displayName = "MenubarMenu";

const MenubarTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarContent.displayName = "MenubarContent";

const MenubarItem = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarItem.displayName = "MenubarItem";

const MenubarSeparator = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarSeparator.displayName = "MenubarSeparator";

const MenubarLabel = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarLabel.displayName = "MenubarLabel";

const MenubarCheckboxItem = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

const MenubarRadioGroup = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarRadioGroup.displayName = "MenubarRadioGroup";

const MenubarRadioItem = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarRadioItem.displayName = "MenubarRadioItem";

const MenubarPortal = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarPortal.displayName = "MenubarPortal";

const MenubarSubContent = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarSubContent.displayName = "MenubarSubContent";

const MenubarSubTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarSubTrigger.displayName = "MenubarSubTrigger";

const MenubarGroup = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarGroup.displayName = "MenubarGroup";

const MenubarSub = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarSub.displayName = "MenubarSub";

const MenubarShortcut = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn("", className)} {...props} />
));
MenubarShortcut.displayName = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut
};
