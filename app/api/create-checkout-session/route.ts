import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkRateLimit } from '../lib/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PAYMENT_AMOUNT = 10000; // $10,000 max per item
const MAX_CART_ITEMS = 50;

// Discount code validation
const VALID_DISCOUNT_CODES: Record<string, number> = {
  'ALLMYFRIENDSAREPLUGINS': 100, // 100% off
  'JUSTINSHERIFF': 100, // 100% off
};

function validateDiscountCode(code: string | null): number {
  if (!code) return 0;
  const upperCode = code.trim().toUpperCase();
  return VALID_DISCOUNT_CODES[upperCode] || 0;
}

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

    const { cartItems, email, marketingOptIn, discountCode } = await req.json();

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

      // Validate minimum price (if plugin has one)
      const minimumPrice = item.plugin.minimumPrice || 0;
      if (item.payAmount > 0 && item.payAmount < minimumPrice) {
        return NextResponse.json(
          { error: `${item.plugin.name} requires a minimum payment of $${minimumPrice}` },
          { status: 400 }
        );
      }
    }

    // Validate and apply discount code
    const discountPercentage = validateDiscountCode(discountCode);

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum: number, item: { payAmount: number }) => sum + item.payAmount, 0);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalAmount = Math.max(0, subtotal - discountAmount);

    // If total is 0 after discount, handle as free download
    if (totalAmount === 0) {
      return NextResponse.json({
        url: null,
        isFree: true,
        message: 'Free download - no payment required'
      });
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item: { plugin: { name: string; description: string }, payAmount: number }) => {
      // Apply discount proportionally to each item
      const itemDiscountAmount = (item.payAmount * discountPercentage) / 100;
      const finalAmount = Math.max(0, item.payAmount - itemDiscountAmount);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.plugin.name,
            description: item.plugin.description,
          },
          unit_amount: Math.round(finalAmount * 100), // Convert to cents
        },
        quantity: 1,
      };
    });

    // Filter out items with 0 amount (free downloads will be handled differently)
    const paidItems = lineItems.filter((item: { price_data: { unit_amount: number } }) => item.price_data.unit_amount > 0);

    // If there are no paid items after filtering, handle as free download
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
        marketingOptIn: marketingOptIn ? 'true' : 'false',
        discountCode: discountCode || '',
        plugins: JSON.stringify(
          cartItems.flatMap((item: { plugin: { id: string, name: string } }) => {
            // If bundle, expand to all 5 individual plugins
            if (item.plugin.id === 'bundle') {
              return [
                { id: '1', name: 'Cassette Vibe' },
                { id: '2', name: 'Pretty Pretty Princess Sparkle' },
                { id: '3', name: 'Space Bass Butt' },
                { id: '4', name: 'Tape Bloom' },
                { id: '5', name: 'Tapeworm' },
              ];
            }
            return [{ id: item.plugin.id, name: item.plugin.name }];
          })
        ),
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
