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

  // Crop to the knob area only (center ~280x280 of the 400x400 image)
  // This removes the transparent padding around the knob
  const knobSize = 280;
  const offset = Math.floor((metadata.width - knobSize) / 2);

  console.log(`✂️  Cropping to knob area: ${knobSize}x${knobSize} (removing ${offset}px padding)`);

  const croppedKnob = sharp(sourcePath).extract({
    left: offset,
    top: offset,
    width: knobSize,
    height: knobSize
  });

  // Create 32x32 favicon (crop to knob, then resize to fill entire space)
  const favicon32 = await croppedKnob
    .clone()
    .resize(32, 32, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile('public/favicon-32x32.png', favicon32);
  console.log('✅ Created: public/favicon-32x32.png (knob fills entire space)');

  // Create 16x16 favicon (crop to knob, then maximize)
  const favicon16 = await croppedKnob
    .clone()
    .resize(16, 16, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile('public/favicon-16x16.png', favicon16);
  console.log('✅ Created: public/favicon-16x16.png (knob fills entire space)');

  // Create apple-touch-icon (180x180, crop and maximize)
  const appleTouchIcon = await croppedKnob
    .clone()
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
