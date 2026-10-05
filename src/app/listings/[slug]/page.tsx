'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Heart, 
  Share2, 
  Check, 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Calculator, 
  Sparkles, 
  Compass, 
  Waves, 
  Zap, 
  Dumbbell, 
  Car, 
  Trees, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice, AGENTS } from '@/lib/constants';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { properties, favourites, toggleFavourite, addLead } = useAppStore();

  const property = properties.find((p) => p.slug === slug) || properties[0];
  const isFav = favourites.includes(property.id);

  // Enquiry & Site Visit Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // EMI Calculator State
  const defaultLoan = Math.round(property.price * 0.8);
  const [loanAmount, setLoanAmount] = useState<number>(defaultLoan);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = () => {
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return Math.round(loanAmount / n);
    const emi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    return isNaN(emi) ? 0 : emi;
  };

  const monthlyEMI = calculateEMI();
  const totalPayment = monthlyEMI * tenureYears * 12;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  // Gallery Active Image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : [
        { id: '1', property_id: property.id, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', is_cover: true, display_order: 1 },
        { id: '2', property_id: property.id, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', is_cover: false, display_order: 2 },
        { id: '3', property_id: property.id, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', is_cover: false, display_order: 3 },
      ];

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      email,
      phone,
      property_id: property.id,
      preferred_visit_date: visitDate || undefined,
      preferred_visit_time: visitTime || undefined,
      message: message || `Enquiry for ${property.title}`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setVisitDate('');
      setMessage('');
    }, 4000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nearbyPlaces = [
    { place: 'International Airport', distance: '25 mins drive' },
    { place: 'Metro Rail Station', distance: '800 meters' },
    { place: 'Global Hospital & Medical Hub', distance: '1.2 km' },
    { place: 'Top International Baccalaureate School', distance: '1.5 km' },
    { place: 'Prime Business & Tech Park', distance: '5 mins drive' },
  ];

  const assignedAgent = AGENTS[1];

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Back Link & Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:border-indigo-500 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleFavourite(property.id)}
            className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors ${
              isFav ? 'text-pink-500 border-pink-200' : 'text-slate-700 dark:text-slate-300 hover:text-pink-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Title & Price Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-pink-400">
              {property.purpose}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {property.property_type}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Title</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {property.title}
          </h1>

          <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{property.address}</span>
          </p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Offering Price
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            {formatPrice(property.price, property.purpose)}
          </div>
          {property.price_per_sqft && (
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ₹{property.price_per_sqft.toLocaleString('en-IN')}/sq.ft
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery with Lightbox Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
        {/* Main Hero Photo */}
        <div className="lg:col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
          <img
            src={images[activeImageIndex]?.url || images[0].url}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnail Selector Stack */}
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[16/10] w-36 lg:w-full rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                activeImageIndex === idx ? 'border-indigo-600 scale-[1.02] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Details + Sticky Enquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Specifications, Amenities, Floor Plan, EMI */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Facts Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80 shadow-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Carpet Area</span>
              <div className="flex items-center gap-1.5 text-base font-extrabold text-slate-900 dark:text-white">
                <Maximize2 className="w-4 h-4 text-indigo-500" />
                <span>{property.area_sqft} sq.ft</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bedrooms</span>
              <div className="flex items-center gap-1.5 text-base font-extrabold text-slate-900 dark:text-white">
                <Bed className="w-4 h-4 text-indigo-500" />
                <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Office'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bathrooms</span>
              <div className="flex items-center gap-1.5 text-base font-extrabold text-slate-900 dark:text-white">
                <Bath className="w-4 h-4 text-indigo-500" />
                <span>{property.bathrooms} Baths</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Furnishing</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                {property.furnishing.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Property Architectural Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {property.description}
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              Constructed with acoustic thermal glass facades, Italian Travertine stone flooring, and smart climate zoning. Ideal for luxury residential living or elite corporate hospitality.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Curated Premium Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: 'Private Infinity Pool', icon: Waves },
                { name: 'Home Automation', icon: Zap },
                { name: '24/7 Concierge Security', icon: ShieldCheck },
                { name: 'Private Fitness Gym', icon: Dumbbell },
                { name: 'EV Charging Station', icon: Zap },
                { name: 'Covered Parking', icon: Car },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-pink-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nearby Key Landmarks */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/70 dark:border-slate-800/80">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Nearby Connectivity & Social Infrastructure
            </h2>
            <div className="space-y-3">
              {nearbyPlaces.map((place) => (
                <div key={place.place} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 text-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{place.place}</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-pink-400">{place.distance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive EMI Calculator */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/20 via-slate-900/20 to-pink-950/20 dark:bg-[#0c1326] border border-indigo-500/20 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Interactive Home Loan EMI Estimator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Estimate your monthly financial commitment with leading banking partners.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Loan Amount Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Loan Principal</span>
                  <span className="text-indigo-600 dark:text-pink-400">
                    ₹{(loanAmount / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={property.price}
                  step={500000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Interest Rate Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Interest Rate</span>
                  <span className="text-indigo-600 dark:text-pink-400">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={7.0}
                  max={12.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Loan Tenure</span>
                  <span className="text-indigo-600 dark:text-pink-400">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* EMI Result Summary Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Monthly EMI</span>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                  ₹{monthlyEMI.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-400"> /month</span>
                </div>
              </div>

              <div className="flex gap-6 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="block text-slate-400">Total Interest</span>
                  <span className="font-bold">₹{(totalInterest / 10000000).toFixed(2)} Cr</span>
                </div>
                <div>
                  <span className="block text-slate-400">Total Payable</span>
                  <span className="font-bold">₹{(totalPayment / 10000000).toFixed(2)} Cr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Site Visit & Enquiry Form */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Direct Form Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Schedule a Private Viewing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Receive confidential architectural dossiers and book accompanied site inspection.
              </p>

              {submitted ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Visit Requested Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    Your appointment has been logged in our CRM and assigned to Senior Agent {assignedAgent.full_name}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Time Slot
                      </label>
                      <select
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:from-indigo-500 hover:to-pink-400 shadow-md shadow-indigo-500/25 transition-all text-sm cursor-pointer mt-2"
                  >
                    Confirm Site Visit Request
                  </button>
                </form>
              )}
            </div>

            {/* Assigned Concierge Agent Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1326] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <img
                src={assignedAgent.avatar_url}
                alt={assignedAgent.full_name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-pink-400">
                  Assigned Luxury Advisor
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {assignedAgent.full_name}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`tel:${assignedAgent.phone}`}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/919820044556?text=Interested%20in%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
