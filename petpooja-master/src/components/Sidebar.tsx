import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Grid3X3,
  ChefHat,
  MonitorPlay,
  UtensilsCrossed,
  Package,
  Users,
  ReceiptText,
  BarChart3,
  UserCog,
  Settings as SettingsIcon,
  Truck,
} from 'lucide-react';

const items = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { to: '/pos', label: 'POS / Billing', Icon: ShoppingCart },
  { to: '/tables', label: 'Tables', Icon: Grid3X3 },
  { to: '/kot', label: 'KOT', Icon: ChefHat },
  { to: '/kds', label: 'Kitchen Display', Icon: MonitorPlay },
  { to: '/menu', label: 'Menu', Icon: UtensilsCrossed },
  { to: '/inventory', label: 'Inventory', Icon: Package },
  { to: '/vendors', label: 'Vendors', Icon: Truck },
  { to: '/customers', label: 'Customers', Icon: Users },
  { to: '/orders', label: 'Orders', Icon: ReceiptText },
  { to: '/reports', label: 'Reports', Icon: BarChart3 },
  { to: '/staff', label: 'Staff', Icon: UserCog },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
            P
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">Pet Pooja</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Restaurant OS</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {items.map(({ to, label, Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition border-l-2 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 border-brand-600'
                  : 'text-slate-600 hover:bg-slate-50 border-transparent'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-xs text-slate-400 border-t border-slate-200">
        v0.1 — Demo build
      </div>
    </aside>
  );
}
