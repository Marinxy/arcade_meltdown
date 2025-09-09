# Contributing to Arcade Meltdown

Thank you for your interest in contributing to Arcade Meltdown! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- A modern web browser
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/arcade-meltdown.git
   cd arcade-meltdown
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser to `http://localhost:8080`

## Project Structure

```
src/
├── core/           # Core game engine and systems
├── entities/       # Game entities (Player, Enemy, Bullet, etc.)
├── systems/        # Game systems (Input, Render, Physics, Audio)
├── assets/         # Asset management
├── audio/          # Audio management
├── ui/             # UI components
└── main.js         # Main entry point

assets/
├── css/            # Stylesheets
├── audio/          # Audio files
├── sprites/        # Game sprites
└── icons/          # UI icons
```

## Architecture

Arcade Meltdown uses an Entity-Component-System (ECS) architecture:

- **Entities**: Game objects (Player, Enemy, Bullet, etc.)
- **Components**: Data containers (Transform, Physics, Render, Health, etc.)
- **Systems**: Logic processors (InputSystem, RenderSystem, PhysicsSystem, etc.)

## Coding Standards

### JavaScript
- Use ES6+ features
- Use meaningful variable and function names
- Add JSDoc comments for functions and classes
- Use consistent indentation (2 spaces)
- Use semicolons

### CSS
- Use meaningful class names
- Use consistent indentation (2 spaces)
- Group related styles together
- Use responsive design principles

### HTML
- Use semantic HTML elements
- Use consistent indentation (2 spaces)
- Add meaningful alt text for images
- Use proper accessibility attributes

## Asset Guidelines

### Sprites
- Use PNG format for sprites
- Follow the naming convention in `PLACEHOLDER_ASSETS.md`
- Maintain consistent art style
- Optimize file sizes for web delivery

### Audio
- Use MP3 format for audio files
- Keep file sizes reasonable
- Use consistent naming convention
- Test audio in different browsers

## Testing

### Manual Testing
- Test on different screen sizes
- Test in different browsers
- Test with different input devices
- Test performance with many entities

### Automated Testing
- Add unit tests for new functions
- Test edge cases and error conditions
- Ensure all systems work together

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

### Pull Request Guidelines

- Use descriptive commit messages
- Keep changes focused and atomic
- Update documentation for new features
- Include screenshots for UI changes
- Test on multiple browsers/devices

## Bug Reports

When reporting bugs, please include:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS information
- Screenshots if applicable

## Feature Requests

When requesting features, please include:

- Description of the feature
- Use case and motivation
- Proposed implementation (if you have ideas)
- Any relevant mockups or examples

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's coding standards
- Be patient with newcomers

## Getting Help

- Check existing issues and discussions
- Ask questions in GitHub discussions
- Join our community (if available)
- Read the documentation thoroughly

## License

By contributing to Arcade Meltdown, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md acknowledgments
- CHANGELOG.md for significant contributions
- Release notes for major features

Thank you for contributing to Arcade Meltdown! 🎮
