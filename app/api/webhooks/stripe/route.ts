import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import PurchaseConfirmationEmail from '@/emails/PurchaseConfirmation';
import { saveOrder, saveDownloadLink } from '../../lib/db';
import { generateSignedUrl } from '@/app/data/pluginFiles';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
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

      // Parse plugins from metadata
      const plugins = session.metadata?.plugins
        ? JSON.parse(session.metadata.plugins)
        : [];

      // Save order to database
      let orderId: number;
      try {
        orderId = await saveOrder(
          session.customer_email || '',
          session.id,
          session.amount_total || 0,
          plugins
        );

        // Generate download links with 3-day expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 3); // 3 days from now

        // Create download links for each plugin
        const downloadLinks: Array<{ pluginName: string; downloadUrl: string }> = [];

        for (const plugin of plugins) {
          const downloadUrl = generateSignedUrl(plugin.id, orderId.toString());

          await saveDownloadLink(
            orderId,
            plugin.id,
            plugin.name,
            downloadUrl,
            expiresAt
          );

          downloadLinks.push({
            pluginName: plugin.name,
            downloadUrl,
          });
        }

        // Send confirmation email with download links
        await resend.emails.send({
          from: 'Turnt Plugins <onboarding@resend.dev>', // Update this with your verified domain
          to: session.customer_email || '',
          subject: 'Your Turnt Plugins Purchase Confirmation',
          react: PurchaseConfirmationEmail({
            customerEmail: session.customer_email || '',
            plugins: plugins,
            orderTotal: session.amount_total || 0,
            orderId: session.id,
            downloadLinks,
          }),
        });

        console.log('Order saved and confirmation email sent to:', session.customer_email);
      } catch (error) {
        console.error('Failed to process order:', error);
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
