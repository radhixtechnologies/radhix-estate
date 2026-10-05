'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Calendar } from 'lucide-react';
import { useCMSStore } from '@/lib/cms-store';

export default function TermsPage() {
  const { cmsData } = useCMSStore();

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-pink-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-pink-400 mb-2">
        <ShieldCheck className="w-4 h-4" />
        <span>Platform Governance</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        {cmsData.terms.title}
      </h1>

      <div className="flex items-center gap-1 text-xs text-slate-400 mb-8">
        <Calendar className="w-3.5 h-3.5" />
        <span>Effective Date: {cmsData.terms.lastUpdated}</span>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-sm leading-relaxed whitespace-pre-line text-sm sm:text-base text-slate-700 dark:text-slate-300 font-sans">
        {cmsData.terms.content}
      </div>
    </div>
  );
}
