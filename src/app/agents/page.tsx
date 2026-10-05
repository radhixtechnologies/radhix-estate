'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Mail, 
  Star, 
  Award, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { AGENTS, FEATURED_PROPERTIES } from '@/lib/constants';
import { useAppStore } from '@/lib/store';
import { Profile } from '@/types';

export default function PublicAgentsPage() {
  const { addLead } = useAppStore();
  const [selectedAgent, setSelectedAgent] = useState<Profile | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedAgent) return;

    addLead({
      name: clientName,
      phone: clientPhone,
      message: `Requested personal luxury consultation with ${selectedAgent.full_name}: ${message}`,
      assigned_to: selectedAgent.id,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedAgent(null);
      setClientName('');
      setClientPhone('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-pink-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Private Client Advisory</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Meet Our Senior Real Estate Advisors
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
          Behind every distinguished acquisition is a dedicated luxury specialist. Our advisors provide discreet, confidential representation and accompanied private inspections.
        </p>
      </div>

      {/* Agents Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="group rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 p-6 flex flex-col justify-between"
          >
            <div>
              {/* Agent Photo */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                <img
                  src={agent.avatar_url}
                  alt={agent.full_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Licensed</span>
                </div>
              </div>

              {/* Name & Title */}
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-pink-400 transition-colors">
                {agent.full_name}
              </h3>

              <div className="text-xs font-bold text-indigo-600 dark:text-pink-400 uppercase tracking-wider mt-0.5 mb-3">
                {agent.role.replace('_', ' ')}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {agent.bio}
              </p>

              {/* Stats */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Exclusive Listings</span>
                  <span className="font-bold text-slate-900 dark:text-white">{agent.active_listings_count} Properties</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Deals Closed</span>
                  <span className="font-bold text-emerald-500">{agent.deals_closed_count} Completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rating</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>5.0 (40+ Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 mt-4">
              <a
                href={`tel:${agent.phone}`}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(agent.full_name)},%20I%20would%20like%20to%20inquire%20about%20luxury%20properties.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedAgent(agent)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Book Consultation"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Standards Bento */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-900/10 via-slate-900/5 to-transparent dark:from-indigo-950/40 dark:via-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 mb-16">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-pink-400">
            White-Glove Promise
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Why Our Clients Trust Radhix Advisors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">100% Confidentiality</h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              High-net-worth acquisitions are managed under strict NDA agreements with private viewing appointments and zero public disclosure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Direct Builder & Owner Access</h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Our partners bypass multi-level sub-brokers to negotiate directly with principal developers and ultra-HNW estate owners.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">End-to-End Legal Conveyance</h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              From stamp duty calculations to registration at the sub-registrar office, our in-house legal counsel handles all paperwork.
            </p>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <img
                src={selectedAgent.avatar_url}
                alt={selectedAgent.full_name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Consultation with {selectedAgent.full_name}
                </h4>
                <p className="text-xs text-indigo-600 dark:text-pink-400 font-semibold">
                  {selectedAgent.role.replace('_', ' ')}
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="py-6 text-center text-emerald-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Appointment Logged to Advisor's CRM!
                </div>
                <p className="text-xs text-slate-400">
                  {selectedAgent.full_name} will dial your number shortly to coordinate your private viewing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Specific Property or Interest</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Worli Penthouse viewing or Indiranagar villa requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAgent(null)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Confirm Consultation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
