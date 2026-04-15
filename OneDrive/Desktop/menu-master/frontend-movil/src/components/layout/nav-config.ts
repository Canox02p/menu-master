import { LayoutDashboard, UtensilsCrossed, ChefHat, Settings, Package, ClipboardList, Users, Receipt } from 'lucide-react-native';

export const NAV_ITEMS = {
  ADMIN: [
    { label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    { label: 'Menu', icon: UtensilsCrossed, path: 'menu' },
    { label: 'Inventory', icon: Package, path: 'inventory' },
    { label: 'Reports', icon: ClipboardList, path: 'reports' },
    { label: 'Staff', icon: Users, path: 'staff' },
    { label: 'Settings', icon: Settings, path: 'settings' },
  ],
  MESERO: [
    { label: 'Tables', icon: LayoutDashboard, path: 'tables' },
    { label: 'Active Orders', icon: Receipt, path: 'orders' },
    { label: 'Menu', icon: UtensilsCrossed, path: 'menu' },
    { label: 'Preferences', icon: Settings, path: 'settings' },
  ],
  COCINERO: [
    { label: 'Kitchen Display', icon: ChefHat, path: 'kds' },
    { label: 'Inventory', icon: Package, path: 'inventory' },
    { label: 'Preferences', icon: Settings, path: 'settings' },
  ],
  DEFAULT: []
};