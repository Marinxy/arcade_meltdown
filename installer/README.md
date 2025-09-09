# Arcade Meltdown - Installation Guide

This guide explains how to install Arcade Meltdown on different operating systems.

## Table of Contents

- [Windows Installation](#windows-installation)
- [macOS Installation](#macos-installation)
- [Linux Installation](#linux-installation)
- [Web Browser Installation](#web-browser-installation)
- [Troubleshooting](#troubleshooting)

## Windows Installation

### Requirements

- Windows 7 or later
- At least 100 MB of free disk space

### Installation Steps

1. Download the Windows installer (`Arcade Meltdown-1.0.0.exe`) from the [releases page](https://github.com/arcademeltdown/arcade-meltdown/releases).
2. Run the installer by double-clicking the downloaded file.
3. Follow the installation wizard:
   - Read and accept the license agreement
   - Choose the installation directory (default is recommended)
   - Select whether to create desktop and start menu shortcuts
   - Click "Install" to begin the installation
4. Once the installation is complete, click "Finish" to exit the installer.

### Running the Game

After installation, you can run the game in one of the following ways:

- Double-click the desktop shortcut (if created during installation)
- Go to Start Menu > Arcade Meltdown > Arcade Meltdown
- Navigate to the installation directory and double-click `index.html`

### Uninstallation

To uninstall Arcade Meltdown:

1. Go to Control Panel > Programs > Programs and Features
2. Select "Arcade Meltdown" from the list
3. Click "Uninstall" and follow the prompts

Alternatively, you can use the uninstaller in the Start Menu or run the uninstaller from the installation directory.

## macOS Installation

### Requirements

- macOS 10.12 Sierra or later
- At least 100 MB of free disk space

### Installation Steps

1. Download the macOS disk image (`Arcade Meltdown-1.0.0.dmg`) from the [releases page](https://github.com/arcademeltdown/arcade-meltdown/releases).
2. Double-click the downloaded `.dmg` file to mount it.
3. Drag the `Arcade Meltdown.app` icon to your Applications folder.
4. Eject the disk image by dragging it to the Trash or clicking the eject button in Finder.

### Running the Game

After installation, you can run the game in one of the following ways:

- Open Applications folder and double-click `Arcade Meltdown.app`
- Use Spotlight search (Cmd+Space) and type "Arcade Meltdown"
- Use Launchpad and click on the Arcade Meltdown icon

### Uninstallation

To uninstall Arcade Meltdown:

1. Open the Applications folder
2. Drag `Arcade Meltdown.app` to the Trash
3. Empty the Trash

## Linux Installation

### Requirements

- Linux distribution with Python 3.6 or later
- At least 100 MB of free disk space

### Installation Options

#### DEB Package (Debian, Ubuntu, Mint, etc.)

1. Download the DEB package (`arcademeltdown_1.0.0_all.deb`) from the [releases page](https://github.com/arcademeltdown/arcade-meltdown/releases).
2. Open a terminal and navigate to the directory containing the downloaded file.
3. Install the package using the following command:
   ```bash
   sudo dpkg -i arcademeltdown_1.0.0_all.deb
   ```
4. If there are any dependency issues, fix them with:
   ```bash
   sudo apt-get install -f
   ```

#### RPM Package (Fedora, CentOS, RHEL, openSUSE, etc.)

1. Download the RPM package (`arcademeltdown-1.0.0-1.noarch.rpm`) from the [releases page](https://github.com/arcademeltdown/arcade-meltdown/releases).
2. Open a terminal and navigate to the directory containing the downloaded file.
3. Install the package using the following command:
   ```bash
   sudo rpm -i arcademeltdown-1.0.0-1.noarch.rpm
   ```
4. If there are any dependency issues, fix them with:
   ```bash
   sudo dnf install -y  # For Fedora
   # or
   sudo yum install -y  # For CentOS/RHEL
   # or
   sudo zypper install -y  # For openSUSE
   ```

#### TAR.GZ Package (Generic Linux)

1. Download the TAR.GZ package (`arcademeltdown-1.0.0.tar.gz`) from the [releases page](https://github.com/arcademeltdown/arcade-meltdown/releases).
2. Open a terminal and navigate to the directory containing the downloaded file.
3. Extract the package:
   ```bash
   tar -xzf arcademeltdown-1.0.0.tar.gz
   ```
4. Navigate to the extracted directory:
   ```bash
   cd arcademeltdown-1.0.0
   ```
5. Run the install script:
   ```bash
   sudo ./install.sh
   ```

#### AppImage (Universal Linux)

1. Download the AppImage (`Arcade Meltdown-1.0.0-x86_64.AppImage`) from the [releases page](https://github.com/arcademeltdown/arcade-meltdown/releases).
2. Make the AppImage executable:
   ```bash
   chmod +x "Arcade Meltdown-1.0.0-x86_64.AppImage"
   ```
3. Run the AppImage:
   ```bash
   ./Arcade\ Meltdown-1.0.0-x86_64.AppImage
   ```

### Running the Game

After installation, you can run the game in one of the following ways:

- Click on the Arcade Meltdown icon in your applications menu
- Open a terminal and run:
  ```bash
  python3 /opt/arcademeltdown/server.py
  ```
- Navigate to the installation directory and open `index.html` in your web browser

### Uninstallation

#### DEB Package

```bash
sudo apt-get remove arcademeltdown
```

#### RPM Package

```bash
sudo rpm -e arcademeltdown
```

#### TAR.GZ Package

1. Navigate to the directory containing the extracted package
2. Run the uninstall script:
   ```bash
   sudo ./uninstall.sh
   ```

#### AppImage

Simply delete the AppImage file. No installation was required.

## Web Browser Installation

### Requirements

- Modern web browser (Chrome 60+, Firefox 55+, Edge 79+, Safari 11+)
- Stable internet connection for LAN play
- At least 50 MB of free disk space for browser cache

### Installation Steps

1. Go to the [official website](https://arcademeltdown.com) or [GitHub repository](https://github.com/arcademeltdown/arcade-meltdown).
2. Click "Play Now" or navigate to the game page.
3. The game will load in your browser.

### Running the Game

The game runs directly in your web browser. No additional installation is required.

### Offline Play

To play offline, you can use the "Install as App" feature available in some browsers:

- **Chrome**: Click the install icon in the address bar or go to Chrome menu > More Tools > Create Shortcut
- **Firefox**: Click the install icon in the address bar
- **Edge**: Click the install icon in the address bar or go to Settings > Apps > Install this site as an app

This will create a shortcut on your desktop or in your applications menu that launches the game in its own window, even when offline.

## Troubleshooting

### Common Issues

#### Game Won't Start

**Windows**:
- Check that your antivirus software isn't blocking the game
- Try running the game as administrator
- Verify that you have the required system requirements

**macOS**:
- If you see a warning about the app being from an unidentified developer, go to System Preferences > Security & Privacy > General and click "Open Anyway"
- Make sure you're using macOS 10.12 or later

**Linux**:
- Make sure you have Python 3.6 or later installed
- Check that all required dependencies are installed
- Try running the game from the terminal to see any error messages

#### WebRTC Connection Issues

- Make sure you're using a secure connection (HTTPS)
- Check that your firewall allows UDP traffic on ports 3478 (STUN) and 5349 (TURN)
- Try using a different browser
- Check that your network supports WebRTC

#### Audio Not Playing

- Make sure your browser allows audio autoplay
- Check that your system volume is up and not muted
- Try refreshing the page
- Check your browser's audio permissions

#### Performance Issues

- Close other applications and browser tabs
- Lower the graphics quality in the game settings
- Make sure your hardware meets the minimum requirements
- Try using a different browser

### Getting Help

If you're still having issues, please:

1. Check the [FAQ](https://github.com/arcademeltdown/arcade-meltdown/wiki/FAQ)
2. Search existing [issues](https://github.com/arcademeltdown/arcade-meltdown/issues)
3. Create a new issue with details about your problem, including:
   - Your operating system and version
   - Your browser and version (if using web version)
   - Any error messages you're seeing
   - Steps to reproduce the problem

### Reporting Bugs

To report a bug, please use the [issue tracker](https://github.com/arcademeltdown/arcade-meltdown/issues) on GitHub. When reporting a bug, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Your system information (OS, browser, etc.)
- Any error messages or screenshots
- Information about whether the issue occurs consistently or intermittently