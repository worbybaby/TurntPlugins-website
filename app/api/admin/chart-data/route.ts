import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
  try {
    // Get orders grouped by day for the last 30 days
    const result = await sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as total_orders,
        SUM(CASE WHEN amount_total > 0 THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN amount_total = 0 THEN 1 ELSE 0 END) as free_orders,
        SUM(amount_total) as revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC;
    `;

    // Fill in missing days with zeros
    const chartData = [];
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Create a map of existing data
    const dataMap = new Map();
    result.rows.forEach(row => {
      dataMap.set(row.date.toISOString().split('T')[0], {
        totalOrders: parseInt(row.total_orders),
        paidOrders: parseInt(row.paid_orders),
        freeOrders: parseInt(row.free_orders),
        revenue: parseInt(row.revenue) || 0,
      });
    });

    // Fill in all 30 days
    for (let i = 0; i <= 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      chartData.push({
        date: dateStr,
        totalOrders: dataMap.get(dateStr)?.totalOrders || 0,
        paidOrders: dataMap.get(dateStr)?.paidOrders || 0,
        freeOrders: dataMap.get(dateStr)?.freeOrders || 0,
        revenue: dataMap.get(dateStr)?.revenue || 0,
      });
    }

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error('Chart data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
