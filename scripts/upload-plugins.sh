#!/bin/bash

# Script to upload plugin installers to Vercel Blob Storage
# Usage: ./scripts/upload-plugins.sh

set -e

echo "🚀 Uploading plugin installers to Vercel Blob Storage..."
echo ""

# Check if BLOB_READ_WRITE_TOKEN is set
if [ -z "$BLOB_READ_WRITE_TOKEN" ]; then
  echo "❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set"
  echo "Please run: export BLOB_READ_WRITE_TOKEN=your_token_here"
  exit 1
fi

# Base paths
MAC_DIR="/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Mac"
WINDOWS_DIR="/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers/Windows"

# Check if directories exist
if [ ! -d "$MAC_DIR" ]; then
  echo "❌ Error: Mac installers directory not found: $MAC_DIR"
  exit 1
fi

if [ ! -d "$WINDOWS_DIR" ]; then
  echo "❌ Error: Windows installers directory not found: $WINDOWS_DIR"
  exit 1
fi

# Upload function
upload_file() {
  local file_path=$1
  local blob_name=$2

  echo "📦 Uploading: $blob_name"

  # Use npx to upload to Vercel Blob
  npx @vercel/blob upload "$file_path" \
    --token "$BLOB_READ_WRITE_TOKEN" \
    --pathname "plugins/$blob_name"

  if [ $? -eq 0 ]; then
    echo "✅ Uploaded: $blob_name"
  else
    echo "❌ Failed to upload: $blob_name"
  fi
  echo ""
}

# Upload macOS installers
echo "📱 Uploading macOS installers..."
upload_file "$MAC_DIR/Cassette Tapeworm_v1.0.4_macOS.pkg" "Cassette Tapeworm_v1.0.4_macOS.pkg"
upload_file "$MAC_DIR/PrettyPrettyPrincessSparkle_v1.0.2.pkg" "PrettyPrettyPrincessSparkle_v1.0.2.pkg"
upload_file "$MAC_DIR/Space Bass Butt_v1.0.7.pkg" "Space Bass Butt_v1.0.7.pkg"
upload_file "$MAC_DIR/TapeBloom_v1.0.9.pkg" "TapeBloom_v1.0.9.pkg"
upload_file "$MAC_DIR/Tapeworm_v1.0.8.pkg" "Tapeworm_v1.0.8.pkg"

# Upload Windows installers
echo "🪟 Uploading Windows installers..."
upload_file "$WINDOWS_DIR/CassetteTapeworm-v1.0.0-Windows-x64.exe" "CassetteTapeworm-v1.0.0-Windows-x64.exe"
upload_file "$WINDOWS_DIR/PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe" "PrettyPrettyPrincessSparkle-v1.0.2-Windows-x64.exe"
upload_file "$WINDOWS_DIR/SpaceBassButt-v1.0.7-Windows-x64.exe" "SpaceBassButt-v1.0.7-Windows-x64.exe"
upload_file "$WINDOWS_DIR/TapeBloom-v1.0.0-Windows-x64.exe" "TapeBloom-v1.0.0-Windows-x64.exe"
upload_file "$WINDOWS_DIR/Tapeworm-v1.0.8-Windows-x64.exe" "Tapeworm-v1.0.8-Windows-x64.exe"

echo "🎉 All plugin installers uploaded successfully!"
