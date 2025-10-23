import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { generateSignedUrl } from '@/app/data/pluginFiles';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the order and its plugins
    const orderResult = await sql`
      SELECT id, email, plugins
      FROM orders
      WHERE id = ${orderId};
    `;

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];
    const plugins = JSON.parse(order.plugins);

    // Set new expiration date (3 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);

    // Delete old download links
    await sql`
      DELETE FROM downloads
      WHERE order_id = ${orderId};
    `;

    // Generate new download links for each plugin (Mac and Windows)
    for (const plugin of plugins) {
      const macDownloadUrl = generateSignedUrl(plugin.id, orderId.toString(), 'macOS');
      const windowsDownloadUrl = generateSignedUrl(plugin.id, orderId.toString(), 'Windows');

      // Save both download links to database
      await sql`
        INSERT INTO downloads (order_id, plugin_id, plugin_name, download_url, expires_at)
        VALUES (${orderId}, ${plugin.id}, ${plugin.name}, ${macDownloadUrl}, ${expiresAt.toISOString()});
      `;

      await sql`
        INSERT INTO downloads (order_id, plugin_id, plugin_name, download_url, expires_at)
        VALUES (${orderId}, ${plugin.id + '-windows'}, ${plugin.name + ' (Windows)'}, ${windowsDownloadUrl}, ${expiresAt.toISOString()});
      `;
    }

    return NextResponse.json({
      success: true,
      message: 'Download links regenerated successfully',
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Error regenerating download links:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate download links' },
      { status: 500 }
    );
  }
}
