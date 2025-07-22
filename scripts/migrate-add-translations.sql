-- Migration: Add translation fields for multilingual support
-- This script adds English and Swahili name fields to services and categories tables

-- Add translation fields to categories table
ALTER TABLE categories 
ADD COLUMN name_en VARCHAR(255),
ADD COLUMN name_sw VARCHAR(255),
ADD COLUMN description_en TEXT,
ADD COLUMN description_sw TEXT;

-- Update existing categories with English names (assuming current names are English)
UPDATE categories SET name_en = name WHERE name_en IS NULL;

-- Add translation fields to services table
ALTER TABLE services 
ADD COLUMN name_en VARCHAR(255),
ADD COLUMN name_sw VARCHAR(255),
ADD COLUMN description_en TEXT,
ADD COLUMN description_sw TEXT;

-- Update existing services with English names (assuming current names are English)
UPDATE services SET name_en = name WHERE name_en IS NULL;

-- Add translation fields to providers table for specialization
ALTER TABLE providers 
ADD COLUMN specialization_en VARCHAR(255),
ADD COLUMN specialization_sw VARCHAR(255);

-- Update existing providers with English specializations
UPDATE providers SET specialization_en = specialization WHERE specialization_en IS NULL;

-- Create translations table for dynamic content
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  english TEXT NOT NULL,
  swahili TEXT NOT NULL,
  context VARCHAR(50) DEFAULT 'ui', -- 'ui', 'service', 'category', 'error', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert common UI translations
INSERT INTO translations (key_name, english, swahili, context) VALUES
-- Error messages
('error.general', 'Something went wrong. Please try again.', 'Kuna tatizo. Tafadhali jaribu tena.', 'error'),
('error.network', 'Network error. Please check your connection.', 'Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.', 'error'),
('error.not_found', 'The requested resource was not found.', 'Rasilimali iliyoombwa haijapatikana.', 'error'),
('error.unauthorized', 'You are not authorized to perform this action.', 'Huna ruhusa ya kufanya kitendo hiki.', 'error'),

-- Success messages
('success.booking_created', 'Booking created successfully!', 'Oda imeundwa kikamilifu!', 'success'),
('success.booking_updated', 'Booking updated successfully!', 'Oda imesasishwa kikamilifu!', 'success'),
('success.booking_cancelled', 'Booking cancelled successfully!', 'Oda imeghairiwa kikamilifu!', 'success'),
('success.profile_updated', 'Profile updated successfully!', 'Wasifu umesasishwa kikamilifu!', 'success'),

-- Booking status
('status.pending', 'Pending', 'Inasubiri', 'status'),
('status.confirmed', 'Confirmed', 'Imeidhinishwa', 'status'),
('status.in_progress', 'In Progress', 'Inaendelea', 'status'),
('status.completed', 'Completed', 'Imekamilika', 'status'),
('status.cancelled', 'Cancelled', 'Imeghairiwa', 'status'),
('status.unassigned', 'Unassigned', 'Haijagawiwa', 'status'),

-- Dashboard labels
('dashboard.welcome', 'Welcome back', 'Karibu tena', 'dashboard'),
('dashboard.total_bookings', 'Total Bookings', 'Jumla ya Oda', 'dashboard'),
('dashboard.active_bookings', 'Active Bookings', 'Oda Zinazoendelea', 'dashboard'),
('dashboard.completed_bookings', 'Completed Bookings', 'Oda Zilizokamilika', 'dashboard'),
('dashboard.total_earnings', 'Total Earnings', 'Jumla ya Mapato', 'dashboard'),
('dashboard.average_rating', 'Average Rating', 'Makadirio ya Wastani', 'dashboard'),

-- Provider specific
('provider.verified', 'Verified Provider', 'Mtoa Huduma Mliodhinishwa', 'provider'),
('provider.experience', 'Years of Experience', 'Miaka ya Uzoefu', 'provider'),
('provider.jobs_completed', 'Jobs Completed', 'Kazi Zilizokamilika', 'provider'),
('provider.contact', 'Contact Provider', 'Wasiliana na Mtoa Huduma', 'provider'),
('provider.call_now', 'Call Now', 'Piga Sasa', 'provider'),

-- User specific
('user.my_bookings', 'My Bookings', 'Oda Zangu', 'user'),
('user.book_new_service', 'Book New Service', 'Weka Oda ya Huduma Mpya', 'user'),
('user.download_invoice', 'Download Invoice', 'Pakua Anwani', 'user'),
('user.rate_service', 'Rate Service', 'Kadiria Huduma', 'user'),

-- Admin specific
('admin.manage_users', 'Manage Users', 'Simamia Watumiaji', 'admin'),
('admin.manage_providers', 'Manage Providers', 'Simamia Watoa Huduma', 'admin'),
('admin.manage_services', 'Manage Services', 'Simamia Huduma', 'admin'),
('admin.manage_categories', 'Manage Categories', 'Simamia Kategoria', 'admin'),
('admin.unassigned_bookings', 'Unassigned Bookings', 'Oda Zisizogawiwa', 'admin'),
('admin.assign_provider', 'Assign Provider', 'Gawa Mtoa Huduma', 'admin'),

-- Common actions
('action.view', 'View', 'Ona', 'action'),
('action.edit', 'Edit', 'Hariri', 'action'),
('action.delete', 'Delete', 'Futa', 'action'),
('action.save', 'Save', 'Hifadhi', 'action'),
('action.cancel', 'Cancel', 'Ghairi', 'action'),
('action.confirm', 'Confirm', 'Thibitisha', 'action'),
('action.accept', 'Accept', 'Kubali', 'action'),
('action.reject', 'Reject', 'Kataa', 'action'),
('action.complete', 'Complete', 'Kamilisha', 'action'),

-- Form labels
('form.required', 'This field is required', 'Sehemu hii inahitajika', 'form'),
('form.invalid_email', 'Please enter a valid email address', 'Tafadhali weka anwani ya barua pepe sahihi', 'form'),
('form.invalid_phone', 'Please enter a valid phone number', 'Tafadhali weka nambari ya simu sahihi', 'form'),
('form.password_min', 'Password must be at least 6 characters', 'Nywila lazima iwe na herufi 6 au zaidi', 'form'),

-- Time and date
('time.today', 'Today', 'Leo', 'time'),
('time.tomorrow', 'Tomorrow', 'Kesho', 'time'),
('time.yesterday', 'Yesterday', 'Jana', 'time'),
('time.this_week', 'This Week', 'Wiki Hii', 'time'),
('time.last_week', 'Last Week', 'Wiki Iliyopita', 'time'),
('time.this_month', 'This Month', 'Mwezi Huu', 'time'),
('time.last_month', 'Last Month', 'Mwezi Uliopita', 'time'),

-- Currency and pricing
('currency.tzs', 'Tanzanian Shilling', 'Shilingi ya Tanzania', 'currency'),
('currency.price_from', 'From', 'Kuanzia', 'currency'),
('currency.price_to', 'To', 'Hadi', 'currency'),
('currency.negotiable', 'Negotiable', 'Inaweza Kubadilishwa', 'currency'),

-- Location
('location.dar_es_salaam', 'Dar es Salaam', 'Dar es Salaam', 'location'),
('location.dodoma', 'Dodoma', 'Dodoma', 'location'),
('location.arusha', 'Arusha', 'Arusha', 'location'),
('location.mwanza', 'Mwanza', 'Mwanza', 'location'),
('location.mbeya', 'Mbeya', 'Mbeya', 'location'),
('location.moshi', 'Moshi', 'Moshi', 'location'),
('location.tanga', 'Tanga', 'Tanga', 'location'),
('location.zanzibar', 'Zanzibar', 'Zanzibar', 'location'),

-- Service categories (will be used dynamically)
('category.electrical', 'Electrical Services', 'Huduma za Umeme', 'category'),
('category.plumbing', 'Plumbing Services', 'Huduma za Bomba', 'category'),
('category.cleaning', 'Cleaning Services', 'Huduma za Usafi', 'category'),
('category.gardening', 'Gardening Services', 'Huduma za Bustani', 'category'),
('category.painting', 'Painting Services', 'Huduma za Kupaka Rangi', 'category'),
('category.carpentry', 'Carpentry Services', 'Huduma za Fundi', 'category'),

-- Footer
('footer.location', 'Dodoma, Tanzania', 'Dodoma, Tanzania', 'footer'),
('footer.copyright', '© 2024 Huduma Fasta. All rights reserved.', '© 2024 Huduma Fasta. Haki zote zimehifadhiwa.', 'footer'),
('footer.contact', 'Contact Us', 'Wasiliana Nasi', 'footer'),
('footer.support', 'Support', 'Msaada', 'footer'),
('footer.privacy', 'Privacy Policy', 'Sera ya Faragha', 'footer'),
('footer.terms', 'Terms of Service', 'Sheria za Huduma', 'footer');

-- Create index for better performance
CREATE INDEX idx_translations_key_name ON translations(key_name);
CREATE INDEX idx_translations_context ON translations(context); 