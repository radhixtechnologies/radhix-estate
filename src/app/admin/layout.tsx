'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell, 
  RotateCcw, 
  Sparkles, 
  Menu, 
  ExternalLink, 
  Shield, 
  UserCheck, 
  Check,
  FileCode2,
  Headphones
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AGENTS } from '@/lib/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentRole, setCurrentRole, resetDemoData, notifications } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Properties', href: '/admin/properties', icon: Home },
    { label: 'Leads CRM', href: '/admin/leads', icon: Users },
    { label: 'Site Visits', href: '/admin/site-visits', icon: Calendar },
    { label: 'Agents', href: '/admin/agents', icon: UserCheck },
    { label: 'CMS & Policies', href: '/admin/cms', icon: FileCode2 },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReset = () => {
    resetDemoData();
    triggerToast('Demo sandbox reset to factory state!');
  };

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070b16] text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 z-40 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Radhix <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Admin CRM</span>
              </span>
              <span className="hidden md:block text-[10px] text-slate-400 font-medium">
                Agency Intelligence & Portfolio Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset sandbox data to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>

          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-pink-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{currentRole.role.replace('_', ' ')}</span>
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                <span className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1.5 block">
                  Switch Active Role
                </span>
                {AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setCurrentRole(agent);
                      setRoleDropdownOpen(false);
                      triggerToast(`Switched session to ${agent.full_name}`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      currentRole.id === agent.id ? 'font-bold text-indigo-600 dark:text-pink-400 bg-indigo-50/50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{agent.full_name}</div>
                      <div className="text-[10px] text-slate-400">{agent.role.replace('_', ' ')}</div>
                    </div>
                    {currentRole.id === agent.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Realtime CRM Alerts</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-500 font-bold">
                    {unreadNotifs.length} New
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Back to Public Site */}
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold transition-colors"
            title="Open Public Website"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Collapsible Sidebar */}
        <aside
          className={`shrink-0 z-30 w-64 bg-white dark:bg-[#0B1020] border-r border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between transition-all duration-300 min-h-[calc(100vh-4rem)] ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Agency CRM Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile Mini Card in Sidebar */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
            <img
              src={currentRole.avatar_url}
              alt={currentRole.full_name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentRole.full_name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {currentRole.email}
              </div>
            </div>
          </div>
        </aside>

        {/* Spacious Content Body */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
