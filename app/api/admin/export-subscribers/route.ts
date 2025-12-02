import { NextResponse } from 'next/server';
import { getMarketingSubscribers } from '../../lib/db';

export async function GET() {
  try {
    // Get all marketing subscribers
    const subscribers = await getMarketingSubscribers();

    // Create CSV content
    const headers = ['Email', 'Subscribed Date'];
    const rows = subscribers.map(row => {
      const date = new Date(row.subscribed_at).toLocaleDateString();
      return [row.email, date];
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
        'Content-Disposition': `attachment; filename="marketing-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export marketing subscribers' },
      { status: 500 }
    );
  }
}
