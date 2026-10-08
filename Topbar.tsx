import { Bell, Search, Store } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

export default function Topbar() {
  const { settings, updateSettings, staff, currentUserId } = useStore();
  const me = staff.find((s) => s.id === currentUserId);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search menu, order #, customer..."
            className="pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <Store size={16} />
          <select
            value={settings.activeOutletId}
            onChange={(e) => updateSettings({ activeOutletId: e.target.value })}
            className="bg-transparent border-0 text-sm font-medium text-slate-700 focus:outline-none"
          >
            {settings.outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-slate-500 hidden md:block">
          {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} ·{' '}
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <button className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
            {me?.name.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-medium text-slate-800">{me?.name || 'Admin'}</div>
            <div className="text-[11px] text-slate-500 capitalize">{me?.role || 'admin'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
