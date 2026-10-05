'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/constants';

const LEADS_DATA = [
  { month: 'May', leads: 24, visits: 8 },
  { month: 'Jun', leads: 38, visits: 14 },
  { month: 'Jul', leads: 45, visits: 19 },
  { month: 'Aug', leads: 62, visits: 25 },
  { month: 'Sep', leads: 78, visits: 31 },
  { month: 'Oct', leads: 94, visits: 42 },
];

const CITY_DISTRIBUTION = [
  { city: 'Mumbai', listings: 6, value: 45 },
  { city: 'Bangalore', listings: 5, value: 38 },
  { city: 'Delhi NCR', listings: 4, value: 42 },
  { city: 'Hyderabad', listings: 5, value: 35 },
  { city: 'Pune', listings: 4, value: 20 },
];

export default function AdminDashboardPage() {
  const { properties, leads, siteVisits } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalListings = properties.length;
  const availableListings = properties.filter((p) => p.status === 'AVAILABLE').length;
  const soldRentedListings = properties.filter((p) => p.status === 'SOLD' || p.status === 'RENTED').length;
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;
  const scheduledVisitsCount = siteVisits.filter((v) => v.status === 'SCHEDULED').length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Agency Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time pipeline monitoring, site visit fulfillment, and acquisition metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors"
          >
            <span>Open CRM Kanban</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Portfolio</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-pink-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {totalListings}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="text-emerald-500 font-bold">{availableListings} Available</span>
            <span>•</span>
            <span>{soldRentedListings} Under Contract</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Leads</span>
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {leads.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="text-pink-500 font-bold">+{newLeadsCount} New Today</span>
            <span>•</span>
            <span>98% Response Rate</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Tours</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {scheduledVisitsCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Across 5 metro centers this week
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projected Commission</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
            ₹4.85 Cr
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            2.0% standard advisory fee pipeline
          </div>
        </div>
      </div>

      {/* Charts Row */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leads & Visits Area Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Lead Generation & Viewing Trends
                </h3>
                <p className="text-xs text-slate-400">Monthly conversion velocity</p>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full">
                +28% MoM
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={LEADS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#leadsGradient)" name="Leads" />
                  <Area type="monotone" dataKey="visits" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#visitsGradient)" name="Tours" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City Distribution Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Portfolio Value by Metro Region
                </h3>
                <p className="text-xs text-slate-400">Total asset value in ₹ Crores</p>
              </div>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full">
                5 Metros
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CITY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="city" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} name="Value (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tables: Recent CRM Leads & Today's Scheduled Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Recent Leads & Direct Inquiries
            </h3>
            <Link href="/admin/leads" className="text-xs font-bold text-indigo-600 dark:text-pink-400 hover:underline">
              View All ({leads.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Client Name</th>
                  <th className="pb-3 font-semibold">Interested Property</th>
                  <th className="pb-3 font-semibold">Assigned Agent</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div>{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{lead.phone}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {lead.property?.title || 'General Consultation'}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {lead.agent?.full_name || 'Unassigned'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.status === 'NEW'
                          ? 'bg-pink-50 text-pink-600 dark:bg-pink-950/80 dark:text-pink-400'
                          : lead.status === 'CLOSED_WON'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                          : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Scheduled Visits */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Upcoming Viewing Tours
              </h3>
              <Link href="/admin/site-visits" className="text-xs font-bold text-indigo-600 dark:text-pink-400 hover:underline">
                Calendar →
              </Link>
            </div>

            <div className="space-y-3">
              {siteVisits.slice(0, 4).map((visit) => (
                <div key={visit.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                    <span className="truncate">{visit.lead?.name || 'Private VIP Client'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-pink-400 font-extrabold">
                      {visit.visit_time}
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 truncate mb-1">
                    {visit.property?.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Date: {visit.visit_date}</span>
                    <span className="font-bold text-indigo-500">Agent: {visit.agent?.full_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/site-visits"
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold text-center block transition-colors"
          >
            Manage All {siteVisits.length} Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}
