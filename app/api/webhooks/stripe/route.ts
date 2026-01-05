import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { processOrder } from '../../lib/orderProcessor';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('🔔 Stripe webhook received');

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ No signature provided');
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Webhook signature verified, event type:', event.type);
  } catch (err) {
    const error = err as Error;
    console.error('❌ Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Payment successful!', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      });

      // Check if this is a donation
      if (session.metadata?.type === 'donation') {
        console.log('💝 Processing donation');

        // Send simple thank you email for donation
        try {
          const resend = new Resend(process.env.RESEND_API_KEY!);
          await resend.emails.send({
            from: 'Turnt Plugins <downloads@turntplugins.com>',
            to: session.customer_email || '',
            subject: 'Thank You for Your Donation!',
            html: `
              <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
                <div style="background: #000080; color: white; padding: 15px; border: 4px solid black;">
                  <h1 style="margin: 0; font-size: 24px;">Thank You for Your Support!</h1>
                </div>

                <div style="border: 4px solid black; border-top: none; padding: 30px; background: #FFE66D;">
                  <p style="font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                    Your generous donation of $${((session.amount_total || 0) / 100).toFixed(2)} has been received. Thank you for supporting the development and maintenance of Turnt Plugins!
                  </p>

                  <p style="font-size: 16px; line-height: 1.8; margin: 0;">
                    Your contribution helps keep the plugins updated and new features coming. We truly appreciate your support!
                  </p>
                </div>

                <div style="border: 4px solid black; border-top: none; padding: 20px; background: white;">
                  <p style="font-size: 14px; color: #666; margin: 0;">
                    Transaction ID: ${session.id}
                  </p>
                  <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
                    This email serves as your receipt for tax purposes.
                  </p>
                </div>

                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                  <p>© 2025 Turnt Plugins. All rights reserved.</p>
                  <p style="margin-top: 10px;">
                    <a href="https://turntplugins.com" style="color: #0000FF;">Visit our website</a>
                  </p>
                </div>
              </div>
            `,
          });
          console.log('✅ Donation thank you email sent!');
        } catch (error) {
          console.error('❌ Failed to send donation email:', error);
        }

        break; // Exit early for donations
      }

      // Parse plugins from metadata (for purchases)
      const plugins = session.metadata?.plugins
        ? JSON.parse(session.metadata.plugins)
        : [];

      // Parse marketing opt-in from metadata
      const marketingOptIn = session.metadata?.marketingOptIn === 'true';

      // Parse discount code from metadata
      const discountCode = session.metadata?.discountCode || undefined;

      // Process order using shared processor
      try {
        await processOrder({
          email: session.customer_email || '',
          paymentProvider: 'stripe',
          transactionId: session.id,
          amountTotal: session.amount_total || 0,
          plugins,
          marketingOptIn,
          discountCode,
        });
        console.log('🎉 Order processed successfully for:', session.customer_email);
      } catch (error) {
        console.error('❌ Failed to process order:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        // Don't fail the webhook - order went through on Stripe
      }

      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed:', paymentIntent.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
