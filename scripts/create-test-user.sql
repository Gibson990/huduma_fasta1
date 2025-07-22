-- Create test users for login testing
-- Password is 'password123' (hashed with bcrypt)

INSERT INTO users (name, email, password_hash, role, phone, address, created_at) VALUES
('Test Provider', 'provider@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider', '+255 123 456 789', '123 Test St, Dar es Salaam', NOW()),
('Test User', 'user@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+255 987 654 321', '456 User St, Dar es Salaam', NOW()),
('Admin User', 'admin@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+255 555 123 456', '789 Admin St, Dar es Salaam', NOW())
ON CONFLICT (email) DO NOTHING; 