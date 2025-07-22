-- Migration: Add notifications table for in-app notification system
-- This script creates a notifications table to store user notifications

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'booking_update', 'review', 'admin_message', 'provider_message', 'payment', 'system'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id INTEGER, -- Optional: booking_id, review_id, message_id, etc.
  related_type VARCHAR(50), -- Optional: 'booking', 'review', 'message', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_related ON notifications(related_id, related_type);

-- Add some sample notifications for testing
INSERT INTO notifications (user_id, type, title, message, related_type) VALUES
-- Sample booking notifications
(1, 'booking_update', 'Booking Confirmed', 'Your booking for Electrical Repair has been confirmed by John Electrician.', 'booking'),
(1, 'booking_update', 'Service Completed', 'Your booking for House Cleaning has been completed. Please rate the service.', 'booking'),
(2, 'booking_update', 'New Booking Request', 'You have a new booking request for Plumbing Services.', 'booking'),

-- Sample review notifications
(1, 'review', 'New Review Received', 'You received a 5-star review for your Electrical Repair service.', 'review'),
(2, 'review', 'Review Posted', 'A customer posted a review for your Plumbing service.', 'review'),

-- Sample admin notifications
(1, 'admin_message', 'Account Verified', 'Your account has been verified by our admin team.', 'system'),
(2, 'admin_message', 'Provider Approval', 'Your provider application has been approved. Welcome to Huduma Fasta!', 'system'),

-- Sample payment notifications
(1, 'payment', 'Payment Received', 'Payment of TZS 50,000 has been received for your booking.', 'payment'),
(2, 'payment', 'Payment Processed', 'Your payment of TZS 75,000 has been processed successfully.', 'payment'),

-- Sample system notifications
(1, 'system', 'Welcome to Huduma Fasta', 'Thank you for joining Huduma Fasta! We hope you enjoy our services.', 'system'),
(2, 'system', 'Welcome Provider', 'Welcome to our provider network! Start accepting bookings now.', 'system');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notifications_updated_at_trigger
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Create a view for unread notifications count
CREATE OR REPLACE VIEW unread_notifications_count AS
SELECT 
  user_id,
  COUNT(*) as unread_count
FROM notifications 
WHERE is_read = FALSE 
GROUP BY user_id;

-- Create a view for recent notifications (last 30 days)
CREATE OR REPLACE VIEW recent_notifications AS
SELECT 
  n.*,
  u.name as user_name,
  u.email as user_email
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE n.created_at >= NOW() - INTERVAL '30 days'
ORDER BY n.created_at DESC; 