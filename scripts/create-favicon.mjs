#!/usr/bin/env node

import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';

async function createFavicon() {
  console.log('🎨 Creating favicon from TapeBloom knob...');

  // Read the TapeBloom image
  const image = sharp('public/plugins/TapeBloom.png');

  // Get image metadata
  const metadata = await image.metadata();
  console.log(`📐 Original size: ${metadata.width}x${metadata.height}`);

  // Crop to center (focusing on the knob)
  // The knob appears to be roughly in the center, taking about 70% of the image
  const cropSize = Math.floor(metadata.width * 0.7);
  const cropOffset = Math.floor((metadata.width - cropSize) / 2);

  const knobImage = sharp('public/plugins/TapeBloom.png')
    .extract({
      left: cropOffset,
      top: cropOffset,
      width: cropSize,
      height: cropSize
    });

  // Create 32x32 favicon
  const favicon32 = await knobImage
    .clone()
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    })
    .png()
    .toBuffer();

  await writeFile('public/favicon-32x32.png', favicon32);
  console.log('✅ Created: public/favicon-32x32.png');

  // Create 16x16 favicon
  const favicon16 = await knobImage
    .clone()
    .resize(16, 16, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    })
    .png()
    .toBuffer();

  await writeFile('public/favicon-16x16.png', favicon16);
  console.log('✅ Created: public/favicon-16x16.png');

  // Create apple-touch-icon (180x180)
  const appleTouchIcon = await knobImage
    .clone()
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    })
    .png()
    .toBuffer();

  await writeFile('public/apple-touch-icon.png', appleTouchIcon);
  console.log('✅ Created: public/apple-touch-icon.png');

  // Create a simple ICO file (32x32 only for simplicity)
  // Note: .ico format is complex, so we'll create a simple version
  const icoData = await knobImage
    .clone()
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 93, g: 173, b: 226, alpha: 1 }
    })
    .toFormat('png')
    .toBuffer();

  // For a proper .ico, we'd need a specialized library
  // For now, let's just save the 32x32 PNG as .ico (browsers will handle it)
  await writeFile('app/favicon.ico', icoData);
  console.log('✅ Created: app/favicon.ico');

  console.log('\n🎉 Favicon generation complete!');
}

createFavicon().catch(error => {
  console.error('❌ Error creating favicon:', error);
  process.exit(1);
});
