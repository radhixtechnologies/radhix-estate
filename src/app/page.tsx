'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Heart, 
  ArrowRight, 
  Clock, 
  Award,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { Hero } from '@/components/hero';
import { FEATURED_PROPERTIES, CITIES, formatPrice } from '@/lib/constants';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const { favourites, toggleFavourite } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Animated Hero Section */}
      <Hero />

      {/* 2. Featured Properties Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/60 text-xs font-bold text-indigo-600 dark:text-pink-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Featured Properties
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base max-w-xl">
              Architecturally distinguished residences vetted for prime location, clear legal titles, and superior finishes.
            </p>
          </div>

          <Link
            href="/listings"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-pink-400 hover:gap-3 transition-all duration-300"
          >
            <span>View All 24+ Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROPERTIES.slice(0, 6).map((property, index) => {
            const isFav = favourites.includes(property.id);
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-3xl bg-white dark:bg-[#0e162c] border border-slate-200/70 dark:border-slate-800/80 overflow-hidden shadow-lg shadow-black/5 hover:shadow-2xl hover:border-indigo-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Zoom & Badge */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Purpose & Type Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white shadow-sm">
                      {property.purpose}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
                      {property.property_type}
                    </span>
                  </div>

                  {/* Favourite Button with Heart Pop Animation */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavourite(property.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-md hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    aria-label="Save to Favourites"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-pink-500 text-pink-500 scale-110' : 'hover:text-pink-500'
                      }`}
                    />
                  </button>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="text-xl font-extrabold tracking-tight drop-shadow-md">
                      {formatPrice(property.price, property.purpose)}
                    </div>
                    {property.area_sqft && (
                      <div className="text-xs font-medium text-slate-200 drop-shadow-sm">
                        {property.area_sqft.toLocaleString('en-IN')} sq.ft
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </div>

                    <Link href={`/listings/${property.slug}`}>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1 mb-2">
                        {property.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {property.description}
                    </p>
                  </div>

                  {/* Key Facts Pill Row */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-indigo-500" />
                      <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Commercial'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-indigo-500" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-indigo-500" />
                      <span>{property.furnishing.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Popular Metros Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Prime Metros
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            High-growth urban corridors offering exceptional rental yield and capital appreciation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              href={`/listings?city=${city.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={city.image_url}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium">{city.state}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Radhix Estates - Bento Style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-b from-indigo-900/10 via-slate-900/5 to-transparent dark:from-indigo-950/40 dark:via-slate-900/40 p-8 sm:p-12 border border-slate-200/60 dark:border-slate-800/80">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-pink-400">
              The Radhix Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Why Elite Buyers Choose Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              We combine institutional-grade verification with high-touch white-glove advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">100% Legal Title Due Diligence</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every property undergoes a 40-point legal, zoning, and encumbrance check before being listed on the platform.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instant Site Visit Concierge</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Book guaranteed private tours with verified senior advisors directly from the listing page in under 30 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Zero Hidden Brokerage Fee</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Transparent deal pricing with full direct-to-owner and direct-to-developer negotiation representation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean Customer Consultation CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-10 sm:p-16 border border-indigo-500/20 shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4">
              Private Advisory Services
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Looking for a Bespoke Property Acquisition?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Connect directly with our senior luxury advisors for unlisted off-market penthouses, villas, and strategic commercial properties.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Schedule Private Consultation</span>
              </Link>
              <Link
                href="/listings"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Browse All Properties</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
