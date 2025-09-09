/**
 * Arcade Meltdown - Orbital Strike Power-Up
 * Calls down a devastating orbital strike on target location
 */

import Entity from '../entity.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Render from '../../components/render.js';
import Collision from '../../components/collision.js';
import MathUtils from '../../utils/math.js';

class OrbitalStrike extends Entity {
    /**
     * Create a new Orbital Strike power-up
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Player} owner - Player who activated the power-up
     * @param {object} target - Target position {x, y}
     */
    constructor(x, y, owner, target) {
        // Call parent constructor
        super();
        
        // Set up entity
        this.addTag('powerup');
        this.addTag('orbital_strike');
        
        // Power-up properties
        this.owner = owner;
        this.target = target;
        this.damage = 100;
        this.radius = 150;
        this.warningTime = 2; // seconds before impact
        this.impactTime = 1; // seconds of impact effect
        this.totalDuration = this.warningTime + this.impactTime;
        
        // Visual properties
        this.warningRadius = 50;
        this.impactRadius = this.radius;
        this.warningColor = '#ff3333';
        this.impactColor = '#ffffff';
        
        // State
        this.timer = 0;
        this.hasImpacted = false;
        this.active = true;
        
        // Initialize components
        this.initComponents(x, y);
        
        // Set up event listeners
        this.setupEventListeners();
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
        render.customRender = this.renderOrbitalStrike.bind(this);
        this.addComponent(render);
        
        // Add collision component (for impact)
        const collision = new Collision();
        collision.radius = this.impactRadius;
        collision.isTrigger = true;
        this.addComponent(collision);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for collision events
        window.eventSystem.on(`collision:${this.id}`, (entity) => {
            this.onCollision(entity);
        });
    }
    
    /**
     * Update the orbital strike
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update timer
        this.timer += deltaTime;
        
        // Check if impact should occur
        if (this.timer >= this.warningTime && !this.hasImpacted) {
            this.impact();
        }
        
        // Check if orbital strike should end
        if (this.timer >= this.totalDuration) {
            this.destroy();
        }
    }
    
    /**
     * Perform impact
     */
    impact() {
        // Set impacted flag
        this.hasImpacted = true;
        
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Move to target position
        transform.x = this.target.x;
        transform.y = this.target.y;
        
        // Get collision component
        const collision = this.getComponent('Collision');
        if (!collision) return;
        
        // Enable collision
        collision.enabled = true;
        
        // Find all entities within impact radius
        const entities = this.gameEngine.getEntities();
        for (const entity of entities) {
            // Skip self and owner
            if (entity === this || entity === this.owner) continue;
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply damage if within radius
            if (distance <= this.impactRadius) {
                // Calculate damage based on distance (more damage at center)
                const damageMultiplier = 1 - (distance / this.impactRadius) * 0.5;
                const damage = this.damage * damageMultiplier;
                
                // Apply damage if entity has health
                const health = entity.getComponent('Health');
                if (health) {
                    health.takeDamage(damage, this.owner);
                }
                
                // Apply knockback if entity has physics
                const physics = entity.getComponent('Physics');
                if (physics) {
                    // Calculate knockback direction
                    const knockbackDirection = Math.atan2(dy, dx);
                    const knockbackForce = 300 * (1 - distance / this.impactRadius);
                    
                    // Apply knockback impulse
                    physics.velocity.x += Math.cos(knockbackDirection) * knockbackForce;
                    physics.velocity.y += Math.sin(knockbackDirection) * knockbackForce;
                }
            }
        }
        
        // Create visual effects
        this.createImpactEffects();
        
        // Emit impact event
        window.eventSystem.emit('powerup:orbitalStrikeImpact', this, transform.x, transform.y, this.impactRadius);
    }
    
    /**
     * Create impact effects
     */
    createImpactEffects() {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Create screen shake effect
        if (this.gameEngine.renderSystem) {
            this.gameEngine.renderSystem.shakeScreen(0.5, 10);
        }
        
        // Create explosion particles
        for (let i = 0; i < 50; i++) {
            // Calculate particle position
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.impactRadius;
            const x = transform.x + Math.cos(angle) * distance;
            const y = transform.y + Math.sin(angle) * distance;
            
            // Calculate particle velocity
            const speed = 100 + Math.random() * 200;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            // Import Particle class (circular dependency workaround)
            const Particle = require('../particle.js').default || window.Particle;
            
            // Create particle
            const particle = new Particle(x, y, vx, vy, {
                color: '#ff9933',
                size: 2 + Math.random() * 4,
                lifetime: 0.5 + Math.random() * 0.5,
                fade: true
            });
            
            // Add particle to game engine
            this.gameEngine.addEntity(particle);
        }
        
        // Create impact sound
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSound('explosion', {
                position: { x: transform.x, y: transform.y, z: 0 },
                volume: 1.5
            });
        }
    }
    
    /**
     * Handle collision with another entity
     * @param {Entity} entity - Entity that collided with this one
     */
    onCollision(entity) {
        // Skip if not impacted yet
        if (!this.hasImpacted) return;
        
        // Skip self and owner
        if (entity === this || entity === this.owner) return;
        
        // Damage is already applied in impact() method
        // This is just for additional collision effects if needed
    }
    
    /**
     * Render the orbital strike
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderOrbitalStrike(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Save context state
        ctx.save();
        
        // Translate to entity position
        ctx.translate(transform.x, transform.y);
        
        // Determine current phase
        const isWarningPhase = this.timer < this.warningTime;
        
        if (isWarningPhase) {
            // Draw warning phase
            const warningProgress = this.timer / this.warningTime;
            
            // Draw warning circle
            ctx.strokeStyle = this.warningColor;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3 + 0.4 * Math.sin(warningProgress * Math.PI * 10);
            ctx.beginPath();
            ctx.arc(0, 0, this.warningRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw targeting laser
            ctx.strokeStyle = this.warningColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(warningProgress * Math.PI * 5);
            ctx.beginPath();
            ctx.moveTo(0, -this.gameEngine.arena.height);
            ctx.lineTo(0, this.gameEngine.arena.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-this.gameEngine.arena.width, 0);
            ctx.lineTo(this.gameEngine.arena.width, 0);
            ctx.stroke();
            
            // Draw targeting reticle
            ctx.strokeStyle = this.warningColor;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.lineTo(0, 30);
            ctx.stroke();
        } else {
            // Draw impact phase
            const impactProgress = (this.timer - this.warningTime) / this.impactTime;
            
            // Draw explosion
            const explosionRadius = this.impactRadius * (1 - impactProgress * 0.5);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, explosionRadius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, '#ff9933');
            gradient.addColorStop(0.7, '#ff3333');
            gradient.addColorStop(1, 'rgba(255, 51, 51, 0)');
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 1 - impactProgress * 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, explosionRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw shockwave
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1 - impactProgress;
            ctx.beginPath();
            ctx.arc(0, 0, this.impactRadius * (0.5 + impactProgress * 0.5), 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Serialize orbital strike for network transmission
     * @returns {object} Serialized orbital strike data
     */
    serialize() {
        const transform = this.getComponent('Transform');
        
        return {
            x: transform.x,
            y: transform.y,
            target: this.target,
            timer: this.timer,
            hasImpacted: this.hasImpacted,
            active: this.active
        };
    }
    
    /**
     * Deserialize orbital strike data
     * @param {object} data - Serialized orbital strike data
     * @returns {OrbitalStrike} This orbital strike for method chaining
     */
    deserialize(data) {
        // Get transform component
        const transform = this.getComponent('Transform');
        
        // Set transform position
        transform.x = data.x;
        transform.y = data.y;
        
        // Set orbital strike data
        this.target = data.target;
        this.timer = data.timer;
        this.hasImpacted = data.hasImpacted;
        this.active = data.active;
        
        return this;
    }
    
    /**
     * Destroy the orbital strike
     */
    destroy() {
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
    module.exports = OrbitalStrike;
}