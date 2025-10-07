// Plugin file mappings for Vercel Blob storage
// Files will be uploaded to Vercel Blob and URLs will be stored here

export interface PluginFile {
  id: string;
  fileName: string;
  blobUrl?: string; // Will be populated after upload to Vercel Blob
  fileSize: string;
}

export const pluginFiles: Record<string, PluginFile> = {
  'cassette-tape': {
    id: 'cassette-tape',
    fileName: 'Cassette Tapeworm_v1.0.2_macOS.pkg',
    fileSize: '34MB',
  },
  'tape-bloom': {
    id: 'tape-bloom',
    fileName: 'TapeBloom_v1.0.7.pkg',
    fileSize: '42MB',
  },
  'tapeworm': {
    id: 'tapeworm',
    fileName: 'Tapeworm_v1.0.4_notarized_2025-10-03.pkg',
    fileSize: '62MB',
  },
  'space-bass-butt': {
    id: 'space-bass-butt',
    fileName: 'SpaceBassButt_v1.0.2.pkg',
    fileSize: '34MB',
  },
  'pretty-princess-sparkle': {
    id: 'pretty-princess-sparkle',
    fileName: 'PrettyPrettyPrincessSparkle_v1.0.1.pkg',
    fileSize: '29MB',
  },
};

// Helper function to get plugin file info
export function getPluginFile(pluginId: string): PluginFile | null {
  return pluginFiles[pluginId] || null;
}

// Generate signed download URL with expiration
export function generateSignedUrl(pluginId: string, orderId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const token = Buffer.from(`${orderId}:${pluginId}:${Date.now()}`).toString('base64');
  return `${baseUrl}/api/download?token=${token}`;
}
