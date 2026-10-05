'use client';

import React, { useState } from 'react';
import { Settings, Building2, Key, Shield, CheckCircle2, Save } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminSettingsPage() {
  const [agencyName, setAgencyName] = useState('Radhix Estates');
  const [email, setEmail] = useState('contact@radhix.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Tower 4, Prime Tech Park, Cyber City, Bangalore - 560103');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Agency Profile & Global Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Brand identity, integration keys, and tenant privileges.
        </p>
      </div>

      {/* Integration Status Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-500" />
          <span>Backend & Cloud Integration Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Supabase PostgreSQL</div>
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Connected (Live RLS)' : 'Local Offline Demo Store'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Resend Email Gateway</div>
            <div className="flex items-center gap-1.5 text-indigo-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mock / Pluggable</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Tenant License Tier</div>
            <div className="flex items-center gap-1.5 text-pink-500 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Enterprise Unlimited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 text-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Agency Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Support Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {saved ? (
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Agency settings saved successfully!</span>
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
