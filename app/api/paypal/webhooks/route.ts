import { NextRequest, NextResponse } from 'next/server';
import { verifyPayPalWebhook, getPayPalOrderDetails } from '../../lib/paypalClient';
import { processOrder } from '../../lib/orderProcessor';
import { getOrderByTransactionId } from '../../lib/db';
import { checkRateLimit } from '../../lib/rateLimiter';

export async function POST(req: NextRequest) {
  console.log('🔔 PayPal webhook received');

  try {
    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Rate limit: 100 webhooks per minute per IP (webhooks can be frequent)
    const rateLimit = checkRateLimit(`paypal-webhook:${ip}`, {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    });

    if (!rateLimit.allowed) {
      console.warn('⚠️ Rate limit exceeded for PayPal webhook');
      // Still return 200 to prevent PayPal from retrying
      return NextResponse.json({ received: true });
    }

    const body = await req.text();
    const webhookEvent = JSON.parse(body);

    // Get webhook headers for verification
    const authAlgo = req.headers.get('paypal-auth-algo') || '';
    const certUrl = req.headers.get('paypal-cert-url') || '';
    const transmissionId = req.headers.get('paypal-transmission-id') || '';
    const transmissionSig = req.headers.get('paypal-transmission-sig') || '';
    const transmissionTime = req.headers.get('paypal-transmission-time') || '';
    const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    });

    if (!isValid) {
      console.error('❌ PayPal webhook signature verification failed');
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ PayPal webhook signature verified, event type:', webhookEvent.event_type);

    // Handle different event types
    switch (webhookEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const resource = webhookEvent.resource;
        const orderId = resource.supplementary_data?.related_ids?.order_id;

        if (!orderId) {
          console.error('❌ No order ID in webhook payload');
          break;
        }

        console.log('💰 Payment capture completed for order:', orderId);

        // Check if order already processed (idempotency)
        const existingOrder = await getOrderByTransactionId(orderId);
        if (existingOrder) {
          console.log('ℹ️ Order already processed, skipping:', orderId);
          break;
        }

        // Get order details to retrieve metadata
        const orderDetails = await getPayPalOrderDetails(orderId);
        const customData = orderDetails.purchase_units?.[0]?.custom_id;

        if (!customData) {
          console.error('❌ No custom data found in PayPal order');
          break;
        }

        // Parse metadata from custom_id
        // Supports both compressed format (e,m,d,p) and legacy format
        const metadata = JSON.parse(customData);

        // Plugin ID to name mapping
        const PLUGIN_NAMES: Record<string, string> = {
          '1': 'Cassette Vibe',
          '2': 'Pretty Pretty Princess Sparkle',
          '3': 'Space Bass Butt',
          '4': 'Tape Bloom',
          '5': 'Tapeworm',
          'bundle': 'Complete Bundle',
        };

        // Handle compressed format (e,m,d,p) or legacy format
        const email = metadata.e || metadata.email;
        const marketingOptIn = metadata.m !== undefined ? metadata.m === 1 : metadata.marketingOptIn;
        const discountCode = metadata.d !== undefined ? metadata.d : metadata.discountCode;

        // Convert plugin IDs to objects with names if compressed format
        let plugins;
        if (metadata.p) {
          plugins = metadata.p.map((id: string) => ({ id, name: PLUGIN_NAMES[id] || `Plugin ${id}` }));
        } else {
          plugins = metadata.plugins;
        }

        // Get amount from resource (in cents)
        const amountTotal = parseInt(resource.amount?.value || '0') * 100; // Convert to cents

        console.log('📦 Processing PayPal webhook order:', {
          orderId,
          email,
          amountTotal,
          pluginCount: plugins.length,
        });

        // Process order using shared processor
        const result = await processOrder({
          email,
          paymentProvider: 'paypal',
          transactionId: orderId,
          amountTotal,
          plugins,
          marketingOptIn: marketingOptIn === true || marketingOptIn === 'true',
          discountCode,
        });

        console.log('🎉 PayPal webhook order processed successfully:', result.orderId);
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED': {
        console.log('❌ Payment capture denied:', webhookEvent.resource?.id);
        // Could add logic to notify user or log for review
        break;
      }

      case 'CHECKOUT.ORDER.APPROVED': {
        console.log('✅ Order approved (not yet captured):', webhookEvent.resource?.id);
        // Informational only - capture happens separately
        break;
      }

      default:
        console.log(`ℹ️ Unhandled PayPal webhook event type: ${webhookEvent.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ PayPal webhook error:', error);
    // Return 200 to prevent PayPal from retrying
    return NextResponse.json({ received: true });
  }
}
