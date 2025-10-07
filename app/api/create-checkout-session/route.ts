import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkRateLimit } from '../lib/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PAYMENT_AMOUNT = 10000; // $10,000 max per item
const MAX_CART_ITEMS = 50;

export async function POST(req: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Rate limit: 5 checkout attempts per minute per IP
    const rateLimit = checkRateLimit(`checkout:${ip}`, {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const { cartItems, email } = await req.json();

    // Validate email format
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate cart items exist and is an array
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate cart size
    if (cartItems.length > MAX_CART_ITEMS) {
      return NextResponse.json(
        { error: 'Too many items in cart' },
        { status: 400 }
      );
    }

    // Validate each cart item
    for (const item of cartItems) {
      // Validate structure
      if (!item.plugin || !item.plugin.name || typeof item.payAmount !== 'number') {
        return NextResponse.json(
          { error: 'Invalid cart item format' },
          { status: 400 }
        );
      }

      // Validate payment amount
      if (item.payAmount < 0 || item.payAmount > MAX_PAYMENT_AMOUNT) {
        return NextResponse.json(
          { error: `Payment amount must be between $0 and $${MAX_PAYMENT_AMOUNT}` },
          { status: 400 }
        );
      }

      // Validate no NaN or Infinity
      if (!Number.isFinite(item.payAmount)) {
        return NextResponse.json(
          { error: 'Invalid payment amount' },
          { status: 400 }
        );
      }
    }

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
