'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Heart, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  PhoneCall
} from 'lucide-react';
import { useTheme } from './theme-provider';

export function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do NOT render public navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Explore', href: '/listings' },
    { label: 'Buy', href: '/listings?purpose=BUY' },
    { label: 'Rent', href: '/listings?purpose=RENT' },
    { label: 'Agents', href: '/agents' },
    { label: 'Why Us', href: '/about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0B1020]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-black/5 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Radhix <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 font-extrabold">Estates</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest text-slate-400 font-medium uppercase">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Favourites & Light/Dark Theme Toggle & Contact CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Favourites Pill */}
            <Link
              href="/favourites"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="View Favourites"
            >
              <Heart className="w-5 h-5 hover:text-pink-500 transition-colors" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 transition-colors cursor-pointer"
              aria-label="Toggle Light and Night Mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Contact Concierge CTA (Replacing demo admin) */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Concierge</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-2xl px-6 py-6"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
              <Link
                href="/favourites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Saved Properties
                </span>
                <span className="px-2 py-0.5 text-xs font-bold bg-pink-500 text-white rounded-full">
                  {favoritesCount}
                </span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-500 shadow-md shadow-indigo-500/30"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact Concierge</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
