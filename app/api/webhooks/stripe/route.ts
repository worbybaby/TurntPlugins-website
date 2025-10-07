import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import PurchaseConfirmationEmail from '@/emails/PurchaseConfirmation';

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

      // Send confirmation email
      try {
        await resend.emails.send({
          from: 'Turnt Plugins <onboarding@resend.dev>', // Update this with your verified domain
          to: session.customer_email || '',
          subject: 'Your Turnt Plugins Purchase Confirmation',
          react: PurchaseConfirmationEmail({
            customerEmail: session.customer_email || '',
            plugins: plugins,
            orderTotal: session.amount_total || 0,
            orderId: session.id,
          }),
        });

        console.log('Confirmation email sent to:', session.customer_email);
      } catch (error) {
        console.error('Failed to send email:', error);
        // Don't fail the webhook if email fails
      }

      // TODO: Additional tasks:
      // 1. Store the order in your database
      // 2. Send download links (separate email or include in confirmation)
      // 3. Update customer mailing list if they opted in

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
