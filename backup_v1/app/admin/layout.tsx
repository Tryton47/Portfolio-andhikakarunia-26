'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Blocks,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { name: 'Certificates', path: '/admin/certificates', icon: Award },
  { name: 'Tech Stack', path: '/admin/tech', icon: Blocks },
  { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
  { name: 'Profile', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <span className="text-system text-neon-red animate-pulse">
          Verifying Session...
        </span>
      </div>
    );
  }

  const currentTitle =
    navItems.find((n) => n.path === pathname)?.name || 'Admin';

  return (
    <div className="min-h-screen w-full bg-obsidian flex fixed inset-0 z-[90]">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-[100] w-64 bg-charcoal border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 bg-neon-red rounded-lg flex items-center justify-center text-heading text-xs text-white">
            A
          </div>
          <div>
            <h2 className="text-text-primary text-sm font-bold">Admin Panel</h2>
            <p className="text-system text-text-dim text-[9px]">
              Secure Gateway
            </p>
          </div>
          {/* Close on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden ml-auto text-text-dim hover:text-neon-red"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-grow flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-red text-white shadow-[0_0_12px_rgba(255,42,67,0.25)]'
                    : 'text-text-muted hover:bg-card hover:text-text-primary'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={() => {
              localStorage.removeItem('admin_auth');
              router.push('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-dim hover:text-neon-red transition-colors text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="w-full px-6 py-4 border-b border-border bg-charcoal flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-text-muted hover:text-neon-red"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-heading text-sm text-text-primary">
              {currentTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 pulse-neon" />
            <span className="text-system text-text-dim text-[10px]">
              Welcome, <span className="text-text-primary">Andhika</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-obsidian/60 z-[95] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
