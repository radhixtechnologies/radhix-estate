export type UserRole = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENT' | 'SALES_EXECUTIVE';

export type PropertyPurpose = 'BUY' | 'RENT';

export type PropertyType = 'APARTMENT' | 'VILLA' | 'PENTHOUSE' | 'PLOT' | 'COMMERCIAL';

export type PropertyStatus = 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'RENTED' | 'HIDDEN';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export type LeadSource = 'WEBSITE' | 'WHATSAPP' | 'REFERRAL' | 'CAMPAIGN' | 'WALK_IN' | 'DIRECT';

export type SiteVisitStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  is_active: boolean;
  plan_tier: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  auth_user_id?: string;
  agency_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  active_listings_count: number;
  deals_closed_count: number;
  is_active: boolean;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  slug: string;
  image_url?: string;
  is_popular: boolean;
}

export interface Locality {
  id: string;
  city_id: string;
  name: string;
  pincode?: string;
  slug: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon_name: string;
  category: 'GENERAL' | 'LEISURE' | 'SAFETY' | 'CONVENIENCE' | 'ECO';
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  caption?: string;
  is_cover: boolean;
  display_order: number;
}

export interface Property {
  id: string;
  agency_id: string;
  agent_id?: string;
  title: string;
  slug: string;
  description: string;
  purpose: PropertyPurpose;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  price_per_sqft?: number;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  balconies?: number;
  furnishing: 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
  parking_slots?: number;
  floor_number?: number;
  total_floors?: number;
  facing?: string;
  age_of_property?: string;
  address: string;
  locality_id?: string;
  city_id: string;
  latitude?: number;
  longitude?: number;
  video_tour_url?: string;
  virtual_tour_360_url?: string;
  floor_plan_url?: string;
  is_featured: boolean;
  view_count: number;
  enquiry_count: number;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
  amenities?: Amenity[];
  city?: City;
  locality?: Locality;
  agent?: Profile;
}

export interface Lead {
  id: string;
  agency_id: string;
  property_id?: string;
  assigned_to?: string;
  name: string;
  email?: string;
  phone: string;
  budget_min?: number;
  budget_max?: number;
  message?: string;
  status: LeadStatus;
  source: LeadSource;
  preferred_visit_date?: string;
  preferred_visit_time?: string;
  notes_count: number;
  created_at: string;
  updated_at: string;
  property?: Property;
  agent?: Profile;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  created_by?: string;
  note: string;
  action_type: 'NOTE' | 'CALL' | 'WHATSAPP' | 'EMAIL' | 'STATUS_CHANGE';
  created_at: string;
  author?: Profile;
}

export interface SiteVisit {
  id: string;
  agency_id: string;
  lead_id: string;
  property_id: string;
  agent_id?: string;
  visit_date: string;
  visit_time: string;
  status: SiteVisitStatus;
  feedback?: string;
  rating?: number;
  created_at: string;
  lead?: Lead;
  property?: Property;
  agent?: Profile;
}

export interface Notification {
  id: string;
  agency_id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: 'NEW_LEAD' | 'VISIT_REMINDER' | 'STATUS_UPDATE' | 'SYSTEM';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}
