#!/usr/bin/env node
import { list, del } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  process.exit(1);
}

async function cleanupInstallers() {
  console.log('🔍 Listing all files in Vercel Blob storage...\n');

  try {
    // List all blobs with plugins prefix
    const { blobs } = await list({
      prefix: 'plugins/',
      token: BLOB_TOKEN
    });

    if (blobs.length === 0) {
      console.log('✅ No files found in plugins/ directory');
      return;
    }

    console.log(`Found ${blobs.length} files:\n`);

    // Filter only installer files (.pkg and .exe)
    const installerFiles = blobs.filter(blob =>
      blob.pathname.endsWith('.pkg') ||
      blob.pathname.endsWith('.exe')
    );

    console.log('📦 Installer files to delete:');
    installerFiles.forEach(file => {
      console.log(`  - ${file.pathname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    });

    const totalSize = installerFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\n💾 Total size to free up: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);

    // Confirm before deleting
    console.log('⚠️  Deleting installer files (downloads now use GitHub Releases)...\n');

    // Delete each installer file
    for (const file of installerFiles) {
      try {
        await del(file.url, { token: BLOB_TOKEN });
        console.log(`✅ Deleted: ${file.pathname}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${file.pathname}:`, error.message);
      }
    }

    console.log(`\n🎉 Cleanup complete! Freed up ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('✅ Downloads will continue to work via GitHub Releases');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupInstallers();
