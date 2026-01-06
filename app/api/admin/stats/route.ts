import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
  try {
    // Get overall stats
    const statsResult = await sql`
      SELECT
        COUNT(*) as total_orders,
        COUNT(DISTINCT email) as unique_customers,
        SUM(amount_total) as total_revenue,
        SUM(CASE WHEN amount_total = 0 THEN 1 ELSE 0 END) as free_downloads,
        SUM(CASE WHEN amount_total > 0 THEN 1 ELSE 0 END) as paid_orders,
        COUNT(DISTINCT CASE WHEN marketing_opt_in = true THEN email END) as marketing_subscribers
      FROM orders;
    `;

    // Get payment provider breakdown
    const providerResult = await sql`
      SELECT
        payment_provider,
        COUNT(*) as order_count,
        SUM(amount_total) as revenue
      FROM orders
      WHERE amount_total > 0
      GROUP BY payment_provider;
    `;

    // Get total download count
    const downloadResult = await sql`
      SELECT SUM(download_count) as total_downloads
      FROM downloads;
    `;

    // Get plugin popularity
    const pluginResult = await sql`
      SELECT
        d.plugin_name,
        COUNT(DISTINCT d.order_id) as order_count
      FROM downloads d
      WHERE d.plugin_name NOT LIKE '%(Windows)%'
      GROUP BY d.plugin_name
      ORDER BY order_count DESC;
    `;

    // Get recent orders with download counts
    const ordersResult = await sql`
      SELECT
        o.id,
        o.email,
        o.amount_total,
        o.plugins,
        o.created_at,
        o.license_key,
        o.payment_provider,
        COALESCE(SUM(d.download_count), 0) as download_count
      FROM orders o
      LEFT JOIN downloads d ON o.id = d.order_id
      GROUP BY o.id, o.email, o.amount_total, o.plugins, o.created_at, o.license_key, o.payment_provider
      ORDER BY o.created_at DESC
      LIMIT 50;
    `;

    const stats = {
      totalOrders: parseInt(statsResult.rows[0].total_orders),
      uniqueCustomers: parseInt(statsResult.rows[0].unique_customers),
      totalRevenue: parseInt(statsResult.rows[0].total_revenue) || 0,
      freeDownloads: parseInt(statsResult.rows[0].free_downloads),
      paidOrders: parseInt(statsResult.rows[0].paid_orders),
      totalDownloads: parseInt(downloadResult.rows[0].total_downloads) || 0,
      marketingSubscribers: parseInt(statsResult.rows[0].marketing_subscribers) || 0,
    };

    const providerBreakdown = providerResult.rows.map(row => ({
      provider: row.payment_provider || 'unknown',
      orders: parseInt(row.order_count) || 0,
      revenue: parseInt(row.revenue) || 0,
    }));

    const pluginStats = pluginResult.rows.map(row => ({
      name: row.plugin_name,
      count: parseInt(row.order_count),
    }));

    const recentOrders = ordersResult.rows.map(row => ({
      id: row.id,
      email: row.email,
      amount_total: row.amount_total,
      plugins: row.plugins,
      created_at: row.created_at,
      download_count: parseInt(row.download_count) || 0,
      license_key: row.license_key || undefined,
      payment_provider: row.payment_provider || 'stripe',
    }));

    return NextResponse.json({
      stats,
      providerBreakdown,
      pluginStats,
      recentOrders,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
