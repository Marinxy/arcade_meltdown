/**
 * Arcade Meltdown - Configuration Manager
 * Manages game settings and provides a centralized way to access configuration values
 */

class ConfigManager {
    constructor() {
        this.config = {
            game: {
                maxPlayers: 8,
                waveScaling: 1.2,
                chaosDecayRate: 0.05,
                respawnTime: 3000,
                friendlyFire: true,
                matchLength: 900000, // 15 minutes in milliseconds
                preparationPhaseTime: 10000, // 10 seconds
                waveCombatTime: 60000, // 60 seconds
                aftermathTime: 20000 // 20 seconds
            },
            graphics: {
                targetFPS: 60,
                particleLimit: 1000,
                effectQuality: 'high',
                screenShakeIntensity: 1.0,
                enableBloom: true,
                enableScanlines: true,
                canvasWidth: 1200,
                canvasHeight: 800
            },
            audio: {
                masterVolume: 1.0,
                musicVolume: 0.8,
                sfxVolume: 1.0,
                spatialAudio: true,
                dynamicMusic: true,
                bpm: 170
            },
            controls: {
                mouseSensitivity: 1.0,
                keyBindings: {
                    moveUp: 'KeyW',
                    moveDown: 'KeyS',
                    moveLeft: 'KeyA',
                    moveRight: 'KeyD',
                    special: 'Space',
                    reload: 'KeyR',
                    interact: 'KeyE'
                }
            },
            network: {
                maxLatency: 100,
                interpolationDelay: 100,
                predictionEnabled: true,
                syncRate: 20 // updates per second
            },
            player: {
                classes: {
                    heavy: {
                        health: 150,
                        speed: 120,
                        weapon: 'flamethrower',
                        specialCooldown: 5000
                    },
                    scout: {
                        health: 80,
                        speed: 300,
                        weapon: 'smg',
                        specialCooldown: 3000
                    },
                    engineer: {
                        health: 120,
                        speed: 160,
                        weapon: 'shotgun',
                        specialCooldown: 4000
                    },
                    medic: {
                        health: 80,
                        speed: 180,
                        weapon: 'healBeam',
                        specialCooldown: 6000
                    }
                }
            },
            weapons: {
                shotgun: {
                    damage: 40,
                    pellets: 5,
                    range: 200,
                    fireRate: 800,
                    spread: 45
                },
                smg: {
                    damage: 20,
                    range: 400,
                    fireRate: 150,
                    spread: 15
                },
                plasmaRifle: {
                    damage: 35,
                    range: 600,
                    fireRate: 300,
                    penetration: 3
                },
                flamethrower: {
                    damage: 15,
                    range: 250,
                    fireRate: 100,
                    coneAngle: 30
                },
                rocketLauncher: {
                    damage: 80,
                    splashDamage: 40,
                    range: 500,
                    fireRate: 1500,
                    splashRadius: 100
                },
                healBeam: {
                    healing: 25,
                    range: 300,
                    continuous: true
                }
            },
            enemies: {
                grunt: {
                    health: 30,
                    speed: 80,
                    damage: 10,
                    points: 10
                },
                spitter: {
                    health: 25,
                    speed: 100,
                    damage: 15,
                    points: 15
                },
                bruiser: {
                    health: 80,
                    speed: 60,
                    damage: 25,
                    points: 30
                },
                miniBoss: {
                    health: 200,
                    speed: 40,
                    damage: 35,
                    points: 100
                },
                boss: {
                    health: 500,
                    speed: 50,
                    damage: 40,
                    points: 500
                }
            },
            chaos: {
                maxLevel: 1.0,
                thresholds: {
                    low: 0.25,
                    medium: 0.5,
                    high: 0.75,
                    extreme: 0.9
                },
                decayRate: 0.05,
                playerKillBonus: 0.1,
                explosionBonus: 0.05,
                bossDamageBonus: 0.2
            }
        };
        
        // Load any saved settings from localStorage
        this.loadFromStorage();
    }
    
    /**
     * Get a configuration value by path
     * @param {string} path - Dot notation path to config value (e.g., 'game.maxPlayers')
     * @returns {any} The configuration value
     */
    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }
    
    /**
     * Set a configuration value by path
     * @param {string} path - Dot notation path to config value
     * @param {any} value - The value to set
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.config);
        target[lastKey] = value;
        
        // Save to localStorage
        this.saveToStorage();
        
        // Emit change event if event system is available
        if (window.eventSystem) {
            window.eventSystem.emit('config:change', { path, value });
        }
    }
    
    /**
     * Check if a configuration path exists
     * @param {string} path - Dot notation path to check
     * @returns {boolean} True if the path exists
     */
    has(path) {
        try {
            return this.get(path) !== undefined;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Delete a configuration value by path
     * @param {string} path - Dot notation path to delete
     */
    delete(path) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.config);
        
        if (target && target.hasOwnProperty(lastKey)) {
            delete target[lastKey];
            this.saveToStorage();
        }
    }
    
    /**
     * Save configuration to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('arcadeMeltdownConfig', JSON.stringify(this.config));
        } catch (e) {
            console.error('Failed to save configuration to localStorage:', e);
        }
    }
    
    /**
     * Load configuration from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('arcadeMeltdownConfig');
            if (stored) {
                const parsedConfig = JSON.parse(stored);
                // Merge with default config to ensure all properties exist
                this.config = this.mergeDeep(this.config, parsedConfig);
            }
        } catch (e) {
            console.error('Failed to load configuration from localStorage:', e);
        }
    }
    
    /**
     * Deep merge two objects
     * @param {object} target - Target object
     * @param {object} source - Source object
     * @returns {object} Merged object
     */
    mergeDeep(target, source) {
        if (typeof target !== 'object' || target === null) {
            return source;
        }
        
        const output = Object.assign({}, target);
        
        if (typeof source === 'object' && source !== null) {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object' && source[key] !== null) {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    } else {
                        output[key] = source[key];
                    }
                }
            }
        }
        
        return output;
    }
    
    /**
     * Reset configuration to default values
     */
    reset() {
        // Get a fresh copy of the default config
        const defaultConfig = new ConfigManager().config;
        this.config = defaultConfig;
        this.saveToStorage();
        
        // Emit reset event if event system is available
        if (window.eventSystem) {
            window.eventSystem.emit('config:reset');
        }
    }
}

// Create a global instance of the config manager
window.config = new ConfigManager();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}