#!/usr/bin/env node

import { del } from '@vercel/blob';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  process.exit(1);
}

// Files to delete (the 3 that were already uploaded)
const filesToDelete = [
  'plugins/CassetteVibe_v1.0.7_macOS.pkg',
  'plugins/PrettyPrettyPrincessSparkle_v1.0.3.pkg',
  'plugins/Space Bass Butt_v1.0.8.pkg',
];

async function deleteFiles() {
  console.log('🗑️  Deleting 3 files from Vercel Blob storage...\n');

  for (const pathname of filesToDelete) {
    try {
      console.log(`🗑️  Deleting: ${pathname}`);
      await del(pathname, { token: BLOB_READ_WRITE_TOKEN });
      console.log(`✅ Deleted: ${pathname}\n`);
    } catch (error) {
      console.error(`❌ Failed to delete ${pathname}:`, error.message);
      console.log('');
    }
  }

  console.log('✅ Deletion complete!');
}

deleteFiles().catch((error) => {
  console.error('❌ Delete script failed:', error);
  process.exit(1);
});
