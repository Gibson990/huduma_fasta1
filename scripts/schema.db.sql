-- Core Tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Related Tables
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_sw VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_sw VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_sw TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart and Order Tables
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'cash',
    delivery_address TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    service_id INTEGER REFERENCES services(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data
-- Categories
INSERT INTO categories (name_en, name_sw, image_url) VALUES
('Home Cleaning', 'Usafi wa Nyumba', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
('Gardening', 'Bustani', 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
('Plumbing', 'Mifereji', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
('Electrical', 'Umeme', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
('Painting', 'Kupaka Rangi', 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000');

-- Services
INSERT INTO services (name_en, name_sw, description_en, description_sw, base_price, duration_minutes, rating, image_url, category_id) VALUES
('Basic Home Cleaning', 'Usafi wa Nyumba wa Kawaida', 'Professional home cleaning service for your entire house', 'Huduma ya usafi wa nyumba kwa nyumba yako yote', 50000, 120, 4.5, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1000', 1),
('Deep Cleaning', 'Usafi wa Kina', 'Thorough deep cleaning service including hard to reach areas', 'Huduma ya usafi wa kina ikijumuisha maeneo magumu kufikia', 75000, 180, 4.8, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000', 1),
('Garden Maintenance', 'Matengenezo ya Bustani', 'Regular garden maintenance and landscaping service', 'Huduma ya matengenezo ya bustani na muundo wa bustani', 45000, 120, 4.3, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000', 2),
('Plant Installation', 'Kuweka Mimea', 'Professional plant installation and arrangement service', 'Huduma ya kufunga na kupanga mimea', 35000, 90, 4.2, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000', 2),
('Pipe Repair', 'Matengenezo ya Mifereji', 'Quick and reliable pipe repair service', 'Huduma ya haraka na ya kuegemea ya matengenezo ya mifereji', 25000, 60, 4.6, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000', 3); 