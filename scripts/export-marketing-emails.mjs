#!/usr/bin/env node

/**
 * Export Marketing Opt-in Emails
 *
 * This script queries the database for all unique email addresses
 * where users have opted in to marketing emails.
 *
 * Usage: POSTGRES_URL="your_connection_string" node scripts/export-marketing-emails.mjs
 * Or deploy and run: vercel env pull .env.local && node scripts/export-marketing-emails.mjs
 */

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function exportMarketingEmails() {
  try {
    console.log('🔍 Querying database for opted-in emails...\n');

    // Query for unique emails where marketing_opt_in = true
    const result = await sql`
      SELECT DISTINCT customer_email, MAX(created_at) as last_order_date
      FROM orders
      WHERE marketing_opt_in = true
      GROUP BY customer_email
      ORDER BY last_order_date DESC
    `;

    const emails = result.rows;

    console.log(`✅ Found ${emails.length} unique opted-in email address${emails.length === 1 ? '' : 'es'}\n`);

    if (emails.length === 0) {
      console.log('No opted-in emails found.');
      return;
    }

    // Display preview
    console.log('📧 Preview (first 10):');
    console.log('─'.repeat(60));
    emails.slice(0, 10).forEach((row, index) => {
      const date = new Date(row.last_order_date).toLocaleDateString();
      console.log(`${index + 1}. ${row.customer_email} (last order: ${date})`);
    });
    if (emails.length > 10) {
      console.log(`... and ${emails.length - 10} more`);
    }
    console.log('─'.repeat(60));
    console.log();

    // Export to CSV
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `marketing-emails-${timestamp}.csv`;
    const filepath = path.join(process.cwd(), filename);

    // Create CSV content
    const csvContent = [
      'email,last_order_date',
      ...emails.map(row => `${row.customer_email},${row.last_order_date}`)
    ].join('\n');

    fs.writeFileSync(filepath, csvContent);

    console.log(`💾 Exported to: ${filename}`);
    console.log(`📊 Total emails: ${emails.length}\n`);
    console.log('You can now:');
    console.log('1. Upload this CSV to Resend Audiences');
    console.log('2. Import to Mailchimp, ConvertKit, or another email platform');
    console.log('3. Use it to send your Vocal Felt announcement\n');

  } catch (error) {
    console.error('❌ Error exporting emails:', error);
    process.exit(1);
  }
}

// Run the export
exportMarketingEmails()
  .then(() => {
    console.log('✨ Export complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
