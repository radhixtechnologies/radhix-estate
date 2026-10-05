'use client';

import { useState, useEffect } from 'react';
import { Property, Lead, SiteVisit, Notification, Profile } from '@/types';
import { FEATURED_PROPERTIES, AGENTS } from './constants';

const STORAGE_KEYS = {
  PROPERTIES: 'radhix_properties_v1',
  LEADS: 'radhix_leads_v1',
  VISITS: 'radhix_visits_v1',
  FAVOURITES: 'radhix_favs_v1',
  NOTIFICATIONS: 'radhix_notifs_v1',
  CURRENT_USER: 'radhix_current_user_v1',
};

// Initial Mock Leads for Demo
const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    property_id: '10000000-0000-0000-0000-000000000001',
    assigned_to: 'p0000000-0000-0000-0000-000000000002',
    name: 'Arjun Singhania',
    email: 'arjun@singhaniacapital.com',
    phone: '+91 99887 76655',
    budget_min: 150000000,
    budget_max: 200000000,
    message: 'Interested in Worli penthouse duplex. Need floor plan and sea-view video tour.',
    status: 'NEW',
    source: 'WEBSITE',
    notes_count: 2,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    property: FEATURED_PROPERTIES[0],
    agent: AGENTS[1],
  },
  {
    id: 'lead-2',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    property_id: '10000000-0000-0000-0000-000000000002',
    assigned_to: 'p0000000-0000-0000-0000-000000000003',
    name: 'Kavita Verma',
    email: 'kavita@techfounders.in',
    phone: '+91 98112 23344',
    budget_min: 80000000,
    budget_max: 100000000,
    message: 'Looking for an eco villa in Indiranagar. Immediate decision if documents clear.',
    status: 'CONTACTED',
    source: 'WHATSAPP',
    notes_count: 4,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    property: FEATURED_PROPERTIES[1],
    agent: AGENTS[2],
  },
  {
    id: 'lead-3',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    property_id: '10000000-0000-0000-0000-000000000003',
    assigned_to: 'p0000000-0000-0000-0000-000000000001',
    name: 'Rajesh Jindal',
    email: 'rjindal@steelcorp.com',
    phone: '+91 97123 45678',
    budget_min: 120000000,
    budget_max: 140000000,
    message: 'Interested in Golf Course Road luxury flat. Site visit required this Saturday.',
    status: 'VISIT_SCHEDULED',
    source: 'CAMPAIGN',
    preferred_visit_date: '2026-10-10',
    preferred_visit_time: '11:00 AM',
    notes_count: 3,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date().toISOString(),
    property: FEATURED_PROPERTIES[2],
    agent: AGENTS[0],
  },
  {
    id: 'lead-4',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    property_id: '10000000-0000-0000-0000-000000000004',
    assigned_to: 'p0000000-0000-0000-0000-000000000004',
    name: 'Dr. Sneha Reddy',
    email: 'drsneha@apollohospitals.org',
    phone: '+91 98450 12345',
    budget_min: 200000000,
    budget_max: 230000000,
    message: 'Final price negotiation in progress for Jubilee Hills villa.',
    status: 'NEGOTIATION',
    source: 'REFERRAL',
    notes_count: 5,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    updated_at: new Date().toISOString(),
    property: FEATURED_PROPERTIES[3],
    agent: AGENTS[3],
  },
  {
    id: 'lead-5',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    property_id: '10000000-0000-0000-0000-000000000005',
    assigned_to: 'p0000000-0000-0000-0000-000000000002',
    name: 'Sameer Kapoor',
    email: 'sameer@kapoorfilms.com',
    phone: '+91 99200 88990',
    budget_min: 300000,
    budget_max: 380000,
    message: 'Agreement drafted. Token advance paid.',
    status: 'CLOSED_WON',
    source: 'DIRECT',
    notes_count: 6,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date().toISOString(),
    property: FEATURED_PROPERTIES[4],
    agent: AGENTS[1],
  },
  {
    id: 'lead-6',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    property_id: '10000000-0000-0000-0000-000000000006',
    assigned_to: 'p0000000-0000-0000-0000-000000000003',
    name: 'Alok Mehta',
    email: 'alok@startuphub.io',
    phone: '+91 98234 56789',
    budget_min: 500000,
    budget_max: 700000,
    message: 'Client chose a space closer to metro line.',
    status: 'CLOSED_LOST',
    source: 'WEBSITE',
    notes_count: 1,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date().toISOString(),
    property: FEATURED_PROPERTIES[5],
    agent: AGENTS[2],
  },
];

// Initial Site Visits for Demo
const INITIAL_VISITS: SiteVisit[] = [
  {
    id: 'visit-1',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    lead_id: 'lead-3',
    property_id: '10000000-0000-0000-0000-000000000003',
    agent_id: 'p0000000-0000-0000-0000-000000000001',
    visit_date: '2026-10-06',
    visit_time: '11:00 AM',
    status: 'SCHEDULED',
    feedback: 'Client requested physical presentation of floor layout and structural drawings.',
    rating: 5,
    created_at: new Date().toISOString(),
    lead: INITIAL_LEADS[2],
    property: FEATURED_PROPERTIES[2],
    agent: AGENTS[0],
  },
  {
    id: 'visit-2',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    lead_id: 'lead-2',
    property_id: '10000000-0000-0000-0000-000000000002',
    agent_id: 'p0000000-0000-0000-0000-000000000003',
    visit_date: '2026-10-07',
    visit_time: '04:00 PM',
    status: 'SCHEDULED',
    feedback: 'Family will attend together. Solar power specifications to be shared.',
    rating: 5,
    created_at: new Date().toISOString(),
    lead: INITIAL_LEADS[1],
    property: FEATURED_PROPERTIES[1],
    agent: AGENTS[2],
  },
  {
    id: 'visit-3',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    lead_id: 'lead-1',
    property_id: '10000000-0000-0000-0000-000000000001',
    agent_id: 'p0000000-0000-0000-0000-000000000002',
    visit_date: '2026-10-05',
    visit_time: '02:30 PM',
    status: 'COMPLETED',
    feedback: 'Client loved the double-height sea-view deck. Advancing to formal negotiation.',
    rating: 5,
    created_at: new Date().toISOString(),
    lead: INITIAL_LEADS[0],
    property: FEATURED_PROPERTIES[0],
    agent: AGENTS[1],
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    recipient_id: 'p0000000-0000-0000-0000-000000000001',
    title: 'High-Value Lead Enquired',
    message: 'Arjun Singhania submitted enquiry for The Horizon Sky Penthouse (₹18.5 Cr)',
    type: 'NEW_LEAD',
    is_read: false,
    action_url: '/admin/leads',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'notif-2',
    agency_id: 'a0000000-0000-0000-0000-000000000001',
    recipient_id: 'p0000000-0000-0000-0000-000000000001',
    title: 'Site Visit Confirmed for Tomorrow',
    message: 'Indiranagar Modernist Villa visit scheduled with Kavita Verma at 04:00 PM',
    type: 'VISIT_REMINDER',
    is_read: false,
    action_url: '/admin/site-visits',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export function useAppStore() {
  const [properties, setProperties] = useState<Property[]>(FEATURED_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(INITIAL_VISITS);
  const [favourites, setFavourites] = useState<string[]>([
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
  ]);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [currentRole, setCurrentRole] = useState<Profile>(AGENTS[0]); // Default to Agency Admin
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedProps = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (storedProps) setProperties(JSON.parse(storedProps));

      const storedLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedVisits = localStorage.getItem(STORAGE_KEYS.VISITS);
      if (storedVisits) setSiteVisits(JSON.parse(storedVisits));

      const storedFavs = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
      if (storedFavs) setFavourites(JSON.parse(storedFavs));

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

      const storedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedRole) setCurrentRole(JSON.parse(storedRole));
    } catch (e) {
      console.error('Error loading stored demo data', e);
    }
    setMounted(true);
  }, []);

  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new Event('radhix_store_updated'));
    } catch (e) {
      console.error('Error saving state', e);
    }
  };

  const toggleFavourite = (propertyId: string) => {
    const updated = favourites.includes(propertyId)
      ? favourites.filter((id) => id !== propertyId)
      : [...favourites, propertyId];
    setFavourites(updated);
    saveState(STORAGE_KEYS.FAVOURITES, updated);
  };

  const addLead = (newLeadData: Partial<Lead>) => {
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      agency_id: 'a0000000-0000-0000-0000-000000000001',
      name: newLeadData.name || 'Anonymous Client',
      email: newLeadData.email || '',
      phone: newLeadData.phone || '',
      property_id: newLeadData.property_id,
      message: newLeadData.message || 'Customer requested consultation via website form.',
      status: 'NEW',
      source: 'WEBSITE',
      preferred_visit_date: newLeadData.preferred_visit_date,
      preferred_visit_time: newLeadData.preferred_visit_time,
      notes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: properties.find((p) => p.id === newLeadData.property_id),
      agent: AGENTS[1], // auto-assign
    };

    const updatedLeads = [lead, ...leads];
    setLeads(updatedLeads);
    saveState(STORAGE_KEYS.LEADS, updatedLeads);

    // If preferred visit was requested, also schedule a site visit
    if (newLeadData.preferred_visit_date && newLeadData.property_id) {
      const visit: SiteVisit = {
        id: `visit-${Date.now()}`,
        agency_id: 'a0000000-0000-0000-0000-000000000001',
        lead_id: lead.id,
        property_id: newLeadData.property_id,
        agent_id: AGENTS[1].id,
        visit_date: newLeadData.preferred_visit_date,
        visit_time: newLeadData.preferred_visit_time || '11:00 AM',
        status: 'SCHEDULED',
        created_at: new Date().toISOString(),
        lead,
        property: properties.find((p) => p.id === newLeadData.property_id),
        agent: AGENTS[1],
      };
      const updatedVisits = [visit, ...siteVisits];
      setSiteVisits(updatedVisits);
      saveState(STORAGE_KEYS.VISITS, updatedVisits);
    }

    // Add Live Notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      agency_id: 'a0000000-0000-0000-0000-000000000001',
      recipient_id: AGENTS[0].id,
      title: 'New Lead Generated!',
      message: `${lead.name} submitted an enquiry for ${lead.property?.title || 'a luxury listing'}.`,
      type: 'NEW_LEAD',
      is_read: false,
      action_url: '/admin/leads',
      created_at: new Date().toISOString(),
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveState(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);

    return lead;
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l
    );
    setLeads(updated);
    saveState(STORAGE_KEYS.LEADS, updated);
  };

  const addProperty = (newProp: Partial<Property>) => {
    const prop: Property = {
      id: `prop-${Date.now()}`,
      agency_id: 'a0000000-0000-0000-0000-000000000001',
      title: newProp.title || 'Untitled Luxury Estate',
      slug: (newProp.title || 'property').toLowerCase().replace(/\s+/g, '-'),
      description: newProp.description || '',
      purpose: newProp.purpose || 'BUY',
      property_type: newProp.property_type || 'APARTMENT',
      status: 'AVAILABLE',
      price: newProp.price || 10000000,
      area_sqft: newProp.area_sqft || 2000,
      bedrooms: newProp.bedrooms || 3,
      bathrooms: newProp.bathrooms || 3,
      furnishing: newProp.furnishing || 'FURNISHED',
      address: newProp.address || 'Cyber City, Bangalore',
      city_id: newProp.city_id || 'c0000000-0000-0000-0000-000000000002',
      is_featured: Boolean(newProp.is_featured),
      view_count: 1,
      enquiry_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: newProp.images || [
        {
          id: `img-${Date.now()}`,
          property_id: `prop-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          is_cover: true,
          display_order: 1,
        },
      ],
    };

    const updated = [prop, ...properties];
    setProperties(updated);
    saveState(STORAGE_KEYS.PROPERTIES, updated);
    return prop;
  };

  const deleteProperty = (id: string) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    saveState(STORAGE_KEYS.PROPERTIES, updated);
  };

  const updateVisitStatus = (visitId: string, status: SiteVisit['status']) => {
    const updated = siteVisits.map((v) => (v.id === visitId ? { ...v, status } : v));
    setSiteVisits(updated);
    saveState(STORAGE_KEYS.VISITS, updated);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.VISITS);
    localStorage.removeItem(STORAGE_KEYS.FAVOURITES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    setProperties(FEATURED_PROPERTIES);
    setLeads(INITIAL_LEADS);
    setSiteVisits(INITIAL_VISITS);
    setFavourites(['10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002']);
    setNotifications(INITIAL_NOTIFICATIONS);
    window.dispatchEvent(new Event('radhix_store_updated'));
  };

  return {
    properties,
    leads,
    siteVisits,
    favourites,
    notifications,
    currentRole,
    setCurrentRole: (role: Profile) => {
      setCurrentRole(role);
      saveState(STORAGE_KEYS.CURRENT_USER, role);
    },
    toggleFavourite,
    addLead,
    updateLeadStatus,
    addProperty,
    deleteProperty,
    updateVisitStatus,
    resetDemoData,
    mounted,
  };
}
