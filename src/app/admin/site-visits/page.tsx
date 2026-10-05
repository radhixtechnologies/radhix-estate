'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Star, 
  Phone, 
  Sparkles 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AdminSiteVisitsPage() {
  const { siteVisits, updateVisitStatus } = useAppStore();
  const [filter, setFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  const filteredVisits = siteVisits.filter((v) => {
    if (filter === 'ALL') return true;
    return v.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Site Visit Concierge & Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track accompanied property tours, client impressions, and advisor fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'SCHEDULED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visits List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisits.map((visit) => (
          <div
            key={visit.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  visit.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400'
                }`}>
                  {visit.status}
                </span>

                <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{visit.visit_time}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                {visit.lead?.name || 'Private VIP Client'}
              </h3>

              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{visit.property?.title}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Assigned Agent</span>
                <span>{visit.agent?.full_name || 'Vikram Malhotra'} ({visit.agent?.phone || '+91 98200 11223'})</span>
              </div>

              {visit.feedback && (
                <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-400 italic">
                  "{visit.feedback}"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">{visit.visit_date}</span>

              {visit.status === 'SCHEDULED' ? (
                <button
                  onClick={() => updateVisitStatus(visit.id, 'COMPLETED')}
                  className="px-3 py-1.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="font-bold">5.0 Client Rating</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
