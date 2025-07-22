const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function fixReportsTable() {
  try {
    console.log('🔧 Fixing reports table...');
    
    // Check if reports table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reports'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('📝 Creating reports table...');
      
      await pool.query(`
        CREATE TABLE reports (
          id SERIAL PRIMARY KEY,
          reporter_id INTEGER NOT NULL REFERENCES users(id),
          reported_user_id INTEGER REFERENCES users(id),
          provider_id INTEGER REFERENCES providers(id),
          booking_id INTEGER REFERENCES bookings(id),
          report_type VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          admin_notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      
      console.log('✅ Reports table created!');
    } else {
      console.log('✅ Reports table already exists!');
    }
    
    // Check if we have any reports
    const reportsCount = await pool.query('SELECT COUNT(*) FROM reports');
    console.log(`📊 Found ${reportsCount.rows[0].count} reports`);
    
    if (parseInt(reportsCount.rows[0].count) === 0) {
      console.log('📝 Adding sample reports...');
      
      // Get some users and providers for sample data
      const users = await pool.query('SELECT id, name FROM users LIMIT 3');
      const providers = await pool.query('SELECT id, name FROM providers LIMIT 2');
      const bookings = await pool.query('SELECT id FROM bookings LIMIT 2');
      
      if (users.rows.length > 0 && providers.rows.length > 0) {
        const sampleReports = [
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
          {
            reporter_id: users.rows[2]?.id || users.rows[0].id,
            booking_id: bookings.rows[0]?.id,
            report_type: 'booking',
            description: 'Service was not completed as requested. Provider left early without finishing the work.',
            status: 'resolved',
            admin_notes: 'Issue resolved - provided refund to customer'
          }
        ];
        
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
        
        console.log('✅ Sample reports added!');
      } else {
        console.log('⚠️ No users or providers found to create sample reports');
      }
    }
    
    // Show current reports
    const reports = await pool.query(`
      SELECT r.*, u.name as reporter_name, p.name as provider_name
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      LEFT JOIN providers p ON r.provider_id = p.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);
    
    console.log('\n📋 Current reports:');
    reports.rows.forEach((report, index) => {
      console.log(`${index + 1}. ${report.report_type} - ${report.status} - ${report.reporter_name}`);
    });
    
    console.log('\n🎉 Reports feature is now ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixReportsTable(); 