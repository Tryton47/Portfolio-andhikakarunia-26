import { FolderKanban, Award, Blocks, MessageSquare, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="font-sans text-sm text-gray-400 mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-white">8</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <FolderKanban size={24} />
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="font-sans text-sm text-gray-400 mb-1">Certificates</p>
            <p className="text-3xl font-bold text-white">7</p>
          </div>
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
            <Award size={24} />
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="font-sans text-sm text-gray-400 mb-1">Tech Stack</p>
            <p className="text-3xl font-bold text-white">24</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center">
            <Blocks size={24} />
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="font-sans text-sm text-gray-400 mb-1">Comments</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-brand-border bg-brand-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
            <Activity className="text-brand-red" size={20} />
            <h3 className="font-sans font-bold text-white">Recent Activity Log</h3>
          </div>
          <ul className="space-y-4 font-sans text-sm text-gray-400">
            <li className="flex gap-4">
              <span className="text-brand-red font-mono">10:45 AM</span>
              <span>Login successful from authorized node.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-brand-red font-mono">10:42 AM</span>
              <span>Database connection established.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-brand-red font-mono">09:15 AM</span>
              <span>System diagnostics passed.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
