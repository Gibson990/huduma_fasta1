import { testConnection } from '../lib/db';

async function testDb() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Database connection successful!');
    } else {
      console.error('❌ Database connection failed!');
    }
  } catch (error) {
    console.error('❌ Error testing database:', error);
  }
}

testDb(); 