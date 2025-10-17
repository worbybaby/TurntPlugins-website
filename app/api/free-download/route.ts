import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import PurchaseConfirmationEmail from '@/emails/PurchaseConfirmation';
import { saveOrder, saveDownloadLink, initDatabase } from '../lib/db';
import { generateSignedUrl } from '@/app/data/pluginFiles';
import { checkRateLimit } from '../lib/rateLimiter';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Rate limit: 5 free downloads per hour per IP
    const rateLimit = checkRateLimit(`free-download:${ip}`, {
      maxRequests: 5,
      windowMs: 3600000, // 1 hour
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

    const { cartItems, email, marketingOptIn } = await req.json();

    // Validate email format
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate cart items
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Initialize database tables if needed
    await initDatabase();

    // Extract plugins from cart items
    const plugins = cartItems.map((item: { plugin: { id: string; name: string } }) => ({
      id: item.plugin.id,
      name: item.plugin.name,
    }));

    // Generate a unique session ID for free downloads
    const freeSessionId = `free_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Save order to database (amount = 0 for free)
    const orderId = await saveOrder(
      email,
      freeSessionId,
      0, // Free download
      plugins,
      marketingOptIn || false
    );

    // Generate download links with 3-day expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);

    const downloadLinks: Array<{
      pluginName: string;
      macDownloadUrl: string;
      windowsDownloadUrl: string;
    }> = [];

    for (const plugin of plugins) {
      const macDownloadUrl = generateSignedUrl(plugin.id, orderId.toString(), 'macOS');
      const windowsDownloadUrl = generateSignedUrl(plugin.id, orderId.toString(), 'Windows');

      // Save both download links to database
      await saveDownloadLink(
        orderId,
        plugin.id,
        plugin.name,
        macDownloadUrl,
        expiresAt
      );

      await saveDownloadLink(
        orderId,
        plugin.id + '-windows',
        plugin.name + ' (Windows)',
        windowsDownloadUrl,
        expiresAt
      );

      downloadLinks.push({
        pluginName: plugin.name,
        macDownloadUrl,
        windowsDownloadUrl,
      });
    }

    // Send confirmation email
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: 'Turnt Plugins <downloads@turntplugins.com>',
      to: email,
      subject: 'Your Free Turnt Plugins Download',
      react: PurchaseConfirmationEmail({
        customerEmail: email,
        plugins: plugins,
        orderTotal: 0,
        orderId: freeSessionId,
        downloadLinks,
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Check your email for download links!'
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Free download error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process free download' },
      { status: 500 }
    );
  }
}
