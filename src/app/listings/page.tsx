'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Map as MapIcon, 
  Heart, 
  Bed, 
  Bath, 
  Maximize2, 
  Sparkles,
  ArrowUpDown,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CITIES, formatPrice } from '@/lib/constants';
import { Property, PropertyType, PropertyPurpose } from '@/types';

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, favourites, toggleFavourite } = useAppStore();

  // URL state
  const initialPurpose = (searchParams.get('purpose') as PropertyPurpose) || 'ALL';
  const initialCity = searchParams.get('city') || '';
  const initialType = (searchParams.get('type') as PropertyType) || '';

  // Filter States
  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [city, setCity] = useState<string>(initialCity);
  const [propertyType, setPropertyType] = useState<string>(initialType);
  const [maxPrice, setMaxPrice] = useState<number>(250000000); // 25 Cr max
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [furnishing, setFurnishing] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (purpose !== 'ALL' && p.purpose !== purpose) return false;
        if (city && !p.city_id.includes(city) && !p.address.toLowerCase().includes(city.toLowerCase())) {
          const matchedCity = CITIES.find((c) => c.slug === city);
          if (matchedCity && !p.address.toLowerCase().includes(matchedCity.name.toLowerCase())) {
            return false;
          }
        }
        if (propertyType && p.property_type !== propertyType) return false;
        if (p.price > maxPrice) return false;
        if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
        if (furnishing !== 'ALL' && p.furnishing !== furnishing) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return b.view_count - a.view_count; // 'popular'
      });
  }, [properties, purpose, city, propertyType, maxPrice, minBedrooms, furnishing, sortBy]);

  const clearFilters = () => {
    setPurpose('ALL');
    setCity('');
    setPropertyType('');
    setMaxPrice(250000000);
    setMinBedrooms(0);
    setFurnishing('ALL');
    setSortBy('popular');
    router.push('/listings');
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-pink-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Prime Properties
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-bold text-indigo-600 dark:text-pink-400">{filteredProperties.length}</span> curated luxury residences & commercial assets
          </p>
        </div>

        {/* View Mode Toggle & Sort Controls */}
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span>Filter</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Listed</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Grid / List / Map Toggle */}
          <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-pink-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-pink-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-pink-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Properties View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sticky Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white/70 dark:bg-[#0c1326]/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 h-fit sticky top-24 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              <span>Filters</span>
            </span>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-indigo-600 dark:text-pink-400 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Purpose Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Transaction
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              {['ALL', 'BUY', 'RENT'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    purpose === p
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-pink-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Location / City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="">All Prime Cities</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="delhi-ncr">Delhi NCR</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Property Architecture
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="PENTHOUSE">Penthouse</option>
              <option value="VILLA">Villa</option>
              <option value="APARTMENT">Apartment</option>
              <option value="COMMERCIAL">Commercial Office</option>
              <option value="PLOT">Residential Plot</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="uppercase tracking-wider text-slate-500 dark:text-slate-400">Max Budget</span>
              <span className="text-indigo-600 dark:text-pink-400">
                {maxPrice >= 10000000 ? `₹${(maxPrice / 10000000).toFixed(1)} Cr` : `₹${(maxPrice / 100000).toFixed(0)} L`}
              </span>
            </div>
            <input
              type="range"
              min={5000000}
              max={250000000}
              step={5000000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Bedrooms Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Minimum Bedrooms
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[0, 2, 3, 4, 5].map((bed) => (
                <button
                  key={bed}
                  onClick={() => setMinBedrooms(bed)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    minBedrooms === bed
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {bed === 0 ? 'Any' : `${bed}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Furnishing
            </label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="ALL">Any Furnishing</option>
              <option value="FURNISHED">Fully Furnished</option>
              <option value="SEMI_FURNISHED">Semi Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          {viewMode === 'map' ? (
            /* Interactive Visual Map Layout */
            <div className="rounded-3xl bg-slate-900 p-8 text-white relative min-h-[500px] flex flex-col items-center justify-center border border-slate-800 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
              <MapIcon className="w-12 h-12 text-indigo-400 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">Interactive Location Radar</h3>
              <p className="text-slate-400 text-sm max-w-md text-center mb-6">
                All 24 properties are geocoded with GPS coordinates across Mumbai, Bangalore, Gurgaon, Hyderabad, and Pune.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {filteredProperties.slice(0, 8).map((p) => (
                  <Link
                    key={p.id}
                    href={`/listings/${p.slug}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-indigo-600 backdrop-blur-md transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-pink-400" />
                    <span>{p.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : filteredProperties.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 px-4 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-500 mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Matching Properties</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Try expanding your budget slider or choosing another prime city to see available residences.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* List View */
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property) => {
                  const isFav = favourites.includes(property.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      key={property.id}
                      className="group rounded-3xl bg-white dark:bg-[#0e162c] border border-slate-200/70 dark:border-slate-800/80 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300"
                    >
                      <Link href={`/listings/${property.slug}`} className="sm:w-64 h-48 rounded-2xl overflow-hidden shrink-0 relative">
                        <img
                          src={property.images?.[0]?.url}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-xs">
                          {property.purpose}
                        </span>
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-indigo-600 dark:text-pink-400">
                              {property.property_type}
                            </span>
                            <button
                              onClick={() => toggleFavourite(property.id)}
                              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-pink-500 transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500 text-pink-500' : ''}`} />
                            </button>
                          </div>

                          <Link href={`/listings/${property.slug}`}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-pink-400 transition-colors mt-1">
                              {property.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>{property.address}</span>
                          </p>

                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {property.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-4">
                          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {formatPrice(property.price, property.purpose)}
                          </div>
                          <Link
                            href={`/listings/${property.slug}`}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-pink-400 hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            /* Grid View */
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property) => {
                  const isFav = favourites.includes(property.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={property.id}
                      className="group rounded-3xl bg-white dark:bg-[#0e162c] border border-slate-200/70 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <Link href={`/listings/${property.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={property.images?.[0]?.url}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white">
                            {property.purpose}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-600 text-white">
                            {property.property_type}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavourite(property.id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-110 active:scale-90 transition-transform"
                          aria-label="Save to Favourites"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-500 text-pink-500' : ''}`} />
                        </button>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <div className="text-lg font-extrabold tracking-tight">
                            {formatPrice(property.price, property.purpose)}
                          </div>
                          <div className="text-xs font-medium text-slate-200">
                            {property.area_sqft} sq.ft
                          </div>
                        </div>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{property.address}</span>
                          </div>

                          <Link href={`/listings/${property.slug}`}>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1 mb-2">
                              {property.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {property.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Office'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{property.furnishing.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-500">Loading verified listings...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
