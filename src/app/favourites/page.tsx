'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Check, 
  X, 
  Scale, 
  Sparkles 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/constants';
import { Property } from '@/types';

export default function FavouritesPage() {
  const { properties, favourites, toggleFavourite } = useAppStore();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const favProperties = properties.filter((p) => favourites.includes(p.id));

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare a maximum of 3 properties side by side.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const comparedProperties = properties.filter((p) => selectedForCompare.includes(p.id));

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-xs font-bold text-pink-600 dark:text-pink-400 mb-2">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>Saved Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Properties & Comparison
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {favProperties.length} properties saved. Select up to 3 to inspect specifications side-by-side.
          </p>
        </div>

        {selectedForCompare.length > 0 && (
          <button
            onClick={() => setSelectedForCompare([])}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mt-4 md:mt-0"
          >
            Clear Selected Comparison ({selectedForCompare.length})
          </button>
        )}
      </div>

      {favProperties.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/80 flex items-center justify-center text-pink-500 mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Properties Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Click the heart icon on any listing card or detail view to save residences for offline review and side-by-side comparison.
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-md hover:scale-[1.02] transition-all"
          >
            <span>Browse Available Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Favourites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProperties.map((property) => {
              const isComparing = selectedForCompare.includes(property.id);
              return (
                <div
                  key={property.id}
                  className={`group rounded-3xl bg-white dark:bg-[#0e162c] border overflow-hidden shadow-sm transition-all duration-300 ${
                    isComparing
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-lg'
                      : 'border-slate-200/70 dark:border-slate-800/80 hover:shadow-xl'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={property.images?.[0]?.url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFavourite(property.id)}
                        className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:scale-110 active:scale-90 transition-transform shadow-xs"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white text-lg font-extrabold drop-shadow-md">
                      {formatPrice(property.price, property.purpose)}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {property.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4 truncate">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{property.address}</span>
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => toggleCompare(property.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isComparing
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                      </button>

                      <Link
                        href={`/listings/${property.slug}`}
                        className="text-xs font-bold text-indigo-600 dark:text-pink-400 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Table Section (when 2 or more selected) */}
          {comparedProperties.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-x-auto"
            >
              <div className="flex items-center gap-2 mb-6">
                <Scale className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Side-by-Side Property Comparison
                </h3>
              </div>

              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 font-bold text-slate-400 text-xs uppercase tracking-wider w-1/4">
                      Specification
                    </th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white w-1/4">
                        {p.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs">Offering Price</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3.5 px-4 font-extrabold text-indigo-600 dark:text-pink-400">
                        {formatPrice(p.price, p.purpose)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs">Carpet Area</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {p.area_sqft.toLocaleString('en-IN')} sq.ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs">Rate / sq.ft</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {p.price_per_sqft ? `₹${p.price_per_sqft.toLocaleString('en-IN')}` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs">Bedrooms & Layout</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {p.bedrooms > 0 ? `${p.bedrooms} BHK (${p.bathrooms} Baths)` : 'Commercial Suite'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs">Furnishing</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {p.furnishing.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs">Location</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                        {p.address}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
