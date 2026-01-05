# GitHub Releases Migration Guide

## Step 1: Create GitHub Release

1. Go to: https://github.com/worbybaby/TurntPlugins-website/releases
2. Click **"Create a new release"** (or "Draft a new release")
3. Fill in:
   - **Tag version:** `v1.0.0-installers` (or any version)
   - **Release title:** `Plugin Installers v1.0`
   - **Description:**
     ```
     Plugin installers for Turnt Plugins.

     Includes:
     - Rubber.PRE v1.0.3
     - Cassette Vibe v2.0.0
     - Pretty Pretty Princess Sparkle v1.0.3
     - Space Bass Butt v1.0.8
     - Tape Bloom v1.1.1
     - Tapeworm v1.0.9

     All installers are available for macOS and Windows.
     ```
4. **Don't click "Publish release" yet** - we need to upload files first

## Step 2: Upload Installer Files

In the release draft, scroll to **"Attach binaries"** section and upload:

### Rubber.PRE
- `RubberPRE_v1.0.3.pkg` (Mac)
- `RubberPRE-v1.0.3-Windows-x64.exe` (Windows)

### Cassette Vibe
- `CassetteVibe_v2.0.0_macOS.pkg` (Mac)
- `CassetteVibe-v2.0.0-Windows-x64.exe` (Windows)

### Pretty Pretty Princess Sparkle
- `PrettyPrettyPrincessSparkle_v1.0.3.pkg` (Mac)
- `PPPS-v1.0.2-Win-x64.exe` (Windows)

### Space Bass Butt
- `Space Bass Butt_v1.0.8.pkg` (Mac)
- `SpaceBassButt-v1.0.8-Windows-x64.exe` (Windows)

### Tape Bloom
- `TapeBloom_v1.1.1.pkg` (Mac)
- `TapeBloom-v1.1.1-Windows-x64.exe` (Windows)

### Tapeworm
- `Tapeworm_v1.0.9.pkg` (Mac)
- `Tapeworm-v1.0.8-Windows-x64.exe` (Windows)

## Step 3: Publish Release

1. Once all files are uploaded, click **"Publish release"**
2. GitHub will generate permanent URLs for each file

## Step 4: Get Download URLs

After publishing, each file will have a URL like:
```
https://github.com/worbybaby/TurntPlugins-website/releases/download/v1.0.0-installers/RubberPRE_v1.0.3.pkg
```

**Format:**
```
https://github.com/{username}/{repo}/releases/download/{tag}/{filename}
```

## Benefits of GitHub Releases

✅ **Unlimited bandwidth** (free)
✅ **Permanent URLs** (don't expire)
✅ **Version control** (easy to update)
✅ **Professional** (industry standard)
✅ **Reliable** (GitHub CDN)
✅ **Public or private** repos work

## Next Steps

After creating the release, we'll update your code to use GitHub URLs instead of Vercel Blob.
