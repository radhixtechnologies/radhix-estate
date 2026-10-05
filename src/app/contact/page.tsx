'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Clock, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useCMSStore } from '@/lib/cms-store';

export default function ContactPage() {
  const { addLead } = useAppStore();
  const { cmsData } = useCMSStore();
  const cs = cmsData.customerService;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      phone,
      email,
      message: `[${subject}] ${message}`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-pink-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Priority Advisory</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Speak With Our Real Estate Concierge
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          Whether you are looking to acquire a penthouse, lease commercial headquarters, or schedule an architectural walkthrough, our team responds quickly.
        </p>
        <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
          ⚡ {cs.responseSLA}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Stack (Driven by CMS) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-pink-400 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Direct Telephone</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{cs.operatingHours}</p>
            <a href={`tel:${cs.phone}`} className="text-sm font-extrabold text-indigo-600 dark:text-pink-400 hover:underline">
              {cs.phone}
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Corporate Inquiries</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Institutional portfolios & partnership.</p>
            <a href={`mailto:${cs.email}`} className="text-sm font-extrabold text-indigo-600 dark:text-pink-400 hover:underline">
              {cs.email}
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Corporate Headquarters</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {cs.address}
            </p>
          </div>
        </div>

        {/* Form Box */}
        <div className="lg:col-span-2 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request an Expert Callback</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
            Complete this brief form to log your enquiry directly into our real-time CRM.
          </p>

          {submitted ? (
            <div className="py-12 text-center bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                Enquiry Dispatched Directly to CRM!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 max-w-md mx-auto">
                Your enquiry is now visible live inside the Radhix Estates Admin Panel. Our advisor will dial your number shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="vikram@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Inquiry Intent
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Buy Luxury Residential">Buy Luxury Residential</option>
                    <option value="Rent High-End Estate">Rent High-End Estate</option>
                    <option value="Commercial Lease">Corporate Commercial Lease</option>
                    <option value="List My Property">List My Prime Property</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Message / Criteria
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail your preferred city, square footage, budget, or architectural expectations..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 shadow-md shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Callback Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
