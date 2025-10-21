// One-time script to clear test data from production database
// Run this with: npx tsx scripts/clear-test-data.ts

import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function clearTestData() {
  console.log('🧹 Clearing test data from database...\n');

  try {
    // Delete all downloads
    const downloadsResult = await sql`DELETE FROM downloads`;
    console.log(`✅ Deleted ${downloadsResult.rowCount} download records`);

    // Delete all orders
    const ordersResult = await sql`DELETE FROM orders`;
    console.log(`✅ Deleted ${ordersResult.rowCount} order records`);

    console.log('\n✨ Database cleared successfully!');
    console.log('Your admin dashboard should now be empty and ready for live orders.\n');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearTestData();
