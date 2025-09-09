#!/bin/bash

# Arcade Meltdown - macOS Installer Script

# Set variables
APP_NAME="Arcade Meltdown"
APP_VERSION="1.0.0"
APP_BUNDLE_NAME="Arcade Meltdown.app"
APP_BUNDLE_ID="com.arcademeltdown.app"
APP_ICON="../assets/icons/icon.icns"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DIST_DIR="$PROJECT_DIR/dist"
BUILD_DIR="$SCRIPT_DIR/build"

# Create build directory
mkdir -p "$BUILD_DIR"

# Create app bundle structure
APP_BUNDLE_DIR="$BUILD_DIR/$APP_BUNDLE_NAME"
mkdir -p "$APP_BUNDLE_DIR/Contents/MacOS"
mkdir -p "$APP_BUNDLE_DIR/Contents/Resources"
mkdir -p "$APP_BUNDLE_DIR/Contents/Frameworks"

# Create Info.plist
cat > "$APP_BUNDLE_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>English</string>
    <key>CFBundleDisplayName</key>
    <string>$APP_NAME</string>
    <key>CFBundleExecutable</key>
    <string>Arcade Meltdown</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>$APP_BUNDLE_ID</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$APP_VERSION</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleVersion</key>
    <string>$APP_VERSION</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.games</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.12.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSRequiresAquaSystemAppearance</key>
    <false/>
</dict>
</plist>
EOF

# Copy icon if it exists
if [ -f "$PROJECT_DIR/$APP_ICON" ]; then
    cp "$PROJECT_DIR/$APP_ICON" "$APP_BUNDLE_DIR/Contents/Resources/icon.icns"
fi

# Create a simple launcher script
cat > "$APP_BUNDLE_DIR/Contents/MacOS/Arcade Meltdown" << EOF
#!/bin/bash

# Get the directory where this script is located
DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

# Open the game in the default browser
open "\$DIR/../Resources/index.html"
EOF

# Make the launcher script executable
chmod +x "$APP_BUNDLE_DIR/Contents/MacOS/Arcade Meltdown"

# Copy game files to Resources directory
cp -R "$DIST_DIR/"* "$APP_BUNDLE_DIR/Contents/Resources/"

# Create a DMG file
DMG_NAME="$APP_NAME-$APP_VERSION"
DMG_PATH="$BUILD_DIR/$DMG_NAME.dmg"

# Create a temporary directory for DMG
DMG_TEMP_DIR="$BUILD_DIR/dmg"
mkdir -p "$DMG_TEMP_DIR"

# Copy app bundle to DMG directory
cp -R "$APP_BUNDLE_DIR" "$DMG_TEMP_DIR/"

# Create a symlink to Applications
ln -s /Applications "$DMG_TEMP_DIR/Applications"

# Create DMG
hdiutil create -volname "$APP_NAME $APP_VERSION" -srcfolder "$DMG_TEMP_DIR" -ov -format UDZO "$DMG_PATH"

# Clean up
rm -rf "$DMG_TEMP_DIR"

# Output success message
echo "macOS installer created successfully: $DMG_PATH"
echo "To install, copy the $APP_BUNDLE_NAME to your Applications folder."