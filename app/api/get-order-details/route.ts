import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPayPalOrderDetails } from '../lib/paypalClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const transactionId = searchParams.get('transaction_id');
    const provider = searchParams.get('provider') || 'stripe';

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transaction ID' },
        { status: 400 }
      );
    }

    if (provider === 'stripe') {
      // Get Stripe session details
      const session = await stripe.checkout.sessions.retrieve(transactionId);

      return NextResponse.json({
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        payment_status: session.payment_status,
        provider: 'stripe',
      });
    } else if (provider === 'paypal') {
      // Get PayPal order details
      const orderDetails = await getPayPalOrderDetails(transactionId);

      // Extract amount from PayPal order
      const amountValue = orderDetails.purchase_units?.[0]?.amount?.value || '0';
      const amountInCents = Math.round(parseFloat(amountValue) * 100);

      // Extract email from custom_id
      let customerEmail = '';
      try {
        const customData = orderDetails.purchase_units?.[0]?.custom_id;
        if (customData) {
          const metadata = JSON.parse(customData);
          customerEmail = metadata.email || '';
        }
      } catch (e) {
        console.error('Failed to parse PayPal custom data:', e);
      }

      return NextResponse.json({
        amount_total: amountInCents,
        currency: 'usd',
        customer_email: customerEmail,
        payment_status: orderDetails.status === 'COMPLETED' ? 'paid' : 'unpaid',
        provider: 'paypal',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid payment provider' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
