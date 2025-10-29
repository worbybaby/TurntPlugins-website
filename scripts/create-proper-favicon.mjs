#!/usr/bin/env node

import toIco from 'to-ico';
import { readFile, writeFile } from 'fs/promises';

async function createProperFavicon() {
  console.log('🎨 Creating proper .ico file from PNG favicons...');

  try {
    // Read the PNG files
    const png32 = await readFile('public/favicon-32x32.png');
    const png16 = await readFile('public/favicon-16x16.png');

    // Create a proper multi-resolution ICO file
    const ico = await toIco([png32, png16]);

    // Write to both app and public directories
    await writeFile('app/favicon.ico', ico);
    await writeFile('public/favicon.ico', ico);

    console.log('✅ Created proper ICO files:');
    console.log('   - app/favicon.ico');
    console.log('   - public/favicon.ico');
    console.log('');
    console.log('🎉 Done! Favicon should now work correctly.');
    console.log('');
    console.log('⚠️  Note: You may need to hard refresh your browser (Cmd+Shift+R) to see the new favicon.');
  } catch (error) {
    console.error('❌ Error creating favicon:', error);
    process.exit(1);
  }
}

createProperFavicon();
