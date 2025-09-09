/**
 * Arcade Meltdown - Heavy Player Class
 * Heavy class with high health and powerful weapons
 */

import Player from '../player.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Heavy extends Player {
    /**
     * Create a new Heavy player
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'heavy');
        
        // Heavy-specific properties
        this.speed = 150; // Slower movement speed
        this.health = 200; // Higher health
        this.armor = 0.5; // 50% damage reduction
        this.specialCooldown = 0;
        this.maxSpecialCooldown = 10; // 10 seconds
        this.specialDuration = 0;
        this.maxSpecialDuration = 3; // 3 seconds
        this.specialActive = false;
        
        // Initialize heavy-specific components
        this.initHeavyComponents();
    }
    
    /**
     * Initialize heavy-specific components
     */
    initHeavyComponents() {
        // Get components
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        const render = this.getComponent('Render');
        const weapon = this.getComponent('Weapon');
        
        // Update physics component
        if (physics) {
            physics.maxSpeed = this.speed;
            physics.acceleration = 300;
            physics.deceleration = 500;
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
            health.setArmor(this.armor);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderHeavy.bind(this);
        }
        
        // Update weapon component
        if (weapon) {
            // Set initial weapon to minigun
            weapon.setWeapon('minigun');
        }
    }
    
    /**
     * Update the heavy player
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
        
        // Handle special ability input
        if (this.input.special && this.specialCooldown <= 0 && !this.specialActive) {
            this.activateSpecialAbility();
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
        window.eventSystem.emit('player:specialAbility', this, 'heavy');
    }
    
    /**
     * Deactivate special ability
     */
    deactivateSpecialAbility() {
        this.specialActive = false;
        
        // Remove special ability effects
        this.removeSpecialAbilityEffects();
        
        // Emit special ability end event
        window.eventSystem.emit('player:specialAbilityEnd', this, 'heavy');
    }
    
    /**
     * Apply special ability effects
     */
    applySpecialAbilityEffects() {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (weapon) {
            // Increase fire rate
            weapon.fireRate *= 2;
            
            // Increase damage
            weapon.damage *= 1.5;
        }
        
        // Get physics component
        const physics = this.getComponent('Physics');
        
        if (physics) {
            // Increase movement speed
            physics.maxSpeed *= 1.5;
        }
        
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Change color to indicate special ability
            render.color = '#ff5555';
        }
    }
    
    /**
     * Remove special ability effects
     */
    removeSpecialAbilityEffects() {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (weapon) {
            // Restore fire rate
            weapon.fireRate /= 2;
            
            // Restore damage
            weapon.damage /= 1.5;
        }
        
        // Get physics component
        const physics = this.getComponent('Physics');
        
        if (physics) {
            // Restore movement speed
            physics.maxSpeed /= 1.5;
        }
        
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Restore color
            render.color = '#ff8888';
        }
    }
    
    /**
     * Take damage
     * @param {number} damage - Amount of damage
     * @param {Entity} source - Source of damage
     */
    takeDamage(damage, source) {
        // Apply armor reduction
        const reducedDamage = damage * (1 - this.armor);
        
        // Call parent takeDamage
        super.takeDamage(reducedDamage, source);
    }
    
    /**
     * Render the heavy player
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderHeavy(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw heavy player (larger, more armored)
        ctx.fillStyle = entity.getComponent('Render').color;
        ctx.fillRect(-20, -20, 40, 40);
        
        // Draw armor details
        ctx.fillStyle = '#333333';
        ctx.fillRect(-20, -20, 40, 10);
        ctx.fillRect(-20, 10, 40, 10);
        ctx.fillRect(-20, -20, 10, 40);
        ctx.fillRect(10, -20, 10, 40);
        
        // Draw helmet
        ctx.fillStyle = '#444444';
        ctx.fillRect(-15, -25, 30, 15);
        
        // Draw visor
        ctx.fillStyle = '#55ffff';
        ctx.fillRect(-10, -20, 20, 5);
        
        // Draw weapon
        this.renderWeapon(ctx, transform);
        
        // Draw special ability indicator
        if (this.specialActive) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
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
            case 'minigun':
                // Draw minigun
                ctx.fillStyle = '#666666';
                ctx.fillRect(20, -5, 25, 10);
                
                // Draw barrels
                ctx.fillStyle = '#444444';
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(45, -3 + i * 2, 10, 2);
                }
                
                // Draw ammo belt
                ctx.fillStyle = '#888888';
                ctx.beginPath();
                ctx.moveTo(20, -5);
                ctx.lineTo(10, -10);
                ctx.lineTo(10, 10);
                ctx.lineTo(20, 5);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'rocketLauncher':
                // Draw rocket launcher
                ctx.fillStyle = '#666666';
                ctx.fillRect(20, -8, 30, 16);
                
                // Draw barrel
                ctx.fillStyle = '#444444';
                ctx.fillRect(50, -5, 20, 10);
                
                // Draw grip
                ctx.fillStyle = '#333333';
                ctx.fillRect(25, -8, 5, 16);
                break;
        }
    }
    
    /**
     * Serialize heavy player for network transmission
     * @returns {object} Serialized heavy player data
     */
    serialize() {
        const data = super.serialize();
        
        // Add heavy-specific data
        data.specialCooldown = this.specialCooldown;
        data.specialDuration = this.specialDuration;
        data.specialActive = this.specialActive;
        
        return data;
    }
    
    /**
     * Deserialize heavy player data
     * @param {object} data - Serialized heavy player data
     * @returns {Heavy} This heavy player for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set heavy-specific data
        this.specialCooldown = data.specialCooldown || 0;
        this.specialDuration = data.specialDuration || 0;
        this.specialActive = data.specialActive || false;
        
        // Apply special ability effects if active
        if (this.specialActive) {
            this.applySpecialAbilityEffects();
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Heavy;
}