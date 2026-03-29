import * as React from "react"

export interface ToastProps {
  variant?: "default" | "destructive"
  className?: string
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type ToastActionElement = React.ReactElement<any>

export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const ToastViewport = () => null;
export const ToastTitle = () => null;
export const ToastDescription = () => null;
export const ToastClose = () => null;
export const ToastAction = () => null;
export const Toast = () => null;
