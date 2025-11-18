#!/usr/bin/env node
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { basename } from 'path';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
  process.exit(1);
}

const files = [
  {
    path: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Mac/RubberPRE_v1.0.3.pkg',
    pathname: 'plugins/RubberPRE_v1.0.3.pkg'
  },
  {
    path: '/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/RubberPRE-v1.0.3-Windows-x64.exe',
    pathname: 'plugins/RubberPRE-v1.0.3-Windows-x64.exe'
  }
];

async function uploadFile(filePath, pathname) {
  try {
    console.log(`📦 Uploading: ${basename(pathname)}`);

    const fileBuffer = readFileSync(filePath);

    const blob = await put(pathname, fileBuffer, {
      access: 'public',
      token: BLOB_TOKEN,
    });

    console.log(`✅ Uploaded: ${basename(pathname)}`);
    console.log(`   URL: ${blob.url}`);
    console.log('');

    return blob;
  } catch (error) {
    console.error(`❌ Failed to upload: ${basename(pathname)}`);
    console.error(`   Error: ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log('🚀 Uploading Rubber.PRE installers to Vercel Blob Storage...\n');

  for (const file of files) {
    await uploadFile(file.path, file.pathname);
  }

  console.log('🎉 All Rubber.PRE installers uploaded successfully!');
}

main().catch((error) => {
  console.error('Failed to upload files:', error);
  process.exit(1);
});
