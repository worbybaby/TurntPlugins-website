// Plugin file mappings for GitHub Releases
// Files are hosted on GitHub Releases for unlimited bandwidth

const GITHUB_RELEASE_BASE_URL = 'https://github.com/worbybaby/TurntPlugins-website/releases/download/installers-v1.0.0';

export interface PluginFileInfo {
  fileName: string;
  downloadUrl: string; // Direct download URL from GitHub Releases
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
        fileName: 'CassetteVibe_v2.0.0_macOS.pkg',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/CassetteVibe_v2.0.0_macOS.pkg`,
        fileSize: '62MB',
        platform: 'macOS',
      },
      {
        fileName: 'CassetteVibe-v2.0.0-Windows-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/CassetteVibe-v2.0.0-Windows-x64.exe`,
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
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/PrettyPrettyPrincessSparkle_v1.0.3.pkg`,
        fileSize: '56MB',
        platform: 'macOS',
      },
      {
        fileName: 'PPPS-v1.0.2-Win-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/PPPS-v1.0.2-Win-x64.exe`,
        fileSize: '16MB',
        platform: 'Windows',
      },
    ],
  },
  '3': {
    id: '3',
    files: [
      {
        fileName: 'Space.Bass.Butt_v1.0.8.pkg',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/Space.Bass.Butt_v1.0.8.pkg`,
        fileSize: '58MB',
        platform: 'macOS',
      },
      {
        fileName: 'SpaceBassButt-v1.0.8-Windows-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/SpaceBassButt-v1.0.8-Windows-x64.exe`,
        fileSize: '16MB',
        platform: 'Windows',
      },
    ],
  },
  '4': {
    id: '4',
    files: [
      {
        fileName: 'TapeBloom_v2.0.2.pkg',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/TapeBloom_v2.0.2.pkg`,
        fileSize: '81MB',
        platform: 'macOS',
      },
      {
        fileName: 'TapeBloom-v2.0.2-Windows-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/TapeBloom-v2.0.2-Windows-x64.exe`,
        fileSize: '19MB',
        platform: 'Windows',
      },
    ],
  },
  '5': {
    id: '5',
    files: [
      {
        fileName: 'Tapeworm_v1.0.9.pkg',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/Tapeworm_v1.0.9.pkg`,
        fileSize: '60MB',
        platform: 'macOS',
      },
      {
        fileName: 'Tapeworm-v1.0.8-Windows-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/Tapeworm-v1.0.8-Windows-x64.exe`,
        fileSize: '16MB',
        platform: 'Windows',
      },
    ],
  },
  '6': {
    id: '6',
    files: [
      {
        fileName: 'RubberPRE_v1.0.3.pkg',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/RubberPRE_v1.0.3.pkg`,
        fileSize: '38MB',
        platform: 'macOS',
      },
      {
        fileName: 'RubberPRE-v1.0.3-Windows-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/RubberPRE-v1.0.3-Windows-x64.exe`,
        fileSize: '11MB',
        platform: 'Windows',
      },
    ],
  },
  '7': {
    id: '7',
    files: [
      {
        fileName: 'VocalFelt_v1.0.4.pkg',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/VocalFelt_v1.0.4.pkg`,
        fileSize: '72MB',
        platform: 'macOS',
      },
      {
        fileName: 'VocalFelt-v1.0.4-Windows-x64.exe',
        downloadUrl: `${GITHUB_RELEASE_BASE_URL}/VocalFelt-v1.0.4-Windows-x64.exe`,
        fileSize: '19MB',
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
