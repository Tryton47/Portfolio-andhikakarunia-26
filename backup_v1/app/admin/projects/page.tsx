'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  tech: string;
  link: string | null;
  github: string | null;
  category: string;
  imageUrl: string | null;
};

const categories = ['Web Dev', 'Data Analysis', 'Graphic Design', 'Video Editing'];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tech: '',
    link: '',
    github: '',
    category: categories[0],
  });
  const [techTags, setTechTags] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // Fetch projects
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProjects(data); })
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditingProject(null);
    setForm({ title: '', description: '', tech: '', link: '', github: '', category: categories[0] });
    setTechTags([]);
    setIsModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    const tags = p.tech ? p.tech.split(',').map((t) => t.trim()) : [];
    setForm({
      title: p.title,
      description: p.description,
      tech: p.tech,
      link: p.link || '',
      github: p.github || '',
      category: p.category,
    });
    setTechTags(tags);
    setIsModalOpen(true);
  };

  const addTechTag = () => {
    if (techInput.trim() && !techTags.includes(techInput.trim())) {
      setTechTags([...techTags, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechTag = (tag: string) => {
    setTechTags(techTags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      tech: techTags.join(', '),
    };

    if (editingProject) {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      }
    } else {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setProjects([created, ...projects]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-text-primary text-lg font-bold mb-1">
            Projects Management
          </h2>
          <p className="text-text-dim text-xs">
            Add, edit, or remove portfolio projects.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-neon-red text-white px-4 py-2.5 rounded-lg text-system flex items-center gap-2 hover:bg-[#e0243b] transition-colors shadow-[0_0_12px_rgba(255,42,67,0.2)]"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel border border-border rounded-xl overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-text-dim text-sm">
              No projects found. Click "Add Project" to create one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-charcoal">
                  <th className="text-system text-text-dim text-left px-5 py-3 text-[10px]">Title</th>
                  <th className="text-system text-text-dim text-left px-5 py-3 text-[10px]">Category</th>
                  <th className="text-system text-text-dim text-left px-5 py-3 text-[10px]">Tech</th>
                  <th className="text-system text-text-dim text-right px-5 py-3 text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-card/50 transition-colors">
                    <td className="px-5 py-4 text-text-primary font-medium">{p.title}</td>
                    <td className="px-5 py-4">
                      <span className="text-system text-neon-cyan text-[10px]">{p.category}</span>
                    </td>
                    <td className="px-5 py-4 text-text-muted text-xs max-w-[200px] truncate">{p.tech}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 border border-border rounded-lg text-text-dim hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 border border-border rounded-lg text-text-dim hover:text-neon-red hover:border-neon-red/30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel border border-border rounded-xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-text-primary text-sm font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-dim hover:text-neon-red transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Project Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
                  placeholder="e.g. E-Commerce Recommendation Engine"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Description *</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50 resize-none"
                  placeholder="Project background and description..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-system text-text-dim">Live Demo URL</label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-system text-text-dim">GitHub URL</label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Dynamic Tech Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-system text-text-dim">Technologies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTechTag(); } }}
                    className="flex-grow bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
                    placeholder="Type & press + or Enter"
                  />
                  <button
                    type="button"
                    onClick={addTechTag}
                    className="px-4 bg-neon-red text-white rounded-lg text-system hover:bg-[#e0243b] transition-colors"
                  >
                    +
                  </button>
                </div>
                {techTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-system text-text-muted text-[10px]"
                      >
                        {tag}
                        <button onClick={() => removeTechTag(tag)} className="text-text-dim hover:text-neon-red">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-text-muted text-sm hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-neon-red text-white rounded-lg text-system hover:bg-[#e0243b] transition-colors"
              >
                {editingProject ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
