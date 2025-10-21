// Plugin file mappings for Vercel Blob storage
// Files will be uploaded to Vercel Blob and URLs will be stored here

export interface PluginFileInfo {
  fileName: string;
  blobUrl?: string; // Will be populated after upload to Vercel Blob
  fileSize: string;
  platform: 'macOS' | 'Windows';
}

export interface PluginFile {
  id: string;
  files: PluginFileInfo[];
}

export const pluginFiles: Record<string, PluginFile> = {
  '1': {
    id: '1',
    files: [
      {
        fileName: 'CassetteVibe_v1.0.7_macOS.pkg',
        fileSize: '62MB',
        platform: 'macOS',
      },
      {
        fileName: 'CassetteVibe-v1.0.7-Windows-x64.exe',
        fileSize: '17MB',
        platform: 'Windows',
      },
    ],
  },
  '2': {
    id: '2',
    files: [
      {
        fileName: 'PrettyPrettyPrincessSparkle_v1.0.3.pkg',
        fileSize: '56MB',
        platform: 'macOS',
      },
      {
        fileName: 'PPPS-v1.0.2-Win-x64.exe',
        fileSize: '16MB',
        platform: 'Windows',
      },
    ],
  },
  '3': {
    id: '3',
    files: [
      {
        fileName: 'Space Bass Butt_v1.0.8.pkg',
        fileSize: '58MB',
        platform: 'macOS',
      },
      {
        fileName: 'SpaceBassButt-v1.0.8-Windows-x64.exe',
        fileSize: '16MB',
        platform: 'Windows',
      },
    ],
  },
  '4': {
    id: '4',
    files: [
      {
        fileName: 'TapeBloom_v1.0.9.pkg',
        fileSize: '66MB',
        platform: 'macOS',
      },
      {
        fileName: 'TapeBloom-v1.0.0-Windows-x64.exe',
        fileSize: '15MB',
        platform: 'Windows',
      },
    ],
  },
  '5': {
    id: '5',
    files: [
      {
        fileName: 'Tapeworm_v1.0.9.pkg',
        fileSize: '60MB',
        platform: 'macOS',
      },
      {
        fileName: 'Tapeworm-v1.0.8-Windows-x64.exe',
        fileSize: '16MB',
        platform: 'Windows',
      },
    ],
  },
};

// Helper function to get plugin file info
export function getPluginFile(pluginId: string): PluginFile | null {
  return pluginFiles[pluginId] || null;
}

// Generate signed download URL with expiration
export function generateSignedUrl(pluginId: string, orderId: string, platform?: 'macOS' | 'Windows'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const platformParam = platform ? `&platform=${platform}` : '';
  const token = Buffer.from(`${orderId}:${pluginId}:${Date.now()}`).toString('base64');
  return `${baseUrl}/api/download?token=${token}${platformParam}`;
}
