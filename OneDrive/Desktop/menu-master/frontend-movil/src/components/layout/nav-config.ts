import { LayoutDashboard, UtensilsCrossed, ChefHat, Settings, Package, ClipboardList, Users, Receipt, Armchair } from 'lucide-react-native';

export const NAV_ITEMS = {
  ADMIN: [
    { label: 'Inicio', icon: LayoutDashboard, path: 'dashboard' },
    { label: 'Mesas', icon: Armchair, path: 'table-management' },
    { label: 'Menu', icon: UtensilsCrossed, path: 'menu' },
    { label: 'Inventario', icon: Package, path: 'inventory' },
    { label: 'Reportes', icon: ClipboardList, path: 'reports' },
    { label: 'Personal', icon: Users, path: 'staff' },
    { label: 'Configuraciones', icon: Settings, path: 'settings' },
  ],
  MESERO: [
    { label: 'Mesas', icon: LayoutDashboard, path: 'tables' },
    { label: 'Ordenes Activas', icon: Receipt, path: 'orders' },
    { label: 'Menu', icon: UtensilsCrossed, path: 'menu' },
    { label: 'Configuraciones', icon: Settings, path: 'settings' },
  ],
  COCINERO: [
    { label: 'Pantalla de Cocina', icon: ChefHat, path: 'kds' },
    { label: 'Inventario', icon: Package, path: 'inventory' },
    { label: 'Configuraciones', icon: Settings, path: 'settings' },
  ],
  DEFAULT: []
};