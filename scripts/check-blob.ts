// Check what files exist in Vercel Blob storage
import { list } from '@vercel/blob';

async function checkBlob() {
  try {
    console.log('Checking Vercel Blob storage...\n');

    const { blobs } = await list({ prefix: 'plugins/' });

    if (blobs.length === 0) {
      console.log('❌ No files found in Blob storage under plugins/ prefix');
      console.log('\nYou need to upload plugin files.');
      return;
    }

    console.log(`✅ Found ${blobs.length} file(s) in Blob storage:\n`);

    blobs.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`);
      console.log(`   Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   URL: ${blob.url}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error checking Blob storage:', error);
    console.log('\nMake sure BLOB_READ_WRITE_TOKEN is set in your environment.');
  }
}

checkBlob();
