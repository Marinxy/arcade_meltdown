#!/bin/bash

# Arcade Meltdown - Linux Installer Script

# Set variables
APP_NAME="Arcade Meltdown"
APP_VERSION="1.0.0"
APP_ID="arcademeltdown"
APP_ICON="../assets/icons/icon.png"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DIST_DIR="$PROJECT_DIR/dist"
BUILD_DIR="$SCRIPT_DIR/build"

# Create build directory
mkdir -p "$BUILD_DIR"

# Create package directory
PACKAGE_DIR="$BUILD_DIR/$APP_NAME-$APP_VERSION"
mkdir -p "$PACKAGE_DIR"

# Copy game files
cp -R "$DIST_DIR/"* "$PACKAGE_DIR/"

# Create desktop entry
cat > "$BUILD_DIR/$APP_ID.desktop" << EOF
[Desktop Entry]
Version=$APP_VERSION
Type=Application
Name=$APP_NAME
Comment=A chaotic co-op wave-based shooter with LAN support
Exec=python3 /opt/$APP_ID/server.py
Icon=$APP_ID
Terminal=false
Categories=Game;ActionGame;
StartupNotify=true
EOF

# Create launcher script
cat > "$BUILD_DIR/launcher.sh" << EOF
#!/bin/bash

# Get the directory where this script is located
DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

# Open the game in the default browser
xdg-open "\$DIR/index.html"
EOF

# Make the launcher script executable
chmod +x "$BUILD_DIR/launcher.sh"

# Create DEB package (for Debian/Ubuntu)
create_deb() {
    echo "Creating DEB package..."
    
    DEB_DIR="$BUILD_DIR/deb"
    mkdir -p "$DEB_DIR/DEBIAN"
    mkdir -p "$DEB_DIR/usr/share/applications"
    mkdir -p "$DEB_DIR/usr/share/icons/hicolor/256x256/apps"
    mkdir -p "$DEB_DIR/opt/$APP_ID"
    
    # Copy control file
    cat > "$DEB_DIR/DEBIAN/control" << EOF
Package: $APP_ID
Version: $APP_VERSION
Section: games
Priority: optional
Architecture: all
Depends: python3 (>= 3.6), python3-pip
Maintainer: Arcade Meltdown Team <contact@arcademeltdown.com>
Description: A chaotic co-op wave-based shooter with LAN support
 Arcade Meltdown is a fast-paced, top-down shooter where players team up to survive
 waves of enemies in a variety of arenas. With support for up to 8 players via LAN,
 dynamic gameplay, and a retro-futuristic aesthetic, it's perfect for local multiplayer sessions.
EOF
    
    # Copy files
    cp -R "$PACKAGE_DIR/"* "$DEB_DIR/opt/$APP_ID/"
    cp "$BUILD_DIR/$APP_ID.desktop" "$DEB_DIR/usr/share/applications/"
    
    # Copy icon if it exists
    if [ -f "$PROJECT_DIR/$APP_ICON" ]; then
        cp "$PROJECT_DIR/$APP_ICON" "$DEB_DIR/usr/share/icons/hicolor/256x256/apps/$APP_ID.png"
    fi
    
    # Set permissions
    find "$DEB_DIR" -type d -exec chmod 755 {} \;
    find "$DEB_DIR" -type f -exec chmod 644 {} \;
    
    # Build DEB
    dpkg-deb --build "$DEB_DIR" "$BUILD_DIR/${APP_ID}_${APP_VERSION}_all.deb"
    
    echo "DEB package created: $BUILD_DIR/${APP_ID}_${APP_VERSION}_all.deb"
}

# Create RPM package (for Fedora/CentOS/RHEL)
create_rpm() {
    echo "Creating RPM package..."
    
    RPM_DIR="$BUILD_DIR/rpm"
    mkdir -p "$RPM_DIR/SPECS"
    mkdir -p "$RPM_DIR/SOURCES"
    mkdir -p "$RPM_DIR/BUILD"
    mkdir -p "$RPM_DIR/RPMS/noarch"
    mkdir -p "$RPM_DIR/SRPMS"
    
    # Create tarball
    cd "$BUILD_DIR"
    tar -czf "$APP_ID-$APP_VERSION.tar.gz" "$APP_NAME-$APP_VERSION"
    mv "$APP_ID-$APP_VERSION.tar.gz" "$RPM_DIR/SOURCES/"
    cd "$SCRIPT_DIR"
    
    # Create spec file
    cat > "$RPM_DIR/SPECS/$APP_ID.spec" << EOF
Name: $APP_ID
Version: $APP_VERSION
Release: 1%{?dist}
Summary: A chaotic co-op wave-based shooter with LAN support
License: MIT
URL: https://github.com/arcademeltdown/arcade-meltdown
Source0: %{name}-%{version}.tar.gz
BuildArch: noarch
BuildRequires: python3-devel
Requires: python3 >= 3.6

%description
Arcade Meltdown is a fast-paced, top-down shooter where players team up to survive
waves of enemies in a variety of arenas. With support for up to 8 players via LAN,
dynamic gameplay, and a retro-futuristic aesthetic, it's perfect for local multiplayer sessions.

%prep
%setup -q

%install
mkdir -p %{buildroot}/opt/%{name}
mkdir -p %{buildroot}/usr/share/applications
mkdir -p %{buildroot}/usr/share/icons/hicolor/256x256/apps

cp -r * %{buildroot}/opt/%{name}/
install -m 644 %{buildroot}/opt/%{name}/%{name}.desktop %{buildroot}/usr/share/applications/
install -m 644 %{buildroot}/opt/%{name}/assets/icons/icon.png %{buildroot}/usr/share/icons/hicolor/256x256/apps/%{name}.png

%files
/opt/%{name}/
/usr/share/applications/%{name}.desktop
/usr/share/icons/hicolor/256x256/apps/%{name}.png

%changelog
* $(date '+%a %b %d %Y') Arcade Meltdown Team <contact@arcademeltdown.com> - $APP_VERSION-1
- Initial release
EOF
    
    # Build RPM
    rpmbuild --define "_topdir $RPM_DIR" -ba "$RPM_DIR/SPECS/$APP_ID.spec"
    
    echo "RPM package created: $RPM_DIR/RPMS/noarch/${APP_ID}-${APP_VERSION}-1.noarch.rpm"
}

# Create TAR.GZ package (generic)
create_tar() {
    echo "Creating TAR.GZ package..."
    
    # Create tarball
    cd "$BUILD_DIR"
    tar -czf "$APP_ID-$APP_VERSION.tar.gz" "$APP_NAME-$APP_VERSION"
    cd "$SCRIPT_DIR"
    
    echo "TAR.GZ package created: $BUILD_DIR/$APP_ID-$APP_VERSION.tar.gz"
}

# Create AppImage package
create_appimage() {
    echo "Creating AppImage package..."
    
    APPIMAGE_DIR="$BUILD_DIR/appimage"
    APPDIR="$APPIMAGE_DIR/$APP_NAME.AppDir"
    
    # Create AppDir structure
    mkdir -p "$APPDIR/usr/bin"
    mkdir -p "$APPDIR/usr/share/applications"
    mkdir -p "$APPDIR/usr/share/icons/hicolor/256x256/apps"
    
    # Copy files
    cp -R "$PACKAGE_DIR/"* "$APPDIR/usr/bin/"
    cp "$BUILD_DIR/$APP_ID.desktop" "$APPDIR/usr/share/applications/"
    
    # Copy icon if it exists
    if [ -f "$PROJECT_DIR/$APP_ICON" ]; then
        cp "$PROJECT_DIR/$APP_ICON" "$APPDIR/usr/share/icons/hicolor/256x256/apps/$APP_ID.png"
    fi
    
    # Create AppRun script
    cat > "$APPDIR/AppRun" << EOF
#!/bin/bash

# Get the directory where this script is located
DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

# Open the game in the default browser
xdg-open "\$DIR/usr/bin/index.html"
EOF
    
    # Make AppRun executable
    chmod +x "$APPDIR/AppRun"
    
    # Download appimagetool if not available
    if ! command -v appimagetool &> /dev/null; then
        echo "Downloading appimagetool..."
        wget -q "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage" -O "$APPIMAGE_DIR/appimagetool"
        chmod +x "$APPIMAGE_DIR/appimagetool"
    fi
    
    # Create AppImage
    if [ -f "$APPIMAGE_DIR/appimagetool" ]; then
        "$APPIMAGE_DIR/appimagetool" "$APPDIR" "$BUILD_DIR/$APP_NAME-$APP_VERSION-x86_64.AppImage"
        echo "AppImage created: $BUILD_DIR/$APP_NAME-$APP_VERSION-x86_64.AppImage"
    else
        echo "appimagetool not found. Please install it to create AppImage packages."
    fi
}

# Create a simple install script
create_install_script() {
    echo "Creating install script..."
    
    cat > "$BUILD_DIR/install.sh" << EOF
#!/bin/bash

# Arcade Meltdown - Install Script

# Check if running as root
if [ "\$EUID" -ne 0 ]; then
  echo "Please run as root or use sudo"
  exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="\$SCRIPT_DIR/$APP_NAME-$APP_VERSION"

# Check if package directory exists
if [ ! -d "\$PACKAGE_DIR" ]; then
  echo "Package directory not found: \$PACKAGE_DIR"
  exit 1
fi

# Install to /opt
echo "Installing $APP_NAME to /opt/$APP_ID..."
mkdir -p /opt/$APP_ID
cp -R "\$PACKAGE_DIR/"* /opt/$APP_ID/

# Create desktop entry
echo "Creating desktop entry..."
mkdir -p /usr/share/applications
cat > /usr/share/applications/$APP_ID.desktop << DESKTOP_EOF
[Desktop Entry]
Version=$APP_VERSION
Type=Application
Name=$APP_NAME
Comment=A chaotic co-op wave-based shooter with LAN support
Exec=python3 /opt/$APP_ID/server.py
Icon=$APP_ID
Terminal=false
Categories=Game;ActionGame;
StartupNotify=true
DESKTOP_EOF

# Copy icon
if [ -f "/opt/$APP_ID/assets/icons/icon.png" ]; then
  echo "Installing icon..."
  mkdir -p /usr/share/icons/hicolor/256x256/apps
  cp /opt/$APP_ID/assets/icons/icon.png /usr/share/icons/hicolor/256x256/apps/$APP_ID.png
fi

# Set permissions
echo "Setting permissions..."
chmod -R 755 /opt/$APP_ID
chmod 644 /usr/share/applications/$APP_ID.desktop
chmod 644 /usr/share/icons/hicolor/256x256/apps/$APP_ID.png

echo "Installation complete!"
echo "You can now run $APP_NAME from your applications menu."
echo "Or run the server with: python3 /opt/$APP_ID/server.py"
EOF
    
    # Make install script executable
    chmod +x "$BUILD_DIR/install.sh"
    
    echo "Install script created: $BUILD_DIR/install.sh"
}

# Create a simple uninstall script
create_uninstall_script() {
    echo "Creating uninstall script..."
    
    cat > "$BUILD_DIR/uninstall.sh" << EOF
#!/bin/bash

# Arcade Meltdown - Uninstall Script

# Check if running as root
if [ "\$EUID" -ne 0 ]; then
  echo "Please run as root or use sudo"
  exit 1
fi

# Remove files
echo "Removing $APP_NAME..."
rm -rf /opt/$APP_ID
rm -f /usr/share/applications/$APP_ID.desktop
rm -f /usr/share/icons/hicolor/256x256/apps/$APP_ID.png

echo "Uninstallation complete!"
EOF
    
    # Make uninstall script executable
    chmod +x "$BUILD_DIR/uninstall.sh"
    
    echo "Uninstall script created: $BUILD_DIR/uninstall.sh"
}

# Create packages based on available tools
echo "Creating Linux packages for $APP_NAME $APP_VERSION..."

# Always create generic tarball
create_tar

# Create DEB if dpkg-deb is available
if command -v dpkg-deb &> /dev/null; then
    create_deb
else
    echo "dpkg-deb not found. Skipping DEB package creation."
fi

# Create RPM if rpmbuild is available
if command -v rpmbuild &> /dev/null; then
    create_rpm
else
    echo "rpmbuild not found. Skipping RPM package creation."
fi

# Create AppImage if wget is available
if command -v wget &> /dev/null; then
    create_appimage
else
    echo "wget not found. Skipping AppImage package creation."
fi

# Create install/uninstall scripts
create_install_script
create_uninstall_script

echo "Linux packages created successfully in $BUILD_DIR"
echo ""
echo "Available packages:"
ls -la "$BUILD_DIR" | grep -E "\.(deb|rpm|tar\.gz|AppImage|sh)$"
echo ""
echo "To install, use one of the following methods:"
echo "1. DEB package (Debian/Ubuntu): sudo dpkg -i ${APP_ID}_${APP_VERSION}_all.deb"
echo "2. RPM package (Fedora/CentOS/RHEL): sudo rpm -i ${APP_ID}-${APP_VERSION}-1.noarch.rpm"
echo "3. TAR.GZ package (generic): tar -xzf $APP_ID-$APP_VERSION.tar.gz && cd $APP_ID-$APP_VERSION && sudo ./install.sh"
echo "4. AppImage package (universal): chmod +x $APP_NAME-$APP_VERSION-x86_64.AppImage && ./$APP_NAME-$APP_VERSION-x86_64.AppImage"