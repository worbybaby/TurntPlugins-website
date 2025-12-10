import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { incrementDownloadCount } from '../lib/db';
import { getPluginFile } from '@/app/data/pluginFiles';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing download token' },
        { status: 400 }
      );
    }

    // Decode token (format: base64 of orderId:pluginId:timestamp)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [orderId, pluginId] = decoded.split(':');

    if (!orderId || !pluginId) {
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 400 }
      );
    }

    // Get download from database
    const result = await sql`
      SELECT d.*, o.email
      FROM downloads d
      JOIN orders o ON d.order_id = o.id
      WHERE d.order_id = ${parseInt(orderId)}
        AND d.plugin_id = ${pluginId}
      LIMIT 1;
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Download not found' },
        { status: 404 }
      );
    }

    const download = result.rows[0];

    // Check if expired
    if (new Date(download.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Download link has expired. Please contact support.' },
        { status: 410 }
      );
    }

    // Increment download count
    await incrementDownloadCount(parseInt(orderId), pluginId);

    // Get plugin file info
    const pluginFile = getPluginFile(pluginId);
    if (!pluginFile || !pluginFile.files || pluginFile.files.length === 0) {
      return NextResponse.json(
        { error: 'Plugin file not found' },
        { status: 404 }
      );
    }

    // Check if platform is specified in query params
    const platform = searchParams.get('platform') as 'macOS' | 'Windows' | null;

    // If platform specified, find that specific file
    let targetFile;
    if (platform) {
      targetFile = pluginFile.files.find(f => f.platform === platform);
      if (!targetFile) {
        return NextResponse.json(
          { error: `Plugin file not found for ${platform}` },
          { status: 404 }
        );
      }
    } else {
      // Default to first file (backwards compatibility)
      targetFile = pluginFile.files[0];
    }

    // Redirect to GitHub Releases download URL
    // GitHub URLs are public and permanent
    return NextResponse.redirect(targetFile.downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
