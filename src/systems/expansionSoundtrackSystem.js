/**
 * Arcade Meltdown - Expansion Soundtrack System
 * Manages additional music tracks and sound effects for expansion packs
 */

class ExpansionSoundtrackSystem {
    /**
     * Create a new expansion soundtrack system
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Soundtrack packs
        this.soundtrackPacks = {
            default: {
                name: "Original Soundtrack",
                description: "The original Arcade Meltdown soundtrack",
                price: 0,
                purchased: true,
                enabled: true,
                tracks: [
                    {
                        id: "menu_theme",
                        name: "Main Menu Theme",
                        path: "assets/audio/music/menu_theme.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "game_theme",
                        name: "Game Theme",
                        path: "assets/audio/music/game_theme.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "boss_theme",
                        name: "Boss Theme",
                        path: "assets/audio/music/boss_theme.mp3",
                        type: "music",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        id: "victory_theme",
                        name: "Victory Theme",
                        path: "assets/audio/music/victory_theme.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "game_over_theme",
                        name: "Game Over Theme",
                        path: "assets/audio/music/game_over_theme.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    }
                ]
            },
            retro_remastered: {
                name: "Retro Remastered",
                description: "Classic 8-bit tracks remastered with modern production",
                price: 499,
                purchased: false,
                enabled: false,
                tracks: [
                    {
                        id: "retro_menu",
                        name: "Retro Menu",
                        path: "assets/audio/expansion/retro_remastered/menu.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "retro_game",
                        name: "Retro Game",
                        path: "assets/audio/expansion/retro_remastered/game.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "retro_boss",
                        name: "Retro Boss",
                        path: "assets/audio/expansion/retro_remastered/boss.mp3",
                        type: "music",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        id: "retro_victory",
                        name: "Retro Victory",
                        path: "assets/audio/expansion/retro_remastered/victory.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "retro_game_over",
                        name: "Retro Game Over",
                        path: "assets/audio/expansion/retro_remastered/game_over.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    }
                ]
            },
            cyber_punk: {
                name: "Cyber Punk Edition",
                description: "Futuristic synthwave and cyberpunk tracks",
                price: 499,
                purchased: false,
                enabled: false,
                tracks: [
                    {
                        id: "cyber_menu",
                        name: "Cyber Menu",
                        path: "assets/audio/expansion/cyber_punk/menu.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "cyber_game",
                        name: "Cyber Game",
                        path: "assets/audio/expansion/cyber_punk/game.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "cyber_boss",
                        name: "Cyber Boss",
                        path: "assets/audio/expansion/cyber_punk/boss.mp3",
                        type: "music",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        id: "cyber_victory",
                        name: "Cyber Victory",
                        path: "assets/audio/expansion/cyber_punk/victory.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "cyber_game_over",
                        name: "Cyber Game Over",
                        path: "assets/audio/expansion/cyber_punk/game_over.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    }
                ]
            },
            metal_mayhem: {
                name: "Metal Mayhem",
                description: "Heavy metal and rock tracks for intense gameplay",
                price: 599,
                purchased: false,
                enabled: false,
                tracks: [
                    {
                        id: "metal_menu",
                        name: "Metal Menu",
                        path: "assets/audio/expansion/metal_mayhem/menu.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "metal_game",
                        name: "Metal Game",
                        path: "assets/audio/expansion/metal_mayhem/game.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "metal_boss",
                        name: "Metal Boss",
                        path: "assets/audio/expansion/metal_mayhem/boss.mp3",
                        type: "music",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        id: "metal_victory",
                        name: "Metal Victory",
                        path: "assets/audio/expansion/metal_mayhem/victory.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "metal_game_over",
                        name: "Metal Game Over",
                        path: "assets/audio/expansion/metal_mayhem/game_over.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    }
                ]
            },
            ambient_chill: {
                name: "Ambient Chill",
                description: "Relaxing ambient tracks for a more laid-back experience",
                price: 399,
                purchased: false,
                enabled: false,
                tracks: [
                    {
                        id: "ambient_menu",
                        name: "Ambient Menu",
                        path: "assets/audio/expansion/ambient_chill/menu.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "ambient_game",
                        name: "Ambient Game",
                        path: "assets/audio/expansion/ambient_chill/game.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: true
                    },
                    {
                        id: "ambient_boss",
                        name: "Ambient Boss",
                        path: "assets/audio/expansion/ambient_chill/boss.mp3",
                        type: "music",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        id: "ambient_victory",
                        name: "Ambient Victory",
                        path: "assets/audio/expansion/ambient_chill/victory.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "ambient_game_over",
                        name: "Ambient Game Over",
                        path: "assets/audio/expansion/ambient_chill/game_over.mp3",
                        type: "music",
                        volume: 0.7,
                        loop: false
                    }
                ]
            },
            sound_effects_expansion: {
                name: "Sound Effects Expansion",
                description: "Additional sound effects for weapons, enemies, and more",
                price: 299,
                purchased: false,
                enabled: false,
                tracks: [
                    {
                        id: "weapon_laser_expanded",
                        name: "Laser Cannon (Expanded)",
                        path: "assets/audio/expansion/sound_effects/weapon_laser.mp3",
                        type: "sfx",
                        volume: 0.8,
                        loop: false
                    },
                    {
                        id: "weapon_plasma_expanded",
                        name: "Plasma Rifle (Expanded)",
                        path: "assets/audio/expansion/sound_effects/weapon_plasma.mp3",
                        type: "sfx",
                        volume: 0.8,
                        loop: false
                    },
                    {
                        id: "weapon_rocket_expanded",
                        name: "Rocket Launcher (Expanded)",
                        path: "assets/audio/expansion/sound_effects/weapon_rocket.mp3",
                        type: "sfx",
                        volume: 0.8,
                        loop: false
                    },
                    {
                        id: "enemy_death_expanded",
                        name: "Enemy Death (Expanded)",
                        path: "assets/audio/expansion/sound_effects/enemy_death.mp3",
                        type: "sfx",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "explosion_expanded",
                        name: "Explosion (Expanded)",
                        path: "assets/audio/expansion/sound_effects/explosion.mp3",
                        type: "sfx",
                        volume: 0.9,
                        loop: false
                    },
                    {
                        id: "powerup_expanded",
                        name: "Power-up (Expanded)",
                        path: "assets/audio/expansion/sound_effects/powerup.mp3",
                        type: "sfx",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "player_hit_expanded",
                        name: "Player Hit (Expanded)",
                        path: "assets/audio/expansion/sound_effects/player_hit.mp3",
                        type: "sfx",
                        volume: 0.7,
                        loop: false
                    },
                    {
                        id: "boss_hit_expanded",
                        name: "Boss Hit (Expanded)",
                        path: "assets/audio/expansion/sound_effects/boss_hit.mp3",
                        type: "sfx",
                        volume: 0.8,
                        loop: false
                    }
                ]
            }
        };
        
        // Currently playing tracks
        this.currentTracks = {
            menu: null,
            game: null,
            boss: null,
            victory: null,
            gameOver: null
        };
        
        // Audio context
        this.audioContext = null;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the expansion soundtrack system
     */
    init() {
        // Load purchased packs from storage
        this.loadPurchasedPacks();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize audio context
        this.initAudioContext();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        window.eventSystem.on('game:over', (gameEngine) => {
            this.onGameOver(gameEngine);
        });
        
        window.eventSystem.on('wave:combatStart', (waveNumber) => {
            this.onWaveCombatStart(waveNumber);
        });
        
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
        });
        
        window.eventSystem.on('boss:spawn', (boss) => {
            this.onBossSpawn(boss);
        });
        
        window.eventSystem.on('boss:defeated', (boss) => {
            this.onBossDefeated(boss);
        });
        
        window.eventSystem.on('soundtrack:purchase', (packId) => {
            this.purchasePack(packId);
        });
        
        window.eventSystem.on('soundtrack:enable', (packId) => {
            this.enablePack(packId);
        });
        
        window.eventSystem.on('soundtrack:disable', (packId) => {
            this.disablePack(packId);
        });
        
        // Listen for user interaction to initialize audio context
        document.addEventListener('click', () => this.initAudioContext(), { once: true });
        document.addEventListener('keydown', () => this.initAudioContext(), { once: true });
    }
    
    /**
     * Initialize audio context
     */
    initAudioContext() {
        if (this.audioContext) {
            return;
        }
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Set up audio context for all packs
            for (const packId of Object.keys(this.soundtrackPacks)) {
                if (this.soundtrackPacks[packId].purchased) {
                    this.loadPackAudio(packId);
                }
            }
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }
    
    /**
     * Load purchased packs from local storage
     */
    loadPurchasedPacks() {
        try {
            const savedPacks = localStorage.getItem('arcademeltdown_soundtrack_packs');
            if (savedPacks) {
                const packs = JSON.parse(savedPacks);
                for (const packId in packs) {
                    if (this.soundtrackPacks[packId]) {
                        this.soundtrackPacks[packId].purchased = packs[packId];
                    }
                }
            }
            
            // Load enabled pack
            const enabledPack = localStorage.getItem('arcademeltdown_soundtrack_enabled');
            if (enabledPack && this.soundtrackPacks[enabledPack]) {
                // Disable all packs
                for (const packId of Object.keys(this.soundtrackPacks)) {
                    this.soundtrackPacks[packId].enabled = false;
                }
                
                // Enable the saved pack
                this.soundtrackPacks[enabledPack].enabled = true;
            }
        } catch (error) {
            console.error('Failed to load soundtrack packs:', error);
        }
    }
    
    /**
     * Save purchased packs to local storage
     */
    savePurchasedPacks() {
        try {
            const packs = {};
            for (const packId of Object.keys(this.soundtrackPacks)) {
                packs[packId] = this.soundtrackPacks[packId].purchased;
            }
            
            localStorage.setItem('arcademeltdown_soundtrack_packs', JSON.stringify(packs));
            
            // Save enabled pack
            for (const packId of Object.keys(this.soundtrackPacks)) {
                if (this.soundtrackPacks[packId].enabled) {
                    localStorage.setItem('arcademeltdown_soundtrack_enabled', packId);
                    break;
                }
            }
        } catch (error) {
            console.error('Failed to save soundtrack packs:', error);
        }
    }
    
    /**
     * Load audio for a pack
     * @param {string} packId - Pack ID
     */
    loadPackAudio(packId) {
        if (!this.audioContext) {
            return;
        }
        
        const pack = this.soundtrackPacks[packId];
        if (!pack || !pack.purchased) {
            return;
        }
        
        // Load all tracks in the pack
        for (const track of pack.tracks) {
            if (!track.audio) {
                try {
                    // Create audio element
                    track.audio = new Audio(track.path);
                    track.audio.volume = track.volume;
                    track.audio.loop = track.loop;
                    
                    // Connect to audio context if needed
                    if (this.audioContext.createMediaElementSource) {
                        const source = this.audioContext.createMediaElementSource(track.audio);
                        source.connect(this.audioContext.destination);
                    }
                } catch (error) {
                    console.error(`Failed to load audio for track ${track.id}:`, error);
                }
            }
        }
    }
    
    /**
     * Get the enabled pack
     * @returns {object|null} Enabled pack or null if none
     */
    getEnabledPack() {
        for (const packId of Object.keys(this.soundtrackPacks)) {
            if (this.soundtrackPacks[packId].enabled) {
                return this.soundtrackPacks[packId];
            }
        }
        return null;
    }
    
    /**
     * Get a track by type from the enabled pack
     * @param {string} type - Track type (menu, game, boss, victory, gameOver)
     * @returns {object|null} Track or null if not found
     */
    getTrack(type) {
        const pack = this.getEnabledPack();
        if (!pack) {
            return null;
        }
        
        for (const track of pack.tracks) {
            if (track.id.includes(type)) {
                return track;
            }
        }
        
        return null;
    }
    
    /**
     * Play a track by type
     * @param {string} type - Track type (menu, game, boss, victory, gameOver)
     */
    playTrack(type) {
        // Stop current track of this type
        this.stopTrack(type);
        
        // Get track
        const track = this.getTrack(type);
        if (!track || !track.audio) {
            return;
        }
        
        // Check if audio source is valid before attempting to play
        if (!track.audio.src || track.audio.readyState === 0) {
            console.warn(`Track ${track.id} has no valid audio source`);
            return;
        }
        
        // Play track
        track.audio.currentTime = 0;
        track.audio.play().catch(error => {
            console.warn(`Failed to play track ${track.id}:`, error.message);
            // Don't throw the error, just log it and continue
        });
        
        // Store as current track
        this.currentTracks[type] = track;
    }
    
    /**
     * Stop a track by type
     * @param {string} type - Track type (menu, game, boss, victory, gameOver)
     */
    stopTrack(type) {
        const track = this.currentTracks[type];
        if (track && track.audio) {
            track.audio.pause();
            track.audio.currentTime = 0;
            this.currentTracks[type] = null;
        }
    }
    
    /**
     * Stop all tracks
     */
    stopAllTracks() {
        for (const type of Object.keys(this.currentTracks)) {
            this.stopTrack(type);
        }
    }
    
    /**
     * Pause a track by type
     * @param {string} type - Track type (menu, game, boss, victory, gameOver)
     */
    pauseTrack(type) {
        const track = this.currentTracks[type];
        if (track && track.audio) {
            track.audio.pause();
        }
    }
    
    /**
     * Resume a track by type
     * @param {string} type - Track type (menu, game, boss, victory, gameOver)
     */
    resumeTrack(type) {
        const track = this.currentTracks[type];
        if (track && track.audio) {
            track.audio.play().catch(error => {
                console.error(`Failed to resume track ${track.id}:`, error);
            });
        }
    }
    
    /**
     * Purchase a pack
     * @param {string} packId - Pack ID
     * @returns {boolean} Whether the purchase was successful
     */
    purchasePack(packId) {
        const pack = this.soundtrackPacks[packId];
        if (!pack || pack.purchased) {
            return false;
        }
        
        // In a real implementation, this would handle payment processing
        // For now, we'll just mark it as purchased
        pack.purchased = true;
        
        // Save purchased packs
        this.savePurchasedPacks();
        
        // Load audio for the pack
        this.loadPackAudio(packId);
        
        // Emit purchase event
        window.eventSystem.emit('soundtrack:purchased', packId);
        
        return true;
    }
    
    /**
     * Enable a pack
     * @param {string} packId - Pack ID
     * @returns {boolean} Whether the pack was enabled
     */
    enablePack(packId) {
        const pack = this.soundtrackPacks[packId];
        if (!pack || !pack.purchased || pack.enabled) {
            return false;
        }
        
        // Disable all packs
        for (const pid of Object.keys(this.soundtrackPacks)) {
            this.soundtrackPacks[pid].enabled = false;
        }
        
        // Enable the pack
        pack.enabled = true;
        
        // Save enabled pack
        this.savePurchasedPacks();
        
        // Reload current tracks if game is running
        if (this.gameEngine.gameState === 'playing') {
            this.playTrack('game');
        } else if (this.gameEngine.gameState === 'menu') {
            this.playTrack('menu');
        }
        
        // Emit enable event
        window.eventSystem.emit('soundtrack:enabled', packId);
        
        return true;
    }
    
    /**
     * Disable a pack
     * @param {string} packId - Pack ID
     * @returns {boolean} Whether the pack was disabled
     */
    disablePack(packId) {
        const pack = this.soundtrackPacks[packId];
        if (!pack || !pack.enabled) {
            return false;
        }
        
        // Disable the pack
        pack.enabled = false;
        
        // Save enabled pack
        this.savePurchasedPacks();
        
        // Stop all tracks
        this.stopAllTracks();
        
        // Enable default pack
        this.soundtrackPacks.default.enabled = true;
        
        // Reload current tracks if game is running
        if (this.gameEngine.gameState === 'playing') {
            this.playTrack('game');
        } else if (this.gameEngine.gameState === 'menu') {
            this.playTrack('menu');
        }
        
        // Emit disable event
        window.eventSystem.emit('soundtrack:disabled', packId);
        
        return true;
    }
    
    /**
     * Get all soundtrack packs
     * @returns {object} Soundtrack packs
     */
    getAllPacks() {
        return this.soundtrackPacks;
    }
    
    /**
     * Get a soundtrack pack by ID
     * @param {string} packId - Pack ID
     * @returns {object|null} Pack or null if not found
     */
    getPack(packId) {
        return this.soundtrackPacks[packId] || null;
    }
    
    /**
     * Handle game start
     * @param {GameEngine} gameEngine - Game engine instance
     */
    onGameStart(gameEngine) {
        // Stop menu music
        this.stopTrack('menu');
        
        // Play game music
        this.playTrack('game');
    }
    
    /**
     * Handle game over
     * @param {GameEngine} gameEngine - Game engine instance
     */
    onGameOver(gameEngine) {
        // Stop game and boss music
        this.stopTrack('game');
        this.stopTrack('boss');
        
        // Play game over music
        this.playTrack('gameOver');
    }
    
    /**
     * Handle wave combat start
     * @param {number} waveNumber - Wave number
     */
    onWaveCombatStart(waveNumber) {
        // Resume game music if paused
        this.resumeTrack('game');
    }
    
    /**
     * Handle wave complete
     * @param {number} waveNumber - Wave number
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Pause game music
        this.pauseTrack('game');
        
        // Play victory music
        this.playTrack('victory');
        
        // Resume game music after victory music finishes
        const victoryTrack = this.currentTracks.victory;
        if (victoryTrack && victoryTrack.audio) {
            victoryTrack.audio.onended = () => {
                this.resumeTrack('game');
                victoryTrack.audio.onended = null;
            };
        }
    }
    
    /**
     * Handle boss spawn
     * @param {Enemy} boss - Boss entity
     */
    onBossSpawn(boss) {
        // Stop game music
        this.stopTrack('game');
        
        // Play boss music
        this.playTrack('boss');
    }
    
    /**
     * Handle boss defeated
     * @param {Enemy} boss - Boss entity
     */
    onBossDefeated(boss) {
        // Stop boss music
        this.stopTrack('boss');
        
        // Play victory music
        this.playTrack('victory');
        
        // Resume game music after victory music finishes
        const victoryTrack = this.currentTracks.victory;
        if (victoryTrack && victoryTrack.audio) {
            victoryTrack.audio.onended = () => {
                this.playTrack('game');
                victoryTrack.audio.onended = null;
            };
        }
    }
    
    /**
     * Update the expansion soundtrack system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the expansion soundtrack system
     */
    destroy() {
        // Stop all tracks
        this.stopAllTracks();
        
        // Save purchased packs
        this.savePurchasedPacks();
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

// Export for use in modules
export default ExpansionSoundtrackSystem;