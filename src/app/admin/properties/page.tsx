'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Sparkles, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/constants';
import { Property, PropertyType, PropertyPurpose } from '@/types';

export default function AdminPropertiesPage() {
  const { properties, addProperty, deleteProperty } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Property Form States
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('BUY');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [price, setPrice] = useState<number>(50000000);
  const [areaSqft, setAreaSqft] = useState<number>(3000);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [address, setAddress] = useState('');
  const [cityId, setCityId] = useState('c0000000-0000-0000-0000-000000000001'); // Mumbai
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');

  const filteredProperties = properties.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase()) && !p.address.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address) return;

    addProperty({
      title,
      purpose,
      property_type: propertyType,
      price,
      area_sqft: areaSqft,
      bedrooms,
      bathrooms,
      address,
      city_id: cityId,
      description: description || 'Exclusive luxury residence in prime corridor with modern architecture.',
      images: [
        {
          id: `img-${Date.now()}`,
          property_id: `prop-${Date.now()}`,
          url: imageUrl,
          is_cover: true,
          display_order: 1,
        },
      ],
    });

    setIsModalOpen(false);
    // Reset Form
    setTitle('');
    setAddress('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Property Portfolio Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish, edit, and organize verified inventory live across public search.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, location, road..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold hidden md:inline">Status:</span>
          {['ALL', 'AVAILABLE', 'SOLD', 'RENTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Properties */}
      <div className="rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Property / Title</th>
                <th className="py-3.5 px-4">Type & Transaction</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Specs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images?.[0]?.url}
                        alt={property.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                          {property.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          <span>{property.address}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    <div>{property.property_type}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-pink-400 font-bold uppercase">{property.purpose}</div>
                  </td>

                  <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(property.price, property.purpose)}
                  </td>

                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    <div>{property.area_sqft} sq.ft</div>
                    <div className="text-[10px] text-slate-400">{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Commercial'}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                      {property.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <a
                      href={`/listings/${property.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-pink-400 inline-block transition-colors"
                      title="View on Public Site"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 inline-block transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Listing</h3>
                <p className="text-xs text-slate-400">Property will go live immediately on the public website.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sea-Facing Royal Duplex"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Transaction</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="BUY">Buy</option>
                    <option value="RENT">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="VILLA">Villa</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="PLOT">Plot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Carpet Sq.ft</label>
                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Worli Sea Face Promenade, Mumbai"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural summary..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
