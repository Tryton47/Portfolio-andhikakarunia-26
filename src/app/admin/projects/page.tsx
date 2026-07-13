'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Projects Management</h2>
          <p className="font-sans text-sm text-gray-400">Add, edit, or remove portfolio projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-red text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-red-600 transition-colors"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <p className="text-gray-400 text-sm text-center py-10">
          Project list goes here. Connect to Prisma DB to fetch data.
        </p>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-brand-border flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Project Title *</label>
                <input type="text" className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-red" placeholder="e.g. E-Commerce App" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Description *</label>
                <textarea rows={3} className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-red resize-none" placeholder="Project details..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Live Demo URL</label>
                  <input type="url" className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-red" placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">GitHub URL</label>
                  <input type="url" className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-red" placeholder="https://github.com/..." />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Tech Stack (comma separated)</label>
                <input type="text" className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-red" placeholder="React, Node.js, Tailwind" />
              </div>
            </div>

            <div className="p-6 border-t border-brand-border flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
