import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useStore, newId } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import type { Category, MenuItem } from '../types';
import { fmtMoney } from '../utils/format';

const emptyItem: MenuItem = { id: '', name: '', categoryId: '', price: 0, veg: true, available: true, tax: 5 };
const emptyCat: Category = { id: '', name: '', color: '#f97316' };

export default function MenuPage() {
  const s = useStore();
  const [tab, setTab] = useState<'items' | 'categories'>('items');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = s.menu.filter(
    (m) =>
      (filterCat === 'all' || m.categoryId === filterCat) &&
      (search === '' || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Menu"
        subtitle={`${s.menu.length} items in ${s.categories.length} categories`}
        actions={
          tab === 'items' ? (
            <button
              onClick={() => setEditItem({ ...emptyItem, categoryId: s.categories[0]?.id || '' })}
              className="btn-primary"
            >
              <Plus size={16} /> Add Item
            </button>
          ) : (
            <button onClick={() => setEditCat(emptyCat)} className="btn-primary">
              <Plus size={16} /> Add Category
            </button>
          )
        }
      />

      <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 inline-flex mb-4">
        {(['items', 'categories'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded capitalize ${tab === t ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'items' && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Search items..." />
            </div>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input max-w-xs">
              <option value="all">All Categories</option>
              {s.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">Item</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-center px-4 py-3">Available</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const cat = s.categories.find((c) => c.id === m.categoryId);
                  return (
                    <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{m.name}</div>
                        {m.description && <div className="text-xs text-slate-500">{m.description}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{cat?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge ${m.veg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {m.veg ? 'Veg' : 'Non-veg'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{fmtMoney(m.price, s.settings.currency)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => s.toggleAvailability(m.id)}
                          className={`relative w-10 h-5 rounded-full transition ${m.available ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${m.available ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setEditItem(m)} className="text-slate-500 hover:text-brand-600 mr-2">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${m.name}?`)) s.deleteMenuItem(m.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-400 py-8">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'categories' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {s.categories.map((c) => (
            <div key={c.id} className="card p-4 group relative">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white mb-3" style={{ background: c.color || '#f97316' }}>
                {c.name.charAt(0)}
              </div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-slate-500">{s.menu.filter((m) => m.categoryId === c.id).length} items</div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                <button onClick={() => setEditCat(c)} className="p-1 text-slate-500 hover:text-brand-600">
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${c.name} and all its items?`)) s.deleteCategory(c.id);
                  }}
                  className="p-1 text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title={editItem?.id ? 'Edit Item' : 'Add Item'}
        size="lg"
        footer={
          <>
            <button onClick={() => setEditItem(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => {
                if (editItem) s.upsertMenuItem({ ...editItem, id: editItem.id || newId() });
                setEditItem(null);
              }}
              className="btn-primary"
            >
              Save
            </button>
          </>
        }
      >
        {editItem && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Name</label>
              <input value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={editItem.categoryId} onChange={(e) => setEditItem({ ...editItem, categoryId: e.target.value })} className="input">
                {s.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Price ({s.settings.currency})</label>
              <input type="number" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) || 0 })} className="input" />
            </div>
            <div>
              <label className="label">Tax %</label>
              <input type="number" value={editItem.tax} onChange={(e) => setEditItem({ ...editItem, tax: parseFloat(e.target.value) || 0 })} className="input" />
            </div>
            <div>
              <label className="label">Type</label>
              <select value={editItem.veg ? 'veg' : 'non-veg'} onChange={(e) => setEditItem({ ...editItem, veg: e.target.value === 'veg' })} className="input">
                <option value="veg">Veg</option>
                <option value="non-veg">Non-veg</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="input min-h-[80px]" />
            </div>
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editItem.available} onChange={(e) => setEditItem({ ...editItem, available: e.target.checked })} />
              Available for sale
            </label>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editCat}
        onClose={() => setEditCat(null)}
        title={editCat?.id ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button onClick={() => setEditCat(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => {
                if (editCat) s.upsertCategory({ ...editCat, id: editCat.id || newId() });
                setEditCat(null);
              }}
              className="btn-primary"
            >
              Save
            </button>
          </>
        }
      >
        {editCat && (
          <div className="space-y-3">
            <div>
              <label className="label">Name</label>
              <input value={editCat.name} onChange={(e) => setEditCat({ ...editCat, name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Color</label>
              <input type="color" value={editCat.color || '#f97316'} onChange={(e) => setEditCat({ ...editCat, color: e.target.value })} className="input h-10" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
