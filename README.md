# Arcade Meltdown

A local multiplayer arcade game with wave-based combat and chaos mechanics.

## Description

Arcade Meltdown is a fast-paced, local multiplayer arcade game where players team up to survive waves of increasingly difficult enemies. Choose from 4 unique player classes, each with their own strengths and abilities, and work together to defeat hordes of enemies, mini-bosses, and epic boss battles.

**Current Status**: ✅ **Fully Playable** - Core gameplay is working with placeholder assets and responsive design.

## Features

- **4 Unique Player Classes**: Heavy, Scout, Engineer, and Medic, each with unique abilities
- **Multiple Weapon Types**: Assault Rifle, SMG, Shotgun, Pistol, and more
- **Power-up Systems**: Health packs, ammo packs, shields, and speed boosts
- **Varied Enemy Types**: Grunt, Spitter, Bruiser, Mini-boss, and Boss enemies with unique AI
- **Wave-based Gameplay**: Increasingly difficult waves with chaos mechanics
- **Responsive Design**: Full-screen gameplay that adapts to any screen size
- **Placeholder Assets**: Complete placeholder system for easy asset replacement
- **Modern Architecture**: Entity-Component-System (ECS) with modular design
- **Real-time HUD**: Live health, ammo, score, and enemy tracking
- **Smooth Controls**: WASD movement with mouse aiming and shooting

## Screenshots

*(Add screenshots here)*

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for running a local server)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arcade-meltdown.git
   cd arcade-meltdown
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the game:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:8080`

**Note**: The game requires a local server due to ES6 module imports and asset loading. Simply opening `index.html` in a browser will not work properly.

## How to Play

### Controls

- **WASD**: Move your character
- **Mouse**: Aim
- **Left Mouse Button**: Shoot
- **Right Mouse Button**: Secondary Fire (if available)
- **1-5**: Switch weapons
- **Q/E**: Use power-ups
- **ESC**: Pause game

### Gameplay

1. **Select a Class**: Choose from 4 unique classes, each with different stats and abilities
   - **Heavy**: High health (200), slow movement (3), high damage (15)
   - **Scout**: Low health (70), fast movement (8), low damage (8)
   - **Engineer**: Medium health (90), medium movement (4), medium damage (12)
   - **Medic**: Medium health (80), good movement (6), low damage (7)

2. **Survive Waves**: Fight through waves of enemies that increase in difficulty
   - Each wave has more enemies and stronger types
   - Mini-bosses appear every 5 waves
   - Boss battles occur every 10 waves

3. **Manage Chaos**: As you play, the chaos meter increases, affecting gameplay
   - Higher chaos levels spawn more enemies
   - Chaos decreases over time when not fighting

4. **Use Power-ups**: Collect and use power-ups strategically
   - **Health Pack**: Restore health
   - **Ammo Pack**: Restore ammunition
   - **Shield**: Temporary damage protection
   - **Speed Boost**: Temporary movement speed increase

5. **Track Your Progress**: Monitor your health, ammo, score, and enemy count in real-time

## Multiplayer

Arcade Meltdown is designed for local multiplayer (currently single-player mode implemented). Future updates will include:

- **Player 1**: WASD to move, Mouse to aim/shoot
- **Player 2**: Arrow keys to move, Numpad 0 to shoot
- **Additional Players**: Customizable control schemes

## Asset System

The game includes a comprehensive placeholder asset system:

- **Placeholder Images**: Colored rectangles for all sprites (players, enemies, bullets, UI)
- **Placeholder Audio**: Silent MP3 files for all sound effects and music
- **Easy Replacement**: Simply replace placeholder files with your own assets
- **Asset Manager**: Automatic loading and caching of all game assets

See `PLACEHOLDER_ASSETS.md` for a complete list of placeholder assets and their specifications.

## Development

### Project Structure

```
arcade-meltdown/
├── assets/
│   ├── css/          # Stylesheets
│   ├── audio/        # Audio files (music, sfx, ui)
│   ├── sprites/      # Game sprites (players, enemies, bullets, particles, ui)
│   └── icons/        # UI icons (weapons, powerups, ui)
├── src/
│   ├── core/         # Core game engine (GameEngine, Config, EventSystem)
│   ├── entities/     # Game entities (Player, Enemy, Bullet, Particle)
│   ├── systems/      # Game systems (Input, Render, Physics, Audio)
│   ├── assets/       # Asset management (AssetManager)
│   ├── audio/        # Audio management (AudioManager)
│   ├── ui/           # UI components
│   └── main.js       # Main entry point
├── index.html        # Main HTML file
├── package.json      # Project metadata
├── PLACEHOLDER_ASSETS.md  # Asset documentation
└── README.md         # This file
```

### Building

The game is built using vanilla HTML5, CSS3, and JavaScript (ES6+). No build step is required for development.

### Recent Fixes & Improvements

- ✅ **Fixed Asset Loading**: Resolved 404 errors for sprite files with placeholder system
- ✅ **Fixed Player/Enemy Validation**: Added proper class and type definitions to config
- ✅ **Fixed Game Layout**: Implemented responsive full-screen design
- ✅ **Fixed UI Scattering**: Reorganized HUD elements for better layout
- ✅ **Added Placeholder Assets**: Complete placeholder system for easy asset replacement
- ✅ **Improved Responsive Design**: Game now works on all screen sizes
- ✅ **Fixed Module System**: Resolved CommonJS/ES6 import conflicts
- ✅ **Added Asset Manager**: Centralized asset loading and caching system

### Current Status

- **Core Gameplay**: ✅ Working (player movement, enemy spawning, basic combat)
- **UI System**: ✅ Working (responsive design, class selection, HUD)
- **Asset System**: ✅ Working (placeholder assets with fallbacks)
- **Audio System**: ✅ Working (silent placeholders, no crashes)
- **Configuration**: ✅ Working (player classes, enemy types, settings)
- **Multiplayer**: 🚧 Planned (currently single-player only)
- **Map Editor**: 🚧 Planned (UI exists, functionality pending)
- **Soundtrack Packs**: 🚧 Planned (UI exists, functionality pending)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Retro TrashBit for the original soundtrack
- The Phaser.js community for inspiration
- All the playtesters who provided valuable feedback

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.