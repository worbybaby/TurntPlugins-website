import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import { generateTapeBloomLicense } from '../../../lib/licenseGenerator';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if user has any TapeBloom orders
    const ordersResult = await sql`
      SELECT id, tape_bloom_license_key, plugins
      FROM orders
      WHERE email = ${email}
      AND plugins LIKE '%"id":"4"%'
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (ordersResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No TapeBloom purchase found for this email address' },
        { status: 404 }
      );
    }

    const order = ordersResult.rows[0];

    // Generate new license
    const newLicenseKey = generateTapeBloomLicense();

    // Update the order with the new license
    await sql`
      UPDATE orders
      SET tape_bloom_license_key = ${newLicenseKey}
      WHERE id = ${order.id};
    `;

    // Send email with new license
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: 'Turnt Plugins <downloads@turntplugins.com>',
      to: email,
      subject: 'Your Replacement TapeBloom License Key',
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
          <div style="background: #000080; color: white; padding: 15px; border: 4px solid black;">
            <h1 style="margin: 0; font-size: 24px;">TapeBloom License Key</h1>
          </div>

          <div style="border: 4px solid black; border-top: none; padding: 30px; background: white;">
            <p style="font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
              Here is your replacement TapeBloom license key:
            </p>

            <div style="background: #87CEEB; border: 4px solid black; padding: 20px; margin: 20px 0;">
              <div style="background: white; border: 2px solid black; padding: 15px; text-align: center;">
                <p style="font-size: 20px; font-weight: bold; letter-spacing: 2px; margin: 0; font-family: monospace;">
                  ${newLicenseKey}
                </p>
              </div>
            </div>

            <div style="background: #f0f0f0; border: 2px solid black; padding: 20px; margin: 20px 0;">
              <p style="font-weight: bold; margin: 0 0 10px 0;">Installation Instructions:</p>
              <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Download and install TapeBloom</li>
                <li>Create folder: <code style="background: #ddd; padding: 2px 6px;">~/Library/Application Support/TurntPlugins/</code></li>
                <li>Create file: <code style="background: #ddd; padding: 2px 6px;">TapeBloom.lic</code> in that folder</li>
                <li>Paste your license key above into the file and save</li>
                <li>Restart your DAW and load TapeBloom</li>
              </ol>
            </div>

            <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
              You can also access your downloads and license key at any time from your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://turntplugins.com'}/downloads" style="color: #0000FF;">downloads page</a>.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>© 2025 Turnt Plugins. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      licenseKey: newLicenseKey,
    });
  } catch (error) {
    console.error('TapeBloom license generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate license' },
      { status: 500 }
    );
  }
}
