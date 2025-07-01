import { query } from '../huduma-faster/lib/db';
import bcrypt from 'bcryptjs';

async function insertTestProviders() {
  try {
    console.log('Inserting test providers...');

    // Create test providers
    const providers = [
      {
        name: 'John Mwangi',
        email: 'john.mwangi@example.com',
        phone: '+255712345678',
        password: 'password123',
        role: 'provider',
        specialization: 'Plumbing',
        location: 'Dar es Salaam',
        is_active: true,
        verified: true,
        rating: 4.8,
        totalJobs: 15
      },
      {
        name: 'Sarah Kimani',
        email: 'sarah.kimani@example.com',
        phone: '+255723456789',
        password: 'password123',
        role: 'provider',
        specialization: 'Electrical',
        location: 'Nairobi',
        is_active: true,
        verified: true,
        rating: 4.6,
        totalJobs: 12
      },
      {
        name: 'David Ochieng',
        email: 'david.ochieng@example.com',
        phone: '+255734567890',
        password: 'password123',
        role: 'provider',
        specialization: 'Cleaning',
        location: 'Mombasa',
        is_active: true,
        verified: false,
        rating: 4.2,
        totalJobs: 8
      }
    ];

    for (const provider of providers) {
      const hashedPassword = await bcrypt.hash(provider.password, 10);
      
      await query(`
        INSERT INTO users (
          name, email, phone, password_hash, role, specialization, 
          location, is_active, verified, rating, "totalJobs"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (email) DO NOTHING
      `, [
        provider.name,
        provider.email,
        provider.phone,
        hashedPassword,
        provider.role,
        provider.specialization,
        provider.location,
        provider.is_active,
        provider.verified,
        provider.rating,
        provider.totalJobs
      ]);
    }

    console.log('✓ Test providers inserted successfully');

    // Create some test bookings for providers
    const bookings = [
      {
        service_id: 1,
        customer_id: 1,
        customer_name: 'Test Customer 1',
        customer_email: 'customer1@example.com',
        customer_phone: '+255745678901',
        provider_id: 1,
        booking_date: '2024-01-15',
        booking_time: '09:00:00',
        total_amount: 50000,
        status: 'completed',
        customer_notes: 'Please bring all necessary tools',
        provider_notes: 'Job completed successfully'
      },
      {
        service_id: 2,
        customer_id: 2,
        customer_name: 'Test Customer 2',
        customer_email: 'customer2@example.com',
        customer_phone: '+255756789012',
        provider_id: 1,
        booking_date: '2024-01-16',
        booking_time: '14:00:00',
        total_amount: 75000,
        status: 'pending',
        customer_notes: 'Urgent repair needed'
      },
      {
        service_id: 3,
        customer_id: 3,
        customer_name: 'Test Customer 3',
        customer_email: 'customer3@example.com',
        customer_phone: '+255767890123',
        provider_id: 2,
        booking_date: '2024-01-17',
        booking_time: '10:00:00',
        total_amount: 60000,
        status: 'in_progress',
        customer_notes: 'Electrical installation needed'
      }
    ];

    for (const booking of bookings) {
      await query(`
        INSERT INTO bookings (
          service_id, customer_id, customer_name, customer_email, customer_phone,
          provider_id, booking_date, booking_time, total_amount, status,
          customer_notes, provider_notes, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      `, [
        booking.service_id,
        booking.customer_id,
        booking.customer_name,
        booking.customer_email,
        booking.customer_phone,
        booking.provider_id,
        booking.booking_date,
        booking.booking_time,
        booking.total_amount,
        booking.status,
        booking.customer_notes,
        booking.provider_notes
      ]);
    }

    console.log('✓ Test bookings inserted successfully');

    // Create some test reviews
    const reviews = [
      {
        booking_id: 1,
        user_id: 1,
        provider_id: 1,
        rating: 5,
        comment: 'Excellent work! Very professional and completed the job on time.'
      },
      {
        booking_id: 2,
        user_id: 2,
        provider_id: 1,
        rating: 4,
        comment: 'Good service, would recommend.'
      }
    ];

    for (const review of reviews) {
      await query(`
        INSERT INTO reviews (booking_id, user_id, provider_id, rating, comment, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT DO NOTHING
      `, [
        review.booking_id,
        review.user_id,
        review.provider_id,
        review.rating,
        review.comment
      ]);
    }

    console.log('✓ Test reviews inserted successfully');

    console.log('All test data inserted successfully!');
  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    process.exit(0);
  }
}

insertTestProviders(); 