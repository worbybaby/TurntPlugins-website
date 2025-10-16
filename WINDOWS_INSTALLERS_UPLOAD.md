# Uploading Windows Installers to Vercel Blob

## Overview
The website has been updated to support both macOS and Windows installers. When users purchase/download plugins, they will receive download links for both platforms in their email.

## What Changed

### 1. Plugin Files Configuration (`app/data/pluginFiles.ts`)
- Updated to support multiple files per plugin (macOS + Windows)
- Each plugin now has a `files` array with platform-specific information
- File mappings:
  - **Cassette Tape**: `Cassette Tapeworm_v1.0.4_macOS.pkg` + `CassetteTapeworm-v1.0.0-Windows-x64.exe`
  - **Pretty Pretty Princess Sparkle**: `PrettyPrettyPrincessSparkle_v1.0.2.pkg` + `PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe`
  - **Space Bass Butt**: `Space Bass Butt_v1.0.7.pkg` + `SpaceBassButt-v1.0.7-Windows-x64.exe`
  - **Tape Bloom**: `TapeBloom_v1.0.9.pkg` + `TapeBloom-v1.0.0-Windows-x64.exe`
  - **Tapeworm**: `Tapeworm_v1.0.8.pkg` + `Tapeworm-v1.0.8-Windows-x64.exe`

### 2. Download Route (`app/api/download/route.ts`)
- Now accepts optional `platform` query parameter (`macOS` or `Windows`)
- Automatically finds the correct file based on platform
- Backwards compatible (defaults to first file if no platform specified)

### 3. Email Template (`emails/PurchaseConfirmation.tsx`)
- Updated to display two download buttons per plugin:
  - "Download for macOS"
  - "Download for Windows"
- Both buttons appear side by side in the email

### 4. Webhook & Free Download Routes
- Both `/api/webhooks/stripe/route.ts` and `/api/free-download/route.ts` updated
- Generate separate download links for macOS and Windows
- Save both links to database

## Upload Instructions

### Option 1: Using the Upload Script (Recommended)

1. **Set your Vercel Blob token** (from `.env.local`):
   ```bash
   cd turnt-plugins-site
   export BLOB_READ_WRITE_TOKEN=vercel_blob_rw_0bF0GYDSmdIu81V7_Wxp52A3fAFmk3No2l22AxvgIZ9ZKhe
   ```

2. **Run the upload script**:
   ```bash
   ./scripts/upload-plugins.sh
   ```

   This will upload all 10 files (5 macOS + 5 Windows) to Vercel Blob under the `plugins/` prefix.

### Option 2: Using Vercel CLI Manually

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Set your Blob token**:
   ```bash
   export BLOB_READ_WRITE_TOKEN=vercel_blob_rw_0bF0GYDSmdIu81V7_Wxp52A3fAFmk3No2l22AxvgIZ9ZKhe
   ```

3. **Upload Windows installers**:
   ```bash
   npx @vercel/blob upload "/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/CassetteTapeworm-v1.0.0-Windows-x64.exe" --token $BLOB_READ_WRITE_TOKEN --pathname "plugins/CassetteTapeworm-v1.0.0-Windows-x64.exe"

   npx @vercel/blob upload "/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe" --token $BLOB_READ_WRITE_TOKEN --pathname "plugins/PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe"

   npx @vercel/blob upload "/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/SpaceBassButt-v1.0.7-Windows-x64.exe" --token $BLOB_READ_WRITE_TOKEN --pathname "plugins/SpaceBassButt-v1.0.7-Windows-x64.exe"

   npx @vercel/blob upload "/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/TapeBloom-v1.0.0-Windows-x64.exe" --token $BLOB_READ_WRITE_TOKEN --pathname "plugins/TapeBloom-v1.0.0-Windows-x64.exe"

   npx @vercel/blob upload "/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows/Tapeworm-v1.0.8-Windows-x64.exe" --token $BLOB_READ_WRITE_TOKEN --pathname "plugins/Tapeworm-v1.0.8-Windows-x64.exe"
   ```

### Option 3: Using Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Blob**
3. Click **Upload** for each file
4. Upload to the `plugins/` directory with these exact filenames:
   - `CassetteTapeworm-v1.0.0-Windows-x64.exe`
   - `PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe`
   - `SpaceBassButt-v1.0.7-Windows-x64.exe`
   - `TapeBloom-v1.0.0-Windows-x64.exe`
   - `Tapeworm-v1.0.8-Windows-x64.exe`

## Verification

After uploading, test the download flow:

1. **Make a test purchase** on your site
2. **Check the email** - you should see two buttons per plugin:
   - "Download for macOS"
   - "Download for Windows"
3. **Click both buttons** - both should download the correct installers

## Important Notes

- **File naming must match exactly** what's in `app/data/pluginFiles.ts`
- All files must be uploaded to the `plugins/` prefix in Vercel Blob
- The macOS installers should already be uploaded
- Links expire after 3 days (configurable in webhook routes)
- Make sure to **redeploy** the site after making these code changes

## Deployment

After uploading the Windows installers:

```bash
cd turnt-plugins-site
git add .
git commit -m "Add Windows installer support for all plugins"
git push
```

Vercel will automatically deploy the changes.

## Testing

Test with Stripe test mode:
- Test email: your-email@example.com
- Test card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

Check that:
- Email contains both Mac and Windows download buttons
- Both download links work
- Files download with correct names
- "My Downloads" page shows both platform options
