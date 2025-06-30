import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
});

const migrations = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS image VARCHAR(255);`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS specialization VARCHAR(100);`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(100);`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS totalJobs INTEGER DEFAULT 0;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;`,
];

async function runMigrations() {
  const client = await pool.connect();
  try {
    for (const sql of migrations) {
      try {
        await client.query(sql);
        console.log('Success:', sql);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Error running:', sql, '\n', message);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(console.error); 