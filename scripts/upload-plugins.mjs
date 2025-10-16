#!/usr/bin/env node

import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  console.error('Please set it in your .env.local or run: export BLOB_READ_WRITE_TOKEN=your_token_here');
  process.exit(1);
}

const MAC_DIR = '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Mac';
const WINDOWS_DIR = '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows';

const files = [
  // macOS installers
  { path: `${MAC_DIR}/Cassette Tapeworm_v1.0.5_macOS.pkg`, name: 'Cassette Tapeworm_v1.0.5_macOS.pkg', platform: 'macOS' },
  { path: `${MAC_DIR}/PrettyPrettyPrincessSparkle_v1.0.2.pkg`, name: 'PrettyPrettyPrincessSparkle_v1.0.2.pkg', platform: 'macOS' },
  { path: `${MAC_DIR}/Space Bass Butt_v1.0.7.pkg`, name: 'Space Bass Butt_v1.0.7.pkg', platform: 'macOS' },
  { path: `${MAC_DIR}/TapeBloom_v1.0.9.pkg`, name: 'TapeBloom_v1.0.9.pkg', platform: 'macOS' },
  { path: `${MAC_DIR}/Tapeworm_v1.0.8.pkg`, name: 'Tapeworm_v1.0.8.pkg', platform: 'macOS' },

  // Windows installers
  { path: `${WINDOWS_DIR}/CassetteTapeworm-v1.0.5-Windows-x64.exe`, name: 'CassetteTapeworm-v1.0.5-Windows-x64.exe', platform: 'Windows' },
  { path: `${WINDOWS_DIR}/PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe`, name: 'PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe', platform: 'Windows' },
  { path: `${WINDOWS_DIR}/SpaceBassButt-v1.0.7-Windows-x64.exe`, name: 'SpaceBassButt-v1.0.7-Windows-x64.exe', platform: 'Windows' },
  { path: `${WINDOWS_DIR}/TapeBloom-v1.0.0-Windows-x64.exe`, name: 'TapeBloom-v1.0.0-Windows-x64.exe', platform: 'Windows' },
  { path: `${WINDOWS_DIR}/Tapeworm-v1.0.8-Windows-x64.exe`, name: 'Tapeworm-v1.0.8-Windows-x64.exe', platform: 'Windows' },
];

async function uploadFile(file) {
  try {
    console.log(`📦 Uploading ${file.platform}: ${file.name}`);

    const fileBuffer = await readFile(file.path);
    const blob = await put(`plugins/${file.name}`, fileBuffer, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
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
  console.log('🚀 Uploading plugin installers to Vercel Blob Storage...');
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
    console.log('🎉 All plugin installers uploaded successfully!');
  } else {
    console.log('⚠️  Some uploads failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Upload script failed:', error);
  process.exit(1);
});
