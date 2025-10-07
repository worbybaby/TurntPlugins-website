import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems, email } = await req.json();

    // Create line items for Stripe
    const lineItems = cartItems.map((item: { plugin: { name: string; description: string }, payAmount: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.plugin.name,
          description: item.plugin.description,
        },
        unit_amount: Math.round(item.payAmount * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Filter out items with 0 amount (free downloads will be handled differently)
    const paidItems = lineItems.filter((item: { price_data: { unit_amount: number } }) => item.price_data.unit_amount > 0);

    // If there are no paid items, handle as free download
    if (paidItems.length === 0) {
      return NextResponse.json({
        url: null,
        isFree: true,
        message: 'Free download - no payment required'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: paidItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}?canceled=true`,
      metadata: {
        customerEmail: email,
        plugins: JSON.stringify(cartItems.map((item: { plugin: { id: string, name: string } }) => ({
          id: item.plugin.id,
          name: item.plugin.name,
        }))),
      },
    });

    return NextResponse.json({ url: session.url, isFree: false });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
