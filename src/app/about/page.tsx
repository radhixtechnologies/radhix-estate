'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Award, Users, Sparkles, ArrowRight } from 'lucide-react';
import { AGENTS } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-pink-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Radhix Vision</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Redefining Elite Real Estate Technology
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
          Radhix Estates is the flagship luxury realty division of <strong className="text-slate-900 dark:text-white">RADHIX TECHNOLOGIES</strong>. We blend architectural discernment with modern institutional software to make property discovery and acquisition effortless.
        </p>
      </div>

      {/* Pillars Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-pink-400 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Institutional Verification</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every listing passes a rigorous multi-tier title deed search, municipal planning approval audit, and structural integrity rating before public display.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Architectural Curation</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We focus exclusively on top-tier residences: duplexes, signature penthouses, modernist villas, and Grade-A tech park corporate suites.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dedicated Advisors</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            No impersonal call centers. Every client is assigned a designated luxury property specialist who accompanies all site inspections.
          </p>
        </div>
      </div>

      {/* Leadership & Agents */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Senior Advisory Board</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Seasoned real estate investment veterans with over ₹1,500+ Cr in lifetime closed transactional value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <div key={agent.id} className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80 text-center">
              <img
                src={agent.avatar_url}
                alt={agent.full_name}
                className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-2 border-indigo-500/30"
              />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">{agent.full_name}</h4>
              <p className="text-xs text-indigo-600 dark:text-pink-400 font-semibold mb-3">{agent.role.replace('_', ' ')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{agent.bio}</p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {agent.deals_closed_count} Completed Acquisitions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Engineered by Radhix Technologies</h3>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
          Interested in deploying a white-labeled real estate CRM and property portal for your enterprise agency?
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:scale-[1.02] transition-all"
        >
          <span>Explore Agency Admin Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
