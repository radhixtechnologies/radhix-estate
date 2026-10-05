'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useCMSStore } from '@/lib/cms-store';

export function Footer() {
  const pathname = usePathname();
  const { cmsData } = useCMSStore();
  const cs = cmsData.customerService;

  // Hide footer inside Admin CRM layout
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-[#070b16] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Live CMS Customer Service */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Radhix <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Estates</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier digital real estate platform engineered for discerning buyers, high-net-worth investors, and forward-thinking modern agencies.
            </p>
            <div className="pt-2 text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{cs.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{cs.phone} ({cs.operatingHours})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{cs.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Properties
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/listings?purpose=BUY" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Buy Luxury Homes
                </Link>
              </li>
              <li>
                <Link href="/listings?purpose=RENT" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Rent Prime Estates
                </Link>
              </li>
              <li>
                <Link href="/listings?type=PENTHOUSE" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Sea View Penthouses
                </Link>
              </li>
              <li>
                <Link href="/listings?type=VILLA" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Modernist Villas
                </Link>
              </li>
              <li>
                <Link href="/listings?type=COMMERCIAL" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Grade-A Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Prime Cities
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/listings?city=mumbai" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Mumbai (Worli & Bandra)
                </Link>
              </li>
              <li>
                <Link href="/listings?city=bangalore" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Bangalore (Indiranagar & Whitefield)
                </Link>
              </li>
              <li>
                <Link href="/listings?city=delhi-ncr" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Delhi NCR (Golf Course Rd)
                </Link>
              </li>
              <li>
                <Link href="/listings?city=hyderabad" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Hyderabad (Jubilee Hills)
                </Link>
              </li>
              <li>
                <Link href="/listings?city=pune" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Pune (Koregaon Park)
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Support */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Governance & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  About Radhix Estates
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Senior Luxury Advisors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Customer Service & Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-pink-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Brand Footer */}
        <div className="mt-14 pt-8 border-t border-slate-200/50 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Radhix Estates. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
            <span>Powered by</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              RADHIX TECHNOLOGIES
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
