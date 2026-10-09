import { TrendingUp, IndianRupee, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import { fmtMoney, fmtTime, startOfDay, fmtDay } from '../utils/format';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { orders, customers, ingredients, settings, menu, tables } = useStore();
  const today = startOfDay(Date.now());
  const todayOrders = orders.filter((o) => o.createdAt >= today && o.status !== 'cancelled');
  const todayRevenue = todayOrders.reduce((a, b) => a + b.total, 0);
  const occupied = tables.filter((t) => t.status === 'occupied').length;
  const lowStock = ingredients.filter((i) => i.stock <= i.minStock).length;

  // 7-day revenue
  const days: { day: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = startOfDay(Date.now() - i * 86400000);
    const dOrders = orders.filter((o) => o.createdAt >= d && o.createdAt < d + 86400000 && o.status !== 'cancelled');
    days.push({
      day: fmtDay(d),
      revenue: dOrders.reduce((a, b) => a + b.total, 0),
      orders: dOrders.length,
    });
  }

  // Top items
  const itemMap = new Map<string, { name: string; qty: number; revenue: number }>();
  todayOrders.forEach((o) => {
    o.items.forEach((it) => {
      const cur = itemMap.get(it.menuItemId) || { name: it.name, qty: 0, revenue: 0 };
      cur.qty += it.qty;
      cur.revenue += it.qty * it.price;
      itemMap.set(it.menuItemId, cur);
    });
  });
  const topItems = [...itemMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 6);

  // order types
  const typeData = ['dine-in', 'takeaway', 'delivery', 'online'].map((t) => ({
    name: t,
    value: todayOrders.filter((o) => o.type === t).length,
  }));
  const colors = ['#f97316', '#10b981', '#3b82f6', '#a855f7'];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Welcome back 👋`}
        subtitle={`Here's what's happening at ${settings.restaurantName} today`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value={fmtMoney(todayRevenue, settings.currency)} delta="+12% vs yesterday" Icon={IndianRupee} color="bg-emerald-500" />
        <StatCard label="Orders Today" value={todayOrders.length} delta={`Avg ${fmtMoney(todayOrders.length ? todayRevenue / todayOrders.length : 0, settings.currency)}`} Icon={ShoppingBag} color="bg-brand-500" />
        <StatCard label="Tables Occupied" value={`${occupied}/${tables.length}`} Icon={Users} color="bg-blue-500" />
        <StatCard label="Low Stock Alerts" value={lowStock} Icon={AlertTriangle} color={lowStock ? 'bg-red-500' : 'bg-slate-400'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-slate-800">Revenue (Last 7 days)</div>
              <div className="text-xs text-slate-500">Orders & sales trend</div>
            </div>
            <TrendingUp className="text-emerald-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold text-slate-800 mb-4">Order Types Today</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-800">Top Selling Today</div>
            <Link to="/reports" className="text-xs text-brand-600 hover:underline">View report</Link>
          </div>
          {topItems.length === 0 && <div className="text-sm text-slate-400 py-8 text-center">No orders yet today</div>}
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topItems} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={120} />
                <Tooltip />
                <Bar dataKey="qty" fill="#f97316" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-800">Recent Orders</div>
            <Link to="/orders" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-800">#{o.number} · <span className="capitalize text-slate-500">{o.type}</span></div>
                  <div className="text-xs text-slate-500">{o.items.length} items · {fmtTime(o.createdAt)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">{fmtMoney(o.total, settings.currency)}</div>
                  <div className={`text-[10px] uppercase font-medium ${o.status === 'completed' ? 'text-emerald-600' : o.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'}`}>
                    {o.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lowStock > 0 && (
        <div className="card p-5 border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-3">
            <Package className="text-red-500" />
            <div>
              <div className="font-semibold text-slate-800">Low Stock Warning</div>
              <div className="text-xs text-slate-500">{lowStock} ingredient(s) need restocking</div>
            </div>
            <Link to="/inventory" className="ml-auto btn-secondary text-xs">Manage Inventory →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ingredients.filter((i) => i.stock <= i.minStock).slice(0, 8).map((i) => (
              <div key={i.id} className="text-xs p-2 rounded bg-red-50">
                <div className="font-medium text-red-800">{i.name}</div>
                <div className="text-red-600">{i.stock} {i.unit} (min {i.minStock})</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
