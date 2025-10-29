#!/usr/bin/env node

import sharp from 'sharp';
import toIco from 'to-ico';
import { readFile, writeFile, copyFile } from 'fs/promises';

async function useBrandFavicon() {
  console.log('🎨 Using brand favicon (favicon-turnt.png)...');

  const sourcePath = '/Volumes/Samsung_T5/website_dev/turnt-tis-true/brand assets/favicon-turnt.png';

  // Read the brand favicon
  const image = sharp(sourcePath);

  // Get metadata
  const metadata = await image.metadata();
  console.log(`📐 Source size: ${metadata.width}x${metadata.height}`);

  // Create 32x32 favicon (maximize size by using cover fit)
  const favicon32 = await sharp(sourcePath)
    .resize(32, 32, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile('public/favicon-32x32.png', favicon32);
  console.log('✅ Created: public/favicon-32x32.png (maximized size)');

  // Create 16x16 favicon (maximize size)
  const favicon16 = await sharp(sourcePath)
    .resize(16, 16, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile('public/favicon-16x16.png', favicon16);
  console.log('✅ Created: public/favicon-16x16.png (maximized size)');

  // Create apple-touch-icon (180x180, maximize size)
  const appleTouchIcon = await sharp(sourcePath)
    .resize(180, 180, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile('public/apple-touch-icon.png', appleTouchIcon);
  console.log('✅ Created: public/apple-touch-icon.png');

  // Create proper ICO file
  const ico = await toIco([favicon32, favicon16]);
  await writeFile('app/favicon.ico', ico);
  await writeFile('public/favicon.ico', ico);
  console.log('✅ Created: app/favicon.ico');
  console.log('✅ Created: public/favicon.ico');

  console.log('\n🎉 Brand favicon applied successfully!');
}

useBrandFavicon().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
