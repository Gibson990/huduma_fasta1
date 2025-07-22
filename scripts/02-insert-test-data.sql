-- Insert test services for each category
INSERT INTO services (category_id, name_en, name_sw, description_en, description_sw, base_price, duration_minutes, rating, image_url) VALUES
-- Home Cleaning Services
(1, 'Basic Home Cleaning', 'Usafi wa Nyumbani wa Kawaida', 'Complete home cleaning service including dusting, vacuuming, and bathroom cleaning', 'Huduma kamili ya usafi wa nyumbani ikijumuisha kufuta vumbi, kufagia, na kusafisha bafu', 50000, 120, 4.5, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
(1, 'Deep Cleaning', 'Usafi wa Kina', 'Thorough deep cleaning service including hard-to-reach areas and detailed attention', 'Huduma ya usafi wa kina ikijumuisha maeneo magumu kufikia na umakini wa kina', 80000, 240, 4.8, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1000'),
(1, 'Window Cleaning', 'Usafi wa Madirisha', 'Professional window cleaning service for crystal clear views', 'Huduma ya usafi wa madirisha kwa ajili ya maonyesho ya wazi', 30000, 60, 4.2, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),

-- Gardening Services
(2, 'Lawn Mowing', 'Kukata Nyasi', 'Professional lawn mowing and maintenance service', 'Huduma ya kukata na kudumisha nyasi', 40000, 90, 4.6, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
(2, 'Garden Design', 'Kubuni Bustani', 'Custom garden design and landscaping service', 'Huduma ya kubuni na kuboresha bustani', 150000, 360, 4.9, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
(2, 'Plant Care', 'Utunzaji wa Mimea', 'Professional plant care and maintenance service', 'Huduma ya utunzaji na kudumisha mimea', 35000, 60, 4.4, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),

-- Plumbing Services
(3, 'Leak Repair', 'Kurekebisha Mvuja', 'Professional leak detection and repair service', 'Huduma ya kugundua na kurekebisha mvuja', 45000, 90, 4.7, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
(3, 'Pipe Installation', 'Ufungaji wa Bomba', 'New pipe installation and replacement service', 'Huduma ya kufunga na kubadilisha bomba mpya', 120000, 180, 4.8, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
(3, 'Drain Cleaning', 'Kusafisha Mfereji', 'Professional drain cleaning and unclogging service', 'Huduma ya kusafisha na kufungua mifereji', 35000, 60, 4.5, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),

-- Electrical Services
(4, 'Electrical Repair', 'Kurekebisha Umeme', 'Professional electrical repair and maintenance service', 'Huduma ya kurekebisha na kudumisha umeme', 55000, 120, 4.6, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
(4, 'Light Installation', 'Ufungaji wa Taa', 'New light fixture installation service', 'Huduma ya kufunga vifaa vipya vya taa', 40000, 90, 4.7, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
(4, 'Electrical Inspection', 'Ukaguzi wa Umeme', 'Comprehensive electrical system inspection service', 'Huduma ya ukaguzi wa kina wa mfumo wa umeme', 30000, 60, 4.8, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'); 