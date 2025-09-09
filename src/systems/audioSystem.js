/**
 * Arcade Meltdown - Audio System
 * Manages all audio playback in the game
 */

import AudioManager from '../audio/audioManager.js';

class AudioSystem {
    /**
     * Create a new audio system
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.audioManager = null;
        this.initialized = false;
    }
    
    /**
     * Initialize the audio system
     */
    init() {
        // Create audio manager
        this.audioManager = new AudioManager(this.gameEngine);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Mark as initialized
        this.initialized = true;
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for tileset changes
        window.eventSystem.on('arena:tilesetChanged', (tileset) => {
            this.onTilesetChanged(tileset);
        });
        
        // Listen for boss spawn
        window.eventSystem.on('enemy:bossSpawn', (boss) => {
            this.onBossSpawn(boss);
        });
        
        // Listen for game state changes
        window.eventSystem.on('game:stateChanged', (newState, oldState) => {
            this.onGameStateChanged(newState, oldState);
        });
    }
    
    /**
     * Handle tileset change
     * @param {string} tileset - New tileset
     */
    onTilesetChanged(tileset) {
        if (this.audioManager) {
            this.audioManager.setAmbientForTileset(tileset);
        }
    }
    
    /**
     * Handle boss spawn
     * @param {Enemy} boss - Boss that spawned
     */
    onBossSpawn(boss) {
        if (this.audioManager) {
            // Play boss intro sound
            this.audioManager.playSoundAtPosition('enemy_boss_intro', boss.position.x, boss.position.y, {
                volume: 0.8,
                maxDistance: 2000
            });
            
            // Switch to boss battle music
            this.audioManager.playMusic('boss_battle');
        }
    }
    
    /**
     * Handle game state change
     * @param {string} newState - New game state
     * @param {string} oldState - Old game state
     */
    onGameStateChanged(newState, oldState) {
        if (!this.audioManager) return;
        
        // Additional state-specific audio handling
        if (newState === 'playing' && oldState === 'paused') {
            // Resume ambient sounds when unpausing
            const arenaSystem = this.gameEngine.getSystem('arena');
            if (arenaSystem) {
                this.audioManager.setAmbientForTileset(arenaSystem.getCurrentTileset());
            }
        }
    }
    
    /**
     * Update the audio system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        if (!this.initialized || !this.audioManager) return;
        
        // Update audio manager
        this.audioManager.update(deltaTime);
    }
    
    /**
     * Get the audio manager
     * @returns {AudioManager} The audio manager
     */
    getAudioManager() {
        return this.audioManager;
    }
    
    /**
     * Destroy the audio system
     */
    destroy() {
        if (this.audioManager) {
            this.audioManager.destroy();
            this.audioManager = null;
        }
        
        this.initialized = false;
    }
}

// Export for use in modules
export default AudioSystem;