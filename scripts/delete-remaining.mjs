#!/usr/bin/env node

import { del } from '@vercel/blob';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  process.exit(1);
}

// Files to delete (the 3 remaining old files)
const filesToDelete = [
  'plugins/TapeBloom_v1.0.9.pkg',
  'plugins/TapeBloom-v1.0.0-Windows-x64.exe',
  'plugins/Tapeworm-v1.0.8-Windows-x64.exe',
];

async function deleteFiles() {
  console.log('🗑️  Deleting remaining old files from Vercel Blob storage...\n');

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
