const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function createBookingReports() {
  try {
    console.log('📝 Creating booking reports with proper provider associations...');
    
    // Get users, providers, and bookings
    const users = await pool.query('SELECT id, name, phone FROM users LIMIT 5');
    const providers = await pool.query('SELECT id, name, phone FROM providers LIMIT 3');
    const bookings = await pool.query('SELECT id, provider_id FROM bookings LIMIT 5');
    
    if (users.rows.length === 0 || providers.rows.length === 0 || bookings.rows.length === 0) {
      console.log('⚠️ Need users, providers, and bookings to create sample reports');
      return;
    }
    
    // Clear existing reports
    await pool.query('DELETE FROM reports');
    console.log('🗑️ Cleared existing reports');
    
    const sampleReports = [
      // Provider reports
      {
        reporter_id: users.rows[0].id,
        provider_id: providers.rows[0].id,
        report_type: 'provider',
        description: 'Provider arrived 2 hours late and did poor quality work. The service was not completed as promised.',
        status: 'pending',
        admin_notes: 'Need to investigate this complaint'
      },
      {
        reporter_id: users.rows[1]?.id || users.rows[0].id,
        provider_id: providers.rows[1]?.id || providers.rows[0].id,
        report_type: 'provider',
        description: 'Provider was rude and unprofessional during the service.',
        status: 'investigating',
        admin_notes: 'Contacting provider for their side of the story'
      },
      // Booking reports - these will get provider info from the booking
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
        booking_id: bookings.rows[1]?.id,
        report_type: 'booking',
        description: 'Provider did not show up for the scheduled appointment.',
        status: 'resolved',
        admin_notes: 'Provider was suspended for 30 days'
      },
      {
        reporter_id: users.rows[4]?.id || users.rows[0].id,
        booking_id: bookings.rows[2]?.id,
        report_type: 'booking',
        description: 'Provider damaged my property during the service.',
        status: 'pending',
        admin_notes: null
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
    
    // Show final results with proper field mapping
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
        u.phone as "reporterPhone",
        CASE 
          WHEN r.report_type = 'booking' THEN bp.name
          ELSE p.name 
        END as "targetName",
        CASE 
          WHEN r.report_type = 'booking' THEN bp.phone
          ELSE p.phone 
        END as "targetPhone",
        CASE 
          WHEN r.report_type = 'booking' THEN r.booking_id
          ELSE r.provider_id 
        END as "targetId"
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      LEFT JOIN providers p ON r.provider_id = p.id
      LEFT JOIN bookings b ON r.booking_id = b.id
      LEFT JOIN providers bp ON b.provider_id = bp.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);
    
    console.log('\n📋 Final reports with proper field mapping:');
    finalReports.rows.forEach((report, index) => {
      console.log(`${index + 1}. ${report.reportType} - ${report.status} - ${report.reporterName} (${report.reporterPhone || 'No phone'}) - Target: ${report.targetName || 'N/A'} (${report.targetPhone || 'No phone'})`);
    });
    
    console.log('\n🎉 Booking reports with phone numbers are now ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createBookingReports(); 