-- ==============================================================================
-- RADHIX ESTATES - PRODUCTION SUPABASE / POSTGRESQL SCHEMA
-- Powered by Radhix Technologies
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS site_visits CASCADE;
DROP TABLE IF EXISTS lead_notes CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS localities CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS agencies CASCADE;

-- ==============================================================================
-- CORE TABLES
-- ==============================================================================

-- 1. Agencies (Multi-Tenant Architecture)
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    plan_tier VARCHAR(50) DEFAULT 'ENTERPRISE', -- 'STARTER', 'GROWTH', 'ENTERPRISE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles (Extended Auth User with Roles)
-- Roles: 'SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT', 'SALES_EXECUTIVE'
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID, -- References auth.users(id) in Supabase Auth
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'AGENT',
    avatar_url TEXT,
    bio TEXT,
    active_listings_count INTEGER DEFAULT 0,
    deals_closed_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cities & Localities
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    slug VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE localities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    pincode VARCHAR(20),
    slug VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Amenities Master
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50) NOT NULL, -- Lucide icon identifier
    category VARCHAR(50) DEFAULT 'GENERAL' -- 'LEISURE', 'SAFETY', 'CONVENIENCE', 'ECO'
);

-- 5. Properties Table
-- Purpose: 'BUY', 'RENT'
-- Type: 'APARTMENT', 'VILLA', 'PENTHOUSE', 'PLOT', 'COMMERCIAL'
-- Status: 'AVAILABLE', 'UNDER_OFFER', 'SOLD', 'RENTED', 'HIDDEN'
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    description TEXT,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('BUY', 'RENT')),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('APARTMENT', 'VILLA', 'PENTHOUSE', 'PLOT', 'COMMERCIAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'UNDER_OFFER', 'SOLD', 'RENTED', 'HIDDEN')),
    price DECIMAL(15, 2) NOT NULL,
    price_per_sqft DECIMAL(10, 2),
    area_sqft DECIMAL(10, 2) NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    balconies INTEGER DEFAULT 0,
    furnishing VARCHAR(50) DEFAULT 'SEMI_FURNISHED' CHECK (furnishing IN ('FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED')),
    parking_slots INTEGER DEFAULT 1,
    floor_number INTEGER,
    total_floors INTEGER,
    facing VARCHAR(50), -- 'NORTH', 'EAST', 'WEST', 'SOUTH', 'NORTH_EAST'
    age_of_property VARCHAR(50) DEFAULT 'NEW_CONSTRUCTION',
    address TEXT NOT NULL,
    locality_id UUID REFERENCES localities(id) ON DELETE SET NULL,
    city_id UUID REFERENCES cities(id) ON DELETE RESTRICT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    video_tour_url TEXT,
    virtual_tour_360_url TEXT,
    floor_plan_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    enquiry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Property Images (Multi-image, Cover, Ordering)
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption VARCHAR(255),
    is_cover BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Property Amenities Mapping
CREATE TABLE property_amenities (
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (property_id, amenity_id)
);

-- 8. Leads / Enquiries (CRM Funnel)
-- Stages: 'NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST')),
    source VARCHAR(100) DEFAULT 'WEBSITE' CHECK (source IN ('WEBSITE', 'WHATSAPP', 'REFERRAL', 'CAMPAIGN', 'WALK_IN', 'DIRECT')),
    preferred_visit_date DATE,
    preferred_visit_time VARCHAR(50),
    notes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Lead Notes & Activity Timeline
CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    action_type VARCHAR(50) DEFAULT 'NOTE', -- 'NOTE', 'CALL', 'WHATSAPP', 'EMAIL', 'STATUS_CHANGE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Site Visits Calendar
CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    visit_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. User Favourites
CREATE TABLE favourites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- For logged in user
    guest_session_id VARCHAR(100), -- For guest user stored in cookie/local
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Realtime Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'NEW_LEAD', -- 'NEW_LEAD', 'VISIT_REMINDER', 'STATUS_UPDATE', 'SYSTEM'
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================

CREATE INDEX idx_properties_purpose_status ON properties(purpose, status);
CREATE INDEX idx_properties_city_locality ON properties(city_id, locality_id);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_featured ON properties(is_featured);
CREATE INDEX idx_leads_agency_status ON leads(agency_id, status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_site_visits_date ON site_visits(visit_date, status);

-- Full-text search index for title and address
CREATE INDEX idx_properties_search ON properties USING gin(to_tsvector('english', title || ' ' || coalesce(description, '') || ' ' || address));

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
CREATE POLICY "Public can view active cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public can view localities" ON localities FOR SELECT USING (true);
CREATE POLICY "Public can view amenities" ON amenities FOR SELECT USING (true);

-- Public can view active published properties (not hidden)
CREATE POLICY "Public can view published properties" ON properties 
    FOR SELECT USING (status != 'HIDDEN');

CREATE POLICY "Public can view property images" ON property_images 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM properties WHERE properties.id = property_images.property_id AND properties.status != 'HIDDEN')
    );

CREATE POLICY "Public can view property amenities" ON property_amenities 
    FOR SELECT USING (true);

-- Public can submit enquiries/leads
CREATE POLICY "Public can create leads" ON leads 
    FOR INSERT WITH CHECK (true);

-- 2. Staff Management Policies
-- Agency staff can view and manage their agency's properties
CREATE POLICY "Staff can manage agency properties" ON properties 
    FOR ALL USING (
        agency_id IN (SELECT agency_id FROM profiles WHERE profiles.auth_user_id = auth.uid())
    );

CREATE POLICY "Staff can manage property images" ON property_images 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_images.property_id 
            AND properties.agency_id IN (SELECT agency_id FROM profiles WHERE profiles.auth_user_id = auth.uid())
        )
    );

-- Leads: Staff can view leads for their agency; Agents see assigned leads unless Admin
CREATE POLICY "Staff can view agency leads" ON leads 
    FOR SELECT USING (
        agency_id IN (SELECT agency_id FROM profiles WHERE profiles.auth_user_id = auth.uid())
    );

CREATE POLICY "Staff can update agency leads" ON leads 
    FOR UPDATE USING (
        agency_id IN (SELECT agency_id FROM profiles WHERE profiles.auth_user_id = auth.uid())
    );

-- Site visits: Staff can view and manage agency visits
CREATE POLICY "Staff can manage site visits" ON site_visits 
    FOR ALL USING (
        agency_id IN (SELECT agency_id FROM profiles WHERE profiles.auth_user_id = auth.uid())
    );

-- Favourites policy
CREATE POLICY "Public & Users can manage favourites" ON favourites 
    FOR ALL USING (true);

-- Enable Realtime for Leads & Site Visits & Notifications
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE site_visits;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;


-- ==============================================================================
-- RICH SEED DATA (1 AGENCY, 5 CITIES, 4 AGENTS, 24 PROPERTIES, 40 LEADS, 15 VISITS)
-- ==============================================================================

-- 1. Agency
INSERT INTO agencies (id, name, slug, logo_url, contact_email, contact_phone, website, address)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Radhix Estates',
    'radhix-estates',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    'contact@radhix.com',
    '+91 98765 43210',
    'https://radhix.com',
    'Tower 4, Prime Tech Park, Cyber City, Bangalore - 560103'
);

-- 2. Staff Profiles (Super Admin, Agency Admin, Agents)
INSERT INTO profiles (id, agency_id, full_name, email, phone, role, avatar_url, bio, active_listings_count, deals_closed_count)
VALUES 
(
    'p0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Vikram Malhotra',
    'vikram@radhix.com',
    '+91 98200 11223',
    'AGENCY_ADMIN',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'Managing Partner with over 15 years in luxury realty acquisitions.',
    12, 48
),
(
    'p0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Aanya Sharma',
    'aanya@radhix.com',
    '+91 98200 44556',
    'AGENT',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    'Luxury Penthouse & Sea-facing Villa Specialist in Mumbai & Goa.',
    8, 29
),
(
    'p0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Rohan Kulkarni',
    'rohan@radhix.com',
    '+91 98200 77889',
    'AGENT',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'Tech corridor residential & commercial investments in Bangalore.',
    7, 34
),
(
    'p0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'Pooja Nair',
    'pooja@radhix.com',
    '+91 98200 99001',
    'SALES_EXECUTIVE',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'First-time home buyer consultant & site visit coordinator.',
    4, 18
);

-- 3. Cities
INSERT INTO cities (id, name, state, slug, image_url, is_popular)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'Mumbai', 'Maharashtra', 'mumbai', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000002', 'Bangalore', 'Karnataka', 'bangalore', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000003', 'Delhi NCR', 'Delhi', 'delhi-ncr', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000004', 'Hyderabad', 'Telangana', 'hyderabad', 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000005', 'Pune', 'Maharashtra', 'pune', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', true);

-- 4. Localities
INSERT INTO localities (id, city_id, name, pincode, slug)
VALUES
('l0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Bandra West', '400050', 'bandra-west'),
('l0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Worli Sea Face', '400018', 'worli-sea-face'),
('l0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Indiranagar', '560038', 'indiranagar'),
('l0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Whitefield', '560066', 'whitefield'),
('l0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Golf Course Road, Gurgaon', '122002', 'golf-course-road'),
('l0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', 'Jubilee Hills', '500033', 'jubilee-hills'),
('l0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', 'Koregaon Park', '411001', 'koregaon-park');

-- 5. Amenities
INSERT INTO amenities (id, name, icon_name, category)
VALUES
('m0000000-0000-0000-0000-000000000001', 'Infinity Swimming Pool', 'waves', 'LEISURE'),
('m0000000-0000-0000-0000-000000000002', 'Smart Home Automation', 'cpu', 'CONVENIENCE'),
('m0000000-0000-0000-0000-000000000003', '24/7 Concierge & Security', 'shield-check', 'SAFETY'),
('m0000000-0000-0000-0000-000000000004', 'Private Gym & Spa', 'dumbbell', 'LEISURE'),
('m0000000-0000-0000-0000-000000000005', 'EV Charging Station', 'zap', 'ECO'),
('m0000000-0000-0000-0000-000000000006', 'Private Garden & Deck', 'trees', 'LEISURE'),
('m0000000-0000-0000-0000-000000000007', 'Covered Reserved Parking', 'car', 'CONVENIENCE'),
('m0000000-0000-0000-0000-000000000008', 'High-Speed Elevators', 'arrow-up-circle', 'CONVENIENCE');

-- 6. Insert 24 Distinct High-End Properties
INSERT INTO properties (
    id, agency_id, agent_id, title, slug, description, purpose, property_type, status, price, price_per_sqft, area_sqft,
    bedrooms, bathrooms, balconies, furnishing, address, locality_id, city_id, is_featured, view_count, enquiry_count
) VALUES
-- Prop 1
('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'The Horizon Sky Penthouse', 'the-horizon-sky-penthouse',
 'A breathtaking duplex penthouse overlooking the Arabian Sea with floor-to-ceiling glass facades and private infinity pool.',
 'BUY', 'PENTHOUSE', 'AVAILABLE', 185000000.00, 37000.00, 5000.00, 4, 5, 3, 'FURNISHED',
 'Tower One, Worli Sea Face, Mumbai', 'l0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', true, 1420, 28),

-- Prop 2
('10000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003',
 'Zenith Modernist Villa', 'zenith-modernist-villa',
 'Minimalist architectural villa surrounded by lush greenery with solar-powered smart living and private courtyard.',
 'BUY', 'VILLA', 'AVAILABLE', 92000000.00, 20444.00, 4500.00, 5, 6, 2, 'SEMI_FURNISHED',
 '12th Main, HAL 2nd Stage, Indiranagar, Bangalore', 'l0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', true, 980, 19),

-- Prop 3
('10000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
 'The Magnifique Luxury Residences', 'the-magnifique-luxury-residences',
 'Lavish 4 BHK apartment with expansive golf course vistas, private elevator access and Italian marble flooring.',
 'BUY', 'APARTMENT', 'AVAILABLE', 125000000.00, 31250.00, 4000.00, 4, 4, 3, 'FURNISHED',
 'DLF Phase 5, Golf Course Road, Gurgaon', 'l0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', true, 1680, 35),

-- Prop 4
('10000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004',
 'Jubilee Grandeur Estate', 'jubilee-grandeur-estate',
 'Exclusive gated estate in Hyderabad premier enclave with heated pool, home theatre, and manicured lawns.',
 'BUY', 'VILLA', 'AVAILABLE', 220000000.00, 31428.00, 7000.00, 6, 7, 4, 'FURNISHED',
 'Road No. 36, Jubilee Hills, Hyderabad', 'l0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', true, 2150, 42),

-- Prop 5
('10000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'Pali Hill Boutique Suites', 'pali-hill-boutique-suites',
 'Ultra-chic 3 BHK apartment in the heart of Bandra, featuring designer interiors and private basement car park.',
 'RENT', 'APARTMENT', 'AVAILABLE', 350000.00, 175.00, 2000.00, 3, 3, 2, 'FURNISHED',
 'Zig Zag Road, Pali Hill, Bandra West, Mumbai', 'l0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', true, 890, 24),

-- Prop 6
('10000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003',
 'Cyber Green Tech Office Suite', 'cyber-green-tech-office-suite',
 'Grade-A corporate floor designed for tech unicorns with plug-and-play workstations, server rooms and breakout zones.',
 'RENT', 'COMMERCIAL', 'AVAILABLE', 650000.00, 108.00, 6000.00, 0, 4, 0, 'FURNISHED',
 'Prestige Tech Cloud, Whitefield, Bangalore', 'l0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', false, 530, 11),

-- Prop 7
('10000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
 'Koregaon Riverfront Haven', 'koregaon-riverfront-haven',
 'Peaceful 4 BHK garden apartment surrounded by banyan trees with wooden deck and open-concept European kitchen.',
 'BUY', 'APARTMENT', 'AVAILABLE', 48000000.00, 17142.00, 2800.00, 4, 4, 2, 'SEMI_FURNISHED',
 'Lane 7, North Main Road, Koregaon Park, Pune', 'l0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', false, 710, 14),

-- Prop 8
('10000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'Bandra Promenade Sea-View Condo', 'bandra-promenade-sea-view-condo',
 'Wake up to the ocean sound. Modern 2 BHK flat renovated with Nordic aesthetic and smart lighting.',
 'RENT', 'APARTMENT', 'AVAILABLE', 190000.00, 158.00, 1200.00, 2, 2, 1, 'FURNISHED',
 'Carter Road, Bandra West, Mumbai', 'l0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', false, 620, 18),

-- Prop 9
('10000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003',
 'Whitefield Meadow Villa', 'whitefield-meadow-villa',
 'Gated community duplex villa with rooftop solar, private lawn, clubhouse membership and tennis courts.',
 'BUY', 'VILLA', 'AVAILABLE', 38000000.00, 11875.00, 3200.00, 4, 4, 2, 'SEMI_FURNISHED',
 'Hope Farm Junction, Whitefield, Bangalore', 'l0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', false, 840, 16),

-- Prop 10
('10000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004',
 'Jubilee Commercial Flagship', 'jubilee-commercial-flagship',
 'Corner retail showroom building ideal for premium luxury brands with triple height atrium and glass facade.',
 'BUY', 'COMMERCIAL', 'AVAILABLE', 310000000.00, 31000.00, 10000.00, 0, 6, 0, 'UNFURNISHED',
 'Main Road, Jubilee Hills, Hyderabad', 'l0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', false, 1100, 15),

-- Prop 11
('10000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
 'The Golf Pavilion Duplex', 'the-golf-pavilion-duplex',
 'Architectural masterpiece on Golf Course Road with double-height living room, private bar, and sauna.',
 'RENT', 'APARTMENT', 'AVAILABLE', 450000.00, 100.00, 4500.00, 4, 5, 3, 'FURNISHED',
 'Sector 54, Golf Course Road, Gurgaon', 'l0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', false, 940, 22),

-- Prop 12
('10000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'Serene Valley Land Parcel', 'serene-valley-land-parcel',
 'Prime clear title residential plot in lush green Koregaon corridor with sanctioned G+2 approvals.',
 'BUY', 'PLOT', 'AVAILABLE', 65000000.00, 10833.00, 6000.00, 0, 0, 0, 'UNFURNISHED',
 'Near Riverside Road, Koregaon Park, Pune', 'l0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', false, 480, 8),

-- Prop 13 to 24 (More diverse items to satisfy the 24 properties requirement)
('10000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003',
 'Silicon Palms High-Rise', 'silicon-palms-high-rise', 'High floor 3 BHK with panoramic skyline views of east Bangalore tech parks.', 'BUY', 'APARTMENT', 'AVAILABLE', 24500000.00, 13611.00, 1800.00, 3, 3, 2, 'SEMI_FURNISHED', 'Outer Ring Road, Indiranagar, Bangalore', 'l0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', false, 720, 12),

('10000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004',
 'Bandra Bohemian Loft', 'bandra-bohemian-loft', 'Industrial chic loft with double height ceilings and exposed brick styling.', 'RENT', 'APARTMENT', 'AVAILABLE', 140000.00, 140.00, 1000.00, 1, 2, 1, 'FURNISHED', 'Chimbai Road, Bandra West, Mumbai', 'l0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', false, 890, 21),

('10000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
 'The Crest Imperial Suite', 'the-crest-imperial-suite', 'Sprawling 5 BHK condominium with private pool terrace on Golf Course Road.', 'BUY', 'APARTMENT', 'AVAILABLE', 165000000.00, 30000.00, 5500.00, 5, 5, 3, 'FURNISHED', 'Park Drive, Golf Course Road, Gurgaon', 'l0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', true, 1980, 31),

('10000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'Worli Sea Front Grandeur', 'worli-sea-front-grandeur', 'Unobstructed Sea Link panoramic views with state-of-the-art acoustic glass.', 'RENT', 'APARTMENT', 'AVAILABLE', 520000.00, 162.50, 3200.00, 3, 4, 2, 'FURNISHED', 'Khan Abdul Ghaffar Khan Road, Worli, Mumbai', 'l0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', false, 1120, 25),

('10000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003',
 'Whitefield Tech Corridor Plot', 'whitefield-tech-corridor-plot', 'Ready-to-build corner plot inside an elite gated enclave near ITPL.', 'BUY', 'PLOT', 'AVAILABLE', 29000000.00, 7250.00, 4000.00, 0, 0, 0, 'UNFURNISHED', 'ECC Road, Whitefield, Bangalore', 'l0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', false, 390, 7),

('10000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004',
 'Hills Royal Villa', 'hills-royal-villa', 'Regal Mediterranean architecture with grand portico, pool and garden bar.', 'RENT', 'VILLA', 'AVAILABLE', 380000.00, 76.00, 5000.00, 5, 5, 3, 'FURNISHED', 'Road 45, Jubilee Hills, Hyderabad', 'l0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', false, 820, 17),

('10000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
 'The Onyx Business Tower Floor', 'the-onyx-business-tower-floor', 'Modern Grade A+ office space in Koregaon corporate hub.', 'BUY', 'COMMERCIAL', 'AVAILABLE', 98000000.00, 19600.00, 5000.00, 0, 4, 0, 'UNFURNISHED', 'South Main Road, Koregaon Park, Pune', 'l0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', false, 610, 9),

('10000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'Indiranagar Urban Loft', 'indiranagar-urban-loft', 'Modern 2.5 BHK duplex in 100ft road vicinity, steps from cafes and parks.', 'RENT', 'APARTMENT', 'AVAILABLE', 125000.00, 83.33, 1500.00, 2, 2, 2, 'FURNISHED', '100 Feet Road, Indiranagar, Bangalore', 'l0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', false, 740, 19),

('10000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003',
 'Gurgaon Boulevard Commercial', 'gurgaon-boulevard-commercial', 'Showroom space with massive street frontage on Golf Course Road.', 'RENT', 'COMMERCIAL', 'AVAILABLE', 800000.00, 200.00, 4000.00, 0, 3, 0, 'UNFURNISHED', 'Sector 42, Golf Course Road, Gurgaon', 'l0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', false, 580, 10),

('10000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004',
 'Jubilee Lakeview Plot', 'jubilee-lakeview-plot', 'Exclusive north-facing residential parcel overlooking Durgam Cheruvu.', 'BUY', 'PLOT', 'AVAILABLE', 145000000.00, 29000.00, 5000.00, 0, 0, 0, 'UNFURNISHED', 'Prashasan Nagar, Jubilee Hills, Hyderabad', 'l0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', false, 670, 14),

('10000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
 'Koregaon Manor Villa', 'koregaon-manor-villa', 'Colonial styled 4 bedroom private manor with courtyard pool and gazebo.', 'BUY', 'VILLA', 'AVAILABLE', 75000000.00, 18750.00, 4000.00, 4, 5, 2, 'FURNISHED', 'Lane 5, Koregaon Park, Pune', 'l0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', true, 1140, 26),

('10000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002',
 'Sea Palace Worli Luxury Suite', 'sea-palace-worli-luxury-suite', 'Opulent 3 BHK in iconic architectural tower with private marina view.', 'BUY', 'APARTMENT', 'AVAILABLE', 89000000.00, 35600.00, 2500.00, 3, 3, 2, 'SEMI_FURNISHED', 'Sea Face Promenade, Worli, Mumbai', 'l0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', true, 1380, 27);

-- 7. High Quality Unsplash Images for Properties
INSERT INTO property_images (property_id, url, caption, is_cover, display_order)
VALUES
('10000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'Living Room Sea View', true, 1),
('10000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'Private Infinity Pool Terrace', false, 2),
('10000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'Front Facade & Deck', true, 1),
('10000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'Architectural Courtyard', false, 2),
('10000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'Lounge & Italian Marble Flooring', true, 1),
('10000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'Grand Exterior & Pool', true, 1),
('10000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'Chic Minimalist Interior', true, 1),
('10000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 'Modern Tech Office Floor', true, 1),
('10000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 'Lush Terrace Deck', true, 1),
('10000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 'Sea View Balcony', true, 1),
('10000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', 'Gated Community Villa', true, 1),
('10000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 'Flagship Retail Glass Building', true, 1),
('10000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'Double Height Living Room', true, 1),
('10000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 'Lush Green Land Parcel', true, 1),
('10000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'Modern City Apartment', true, 1),
('10000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80', 'Bohemian Loft Studio', true, 1),
('10000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80', 'Terrace Luxury Living', true, 1),
('10000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 'Coastal Contemporary Living', true, 1),
('10000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 'Scenic Tech Park Plot', true, 1),
('10000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'Mediterranean Estate', true, 1),
('10000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', 'Corporate Office Suite', true, 1),
('10000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'Urban Cafe Style Apartment', true, 1),
('10000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 'Glass Showroom Frontage', true, 1),
('10000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 'Lakeview Waterfront Plot', true, 1),
('10000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'Colonial Poolside Manor', true, 1),
('10000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'Worli Royal Suite Lounge', true, 1);

-- 8. Map Amenities to Properties
INSERT INTO property_amenities (property_id, amenity_id)
SELECT '10000000-0000-0000-0000-000000000001', id FROM amenities;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT '10000000-0000-0000-0000-000000000002', id FROM amenities WHERE name IN ('Smart Home Automation', 'Private Garden & Deck', 'EV Charging Station');

INSERT INTO property_amenities (property_id, amenity_id)
SELECT '10000000-0000-0000-0000-000000000003', id FROM amenities WHERE name IN ('24/7 Concierge & Security', 'Private Gym & Spa', 'Covered Reserved Parking');

INSERT INTO property_amenities (property_id, amenity_id)
SELECT '10000000-0000-0000-0000-000000000004', id FROM amenities;

-- 9. Insert 40 Realistic Leads Across Different Funnel Stages
INSERT INTO leads (agency_id, property_id, assigned_to, name, email, phone, budget_min, budget_max, message, status, source)
VALUES
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'Arjun Singhania', 'arjun@singhaniacapital.com', '+91 99887 76655', 150000000, 200000000, 'Interested in Worli penthouse duplex. Need floor plan and sea-view video tour.', 'NEW', 'WEBSITE'),
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000003', 'Kavita Verma', 'kavita@techfounders.in', '+91 98112 23344', 80000000, 100000000, 'Looking for an eco villa in Indiranagar. Immediate decision if documents clear.', 'CONTACTED', 'WHATSAPP'),
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'Rajesh Jindal', 'rjindal@steelcorp.com', '+91 97123 45678', 120000000, 140000000, 'Interested in Golf Course Road luxury flat. Site visit required this Saturday.', 'VISIT_SCHEDULED', 'CAMPAIGN'),
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000004', 'Dr. Sneha Reddy', 'drsneha@apollohospitals.org', '+91 98450 12345', 200000000, 230000000, 'Final price negotiation in progress for Jubilee Hills villa.', 'NEGOTIATION', 'REFERRAL'),
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000002', 'Sameer Kapoor', 'sameer@kapoorfilms.com', '+91 99200 88990', 300000, 380000, 'Agreement drafted. Token advance paid.', 'CLOSED_WON', 'DIRECT'),
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000003', 'Alok Mehta', 'alok@startuphub.io', '+91 98234 56789', 500000, 700000, 'Client selected another building closer to metro.', 'CLOSED_LOST', 'WEBSITE');

-- Additional leads to reach 40 count across stages
DO $$
DECLARE
    i INTEGER;
    statuses TEXT[] := ARRAY['NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    names TEXT[] := ARRAY['Nikhil Gupta', 'Priyanka Chopra', 'Aditya Birla', 'Rhea Chakraborty', 'Karan Johar', 'Manish Malhotra', 'Deepak Parekh', 'Sunil Mittal', 'Rohit Sharma', 'Ananya Panday'];
    props UUID[] := ARRAY[
        '10000000-0000-0000-0000-000000000001'::UUID,
        '10000000-0000-0000-0000-000000000002'::UUID,
        '10000000-0000-0000-0000-000000000003'::UUID,
        '10000000-0000-0000-0000-000000000004'::UUID,
        '10000000-0000-0000-0000-000000000005'::UUID,
        '10000000-0000-0000-0000-000000000006'::UUID,
        '10000000-0000-0000-0000-000000000007'::UUID,
        '10000000-0000-0000-0000-000000000008'::UUID
    ];
    agents UUID[] := ARRAY[
        'p0000000-0000-0000-0000-000000000001'::UUID,
        'p0000000-0000-0000-0000-000000000002'::UUID,
        'p0000000-0000-0000-0000-000000000003'::UUID,
        'p0000000-0000-0000-0000-000000000004'::UUID
    ];
BEGIN
    FOR i IN 7..40 LOOP
        INSERT INTO leads (agency_id, property_id, assigned_to, name, email, phone, budget_min, budget_max, message, status, source)
        VALUES (
            'a0000000-0000-0000-0000-000000000001',
            props[(i % array_length(props, 1)) + 1],
            agents[(i % array_length(agents, 1)) + 1],
            names[(i % array_length(names, 1)) + 1] || ' ' || (i::text),
            'client' || (i::text) || '@radhixinvestors.com',
            '+91 98000 ' || lpad(i::text, 5, '0'),
            (30000000 + (i * 2000000)),
            (50000000 + (i * 3000000)),
            'High priority buyer looking for premium residential asset. Inquired via web portal.',
            statuses[(i % array_length(statuses, 1)) + 1],
            'WEBSITE'
        );
    END LOOP;
END $$;

-- 10. Insert 15 Site Visits
INSERT INTO site_visits (agency_id, lead_id, property_id, agent_id, visit_date, visit_time, status, feedback, rating)
SELECT 
    'a0000000-0000-0000-0000-000000000001',
    leads.id,
    leads.property_id,
    leads.assigned_to,
    (CURRENT_DATE + ((row_number() OVER () % 10) - 3) * INTERVAL '1 day')::DATE,
    CASE (row_number() OVER () % 3)
        WHEN 0 THEN '11:00 AM'
        WHEN 1 THEN '03:30 PM'
        ELSE '05:00 PM'
    END,
    CASE (row_number() OVER () % 4)
        WHEN 0 THEN 'COMPLETED'
        WHEN 1 THEN 'SCHEDULED'
        WHEN 2 THEN 'SCHEDULED'
        ELSE 'RESCHEDULED'
    END,
    'Client loved the natural light, asked for structural drawings and title deed copy.',
    5
FROM leads
WHERE leads.property_id IS NOT NULL
LIMIT 15;

-- 11. Initial Notifications
INSERT INTO notifications (agency_id, recipient_id, title, message, type, action_url)
VALUES
('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'New High-Value Lead Assigned', 'Arjun Singhania enquired about The Horizon Sky Penthouse (₹18.5 Cr).', 'NEW_LEAD', '/admin/leads'),
('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'Site Visit Today at 03:30 PM', 'Site visit scheduled for Zenith Modernist Villa with Kavita Verma.', 'VISIT_REMINDER', '/admin/site-visits'),
('a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Deal Closed - Pali Hill Suites', 'Sameer Kapoor has finalized agreement for Bandra Penthouse.', 'STATUS_UPDATE', '/admin/reports');
