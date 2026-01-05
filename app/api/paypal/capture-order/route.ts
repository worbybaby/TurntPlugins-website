import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, getPayPalOrderDetails } from '../../lib/paypalClient';
import { processOrder } from '../../lib/orderProcessor';
import { checkRateLimit } from '../../lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Rate limit: 10 captures per minute per IP (less strict than order creation)
    const rateLimit = checkRateLimit(`paypal-capture:${ip}`, {
      maxRequests: 10,
      windowMs: 60000, // 1 minute
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const { orderID } = await req.json();

    if (!orderID || typeof orderID !== 'string') {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    console.log('💰 Capturing PayPal order:', orderID);

    // Capture the PayPal payment
    const captureData = await capturePayPalOrder(orderID);

    // Check if capture was successful
    if (captureData.status !== 'COMPLETED') {
      console.error('❌ PayPal capture not completed:', captureData.status);
      return NextResponse.json(
        { error: 'Payment capture failed. Please try again.' },
        { status: 400 }
      );
    }

    console.log('✅ PayPal payment captured successfully');

    // Get order details to retrieve metadata
    const orderDetails = await getPayPalOrderDetails(orderID);
    const customData = orderDetails.purchase_units?.[0]?.custom_id;

    if (!customData) {
      console.error('❌ No custom data found in PayPal order');
      return NextResponse.json(
        { error: 'Order metadata missing' },
        { status: 500 }
      );
    }

    // Parse metadata from custom_id
    const metadata = JSON.parse(customData);
    const { email, marketingOptIn, discountCode, plugins } = metadata;

    // Get amount from capture data (in cents)
    const amountTotal = parseInt(
      captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0'
    ) * 100; // Convert to cents

    console.log('📦 Processing PayPal order:', {
      orderID,
      email,
      amountTotal,
      pluginCount: plugins.length,
    });

    // Process order using shared processor
    const result = await processOrder({
      email,
      paymentProvider: 'paypal',
      transactionId: orderID,
      amountTotal,
      plugins,
      marketingOptIn: marketingOptIn === true || marketingOptIn === 'true',
      discountCode,
    });

    console.log('🎉 PayPal order processed successfully:', result.orderId);

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('❌ PayPal capture error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
