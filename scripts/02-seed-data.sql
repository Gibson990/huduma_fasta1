-- Insert sample data for Huduma Faster (Tanzania)

-- Insert admin and test users with hashed passwords (12345)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Admin User', 'admin@faster.com', '+255700000000', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Test User', 'user@faster.com', '+255700000001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
('John Mwangi', 'john@example.com', '+255700000002', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
('Fatma Hassan', 'fatma@example.com', '+255700000003', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');

-- Insert service categories (bilingual)
INSERT INTO categories (name_en, name_sw, description_en, description_sw, image_url) VALUES
('Electrical Services', 'Huduma za Umeme', 'Professional electrical repairs and installations', 'Ukarabati na usakinishaji wa umeme wa kitaalamu', '/placeholder.svg?height=200&width=300'),
('Plumbing Services', 'Huduma za Mabomba', 'Expert plumbing solutions for your home', 'Suluhisho za kitaalamu za mabomba kwa nyumba yako', '/placeholder.svg?height=200&width=300'),
('Cleaning Services', 'Huduma za Usafi', 'Professional home and office cleaning', 'Usafi wa kitaalamu wa nyumba na ofisi', '/placeholder.svg?height=200&width=300'),
('Carpentry', 'Useremala', 'Custom woodwork and furniture repairs', 'Kazi za mbao na ukarabati wa samani', '/placeholder.svg?height=200&width=300'),
('Painting', 'Uchoraji', 'Interior and exterior painting services', 'Huduma za uchoraji wa ndani na nje', '/placeholder.svg?height=200&width=300'),
('Appliance Repair', 'Ukarabati wa Vifaa', 'Fix and maintain household appliances', 'Kukarabati na kutunza vifaa vya nyumbani', '/placeholder.svg?height=200&width=300');

-- Insert services (bilingual)
INSERT INTO services (category_id, name_en, name_sw, description_en, description_sw, base_price, duration_minutes, image_url, rating, provider, location) VALUES
(1, 'Electrical Wiring', 'Uwiring wa Umeme', 'Complete electrical wiring for homes and offices', 'Uwiring kamili wa umeme kwa nyumba na ofisi', 300000.00, 180, '/placeholder.svg?height=300&width=300', 4.8, 'Juma Mwalimu', 'Dar es Salaam'),
(1, 'Light Installation', 'Usakinishaji wa Taa', 'Install ceiling lights, chandeliers, and fixtures', 'Kusakinisha taa za dari, chandeliers na vifaa vingine', 150000.00, 90, '/placeholder.svg?height=300&width=300', 4.6, 'Amina Salehe', 'Arusha'),
(2, 'Pipe Repair', 'Ukarabati wa Mabomba', 'Fix leaking and broken pipes', 'Kukarabati mabomba yanayovuja na yaliyovunjika', 200000.00, 120, '/placeholder.svg?height=300&width=300', 4.7, 'Hassan Mwangi', 'Mwanza'),
(3, 'House Cleaning', 'Usafi wa Nyumba', 'Deep cleaning for entire house', 'Usafi wa kina kwa nyumba nzima', 160000.00, 240, '/placeholder.svg?height=300&width=300', 4.9, 'Grace Kimani', 'Dodoma'),
(4, 'Furniture Assembly', 'Kuunganisha Samani', 'Assemble and install furniture', 'Kuunganisha na kusakinisha samani', 100000.00, 90, '/placeholder.svg?height=300&width=300', 4.5, 'Mohamed Ali', 'Mbeya'),
(5, 'Interior Painting', 'Uchoraji wa Ndani', 'Professional interior painting services', 'Huduma za kitaalamu za uchoraji wa ndani', 240000.00, 360, '/placeholder.svg?height=300&width=300', 4.4, 'Fatma Hassan', 'Moshi');

-- Insert service providers (Tanzania)
INSERT INTO service_providers (name, email, phone, specialization_en, specialization_sw, experience_years, rating, total_jobs, is_verified, location) VALUES
('Juma Mwalimu', 'juma@providers.com', '+255700001001', 'Electrical work, wiring, installations', 'Kazi za umeme, uwiring, usakinishaji', 8, 4.8, 156, true, 'Dar es Salaam'),
('Amina Salehe', 'amina@providers.com', '+255700001002', 'Plumbing repairs, installations', 'Ukarabati wa mabomba, usakinishaji', 6, 4.6, 98, true, 'Arusha'),
('Hassan Mwangi', 'hassan@providers.com', '+255700001003', 'House cleaning, deep cleaning', 'Usafi wa nyumba, usafi wa kina', 4, 4.9, 203, true, 'Mwanza'),
('Grace Kimani', 'grace@providers.com', '+255700001004', 'Carpentry, furniture assembly', 'Useremala, kuunganisha samani', 10, 4.7, 134, true, 'Dodoma'),
('Mohamed Ali', 'mohamed@providers.com', '+255700001005', 'Painting, interior design', 'Uchoraji, muundo wa ndani', 7, 4.5, 87, true, 'Mbeya');

-- Link providers to services
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(1, 1, 280000.00), (1, 2, 140000.00),
(2, 3, 190000.00), (2, 4, 230000.00),
(3, 5, 150000.00), (3, 6, 110000.00),
(4, 7, 90000.00), (4, 8, 380000.00);

-- Insert sample bookings
INSERT INTO bookings (user_id, provider_id, booking_date, booking_time, service_address, total_amount, booking_status, payment_status) VALUES
(2, 1, '2024-01-15', '10:00:00', 'Msimbazi Street, Dar es Salaam', 280000.00, 'completed', 'paid'),
(3, 3, '2024-01-16', '14:00:00', 'Sokoine Road, Arusha', 150000.00, 'in_progress', 'pending'),
(4, 2, '2024-01-17', '09:00:00', 'Uhuru Street, Mwanza', 190000.00, 'pending', 'pending');

-- Insert booking services
INSERT INTO booking_services (booking_id, service_id, quantity, price) VALUES
(1, 1, 1, 280000.00),
(2, 5, 1, 150000.00),
(3, 3, 1, 190000.00);
