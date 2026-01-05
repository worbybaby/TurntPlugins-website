import { Resend } from 'resend';
import PurchaseConfirmationEmail from '@/emails/PurchaseConfirmation';
import { saveOrder, saveDownloadLink, initDatabase } from './db';
import { generateSignedUrl } from '@/app/data/pluginFiles';
import { generateVocalFeltLicense } from '../../lib/licenseGenerator';

export interface ProcessOrderParams {
  email: string;
  paymentProvider: 'stripe' | 'paypal';
  transactionId: string; // Stripe session ID or PayPal order ID
  amountTotal: number; // in cents
  plugins: Array<{ id: string; name: string }>;
  marketingOptIn: boolean;
  discountCode?: string;
}

export interface DownloadLink {
  pluginName: string;
  macDownloadUrl: string;
  windowsDownloadUrl: string;
}

export interface ProcessOrderResult {
  orderId: number;
  downloadLinks: DownloadLink[];
  licenseKey?: string;
}

/**
 * Shared order processing logic for both Stripe and PayPal payments
 * Handles: license generation, order saving, download link creation, email sending
 */
export async function processOrder(params: ProcessOrderParams): Promise<ProcessOrderResult> {
  const {
    email,
    paymentProvider,
    transactionId,
    amountTotal,
    plugins,
    marketingOptIn,
    discountCode
  } = params;

  console.log(`📦 Processing ${paymentProvider} order for:`, email);

  // Check if VocalFelt (id: '7') is in the order
  const hasVocalFelt = plugins.some((plugin) => plugin.id === '7');
  let licenseKey: string | undefined;

  if (hasVocalFelt) {
    licenseKey = generateVocalFeltLicense();
    console.log('🎫 Generated VocalFelt license:', licenseKey);
  }

  // Initialize database tables if needed
  await initDatabase();
  console.log('📦 Database initialized');

  // Save order to database
  const orderId = await saveOrder(
    email,
    transactionId,
    amountTotal,
    plugins,
    marketingOptIn,
    licenseKey,
    paymentProvider
  );
  console.log('💾 Order saved with ID:', orderId);

  // Generate download links with 3-day expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 3); // 3 days from now

  // Create download links for each plugin (Mac and Windows)
  const downloadLinks: DownloadLink[] = [];

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

  // Send confirmation email with download links
  console.log('📧 Sending email to:', email);
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const emailResult = await resend.emails.send({
      from: 'Turnt Plugins <downloads@turntplugins.com>',
      to: email,
      subject: 'Your Turnt Plugins Purchase Confirmation',
      react: PurchaseConfirmationEmail({
        customerEmail: email,
        plugins: plugins,
        orderTotal: amountTotal,
        orderId: transactionId,
        downloadLinks,
        licenseKey,
      }),
    });

    console.log('✅ Email sent successfully!', emailResult);
  } catch (emailError) {
    console.error('❌ Failed to send email:', emailError);
    // Don't throw - order is saved, email can be resent manually
  }

  console.log('🎉 Order processed successfully for:', email);

  return {
    orderId,
    downloadLinks,
    licenseKey,
  };
}
