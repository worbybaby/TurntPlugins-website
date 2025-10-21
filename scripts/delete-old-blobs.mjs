#!/usr/bin/env node

import { list, del } from '@vercel/blob';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  process.exit(1);
}

// Files to delete (old versions)
const filesToDelete = [
  'plugins/Cassette Tapeworm_v1.0.2_macOS.pkg',
  'plugins/Cassette Tapeworm_v1.0.4_macOS.pkg',
  'plugins/Cassette Tapeworm_v1.0.5_macOS.pkg',
  'plugins/CassetteTapeworm-v1.0.0-Windows-x64.exe',
  'plugins/CassetteTapeworm-v1.0.5-Windows-x64.exe',
  'plugins/PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe',
  'plugins/PrettyPrettyPrincessSparkle_v1.0.1.pkg',
  'plugins/PrettyPrettyPrincessSparkle_v1.0.2.pkg',
  'plugins/Space Bass Butt_v1.0.7.pkg',
  'plugins/SpaceBassButt-v1.0.7-Windows-x64.exe',
  'plugins/SpaceBassButt_v1.0.2.pkg',
  'plugins/TapeBloom_v1.0.7.pkg',
  'plugins/Tapeworm_v1.0.4_notarized_2025-10-03.pkg',
  'plugins/Tapeworm_v1.0.8.pkg',
];

async function deleteOldFiles() {
  console.log('🗑️  Deleting old plugin files from Vercel Blob storage...\n');

  let successCount = 0;
  let failCount = 0;

  for (const pathname of filesToDelete) {
    try {
      console.log(`🗑️  Deleting: ${pathname}`);
      await del(pathname, { token: BLOB_READ_WRITE_TOKEN });
      console.log(`✅ Deleted: ${pathname}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${pathname}:`, error.message);
      console.log('');
      failCount++;
    }
  }

  console.log('📊 Deletion Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('');

  if (failCount === 0) {
    console.log('🎉 All old files deleted successfully!');
  } else {
    console.log('⚠️  Some deletions failed. Please check the errors above.');
  }
}

deleteOldFiles().catch((error) => {
  console.error('❌ Delete script failed:', error);
  process.exit(1);
});
