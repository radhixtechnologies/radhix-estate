'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  MessageCircle, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Building2, 
  UserCheck, 
  Kanban, 
  Table as TableIcon,
  X,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { LeadStatus, Lead } from '@/types';
import { AGENTS } from '@/lib/constants';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'NEW', label: 'New Inquiries', color: 'bg-pink-500' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-indigo-500' },
  { id: 'VISIT_SCHEDULED', label: 'Visit Scheduled', color: 'bg-purple-500' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'CLOSED_WON', label: 'Closed Won', color: 'bg-emerald-500' },
  { id: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-slate-500' },
];

export default function AdminLeadsPage() {
  const { leads, updateLeadStatus, addLead, properties } = useAppStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [message, setMessage] = useState('');

  const filteredLeads = leads.filter((l) => {
    if (searchTerm && !l.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.phone.includes(searchTerm)) {
      return false;
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      phone,
      email,
      property_id: propertyId,
      message,
    });

    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client CRM & Deal Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual stage progression, agent dispatching, and rapid communication actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center">
            <button
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                view === 'kanban' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-pink-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                view === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-pink-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by client name, mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          {filteredLeads.length} Total Leads
        </span>
      </div>

      {/* Kanban Board View */}
      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-slate-100/70 dark:bg-[#090e1d]/70 rounded-3xl p-4 border border-slate-200/60 dark:border-slate-800/80 flex flex-col min-w-[260px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{stage.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 font-extrabold text-slate-600 dark:text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards in this Stage */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#0e162c] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {lead.property && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                          {lead.property.title}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                        <span className="text-slate-400 font-medium">{lead.source}</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600"
                            title="Call Client"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-500"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-slate-400">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-6">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Interested Property</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Assigned Advisor</th>
                  <th className="py-3 px-6 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                      {lead.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div>{lead.phone}</div>
                      <div className="text-[10px] text-slate-400">{lead.email || 'No email provided'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {lead.property?.title || 'General Property Inquiry'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {lead.agent?.full_name || 'Vikram Malhotra'}
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600 inline-block"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 inline-block"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Slide-over / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-pink-400">
                  Lead Profile Dossier
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedLead.name}
                </h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-indigo-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedLead.email || 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Interested Property</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedLead.property?.title || 'General Inquiry'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Client Requirements / Message</span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedLead.message || 'No additional note provided.'}
                </div>
              </div>

              {/* Advance Stage Selector */}
              <div>
                <span className="text-slate-400 font-bold block mb-2 uppercase tracking-wider">
                  Update Deal Stage
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {STAGES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        updateLeadStatus(selectedLead.id, st.id);
                        setSelectedLead({ ...selectedLead, status: st.id });
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-colors ${
                        selectedLead.status === st.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record New Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Panday"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Interested Property</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Budget, timing, specific requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Add to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
