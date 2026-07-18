'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link: string | null;
};

export default function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ title: '', issuer: '', date: '', link: '' });

  useEffect(() => {
    fetch('/api/certificates').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setCerts(d); }).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', issuer: '', date: '', link: '' }); setIsModalOpen(true); };
  const openEdit = (c: Certificate) => { setEditing(c); setForm({ title: c.title, issuer: c.issuer, date: c.date, link: c.link || '' }); setIsModalOpen(true); };

  const handleSave = async () => {
    if (editing) {
      const res = await fetch(`/api/certificates/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { const u = await res.json(); setCerts(certs.map((c) => (c.id === u.id ? u : c))); }
    } else {
      const res = await fetch('/api/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { const c = await res.json(); setCerts([c, ...certs]); }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
    if (res.ok) setCerts(certs.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-text-primary text-lg font-bold mb-1">Certificates</h2>
          <p className="text-text-dim text-xs">Manage your professional credentials.</p>
        </div>
        <button onClick={openCreate} className="bg-neon-red text-white px-4 py-2.5 rounded-lg text-system flex items-center gap-2 hover:bg-[#e0243b] transition-colors shadow-[0_0_12px_rgba(255,42,67,0.2)]">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      <div className="glass-panel border border-border rounded-xl overflow-hidden">
        {certs.length === 0 ? (
          <div className="p-12 text-center"><p className="text-text-dim text-sm">No certificates found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-charcoal">
                <th className="text-system text-text-dim text-left px-5 py-3 text-[10px]">Title</th>
                <th className="text-system text-text-dim text-left px-5 py-3 text-[10px]">Issuer</th>
                <th className="text-system text-text-dim text-left px-5 py-3 text-[10px]">Date</th>
                <th className="text-system text-text-dim text-right px-5 py-3 text-[10px]">Actions</th>
              </tr></thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-card/50 transition-colors">
                    <td className="px-5 py-4 text-text-primary font-medium">{c.title}</td>
                    <td className="px-5 py-4 text-text-muted">{c.issuer}</td>
                    <td className="px-5 py-4"><span className="text-system text-neon-cyan text-[10px]">{c.date}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-2 border border-border rounded-lg text-text-dim hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 border border-border rounded-lg text-text-dim hover:text-neon-red hover:border-neon-red/30 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel border border-border rounded-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-text-primary text-sm font-bold">{editing ? 'Edit Certificate' : 'Add Certificate'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-dim hover:text-neon-red"><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50" placeholder="Certificate title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-system text-text-dim">Issuer</label>
                  <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50" placeholder="e.g. Dicoding" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-system text-text-dim">Year</label>
                  <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50" placeholder="2025" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Link (Optional)</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50" placeholder="https://..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-text-muted text-sm hover:text-text-primary">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-neon-red text-white rounded-lg text-system hover:bg-[#e0243b]">{editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
