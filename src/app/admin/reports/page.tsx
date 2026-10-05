'use client';

import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Award, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AGENTS } from '@/lib/constants';

export default function AdminReportsPage() {
  const { leads, properties } = useAppStore();
  const [downloaded, setDownloaded] = useState(false);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Client Name,Phone,Email,Property,Status,Source\n' +
      leads.map((l) => `${l.id},"${l.name}","${l.phone}","${l.email || ''}","${l.property?.title || ''}",${l.status},${l.source}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `radhix_crm_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const sources = [
    { name: 'Website Direct Portal', count: leads.filter((l) => l.source === 'WEBSITE').length, percentage: '45%' },
    { name: 'WhatsApp Concierge', count: leads.filter((l) => l.source === 'WHATSAPP').length, percentage: '22%' },
    { name: 'Digital Campaigns & Adverts', count: leads.filter((l) => l.source === 'CAMPAIGN').length, percentage: '18%' },
    { name: 'VIP Client Referrals', count: leads.filter((l) => l.source === 'REFERRAL').length, percentage: '15%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Executive Analytics & Export Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conversion funnel analysis, sourcing channel attribution, and data export.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {downloaded ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
          <span>{downloaded ? 'CSV Exported!' : 'Export CRM Leads (CSV)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            Lead Generation Channel Breakdown
          </h3>

          <div className="space-y-4">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="text-indigo-600 dark:text-pink-400">{s.count} Leads ({s.percentage})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                    style={{ width: s.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor Leaderboard */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            Senior Advisor Conversion Leaderboard
          </h3>

          <div className="space-y-3">
            {AGENTS.map((agent, idx) => (
              <div
                key={agent.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 font-extrabold text-indigo-600 dark:text-pink-400 flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{agent.full_name}</div>
                    <div className="text-[10px] text-slate-400">{agent.role.replace('_', ' ')}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-emerald-500">{agent.deals_closed_count} Closures</div>
                  <div className="text-[10px] text-slate-400">96% Satisfaction</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
