/**
 * Arcade Meltdown - Render System
 * Handles rendering of entities and visual effects
 */

import AssetManager from '../assets/assetManager.js';

class RenderSystem {
    /**
     * Create a new Render System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Canvas and context
        this.canvas = gameEngine.canvas;
        this.ctx = gameEngine.ctx;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            zoom: 1,
            shake: {
                x: 0,
                y: 0,
                intensity: 0,
                duration: 0,
                decay: 0.9
            }
        };
        
        // Render layers
        this.layers = {
            background: 0,
            arena: 5,
            enemies: 10,
            players: 15,
            bullets: 20,
            particles: 25,
            effects: 30,
            ui: 100
        };
        
        // Visual effects
        this.effects = {
            screenFlash: {
                active: false,
                color: '#ffffff',
                alpha: 0,
                duration: 0,
                decay: 0.9
            },
            colorFilter: {
                active: false,
                color: '#ffffff',
                alpha: 0
            },
            glitch: {
                active: false,
                intensity: 0,
                duration: 0,
                decay: 0.95
            }
        };
        
        // Performance metrics
        this.metrics = {
            entitiesRendered: 0,
            renderTime: 0
        };
        
        // Asset manager
        this.assetManager = new AssetManager();
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the render system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up canvas
        this.setupCanvas();
        
        // Load visual settings from config
        this.loadVisualSettings();
        
        // Initialize asset manager
        this.assetManager.init();
        
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            this.onConfigChange(event);
        });
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for player events
        window.eventSystem.on('player:damage', (player, damage, source) => {
            this.onPlayerDamage(player, damage, source);
        });
        
        // Listen for bullet events
        window.eventSystem.on('bullet:hit', (bullet, entity, damage) => {
            this.onBulletHit(bullet, entity, damage);
        });
        
        window.eventSystem.on('bullet:explosion', (bullet, x, y, radius) => {
            this.onBulletExplosion(bullet, x, y, radius);
        });
        
        // Listen for enemy events
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for chaos events
        window.eventSystem.on('chaos:update', (chaosLevel) => {
            this.onChaosUpdate(chaosLevel);
        });
        
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        window.eventSystem.on('game:over', (gameEngine) => {
            this.onGameOver(gameEngine);
        });
    }
    
    /**
     * Set up canvas
     */
    setupCanvas() {
        // Set canvas size
        this.canvas.width = window.config.get('graphics.canvasWidth');
        this.canvas.height = window.config.get('graphics.canvasHeight');
        
        // Set camera size
        this.camera.width = this.canvas.width;
        this.camera.height = this.canvas.height;
        
        // Enable image smoothing
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    /**
     * Load visual settings from config
     */
    loadVisualSettings() {
        // Load visual settings from config
        const enableBloom = window.config.get('graphics.enableBloom');
        const enableScanlines = window.config.get('graphics.enableScanlines');
        const effectQuality = window.config.get('graphics.effectQuality');
        
        // Apply settings
        this.enableBloom = enableBloom;
        this.enableScanlines = enableScanlines;
        this.effectQuality = effectQuality;
    }
    
    /**
     * Update the render system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update camera
        this.updateCamera(deltaTime);
        
        // Update visual effects
        this.updateEffects(deltaTime);
    }
    
    /**
     * Update camera
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateCamera(deltaTime) {
        // Follow player if available
        if (this.gameEngine.player && this.gameEngine.gameState === 'playing') {
            const player = this.gameEngine.player;
            const transform = player.getComponent('Transform');
            
            if (transform) {
                // Target position is player position
                const targetX = transform.x - this.camera.width / 2;
                const targetY = transform.y - this.camera.height / 2;
                
                // Smooth camera movement
                this.camera.x += (targetX - this.camera.x) * 5 * deltaTime;
                this.camera.y += (targetY - this.camera.y) * 5 * deltaTime;
            }
        }
        
        // Update camera shake
        if (this.camera.shake.duration > 0) {
            this.camera.shake.duration -= deltaTime;
            
            if (this.camera.shake.duration <= 0) {
                this.camera.shake.intensity = 0;
                this.camera.shake.x = 0;
                this.camera.shake.y = 0;
            } else {
                // Apply random shake
                const shakeAmount = this.camera.shake.intensity * this.camera.shake.duration;
                this.camera.shake.x = (Math.random() - 0.5) * shakeAmount;
                this.camera.shake.y = (Math.random() - 0.5) * shakeAmount;
            }
        }
    }
    
    /**
     * Update visual effects
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateEffects(deltaTime) {
        // Update screen flash
        if (this.effects.screenFlash.active) {
            this.effects.screenFlash.duration -= deltaTime;
            
            if (this.effects.screenFlash.duration <= 0) {
                this.effects.screenFlash.active = false;
                this.effects.screenFlash.alpha = 0;
            } else {
                this.effects.screenFlash.alpha *= this.effects.screenFlash.decay;
            }
        }
        
        // Update glitch effect
        if (this.effects.glitch.active) {
            this.effects.glitch.duration -= deltaTime;
            
            if (this.effects.glitch.duration <= 0) {
                this.effects.glitch.active = false;
                this.effects.glitch.intensity = 0;
            } else {
                this.effects.glitch.intensity *= this.effects.glitch.decay;
            }
        }
    }
    
    /**
     * Render the game
     * @param {number} alpha - Interpolation factor (0-1)
     */
    render(alpha) {
        // Start performance measurement
        const startTime = performance.now();
        
        // Reset render metrics
        this.metrics.entitiesRendered = 0;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply camera transform
        this.applyCameraTransform();
        
        // Render arena
        this.renderArena();
        
        // Render entities by layer
        this.renderEntitiesByLayer(alpha);
        
        // Restore context state
        this.ctx.restore();
        
        // Apply post-processing effects
        this.applyPostProcessingEffects();
        
        // Render UI elements
        this.renderUI();
        
        // End performance measurement
        const endTime = performance.now();
        this.metrics.renderTime = endTime - startTime;
        
        // Emit render metrics event
        window.eventSystem.emit('render:metrics', this.metrics);
    }
    
    /**
     * Apply camera transform
     */
    applyCameraTransform() {
        // Apply camera position
        this.ctx.translate(-this.camera.x + this.camera.shake.x, -this.camera.y + this.camera.shake.y);
        
        // Apply camera zoom
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
    }
    
    /**
     * Render arena
     */
    renderArena() {
        const tileSize = this.gameEngine.arena.tileSize;
        
        // Fill arena background
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render tiles
        for (let y = 0; y < this.gameEngine.arena.tiles.length; y++) {
            for (let x = 0; x < this.gameEngine.arena.tiles[y].length; x++) {
                const tile = this.gameEngine.arena.tiles[y][x];
                
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
     * Render entities by layer
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderEntitiesByLayer(alpha) {
        // Get all entities
        const entities = Array.from(this.gameEngine.entities.values());
        
        // Filter active entities
        const activeEntities = entities.filter(entity => entity.isActive());
        
        // Sort entities by layer
        activeEntities.sort((a, b) => {
            const renderA = a.getComponent('Render');
            const renderB = b.getComponent('Render');
            
            const layerA = renderA ? renderA.layer : 0;
            const layerB = renderB ? renderB.layer : 0;
            
            return layerA - layerB;
        });
        
        // Render entities
        for (const entity of activeEntities) {
            this.renderEntity(entity, alpha);
            this.metrics.entitiesRendered++;
        }
    }
    
    /**
     * Render an entity
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderEntity(entity, alpha) {
        // Get components
        const transform = entity.getComponent('Transform');
        const render = entity.getComponent('Render');
        const physics = entity.getComponent('Physics');
        
        // Skip if no transform or render component
        if (!transform || !render) return;
        
        // Skip if not visible
        if (!render.visible) return;
        
        // Save context state
        this.ctx.save();
        
        // Apply transform
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.scale.x, transform.scale.y);
        
        // Apply render properties
        this.ctx.globalAlpha = render.opacity;
        
        // Apply blend mode
        if (render.blendMode) {
            this.ctx.globalCompositeOperation = render.blendMode;
        }
        
        // Apply flip
        if (render.flipX) {
            this.ctx.scale(-1, 1);
        }
        if (render.flipY) {
            this.ctx.scale(1, -1);
        }
        
        // Apply pivot
        if (render.pivot) {
            const pivotX = -render.pivot.x * (render.customRender ? 0 : 20); // Default size is 20
            const pivotY = -render.pivot.y * (render.customRender ? 0 : 20);
            this.ctx.translate(pivotX, pivotY);
        }
        
        // Apply rotation offset
        if (render.rotationOffset) {
            this.ctx.rotate(render.rotationOffset);
        }
        
        // Apply tint color
        if (render.tintColor) {
            this.ctx.globalCompositeOperation = 'source-atop';
            this.ctx.fillStyle = render.tintColor;
            this.ctx.fillRect(-10, -10, 20, 20);
            this.ctx.globalCompositeOperation = 'source-over';
        }
        
        // Custom render function if available
        if (render.customRender) {
            render.customRender(this.ctx, entity, alpha);
        } else {
            // Default rendering based on entity type
            this.renderEntityDefault(entity, transform, render, physics);
        }
        
        // Restore context state
        this.ctx.restore();
    }
    
    /**
     * Render entity with default method
     * @param {Entity} entity - Entity to render
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderEntityDefault(entity, transform, render, physics) {
        // Render based on entity type
        if (entity.hasTag('player')) {
            this.renderPlayer(entity, transform, render, physics);
        } else if (entity.hasTag('enemy')) {
            this.renderEnemy(entity, transform, render, physics);
        } else if (entity.hasTag('bullet')) {
            this.renderBullet(entity, transform, render, physics);
        } else if (entity.hasTag('particle')) {
            this.renderParticle(entity, transform, render, physics);
        } else {
            // Default rendering
            this.ctx.fillStyle = render.color;
            this.ctx.fillRect(-10, -10, 20, 20);
        }
    }
    
    /**
     * Render player
     * @param {Entity} entity - Player entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderPlayer(entity, transform, render, physics) {
        // Get player class
        const player = entity;
        const playerClass = player.playerClass;
        
        // Render player based on class
        switch (playerClass) {
            case 'heavy':
                this.renderHeavyPlayer(entity, transform, render, physics);
                break;
            case 'scout':
                this.renderScoutPlayer(entity, transform, render, physics);
                break;
            case 'engineer':
                this.renderEngineerPlayer(entity, transform, render, physics);
                break;
            case 'medic':
                this.renderMedicPlayer(entity, transform, render, physics);
                break;
            default:
                // Default player rendering
                this.ctx.fillStyle = render.color;
                this.ctx.fillRect(-15, -15, 30, 30);
        }
    }
    
    /**
     * Render heavy player
     * @param {Entity} entity - Player entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderHeavyPlayer(entity, transform, render, physics) {
        // Render heavy player (larger, more armored)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-20, -20, 40, 40);
        
        // Render armor details
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(-20, -20, 40, 10);
        this.ctx.fillRect(-20, 10, 40, 10);
    }
    
    /**
     * Render scout player
     * @param {Entity} entity - Player entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderScoutPlayer(entity, transform, render, physics) {
        // Render scout player (smaller, sleeker)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(15, 15);
        this.ctx.lineTo(-15, 15);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * Render engineer player
     * @param {Entity} entity - Player entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderEngineerPlayer(entity, transform, render, physics) {
        // Render engineer player (medium, technical)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-15, -15, 30, 30);
        
        // Render tool belt
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(-15, -5, 30, 10);
    }
    
    /**
     * Render medic player
     * @param {Entity} entity - Player entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderMedicPlayer(entity, transform, render, physics) {
        // Render medic player (medium, medical cross)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-15, -15, 30, 30);
        
        // Render medical cross
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(-2, -15, 4, 30);
        this.ctx.fillRect(-15, -2, 30, 4);
    }
    
    /**
     * Render enemy
     * @param {Entity} entity - Enemy entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderEnemy(entity, transform, render, physics) {
        // Get enemy type
        const enemy = entity;
        const enemyType = enemy.enemyType;
        
        // Render enemy based on type
        switch (enemyType) {
            case 'grunt':
                this.renderGruntEnemy(entity, transform, render, physics);
                break;
            case 'spitter':
                this.renderSpitterEnemy(entity, transform, render, physics);
                break;
            case 'bruiser':
                this.renderBruiserEnemy(entity, transform, render, physics);
                break;
            case 'miniBoss':
                this.renderMiniBossEnemy(entity, transform, render, physics);
                break;
            case 'boss':
                this.renderBossEnemy(entity, transform, render, physics);
                break;
            default:
                // Default enemy rendering
                this.ctx.fillStyle = render.color;
                this.ctx.fillRect(-10, -10, 20, 20);
        }
    }
    
    /**
     * Render grunt enemy
     * @param {Entity} entity - Enemy entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderGruntEnemy(entity, transform, render, physics) {
        // Render grunt enemy (basic)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render spitter enemy
     * @param {Entity} entity - Enemy entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderSpitterEnemy(entity, transform, render, physics) {
        // Render spitter enemy (elongated)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 8, 15, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render bruiser enemy
     * @param {Entity} entity - Enemy entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderBruiserEnemy(entity, transform, render, physics) {
        // Render bruiser enemy (large, square)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-17, -17, 34, 34);
        
        // Render armor plates
        this.ctx.fillStyle = '#444444';
        this.ctx.fillRect(-17, -17, 34, 10);
        this.ctx.fillRect(-17, 7, 34, 10);
    }
    
    /**
     * Render mini-boss enemy
     * @param {Entity} entity - Enemy entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderMiniBossEnemy(entity, transform, render, physics) {
        // Render mini-boss enemy (large, detailed)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -25);
        this.ctx.lineTo(25, 0);
        this.ctx.lineTo(0, 25);
        this.ctx.lineTo(-25, 0);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Render details
        this.ctx.fillStyle = '#666666';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render boss enemy
     * @param {Entity} entity - Enemy entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderBossEnemy(entity, transform, render, physics) {
        // Render boss enemy (very large, very detailed)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-40, -40, 80, 80);
        
        // Render details
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(-40, -40, 80, 20);
        this.ctx.fillRect(-40, 20, 80, 20);
        this.ctx.fillRect(-20, -40, 40, 80);
        
        // Render core
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderBullet(entity, transform, render, physics) {
        // Get bullet type
        const bullet = entity;
        const bulletType = bullet.type;
        
        // Render bullet based on type
        switch (bulletType) {
            case 'bullet':
                this.renderBulletDefault(entity, transform, render, physics);
                break;
            case 'pellet':
                this.renderPelletBullet(entity, transform, render, physics);
                break;
            case 'plasma':
                this.renderPlasmaBullet(entity, transform, render, physics);
                break;
            case 'rocket':
                this.renderRocketBullet(entity, transform, render, physics);
                break;
            case 'spit':
                this.renderSpitBullet(entity, transform, render, physics);
                break;
            case 'flame':
                this.renderFlameBullet(entity, transform, render, physics);
                break;
            case 'heal':
                this.renderHealBullet(entity, transform, render, physics);
                break;
            default:
                // Default bullet rendering
                this.ctx.fillStyle = render.color;
                this.ctx.fillRect(-2, -2, 4, 4);
        }
    }
    
    /**
     * Render default bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderBulletDefault(entity, transform, render, physics) {
        // Render default bullet (small rectangle)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-2, -1, 4, 2);
    }
    
    /**
     * Render pellet bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderPelletBullet(entity, transform, render, physics) {
        // Render pellet bullet (small circle)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render plasma bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderPlasmaBullet(entity, transform, render, physics) {
        // Render plasma bullet (glowing orb)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Render glow
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = render.opacity;
    }
    
    /**
     * Render rocket bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderRocketBullet(entity, transform, render, physics) {
        // Render rocket bullet (elongated with fins)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-1, -4, 2, 8);
        
        // Render fins
        this.ctx.beginPath();
        this.ctx.moveTo(-1, -4);
        this.ctx.lineTo(-4, -7);
        this.ctx.lineTo(-1, -4);
        this.ctx.moveTo(1, -4);
        this.ctx.lineTo(4, -7);
        this.ctx.lineTo(1, -4);
        this.ctx.stroke();
    }
    
    /**
     * Render spit bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderSpitBullet(entity, transform, render, physics) {
        // Render spit bullet (blob)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render flame bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderFlameBullet(entity, transform, render, physics) {
        // Render flame bullet (flickering flame)
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -5);
        this.ctx.lineTo(3, 0);
        this.ctx.lineTo(0, 5);
        this.ctx.lineTo(-3, 0);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * Render heal bullet
     * @param {Entity} entity - Bullet entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderHealBullet(entity, transform, render, physics) {
        // Render heal bullet (cross)
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-1, -3, 2, 6);
        this.ctx.fillRect(-3, -1, 6, 2);
    }
    
    /**
     * Render particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderParticle(entity, transform, render, physics) {
        // Get particle type
        const particle = entity;
        const particleType = particle.type;
        
        // Render particle based on type
        switch (particleType) {
            case 'explosion':
                this.renderExplosionParticle(entity, transform, render, physics);
                break;
            case 'sparks':
                this.renderSparksParticle(entity, transform, render, physics);
                break;
            case 'smoke':
                this.renderSmokeParticle(entity, transform, render, physics);
                break;
            case 'blood':
                this.renderBloodParticle(entity, transform, render, physics);
                break;
            case 'plasma':
                this.renderPlasmaParticle(entity, transform, render, physics);
                break;
            case 'heal':
                this.renderHealParticle(entity, transform, render, physics);
                break;
            case 'bulletTrail':
                this.renderBulletTrailParticle(entity, transform, render, physics);
                break;
            case 'flame':
                this.renderFlameParticle(entity, transform, render, physics);
                break;
            default:
                // Default particle rendering
                this.ctx.fillStyle = render.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size || 5, 0, Math.PI * 2);
                this.ctx.fill();
        }
    }
    
    /**
     * Render explosion particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderExplosionParticle(entity, transform, render, physics) {
        // Render explosion particle (fiery burst)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size || 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Render inner flame
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, (particle.size || 10) * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render sparks particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderSparksParticle(entity, transform, render, physics) {
        // Render sparks particle (small bright dot)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size || 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Render glow
        this.ctx.globalAlpha = 0.5 * render.opacity;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, (particle.size || 3) * 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = render.opacity;
    }
    
    /**
     * Render smoke particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderSmokeParticle(entity, transform, render, physics) {
        // Render smoke particle (gray cloud)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size || 15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render blood particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderBloodParticle(entity, transform, render, physics) {
        // Render blood particle (red droplet)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size || 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render plasma particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderPlasmaParticle(entity, transform, render, physics) {
        // Render plasma particle (energy orb)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size || 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Render energy rings
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, (particle.size || 6) * 0.7, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    /**
     * Render heal particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderHealParticle(entity, transform, render, physics) {
        // Render heal particle (green cross)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.fillRect(-1, -(particle.size || 5), 2, (particle.size || 5) * 2);
        this.ctx.fillRect(-(particle.size || 5), -1, (particle.size || 5) * 2, 2);
    }
    
    /**
     * Render bullet trail particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderBulletTrailParticle(entity, transform, render, physics) {
        // Render bullet trail particle (small fading dot)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size || 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Render flame particle
     * @param {Entity} entity - Particle entity
     * @param {Transform} transform - Transform component
     * @param {Render} render - Render component
     * @param {Physics} physics - Physics component
     */
    renderFlameParticle(entity, transform, render, physics) {
        // Render flame particle (flickering flame)
        const particle = entity;
        this.ctx.fillStyle = render.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -(particle.size || 5));
        this.ctx.lineTo((particle.size || 5) * 0.7, 0);
        this.ctx.lineTo(0, (particle.size || 5) * 0.7);
        this.ctx.lineTo(-(particle.size || 5) * 0.7, 0);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * Apply post-processing effects
     */
    applyPostProcessingEffects() {
        // Apply screen flash
        if (this.effects.screenFlash.active && this.effects.screenFlash.alpha > 0) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = this.effects.screenFlash.alpha;
            this.ctx.fillStyle = this.effects.screenFlash.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        
        // Apply color filter
        if (this.effects.colorFilter.active && this.effects.colorFilter.alpha > 0) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = this.effects.colorFilter.alpha;
            this.ctx.fillStyle = this.effects.colorFilter.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        
        // Apply glitch effect
        if (this.effects.glitch.active && this.effects.glitch.intensity > 0) {
            this.applyGlitchEffect();
        }
        
        // Apply scanlines
        if (this.enableScanlines) {
            this.applyScanlinesEffect();
        }
    }
    
    /**
     * Apply glitch effect
     */
    applyGlitchEffect() {
        const intensity = this.effects.glitch.intensity;
        
        // Random glitch lines
        for (let i = 0; i < intensity * 10; i++) {
            const y = Math.random() * this.canvas.height;
            const height = Math.random() * 10 * intensity;
            const offset = (Math.random() - 0.5) * 20 * intensity;
            
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = 0.1 * intensity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, y, this.canvas.width, height);
            
            // Shift image data
            const imageData = this.ctx.getImageData(0, y, this.canvas.width, height);
            this.ctx.putImageData(imageData, offset, y);
            this.ctx.restore();
        }
    }
    
    /**
     * Apply scanlines effect
     */
    applyScanlinesEffect() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 0.1;
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        // Draw horizontal scanlines
        for (let y = 0; y < this.canvas.height; y += 3) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    /**
     * Render UI elements
     */
    renderUI() {
        // UI is rendered by HTML elements, so we don't need to do much here
        // This could be used for custom canvas-based UI elements
    }
    
    /**
     * Handle player damage event
     * @param {Player} player - The player that was damaged
     * @param {number} damage - Amount of damage
     * @param {object} source - Source of damage
     */
    onPlayerDamage(player, damage, source) {
        // Screen flash effect
        this.triggerScreenFlash('#ff0000', 0.3, 0.2);
        
        // Camera shake
        this.triggerCameraShake(5, 0.3);
    }
    
    /**
     * Handle bullet hit event
     * @param {Bullet} bullet - The bullet that hit
     * @param {Entity} entity - Entity that was hit
     * @param {number} damage - Amount of damage
     */
    onBulletHit(bullet, entity, damage) {
        // Create impact particles
        this.createImpactParticles(bullet, entity);
        
        // Camera shake based on damage
        const shakeIntensity = Math.min(10, damage / 5);
        this.triggerCameraShake(shakeIntensity, 0.1);
    }
    
    /**
     * Handle bullet explosion event
     * @param {Bullet} bullet - The bullet that exploded
     * @param {number} x - Explosion X position
     * @param {number} y - Explosion Y position
     * @param {number} radius - Explosion radius
     */
    onBulletExplosion(bullet, x, y, radius) {
        // Create explosion particles
        this.createExplosionParticles(x, y, radius);
        
        // Screen flash
        this.triggerScreenFlash('#ff5500', 0.5, 0.3);
        
        // Camera shake
        this.triggerCameraShake(15, 0.5);
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - The enemy that died
     * @param {object} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Create death particles
        this.createDeathParticles(enemy);
    }
    
    /**
     * Handle chaos update event
     * @param {number} chaosLevel - New chaos level
     */
    onChaosUpdate(chaosLevel) {
        // Apply visual effects based on chaos level
        const thresholds = window.config.get('chaos.thresholds');
        
        if (chaosLevel >= thresholds.extreme) {
            // Extreme chaos effects
            this.triggerGlitchEffect(0.5, 2);
            this.effects.colorFilter.active = true;
            this.effects.colorFilter.color = '#ff0000';
            this.effects.colorFilter.alpha = 0.1;
        } else if (chaosLevel >= thresholds.high) {
            // High chaos effects
            this.triggerGlitchEffect(0.3, 1);
            this.effects.colorFilter.active = true;
            this.effects.colorFilter.color = '#ff5500';
            this.effects.colorFilter.alpha = 0.05;
        } else if (chaosLevel >= thresholds.medium) {
            // Medium chaos effects
            this.triggerGlitchEffect(0.1, 0.5);
        } else if (chaosLevel >= thresholds.low) {
            // Low chaos effects
            this.triggerGlitchEffect(0.05, 0.2);
        } else {
            // No chaos effects
            this.effects.colorFilter.active = false;
        }
    }
    
    /**
     * Handle game start event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameStart(gameEngine) {
        // Reset visual effects
        this.resetEffects();
    }
    
    /**
     * Handle game over event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameOver(gameEngine) {
        // Screen flash to black
        this.triggerScreenFlash('#000000', 1, 1);
    }
    
    /**
     * Create impact particles
     * @param {Bullet} bullet - The bullet that hit
     * @param {Entity} entity - Entity that was hit
     */
    createImpactParticles(bullet, entity) {
        // Get impact position
        const bulletTransform = bullet.getComponent('Transform');
        if (!bulletTransform) return;
        
        // Create spark particles
        for (let i = 0; i < 5; i++) {
            this.createParticle(
                bulletTransform.x,
                bulletTransform.y,
                'sparks',
                {
                    color: '#ffff00',
                    size: Math.random() * 2 + 1,
                    lifetime: Math.random() * 200 + 100
                }
            );
        }
    }
    
    /**
     * Create explosion particles
     * @param {number} x - Explosion X position
     * @param {number} y - Explosion Y position
     * @param {number} radius - Explosion radius
     */
    createExplosionParticles(x, y, radius) {
        // Create explosion particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 200 + 100;
            const distance = Math.random() * radius;
            
            this.createParticle(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                'explosion',
                {
                    color: '#ff5500',
                    size: Math.random() * 10 + 5,
                    lifetime: Math.random() * 500 + 500,
                    velocity: {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    }
                }
            );
        }
        
        // Create smoke particles
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 50 + 25;
            const distance = Math.random() * radius * 0.5;
            
            this.createParticle(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                'smoke',
                {
                    color: '#666666',
                    size: Math.random() * 20 + 10,
                    lifetime: Math.random() * 1000 + 1000,
                    velocity: {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed - 50 // Smoke rises
                    }
                }
            );
        }
    }
    
    /**
     * Create death particles
     * @param {Enemy} enemy - The enemy that died
     */
    createDeathParticles(enemy) {
        // Get enemy position
        const transform = enemy.getComponent('Transform');
        if (!transform) return;
        
        // Create blood particles
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            
            this.createParticle(
                transform.x,
                transform.y,
                'blood',
                {
                    color: '#ff0000',
                    size: Math.random() * 4 + 2,
                    lifetime: Math.random() * 500 + 500,
                    velocity: {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    }
                }
            );
        }
    }
    
    /**
     * Create a particle
     * @param {number} x - Particle X position
     * @param {number} y - Particle Y position
     * @param {string} type - Particle type
     * @param {object} options - Particle options
     */
    createParticle(x, y, type, options = {}) {
        // Import Particle class dynamically to avoid circular dependency
        import('../entities/particle.js').then(({ default: Particle }) => {
            // Create particle entity
            const particle = new Particle(x, y, type, options);
            particle.gameEngine = this.gameEngine;
            
            // Add particle to entities
            this.gameEngine.addEntity(particle);
        }).catch(error => {
            console.error('Failed to create particle:', error);
        });
    }
    
    /**
     * Trigger screen flash effect
     * @param {string} color - Flash color
     * @param {number} alpha - Flash alpha
     * @param {number} duration - Flash duration in seconds
     */
    triggerScreenFlash(color, alpha, duration) {
        this.effects.screenFlash.active = true;
        this.effects.screenFlash.color = color;
        this.effects.screenFlash.alpha = alpha;
        this.effects.screenFlash.duration = duration;
    }
    
    /**
     * Trigger camera shake effect
     * @param {number} intensity - Shake intensity
     * @param {number} duration - Shake duration in seconds
     */
    triggerCameraShake(intensity, duration) {
        this.camera.shake.intensity = intensity;
        this.camera.shake.duration = duration;
    }
    
    /**
     * Trigger glitch effect
     * @param {number} intensity - Glitch intensity
     * @param {number} duration - Glitch duration in seconds
     */
    triggerGlitchEffect(intensity, duration) {
        this.effects.glitch.active = true;
        this.effects.glitch.intensity = intensity;
        this.effects.glitch.duration = duration;
    }
    
    /**
     * Reset all visual effects
     */
    resetEffects() {
        // Reset screen flash
        this.effects.screenFlash.active = false;
        this.effects.screenFlash.alpha = 0;
        this.effects.screenFlash.duration = 0;
        
        // Reset color filter
        this.effects.colorFilter.active = false;
        this.effects.colorFilter.alpha = 0;
        
        // Reset glitch effect
        this.effects.glitch.active = false;
        this.effects.glitch.intensity = 0;
        this.effects.glitch.duration = 0;
        
        // Reset camera shake
        this.camera.shake.intensity = 0;
        this.camera.shake.duration = 0;
        this.camera.shake.x = 0;
        this.camera.shake.y = 0;
    }
    
    /**
     * Handle config changes
     * @param {object} event - Config change event
     */
    onConfigChange(event) {
        const { path, value } = event;
        
        // Update visual settings if they changed
        if (path.startsWith('graphics.')) {
            this.loadVisualSettings();
        }
    }
    
    /**
     * Destroy the render system
     */
    destroy() {
        // Reset effects
        this.resetEffects();
    }
}

// Export for use in modules
export default RenderSystem;