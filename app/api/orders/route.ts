import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByEmail, updateTapeBloomLicenseKey } from '../lib/db';
import { generateTapeBloomLicense } from '../../lib/licenseGenerator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const orders = await getOrdersByEmail(email);

    // Auto-generate TapeBloom license keys for existing customers
    // who purchased TapeBloom but don't have a license key yet
    for (const order of orders) {
      if (!order.tape_bloom_license_key) {
        // Check if order contains TapeBloom (plugin id '4')
        try {
          const plugins = JSON.parse(order.plugins || '[]');
          const hasTapeBloom = plugins.some((p: { id: string }) => p.id === '4');

          if (hasTapeBloom) {
            const newLicenseKey = generateTapeBloomLicense();
            await updateTapeBloomLicenseKey(order.id, newLicenseKey);
            order.tape_bloom_license_key = newLicenseKey;
          }
        } catch (parseError) {
          console.error('Error parsing plugins for order:', order.id, parseError);
        }
      }
    }

    return NextResponse.json({
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
