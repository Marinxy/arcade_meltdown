/**
 * Arcade Meltdown - Build Script
 * Packages the game for web deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build configuration
const config = {
    // Input directories
    srcDir: 'src',
    assetsDir: 'assets',
    
    // Output directory
    distDir: 'dist',
    
    // Files to include in the build
    includeFiles: [
        'index.html',
        'README.md',
        'LICENSE'
    ],
    
    // Directories to include in the build
    includeDirs: [
        'assets',
        'src'
    ],
    
    // Modules to bundle
    bundleModules: [
        'core/gameEngine.js',
        'core/gameLoop.js',
        'core/entity.js',
        'core/component.js',
        'core/system.js',
        'entities/player.js',
        'entities/enemy.js',
        'entities/weapon.js',
        'entities/powerup.js',
        'systems/inputSystem.js',
        'systems/physicsSystem.js',
        'systems/collisionSystem.js',
        'systems/renderSystem.js',
        'systems/audioSystem.js',
        'systems/arenaSystem.js',
        'systems/waveSystem.js',
        'systems/chaosSystem.js',
        'systems/networkSystem.js',
        'systems/uiSystem.js',
        'systems/scoreboardSystem.js',
        'ui/hud.js',
        'ui/menu.js',
        'ui/scoreboardEnhanced.js',
        'ui/settings.js',
        'audio/audioManager.js',
        'tilesets/cyberpunkTileset.js',
        'tilesets/postApocalypticTileset.js',
        'tilesets/industrialTileset.js',
        'networking/webrtcManager.js',
        'networking/roomManager.js',
        'config/configManager.js',
        'utils/eventSystem.js',
        'utils/mathUtils.js',
        'utils/vector2.js'
    ],
    
    // External libraries to include
    externalLibs: [
        // None for now, all code is custom
    ],
    
    // Minify options
    minify: true,
    
    // Source map options
    sourceMaps: false
};

/**
 * Clean the distribution directory
 */
function cleanDist() {
    console.log('Cleaning distribution directory...');
    
    if (fs.existsSync(config.distDir)) {
        execSync(`rm -rf ${config.distDir}`);
    }
    
    fs.mkdirSync(config.distDir, { recursive: true });
    
    console.log('Distribution directory cleaned.');
}

/**
 * Copy files to the distribution directory
 */
function copyFiles() {
    console.log('Copying files to distribution directory...');
    
    // Copy included files
    for (const file of config.includeFiles) {
        if (fs.existsSync(file)) {
            const destPath = path.join(config.distDir, file);
            const destDir = path.dirname(destPath);
            
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            fs.copyFileSync(file, destPath);
            console.log(`Copied: ${file} -> ${destPath}`);
        } else {
            console.warn(`File not found: ${file}`);
        }
    }
    
    // Copy included directories
    for (const dir of config.includeDirs) {
        if (fs.existsSync(dir)) {
            const destPath = path.join(config.distDir, dir);
            
            execSync(`cp -r ${dir} ${destPath}`);
            console.log(`Copied: ${dir} -> ${destPath}`);
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    }
    
    console.log('Files copied to distribution directory.');
}

/**
 * Create a bundled JavaScript file
 */
function createBundle() {
    console.log('Creating bundled JavaScript file...');
    
    const bundlePath = path.join(config.distDir, 'js', 'bundle.js');
    const bundleDir = path.dirname(bundlePath);
    
    if (!fs.existsSync(bundleDir)) {
        fs.mkdirSync(bundleDir, { recursive: true });
    }
    
    // Create bundle file header
    let bundleContent = '/**\n';
    bundleContent += ' * Arcade Meltdown - Bundled JavaScript\n';
    bundleContent += ' * Generated on: ' + new Date().toISOString() + '\n';
    bundleContent += ' */\n\n';
    
    // Add modules to bundle
    for (const module of config.bundleModules) {
        const modulePath = path.join(config.srcDir, module);
        
        if (fs.existsSync(modulePath)) {
            const moduleContent = fs.readFileSync(modulePath, 'utf8');
            
            // Add module comment
            bundleContent += `/** Module: ${module} **/\n`;
            
            // Add module content
            bundleContent += moduleContent;
            bundleContent += '\n\n';
            
            console.log(`Added to bundle: ${module}`);
        } else {
            console.warn(`Module not found: ${modulePath}`);
        }
    }
    
    // Write bundle file
    fs.writeFileSync(bundlePath, bundleContent);
    
    console.log(`Bundled JavaScript created: ${bundlePath}`);
    
    // Minify bundle if enabled
    if (config.minify) {
        console.log('Minifying bundled JavaScript...');
        
        try {
            // Try to use Terser for minification
            const { minify } = require('terser');
            
            minify(bundleContent)
                .then(result => {
                    if (result.code) {
                        fs.writeFileSync(bundlePath.replace('.js', '.min.js'), result.code);
                        console.log(`Minified bundle created: ${bundlePath.replace('.js', '.min.js')}`);
                    }
                })
                .catch(error => {
                    console.warn('Failed to minify bundle:', error.message);
                });
        } catch (error) {
            console.warn('Terser not available, skipping minification:', error.message);
        }
    }
}

/**
 * Create a manifest file
 */
function createManifest() {
    console.log('Creating manifest file...');
    
    const manifest = {
        name: 'Arcade Meltdown',
        short_name: 'Arcade Meltdown',
        description: 'A chaotic co-op wave-based shooter with LAN support',
        start_url: './',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#000000',
        theme_color: '#00ffff',
        icons: [
            {
                src: './assets/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: './assets/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    };
    
    const manifestPath = path.join(config.distDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`Manifest created: ${manifestPath}`);
}

/**
 * Create a service worker for offline support
 */
function createServiceWorker() {
    console.log('Creating service worker...');
    
    const serviceWorkerContent = `
/**
 * Arcade Meltdown - Service Worker
 * Enables offline support and caching
 */

const CACHE_NAME = 'arcade-meltdown-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './js/bundle.min.js',
    './assets/audio/music/main_menu.mp3',
    './assets/audio/music/gameplay_normal.mp3',
    './assets/audio/music/gameplay_chaos.mp3',
    './assets/audio/music/boss_battle.mp3',
    './assets/audio/music/victory.mp3',
    './assets/audio/music/game_over.mp3',
    './assets/audio/sfx/player_move.mp3',
    './assets/audio/sfx/player_jump.mp3',
    './assets/audio/sfx/player_damage.mp3',
    './assets/audio/sfx/player_death.mp3',
    './assets/audio/sfx/weapon_pistol_fire.mp3',
    './assets/audio/sfx/weapon_smg_fire.mp3',
    './assets/audio/sfx/weapon_shotgun_fire.mp3',
    './assets/audio/sfx/weapon_rifle_fire.mp3',
    './assets/audio/sfx/weapon_plasma_fire.mp3',
    './assets/audio/sfx/weapon_flamethrower_fire.mp3',
    './assets/audio/sfx/weapon_rocket_fire.mp3',
    './assets/audio/sfx/enemy_grunt_attack.mp3',
    './assets/audio/sfx/enemy_spitter_attack.mp3',
    './assets/audio/sfx/enemy_bruiser_attack.mp3',
    './assets/audio/sfx/env_explosion.mp3',
    './assets/audio/sfx/env_powerup.mp3',
    './assets/audio/sfx/ui_button_click.mp3',
    './assets/audio/sfx/ui_button_hover.mp3',
    './assets/images/logo.png',
    './assets/images/background.jpg',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
`;
    
    const serviceWorkerPath = path.join(config.distDir, 'sw.js');
    fs.writeFileSync(serviceWorkerPath, serviceWorkerContent);
    
    console.log(`Service worker created: ${serviceWorkerPath}`);
}

/**
 * Create a README file for the distribution
 */
function createReadme() {
    console.log('Creating README file for distribution...');
    
    const readmeContent = `# Arcade Meltdown

A chaotic co-op wave-based shooter with LAN support.

## Description

Arcade Meltdown is a fast-paced, top-down shooter where players team up to survive waves of enemies in a variety of arenas. With support for up to 8 players via LAN, dynamic gameplay, and a retro-futuristic aesthetic, it's perfect for local multiplayer sessions.

## Features

- **Co-op Multiplayer**: Support for 2-8 players via LAN
- **Multiple Player Classes**: Choose from Grunt, Heavy, Scout, Engineer, and Medic classes
- **Variety of Weapons**: From pistols to rocket launchers, each with unique mechanics
- **Dynamic Arenas**: Multiple tilesets including Cyberpunk, Post-Apocalyptic, and Industrial themes
- **Chaos System**: Gameplay becomes more chaotic as the match progresses
- **Power-ups**: Orbital Strike and Time-Slow Bubble abilities
- **Boss Battles**: Challenging mini-bosses and main bosses
- **Dynamic Audio**: Music and sound effects that adapt to gameplay

## How to Play

1. Open the game in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Select your player class
3. Join or create a LAN room
4. Survive waves of enemies and complete objectives
5. Work together to defeat bosses and achieve high scores

## Controls

- **Movement**: WASD or Arrow Keys
- **Aim**: Mouse
- **Shoot**: Left Mouse Button
- **Reload**: R
- **Use Power-up**: E
- **Pause**: ESC or P

## System Requirements

- Modern web browser with HTML5 and WebRTC support
- Stable internet connection for LAN play
- 2GB RAM minimum, 4GB recommended
- Multi-core processor recommended

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Edge 79+
- Safari 11+

## License

This game is licensed under the MIT License. See the LICENSE file for details.

## Credits

- **Game Design**: Arcade Meltdown Team
- **Programming**: Arcade Meltdown Team
- **Art & Assets**: Arcade Meltdown Team
- **Music & Sound**: Retro TrashBit

## Support

For support, bug reports, or feature requests, please visit our GitHub repository.
`;
    
    const readmePath = path.join(config.distDir, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    
    console.log(`README created: ${readmePath}`);
}

/**
 * Create a package.json file for the distribution
 */
function createPackageJson() {
    console.log('Creating package.json file for distribution...');
    
    const packageJson = {
        name: 'arcade-meltdown',
        version: '1.0.0',
        description: 'A chaotic co-op wave-based shooter with LAN support',
        main: 'index.html',
        scripts: {
            start: 'python -m http.server 8000'
        },
        keywords: [
            'game',
            'shooter',
            'multiplayer',
            'co-op',
            'lan',
            'web',
            'html5',
            'javascript'
        ],
        author: 'Arcade Meltdown Team',
        license: 'MIT',
        repository: {
            type: 'git',
            url: 'https://github.com/arcade-meltdown/arcade-meltdown.git'
        },
        bugs: {
            url: 'https://github.com/arcade-meltdown/arcade-meltdown/issues'
        },
        homepage: 'https://github.com/arcade-meltdown/arcade-meltdown#readme'
    };
    
    const packageJsonPath = path.join(config.distDir, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log(`package.json created: ${packageJsonPath}`);
}

/**
 * Create a .gitignore file for the distribution
 */
function createGitignore() {
    console.log('Creating .gitignore file for distribution...');
    
    const gitignoreContent = `# Dependencies
node_modules/

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Temporary files
*.tmp
*.temp
`;

    const gitignorePath = path.join(config.distDir, '.gitignore');
    fs.writeFileSync(gitignorePath, gitignoreContent);
    
    console.log(`.gitignore created: ${gitignorePath}`);
}

/**
 * Create a simple HTTP server script
 */
function createServerScript() {
    console.log('Creating HTTP server script...');
    
    const serverScriptContent = `#!/usr/bin/env python3
"""
Simple HTTP server for Arcade Meltdown
Run this script to serve the game locally
"""

import http.server
import socketserver
import sys
import os

# Get port from command line or use default
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create a custom request handler
class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for WebRTC
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

# Create the server
with socketserver.TCPServer(("", port), MyHTTPRequestHandler) as httpd:
    print(f"Serving Arcade Meltdown at http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\nServer stopped")
`;

    const serverScriptPath = path.join(config.distDir, 'server.py');
    fs.writeFileSync(serverScriptPath, serverScriptContent);
    
    // Make the script executable
    try {
        execSync(`chmod +x ${serverScriptPath}`);
    } catch (error) {
        console.warn('Failed to make server script executable:', error.message);
    }
    
    console.log(`Server script created: ${serverScriptPath}`);
}

/**
 * Main build function
 */
function build() {
    console.log('Starting build process for Arcade Meltdown...');
    console.log('==========================================');
    
    // Clean distribution directory
    cleanDist();
    
    // Copy files
    copyFiles();
    
    // Create bundle
    createBundle();
    
    // Create manifest
    createManifest();
    
    // Create service worker
    createServiceWorker();
    
    // Create README
    createReadme();
    
    // Create package.json
    createPackageJson();
    
    // Create .gitignore
    createGitignore();
    
    // Create server script
    createServerScript();
    
    console.log('==========================================');
    console.log('Build completed successfully!');
    console.log('');
    console.log('To run the game locally:');
    console.log('1. Navigate to the dist directory');
    console.log('2. Run: python server.py');
    console.log('3. Open your browser to: http://localhost:8000');
    console.log('');
    console.log('To deploy to a web server:');
    console.log('1. Upload the contents of the dist directory to your web server');
    console.log('2. Ensure the server supports HTTPS for WebRTC');
    console.log('3. Configure CORS headers if needed');
}

// Run the build
build();