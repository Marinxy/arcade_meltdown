/**
 * Arcade Meltdown - Scout Player Class
 * Scout class with high speed and agility
 */

import Player from '../player.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Scout extends Player {
    /**
     * Create a new Scout player
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'scout');
        
        // Scout-specific properties
        this.speed = 300; // Faster movement speed
        this.health = 100; // Lower health
        this.dodgeChance = 0.2; // 20% chance to dodge attacks
        this.criticalChance = 0.25; // 25% chance for critical hits
        this.criticalMultiplier = 2; // Critical hits do 2x damage
        this.specialCooldown = 0;
        this.maxSpecialCooldown = 8; // 8 seconds
        this.specialDuration = 0;
        this.maxSpecialDuration = 2; // 2 seconds
        this.specialActive = false;
        this.dashCooldown = 0;
        this.maxDashCooldown = 3; // 3 seconds
        this.isDashing = false;
        this.dashSpeed = 600;
        this.dashDuration = 0.2;
        this.dashTimer = 0;
        
        // Initialize scout-specific components
        this.initScoutComponents();
    }
    
    /**
     * Initialize scout-specific components
     */
    initScoutComponents() {
        // Get components
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        const render = this.getComponent('Render');
        const weapon = this.getComponent('Weapon');
        
        // Update physics component
        if (physics) {
            physics.maxSpeed = this.speed;
            physics.acceleration = 500;
            physics.deceleration = 800;
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderScout.bind(this);
        }
        
        // Update weapon component
        if (weapon) {
            // Set initial weapon to SMG
            weapon.setWeapon('smg');
        }
    }
    
    /**
     * Update the scout player
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Update special cooldown
        if (this.specialCooldown > 0) {
            this.specialCooldown -= deltaTime;
        }
        
        // Update special duration
        if (this.specialActive) {
            this.specialDuration -= deltaTime;
            
            if (this.specialDuration <= 0) {
                this.deactivateSpecialAbility();
            }
        }
        
        // Update dash cooldown
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }
        
        // Update dash
        if (this.isDashing) {
            this.dashTimer -= deltaTime;
            
            if (this.dashTimer <= 0) {
                this.endDash();
            }
        }
        
        // Handle special ability input
        if (this.input.special && this.specialCooldown <= 0 && !this.specialActive) {
            this.activateSpecialAbility();
        }
        
        // Handle dash input
        if (this.input.dash && this.dashCooldown <= 0 && !this.isDashing) {
            this.startDash();
        }
    }
    
    /**
     * Activate special ability
     */
    activateSpecialAbility() {
        this.specialActive = true;
        this.specialDuration = this.maxSpecialDuration;
        this.specialCooldown = this.maxSpecialCooldown;
        
        // Apply special ability effects
        this.applySpecialAbilityEffects();
        
        // Emit special ability event
        window.eventSystem.emit('player:specialAbility', this, 'scout');
    }
    
    /**
     * Deactivate special ability
     */
    deactivateSpecialAbility() {
        this.specialActive = false;
        
        // Remove special ability effects
        this.removeSpecialAbilityEffects();
        
        // Emit special ability end event
        window.eventSystem.emit('player:specialAbilityEnd', this, 'scout');
    }
    
    /**
     * Apply special ability effects
     */
    applySpecialAbilityEffects() {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (weapon) {
            // Increase critical chance
            this.criticalChance = 0.5;
            
            // Increase critical multiplier
            this.criticalMultiplier = 3;
        }
        
        // Get physics component
        const physics = this.getComponent('Physics');
        
        if (physics) {
            // Increase movement speed
            physics.maxSpeed = this.speed * 1.5;
        }
        
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Change color to indicate special ability
            render.color = '#55ffff';
        }
    }
    
    /**
     * Remove special ability effects
     */
    removeSpecialAbilityEffects() {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (weapon) {
            // Restore critical chance
            this.criticalChance = 0.25;
            
            // Restore critical multiplier
            this.criticalMultiplier = 2;
        }
        
        // Get physics component
        const physics = this.getComponent('Physics');
        
        if (physics) {
            // Restore movement speed
            physics.maxSpeed = this.speed;
        }
        
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Restore color
            render.color = '#88ffff';
        }
    }
    
    /**
     * Start dash
     */
    startDash() {
        this.isDashing = true;
        this.dashTimer = this.dashDuration;
        this.dashCooldown = this.maxDashCooldown;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        
        if (physics) {
            // Store current velocity
            this.normalVelocity = { ...physics.velocity };
            
            // Calculate dash direction based on input
            let dashX = 0;
            let dashY = 0;
            
            if (this.input.up) dashY -= 1;
            if (this.input.down) dashY += 1;
            if (this.input.left) dashX -= 1;
            if (this.input.right) dashX += 1;
            
            // Normalize dash direction
            const length = Math.sqrt(dashX * dashX + dashY * dashY);
            if (length > 0) {
                dashX /= length;
                dashY /= length;
            } else {
                // Default to facing direction if no input
                const transform = this.getComponent('Transform');
                dashX = Math.cos(transform.rotation);
                dashY = Math.sin(transform.rotation);
            }
            
            // Apply dash velocity
            physics.velocity.x = dashX * this.dashSpeed;
            physics.velocity.y = dashY * this.dashSpeed;
        }
        
        // Apply dash effects
        this.applyDashEffects();
        
        // Emit dash start event
        window.eventSystem.emit('player:dashStart', this);
    }
    
    /**
     * End dash
     */
    endDash() {
        this.isDashing = false;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        
        if (physics) {
            // Restore normal velocity
            if (this.normalVelocity) {
                physics.velocity = { ...this.normalVelocity };
            } else {
                physics.velocity.x = 0;
                physics.velocity.y = 0;
            }
        }
        
        // Remove dash effects
        this.removeDashEffects();
        
        // Emit dash end event
        window.eventSystem.emit('player:dashEnd', this);
    }
    
    /**
     * Apply dash effects
     */
    applyDashEffects() {
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Add transparency effect
            render.opacity = 0.5;
        }
        
        // Become invulnerable during dash
        this.invulnerable = true;
    }
    
    /**
     * Remove dash effects
     */
    removeDashEffects() {
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Restore opacity
            render.opacity = 1;
        }
        
        // Restore vulnerability
        this.invulnerable = false;
    }
    
    /**
     * Take damage
     * @param {number} damage - Amount of damage
     * @param {Entity} source - Source of damage
     */
    takeDamage(damage, source) {
        // Check for dodge
        if (Math.random() < this.dodgeChance) {
            // Emit dodge event
            window.eventSystem.emit('player:dodge', this, source);
            return;
        }
        
        // Call parent takeDamage
        super.takeDamage(damage, source);
    }
    
    /**
     * Calculate damage
     * @param {number} baseDamage - Base damage
     * @returns {number} Final damage
     */
    calculateDamage(baseDamage) {
        // Check for critical hit
        if (Math.random() < this.criticalChance) {
            // Emit critical hit event
            window.eventSystem.emit('player:criticalHit', this);
            
            // Apply critical multiplier
            return baseDamage * this.criticalMultiplier;
        }
        
        return baseDamage;
    }
    
    /**
     * Render the scout player
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderScout(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw scout player (smaller, sleeker)
        ctx.fillStyle = entity.getComponent('Render').color;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(15, 15);
        ctx.lineTo(-15, 15);
        ctx.closePath();
        ctx.fill();
        
        // Draw helmet
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, -5);
        ctx.lineTo(-10, -5);
        ctx.closePath();
        ctx.fill();
        
        // Draw visor
        ctx.fillStyle = '#55ffff';
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(7, -7);
        ctx.lineTo(-7, -7);
        ctx.closePath();
        ctx.fill();
        
        // Draw weapon
        this.renderWeapon(ctx, transform);
        
        // Draw special ability indicator
        if (this.specialActive) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw dash indicator
        if (this.isDashing) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-20, -20);
            ctx.lineTo(20, 20);
            ctx.moveTo(20, -20);
            ctx.lineTo(-20, 20);
            ctx.stroke();
        }
    }
    
    /**
     * Render weapon
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Transform} transform - Transform component
     */
    renderWeapon(ctx, transform) {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (!weapon) return;
        
        // Draw weapon based on type
        switch (weapon.weaponType) {
            case 'smg':
                // Draw SMG
                ctx.fillStyle = '#666666';
                ctx.fillRect(15, -4, 20, 8);
                
                // Draw barrel
                ctx.fillStyle = '#444444';
                ctx.fillRect(35, -2, 10, 4);
                
                // Draw magazine
                ctx.fillStyle = '#333333';
                ctx.fillRect(20, 4, 8, 6);
                break;
                
            case 'sniper':
                // Draw sniper rifle
                ctx.fillStyle = '#666666';
                ctx.fillRect(15, -5, 30, 10);
                
                // Draw barrel
                ctx.fillStyle = '#444444';
                ctx.fillRect(45, -3, 20, 6);
                
                // Draw scope
                ctx.fillStyle = '#333333';
                ctx.fillRect(25, -8, 10, 6);
                break;
        }
    }
    
    /**
     * Serialize scout player for network transmission
     * @returns {object} Serialized scout player data
     */
    serialize() {
        const data = super.serialize();
        
        // Add scout-specific data
        data.specialCooldown = this.specialCooldown;
        data.specialDuration = this.specialDuration;
        data.specialActive = this.specialActive;
        data.dashCooldown = this.dashCooldown;
        data.isDashing = this.isDashing;
        data.dashTimer = this.dashTimer;
        
        return data;
    }
    
    /**
     * Deserialize scout player data
     * @param {object} data - Serialized scout player data
     * @returns {Scout} This scout player for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set scout-specific data
        this.specialCooldown = data.specialCooldown || 0;
        this.specialDuration = data.specialDuration || 0;
        this.specialActive = data.specialActive || false;
        this.dashCooldown = data.dashCooldown || 0;
        this.isDashing = data.isDashing || false;
        this.dashTimer = data.dashTimer || 0;
        
        // Apply special ability effects if active
        if (this.specialActive) {
            this.applySpecialAbilityEffects();
        }
        
        // Apply dash effects if dashing
        if (this.isDashing) {
            this.applyDashEffects();
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scout;
}