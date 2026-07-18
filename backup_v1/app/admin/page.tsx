'use client';

import Link from 'next/link';
import {
  FolderKanban,
  Award,
  Blocks,
  MessageSquare,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Projects',
    value: 8,
    icon: FolderKanban,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    link: '/admin/projects',
  },
  {
    label: 'Certificates',
    value: 7,
    icon: Award,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    link: '/admin/certificates',
  },
  {
    label: 'Tech Stack',
    value: 24,
    icon: Blocks,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    link: '/admin/tech',
  },
  {
    label: 'Comments',
    value: 0,
    icon: MessageSquare,
    color: 'text-neon-red',
    bg: 'bg-neon-red-dim',
    link: '/admin/comments',
  },
];

const activityLog = [
  { time: '10:45', text: 'Login successful from authorized node.' },
  { time: '10:42', text: 'Database connection established (dev.db).' },
  { time: '10:38', text: 'GET /api/projects — 200 OK' },
  { time: '09:15', text: 'System diagnostics passed.' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.link}
              className="glass-panel border border-border rounded-xl p-5 flex items-center justify-between hover:border-neon-red/30 transition-colors group"
            >
              <div>
                <p className="text-text-dim text-xs mb-1">{s.label}</p>
                <p className="text-text-primary text-2xl font-bold font-mono">
                  {s.value}
                </p>
              </div>
              <div
                className={`w-11 h-11 ${s.bg} ${s.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Log */}
        <div className="glass-panel border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Activity className="text-neon-red" size={16} />
            <h3 className="text-text-primary text-sm font-bold">
              Recent Activity
            </h3>
          </div>
          <ul className="p-5 space-y-4">
            {activityLog.map((log, i) => (
              <li key={i} className="flex gap-4 text-xs">
                <span className="text-neon-red font-mono w-12 shrink-0">
                  {log.time}
                </span>
                <span className="text-text-muted">{log.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel border border-border rounded-xl p-5 flex flex-col gap-4">
          <h3 className="text-text-primary text-sm font-bold mb-2">
            Quick Actions
          </h3>
          {[
            { label: 'Manage Projects', href: '/admin/projects' },
            { label: 'Manage Certificates', href: '/admin/certificates' },
            { label: 'Moderate Comments', href: '/admin/comments' },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-neon-red/30 hover:bg-card transition-colors text-text-muted text-sm group"
            >
              {a.label}
              <ArrowUpRight
                size={14}
                className="group-hover:text-neon-red transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
