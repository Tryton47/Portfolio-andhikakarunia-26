'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

type TechItem = { id: string; name: string; category: string; icon: string };
const categories = ['Web', 'Data', 'Design', 'Video'];

export default function AdminTechStack() {
  const [items, setItems] = useState<TechItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: categories[0], icon: '' });

  useEffect(() => {
    fetch('/api/techstack').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setItems(d); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    const res = await fetch('/api/techstack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setItems([...items, created]);
      setForm({ name: '', category: categories[0], icon: '' });
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this tech item?')) return;
    const res = await fetch(`/api/techstack/${id}`, { method: 'DELETE' });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-text-primary text-lg font-bold mb-1">Tech Stack</h2>
          <p className="text-text-dim text-xs">Manage your technical skills and tools.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-neon-red text-white px-4 py-2.5 rounded-lg text-system flex items-center gap-2 hover:bg-[#e0243b] transition-colors shadow-[0_0_12px_rgba(255,42,67,0.2)]">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Grouped Display */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-system text-neon-red mb-4">
                {cat === 'Web' ? 'Web Development' : cat === 'Data' ? 'Data Analytics' : cat === 'Design' ? 'Graphic Design' : 'Video Editing'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 px-4 py-2 glass-panel border border-border rounded-lg group hover:border-neon-red/30 transition-colors">
                    <span className="text-text-muted text-sm">{item.name}</span>
                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-neon-red transition-all">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="glass-panel border border-border rounded-xl p-12 text-center">
            <p className="text-text-dim text-sm">No tech stack items yet. Click &quot;Add Skill&quot; to begin.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel border border-border rounded-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-text-primary text-sm font-bold">Add Skill</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-dim hover:text-neon-red"><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Skill Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50" placeholder="e.g. React" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50">
                  {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-text-muted text-sm hover:text-text-primary">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-neon-red text-white rounded-lg text-system hover:bg-[#e0243b]">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
