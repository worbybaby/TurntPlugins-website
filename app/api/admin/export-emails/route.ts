import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
  try {
    // Get all orders with customer info
    const result = await sql`
      SELECT
        o.email,
        o.created_at,
        o.amount_total,
        o.plugins
      FROM orders o
      ORDER BY o.created_at DESC;
    `;

    // Create CSV content
    const headers = ['Email', 'Date', 'Amount', 'Plugins', 'Type'];
    const rows = result.rows.map(row => {
      const plugins = JSON.parse(row.plugins)
        .map((p: { name: string }) => p.name)
        .join('; ');
      const amount = row.amount_total === 0 ? 'FREE' : `$${(row.amount_total / 100).toFixed(2)}`;
      const type = row.amount_total === 0 ? 'Free' : 'Paid';
      const date = new Date(row.created_at).toLocaleDateString();

      return [row.email, date, amount, plugins, type];
    });

    // Build CSV
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="turnt-plugins-emails-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export emails' },
      { status: 500 }
    );
  }
}
