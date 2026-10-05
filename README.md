# Radhix Estates - Luxury Real Estate Platform

**Powered by Radhix Technologies**  
*A modern, premium, Gen-Z-friendly Real Estate Platform (Airbnb x Linear x Stripe aesthetics).*

---

## 🌟 Live Demo & Quick Links

- **Public Website:** [http://localhost:3001](http://localhost:3001)
- **Explore Listings & Filters:** [http://localhost:3001/listings](http://localhost:3001/listings)
- **Executive Admin Portal:** [http://localhost:3001/admin](http://localhost:3001/admin)
- **CRM Leads & Deals Pipeline:** [http://localhost:3001/admin/leads](http://localhost:3001/admin/leads)
- **Site Visit Calendar:** [http://localhost:3001/admin/site-visits](http://localhost:3001/admin/site-visits)
- **Property Portfolio Management:** [http://localhost:3001/admin/properties](http://localhost:3001/admin/properties)

---

## 🏗️ Architecture & Technology Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + React 19
- **Styling:** Tailwind CSS v4 with bespoke glassmorphism utilities & soft gradients
- **Design Tokens:**
  - Dark Mode: Deep Navy (`#0B1020`)
  - Light Mode: Crisp Soft Slate (`#F8FAFC`)
  - Accent Gradients: Electric Indigo (`#6366F1`) to Vivid Pink (`#EC4899`)
- **Animations:** Framer Motion (animated gradient mesh blobs, layout spring transitions, heart pop reactions, staggered reveals)
- **Database & RLS:** Supabase (PostgreSQL with Row Level Security, Realtime publications, multi-tenant agency schema)
- **State & Store:** Reactive unified store syncing public inquiries, favorites, and real-time CRM updates
- **Charts:** Recharts for animated performance analytics

---

## 📦 What Was Built

### 1. Public Portal
- **Home:** Animated hero with floating blobs, text shimmer, Buy/Rent interactive tabs, city/type/budget search, animated count-up numbers, curated property cards, and prime metro showcases.
- **Listings:** Grid / List / Map toggle, multi-parameter filtering (city, property type, budget slider, bedrooms, furnishing), price/popularity sorting.
- **Property Detail:** Lightbox gallery, key facts, interactive EMI calculator, nearby connectivity, direct Call & WhatsApp advisor triggers, and sticky site visit scheduling modal.
- **Favourites & Compare:** Save residences and compare up to 3 properties side-by-side across price, carpet area, rate/sqft, and layouts.
- **Static Pages:** About, Contact (with CRM callback integration), Terms, and Privacy Policy.

### 2. Admin CRM & Agency Suite
- **Dashboard:** Real-time KPI counters, animated Recharts (lead acquisition trends & portfolio distribution by city), recent inquiries, and upcoming tours.
- **Properties:** Create, inspect, and delete listings with instant live reflection on the public site.
- **Leads CRM:** Interactive Kanban board (`New` -> `Contacted` -> `Visit Scheduled` -> `Negotiation` -> `Closed Won` / `Closed Lost`) with quick Call/WhatsApp actions.
- **Site Visits:** Calendar agenda with fulfillment tracking and 5-star client ratings.
- **Agents:** Team roster with closed transaction stats and active listing quotas.
- **Reports:** Acquisition channel attribution and CSV export.
- **Settings & Demo Controls:** "Reset Demo Data" and instant role switcher (Super Admin, Agency Admin, Agent, Sales Executive).

---

## 🚀 Running the Project

```bash
cd "C:\flutter projects\radhix-estates"

# Install dependencies (already installed)
npm install

# Start development server
npm run dev
```

Server is currently running live on `http://localhost:3001`!
