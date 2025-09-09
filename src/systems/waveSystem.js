/**
 * Arcade Meltdown - Wave System
 * Handles wave spawning and management
 */

class WaveSystem {
    /**
     * Create a new Wave System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Wave configuration
        this.waveConfig = window.config.get('waves');
        
        // Wave state
        this.currentWave = 1;
        this.waveState = 'preparation'; // preparation, combat, aftermath
        this.waveTimer = 0;
        this.enemiesRemaining = 0;
        this.enemiesSpawned = 0;
        this.totalEnemies = 0;
        
        // Enemy spawning
        this.spawnQueue = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1; // seconds between spawns
        this.maxConcurrentEnemies = 20;
        
        // Wave modifiers
        this.modifiers = {
            enemyHealth: 1,
            enemySpeed: 1,
            enemyDamage: 1,
            enemyCount: 1
        };
        
        // Special events
        this.specialEvents = [];
        this.activeSpecialEvent = null;
        
        // Performance metrics
        this.metrics = {
            enemiesSpawned: 0,
            enemiesKilled: 0,
            totalTime: 0,
            updateTime: 0
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the wave system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Load wave configuration
        this.loadWaveConfiguration();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for enemy events
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            this.onConfigChange(event);
        });
    }
    
    /**
     * Load wave configuration
     */
    loadWaveConfiguration() {
        this.waveConfig = window.config.get('waves');
        
        // Load special events
        this.specialEvents = window.config.get('waves.specialEvents') || [];
    }
    
    /**
     * Start a new wave
     * @param {number} waveNumber - Wave number
     */
    startWave(waveNumber) {
        // Set wave number
        this.currentWave = waveNumber;
        
        // Reset wave state
        this.waveState = 'preparation';
        this.waveTimer = this.waveConfig.preparationTime;
        this.enemiesRemaining = 0;
        this.enemiesSpawned = 0;
        this.spawnQueue = [];
        this.spawnTimer = 0;
        this.activeSpecialEvent = null;
        
        // Calculate wave modifiers
        this.calculateWaveModifiers();
        
        // Generate enemy list
        this.generateEnemyList();
        
        // Set spawn interval based on wave
        this.spawnInterval = Math.max(0.2, 1 - (waveNumber * 0.05));
        
        // Set max concurrent enemies based on wave
        this.maxConcurrentEnemies = Math.min(50, 10 + waveNumber * 2);
        
        // Emit wave start event
        window.eventSystem.emit('wave:start', this.currentWave, this.totalEnemies);
    }
    
    /**
     * Calculate wave modifiers based on wave number
     */
    calculateWaveModifiers() {
        const baseModifiers = this.waveConfig.modifiers;
        const scalingFactor = this.waveConfig.scalingFactor;
        const waveScaling = Math.pow(scalingFactor, this.currentWave - 1);
        
        // Calculate modifiers
        this.modifiers.enemyHealth = 1 + (baseModifiers.healthPerWave * (this.currentWave - 1));
        this.modifiers.enemySpeed = 1 + (baseModifiers.speedPerWave * (this.currentWave - 1));
        this.modifiers.enemyDamage = 1 + (baseModifiers.damagePerWave * (this.currentWave - 1));
        this.modifiers.enemyCount = Math.floor(baseModifiers.baseEnemyCount * waveScaling);
    }
    
    /**
     * Generate enemy list for the wave
     */
    generateEnemyList() {
        // Get base enemy count
        let enemyCount = this.modifiers.enemyCount;
        
        // Determine enemy types based on wave
        const enemyTypes = ['grunt'];
        const enemyWeights = [1];
        
        // Add spitter enemies from wave 3
        if (this.currentWave >= 3) {
            enemyTypes.push('spitter');
            enemyWeights.push(0.3 + (this.currentWave - 3) * 0.05);
        }
        
        // Add bruiser enemies from wave 5
        if (this.currentWave >= 5) {
            enemyTypes.push('bruiser');
            enemyWeights.push(0.2 + (this.currentWave - 5) * 0.03);
        }
        
        // Adjust weights based on wave
        for (let i = 0; i < enemyWeights.length; i++) {
            enemyWeights[i] = Math.max(0.1, enemyWeights[i]);
        }
        
        // Normalize weights
        const totalWeight = enemyWeights.reduce((sum, weight) => sum + weight, 0);
        for (let i = 0; i < enemyWeights.length; i++) {
            enemyWeights[i] /= totalWeight;
        }
        
        // Generate enemy list
        this.spawnQueue = [];
        for (let i = 0; i < enemyCount; i++) {
            // Select enemy type based on weights
            const rand = Math.random();
            let cumulativeWeight = 0;
            let selectedType = enemyTypes[0];
            
            for (let j = 0; j < enemyTypes.length; j++) {
                cumulativeWeight += enemyWeights[j];
                if (rand <= cumulativeWeight) {
                    selectedType = enemyTypes[j];
                    break;
                }
            }
            
            // Add enemy to queue
            this.spawnQueue.push(selectedType);
        }
        
        // Add mini-boss every 5 waves
        if (this.currentWave % 5 === 0) {
            this.spawnQueue.push('miniBoss');
        }
        
        // Add boss every 10 waves
        if (this.currentWave % 10 === 0) {
            this.spawnQueue.push('boss');
        }
        
        // Set total enemies
        this.totalEnemies = this.spawnQueue.length;
        this.enemiesRemaining = this.totalEnemies;
    }
    
    /**
     * Update the wave system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Start performance measurement
        const startTime = performance.now();
        
        // Update based on wave state
        switch (this.waveState) {
            case 'preparation':
                this.updatePreparation(deltaTime);
                break;
                
            case 'combat':
                this.updateCombat(deltaTime);
                break;
                
            case 'aftermath':
                this.updateAftermath(deltaTime);
                break;
        }
        
        // Update special events
        this.updateSpecialEvents(deltaTime);
        
        // End performance measurement
        const endTime = performance.now();
        this.metrics.updateTime = endTime - startTime;
        
        // Emit wave metrics event
        window.eventSystem.emit('wave:metrics', this.metrics);
    }
    
    /**
     * Update preparation phase
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updatePreparation(deltaTime) {
        // Update timer
        this.waveTimer -= deltaTime;
        
        // Check if preparation phase is over
        if (this.waveTimer <= 0) {
            // Start combat phase
            this.waveState = 'combat';
            this.waveTimer = this.waveConfig.combatTime;
            
            // Emit combat start event
            window.eventSystem.emit('wave:combatStart', this.currentWave);
        }
    }
    
    /**
     * Update combat phase
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateCombat(deltaTime) {
        // Update timer
        this.waveTimer -= deltaTime;
        
        // Spawn enemies
        this.spawnEnemies(deltaTime);
        
        // Check if all enemies have been spawned and defeated
        if (this.spawnQueue.length === 0 && this.enemiesRemaining <= 0) {
            // Start aftermath phase
            this.waveState = 'aftermath';
            this.waveTimer = this.waveConfig.aftermathTime;
            
            // Emit wave complete event
            window.eventSystem.emit('wave:complete', this.currentWave, this.gameEngine.score);
        }
        
        // Check if combat time is up
        if (this.waveTimer <= 0 && this.spawnQueue.length > 0) {
            // Spawn remaining enemies immediately
            while (this.spawnQueue.length > 0) {
                this.spawnEnemy();
            }
        }
    }
    
    /**
     * Update aftermath phase
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateAftermath(deltaTime) {
        // Update timer
        this.waveTimer -= deltaTime;
        
        // Check if aftermath phase is over
        if (this.waveTimer <= 0) {
            // Start next wave
            this.startWave(this.currentWave + 1);
        }
    }
    
    /**
     * Spawn enemies
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    spawnEnemies(deltaTime) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Check if it's time to spawn an enemy
        if (this.spawnTimer >= this.spawnInterval && this.spawnQueue.length > 0) {
            // Check if we can spawn more enemies
            const currentEnemyCount = this.gameEngine.getEntitiesByTag('enemy').length;
            
            if (currentEnemyCount < this.maxConcurrentEnemies) {
                // Spawn enemy
                this.spawnEnemy();
                
                // Reset spawn timer
                this.spawnTimer = 0;
            }
        }
    }
    
    /**
     * Spawn a single enemy
     */
    spawnEnemy() {
        if (this.spawnQueue.length === 0) return;
        
        // Get enemy type
        const enemyType = this.spawnQueue.shift();
        
        // Calculate spawn position
        const spawnPosition = this.calculateSpawnPosition();
        
        // Import Enemy class (circular dependency workaround)
        const Enemy = require('../entities/enemy.js').default || window.Enemy;
        
        // Create enemy entity
        const enemy = new Enemy(
            spawnPosition.x,
            spawnPosition.y,
            enemyType,
            this.currentWave
        );
        
        // Apply wave modifiers to enemy
        this.applyWaveModifiers(enemy);
        
        // Add enemy to game engine
        this.gameEngine.addEntity(enemy);
        
        // Update metrics
        this.metrics.enemiesSpawned++;
        this.enemiesSpawned++;
        
        // Emit enemy spawned event
        window.eventSystem.emit('wave:enemySpawned', enemy);
    }
    
    /**
     * Calculate spawn position
     * @returns {object} Spawn position {x, y}
     */
    calculateSpawnPosition() {
        // Random spawn position at the edge of the arena
        const side = Math.floor(Math.random() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
        let x, y;
        
        // Add some randomness to the spawn position
        const margin = 50;
        const randomRange = 100;
        
        switch (side) {
            case 0: // Top
                x = margin + Math.random() * (this.gameEngine.arena.width - margin * 2);
                y = margin;
                break;
            case 1: // Right
                x = this.gameEngine.arena.width - margin;
                y = margin + Math.random() * (this.gameEngine.arena.height - margin * 2);
                break;
            case 2: // Bottom
                x = margin + Math.random() * (this.gameEngine.arena.width - margin * 2);
                y = this.gameEngine.arena.height - margin;
                break;
            case 3: // Left
                x = margin;
                y = margin + Math.random() * (this.gameEngine.arena.height - margin * 2);
                break;
        }
        
        return { x, y };
    }
    
    /**
     * Apply wave modifiers to enemy
     * @param {Enemy} enemy - Enemy to modify
     */
    applyWaveModifiers(enemy) {
        // Get health component
        const health = enemy.getComponent('Health');
        if (health) {
            // Apply health modifier
            const baseHealth = health.maxHealth;
            health.setMaxHealth(Math.floor(baseHealth * this.modifiers.enemyHealth));
            health.heal(health.maxHealth);
        }
        
        // Get physics component
        const physics = enemy.getComponent('Physics');
        if (physics) {
            // Apply speed modifier
            physics.maxSpeed *= this.modifiers.enemySpeed;
        }
        
        // Apply damage modifier
        enemy.damage = Math.floor(enemy.damage * this.modifiers.enemyDamage);
    }
    
    /**
     * Update special events
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateSpecialEvents(deltaTime) {
        // Check for special events based on wave number
        if (this.waveState === 'combat' && !this.activeSpecialEvent) {
            for (const event of this.specialEvents) {
                if (event.wave === this.currentWave) {
                    // Activate special event
                    this.activateSpecialEvent(event);
                    break;
                }
            }
        }
        
        // Update active special event
        if (this.activeSpecialEvent) {
            this.updateActiveSpecialEvent(deltaTime);
        }
    }
    
    /**
     * Activate a special event
     * @param {object} event - Special event
     */
    activateSpecialEvent(event) {
        this.activeSpecialEvent = {
            ...event,
            timer: 0,
            activated: true
        };
        
        // Emit special event activated
        window.eventSystem.emit('wave:specialEventActivated', event);
        
        // Apply special event effects
        switch (event.type) {
            case 'enemySurge':
                // Increase spawn rate temporarily
                this.spawnInterval *= 0.5;
                break;
                
            case 'bossRush':
                // Spawn additional mini-bosses
                for (let i = 0; i < event.count; i++) {
                    this.spawnQueue.push('miniBoss');
                    this.totalEnemies++;
                    this.enemiesRemaining++;
                }
                break;
                
            case 'chaosStorm':
                // Increase chaos level
                window.eventSystem.emit('chaos:increase', 0.5);
                break;
        }
    }
    
    /**
     * Update active special event
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateActiveSpecialEvent(deltaTime) {
        if (!this.activeSpecialEvent) return;
        
        // Update timer
        this.activeSpecialEvent.timer += deltaTime;
        
        // Check if event is over
        if (this.activeSpecialEvent.timer >= this.activeSpecialEvent.duration) {
            // Deactivate special event
            this.deactivateSpecialEvent();
        }
    }
    
    /**
     * Deactivate active special event
     */
    deactivateSpecialEvent() {
        if (!this.activeSpecialEvent) return;
        
        // Restore normal settings
        switch (this.activeSpecialEvent.type) {
            case 'enemySurge':
                // Restore normal spawn rate
                this.spawnInterval = Math.max(0.2, 1 - (this.currentWave * 0.05));
                break;
        }
        
        // Emit special event deactivated
        window.eventSystem.emit('wave:specialEventDeactivated', this.activeSpecialEvent);
        
        // Clear active special event
        this.activeSpecialEvent = null;
    }
    
    /**
     * Handle enemy death
     * @param {Enemy} enemy - Enemy that died
     * @param {object} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Update metrics
        this.metrics.enemiesKilled++;
        
        // Decrease enemies remaining
        this.enemiesRemaining--;
        
        // Emit enemy death event
        window.eventSystem.emit('wave:enemyDeath', enemy, this.enemiesRemaining);
    }
    
    /**
     * Handle game start
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameStart(gameEngine) {
        // Start first wave
        this.startWave(1);
        
        // Reset metrics
        this.metrics.enemiesSpawned = 0;
        this.metrics.enemiesKilled = 0;
        this.metrics.totalTime = 0;
    }
    
    /**
     * Handle config changes
     * @param {object} event - Config change event
     */
    onConfigChange(event) {
        const { path, value } = event;
        
        // Update wave configuration if it changed
        if (path.startsWith('waves.')) {
            this.loadWaveConfiguration();
        }
    }
    
    /**
     * Get wave information
     * @returns {object} Wave information
     */
    getWaveInfo() {
        return {
            currentWave: this.currentWave,
            waveState: this.waveState,
            waveTimer: this.waveTimer,
            enemiesRemaining: this.enemiesRemaining,
            enemiesSpawned: this.enemiesSpawned,
            totalEnemies: this.totalEnemies,
            modifiers: { ...this.modifiers },
            activeSpecialEvent: this.activeSpecialEvent ? { ...this.activeSpecialEvent } : null
        };
    }
    
    /**
     * Get wave metrics
     * @returns {object} Wave metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    
    /**
     * Destroy the wave system
     */
    destroy() {
        // Clear spawn queue
        this.spawnQueue.length = 0;
        
        // Clear active special event
        this.activeSpecialEvent = null;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaveSystem;
}