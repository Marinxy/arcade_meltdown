/**
 * Arcade Meltdown - Audio Manager
 * Handles all music and sound effects for the game
 */

class AudioManager {
    /**
     * Create a new audio manager
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Audio context
        this.audioContext = null;
        this.masterGainNode = null;
        this.musicGainNode = null;
        this.sfxGainNode = null;
        
        // Audio state
        this.enabled = true;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        
        // Current music
        this.currentMusic = null;
        this.musicSource = null;
        this.musicStartTime = 0;
        this.musicPausedAt = 0;
        this.musicLoop = true;
        
        // Sound effects
        this.sounds = {};
        this.loadedSounds = 0;
        this.totalSounds = 0;
        
        // Music tracks
        this.musicTracks = {
            main_menu: {
                path: "assets/audio/music/main_menu.mp3",
                title: "Main Menu Theme",
                artist: "Retro TrashBit",
                duration: 180,
                loop: true
            },
            game_intro: {
                path: "assets/audio/music/game_intro.mp3",
                title: "Game Intro",
                artist: "Retro TrashBit",
                duration: 30,
                loop: false
            },
            gameplay_normal: {
                path: "assets/audio/music/gameplay_normal.mp3",
                title: "Normal Gameplay",
                artist: "Retro TrashBit",
                duration: 240,
                loop: true
            },
            gameplay_chaos: {
                path: "assets/audio/music/gameplay_chaos.mp3",
                title: "Chaos Gameplay",
                artist: "Retro TrashBit",
                duration: 180,
                loop: true
            },
            boss_battle: {
                path: "assets/audio/music/boss_battle.mp3",
                title: "Boss Battle",
                artist: "Retro TrashBit",
                duration: 200,
                loop: true
            },
            victory: {
                path: "assets/audio/music/victory.mp3",
                title: "Victory Theme",
                artist: "Retro TrashBit",
                duration: 60,
                loop: false
            },
            game_over: {
                path: "assets/audio/music/game_over.mp3",
                title: "Game Over",
                artist: "Retro TrashBit",
                duration: 45,
                loop: false
            },
            credits: {
                path: "assets/audio/music/credits.mp3",
                title: "Credits Theme",
                artist: "Retro TrashBit",
                duration: 120,
                loop: true
            }
        };
        
        // Sound effects
        this.soundEffects = {
            // Player sounds
            player_move: {
                path: "assets/audio/sfx/player_move.mp3",
                volume: 0.3,
                loop: false
            },
            player_jump: {
                path: "assets/audio/sfx/player_jump.mp3",
                volume: 0.5,
                loop: false
            },
            player_land: {
                path: "assets/audio/sfx/player_land.mp3",
                volume: 0.4,
                loop: false
            },
            player_damage: {
                path: "assets/audio/sfx/player_damage.mp3",
                volume: 0.6,
                loop: false
            },
            player_death: {
                path: "assets/audio/sfx/player_death.mp3",
                volume: 0.7,
                loop: false
            },
            player_heal: {
                path: "assets/audio/sfx/player_heal.mp3",
                volume: 0.5,
                loop: false
            },
            player_respawn: {
                path: "assets/audio/sfx/player_respawn.mp3",
                volume: 0.6,
                loop: false
            },
            
            // Weapon sounds
            weapon_pistol_fire: {
                path: "assets/audio/sfx/weapon_pistol_fire.mp3",
                volume: 0.7,
                loop: false
            },
            weapon_pistol_reload: {
                path: "assets/audio/sfx/weapon_pistol_reload.mp3",
                volume: 0.5,
                loop: false
            },
            weapon_smg_fire: {
                path: "assets/audio/sfx/weapon_smg_fire.mp3",
                volume: 0.6,
                loop: false
            },
            weapon_smg_reload: {
                path: "assets/audio/sfx/weapon_smg_reload.mp3",
                volume: 0.5,
                loop: false
            },
            weapon_shotgun_fire: {
                path: "assets/audio/sfx/weapon_shotgun_fire.mp3",
                volume: 0.8,
                loop: false
            },
            weapon_shotgun_reload: {
                path: "assets/audio/sfx/weapon_shotgun_reload.mp3",
                volume: 0.6,
                loop: false
            },
            weapon_rifle_fire: {
                path: "assets/audio/sfx/weapon_rifle_fire.mp3",
                volume: 0.7,
                loop: false
            },
            weapon_rifle_reload: {
                path: "assets/audio/sfx/weapon_rifle_reload.mp3",
                volume: 0.5,
                loop: false
            },
            weapon_plasma_fire: {
                path: "assets/audio/sfx/weapon_plasma_fire.mp3",
                volume: 0.6,
                loop: false
            },
            weapon_plasma_reload: {
                path: "assets/audio/sfx/weapon_plasma_reload.mp3",
                volume: 0.4,
                loop: false
            },
            weapon_flamethrower_fire: {
                path: "assets/audio/sfx/weapon_flamethrower_fire.mp3",
                volume: 0.5,
                loop: true
            },
            weapon_flamethrower_stop: {
                path: "assets/audio/sfx/weapon_flamethrower_stop.mp3",
                volume: 0.4,
                loop: false
            },
            weapon_rocket_fire: {
                path: "assets/audio/sfx/weapon_rocket_fire.mp3",
                volume: 0.7,
                loop: false
            },
            weapon_rocket_reload: {
                path: "assets/audio/sfx/weapon_rocket_reload.mp3",
                volume: 0.5,
                loop: false
            },
            weapon_rocket_explode: {
                path: "assets/audio/sfx/weapon_rocket_explode.mp3",
                volume: 0.8,
                loop: false
            },
            
            // Enemy sounds
            enemy_grunt_move: {
                path: "assets/audio/sfx/enemy_grunt_move.mp3",
                volume: 0.3,
                loop: false
            },
            enemy_grunt_attack: {
                path: "assets/audio/sfx/enemy_grunt_attack.mp3",
                volume: 0.5,
                loop: false
            },
            enemy_grunt_damage: {
                path: "assets/audio/sfx/enemy_grunt_damage.mp3",
                volume: 0.6,
                loop: false
            },
            enemy_grunt_death: {
                path: "assets/audio/sfx/enemy_grunt_death.mp3",
                volume: 0.7,
                loop: false
            },
            enemy_spitter_attack: {
                path: "assets/audio/sfx/enemy_spitter_attack.mp3",
                volume: 0.6,
                loop: false
            },
            enemy_spitter_damage: {
                path: "assets/audio/sfx/enemy_spitter_damage.mp3",
                volume: 0.6,
                loop: false
            },
            enemy_spitter_death: {
                path: "assets/audio/sfx/enemy_spitter_death.mp3",
                volume: 0.7,
                loop: false
            },
            enemy_bruiser_move: {
                path: "assets/audio/sfx/enemy_bruiser_move.mp3",
                volume: 0.5,
                loop: false
            },
            enemy_bruiser_attack: {
                path: "assets/audio/sfx/enemy_bruiser_attack.mp3",
                volume: 0.7,
                loop: false
            },
            enemy_bruiser_damage: {
                path: "assets/audio/sfx/enemy_bruiser_damage.mp3",
                volume: 0.6,
                loop: false
            },
            enemy_bruiser_death: {
                path: "assets/audio/sfx/enemy_bruiser_death.mp3",
                volume: 0.8,
                loop: false
            },
            enemy_boss_intro: {
                path: "assets/audio/sfx/enemy_boss_intro.mp3",
                volume: 0.8,
                loop: false
            },
            enemy_boss_attack: {
                path: "assets/audio/sfx/enemy_boss_attack.mp3",
                volume: 0.7,
                loop: false
            },
            enemy_boss_damage: {
                path: "assets/audio/sfx/enemy_boss_damage.mp3",
                volume: 0.6,
                loop: false
            },
            enemy_boss_death: {
                path: "assets/audio/sfx/enemy_boss_death.mp3",
                volume: 0.9,
                loop: false
            },
            
            // Environment sounds
            env_explosion: {
                path: "assets/audio/sfx/env_explosion.mp3",
                volume: 0.8,
                loop: false
            },
            env_debris: {
                path: "assets/audio/sfx/env_debris.mp3",
                volume: 0.6,
                loop: false
            },
            env_glass_break: {
                path: "assets/audio/sfx/env_glass_break.mp3",
                volume: 0.7,
                loop: false
            },
            env_metal_hit: {
                path: "assets/audio/sfx/env_metal_hit.mp3",
                volume: 0.6,
                loop: false
            },
            env_concrete_hit: {
                path: "assets/audio/sfx/env_concrete_hit.mp3",
                volume: 0.5,
                loop: false
            },
            env_door_open: {
                path: "assets/audio/sfx/env_door_open.mp3",
                volume: 0.5,
                loop: false
            },
            env_door_close: {
                path: "assets/audio/sfx/env_door_close.mp3",
                volume: 0.5,
                loop: false
            },
            env_powerup: {
                path: "assets/audio/sfx/env_powerup.mp3",
                volume: 0.6,
                loop: false
            },
            env_chaos_increase: {
                path: "assets/audio/sfx/env_chaos_increase.mp3",
                volume: 0.7,
                loop: false
            },
            env_chaos_decrease: {
                path: "assets/audio/sfx/env_chaos_decrease.mp3",
                volume: 0.6,
                loop: false
            },
            
            // UI sounds
            ui_button_click: {
                path: "assets/audio/sfx/ui_button_click.mp3",
                volume: 0.5,
                loop: false
            },
            ui_button_hover: {
                path: "assets/audio/sfx/ui_button_hover.mp3",
                volume: 0.3,
                loop: false
            },
            ui_menu_open: {
                path: "assets/audio/sfx/ui_menu_open.mp3",
                volume: 0.4,
                loop: false
            },
            ui_menu_close: {
                path: "assets/audio/sfx/ui_menu_close.mp3",
                volume: 0.4,
                loop: false
            },
            ui_score_update: {
                path: "assets/audio/sfx/ui_score_update.mp3",
                volume: 0.5,
                loop: false
            },
            ui_wave_complete: {
                path: "assets/audio/sfx/ui_wave_complete.mp3",
                volume: 0.6,
                loop: false
            },
            ui_player_join: {
                path: "assets/audio/sfx/ui_player_join.mp3",
                volume: 0.5,
                loop: false
            },
            ui_player_leave: {
                path: "assets/audio/sfx/ui_player_leave.mp3",
                volume: 0.5,
                loop: false
            }
        };
        
        // Ambient sounds
        this.ambientSounds = {
            cyberpunk_ambient: {
                path: "assets/audio/ambient/cyberpunk_ambient.mp3",
                volume: 0.3,
                loop: true
            },
            post_apocalyptic_ambient: {
                path: "assets/audio/ambient/post_apocalyptic_ambient.mp3",
                volume: 0.3,
                loop: true
            },
            industrial_ambient: {
                path: "assets/audio/ambient/industrial_ambient.mp3",
                volume: 0.3,
                loop: true
            },
            sewer_ambient: {
                path: "assets/audio/ambient/sewer_ambient.mp3",
                volume: 0.3,
                loop: true
            }
        };
        
        // Current ambient sounds
        this.currentAmbientSounds = {};
        
        // Initialize audio manager
        this.init();
    }
    
    /**
     * Initialize the audio manager
     */
    init() {
        // Create audio context
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            
            // Create music gain node
            this.musicGainNode = this.audioContext.createGain();
            this.musicGainNode.connect(this.masterGainNode);
            this.musicGainNode.gain.value = this.musicVolume;
            
            // Create SFX gain node
            this.sfxGainNode = this.audioContext.createGain();
            this.sfxGainNode.connect(this.masterGainNode);
            this.sfxGainNode.gain.value = this.sfxVolume;
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load all sounds
            this.loadAllSounds();
        } catch (error) {
            console.error("Failed to initialize audio context:", error);
            this.enabled = false;
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game state changes
        window.eventSystem.on('game:stateChanged', (newState, oldState) => {
            this.onGameStateChanged(newState, oldState);
        });
        
        // Listen for player events
        window.eventSystem.on('player:move', (player) => {
            this.onPlayerMove(player);
        });
        
        window.eventSystem.on('player:jump', (player) => {
            this.onPlayerJump(player);
        });
        
        window.eventSystem.on('player:land', (player) => {
            this.onPlayerLand(player);
        });
        
        window.eventSystem.on('player:damage', (player, damage, source) => {
            this.onPlayerDamage(player, damage, source);
        });
        
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        window.eventSystem.on('player:heal', (player, amount) => {
            this.onPlayerHeal(player, amount);
        });
        
        window.eventSystem.on('player:respawn', (player) => {
            this.onPlayerRespawn(player);
        });
        
        // Listen for weapon events
        window.eventSystem.on('weapon:fire', (player, weapon) => {
            this.onWeaponFire(player, weapon);
        });
        
        window.eventSystem.on('weapon:reload', (player, weapon) => {
            this.onWeaponReload(player, weapon);
        });
        
        window.eventSystem.on('weapon:stop', (player, weapon) => {
            this.onWeaponStop(player, weapon);
        });
        
        // Listen for enemy events
        window.eventSystem.on('enemy:move', (enemy) => {
            this.onEnemyMove(enemy);
        });
        
        window.eventSystem.on('enemy:attack', (enemy, target) => {
            this.onEnemyAttack(enemy, target);
        });
        
        window.eventSystem.on('enemy:damage', (enemy, damage, source) => {
            this.onEnemyDamage(enemy, damage, source);
        });
        
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for environment events
        window.eventSystem.on('environment:explosion', (x, y, radius) => {
            this.onEnvironmentExplosion(x, y, radius);
        });
        
        window.eventSystem.on('environment:debris', (x, y) => {
            this.onEnvironmentDebris(x, y);
        });
        
        window.eventSystem.on('environment:glassBreak', (x, y) => {
            this.onEnvironmentGlassBreak(x, y);
        });
        
        window.eventSystem.on('environment:hit', (x, y, material) => {
            this.onEnvironmentHit(x, y, material);
        });
        
        window.eventSystem.on('environment:doorOpen', (door) => {
            this.onEnvironmentDoorOpen(door);
        });
        
        window.eventSystem.on('environment:doorClose', (door) => {
            this.onEnvironmentDoorClose(door);
        });
        
        // Listen for power-up events
        window.eventSystem.on('powerup:collected', (player, powerup) => {
            this.onPowerupCollected(player, powerup);
        });
        
        // Listen for chaos meter events
        window.eventSystem.on('chaos:increase', (amount) => {
            this.onChaosIncrease(amount);
        });
        
        window.eventSystem.on('chaos:decrease', (amount) => {
            this.onChaosDecrease(amount);
        });
        
        // Listen for UI events
        window.eventSystem.on('ui:buttonClick', (button) => {
            this.onUIButtonClick(button);
        });
        
        window.eventSystem.on('ui:buttonHover', (button) => {
            this.onUIButtonHover(button);
        });
        
        window.eventSystem.on('ui:menuOpen', (menu) => {
            this.onUIMenuOpen(menu);
        });
        
        window.eventSystem.on('ui:menuClose', (menu) => {
            this.onUIMenuClose(menu);
        });
        
        window.eventSystem.on('ui:scoreUpdate', (score) => {
            this.onUIScoreUpdate(score);
        });
        
        window.eventSystem.on('ui:waveComplete', (waveNumber) => {
            this.onUIWaveComplete(waveNumber);
        });
        
        // Listen for player connection events
        window.eventSystem.on('player:join', (player) => {
            this.onPlayerJoin(player);
        });
        
        window.eventSystem.on('player:leave', (player) => {
            this.onPlayerLeave(player);
        });
        
        // Listen for audio settings changes
        window.eventSystem.on('settings:audioEnabled', (enabled) => {
            this.setEnabled(enabled);
        });
        
        window.eventSystem.on('settings:musicEnabled', (enabled) => {
            this.setMusicEnabled(enabled);
        });
        
        window.eventSystem.on('settings:sfxEnabled', (enabled) => {
            this.setSFXEnabled(enabled);
        });
        
        window.eventSystem.on('settings:musicVolume', (volume) => {
            this.setMusicVolume(volume);
        });
        
        window.eventSystem.on('settings:sfxVolume', (volume) => {
            this.setSFXVolume(volume);
        });
    }
    
    /**
     * Load all sounds
     */
    loadAllSounds() {
        // Count total sounds
        this.totalSounds = Object.keys(this.soundEffects).length;
        
        // Load sound effects
        for (const [key, sound] of Object.entries(this.soundEffects)) {
            this.loadSound(key, sound.path, sound);
        }
        
        // Load ambient sounds
        for (const [key, sound] of Object.entries(this.ambientSounds)) {
            this.loadSound(key, sound.path, sound, true);
        }
    }
    
    /**
     * Load a sound
     * @param {string} key - Sound key
     * @param {string} path - Sound file path
     * @param {object} soundData - Sound data
     * @param {boolean} isAmbient - Whether this is an ambient sound
     */
    loadSound(key, path, soundData, isAmbient = false) {
        fetch(path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                this.audioContext.decodeAudioData(arrayBuffer)
                    .then(audioBuffer => {
                        if (isAmbient) {
                            this.ambientSounds[key].buffer = audioBuffer;
                        } else {
                            this.sounds[key] = {
                                buffer: audioBuffer,
                                volume: soundData.volume || 1.0,
                                loop: soundData.loop || false
                            };
                        }
                        
                        this.loadedSounds++;
                        
                        // Check if all sounds are loaded
                        if (this.loadedSounds === this.totalSounds + Object.keys(this.ambientSounds).length) {
                            window.eventSystem.emit('audio:allSoundsLoaded');
                        }
                    })
                    .catch(error => {
                        console.error(`Failed to decode audio data for ${key}:`, error);
                    });
            })
            .catch(error => {
                console.error(`Failed to load sound ${key}:`, error);
            });
    }
    
    /**
     * Play a sound effect
     * @param {string} key - Sound key
     * @param {object} options - Playback options
     * @returns {AudioBufferSourceNode} The audio source node
     */
    playSound(key, options = {}) {
        if (!this.enabled || !this.sfxEnabled || !this.sounds[key]) {
            return null;
        }
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Create source node
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[key].buffer;
        source.loop = options.loop !== undefined ? options.loop : this.sounds[key].loop;
        
        // Create gain node for volume control
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = (options.volume !== undefined ? options.volume : this.sounds[key].volume) * this.sfxVolume;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(this.sfxGainNode);
        
        // Set playback rate
        if (options.playbackRate !== undefined) {
            source.playbackRate.value = options.playbackRate;
        }
        
        // Play the sound
        source.start(0);
        
        // Return the source node
        return source;
    }
    
    /**
     * Play a sound at a specific position
     * @param {string} key - Sound key
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {object} options - Playback options
     * @returns {AudioBufferSourceNode} The audio source node
     */
    playSoundAtPosition(key, x, y, options = {}) {
        if (!this.enabled || !this.sfxEnabled || !this.sounds[key]) {
            return null;
        }
        
        // Get player position
        const player = this.gameEngine.getLocalPlayer();
        if (!player) {
            return this.playSound(key, options);
        }
        
        // Calculate distance
        const playerX = player.position.x;
        const playerY = player.position.y;
        const distance = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
        
        // Calculate volume based on distance
        const maxDistance = options.maxDistance || 1000;
        const volume = Math.max(0, 1 - (distance / maxDistance));
        
        // Play the sound with calculated volume
        return this.playSound(key, {
            ...options,
            volume: volume
        });
    }
    
    /**
     * Play music
     * @param {string} key - Music key
     * @param {object} options - Playback options
     */
    playMusic(key, options = {}) {
        if (!this.enabled || !this.musicEnabled || !this.musicTracks[key]) {
            return;
        }
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Stop current music if playing
        this.stopMusic();
        
        // Set current music
        this.currentMusic = key;
        this.musicLoop = options.loop !== undefined ? options.loop : this.musicTracks[key].loop;
        
        // Load and play music
        fetch(this.musicTracks[key].path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                this.audioContext.decodeAudioData(arrayBuffer)
                    .then(audioBuffer => {
                        // Create source node
                        this.musicSource = this.audioContext.createBufferSource();
                        this.musicSource.buffer = audioBuffer;
                        this.musicSource.loop = this.musicLoop;
                        
                        // Connect to music gain node
                        this.musicSource.connect(this.musicGainNode);
                        
                        // Set playback rate
                        if (options.playbackRate !== undefined) {
                            this.musicSource.playbackRate.value = options.playbackRate;
                        }
                        
                        // Play the music
                        this.musicStartTime = this.audioContext.currentTime;
                        this.musicSource.start(0);
                        
                        // Set up loop callback
                        if (this.musicLoop) {
                            this.musicSource.onended = () => {
                                if (this.currentMusic === key) {
                                    this.playMusic(key, options);
                                }
                            };
                        }
                    })
                    .catch(error => {
                        console.error(`Failed to decode music data for ${key}:`, error);
                    });
            })
            .catch(error => {
                console.error(`Failed to load music ${key}:`, error);
            });
    }
    
    /**
     * Stop current music
     */
    stopMusic() {
        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource = null;
            this.currentMusic = null;
            this.musicStartTime = 0;
            this.musicPausedAt = 0;
        }
    }
    
    /**
     * Pause current music
     */
    pauseMusic() {
        if (this.musicSource && this.currentMusic) {
            this.musicPausedAt = this.audioContext.currentTime - this.musicStartTime;
            this.musicSource.stop();
            this.musicSource = null;
        }
    }
    
    /**
     * Resume current music
     */
    resumeMusic() {
        if (this.currentMusic && this.musicPausedAt > 0) {
            this.playMusic(this.currentMusic, {
                startTime: this.musicPausedAt
            });
            this.musicPausedAt = 0;
        }
    }
    
    /**
     * Play ambient sound
     * @param {string} key - Ambient sound key
     * @param {object} options - Playback options
     * @returns {AudioBufferSourceNode} The audio source node
     */
    playAmbientSound(key, options = {}) {
        if (!this.enabled || !this.musicEnabled || !this.ambientSounds[key] || !this.ambientSounds[key].buffer) {
            return null;
        }
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Stop existing ambient sound if already playing
        if (this.currentAmbientSounds[key]) {
            this.currentAmbientSounds[key].stop();
        }
        
        // Create source node
        const source = this.audioContext.createBufferSource();
        source.buffer = this.ambientSounds[key].buffer;
        source.loop = options.loop !== undefined ? options.loop : this.ambientSounds[key].loop;
        
        // Create gain node for volume control
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = (options.volume !== undefined ? options.volume : this.ambientSounds[key].volume) * this.musicVolume;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(this.musicGainNode);
        
        // Set playback rate
        if (options.playbackRate !== undefined) {
            source.playbackRate.value = options.playbackRate;
        }
        
        // Play the sound
        source.start(0);
        
        // Store reference
        this.currentAmbientSounds[key] = source;
        
        // Set up loop callback
        if (source.loop) {
            source.onended = () => {
                if (this.currentAmbientSounds[key] === source) {
                    this.playAmbientSound(key, options);
                }
            };
        }
        
        // Return the source node
        return source;
    }
    
    /**
     * Stop ambient sound
     * @param {string} key - Ambient sound key
     */
    stopAmbientSound(key) {
        if (this.currentAmbientSounds[key]) {
            this.currentAmbientSounds[key].stop();
            delete this.currentAmbientSounds[key];
        }
    }
    
    /**
     * Stop all ambient sounds
     */
    stopAllAmbientSounds() {
        for (const key in this.currentAmbientSounds) {
            this.stopAmbientSound(key);
        }
    }
    
    /**
     * Set audio enabled
     * @param {boolean} enabled - Whether audio is enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.stopMusic();
            this.stopAllAmbientSounds();
        }
    }
    
    /**
     * Set music enabled
     * @param {boolean} enabled - Whether music is enabled
     */
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        
        if (!enabled) {
            this.stopMusic();
            this.stopAllAmbientSounds();
        }
    }
    
    /**
     * Set SFX enabled
     * @param {boolean} enabled - Whether SFX is enabled
     */
    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
    }
    
    /**
     * Set music volume
     * @param {number} volume - Music volume (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.musicVolume;
        }
    }
    
    /**
     * Set SFX volume
     * @param {number} volume - SFX volume (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = this.sfxVolume;
        }
    }
    
    /**
     * Handle game state change
     * @param {string} newState - New game state
     * @param {string} oldState - Old game state
     */
    onGameStateChanged(newState, oldState) {
        switch (newState) {
            case 'menu':
                this.playMusic('main_menu');
                this.stopAllAmbientSounds();
                break;
            case 'intro':
                this.playMusic('game_intro');
                this.stopAllAmbientSounds();
                break;
            case 'playing':
                this.playMusic('gameplay_normal');
                break;
            case 'paused':
                this.pauseMusic();
                break;
            case 'gameOver':
                this.playMusic('game_over');
                this.stopAllAmbientSounds();
                break;
            case 'victory':
                this.playMusic('victory');
                this.stopAllAmbientSounds();
                break;
            case 'credits':
                this.playMusic('credits');
                this.stopAllAmbientSounds();
                break;
        }
        
        // Resume music if unpausing
        if (oldState === 'paused' && newState === 'playing') {
            this.resumeMusic();
        }
    }
    
    /**
     * Handle player move
     * @param {Player} player - Player that moved
     */
    onPlayerMove(player) {
        // Play footstep sound
        if (player.isGrounded && Math.abs(player.velocity.x) > 0.1) {
            this.playSound('player_move', {
                volume: 0.3 * (Math.abs(player.velocity.x) / player.maxSpeed)
            });
        }
    }
    
    /**
     * Handle player jump
     * @param {Player} player - Player that jumped
     */
    onPlayerJump(player) {
        this.playSound('player_jump');
    }
    
    /**
     * Handle player land
     * @param {Player} player - Player that landed
     */
    onPlayerLand(player) {
        this.playSound('player_land', {
            volume: Math.min(1, Math.abs(player.velocity.y) / 10)
        });
    }
    
    /**
     * Handle player damage
     * @param {Player} player - Player that was damaged
     * @param {number} damage - Amount of damage
     * @param {Entity} source - Source of damage
     */
    onPlayerDamage(player, damage, source) {
        this.playSound('player_damage');
    }
    
    /**
     * Handle player death
     * @param {Player} player - Player that died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        this.playSoundAtPosition('player_death', player.position.x, player.position.y);
    }
    
    /**
     * Handle player heal
     * @param {Player} player - Player that was healed
     * @param {number} amount - Amount healed
     */
    onPlayerHeal(player, amount) {
        this.playSound('player_heal');
    }
    
    /**
     * Handle player respawn
     * @param {Player} player - Player that respawned
     */
    onPlayerRespawn(player) {
        this.playSound('player_respawn');
    }
    
    /**
     * Handle weapon fire
     * @param {Player} player - Player that fired weapon
     * @param {Weapon} weapon - Weapon that was fired
     */
    onWeaponFire(player, weapon) {
        // Play weapon fire sound based on weapon type
        switch (weapon.type) {
            case 'pistol':
                this.playSound('weapon_pistol_fire');
                break;
            case 'smg':
                this.playSound('weapon_smg_fire');
                break;
            case 'shotgun':
                this.playSound('weapon_shotgun_fire');
                break;
            case 'rifle':
                this.playSound('weapon_rifle_fire');
                break;
            case 'plasma_rifle':
                this.playSound('weapon_plasma_fire');
                break;
            case 'flamethrower':
                this.playSound('weapon_flamethrower_fire', { loop: true });
                break;
            case 'rocket_launcher':
                this.playSound('weapon_rocket_fire');
                break;
        }
    }
    
    /**
     * Handle weapon reload
     * @param {Player} player - Player that reloaded weapon
     * @param {Weapon} weapon - Weapon that was reloaded
     */
    onWeaponReload(player, weapon) {
        // Play weapon reload sound based on weapon type
        switch (weapon.type) {
            case 'pistol':
                this.playSound('weapon_pistol_reload');
                break;
            case 'smg':
                this.playSound('weapon_smg_reload');
                break;
            case 'shotgun':
                this.playSound('weapon_shotgun_reload');
                break;
            case 'rifle':
                this.playSound('weapon_rifle_reload');
                break;
            case 'plasma_rifle':
                this.playSound('weapon_plasma_reload');
                break;
            case 'rocket_launcher':
                this.playSound('weapon_rocket_reload');
                break;
        }
    }
    
    /**
     * Handle weapon stop
     * @param {Player} player - Player that stopped weapon
     * @param {Weapon} weapon - Weapon that was stopped
     */
    onWeaponStop(player, weapon) {
        // Play weapon stop sound for looping weapons
        if (weapon.type === 'flamethrower') {
            this.playSound('weapon_flamethrower_stop');
        }
    }
    
    /**
     * Handle enemy move
     * @param {Enemy} enemy - Enemy that moved
     */
    onEnemyMove(enemy) {
        // Play enemy move sound based on enemy type
        switch (enemy.type) {
            case 'grunt':
                if (Math.random() < 0.1) {
                    this.playSoundAtPosition('enemy_grunt_move', enemy.position.x, enemy.position.y);
                }
                break;
            case 'bruiser':
                if (Math.random() < 0.05) {
                    this.playSoundAtPosition('enemy_bruiser_move', enemy.position.x, enemy.position.y);
                }
                break;
        }
    }
    
    /**
     * Handle enemy attack
     * @param {Enemy} enemy - Enemy that attacked
     * @param {Entity} target - Target of attack
     */
    onEnemyAttack(enemy, target) {
        // Play enemy attack sound based on enemy type
        switch (enemy.type) {
            case 'grunt':
                this.playSoundAtPosition('enemy_grunt_attack', enemy.position.x, enemy.position.y);
                break;
            case 'spitter':
                this.playSoundAtPosition('enemy_spitter_attack', enemy.position.x, enemy.position.y);
                break;
            case 'bruiser':
                this.playSoundAtPosition('enemy_bruiser_attack', enemy.position.x, enemy.position.y);
                break;
            case 'boss':
                this.playSoundAtPosition('enemy_boss_attack', enemy.position.x, enemy.position.y);
                break;
        }
    }
    
    /**
     * Handle enemy damage
     * @param {Enemy} enemy - Enemy that was damaged
     * @param {number} damage - Amount of damage
     * @param {Entity} source - Source of damage
     */
    onEnemyDamage(enemy, damage, source) {
        // Play enemy damage sound based on enemy type
        switch (enemy.type) {
            case 'grunt':
                this.playSoundAtPosition('enemy_grunt_damage', enemy.position.x, enemy.position.y);
                break;
            case 'spitter':
                this.playSoundAtPosition('enemy_spitter_damage', enemy.position.x, enemy.position.y);
                break;
            case 'bruiser':
                this.playSoundAtPosition('enemy_bruiser_damage', enemy.position.x, enemy.position.y);
                break;
            case 'boss':
                this.playSoundAtPosition('enemy_boss_damage', enemy.position.x, enemy.position.y);
                break;
        }
    }
    
    /**
     * Handle enemy death
     * @param {Enemy} enemy - Enemy that died
     * @param {Entity} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Play enemy death sound based on enemy type
        switch (enemy.type) {
            case 'grunt':
                this.playSoundAtPosition('enemy_grunt_death', enemy.position.x, enemy.position.y);
                break;
            case 'spitter':
                this.playSoundAtPosition('enemy_spitter_death', enemy.position.x, enemy.position.y);
                break;
            case 'bruiser':
                this.playSoundAtPosition('enemy_bruiser_death', enemy.position.x, enemy.position.y);
                break;
            case 'boss':
                this.playSoundAtPosition('enemy_boss_death', enemy.position.x, enemy.position.y);
                break;
        }
    }
    
    /**
     * Handle environment explosion
     * @param {number} x - X position of explosion
     * @param {number} y - Y position of explosion
     * @param {number} radius - Explosion radius
     */
    onEnvironmentExplosion(x, y, radius) {
        this.playSoundAtPosition('env_explosion', x, y, {
            volume: 0.8,
            maxDistance: 2000
        });
    }
    
    /**
     * Handle environment debris
     * @param {number} x - X position of debris
     * @param {number} y - Y position of debris
     */
    onEnvironmentDebris(x, y) {
        this.playSoundAtPosition('env_debris', x, y, {
            volume: 0.6,
            maxDistance: 1000
        });
    }
    
    /**
     * Handle environment glass break
     * @param {number} x - X position of glass break
     * @param {number} y - Y position of glass break
     */
    onEnvironmentGlassBreak(x, y) {
        this.playSoundAtPosition('env_glass_break', x, y, {
            volume: 0.7,
            maxDistance: 800
        });
    }
    
    /**
     * Handle environment hit
     * @param {number} x - X position of hit
     * @param {number} y - Y position of hit
     * @param {string} material - Material that was hit
     */
    onEnvironmentHit(x, y, material) {
        // Play different sound based on material
        switch (material) {
            case 'metal':
                this.playSoundAtPosition('env_metal_hit', x, y, {
                    volume: 0.6,
                    maxDistance: 600
                });
                break;
            case 'concrete':
            case 'brick':
            default:
                this.playSoundAtPosition('env_concrete_hit', x, y, {
                    volume: 0.5,
                    maxDistance: 600
                });
                break;
        }
    }
    
    /**
     * Handle environment door open
     * @param {Door} door - Door that opened
     */
    onEnvironmentDoorOpen(door) {
        this.playSoundAtPosition('env_door_open', door.position.x, door.position.y, {
            volume: 0.5,
            maxDistance: 800
        });
    }
    
    /**
     * Handle environment door close
     * @param {Door} door - Door that closed
     */
    onEnvironmentDoorClose(door) {
        this.playSoundAtPosition('env_door_close', door.position.x, door.position.y, {
            volume: 0.5,
            maxDistance: 800
        });
    }
    
    /**
     * Handle power-up collected
     * @param {Player} player - Player that collected power-up
     * @param {PowerUp} powerup - Power-up that was collected
     */
    onPowerupCollected(player, powerup) {
        this.playSoundAtPosition('env_powerup', powerup.position.x, powerup.position.y, {
            volume: 0.6,
            maxDistance: 1000
        });
    }
    
    /**
     * Handle chaos increase
     * @param {number} amount - Amount of chaos increase
     */
    onChaosIncrease(amount) {
        this.playSound('env_chaos_increase');
        
        // Switch to chaos music if chaos is high enough
        const chaosMeter = this.gameEngine.getSystem('chaosMeter');
        if (chaosMeter && chaosMeter.getChaosLevel() > 0.7 && this.currentMusic !== 'gameplay_chaos') {
            this.playMusic('gameplay_chaos');
        }
    }
    
    /**
     * Handle chaos decrease
     * @param {number} amount - Amount of chaos decrease
     */
    onChaosDecrease(amount) {
        this.playSound('env_chaos_decrease');
        
        // Switch back to normal music if chaos is low enough
        const chaosMeter = this.gameEngine.getSystem('chaosMeter');
        if (chaosMeter && chaosMeter.getChaosLevel() < 0.3 && this.currentMusic === 'gameplay_chaos') {
            this.playMusic('gameplay_normal');
        }
    }
    
    /**
     * Handle UI button click
     * @param {Button} button - Button that was clicked
     */
    onUIButtonClick(button) {
        this.playSound('ui_button_click');
    }
    
    /**
     * Handle UI button hover
     * @param {Button} button - Button that was hovered
     */
    onUIButtonHover(button) {
        this.playSound('ui_button_hover');
    }
    
    /**
     * Handle UI menu open
     * @param {Menu} menu - Menu that was opened
     */
    onUIMenuOpen(menu) {
        this.playSound('ui_menu_open');
    }
    
    /**
     * Handle UI menu close
     * @param {Menu} menu - Menu that was closed
     */
    onUIMenuClose(menu) {
        this.playSound('ui_menu_close');
    }
    
    /**
     * Handle UI score update
     * @param {number} score - New score
     */
    onUIScoreUpdate(score) {
        this.playSound('ui_score_update');
    }
    
    /**
     * Handle UI wave complete
     * @param {number} waveNumber - Wave number that was completed
     */
    onUIWaveComplete(waveNumber) {
        this.playSound('ui_wave_complete');
    }
    
    /**
     * Handle player join
     * @param {Player} player - Player that joined
     */
    onPlayerJoin(player) {
        this.playSound('ui_player_join');
    }
    
    /**
     * Handle player leave
     * @param {Player} player - Player that left
     */
    onPlayerLeave(player) {
        this.playSound('ui_player_leave');
    }
    
    /**
     * Set ambient sound for tileset
     * @param {string} tileset - Tileset name
     */
    setAmbientForTileset(tileset) {
        // Stop all current ambient sounds
        this.stopAllAmbientSounds();
        
        // Play ambient sound based on tileset
        switch (tileset) {
            case 'cyberpunk':
                this.playAmbientSound('cyberpunk_ambient');
                break;
            case 'post_apocalyptic':
                this.playAmbientSound('post_apocalyptic_ambient');
                break;
            case 'industrial':
                this.playAmbientSound('industrial_ambient');
                break;
            case 'sewer':
                this.playAmbientSound('sewer_ambient');
                break;
        }
    }
    
    /**
     * Update the audio manager
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the audio manager
     */
    destroy() {
        // Stop all sounds
        this.stopMusic();
        this.stopAllAmbientSounds();
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}