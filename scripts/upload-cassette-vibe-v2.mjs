#!/usr/bin/env node

import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  console.error('Please set it in your .env.local or run: export BLOB_READ_WRITE_TOKEN=your_token_here');
  process.exit(1);
}

const files = [
  {
    path: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Mac/CassetteVibe_v2.0.0_macOS.pkg',
    name: 'CassetteVibe_v2.0.0_macOS.pkg',
    platform: 'macOS'
  },
  {
    path: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/CassetteVibe-v2.0.0-Windows-x64.exe',
    name: 'CassetteVibe-v2.0.0-Windows-x64.exe',
    platform: 'Windows'
  }
];

async function uploadFile(file) {
  try {
    console.log(`📦 Uploading ${file.platform}: ${file.name}`);

    const fileBuffer = await readFile(file.path);
    const blob = await put(`plugins/${file.name}`, fileBuffer, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });

    console.log(`✅ Uploaded: ${file.name}`);
    console.log(`   URL: ${blob.url}`);
    console.log('');

    return blob;
  } catch (error) {
    console.error(`❌ Failed to upload ${file.name}:`, error.message);
    console.log('');
    throw error;
  }
}

async function main() {
  console.log('🚀 Uploading Cassette Vibe v2.0.0 installers to Vercel Blob Storage...');
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    try {
      await uploadFile(file);
      successCount++;
    } catch (error) {
      failCount++;
    }
  }

  console.log('');
  console.log('📊 Upload Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('');

  if (failCount === 0) {
    console.log('🎉 Cassette Vibe v2.0.0 installers uploaded successfully!');
  } else {
    console.log('⚠️  Some uploads failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Upload script failed:', error);
  process.exit(1);
});
