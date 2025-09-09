/**
 * Arcade Meltdown - Main Entry Point
 * Initializes and runs the game
 */

// Import required modules
import GameEngine from './core/gameEngine.js';
import Config from './core/config.js';
import EventSystem from './core/eventSystem.js';
import UI from './ui/ui.js';
import Player from './entities/player.js';
import Enemy from './entities/enemy.js';

// Make classes available globally for circular dependency workarounds
window.Player = Player;
window.Enemy = Enemy;

// Global game instance
let gameEngine = null;
let config = null;
let eventSystem = null;
let ui = null;

/**
 * Initialize the game
 */
function init() {
    // Initialize config system
    window.config = new Config();
    window.config.init();
    
    // Initialize event system
    window.eventSystem = new EventSystem();
    window.eventSystem.init();
    
    // Initialize UI
    ui = new UI();
    ui.init();
    
    // Get canvas and context
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Set canvas size to viewport
    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Update config
        window.config.set('graphics.canvasWidth', width);
        window.config.set('graphics.canvasHeight', height);
        
        // Update game engine if it exists
        if (gameEngine) {
            gameEngine.canvas.width = width;
            gameEngine.canvas.height = height;
            gameEngine.arena.width = width;
            gameEngine.arena.height = height;
        }
    }
    
    // Set initial size
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    
    // Create game engine
    gameEngine = new GameEngine(canvas, ctx);
    
    // Set up global game reference
    window.game = gameEngine;
    
    // Set up UI event listeners
    setupUIEventListeners();
    
    // Show loading screen
    ui.showLoadingScreen();
    
    // Simulate loading time
    setTimeout(() => {
        // Hide loading screen
        ui.hideLoadingScreen();
        
        // Show main menu
        ui.showMainMenu();
        
        // Start game engine
        gameEngine.start();
    }, 2000);
}

/**
 * Set up UI event listeners
 */
function setupUIEventListeners() {
    // Main menu buttons
    document.getElementById('play-button')?.addEventListener('click', () => {
        ui.hideMainMenu();
        ui.showClassSelect();
    });
    
    document.getElementById('class-select-button')?.addEventListener('click', () => {
        ui.hideMainMenu();
        ui.showClassSelect();
    });
    
    document.getElementById('cosmetics-button')?.addEventListener('click', () => {
        // Show cosmetics UI
        if (gameEngine.cosmeticSystem && gameEngine.cosmeticSystem.ui) {
            gameEngine.cosmeticSystem.ui.show();
        }
    });
    
    document.getElementById('map-editor-button')?.addEventListener('click', () => {
        // Start map editor
        window.eventSystem.emit('editor:start');
    });
    
    document.getElementById('soundtrack-button')?.addEventListener('click', () => {
        // Show soundtrack UI
        if (gameEngine.expansionSoundtrackSystem && gameEngine.expansionSoundtrackSystem.ui) {
            gameEngine.expansionSoundtrackSystem.ui.show();
        }
    });
    
    document.getElementById('options-button')?.addEventListener('click', () => {
        ui.hideMainMenu();
        ui.showOptionsMenu();
    });
    
    document.getElementById('quit-button')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to quit?')) {
            gameEngine.stop();
            window.close();
        }
    });
    
    // Class selection
    document.querySelectorAll('.class-card')?.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            document.querySelectorAll('.class-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            card.classList.add('selected');
        });
    });
    
    document.getElementById('class-select-back')?.addEventListener('click', () => {
        ui.hideClassSelect();
        ui.showMainMenu();
    });
    
    document.getElementById('class-select-confirm')?.addEventListener('click', () => {
        const selectedCard = document.querySelector('.class-card.selected');
        if (selectedCard) {
            const playerClass = selectedCard.dataset.class;
            ui.hideClassSelect();
            ui.showGameContainer();
            gameEngine.startGame(playerClass);
        } else {
            alert('Please select a class');
        }
    });
    
    // Pause menu
    document.getElementById('resume-button')?.addEventListener('click', () => {
        ui.hidePauseMenu();
        gameEngine.gameState = 'playing';
    });
    
    document.getElementById('restart-button')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to restart?')) {
            ui.hidePauseMenu();
            const playerClass = gameEngine.playerClass || 'grunt';
            gameEngine.startGame(playerClass);
        }
    });
    
    document.getElementById('main-menu-button')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to return to the main menu?')) {
            ui.hidePauseMenu();
            ui.hideGameContainer();
            ui.showMainMenu();
            gameEngine.gameState = 'menu';
        }
    });
    
    // Game over
    document.getElementById('play-again-button')?.addEventListener('click', () => {
        ui.hideGameOver();
        const playerClass = gameEngine.playerClass || 'grunt';
        gameEngine.startGame(playerClass);
    });
    
    document.getElementById('game-over-main-menu-button')?.addEventListener('click', () => {
        ui.hideGameOver();
        ui.hideGameContainer();
        ui.showMainMenu();
        gameEngine.gameState = 'menu';
    });
    
    // Scoreboard
    document.getElementById('continue-button')?.addEventListener('click', () => {
        ui.hideScoreboard();
        gameEngine.continueToNextWave();
    });
    
    // Options menu
    document.getElementById('back-options')?.addEventListener('click', () => {
        ui.hideOptionsMenu();
        ui.showMainMenu();
    });
    
    document.getElementById('apply-options')?.addEventListener('click', () => {
        // Apply options
        applyOptions();
        ui.hideOptionsMenu();
        ui.showMainMenu();
    });
    
    document.getElementById('reset-options')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all options to default?')) {
            // Reset options
            resetOptions();
        }
    });
    
    // Options tabs
    document.querySelectorAll('.options-tab')?.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            document.querySelectorAll('.options-tab').forEach(t => {
                t.classList.remove('active');
            });
            document.querySelectorAll('.options-panel').forEach(p => {
                p.classList.remove('active');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding panel
            const panelId = tab.dataset.tab + '-options';
            document.getElementById(panelId)?.classList.add('active');
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key
        if (e.key === 'Escape') {
            if (gameEngine.gameState === 'playing') {
                gameEngine.gameState = 'paused';
                ui.showPauseMenu();
            } else if (gameEngine.gameState === 'paused') {
                ui.hidePauseMenu();
                gameEngine.gameState = 'playing';
            }
        }
    });
}

/**
 * Apply options
 */
function applyOptions() {
    // Graphics options (resolution is now handled by responsive sizing)
    
    const fullscreen = document.getElementById('fullscreen')?.checked;
    if (fullscreen) {
        document.documentElement.requestFullscreen();
    }
    
    const vsync = document.getElementById('vsync')?.checked;
    window.config.set('graphics.vsync', vsync);
    
    const quality = document.getElementById('quality')?.value;
    window.config.set('graphics.quality', quality);
    
    const particles = document.getElementById('particles')?.checked;
    window.config.set('graphics.particles', particles);
    
    const shadows = document.getElementById('shadows')?.checked;
    window.config.set('graphics.shadows', shadows);
    
    // Audio options
    const masterVolume = document.getElementById('master-volume')?.value;
    if (masterVolume !== undefined) {
        window.config.set('audio.masterVolume', masterVolume / 100);
        // Update audio system volume
        if (gameEngine.audioSystem) {
            gameEngine.audioSystem.setMasterVolume(masterVolume / 100);
        }
    }
    
    const musicVolume = document.getElementById('music-volume')?.value;
    if (musicVolume !== undefined) {
        window.config.set('audio.musicVolume', musicVolume / 100);
        // Update audio system music volume
        if (gameEngine.audioSystem) {
            gameEngine.audioSystem.setMusicVolume(musicVolume / 100);
        }
    }
    
    const sfxVolume = document.getElementById('sfx-volume')?.value;
    if (sfxVolume !== undefined) {
        window.config.set('audio.sfxVolume', sfxVolume / 100);
        // Update audio system SFX volume
        if (gameEngine.audioSystem) {
            gameEngine.audioSystem.setSfxVolume(sfxVolume / 100);
        }
    }
    
    const soundpack = document.getElementById('soundpack')?.value;
    window.config.set('audio.soundpack', soundpack);
    
    // Gameplay options
    const difficulty = document.getElementById('difficulty')?.value;
    window.config.set('game.difficulty', difficulty);
    
    const friendlyFire = document.getElementById('friendly-fire')?.checked;
    window.config.set('game.friendlyFire', friendlyFire);
    
    const autoReload = document.getElementById('auto-reload')?.checked;
    window.config.set('game.autoReload', autoReload);
    
    const aimAssist = document.getElementById('aim-assist')?.checked;
    window.config.set('game.aimAssist', aimAssist);
    
    // Save config
    window.config.save();
}

/**
 * Reset options to default
 */
function resetOptions() {
    // Reset graphics options
    document.getElementById('resolution').value = '1280x720';
    document.getElementById('fullscreen').checked = false;
    document.getElementById('vsync').checked = true;
    document.getElementById('quality').value = 'high';
    document.getElementById('particles').checked = true;
    document.getElementById('shadows').checked = true;
    
    // Reset audio options
    document.getElementById('master-volume').value = 80;
    document.getElementById('music-volume').value = 70;
    document.getElementById('sfx-volume').value = 80;
    document.getElementById('soundpack').value = 'default';
    
    // Reset gameplay options
    document.getElementById('difficulty').value = 'normal';
    document.getElementById('friendly-fire').checked = false;
    document.getElementById('auto-reload').checked = true;
    document.getElementById('aim-assist').checked = false;
    
    // Reset config
    window.config.reset();
    window.config.save();
}

/**
 * Global functions for UI
 */
window.showMainMenu = () => {
    ui.hideGameContainer();
    ui.hideClassSelect();
    ui.hideOptionsMenu();
    ui.showMainMenu();
    gameEngine.gameState = 'menu';
};

window.showGameOver = () => {
    ui.showGameOver();
    
    // Update game over stats
    document.getElementById('final-score').textContent = `Final Score: ${gameEngine.score}`;
    document.getElementById('waves-survived').textContent = gameEngine.wave - 1;
    
    // Calculate enemies defeated
    let enemiesDefeated = 0;
    for (let i = 1; i < gameEngine.wave; i++) {
        const baseEnemyCount = 5;
        enemiesDefeated += Math.floor(baseEnemyCount * Math.pow(window.config.get('game.waveScaling'), i - 1));
    }
    document.getElementById('enemies-defeated').textContent = enemiesDefeated;
};

window.showScoreboard = () => {
    ui.showScoreboard();
    
    // Update scoreboard stats
    document.getElementById('current-score').textContent = gameEngine.score;
    document.getElementById('wave-number').textContent = gameEngine.wave;
    
    // Calculate enemies defeated in this wave
    let enemiesDefeated = 0;
    const baseEnemyCount = 5;
    enemiesDefeated = Math.floor(baseEnemyCount * Math.pow(window.config.get('game.waveScaling'), gameEngine.wave - 1));
    document.getElementById('wave-enemies-defeated').textContent = enemiesDefeated;
    
    // Update player rankings
    const playersList = document.getElementById('scoreboard-players-list');
    if (playersList) {
        playersList.innerHTML = '';
        
        // Add local player
        const playerItem = document.createElement('div');
        playerItem.className = 'scoreboard-player-item';
        playerItem.innerHTML = `
            <div class="player-rank">#1</div>
            <div class="player-name">You</div>
            <div class="player-class">${gameEngine.playerClass}</div>
            <div class="player-score">${gameEngine.score}</div>
            <div class="player-title">${getPlayerTitle(gameEngine.score)}</div>
        `;
        playersList.appendChild(playerItem);
    }
};

/**
 * Get player title based on score
 * @param {number} score - Player score
 * @returns {string} Player title
 */
function getPlayerTitle(score) {
    if (score < 100) return 'Rookie Recruit';
    if (score < 500) return 'Battle-Tested';
    if (score < 1000) return 'Chaos Connoisseur';
    if (score < 2500) return 'Meltdown Maestro';
    if (score < 5000) return 'Arcade Ace';
    if (score < 10000) return 'Neon Nemesis';
    return 'Digital Demigod';
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);