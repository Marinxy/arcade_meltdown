/**
 * Arcade Meltdown - Time Slow Bubble Power-Up
 * Creates a bubble that slows down time for enemies within its radius
 */

import Entity from '../entity.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Render from '../../components/render.js';
import Collision from '../../components/collision.js';
import MathUtils from '../../utils/math.js';

class TimeSlowBubble extends Entity {
    /**
     * Create a new Time Slow Bubble power-up
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Player} owner - Player who activated the power-up
     */
    constructor(x, y, owner) {
        // Call parent constructor
        super();
        
        // Set up entity
        this.addTag('powerup');
        this.addTag('time_slow_bubble');
        
        // Power-up properties
        this.owner = owner;
        this.radius = 200;
        this.duration = 8; // seconds
        this.slowFactor = 0.3; // 30% speed for enemies
        this.playerSpeedFactor = 1.2; // 120% speed for players
        
        // Visual properties
        this.pulseSpeed = 2; // pulses per second
        this.pulseAmount = 0.2; // 20% size variation
        this.baseRadius = this.radius;
        this.bubbleColor = 'rgba(85, 255, 255, 0.3)';
        this.bubbleBorderColor = 'rgba(85, 255, 255, 0.8)';
        
        // State
        this.timer = 0;
        this.active = true;
        this.pulseTimer = 0;
        
        // Affected entities
        this.affectedEntities = new Map(); // entityId -> originalSpeed
        
        // Initialize components
        this.initComponents(x, y);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply initial effects
        this.applyEffects();
    }
    
    /**
     * Initialize components
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    initComponents(x, y) {
        // Add transform component
        this.addComponent(new Transform(x, y));
        
        // Add physics component (non-collidable)
        const physics = new Physics();
        physics.collidable = false;
        this.addComponent(physics);
        
        // Add render component
        const render = new Render();
        render.customRender = this.renderTimeSlowBubble.bind(this);
        this.addComponent(render);
        
        // Add collision component (for detecting entities)
        const collision = new Collision();
        collision.radius = this.radius;
        collision.isTrigger = true;
        this.addComponent(collision);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for collision events
        window.eventSystem.on(`collision:${this.id}`, (entity) => {
            this.onCollisionEnter(entity);
        });
        
        // Listen for collision exit events
        window.eventSystem.on(`collisionExit:${this.id}`, (entity) => {
            this.onCollisionExit(entity);
        });
    }
    
    /**
     * Update the time slow bubble
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update timer
        this.timer += deltaTime;
        
        // Update pulse timer
        this.pulseTimer += deltaTime;
        
        // Update radius based on pulse
        const pulsePhase = Math.sin(this.pulseTimer * this.pulseSpeed * Math.PI * 2);
        this.radius = this.baseRadius * (1 + this.pulseAmount * pulsePhase);
        
        // Update collision radius
        const collision = this.getComponent('Collision');
        if (collision) {
            collision.radius = this.radius;
        }
        
        // Check if bubble should end
        if (this.timer >= this.duration) {
            this.destroy();
        }
        
        // Update effects on affected entities
        this.updateEffects();
    }
    
    /**
     * Apply time slow effects to entities within bubble
     */
    applyEffects() {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Get all entities
        const entities = this.gameEngine.getEntities();
        
        // Apply effects to entities within radius
        for (const entity of entities) {
            // Skip self
            if (entity === this) continue;
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply effect if within radius
            if (distance <= this.radius) {
                this.applyEffectToEntity(entity);
            }
        }
    }
    
    /**
     * Apply time slow effect to a specific entity
     * @param {Entity} entity - Entity to affect
     */
    applyEffectToEntity(entity) {
        // Skip if already affected
        if (this.affectedEntities.has(entity.id)) return;
        
        // Get entity physics component
        const physics = entity.getComponent('Physics');
        if (!physics) return;
        
        // Store original speed
        const originalSpeed = {
            maxSpeed: physics.maxSpeed,
            acceleration: physics.acceleration,
            deceleration: physics.deceleration
        };
        
        // Apply speed modification based on entity type
        if (entity.hasTag('player')) {
            // Speed up players
            physics.maxSpeed *= this.playerSpeedFactor;
            physics.acceleration *= this.playerSpeedFactor;
            physics.deceleration *= this.playerSpeedFactor;
        } else if (entity.hasTag('enemy') || entity.hasTag('bullet')) {
            // Slow down enemies and bullets
            physics.maxSpeed *= this.slowFactor;
            physics.acceleration *= this.slowFactor;
            physics.deceleration *= this.slowFactor;
        }
        
        // Store affected entity
        this.affectedEntities.set(entity.id, {
            entity: entity,
            originalSpeed: originalSpeed
        });
        
        // Apply visual effect
        this.applyVisualEffect(entity);
    }
    
    /**
     * Remove time slow effect from a specific entity
     * @param {Entity} entity - Entity to un-affect
     */
    removeEffectFromEntity(entity) {
        // Skip if not affected
        if (!this.affectedEntities.has(entity.id)) return;
        
        // Get affected entity data
        const affectedData = this.affectedEntities.get(entity.id);
        
        // Get entity physics component
        const physics = entity.getComponent('Physics');
        if (physics && affectedData.originalSpeed) {
            // Restore original speed
            physics.maxSpeed = affectedData.originalSpeed.maxSpeed;
            physics.acceleration = affectedData.originalSpeed.acceleration;
            physics.deceleration = affectedData.originalSpeed.deceleration;
        }
        
        // Remove visual effect
        this.removeVisualEffect(entity);
        
        // Remove from affected entities
        this.affectedEntities.delete(entity.id);
    }
    
    /**
     * Update effects on affected entities
     */
    updateEffects() {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Check each affected entity
        for (const [entityId, affectedData] of this.affectedEntities) {
            // Get entity
            const entity = affectedData.entity;
            
            // Skip if entity is no longer active
            if (!entity.isActive()) {
                this.affectedEntities.delete(entityId);
                continue;
            }
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Remove effect if outside radius
            if (distance > this.radius) {
                this.removeEffectFromEntity(entity);
            }
        }
        
        // Check for new entities within radius
        this.applyEffects();
    }
    
    /**
     * Apply visual effect to entity
     * @param {Entity} entity - Entity to affect
     */
    applyVisualEffect(entity) {
        // Get entity render component
        const render = entity.getComponent('Render');
        if (!render) return;
        
        // Store original color
        const originalColor = render.color;
        
        // Apply color tint based on entity type
        if (entity.hasTag('player')) {
            // Blue tint for players
            render.color = this.applyColorTint(originalColor, '#55ffff', 0.3);
        } else if (entity.hasTag('enemy')) {
            // Purple tint for enemies
            render.color = this.applyColorTint(originalColor, '#9955ff', 0.3);
        } else if (entity.hasTag('bullet')) {
            // Cyan tint for bullets
            render.color = this.applyColorTint(originalColor, '#55ffff', 0.5);
        }
        
        // Store original color in affected entities data
        const affectedData = this.affectedEntities.get(entity.id);
        if (affectedData) {
            affectedData.originalColor = originalColor;
        }
    }
    
    /**
     * Remove visual effect from entity
     * @param {Entity} entity - Entity to un-affect
     */
    removeVisualEffect(entity) {
        // Get entity render component
        const render = entity.getComponent('Render');
        if (!render) return;
        
        // Get affected entities data
        const affectedData = this.affectedEntities.get(entity.id);
        if (!affectedData || !affectedData.originalColor) return;
        
        // Restore original color
        render.color = affectedData.originalColor;
    }
    
    /**
     * Apply color tint to a color
     * @param {string} originalColor - Original color
     * @param {string} tintColor - Tint color
     * @param {number} tintAmount - Tint amount (0-1)
     * @returns {string} Tinted color
     */
    applyColorTint(originalColor, tintColor, tintAmount) {
        // Convert colors to RGB
        const originalRgb = this.hexToRgb(originalColor);
        const tintRgb = this.hexToRgb(tintColor);
        
        // Apply tint
        const r = Math.round(originalRgb.r * (1 - tintAmount) + tintRgb.r * tintAmount);
        const g = Math.round(originalRgb.g * (1 - tintAmount) + tintRgb.g * tintAmount);
        const b = Math.round(originalRgb.b * (1 - tintAmount) + tintRgb.b * tintAmount);
        
        // Convert back to hex
        return this.rgbToHex(r, g, b);
    }
    
    /**
     * Convert hex color to RGB
     * @param {string} hex - Hex color
     * @returns {object} RGB color
     */
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    /**
     * Convert RGB color to hex
     * @param {number} r - Red value
     * @param {number} g - Green value
     * @param {number} b - Blue value
     * @returns {string} Hex color
     */
    rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    /**
     * Handle collision enter with another entity
     * @param {Entity} entity - Entity that collided with this one
     */
    onCollisionEnter(entity) {
        // Apply effect to entity
        this.applyEffectToEntity(entity);
    }
    
    /**
     * Handle collision exit with another entity
     * @param {Entity} entity - Entity that stopped colliding with this one
     */
    onCollisionExit(entity) {
        // Remove effect from entity
        this.removeEffectFromEntity(entity);
    }
    
    /**
     * Render the time slow bubble
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderTimeSlowBubble(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Save context state
        ctx.save();
        
        // Translate to entity position
        ctx.translate(transform.x, transform.y);
        
        // Draw bubble
        ctx.fillStyle = this.bubbleColor;
        ctx.strokeStyle = this.bubbleBorderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw energy waves
        const waveCount = 3;
        const waveSpacing = this.radius / (waveCount + 1);
        
        for (let i = 1; i <= waveCount; i++) {
            const waveRadius = i * waveSpacing;
            const waveAlpha = 0.5 * (1 - i / waveCount);
            
            ctx.strokeStyle = `rgba(85, 255, 255, ${waveAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw time particles
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + this.timer * 0.5;
            const distance = this.radius * 0.8 * (0.5 + 0.5 * Math.sin(this.timer * 2 + i));
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = 2 + Math.sin(this.timer * 3 + i) * 1;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw timer indicator
        const timerProgress = 1 - (this.timer / this.duration);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 10, -Math.PI / 2, -Math.PI / 2 + timerProgress * Math.PI * 2);
        ctx.stroke();
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Serialize time slow bubble for network transmission
     * @returns {object} Serialized time slow bubble data
     */
    serialize() {
        const transform = this.getComponent('Transform');
        
        return {
            x: transform.x,
            y: transform.y,
            timer: this.timer,
            radius: this.radius,
            active: this.active
        };
    }
    
    /**
     * Deserialize time slow bubble data
     * @param {object} data - Serialized time slow bubble data
     * @returns {TimeSlowBubble} This time slow bubble for method chaining
     */
    deserialize(data) {
        // Get transform component
        const transform = this.getComponent('Transform');
        
        // Set transform position
        transform.x = data.x;
        transform.y = data.y;
        
        // Set time slow bubble data
        this.timer = data.timer;
        this.radius = data.radius;
        this.active = data.active;
        
        // Update collision radius
        const collision = this.getComponent('Collision');
        if (collision) {
            collision.radius = this.radius;
        }
        
        return this;
    }
    
    /**
     * Destroy the time slow bubble
     */
    destroy() {
        // Remove effects from all affected entities
        for (const [entityId, affectedData] of this.affectedEntities) {
            this.removeEffectFromEntity(affectedData.entity);
        }
        
        // Clear affected entities
        this.affectedEntities.clear();
        
        // Emit destroy event
        window.eventSystem.emit('entity:destroyed', this);
        
        // Remove from game engine
        if (this.gameEngine) {
            this.gameEngine.removeEntity(this);
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimeSlowBubble;
}