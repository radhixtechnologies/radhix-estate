'use client';

import { useState, useEffect } from 'react';

export interface CustomerServiceInfo {
  phone: string;
  email: string;
  whatsapp: string;
  operatingHours: string;
  address: string;
  emergencyLine: string;
  responseSLA: string;
}

export interface CMSContent {
  terms: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  customerService: CustomerServiceInfo;
}

const DEFAULT_CMS_DATA: CMSContent = {
  terms: {
    title: 'Terms of Service & Platform Governance',
    lastUpdated: 'October 2026',
    content: `Welcome to Radhix Estates, operated by RADHIX TECHNOLOGIES. By accessing our public property portal, scheduling accompanied site visits, or submitting inquiries, you agree to comply with and be bound by these Terms of Service.

1. Architectural Curation & Title Due Diligence
All listings displayed on Radhix Estates are curated for high-net-worth buyers, investors, and modern enterprises. While our advisors perform strict title verification, zoning clearance, and legal encumbrance checks, buyers are advised to perform independent conveyance audits before monetary exchanges.

2. Accompanied Site Visits & Confidentiality
All site viewing appointments booked through the platform are scheduled in coordination with our registered licensed property advisors. Unaccompanied visits to private residential properties are strictly prohibited.

3. Platform Integrity & Zero Hidden Brokerage
We provide direct builder, developer, and verified owner representation with full transparency on pricing, carpet areas, and conveyance fees.`,
  },
  privacy: {
    title: 'Privacy & Data Protection Policy',
    lastUpdated: 'October 2026',
    content: `At RADHIX TECHNOLOGIES, safeguarding investor confidentiality is paramount. This Privacy Policy outlines how Radhix Estates collects, processes, and protects your information.

1. Information We Collect
We collect personal contact details provided directly by you when submitting property inquiries, booking private tours, or chatting with our concierge advisors.

2. Data Security & Multi-Tenant Partitioning
All stored CRM data utilizes advanced encryption in transit and at rest, safeguarded by strict PostgreSQL Row Level Security (RLS) policies.

3. Zero Marketing Resale Guarantee
Your phone numbers and emails are never sold, rented, or distributed to third-party telemarketers or external broker syndicates.`,
  },
  customerService: {
    phone: '+91 98765 43210',
    email: 'estates@radhix.com',
    whatsapp: '+91 98200 44556',
    operatingHours: 'Mon - Sat: 9:00 AM – 8:00 PM IST',
    address: 'Tower 4, Prime Tech Park, Cyber City, Bangalore - 560103',
    emergencyLine: '+91 98200 11223',
    responseSLA: 'Under 15 minutes response for verified buyers',
  },
};

const STORAGE_KEY = 'radhix_cms_data_v1';

export function useCMSStore() {
  const [cmsData, setCmsData] = useState<CMSContent>(DEFAULT_CMS_DATA);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCmsData(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading CMS storage', e);
    }
    setMounted(true);

    const handleSync = () => {
      try {
        const updated = localStorage.getItem(STORAGE_KEY);
        if (updated) setCmsData(JSON.parse(updated));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('radhix_cms_updated', handleSync);
    return () => window.removeEventListener('radhix_cms_updated', handleSync);
  }, []);

  const updateTerms = (title: string, content: string) => {
    const updated: CMSContent = {
      ...cmsData,
      terms: {
        title,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        content,
      },
    };
    setCmsData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('radhix_cms_updated'));
  };

  const updatePrivacy = (title: string, content: string) => {
    const updated: CMSContent = {
      ...cmsData,
      privacy: {
        title,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        content,
      },
    };
    setCmsData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('radhix_cms_updated'));
  };

  const updateCustomerService = (info: CustomerServiceInfo) => {
    const updated: CMSContent = {
      ...cmsData,
      customerService: info,
    };
    setCmsData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('radhix_cms_updated'));
  };

  const resetCMS = () => {
    setCmsData(DEFAULT_CMS_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_DATA));
    window.dispatchEvent(new Event('radhix_cms_updated'));
  };

  return {
    cmsData,
    updateTerms,
    updatePrivacy,
    updateCustomerService,
    resetCMS,
    mounted,
  };
}
