import { useState } from 'react';
import { Plus, Trash2, RefreshCw, Save } from 'lucide-react';
import { useStore, newId } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import type { Outlet } from '../types';

export default function SettingsPage() {
  const s = useStore();
  const [draft, setDraft] = useState(s.settings);

  const save = () => {
    s.updateSettings(draft);
    alert('Settings saved!');
  };

  const addOutlet = () => {
    const o: Outlet = { id: newId(), name: 'New Outlet', address: '', phone: '' };
    setDraft({ ...draft, outlets: [...draft.outlets, o] });
  };

  const updateOutlet = (id: string, patch: Partial<Outlet>) => {
    setDraft({
      ...draft,
      outlets: draft.outlets.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  };

  const removeOutlet = (id: string) => {
    if (draft.outlets.length <= 1) return alert('At least one outlet required');
    setDraft({ ...draft, outlets: draft.outlets.filter((o) => o.id !== id) });
  };

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title="Settings"
        subtitle="Restaurant configuration"
        actions={
          <>
            <button
              onClick={() => {
                if (confirm('Reset all data to demo values? This cannot be undone.')) {
                  s.resetDemoData();
                  setDraft(s.settings);
                }
              }}
              className="btn-secondary"
            >
              <RefreshCw size={16} /> Reset Demo Data
            </button>
            <button onClick={save} className="btn-primary">
              <Save size={16} /> Save Settings
            </button>
          </>
        }
      />

      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Restaurant Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Restaurant Name</label>
              <input value={draft.restaurantName} onChange={(e) => setDraft({ ...draft, restaurantName: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Currency Symbol</label>
              <input value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Invoice Prefix</label>
              <input value={draft.invoicePrefix} onChange={(e) => setDraft({ ...draft, invoicePrefix: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Footer Note</label>
              <input value={draft.footerNote} onChange={(e) => setDraft({ ...draft, footerNote: e.target.value })} className="input" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Tax & Charges</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Tax Label</label>
              <input value={draft.taxLabel} onChange={(e) => setDraft({ ...draft, taxLabel: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Default Tax %</label>
              <input type="number" value={draft.defaultTax} onChange={(e) => setDraft({ ...draft, defaultTax: parseFloat(e.target.value) || 0 })} className="input" />
            </div>
            <div>
              <label className="label">Service Charge %</label>
              <input type="number" value={draft.serviceCharge} onChange={(e) => setDraft({ ...draft, serviceCharge: parseFloat(e.target.value) || 0 })} className="input" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Loyalty & Printer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Loyalty Earn %</label>
              <input type="number" value={draft.loyaltyPercent} onChange={(e) => setDraft({ ...draft, loyaltyPercent: parseFloat(e.target.value) || 0 })} className="input" />
              <div className="text-xs text-slate-500 mt-1">% of total earned as loyalty points</div>
            </div>
            <div>
              <label className="label">Printer Width (mm)</label>
              <select value={draft.printerWidth} onChange={(e) => setDraft({ ...draft, printerWidth: parseInt(e.target.value) })} className="input">
                <option value={58}>58 mm</option>
                <option value={80}>80 mm</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Outlets</h2>
            <button onClick={addOutlet} className="btn-secondary text-xs">
              <Plus size={14} /> Add Outlet
            </button>
          </div>
          <div className="space-y-3">
            {draft.outlets.map((o) => (
              <div key={o.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3">
                  <label className="label">Name</label>
                  <input value={o.name} onChange={(e) => updateOutlet(o.id, { name: e.target.value })} className="input" />
                </div>
                <div className="col-span-4">
                  <label className="label">Address</label>
                  <input value={o.address} onChange={(e) => updateOutlet(o.id, { address: e.target.value })} className="input" />
                </div>
                <div className="col-span-2">
                  <label className="label">Phone</label>
                  <input value={o.phone} onChange={(e) => updateOutlet(o.id, { phone: e.target.value })} className="input" />
                </div>
                <div className="col-span-2">
                  <label className="label">GSTIN</label>
                  <input value={o.gstin || ''} onChange={(e) => updateOutlet(o.id, { gstin: e.target.value })} className="input" />
                </div>
                <button onClick={() => removeOutlet(o.id)} className="text-red-500 p-2">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
