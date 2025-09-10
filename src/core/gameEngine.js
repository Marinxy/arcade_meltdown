/**
 * Arcade Meltdown - Game Engine
 * Core game engine that manages the game state, entities, and systems
 */

import GameLoop from './gameLoop.js';
import AudioSystem from '../systems/audioSystem.js';
import CosmeticSystem from '../systems/cosmeticSystem.js';
import CommunityMapSystem from '../systems/communityMapSystem.js';
import ExpansionSoundtrackSystem from '../systems/expansionSoundtrackSystem.js';
import InputSystem from '../systems/inputSystem.js';
import RenderSystem from '../systems/renderSystem.js';
import PhysicsSystem from '../systems/physicsSystem.js';
import CollisionSystem from '../systems/collisionSystem.js';

class GameEngine {
    /**
     * Create a new Game Engine
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    constructor(canvas, ctx) {
        // Canvas and rendering context
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Game loop
        this.gameLoop = new GameLoop(this);
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.wave = 1;
        this.score = 0;
        this.chaosLevel = 0;
        
        // Entity management
        this.entities = new Map();
        this.nextEntityId = 1;
        
        // Systems
        this.systems = [];
        
        // Player
        this.player = null;
        this.playerClass = null;
        
        // Arena
        this.arena = {
            width: canvas.width,
            height: canvas.height,
            tileSize: 40,
            tiles: []
        };
        
        // Wave management
        this.waveState = 'preparation'; // preparation, combat, aftermath
        this.waveTimer = 0;
        this.enemiesRemaining = 0;
        this.waveEnemies = [];
        this.spawnTimer = 0;
        
        // Initialize the engine
        this.init();
    }
    
    /**
     * Initialize the game engine
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize systems
        this.initSystems();
        
        // Initialize arena
        this.initArena();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game events
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        window.eventSystem.on('chaos:increase', (amount) => {
            this.increaseChaos(amount);
        });
        
        window.eventSystem.on('enemy:findTarget', (enemy) => {
            this.findTargetForEnemy(enemy);
        });
        
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            this.onConfigChange(event);
        });
    }
    
    /**
     * Initialize systems
     */
    initSystems() {
        // Input system
        this.inputSystem = new InputSystem(this);
        
        // Physics system
        this.physicsSystem = new PhysicsSystem(this);
        
        // Collision system
        this.collisionSystem = new CollisionSystem(this);
        
        // Render system
        this.renderSystem = new RenderSystem(this);
        
        // Audio system
        this.audioSystem = new AudioSystem(this);
        
        // Cosmetic system
        this.cosmeticSystem = new CosmeticSystem(this);
        
        // Community map system
        this.communityMapSystem = new CommunityMapSystem(this);
        
        // Expansion soundtrack system
        this.expansionSoundtrackSystem = new ExpansionSoundtrackSystem(this);
        
        // Add systems to the list
        this.systems.push(
            this.inputSystem,
            this.physicsSystem,
            this.collisionSystem,
            this.renderSystem,
            this.audioSystem,
            this.cosmeticSystem,
            this.communityMapSystem,
            this.expansionSoundtrackSystem
        );
        
        // Initialize all systems
        for (const system of this.systems) {
            system.init();
        }
    }
    
    /**
     * Initialize the arena
     */
    initArena() {
        // Create a simple empty arena for now
        const tilesX = Math.ceil(this.arena.width / this.arena.tileSize);
        const tilesY = Math.ceil(this.arena.height / this.arena.tileSize);
        
        this.arena.tiles = [];
        for (let y = 0; y < tilesY; y++) {
            this.arena.tiles[y] = [];
            for (let x = 0; x < tilesX; x++) {
                // 0 = empty, 1 = wall
                this.arena.tiles[y][x] = 0;
            }
        }
        
        // Add border walls
        for (let x = 0; x < tilesX; x++) {
            this.arena.tiles[0][x] = 1;
            this.arena.tiles[tilesY - 1][x] = 1;
        }
        for (let y = 0; y < tilesY; y++) {
            this.arena.tiles[y][0] = 1;
            this.arena.tiles[y][tilesX - 1] = 1;
        }
    }
    
    /**
     * Start the game engine
     */
    start() {
        // Start the game loop
        this.gameLoop.start();
    }
    
    /**
     * Stop the game engine
     */
    stop() {
        // Stop the game loop
        this.gameLoop.stop();
        
        // Destroy all systems
        for (const system of this.systems) {
            system.destroy();
        }
        
        // Destroy all entities
        for (const [id, entity] of this.entities) {
            entity.destroy();
        }
        this.entities.clear();
    }
    
    /**
     * Start a new game with the selected player class
     * @param {string} playerClass - The selected player class
     */
    startGame(playerClass) {
        // Reset game state
        this.gameState = 'playing';
        this.wave = 1;
        this.score = 0;
        this.chaosLevel = 0;
        this.playerClass = playerClass;
        this.waveState = 'preparation';
        this.waveTimer = window.config.get('game.preparationPhaseTime') / 1000 || 10; // Convert to seconds
        this.spawnTimer = 0;
        
        // Clear existing entities
        for (const [id, entity] of this.entities) {
            entity.destroy();
        }
        this.entities.clear();
        
        // Create player
        this.createPlayer(playerClass);
        
        // Start the first wave
        this.startWave();
        
        // Emit game start event
        window.eventSystem.emit('game:start', this);
    }
    
    /**
     * Create a player entity
     * @param {string} playerClass - The player class
     */
    createPlayer(playerClass) {
        // Create player at the center of the arena
        const x = this.arena.width / 2;
        const y = this.arena.height / 2;
        
        // Import Player class dynamically
        import('../entities/player.js').then(({ default: Player }) => {
            // Create player entity
            this.player = new Player(x, y, playerClass);
            this.player.gameEngine = this;
            
            // Add player to entities
            this.addEntity(this.player);
            
            // Emit player created event
            window.eventSystem.emit('player:created', this.player);
        }).catch(error => {
            console.error('Failed to create player:', error);
        });
    }
    
    /**
     * Start a new wave
     */
    startWave() {
        this.waveState = 'preparation';
        this.waveTimer = window.config.get('game.preparationPhaseTime') / 1000 || 10; // Convert to seconds
        
        // Calculate number of enemies based on wave
        const baseEnemyCount = 5;
        const enemyCount = Math.floor(baseEnemyCount * Math.pow(window.config.get('game.waveScaling') || 1.2, this.wave - 1));
        
        // Create enemy list
        this.waveEnemies = [];
        this.enemiesRemaining = enemyCount;
        
        // Determine enemy types based on wave
        const enemyTypes = ['grunt'];
        if (this.wave >= 3) enemyTypes.push('spitter');
        if (this.wave >= 5) enemyTypes.push('bruiser');
        
        // Add mini-boss every 5 waves
        if (this.wave % 5 === 0) {
            enemyTypes.push('miniBoss');
            this.enemiesRemaining++;
        }
        
        // Add boss every 10 waves
        if (this.wave % 10 === 0) {
            enemyTypes.push('boss');
            this.enemiesRemaining++;
        }
        
        // Generate enemy list
        for (let i = 0; i < enemyCount; i++) {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.waveEnemies.push(type);
        }
        
        // Emit wave start event
        window.eventSystem.emit('wave:start', this.wave, this.enemiesRemaining);
    }
    
    /**
     * Continue to the next wave
     */
    continueToNextWave() {
        this.wave++;
        this.startWave();
    }
    
    /**
     * Update the game engine
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update based on game state
        switch (this.gameState) {
            case 'playing':
                this.updateGame(deltaTime);
                break;
                
            case 'paused':
                // Don't update when paused
                break;
                
            case 'menu':
            case 'gameOver':
                // Minimal update for menu/game over state
                this.updateMenu(deltaTime);
                break;
        }
        
        // Update all systems
        for (const system of this.systems) {
            system.update(deltaTime);
        }
        
        // Update all entities
        for (const [id, entity] of this.entities) {
            if (entity.isActive()) {
                entity.update(deltaTime);
            }
        }
        
        // Clean up destroyed entities
        this.cleanupEntities();
    }
    
    /**
     * Update the game when in playing state
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateGame(deltaTime) {
        // Update wave state
        this.updateWaveState(deltaTime);
        
        // Update chaos level
        this.updateChaosLevel(deltaTime);
        
        // Spawn enemies during combat phase
        if (this.waveState === 'combat' && this.waveEnemies.length > 0) {
            this.spawnEnemies(deltaTime);
        }
        
        // Check win condition
        const currentEnemyCount = this.getEntitiesByTag('enemy').length;
        if (this.waveState === 'combat' && this.enemiesRemaining <= 0 && this.waveEnemies.length === 0 && currentEnemyCount === 0) {
            this.waveState = 'aftermath';
            this.waveTimer = window.config.get('game.aftermathTime') / 1000 || 5; // Convert to seconds
            
            // Show scoreboard
            window.eventSystem.emit('wave:complete', this.wave, this.score);
        }
        
        // Update HUD
        this.updateHUD();
    }
    
    /**
     * Update the wave state
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateWaveState(deltaTime) {
        this.waveTimer -= deltaTime;
        
        if (this.waveTimer <= 0) {
            switch (this.waveState) {
                case 'preparation':
                    this.waveState = 'combat';
                    this.waveTimer = window.config.get('game.waveCombatTime') / 1000 || 120; // Convert to seconds
                    window.eventSystem.emit('wave:combatStart', this.wave);
                    break;
                    
                case 'combat':
                    // Wave timer expired, spawn remaining enemies immediately
                    while (this.waveEnemies.length > 0) {
                        this.spawnEnemy();
                    }
                    break;
                    
                case 'aftermath':
                    // Move to next wave
                    this.continueToNextWave();
                    break;
            }
        }
    }
    
    /**
     * Update the chaos level
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateChaosLevel(deltaTime) {
        // Decay chaos level over time
        const decayRate = window.config.get('game.chaosDecayRate') || 0.1;
        this.chaosLevel = Math.max(0, this.chaosLevel - decayRate * deltaTime);
        
        // Emit chaos level update event
        window.eventSystem.emit('chaos:update', this.chaosLevel);
    }
    
    /**
     * Spawn enemies during combat phase
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    spawnEnemies(deltaTime) {
        // Spawn enemies at a rate based on wave number
        const spawnRate = Math.max(0.5, 2 - (this.wave * 0.1)); // Enemies per second
        const spawnInterval = 1 / spawnRate;
        
        // Simple spawn timer (in a real implementation, this would be more sophisticated)
        this.spawnTimer += deltaTime;
        
        if (this.spawnTimer >= spawnInterval && this.waveEnemies.length > 0) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }
    }
    
    /**
     * Spawn a single enemy
     */
    spawnEnemy() {
        if (this.waveEnemies.length === 0) return;
        
        // Get enemy type
        const enemyType = this.waveEnemies.shift();
        
        // Random spawn position at the edge of the arena
        const side = Math.floor(Math.random() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
        let x, y;
        
        switch (side) {
            case 0: // Top
                x = Math.random() * this.arena.width;
                y = 50;
                break;
            case 1: // Right
                x = this.arena.width - 50;
                y = Math.random() * this.arena.height;
                break;
            case 2: // Bottom
                x = Math.random() * this.arena.width;
                y = this.arena.height - 50;
                break;
            case 3: // Left
                x = 50;
                y = Math.random() * this.arena.height;
                break;
        }
        
        // Import Enemy class dynamically
        import('../entities/enemy.js').then(({ default: Enemy }) => {
            // Create enemy entity
            const enemy = new Enemy(x, y, enemyType, this.wave);
            enemy.gameEngine = this;
            
            // Add enemy to entities
            this.addEntity(enemy);
            
            // Emit enemy spawned event
            window.eventSystem.emit('enemy:spawned', enemy);
            
            // Check if it's a boss and emit boss spawn event
            if (enemyType === 'boss' || enemyType === 'miniBoss') {
                window.eventSystem.emit('boss:spawn', enemy);
            }
        }).catch(error => {
            console.error('Failed to create enemy:', error);
        });
    }
    
    /**
     * Update the menu/game over state
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateMenu(deltaTime) {
        // Minimal update for menu/game over state
        // This could be used for menu animations, etc.
    }
    
    /**
     * Render the game
     * @param {number} alpha - Interpolation factor (0-1)
     */
    render(alpha) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render based on game state
        switch (this.gameState) {
            case 'playing':
            case 'paused':
                this.renderGame(alpha);
                break;
                
            case 'menu':
            case 'gameOver':
                this.renderMenu(alpha);
                break;
        }
        
        // Render all systems
        for (const system of this.systems) {
            if (typeof system.render === 'function') {
                system.render(alpha);
            }
        }
    }
    
    /**
     * Render the game when in playing state
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderGame(alpha) {
        // Render arena
        this.renderArena();
        
        // Render all entities
        for (const [id, entity] of this.entities) {
            if (entity.isActive()) {
                entity.render(this.ctx);
            }
        }
    }
    
    /**
     * Render the arena
     */
    renderArena() {
        const tileSize = this.arena.tileSize;
        
        // Render tiles
        for (let y = 0; y < this.arena.tiles.length; y++) {
            for (let x = 0; x < this.arena.tiles[y].length; x++) {
                const tile = this.arena.tiles[y][x];
                
                if (tile === 1) {
                    // Wall tile
                    this.ctx.fillStyle = '#444444';
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    
                    // Wall border
                    this.ctx.strokeStyle = '#666666';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }
    
    /**
     * Render the menu/game over state
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderMenu(alpha) {
        // The menu is rendered by HTML, so we don't need to do much here
        // This could be used for background effects, etc.
        
        // Clear with a dark background
        this.ctx.fillStyle = '#111111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Add an entity to the game
     * @param {Entity} entity - Entity to add
     * @returns {string} Entity ID
     */
    addEntity(entity) {
        if (!entity.id) {
            entity.id = `entity_${this.nextEntityId++}`;
        }
        entity.gameEngine = this;
        this.entities.set(entity.id, entity);
        return entity.id;
    }
    
    /**
     * Remove an entity from the game
     * @param {string} id - Entity ID
     */
    removeEntity(id) {
        const entity = this.entities.get(id);
        if (entity) {
            entity.destroy();
            this.entities.delete(id);
        }
    }
    
    /**
     * Get an entity by ID
     * @param {string} id - Entity ID
     * @returns {Entity|null} The entity or null if not found
     */
    getEntity(id) {
        return this.entities.get(id) || null;
    }
    
    /**
     * Get all entities with a specific tag
     * @param {string} tag - Tag to search for
     * @returns {Array} Array of entities with the tag
     */
    getEntitiesByTag(tag) {
        const result = [];
        for (const [id, entity] of this.entities) {
            if (entity.hasTag(tag)) {
                result.push(entity);
            }
        }
        return result;
    }
    
    /**
     * Get all entities
     * @returns {Array} Array of all entities
     */
    getEntities() {
        return Array.from(this.entities.values());
    }
    
    /**
     * Get the local player
     * @returns {Player|null} The local player or null if not found
     */
    getLocalPlayer() {
        return this.player;
    }
    
    /**
     * Get a system by name
     * @param {string} name - System name
     * @returns {System|null} The system or null if not found
     */
    getSystem(name) {
        return this[name] || null;
    }
    
    /**
     * Clean up destroyed entities
     */
    cleanupEntities() {
        for (const [id, entity] of this.entities) {
            if (!entity.isActive()) {
                this.entities.delete(id);
            }
        }
    }
    
    /**
     * Handle player death
     * @param {Player} player - The player that died
     * @param {object} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Game over if all players are dead
        // For now, we'll just end the game
        this.gameState = 'gameOver';
        
        // Show game over screen
        if (window.showGameOver) {
            window.showGameOver();
        }
        
        // Emit game over event
        window.eventSystem.emit('game:over', this);
    }
    
    /**
     * Handle enemy death
     * @param {Enemy} enemy - The enemy that died
     * @param {object} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Decrease enemies remaining count
        this.enemiesRemaining--;
        
        // Add score
        this.score += enemy.points;
        
        // Check if it's a boss and emit boss defeated event
        if (enemy.enemyType === 'boss' || enemy.enemyType === 'miniBoss') {
            window.eventSystem.emit('boss:defeated', enemy);
        }
        
        // Emit enemy death event
        window.eventSystem.emit('enemy:death', enemy, source);
    }
    
    /**
     * Increase the chaos level
     * @param {number} amount - Amount to increase
     */
    increaseChaos(amount) {
        this.chaosLevel = Math.min(1, this.chaosLevel + amount);
    }
    
    /**
     * Find a target for an enemy
     * @param {Enemy} enemy - The enemy that needs a target
     */
    findTargetForEnemy(enemy) {
        // Find the nearest player
        let nearestPlayer = null;
        let nearestDistance = Infinity;
        
        for (const [id, entity] of this.entities) {
            if (entity.hasTag('player') && entity.isActive()) {
                const transform = entity.getComponent('Transform');
                const enemyTransform = enemy.getComponent('Transform');
                
                if (transform && enemyTransform) {
                    const distance = Math.sqrt(
                        Math.pow(transform.x - enemyTransform.x, 2) +
                        Math.pow(transform.y - enemyTransform.y, 2)
                    );
                    
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestPlayer = entity;
                    }
                }
            }
        }
        
        // Set the target
        enemy.target = nearestPlayer;
    }
    
    /**
     * Update HUD elements
     */
    updateHUD() {
        if (!this.player) return;
        
        // Get player components
        const health = this.player.getComponent('Health');
        const weapon = this.player.getComponent('Weapon');
        
        // Update health
        if (health) {
            const healthFill = document.querySelector('.health-fill');
            const healthValue = document.querySelector('.health-value');
            
            if (healthFill) {
                const healthPercent = (health.currentHealth / health.maxHealth) * 100;
                healthFill.style.width = `${Math.max(0, Math.min(100, healthPercent))}%`;
            }
            
            if (healthValue) {
                healthValue.textContent = `${Math.max(0, health.currentHealth)}/${health.maxHealth}`;
            }
        }
        
        // Update weapon
        if (weapon) {
            const weaponName = document.querySelector('.hud-weapon-name');
            const weaponAmmo = document.querySelector('.hud-weapon-ammo');
            
            if (weaponName) {
                weaponName.textContent = weapon.weaponType || 'Assault Rifle';
            }
            
            if (weaponAmmo) {
                weaponAmmo.textContent = weapon.getAmmoString();
            }
        }
        
        // Update wave
        const waveNumber = document.querySelector('#hud-wave-number');
        if (waveNumber) {
            waveNumber.textContent = this.wave;
        }
        
        // Update chaos
        const chaosValue = document.querySelector('#hud-chaos-value');
        if (chaosValue) {
            chaosValue.textContent = `${Math.round(this.chaosLevel * 100)}%`;
        }
        
        // Update score
        const scoreValue = document.querySelector('.score-value');
        if (scoreValue) {
            scoreValue.textContent = this.score;
        }
        
        // Update enemies
        const enemiesValue = document.querySelector('.enemies-value');
        if (enemiesValue) {
            enemiesValue.textContent = this.enemiesRemaining;
        }
    }
    
    /**
     * Handle config changes
     * @param {object} event - Config change event
     */
    onConfigChange(event) {
        const { path, value } = event;
        
        // Handle config changes that affect the game engine
        if (path === 'graphics.canvasWidth' || path === 'graphics.canvasHeight') {
            // Update canvas size
            this.canvas.width = window.config.get('graphics.canvasWidth');
            this.canvas.height = window.config.get('graphics.canvasHeight');
            this.arena.width = this.canvas.width;
            this.arena.height = this.canvas.height;
            
            // Reinitialize arena
            this.initArena();
        }
    }
}

// Export for use in modules
export default GameEngine;