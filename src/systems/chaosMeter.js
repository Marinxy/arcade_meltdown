/**
 * Arcade Meltdown - Chaos Meter System
 * Manages the chaos meter that increases as players deal damage and take damage
 */

class ChaosMeter {
    /**
     * Create a new Chaos Meter system
     * @param {GameEngine} gameEngine - Game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Chaos meter properties
        this.chaosLevel = 0; // Current chaos level (0-100)
        this.maxChaosLevel = 100;
        this.chaosDecayRate = 2; // Chaos decay per second
        this.chaosIncreaseMultiplier = 1; // Multiplier for chaos increase
        
        // Chaos tier properties
        this.chaosTiers = [
            { level: 0, name: "Calm", color: "#55ff55", effects: [] },
            { level: 25, name: "Unstable", color: "#ffff55", effects: ["enemySpeedIncrease"] },
            { level: 50, name: "Chaotic", color: "#ff9933", effects: ["enemySpeedIncrease", "enemySpawnRateIncrease"] },
            { level: 75, name: "Meltdown", color: "#ff3333", effects: ["enemySpeedIncrease", "enemySpawnRateIncrease", "enemyDamageIncrease"] },
            { level: 100, name: "Critical", color: "#ff00ff", effects: ["enemySpeedIncrease", "enemySpawnRateIncrease", "enemyDamageIncrease", "bossSpawn"] }
        ];
        
        // Current chaos tier
        this.currentTier = 0;
        
        // Visual effect properties
        this.screenShakeIntensity = 0;
        this.screenShakeDecay = 5;
        this.glitchIntensity = 0;
        this.glitchDecay = 3;
        this.colorShiftIntensity = 0;
        this.colorShiftDecay = 2;
        
        // Chaos event properties
        this.chaosEvents = [
            { name: "Enemy Swarm", chance: 0.3, minChaos: 30, execute: this.executeEnemySwarm.bind(this) },
            { name: "Power Surge", chance: 0.2, minChaos: 20, execute: this.executePowerSurge.bind(this) },
            { name: "Gravity Shift", chance: 0.15, minChaos: 40, execute: this.executeGravityShift.bind(this) },
            { name: "Time Warp", chance: 0.1, minChaos: 50, execute: this.executeTimeWarp.bind(this) },
            { name: "Dimensional Rift", chance: 0.05, minChaos: 70, execute: this.executeDimensionalRift.bind(this) }
        ];
        
        // Chaos event timer
        this.chaosEventTimer = 0;
        this.chaosEventInterval = 10; // seconds between potential chaos events
        
        // Initialize system
        this.init();
    }
    
    /**
     * Initialize the chaos meter system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Start chaos decay
        this.startChaosDecay();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for player damage events
        window.eventSystem.on('player:damageDealt', (player, damage, target) => {
            this.onPlayerDamageDealt(player, damage, target);
        });
        
        // Listen for player hurt events
        window.eventSystem.on('player:hurt', (player, damage, source) => {
            this.onPlayerHurt(player, damage, source);
        });
        
        // Listen for player death events
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        // Listen for enemy death events
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for wave complete events
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
        });
        
        // Listen for mini-boss death events
        window.eventSystem.on('miniBoss:death', (miniBoss, source) => {
            this.onMiniBossDeath(miniBoss, source);
        });
        
        // Listen for boss death events
        window.eventSystem.on('boss:death', (boss, source) => {
            this.onBossDeath(boss, source);
        });
    }
    
    /**
     * Start chaos decay
     */
    startChaosDecay() {
        // Set up interval for chaos decay
        setInterval(() => {
            this.decayChaos();
        }, 1000);
    }
    
    /**
     * Update the chaos meter system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update chaos event timer
        this.chaosEventTimer += deltaTime;
        
        // Check if should trigger chaos event
        if (this.chaosEventTimer >= this.chaosEventInterval) {
            this.chaosEventTimer = 0;
            this.tryTriggerChaosEvent();
        }
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
        
        // Update chaos tier
        this.updateChaosTier();
    }
    
    /**
     * Increase chaos level
     * @param {number} amount - Amount to increase chaos
     */
    increaseChaos(amount) {
        // Increase chaos level
        this.chaosLevel = Math.min(this.chaosLevel + amount * this.chaosIncreaseMultiplier, this.maxChaosLevel);
        
        // Apply visual effects
        this.applyChaosVisualEffects(amount);
        
        // Emit chaos increase event
        window.eventSystem.emit('chaos:increase', this.chaosLevel, amount);
    }
    
    /**
     * Decrease chaos level
     * @param {number} amount - Amount to decrease chaos
     */
    decreaseChaos(amount) {
        // Decrease chaos level
        this.chaosLevel = Math.max(this.chaosLevel - amount, 0);
        
        // Emit chaos decrease event
        window.eventSystem.emit('chaos:decrease', this.chaosLevel, amount);
    }
    
    /**
     * Decay chaos over time
     */
    decayChaos() {
        // Decrease chaos by decay rate
        this.decreaseChaos(this.chaosDecayRate);
    }
    
    /**
     * Apply chaos visual effects
     * @param {number} amount - Amount of chaos increase
     */
    applyChaosVisualEffects(amount) {
        // Increase screen shake intensity
        this.screenShakeIntensity = Math.min(this.screenShakeIntensity + amount * 0.1, 10);
        
        // Increase glitch intensity
        this.glitchIntensity = Math.min(this.glitchIntensity + amount * 0.05, 5);
        
        // Increase color shift intensity
        this.colorShiftIntensity = Math.min(this.colorShiftIntensity + amount * 0.03, 3);
    }
    
    /**
     * Update visual effects
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateVisualEffects(deltaTime) {
        // Update screen shake intensity
        if (this.screenShakeIntensity > 0) {
            this.screenShakeIntensity = Math.max(0, this.screenShakeIntensity - this.screenShakeDecay * deltaTime);
        }
        
        // Update glitch intensity
        if (this.glitchIntensity > 0) {
            this.glitchIntensity = Math.max(0, this.glitchIntensity - this.glitchDecay * deltaTime);
        }
        
        // Update color shift intensity
        if (this.colorShiftIntensity > 0) {
            this.colorShiftIntensity = Math.max(0, this.colorShiftIntensity - this.colorShiftDecay * deltaTime);
        }
    }
    
    /**
     * Update chaos tier
     */
    updateChaosTier() {
        // Find current tier based on chaos level
        let newTier = 0;
        for (let i = this.chaosTiers.length - 1; i >= 0; i--) {
            if (this.chaosLevel >= this.chaosTiers[i].level) {
                newTier = i;
                break;
            }
        }
        
        // Check if tier changed
        if (newTier !== this.currentTier) {
            const oldTier = this.currentTier;
            this.currentTier = newTier;
            
            // Apply tier effects
            this.applyTierEffects(this.chaosTiers[newTier]);
            
            // Emit tier change event
            window.eventSystem.emit('chaos:tierChange', 
                this.chaosTiers[newTier], 
                oldTier >= 0 ? this.chaosTiers[oldTier] : null
            );
        }
    }
    
    /**
     * Apply tier effects
     * @param {object} tier - Chaos tier
     */
    applyTierEffects(tier) {
        // Apply each effect in the tier
        for (const effect of tier.effects) {
            switch (effect) {
                case 'enemySpeedIncrease':
                    this.applyEnemySpeedIncrease();
                    break;
                    
                case 'enemySpawnRateIncrease':
                    this.applyEnemySpawnRateIncrease();
                    break;
                    
                case 'enemyDamageIncrease':
                    this.applyEnemyDamageIncrease();
                    break;
                    
                case 'bossSpawn':
                    this.spawnBoss();
                    break;
            }
        }
    }
    
    /**
     * Apply enemy speed increase
     */
    applyEnemySpeedIncrease() {
        // Get all enemies
        const enemies = this.gameEngine.getEntitiesByTag('enemy');
        
        // Increase speed of each enemy
        for (const enemy of enemies) {
            const physics = enemy.getComponent('Physics');
            if (physics) {
                physics.maxSpeed *= 1.2;
            }
        }
        
        // Emit effect applied event
        window.eventSystem.emit('chaos:effectApplied', 'enemySpeedIncrease');
    }
    
    /**
     * Apply enemy spawn rate increase
     */
    applyEnemySpawnRateIncrease() {
        // Get wave spawner system
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            // Increase spawn rate
            waveSpawner.spawnRateMultiplier *= 1.3;
        }
        
        // Emit effect applied event
        window.eventSystem.emit('chaos:effectApplied', 'enemySpawnRateIncrease');
    }
    
    /**
     * Apply enemy damage increase
     */
    applyEnemyDamageIncrease() {
        // Get all enemies
        const enemies = this.gameEngine.getEntitiesByTag('enemy');
        
        // Increase damage of each enemy
        for (const enemy of enemies) {
            // This would need to be implemented based on how enemies deal damage
            // For now, we'll just emit an event
        }
        
        // Emit effect applied event
        window.eventSystem.emit('chaos:effectApplied', 'enemyDamageIncrease');
    }
    
    /**
     * Spawn boss
     */
    spawnBoss() {
        // Get wave spawner system
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            // Spawn boss
            waveSpawner.spawnBoss();
        }
        
        // Emit effect applied event
        window.eventSystem.emit('chaos:effectApplied', 'bossSpawn');
    }
    
    /**
     * Try to trigger a chaos event
     */
    tryTriggerChaosEvent() {
        // Filter events by chaos level
        const availableEvents = this.chaosEvents.filter(
            event => this.chaosLevel >= event.minChaos
        );
        
        // Check if there are available events
        if (availableEvents.length === 0) return;
        
        // Try to trigger each event
        for (const event of availableEvents) {
            // Check if event should trigger
            if (Math.random() < event.chance) {
                // Execute event
                event.execute();
                
                // Emit event triggered
                window.eventSystem.emit('chaos:eventTriggered', event.name);
                
                // Only trigger one event
                break;
            }
        }
    }
    
    /**
     * Execute enemy swarm chaos event
     */
    executeEnemySwarm() {
        // Get wave spawner system
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            // Spawn enemy swarm
            waveSpawner.spawnEnemySwarm();
        }
    }
    
    /**
     * Execute power surge chaos event
     */
    executePowerSurge() {
        // Get all players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        // Increase fire rate of each player
        for (const player of players) {
            const weapon = player.getComponent('Weapon');
            if (weapon) {
                weapon.fireRate *= 2;
                
                // Reset after 5 seconds
                setTimeout(() => {
                    weapon.fireRate /= 2;
                }, 5000);
            }
        }
    }
    
    /**
     * Execute gravity shift chaos event
     */
    executeGravityShift() {
        // Get all entities with physics
        const entities = this.gameEngine.getEntities();
        
        // Reverse gravity for each entity
        for (const entity of entities) {
            const physics = entity.getComponent('Physics');
            if (physics) {
                physics.gravity *= -1;
                
                // Reset after 5 seconds
                setTimeout(() => {
                    physics.gravity *= -1;
                }, 5000);
            }
        }
    }
    
    /**
     * Execute time warp chaos event
     */
    executeTimeWarp() {
        // Slow down time for enemies
        const enemies = this.gameEngine.getEntitiesByTag('enemy');
        
        for (const enemy of enemies) {
            const physics = enemy.getComponent('Physics');
            if (physics) {
                physics.maxSpeed *= 0.5;
                
                // Reset after 5 seconds
                setTimeout(() => {
                    physics.maxSpeed *= 2;
                }, 5000);
            }
        }
        
        // Speed up time for players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        for (const player of players) {
            const physics = player.getComponent('Physics');
            if (physics) {
                physics.maxSpeed *= 1.5;
                
                // Reset after 5 seconds
                setTimeout(() => {
                    physics.maxSpeed /= 1.5;
                }, 5000);
            }
        }
    }
    
    /**
     * Execute dimensional rift chaos event
     */
    executeDimensionalRift() {
        // Create visual effect
        this.screenShakeIntensity = 10;
        this.glitchIntensity = 5;
        this.colorShiftIntensity = 3;
        
        // Teleport all entities to random positions
        const entities = this.gameEngine.getEntities();
        
        for (const entity of entities) {
            // Skip if entity is player or has no transform
            if (entity.hasTag('player')) continue;
            
            const transform = entity.getComponent('Transform');
            if (!transform) continue;
            
            // Teleport to random position
            transform.x = Math.random() * this.gameEngine.arena.width;
            transform.y = Math.random() * this.gameEngine.arena.height;
        }
    }
    
    /**
     * Handle player damage dealt event
     * @param {Player} player - Player who dealt damage
     * @param {number} damage - Amount of damage dealt
     * @param {Entity} target - Target of damage
     */
    onPlayerDamageDealt(player, damage, target) {
        // Increase chaos based on damage
        this.increaseChaos(damage * 0.5);
    }
    
    /**
     * Handle player hurt event
     * @param {Player} player - Player who was hurt
     * @param {number} damage - Amount of damage taken
     * @param {Entity} source - Source of damage
     */
    onPlayerHurt(player, damage, source) {
        // Increase chaos based on damage
        this.increaseChaos(damage * 0.8);
    }
    
    /**
     * Handle player death event
     * @param {Player} player - Player who died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Increase chaos significantly
        this.increaseChaos(20);
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - Enemy that died
     * @param {Entity} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Decrease chaos slightly
        this.decreaseChaos(2);
    }
    
    /**
     * Handle wave complete event
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Decrease chaos based on wave number
        this.decreaseChaos(10 + waveNumber * 2);
    }
    
    /**
     * Handle mini-boss death event
     * @param {MiniBoss} miniBoss - Mini-boss that died
     * @param {Entity} source - Source of death
     */
    onMiniBossDeath(miniBoss, source) {
        // Decrease chaos significantly
        this.decreaseChaos(15);
    }
    
    /**
     * Handle boss death event
     * @param {Boss} boss - Boss that died
     * @param {Entity} source - Source of death
     */
    onBossDeath(boss, source) {
        // Decrease chaos very significantly
        this.decreaseChaos(30);
    }
    
    /**
     * Get chaos level
     * @returns {number} Current chaos level
     */
    getChaosLevel() {
        return this.chaosLevel;
    }
    
    /**
     * Get chaos percentage
     * @returns {number} Chaos percentage (0-1)
     */
    getChaosPercentage() {
        return this.chaosLevel / this.maxChaosLevel;
    }
    
    /**
     * Get current chaos tier
     * @returns {object} Current chaos tier
     */
    getCurrentChaosTier() {
        return this.chaosTiers[this.currentTier];
    }
    
    /**
     * Get screen shake intensity
     * @returns {number} Screen shake intensity
     */
    getScreenShakeIntensity() {
        return this.screenShakeIntensity;
    }
    
    /**
     * Get glitch intensity
     * @returns {number} Glitch intensity
     */
    getGlitchIntensity() {
        return this.glitchIntensity;
    }
    
    /**
     * Get color shift intensity
     * @returns {number} Color shift intensity
     */
    getColorShiftIntensity() {
        return this.colorShiftIntensity;
    }
    
    /**
     * Render the chaos meter
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        // Save context state
        ctx.save();
        
        // Draw chaos meter background
        const meterWidth = 200;
        const meterHeight = 20;
        const meterX = this.gameEngine.canvas.width - meterWidth - 20;
        const meterY = 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
        
        // Draw chaos meter fill
        const fillWidth = meterWidth * this.getChaosPercentage();
        const currentTier = this.getCurrentChaosTier();
        
        ctx.fillStyle = currentTier.color;
        ctx.fillRect(meterX, meterY, fillWidth, meterHeight);
        
        // Draw chaos meter border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
        
        // Draw chaos tier markers
        for (let i = 1; i < this.chaosTiers.length; i++) {
            const tier = this.chaosTiers[i];
            const markerX = meterX + meterWidth * (tier.level / this.maxChaosLevel);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(markerX, meterY);
            ctx.lineTo(markerX, meterY + meterHeight);
            ctx.stroke();
        }
        
        // Draw chaos meter label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CHAOS', meterX + meterWidth / 2, meterY - 5);
        
        // Draw chaos tier name
        ctx.fillStyle = currentTier.color;
        ctx.font = 'bold 12px Arial';
        ctx.fillText(currentTier.name, meterX + meterWidth / 2, meterY + meterHeight + 15);
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Destroy the chaos meter system
     */
    destroy() {
        // No specific cleanup needed
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChaosMeter;
}