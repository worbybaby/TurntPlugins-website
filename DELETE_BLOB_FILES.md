# Delete Installer Files from Vercel Blob

## Files to Delete (12 total):

### Mac Installers (.pkg)
- `plugins/CassetteVibe_v2.0.0_macOS.pkg` (62 MB)
- `plugins/PrettyPrettyPrincessSparkle_v1.0.3.pkg` (56 MB)
- `plugins/RubberPRE_v1.0.3.pkg` (38 MB)
- `plugins/Space Bass Butt_v1.0.8.pkg` (58 MB)
- `plugins/TapeBloom_v1.1.1.pkg` (66 MB)
- `plugins/Tapeworm_v1.0.9.pkg` (60 MB)

### Windows Installers (.exe)
- `plugins/CassetteVibe-v2.0.0-Windows-x64.exe` (17 MB)
- `plugins/PPPS-v1.0.2-Win-x64.exe` (16 MB)
- `plugins/RubberPRE-v1.0.3-Windows-x64.exe` (11 MB)
- `plugins/SpaceBassButt-v1.0.8-Windows-x64.exe` (16 MB)
- `plugins/TapeBloom-v1.1.1-Windows-x64.exe` (15 MB)
- `plugins/Tapeworm-v1.0.8-Windows-x64.exe` (16 MB)

**Total to free up: ~431 MB**

## How to Delete

### Via Vercel Dashboard (Recommended):
1. https://vercel.com/dashboard
2. Select: TurntPlugins-website
3. Sidebar: Storage → Blob
4. Navigate to `plugins/` folder
5. Select all 12 installer files
6. Delete

### Via Script:
```bash
# Get token from Vercel dashboard first
BLOB_READ_WRITE_TOKEN="your-token" node scripts/cleanup-blob-installers.mjs
```

## Why It's Safe to Delete

✅ Downloads now use GitHub Releases (unlimited bandwidth)
✅ User experience unchanged (same download flow)
✅ Frees up 431 MB = reduces Blob transfer from 75% to ~5-10%
✅ No more bandwidth quota warnings

## After Deletion

Your Vercel Blob usage will drop significantly:
- Before: 7.5 GB / 10 GB (75%)
- After: ~0.5-1 GB / 10 GB (5-10%)
- Remaining files: just website images/assets
