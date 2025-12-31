import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Admin endpoint to export emails
 *
 * Usage:
 * - All orders: /api/admin/export-emails?password=YOUR_PASSWORD
 * - Marketing opt-ins only: /api/admin/export-emails?password=YOUR_PASSWORD&marketing=true
 */
export async function GET(req: NextRequest) {
  try {
    // Check admin password
    const password = req.nextUrl.searchParams.get('password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if filtering for marketing opt-ins only
    const marketingOnly = req.nextUrl.searchParams.get('marketing') === 'true';

    // Get orders with customer info
    const result = marketingOnly
      ? await sql`
          SELECT DISTINCT
            o.customer_email as email,
            MAX(o.created_at) as created_at,
            MAX(o.amount_total) as amount_total,
            MAX(o.plugins) as plugins
          FROM orders o
          WHERE o.marketing_opt_in = true
          GROUP BY o.customer_email
          ORDER BY MAX(o.created_at) DESC;
        `
      : await sql`
          SELECT
            o.customer_email as email,
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
    const filename = marketingOnly
      ? `turnt-plugins-marketing-emails-${new Date().toISOString().split('T')[0]}.csv`
      : `turnt-plugins-all-emails-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
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
