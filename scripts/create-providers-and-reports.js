const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function createProvidersAndReports() {
  try {
    console.log('🔧 Creating providers and reports...');
    
    // First, create some providers
    const providers = [
      {
        name: 'John Plumbing Services',
        email: 'john@plumbing.com',
        phone: '+255712345678',
        specialization: 'Plumbing',
        location: 'Dar es Salaam',
        rating: 4.5,
        totalJobs: 25,
        verified: true
      },
      {
        name: 'Sarah Electrical Works',
        email: 'sarah@electrical.com',
        phone: '+255723456789',
        specialization: 'Electrical',
        location: 'Nairobi',
        rating: 4.8,
        totalJobs: 30,
        verified: true
      },
      {
        name: 'Mike Cleaning Services',
        email: 'mike@cleaning.com',
        phone: '+255734567890',
        specialization: 'Cleaning',
        location: 'Mombasa',
        rating: 4.2,
        totalJobs: 15,
        verified: false
      }
    ];
    
    console.log('📝 Adding providers...');
    const providerIds = [];
    
    for (const provider of providers) {
      const result = await pool.query(`
        INSERT INTO providers (name, email, phone, specialization, location, rating, total_jobs, verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        provider.name,
        provider.email,
        provider.phone,
        provider.specialization,
        provider.location,
        provider.rating,
        provider.totalJobs,
        provider.verified
      ]);
      
      providerIds.push(result.rows[0].id);
    }
    
    console.log('✅ Providers created!');
    
    // Get users for reports
    const users = await pool.query('SELECT id, name FROM users LIMIT 5');
    const bookings = await pool.query('SELECT id FROM bookings LIMIT 3');
    
    if (users.rows.length === 0) {
      console.log('⚠️ No users found');
      return;
    }
    
    // Clear existing reports
    await pool.query('DELETE FROM reports');
    console.log('🗑️ Cleared existing reports');
    
    const sampleReports = [
      {
        reporter_id: users.rows[0].id,
        provider_id: providerIds[0],
        report_type: 'provider',
        description: 'Provider arrived 2 hours late and did poor quality work. The service was not completed as promised.',
        status: 'pending',
        admin_notes: 'Need to investigate this complaint'
      },
      {
        reporter_id: users.rows[1]?.id || users.rows[0].id,
        provider_id: providerIds[1],
        report_type: 'provider',
        description: 'Provider was rude and unprofessional during the service.',
        status: 'investigating',
        admin_notes: 'Contacting provider for their side of the story'
      },
      {
        reporter_id: users.rows[2]?.id || users.rows[0].id,
        booking_id: bookings.rows[0]?.id,
        report_type: 'booking',
        description: 'Service was not completed as requested. Provider left early without finishing the work.',
        status: 'resolved',
        admin_notes: 'Issue resolved - provided refund to customer'
      },
      {
        reporter_id: users.rows[3]?.id || users.rows[0].id,
        provider_id: providerIds[2],
        report_type: 'provider',
        description: 'Provider damaged my property during the service.',
        status: 'pending',
        admin_notes: null
      },
      {
        reporter_id: users.rows[4]?.id || users.rows[0].id,
        booking_id: bookings.rows[1]?.id,
        report_type: 'booking',
        description: 'Provider did not show up for the scheduled appointment.',
        status: 'resolved',
        admin_notes: 'Provider was suspended for 30 days'
      }
    ];
    
    console.log('📝 Adding reports...');
    
    for (const report of sampleReports) {
      await pool.query(`
        INSERT INTO reports (reporter_id, provider_id, booking_id, report_type, description, status, admin_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        report.reporter_id,
        report.provider_id,
        report.booking_id,
        report.report_type,
        report.description,
        report.status,
        report.admin_notes
      ]);
    }
    
    console.log('✅ Reports created!');
    
    // Show final results
    const finalReports = await pool.query(`
      SELECT 
        r.id,
        r.report_type as "reportType",
        r.description as reason,
        r.status,
        r.admin_notes as "adminNotes",
        r.created_at as "createdAt",
        r.updated_at as "updatedAt",
        u.name as "reporterName",
        p.name as "targetName",
        r.provider_id as "targetId"
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      LEFT JOIN providers p ON r.provider_id = p.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);
    
    console.log('\n📋 Final reports with proper field mapping:');
    finalReports.rows.forEach((report, index) => {
      console.log(`${index + 1}. ${report.reportType} - ${report.status} - ${report.reporterName} - Target: ${report.targetName || 'N/A'}`);
    });
    
    console.log('\n🎉 Reports feature is now fully functional!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createProvidersAndReports(); 