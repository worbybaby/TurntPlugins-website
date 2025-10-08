// Script to upload plugin installers to Vercel Blob
// Run this after deploying: npx tsx scripts/upload-plugins.ts

import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join } from 'path';

const PLUGIN_FILES = [
  {
    id: '1',
    localPath: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Cassette Tapeworm_v1.0.2_macOS.pkg',
  },
  {
    id: '4',
    localPath: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/TapeBloom_v1.0.7.pkg',
  },
  {
    id: '5',
    localPath: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Tapeworm_v1.0.4_notarized_2025-10-03.pkg',
  },
  {
    id: '3',
    localPath: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/SpaceBassButt_v1.0.2.pkg',
  },
  {
    id: '2',
    localPath: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/PrettyPrettyPrincessSparkle_v1.0.1.pkg',
  },
];

async function uploadPlugins() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    console.log('Get your token from: https://vercel.com/dashboard/stores');
    process.exit(1);
  }

  console.log('Starting plugin upload to Vercel Blob...\n');

  for (const plugin of PLUGIN_FILES) {
    try {
      console.log(`Uploading ${plugin.id}...`);

      const fileBuffer = readFileSync(plugin.localPath);
      const fileName = plugin.localPath.split('/').pop()!;

      const blob = await put(`plugins/${fileName}`, fileBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      console.log(`✓ Uploaded: ${fileName}`);
      console.log(`  URL: ${blob.url}\n`);
    } catch (error) {
      console.error(`✗ Failed to upload ${plugin.id}:`, error);
    }
  }

  console.log('Upload complete!');
}

uploadPlugins().catch(console.error);
