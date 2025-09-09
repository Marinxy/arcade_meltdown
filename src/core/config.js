/**
 * Arcade Meltdown - Configuration System
 * Manages game configuration settings
 */

class Config {
    /**
     * Create a new configuration system
     */
    constructor() {
        // Default configuration
        this.defaults = {
            // Graphics settings
            graphics: {
                canvasWidth: 1280,
                canvasHeight: 720,
                vsync: true,
                quality: 'high',
                particles: true,
                shadows: true
            },
            
            // Audio settings
            audio: {
                masterVolume: 0.8,
                musicVolume: 0.7,
                sfxVolume: 0.8,
                soundpack: 'default'
            },
            
            // Gameplay settings
            game: {
                difficulty: 'normal',
                friendlyFire: false,
                autoReload: true,
                aimAssist: false,
                preparationPhaseTime: 10000, // 10 seconds
                aftermathTime: 5000, // 5 seconds
                waveCombatTime: 120000, // 2 minutes
                waveScaling: 1.2,
                chaosDecayRate: 0.1 // Chaos decay per second
            },
            
            // Control settings
            controls: {
                // Default control bindings
                moveUp: 'KeyW',
                moveDown: 'KeyS',
                moveLeft: 'KeyA',
                moveRight: 'KeyD',
                primaryFire: 'Mouse0',
                secondaryFire: 'Mouse2',
                reload: 'KeyR',
                weapon1: 'Digit1',
                weapon2: 'Digit2',
                weapon3: 'Digit3',
                weapon4: 'Digit4',
                weapon5: 'Digit5',
                powerup1: 'KeyQ',
                powerup2: 'KeyE',
                pause: 'Escape'
            }
        };
        
        // Current configuration
        this.config = JSON.parse(JSON.stringify(this.defaults));
        
        // Load saved configuration
        this.load();
    }
    
    /**
     * Initialize the configuration system
     */
    init() {
        // Nothing to initialize here
    }
    
    /**
     * Get a configuration value
     * @param {string} path - Configuration path (e.g., 'graphics.canvasWidth')
     * @returns {*} Configuration value
     */
    get(path) {
        const keys = path.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value[key] === undefined) {
                // Try to get from defaults
                let defaultValue = this.defaults;
                for (const defaultKey of keys) {
                    if (defaultValue[defaultKey] === undefined) {
                        return undefined;
                    }
                    defaultValue = defaultValue[defaultKey];
                }
                return defaultValue;
            }
            value = value[key];
        }
        
        return value;
    }
    
    /**
     * Set a configuration value
     * @param {string} path - Configuration path (e.g., 'graphics.canvasWidth')
     * @param {*} value - Configuration value
     */
    set(path, value) {
        const keys = path.split('.');
        let config = this.config;
        
        // Navigate to the parent of the target key
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (config[key] === undefined) {
                config[key] = {};
            }
            config = config[key];
        }
        
        // Set the value
        const lastKey = keys[keys.length - 1];
        config[lastKey] = value;
        
        // Emit config change event
        if (window.eventSystem) {
            window.eventSystem.emit('config:change', { path, value });
        }
    }
    
    /**
     * Load configuration from local storage
     */
    load() {
        try {
            const saved = localStorage.getItem('arcademeltdown_config');
            if (saved) {
                const savedConfig = JSON.parse(saved);
                
                // Merge saved configuration with defaults
                this.mergeConfig(this.config, savedConfig);
            }
        } catch (error) {
            console.error('Failed to load configuration:', error);
        }
    }
    
    /**
     * Save configuration to local storage
     */
    save() {
        try {
            localStorage.setItem('arcademeltdown_config', JSON.stringify(this.config));
        } catch (error) {
            console.error('Failed to save configuration:', error);
        }
    }
    
    /**
     * Reset configuration to defaults
     */
    reset() {
        this.config = JSON.parse(JSON.stringify(this.defaults));
        this.save();
    }
    
    /**
     * Merge configuration objects
     * @param {object} target - Target configuration
     * @param {object} source - Source configuration
     */
    mergeConfig(target, source) {
        for (const key in source) {
            if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (target[key] === undefined) {
                    target[key] = {};
                }
                this.mergeConfig(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    
    /**
     * Get the entire configuration object
     * @returns {object} Configuration object
     */
    getAll() {
        return JSON.parse(JSON.stringify(this.config));
    }
    
    /**
     * Set the entire configuration object
     * @param {object} config - Configuration object
     */
    setAll(config) {
        this.config = JSON.parse(JSON.stringify(config));
        this.save();
    }
    
    /**
     * Destroy the configuration system
     */
    destroy() {
        // Save configuration before destroying
        this.save();
    }
}

// Export for use in modules
export default Config;