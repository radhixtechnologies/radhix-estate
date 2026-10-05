'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { StatsCountUp } from './stats-count-up';

export function Hero() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<'BUY' | 'RENT'>('BUY');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('purpose', purpose);
    if (city) params.set('city', city);
    if (propertyType) params.set('type', propertyType);
    if (budget) params.set('budget', budget);
    router.push(`/listings?${params.toString()}`);
  };

  const trendingTags = [
    { label: 'Sea-Facing Worli', query: 'city=mumbai&type=PENTHOUSE' },
    { label: 'Indiranagar Villas', query: 'city=bangalore&type=VILLA' },
    { label: 'Golf Course Road Luxury', query: 'city=delhi-ncr&type=APARTMENT' },
    { label: 'Jubilee Hills Estates', query: 'city=hyderabad&type=VILLA' },
    { label: 'Grade-A Commercial Suites', query: 'type=COMMERCIAL' },
  ];

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden pt-28 pb-16">
      {/* 1. Animated Gradient Mesh & Floating Blurred Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Indigo Blob */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-500/25 via-indigo-400/20 to-transparent blur-[120px]"
        />

        {/* Bottom Right Pink Blob */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-pink-500/25 via-purple-500/20 to-transparent blur-[140px]"
        />

        {/* Center Accent Pulse Blob */}
        <motion.div
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-pink-500/10 blur-[130px]"
        />

        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* 2. Staggered Fade-Up Hero Copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Eyebrow Pill */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm mb-6 hover:border-indigo-500/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-pink-400" />
            <span>Over 24+ Exclusive Prime Listings Live Today</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </motion.div>

          {/* Main Headline with Shimmering Gradient */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-6"
          >
            Discover, Acquire & Live in{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer bg-[length:200%_auto]">
                Extraordinary Spaces
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
                className="absolute left-0 bottom-1 sm:bottom-2 h-1.5 sm:h-2 bg-gradient-to-r from-indigo-500/30 to-pink-500/30 rounded-full -z-10"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Radhix Estates bridges elite architecture with real-time property intelligence.
            Curated duplexes, sea-facing penthouses, and modernist villas across India’s premier corridors.
          </motion.p>
        </motion.div>

        {/* 3. Interactive Bento Search Glassmorphism Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-[#0d1428]/85 backdrop-blur-2xl border border-white/60 dark:border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-indigo-500/10 relative">
            {/* Purpose Tabs (Buy / Rent) with Shared-Element spring animation */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center border border-slate-200/50 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setPurpose('BUY')}
                  className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    purpose === 'BUY'
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {purpose === 'BUY' && (
                    <motion.div
                      layoutId="purposeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-md shadow-indigo-500/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Buy Property</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPurpose('RENT')}
                  className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    purpose === 'RENT'
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {purpose === 'RENT' && (
                    <motion.div
                      layoutId="purposeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl shadow-md shadow-pink-500/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Rent Prime Spaces</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 ml-auto text-xs text-slate-500 dark:text-slate-400">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Verified RLS Database</span>
              </div>
            </div>

            {/* Inputs Grid Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City Selection */}
              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                  Location
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-pink-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">All Prime Cities</option>
                    <option value="mumbai">Mumbai (Worli, Bandra)</option>
                    <option value="bangalore">Bangalore (Indiranagar, Whitefield)</option>
                    <option value="delhi-ncr">Delhi NCR (Golf Course Rd)</option>
                    <option value="hyderabad">Hyderabad (Jubilee Hills)</option>
                    <option value="pune">Pune (Koregaon Park)</option>
                  </select>
                </div>
              </div>

              {/* Property Type Selection */}
              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                  Property Type
                </label>
                <div className="relative flex items-center">
                  <Home className="absolute left-3.5 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-pink-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">All Architectures</option>
                    <option value="PENTHOUSE">Penthouse Duplex</option>
                    <option value="VILLA">Modernist Villa</option>
                    <option value="APARTMENT">Luxury Apartment</option>
                    <option value="COMMERCIAL">Grade-A Commercial</option>
                    <option value="PLOT">Residential Land Plot</option>
                  </select>
                </div>
              </div>

              {/* Budget Range Selection */}
              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                  Budget
                </label>
                <div className="relative flex items-center">
                  <IndianRupee className="absolute left-3.5 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-pink-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Any Budget</option>
                    {purpose === 'BUY' ? (
                      <>
                        <option value="0-50000000">Under ₹5.0 Cr</option>
                        <option value="50000000-100000000">₹5.0 Cr - ₹10.0 Cr</option>
                        <option value="100000000-200000000">₹10.0 Cr - ₹20.0 Cr</option>
                        <option value="200000000+">Ultra Luxury ₹20.0 Cr+</option>
                      </>
                    ) : (
                      <>
                        <option value="0-150000">Under ₹1.5 Lacs/mo</option>
                        <option value="150000-350000">₹1.5 Lacs - ₹3.5 Lacs/mo</option>
                        <option value="350000-600000">₹3.5 Lacs - ₹6.0 Lacs/mo</option>
                        <option value="600000+">₹6.0 Lacs+/mo</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:from-indigo-500 hover:to-pink-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>

            {/* Trending Quick Search Pills */}
            <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                Trending:
              </span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => router.push(`/listings?${tag.query}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-pink-400 border border-slate-200/40 dark:border-slate-700/50 transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 4. Animated Count-Up Numbers for Stats */}
        <StatsCountUp />
      </div>
    </div>
  );
}
