/**
 * Arcade Meltdown - Bruiser Enemy Class
 * Heavy melee enemy with high health and damage
 */

import Enemy from './enemy.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Collision from '../../components/collision.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Bruiser extends Enemy {
    /**
     * Create a new Bruiser enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'bruiser');
        
        // Enemy properties
        this.speed = 150; // Moderate movement speed
        this.health = 250; // High health
        this.damage = 25; // High damage
        this.attackRange = 50; // Short attack range (melee)
        this.attackCooldown = 2.5; // seconds between attacks
        this.attackWindup = 0.8; // seconds before attack
        this.attackDuration = 0.5; // seconds of attack
        
        // Charge properties
        this.chargeSpeed = 300; // Fast speed when charging
        this.chargeDistance = 200; // Maximum charge distance
        this.chargeCooldown = 5; // seconds between charges
        this.chargeDamage = 35; // Damage when charging
        this.chargeKnockback = 400; // Knockback force when charging
        
        // AI properties
        this.aggressive = true; // Always pursue players
        this.chargeChance = 0.3; // Chance to charge when at distance
        this.chargeMinDistance = 150; // Minimum distance to consider charging
        self.rageThreshold = 0.3; // Health percentage to enter rage mode
        self.rageMode = false; // Whether in rage mode
        self.rageSpeedMultiplier = 1.5; // Speed multiplier in rage mode
        self.rageDamageMultiplier = 1.5; // Damage multiplier in rage mode
        
        // State
        this.attackTimer = 0;
        this.chargeTimer = 0;
        this.isAttacking = false;
        this.isCharging = false;
        this.canAttack = true;
        self.canCharge = true;
        self.chargeDirection = 0;
        self.chargeDistanceTraveled = 0;
        
        // Visual properties
        this.color = '#ff6633';
        this.size = 25;
        
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
            physics.acceleration = 300;
            physics.deceleration = 500;
            physics.mass = 2; // Heavy mass
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderBruiser.bind(this);
        }
        
        // Update collision component
        if (collision) {
            collision.radius = this.size;
        }
    }
    
    /**
     * Update the bruiser enemy
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
        
        // Update charge timer
        if (this.chargeTimer > 0) {
            this.chargeTimer -= deltaTime;
            
            // Check if charge cooldown is complete
            if (this.chargeTimer <= 0) {
                self.canCharge = true;
            }
        }
        
        // Check for rage mode
        this.checkRageMode();
        
        // Update AI
        this.updateAI(deltaTime);
    }
    
    /**
     * Check if should enter rage mode
     */
    checkRageMode() {
        // Get health component
        const health = this.getComponent('Health');
        if (!health) return;
        
        // Check if health is below threshold
        const healthPercentage = health.getHealthPercentage();
        
        // Enter rage mode if health is below threshold and not already in rage mode
        if (healthPercentage <= self.rageThreshold && !self.rageMode) {
            this.enterRageMode();
        }
    }
    
    /**
     * Enter rage mode
     */
    enterRageMode() {
        // Set rage mode
        self.rageMode = true;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            // Increase speed
            physics.maxSpeed *= self.rageSpeedMultiplier;
        }
        
        // Change color
        this.color = '#ff3333';
        
        // Emit rage mode event
        window.eventSystem.emit('enemy:rage', this);
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
        
        // Update charge distance if charging
        if (this.isCharging) {
            // Calculate distance traveled this frame
            const physics = this.getComponent('Physics');
            if (physics) {
                const frameDistance = Math.sqrt(
                    physics.velocity.x * physics.velocity.x + 
                    physics.velocity.y * physics.velocity.y
                ) * deltaTime;
                
                self.chargeDistanceTraveled += frameDistance;
                
                // Stop charging if reached maximum distance
                if (self.chargeDistanceTraveled >= this.chargeDistance) {
                    this.stopCharging();
                }
            }
        }
        
        // Decide on action based on state
        if (this.isCharging) {
            // Continue charging
            this.continueCharging(direction);
        } else if (distance <= this.attackRange && this.canAttack) {
            // Attack player
            this.attackPlayer(direction);
        } else if (self.canCharge && distance >= this.chargeMinDistance && Math.random() < this.chargeChance) {
            // Charge at player
            this.startCharge(direction);
        } else {
            // Move toward player
            this.moveTowardPlayer(direction);
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
        
        // Start attack windup
        this.isAttacking = true;
        this.attackTimer = this.attackWindup;
        this.canAttack = false;
        
        // Set attack cooldown
        setTimeout(() => {
            this.canAttack = true;
        }, this.attackCooldown * 1000);
        
        // Execute attack after windup
        setTimeout(() => {
            this.executeAttack(direction);
        }, this.attackWindup * 1000);
        
        // Emit attack windup event
        window.eventSystem.emit('enemy:attackWindup', this);
    }
    
    /**
     * Execute attack
     * @param {number} direction - Direction to attack
     */
    executeAttack(direction) {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Calculate attack area
        const attackDistance = this.attackRange + 20;
        const attackWidth = 40;
        
        // Find all entities in attack area
        const entities = this.gameEngine.getEntities();
        for (const entity of entities) {
            // Skip self and non-players
            if (entity === this || !entity.hasTag('player')) continue;
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if entity is in attack range
            if (distance <= attackDistance) {
                // Calculate angle to entity
                const angleToEntity = Math.atan2(dy, dx);
                const angleDiff = Math.abs(MathUtils.angleDifference(direction, angleToEntity));
                
                // Check if entity is within attack width
                if (angleDiff <= Math.atan(attackWidth / (2 * distance))) {
                    // Calculate damage
                    const damage = self.rageMode ? 
                        this.damage * self.rageDamageMultiplier : 
                        this.damage;
                    
                    // Apply damage if entity has health
                    const health = entity.getComponent('Health');
                    if (health) {
                        health.takeDamage(damage, this);
                    }
                    
                    // Apply knockback if entity has physics
                    const physics = entity.getComponent('Physics');
                    if (physics) {
                        const knockbackForce = 250;
                        physics.velocity.x += Math.cos(angleToEntity) * knockbackForce;
                        physics.velocity.y += Math.sin(angleToEntity) * knockbackForce;
                    }
                    
                    // Emit attack hit event
                    window.eventSystem.emit('enemy:attackHit', this, entity);
                }
            }
        }
        
        // Set attack duration
        this.attackTimer = this.attackDuration;
        
        // Emit attack event
        window.eventSystem.emit('enemy:attack', this);
    }
    
    /**
     * Start charge
     * @param {number} direction - Direction to charge
     */
    startCharge(direction) {
        // Check if can charge
        if (!self.canCharge || this.isCharging) return;
        
        // Start charge
        this.isCharging = true;
        self.canCharge = false;
        self.chargeDirection = direction;
        self.chargeDistanceTraveled = 0;
        
        // Set charge cooldown
        this.chargeTimer = this.chargeCooldown;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            // Increase speed for charge
            const chargeSpeed = self.rageMode ? 
                this.chargeSpeed * self.rageSpeedMultiplier : 
                this.chargeSpeed;
            physics.maxSpeed = chargeSpeed;
        }
        
        // Emit charge start event
        window.eventSystem.emit('enemy:chargeStart', this);
    }
    
    /**
     * Continue charging
     * @param {number} direction - Direction to charge
     */
    continueCharging(direction) {
        // Apply movement input
        this.input.up = Math.cos(self.chargeDirection) > 0;
        this.input.down = Math.cos(self.chargeDirection) < 0;
        this.input.left = Math.sin(self.chargeDirection) < 0;
        this.input.right = Math.sin(self.chargeDirection) > 0;
        
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Check for collision with players
        const entities = this.gameEngine.getEntities();
        for (const entity of entities) {
            // Skip self and non-players
            if (entity === this || !entity.hasTag('player')) continue;
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if collided with player
            if (distance <= this.size + 20) {
                // Calculate damage
                const damage = self.rageMode ? 
                    this.chargeDamage * self.rageDamageMultiplier : 
                    this.chargeDamage;
                
                // Apply damage if entity has health
                const health = entity.getComponent('Health');
                if (health) {
                    health.takeDamage(damage, this);
                }
                
                // Apply knockback if entity has physics
                const physics = entity.getComponent('Physics');
                if (physics) {
                    const knockbackDirection = Math.atan2(dy, dx);
                    physics.velocity.x += Math.cos(knockbackDirection) * this.chargeKnockback;
                    physics.velocity.y += Math.sin(knockbackDirection) * this.chargeKnockback;
                }
                
                // Stop charging
                this.stopCharging();
                
                // Emit charge hit event
                window.eventSystem.emit('enemy:chargeHit', this, entity);
                
                break;
            }
        }
    }
    
    /**
     * Stop charging
     */
    stopCharging() {
        // Stop charging
        this.isCharging = false;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            // Restore speed
            const baseSpeed = self.rageMode ? 
                this.speed * self.rageSpeedMultiplier : 
                this.speed;
            physics.maxSpeed = baseSpeed;
        }
        
        // Emit charge end event
        window.eventSystem.emit('enemy:chargeEnd', this);
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
     * Render the bruiser enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderBruiser(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw bruiser body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        
        // Draw bruiser details
        ctx.fillStyle = '#cc4422';
        
        // Draw head
        ctx.fillRect(-this.size * 0.8, -this.size * 1.2, this.size * 1.6, this.size * 0.6);
        
        // Draw eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.size * 0.5, -this.size * 1.0, this.size * 0.3, this.size * 0.2);
        ctx.fillRect(this.size * 0.2, -this.size * 1.0, this.size * 0.3, this.size * 0.2);
        
        // Draw arms
        ctx.fillStyle = this.color;
        
        // Left arm
        if (this.isAttacking || this.isCharging) {
            // Extended arm
            ctx.fillRect(-this.size * 1.5, -this.size * 0.5, this.size * 0.8, this.size);
        } else {
            // Normal arm
            ctx.fillRect(-this.size * 1.2, -this.size * 0.3, this.size * 0.5, this.size * 0.8);
        }
        
        // Right arm
        if (this.isAttacking || this.isCharging) {
            // Extended arm
            ctx.fillRect(this.size * 0.7, -this.size * 0.5, this.size * 0.8, this.size);
        } else {
            // Normal arm
            ctx.fillRect(this.size * 0.7, -this.size * 0.3, this.size * 0.5, this.size * 0.8);
        }
        
        // Draw legs
        ctx.fillRect(-this.size * 0.8, this.size * 0.8, this.size * 0.6, this.size * 0.8);
        ctx.fillRect(this.size * 0.2, this.size * 0.8, this.size * 0.6, this.size * 0.8);
        
        // Draw attack windup effect
        if (this.isAttacking && this.attackTimer > this.attackDuration) {
            ctx.strokeStyle = '#ff9933';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Draw charge effect
        if (this.isCharging) {
            // Draw motion lines
            ctx.strokeStyle = '#ff9933';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            
            for (let i = 1; i <= 3; i++) {
                const lineLength = this.size * i * 0.5;
                const lineDirection = self.chargeDirection + Math.PI;
                
                ctx.beginPath();
                ctx.moveTo(
                    Math.cos(lineDirection) * this.size,
                    Math.sin(lineDirection) * this.size
                );
                ctx.lineTo(
                    Math.cos(lineDirection) * (this.size + lineLength),
                    Math.sin(lineDirection) * (this.size + lineLength)
                );
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
        }
        
        // Draw rage mode indicator
        if (self.rageMode) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.2, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw health bar
        const health = entity.getComponent('Health');
        if (health) {
            const healthPercentage = health.getHealthPercentage();
            
            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(-this.size, -this.size - 15, this.size * 2, 5);
            
            // Health
            ctx.fillStyle = self.rageMode ? '#ff0000' : '#ff3333';
            ctx.fillRect(-this.size, -this.size - 15, this.size * 2 * healthPercentage, 5);
        }
    }
    
    /**
     * Serialize bruiser for network transmission
     * @returns {object} Serialized bruiser data
     */
    serialize() {
        const data = super.serialize();
        
        // Add bruiser-specific data
        data.attackTimer = this.attackTimer;
        data.chargeTimer = this.chargeTimer;
        data.isAttacking = this.isAttacking;
        data.isCharging = this.isCharging;
        data.canAttack = this.canAttack;
        data.canCharge = self.canCharge;
        data.chargeDirection = self.chargeDirection;
        data.chargeDistanceTraveled = self.chargeDistanceTraveled;
        data.rageMode = self.rageMode;
        
        return data;
    }
    
    /**
     * Deserialize bruiser data
     * @param {object} data - Serialized bruiser data
     * @returns {Bruiser} This bruiser for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set bruiser-specific data
        this.attackTimer = data.attackTimer || 0;
        this.chargeTimer = data.chargeTimer || 0;
        this.isAttacking = data.isAttacking || false;
        this.isCharging = data.isCharging || false;
        this.canAttack = data.canAttack || true;
        self.canCharge = data.canCharge || true;
        self.chargeDirection = data.chargeDirection || 0;
        self.chargeDistanceTraveled = data.chargeDistanceTraveled || 0;
        self.rageMode = data.rageMode || false;
        
        // Apply rage mode effects if active
        if (self.rageMode) {
            this.enterRageMode();
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bruiser;
}