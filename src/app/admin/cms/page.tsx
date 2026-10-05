'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Headphones, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useCMSStore, CustomerServiceInfo } from '@/lib/cms-store';

export default function AdminCMSPage() {
  const { cmsData, updateTerms, updatePrivacy, updateCustomerService, resetCMS } = useCMSStore();
  const [activeTab, setActiveTab] = useState<'service' | 'terms' | 'privacy'>('service');
  const [toastMessage, setToastMessage] = useState('');

  // Customer Service Form
  const [csPhone, setCsPhone] = useState(cmsData.customerService.phone);
  const [csEmail, setCsEmail] = useState(cmsData.customerService.email);
  const [csWhatsapp, setCsWhatsapp] = useState(cmsData.customerService.whatsapp);
  const [csHours, setCsHours] = useState(cmsData.customerService.operatingHours);
  const [csAddress, setCsAddress] = useState(cmsData.customerService.address);
  const [csSLA, setCsSLA] = useState(cmsData.customerService.responseSLA);

  // Terms Form
  const [termsTitle, setTermsTitle] = useState(cmsData.terms.title);
  const [termsContent, setTermsContent] = useState(cmsData.terms.content);

  // Privacy Form
  const [privacyTitle, setPrivacyTitle] = useState(cmsData.privacy.title);
  const [privacyContent, setPrivacyContent] = useState(cmsData.privacy.content);

  useEffect(() => {
    setCsPhone(cmsData.customerService.phone);
    setCsEmail(cmsData.customerService.email);
    setCsWhatsapp(cmsData.customerService.whatsapp);
    setCsHours(cmsData.customerService.operatingHours);
    setCsAddress(cmsData.customerService.address);
    setCsSLA(cmsData.customerService.responseSLA);

    setTermsTitle(cmsData.terms.title);
    setTermsContent(cmsData.terms.content);

    setPrivacyTitle(cmsData.privacy.title);
    setPrivacyContent(cmsData.privacy.content);
  }, [cmsData]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveCustomerService = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerService({
      phone: csPhone,
      email: csEmail,
      whatsapp: csWhatsapp,
      operatingHours: csHours,
      address: csAddress,
      emergencyLine: cmsData.customerService.emergencyLine,
      responseSLA: csSLA,
    });
    triggerToast('Customer Service details updated & live on public website!');
  };

  const handleSaveTerms = (e: React.FormEvent) => {
    e.preventDefault();
    updateTerms(termsTitle, termsContent);
    triggerToast('Terms & Conditions published & live on public /terms page!');
  };

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrivacy(privacyTitle, privacyContent);
    triggerToast('Privacy Policy published & live on public /privacy page!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Content Management System (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Edit legal policies and customer service credentials that reflect live across the public site.
          </p>
        </div>

        <button
          onClick={() => {
            resetCMS();
            triggerToast('CMS reset to default template!');
          }}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* CMS Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('service')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'service'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Customer Service CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'terms'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'privacy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy CMS</span>
        </button>
      </div>

      {/* Tab 1: Customer Service CMS */}
      {activeTab === 'service' && (
        <form onSubmit={handleSaveCustomerService} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Support Credentials</h3>
              <p className="text-slate-400 text-xs">These values appear on the public footer, contact page, and advisor cards.</p>
            </div>
            <a href="/contact" target="_blank" className="text-xs font-bold text-indigo-600 dark:text-pink-400 hover:underline flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview /contact</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Customer Support Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={csPhone}
                  onChange={(e) => setCsPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Official Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={csEmail}
                  onChange={(e) => setCsEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">WhatsApp Concierge Hotline</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={csWhatsapp}
                  onChange={(e) => setCsWhatsapp(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Operating Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={csHours}
                  onChange={(e) => setCsHours(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Corporate Physical Office Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                value={csAddress}
                onChange={(e) => setCsAddress(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium resize-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Response Time SLA Badge</label>
            <input
              type="text"
              value={csSLA}
              onChange={(e) => setCsSLA(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Terms & Conditions CMS */}
      {activeTab === 'terms' && (
        <form onSubmit={handleSaveTerms} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Terms & Conditions Document Editor</h3>
              <p className="text-slate-400 text-xs">Edits reflect immediately on the public /terms page.</p>
            </div>
            <a href="/terms" target="_blank" className="text-xs font-bold text-indigo-600 dark:text-pink-400 hover:underline flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview /terms</span>
            </a>
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Page Title</label>
            <input
              type="text"
              value={termsTitle}
              onChange={(e) => setTermsTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Terms Document Body</label>
            <textarea
              rows={12}
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Terms</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Privacy Policy CMS */}
      {activeTab === 'privacy' && (
        <form onSubmit={handleSavePrivacy} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy Policy Document Editor</h3>
              <p className="text-slate-400 text-xs">Edits reflect immediately on the public /privacy page.</p>
            </div>
            <a href="/privacy" target="_blank" className="text-xs font-bold text-indigo-600 dark:text-pink-400 hover:underline flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview /privacy</span>
            </a>
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Page Title</label>
            <input
              type="text"
              value={privacyTitle}
              onChange={(e) => setPrivacyTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Privacy Policy Body</label>
            <textarea
              rows={12}
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Privacy Policy</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
