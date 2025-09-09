/**
 * Arcade Meltdown - Spitter Enemy Class
 * Ranged enemy that spits acid projectiles at players
 */

import Enemy from './enemy.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Collision from '../../components/collision.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Spitter extends Enemy {
    /**
     * Create a new Spitter enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'spitter');
        
        // Enemy properties
        this.speed = 120; // Slow movement speed
        this.health = 80; // Low health
        this.damage = 15; // Moderate damage
        this.attackRange = 300; // Long attack range
        this.attackCooldown = 2; // seconds between attacks
        this.projectileSpeed = 250;
        this.projectileSize = 6;
        this.spitSpread = 0.1; // radians
        
        // Acid properties
        this.acidDamage = 5; // damage per second
        this.acidDuration = 3; // seconds
        this.acidRadius = 30; // radius of acid pool
        this.acidSlowFactor = 0.7; // 70% speed in acid
        
        // AI properties
        this.keepDistance = true; // Keep distance from players
        this.preferredDistance = 250; // Preferred distance from players
        this.strafeChance = 0.3; // Chance to strafe
        this.strafeDuration = 1; // seconds
        this.strafeTimer = 0;
        this.strafeDirection = 1; // 1 or -1
        
        // State
        this.attackTimer = 0;
        this.isAttacking = false;
        this.canAttack = true;
        
        // Visual properties
        this.color = '#99ff33';
        this.size = 18;
        this.spitColor = '#66ff33';
        
        // Initialize components
        this.initComponents();
    }
    
    /**
     * Initialize components
     */
    initComponents() {
        // Get components
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        const render = this.getComponent('Render');
        const collision = this.getComponent('Collision');
        
        // Update physics component
        if (physics) {
            physics.maxSpeed = this.speed;
            physics.acceleration = 200;
            physics.deceleration = 300;
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderSpitter.bind(this);
        }
        
        // Update collision component
        if (collision) {
            collision.radius = this.size;
        }
    }
    
    /**
     * Update the spitter enemy
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Update attack timer
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
            
            // Check if attack is complete
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }
        
        // Update strafe timer
        if (this.strafeTimer > 0) {
            this.strafeTimer -= deltaTime;
        }
        
        // Update AI
        this.updateAI(deltaTime);
    }
    
    /**
     * Update AI behavior
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateAI(deltaTime) {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Find nearest player
        const nearestPlayer = this.findNearestPlayer();
        if (!nearestPlayer) return;
        
        // Get player transform
        const playerTransform = nearestPlayer.getComponent('Transform');
        if (!playerTransform) return;
        
        // Calculate direction to player
        const dx = playerTransform.x - transform.x;
        const dy = playerTransform.y - transform.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const direction = Math.atan2(dy, dx);
        
        // Reset input
        this.input.reset();
        
        // Decide on action based on distance
        if (distance <= this.attackRange && this.canAttack) {
            // Attack player
            this.attackPlayer(direction);
        } else if (this.keepDistance && distance < this.preferredDistance) {
            // Move away from player
            this.moveAwayFromPlayer(direction);
        } else {
            // Move toward player
            this.moveTowardPlayer(direction);
        }
        
        // Decide whether to strafe
        if (this.strafeTimer <= 0 && Math.random() < this.strafeChance) {
            this.strafeDirection = Math.random() < 0.5 ? -1 : 1;
            this.strafeTimer = this.strafeDuration;
        }
        
        // Apply strafe movement
        if (this.strafeTimer > 0) {
            // Calculate strafe direction (perpendicular to player direction)
            const strafeDirection = direction + (Math.PI / 2) * this.strafeDirection;
            
            // Apply strafe input
            this.input.up = Math.cos(strafeDirection) > 0;
            this.input.down = Math.cos(strafeDirection) < 0;
            this.input.left = Math.sin(strafeDirection) < 0;
            this.input.right = Math.sin(strafeDirection) > 0;
        }
        
        // Face player
        transform.rotation = direction;
    }
    
    /**
     * Attack player
     * @param {number} direction - Direction to player
     */
    attackPlayer(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.attackTimer = 0.5; // Attack animation time
        this.canAttack = false;
        
        // Set attack cooldown
        setTimeout(() => {
            this.canAttack = true;
        }, this.attackCooldown * 1000);
        
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Calculate spit direction with spread
        const spread = (Math.random() - 0.5) * this.spitSpread;
        const spitDirection = direction + spread;
        
        // Calculate projectile velocity
        const vx = Math.cos(spitDirection) * this.projectileSpeed;
        const vy = Math.sin(spitDirection) * this.projectileSpeed;
        
        // Import Bullet class (circular dependency workaround)
        const Bullet = require('../bullet.js').default || window.Bullet;
        
        // Create acid projectile
        const bullet = new Bullet(
            transform.x + Math.cos(spitDirection) * this.size,
            transform.y + Math.sin(spitDirection) * this.size,
            vx,
            vy,
            this.damage,
            this,
            {
                acid: true,
                acidDamage: this.acidDamage,
                acidDuration: this.acidDuration,
                acidRadius: this.acidRadius,
                acidSlowFactor: this.acidSlowFactor,
                size: this.projectileSize,
                color: this.spitColor,
                type: 'acid'
            }
        );
        
        // Add bullet to game engine
        this.gameEngine.addEntity(bullet);
        
        // Emit attack event
        window.eventSystem.emit('enemy:attack', this, nearestPlayer);
    }
    
    /**
     * Move toward player
     * @param {number} direction - Direction to player
     */
    moveTowardPlayer(direction) {
        // Apply movement input
        this.input.up = Math.cos(direction) > 0;
        this.input.down = Math.cos(direction) < 0;
        this.input.left = Math.sin(direction) < 0;
        this.input.right = Math.sin(direction) > 0;
    }
    
    /**
     * Move away from player
     * @param {number} direction - Direction to player
     */
    moveAwayFromPlayer(direction) {
        // Apply movement input (opposite direction)
        this.input.up = Math.cos(direction) < 0;
        this.input.down = Math.cos(direction) > 0;
        this.input.left = Math.sin(direction) > 0;
        this.input.right = Math.sin(direction) < 0;
    }
    
    /**
     * Take damage
     * @param {number} damage - Amount of damage
     * @param {Entity} source - Source of damage
     */
    takeDamage(damage, source) {
        // Call parent takeDamage
        super.takeDamage(damage, source);
        
        // Emit hurt event
        window.eventSystem.emit('enemy:hurt', this, source);
    }
    
    /**
     * Render the spitter enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderSpitter(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw spitter body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw spitter details
        ctx.fillStyle = '#669933';
        
        // Draw eyes
        ctx.beginPath();
        ctx.arc(-8, -5, 4, 0, Math.PI * 2);
        ctx.arc(8, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth
        ctx.beginPath();
        ctx.arc(0, 5, 8, 0, Math.PI);
        ctx.fill();
        
        // Draw attack animation
        if (this.isAttacking) {
            // Draw inflated throat
            ctx.fillStyle = '#66ff33';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw spit projectile
            ctx.fillStyle = this.spitColor;
            ctx.beginPath();
            ctx.arc(this.size * 1.5, 0, this.projectileSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw health bar
        const health = entity.getComponent('Health');
        if (health) {
            const healthPercentage = health.getHealthPercentage();
            
            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(-this.size, -this.size - 10, this.size * 2, 4);
            
            // Health
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(-this.size, -this.size - 10, this.size * 2 * healthPercentage, 4);
        }
    }
    
    /**
     * Serialize spitter for network transmission
     * @returns {object} Serialized spitter data
     */
    serialize() {
        const data = super.serialize();
        
        // Add spitter-specific data
        data.attackTimer = this.attackTimer;
        data.isAttacking = this.isAttacking;
        data.canAttack = this.canAttack;
        data.strafeTimer = this.strafeTimer;
        data.strafeDirection = this.strafeDirection;
        
        return data;
    }
    
    /**
     * Deserialize spitter data
     * @param {object} data - Serialized spitter data
     * @returns {Spitter} This spitter for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set spitter-specific data
        this.attackTimer = data.attackTimer || 0;
        this.isAttacking = data.isAttacking || false;
        this.canAttack = data.canAttack || true;
        this.strafeTimer = data.strafeTimer || 0;
        this.strafeDirection = data.strafeDirection || 1;
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Spitter;
}