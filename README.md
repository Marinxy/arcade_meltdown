# Arcade Meltdown

A local multiplayer arcade game with wave-based combat and chaos mechanics.

## Description

Arcade Meltdown is a fast-paced, local multiplayer arcade game where players team up to survive waves of increasingly difficult enemies. Choose from 5 unique player classes, each with their own strengths and abilities, and work together to defeat hordes of enemies, mini-bosses, and epic boss battles.

## Features

- **5 Unique Player Classes**: Grunt, Heavy, Scout, Engineer, and Medic, each with unique abilities
- **Multiple Weapon Types**: Assault Rifle, Plasma Rifle, Flamethrower, Rocket Launcher, and more
- **Power-up Systems**: Orbital Strike and Time-Slow Bubble for strategic advantages
- **Varied Enemy Types**: Grunt, Spitter, Bruiser, Mini-boss, and Boss enemies with unique AI
- **Wave-based Gameplay**: Increasingly difficult waves with chaos mechanics
- **Local Multiplayer**: Support for 2-8 players on the same device
- **Cosmetic System**: Unlock and customize player appearances
- **Community Map Support**: Create, share, and play custom maps
- **Expansion Soundtrack Pack**: Multiple music genres and sound effects

## Screenshots

*(Add screenshots here)*

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for running a local server)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/example/arcade-meltdown.git
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

Alternatively, you can simply open `index.html` in your browser without running a server, but some features may not work properly due to browser security restrictions.

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

1. **Select a Class**: Choose from 5 unique classes, each with different stats and abilities
   - **Grunt**: Balanced class with average stats
   - **Heavy**: High health, slow movement, high damage
   - **Scout**: Low health, fast movement, low damage
   - **Engineer**: Can build turrets and barriers
   - **Medic**: Can heal other players

2. **Survive Waves**: Fight through waves of enemies that increase in difficulty
   - Each wave has more enemies and stronger types
   - Mini-bosses appear every 5 waves
   - Boss battles occur every 10 waves

3. **Manage Chaos**: As you play, the chaos meter increases, affecting gameplay
   - Higher chaos levels spawn more enemies
   - Chaos decreases over time when not fighting

4. **Use Power-ups**: Collect and use power-ups strategically
   - **Orbital Strike**: Call down a devastating orbital strike
   - **Time-Slow Bubble**: Slow down time in a localized area

5. **Customize Your Experience**: Unlock cosmetics, create custom maps, and enjoy different soundtrack packs

## Multiplayer

Arcade Meltdown supports local multiplayer for 2-8 players on the same device. Each player uses their own set of controls:

- **Player 1**: WASD to move, Mouse to aim/shoot
- **Player 2**: Arrow keys to move, Numpad 0 to shoot
- *(Add more control schemes for additional players)*

## Map Editor

Create your own custom maps with the built-in map editor:

1. From the main menu, select "Map Editor"
2. Use the tools to paint tiles, place spawn points, and set objectives
3. Save your map and share it with the community
4. Play custom maps created by other players

## Soundtrack Packs

Enhance your audio experience with expansion soundtrack packs:

1. From the main menu, select "Soundtrack"
2. Browse available soundtrack packs
3. Purchase and enable your preferred pack
4. Enjoy different music genres and sound effects

## Development

### Project Structure

```
arcade-meltdown/
├── assets/
│   ├── css/          # Stylesheets
│   ├── audio/        # Audio files
│   ├── images/       # Image assets
│   └── ui/           # UI assets
├── src/
│   ├── core/         # Core game engine
│   ├── entities/     # Game entities
│   ├── systems/      # Game systems
│   ├── ui/           # UI components
│   └── main.js       # Main entry point
├── index.html        # Main HTML file
├── package.json      # Project metadata
└── README.md         # This file
```

### Building

The game is built using vanilla HTML5, CSS3, and JavaScript (ES6+). No build step is required for development.

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