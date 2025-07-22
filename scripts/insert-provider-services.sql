-- Link providers to services
-- Each provider will offer multiple services with custom pricing

-- John Mwangi (Cleaning Specialist) - Services 1, 2, 3
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(1, 1, 55000), -- Basic Home Cleaning
(1, 2, 85000), -- Deep Cleaning  
(1, 3, 32000); -- Window Cleaning

-- Sarah Kimani (Gardener) - Services 4, 5, 6
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(2, 4, 42000), -- Lawn Mowing
(2, 5, 160000), -- Garden Design
(2, 6, 38000); -- Plant Care

-- David Ochieng (Plumber) - Services 7, 8, 9
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(3, 7, 48000), -- Leak Repair
(3, 8, 125000), -- Pipe Installation
(3, 9, 38000); -- Drain Cleaning

-- Grace Wanjiku (Electrician) - Services 10, 11, 12
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(4, 10, 58000), -- Electrical Repair
(4, 11, 42000), -- Light Installation
(4, 12, 32000); -- Electrical Inspection

-- Michael Odhiambo (Painter) - Services 1, 2 (also does cleaning)
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(5, 1, 52000), -- Basic Home Cleaning
(5, 2, 82000); -- Deep Cleaning

-- Lucy Akinyi (Home Maintenance) - Services 1, 2, 4, 6
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(6, 1, 48000), -- Basic Home Cleaning
(6, 2, 78000), -- Deep Cleaning
(6, 4, 38000), -- Lawn Mowing
(6, 6, 32000); -- Plant Care

-- Peter Njoroge (Carpenter) - Services 1, 2 (cleaning after work)
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(7, 1, 50000), -- Basic Home Cleaning
(7, 2, 80000); -- Deep Cleaning

-- Mary Wambui (Interior Design) - Services 1, 2, 3
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(8, 1, 55000), -- Basic Home Cleaning
(8, 2, 88000), -- Deep Cleaning
(8, 3, 35000); -- Window Cleaning

-- James Kiprop (Security) - Services 10, 11, 12
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(9, 10, 60000), -- Electrical Repair
(9, 11, 45000), -- Light Installation
(9, 12, 35000); -- Electrical Inspection

-- Ann Muthoni (Appliance Repair) - Services 7, 10, 11
INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
(10, 7, 50000), -- Leak Repair
(10, 10, 62000), -- Electrical Repair
(10, 11, 48000); -- Light Installation 