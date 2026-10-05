'use client';

import React from 'react';
import { UserCheck, Phone, Mail, Award, Building2, Plus, Star } from 'lucide-react';
import { AGENTS } from '@/lib/constants';

export default function AdminAgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Agency Staff & Senior Advisors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage real estate advisors, assigned listings quotas, and closed transaction commissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={agent.avatar_url}
                  alt={agent.full_name}
                  className="w-full h-full object-cover rounded-2xl border-2 border-indigo-500/20"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full">
                  <UserCheck className="w-3 h-3" />
                </span>
              </div>

              <div className="text-center mb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {agent.full_name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-pink-400">
                  {agent.role.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center mb-4 line-clamp-2">
                {agent.bio}
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Listings</span>
                  <span className="font-bold text-slate-900 dark:text-white">{agent.active_listings_count} Properties</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Deals Closed</span>
                  <span className="font-bold text-emerald-500">{agent.deals_closed_count} Finished</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-3">
              <a
                href={`tel:${agent.phone}`}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                title="Call Advisor"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                title="Email Advisor"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
