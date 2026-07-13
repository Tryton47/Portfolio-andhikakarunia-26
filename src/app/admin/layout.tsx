'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, Award, Blocks, MessageSquare, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white font-sans text-sm animate-pulse">Loading Dashboard...</div>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderKanban size={18} /> },
    { name: 'Certificates', path: '/admin/certificates', icon: <Award size={18} /> },
    { name: 'Tech Stack', path: '/admin/tech', icon: <Blocks size={18} /> },
    { name: 'Comments', path: '/admin/comments', icon: <MessageSquare size={18} /> },
    { name: 'Profile Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen w-full bg-brand-dark flex flex-col md:flex-row font-sans text-white z-50 fixed inset-0">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-brand-border bg-brand-card flex flex-col pt-8 pb-4">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-bold text-white">A</div>
          <h2 className="text-lg font-bold text-white">Admin Panel</h2>
        </div>
        <nav className="flex-grow flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium text-sm ${
                pathname === item.path 
                  ? 'bg-brand-red text-white' 
                  : 'text-gray-400 hover:bg-brand-border hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="px-4 mt-auto">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth');
              router.push('/');
            }}
            className="w-full p-3 flex items-center gap-3 text-gray-400 hover:text-brand-red transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow bg-brand-dark p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar inside admin content */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-border">
            <h1 className="text-xl font-bold capitalize">
              {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
            </h1>
            <div className="text-sm text-gray-400">Welcome, <span className="font-bold text-white">Andhika</span></div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
