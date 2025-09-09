/**
 * Arcade Meltdown - Medic Player Class
 * Medic class with healing abilities and support skills
 */

import Player from '../player.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Medic extends Player {
    /**
     * Create a new Medic player
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'medic');
        
        // Medic-specific properties
        this.speed = 220; // Moderate-fast movement speed
        this.health = 120; // Lower health
        this.armor = 0.15; // 15% damage reduction
        this.specialCooldown = 0;
        this.maxSpecialCooldown = 10; // 10 seconds
        this.specialDuration = 0;
        this.maxSpecialDuration = 4; // 4 seconds
        this.specialActive = false;
        
        // Healing properties
        this.healAmount = 30;
        this.healRange = 200;
        this.healCooldown = 0;
        this.maxHealCooldown = 2; // 2 seconds
        this.overhealAmount = 10; // Temporary health bonus
        this.overhealDuration = 10; // 10 seconds
        
        // Revive properties
        this.reviveRange = 150;
        this.reviveTime = 3; // 3 seconds
        this.reviveCooldown = 0;
        this.maxReviveCooldown = 15; // 15 seconds
        this.isReviving = false;
        this.reviveTarget = null;
        this.reviveTimer = 0;
        
        // Support properties
        this.damageBoost = 0.2; // 20% damage boost to healed players
        this.damageBoostDuration = 5; // 5 seconds
        this.resistanceBoost = 0.2; // 20% damage resistance to healed players
        this.resistanceBoostDuration = 5; // 5 seconds
        
        // Active effects on players
        this.activeEffects = new Map(); // playerId -> {damageBoost, resistanceBoost, overheal, timers}
        
        // Initialize medic-specific components
        this.initMedicComponents();
    }
    
    /**
     * Initialize medic-specific components
     */
    initMedicComponents() {
        // Get components
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        const render = this.getComponent('Render');
        const weapon = this.getComponent('Weapon');
        
        // Update physics component
        if (physics) {
            physics.maxSpeed = this.speed;
            physics.acceleration = 450;
            physics.deceleration = 700;
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
            health.setArmor(this.armor);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderMedic.bind(this);
        }
        
        // Update weapon component
        if (weapon) {
            // Set initial weapon to SMG
            weapon.setWeapon('smg');
        }
    }
    
    /**
     * Update the medic player
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
        
        // Update heal cooldown
        if (this.healCooldown > 0) {
            this.healCooldown -= deltaTime;
        }
        
        // Update revive cooldown
        if (this.reviveCooldown > 0) {
            this.reviveCooldown -= deltaTime;
        }
        
        // Update revive timer
        if (this.isReviving) {
            this.reviveTimer -= deltaTime;
            
            if (this.reviveTimer <= 0) {
                this.completeRevive();
            }
        }
        
        // Update active effects
        this.updateActiveEffects(deltaTime);
        
        // Handle special ability input
        if (this.input.special && this.specialCooldown <= 0 && !this.specialActive) {
            this.activateSpecialAbility();
        }
        
        // Handle heal input
        if (this.input.heal && this.healCooldown <= 0 && !this.isReviving) {
            this.healNearbyPlayers();
        }
        
        // Handle revive input
        if (this.input.revive && this.reviveCooldown <= 0 && !this.isReviving) {
            this.startRevive();
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
        window.eventSystem.emit('player:specialAbility', this, 'medic');
    }
    
    /**
     * Deactivate special ability
     */
    deactivateSpecialAbility() {
        this.specialActive = false;
        
        // Remove special ability effects
        this.removeSpecialAbilityEffects();
        
        // Emit special ability end event
        window.eventSystem.emit('player:specialAbilityEnd', this, 'medic');
    }
    
    /**
     * Apply special ability effects
     */
    applySpecialAbilityEffects() {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (weapon) {
            // Increase fire rate
            weapon.fireRate *= 1.5;
            
            // Increase damage
            weapon.damage *= 1.5;
        }
        
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Change color to indicate special ability
            render.color = '#55ff55';
        }
        
        // Heal all nearby players
        this.healNearbyPlayers(true);
    }
    
    /**
     * Remove special ability effects
     */
    removeSpecialAbilityEffects() {
        // Get weapon component
        const weapon = this.getComponent('Weapon');
        
        if (weapon) {
            // Restore fire rate
            weapon.fireRate /= 1.5;
            
            // Restore damage
            weapon.damage /= 1.5;
        }
        
        // Get render component
        const render = this.getComponent('Render');
        
        if (render) {
            // Restore color
            render.color = '#88ff88';
        }
    }
    
    /**
     * Heal nearby players
     * @param {boolean} isSpecial - Whether this is a special ability heal
     */
    healNearbyPlayers(isSpecial = false) {
        // Get player transform
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Get all players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        // Heal each player within range
        for (const player of players) {
            // Skip self
            if (player === this) continue;
            
            // Get player transform
            const playerTransform = player.getComponent('Transform');
            if (!playerTransform) continue;
            
            // Calculate distance to player
            const dx = playerTransform.x - transform.x;
            const dy = playerTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Heal if within range
            if (distance <= this.healRange) {
                // Get player health component
                const health = player.getComponent('Health');
                if (health) {
                    // Calculate heal amount
                    const healAmount = isSpecial ? this.healAmount * 2 : this.healAmount;
                    
                    // Heal player
                    const overheal = health.heal(healAmount, this.overhealAmount, this.overhealDuration);
                    
                    // Apply damage boost
                    this.applyDamageBoost(player, this.damageBoost, this.damageBoostDuration);
                    
                    // Apply resistance boost
                    this.applyResistanceBoost(player, this.resistanceBoost, this.resistanceBoostDuration);
                    
                    // Emit player healed event
                    window.eventSystem.emit('player:healed', this, player, healAmount, overheal);
                }
            }
        }
        
        // Set heal cooldown
        this.healCooldown = this.maxHealCooldown;
    }
    
    /**
     * Start revive process
     */
    startRevive() {
        // Get player transform
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Get all dead players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        // Find nearest dead player
        let nearestPlayer = null;
        let nearestDistance = Infinity;
        
        for (const player of players) {
            // Skip self and alive players
            if (player === this || player.isActive()) continue;
            
            // Get player transform
            const playerTransform = player.getComponent('Transform');
            if (!playerTransform) continue;
            
            // Calculate distance to player
            const dx = playerTransform.x - transform.x;
            const dy = playerTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if this is the nearest player
            if (distance < nearestDistance && distance <= this.reviveRange) {
                nearestDistance = distance;
                nearestPlayer = player;
            }
        }
        
        // Start revive if a player was found
        if (nearestPlayer) {
            this.isReviving = true;
            this.reviveTarget = nearestPlayer;
            this.reviveTimer = this.reviveTime;
            
            // Emit revive start event
            window.eventSystem.emit('player:reviveStart', this, nearestPlayer);
        }
    }
    
    /**
     * Complete revive process
     */
    completeRevive() {
        if (!this.reviveTarget) return;
        
        // Revive target
        this.reviveTarget.revive();
        
        // Apply damage boost
        this.applyDamageBoost(this.reviveTarget, this.damageBoost, this.damageBoostDuration);
        
        // Apply resistance boost
        this.applyResistanceBoost(this.reviveTarget, this.resistanceBoost, this.resistanceBoostDuration);
        
        // Emit revive complete event
        window.eventSystem.emit('player:reviveComplete', this, this.reviveTarget);
        
        // Reset revive state
        this.isReviving = false;
        this.reviveTarget = null;
        
        // Set revive cooldown
        this.reviveCooldown = this.maxReviveCooldown;
    }
    
    /**
     * Apply damage boost to a player
     * @param {Player} player - Player to boost
     * @param {number} amount - Damage boost amount
     * @param {number} duration - Boost duration
     */
    applyDamageBoost(player, amount, duration) {
        // Get or create player effects
        let effects = this.activeEffects.get(player.id);
        if (!effects) {
            effects = {
                damageBoost: 0,
                resistanceBoost: 0,
                overheal: 0,
                timers: {
                    damageBoost: 0,
                    resistanceBoost: 0,
                    overheal: 0
                }
            };
            this.activeEffects.set(player.id, effects);
        }
        
        // Apply damage boost
        effects.damageBoost = amount;
        effects.timers.damageBoost = duration;
        
        // Get weapon component
        const weapon = player.getComponent('Weapon');
        if (weapon) {
            // Apply damage multiplier
            weapon.damageMultiplier = 1 + effects.damageBoost;
        }
    }
    
    /**
     * Apply resistance boost to a player
     * @param {Player} player - Player to boost
     * @param {number} amount - Resistance boost amount
     * @param {number} duration - Boost duration
     */
    applyResistanceBoost(player, amount, duration) {
        // Get or create player effects
        let effects = this.activeEffects.get(player.id);
        if (!effects) {
            effects = {
                damageBoost: 0,
                resistanceBoost: 0,
                overheal: 0,
                timers: {
                    damageBoost: 0,
                    resistanceBoost: 0,
                    overheal: 0
                }
            };
            this.activeEffects.set(player.id, effects);
        }
        
        // Apply resistance boost
        effects.resistanceBoost = amount;
        effects.timers.resistanceBoost = duration;
        
        // Get health component
        const health = player.getComponent('Health');
        if (health) {
            // Apply armor bonus
            health.setArmor(health.baseArmor + effects.resistanceBoost);
        }
    }
    
    /**
     * Update active effects
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateActiveEffects(deltaTime) {
        // Update each effect
        for (const [playerId, effects] of this.activeEffects) {
            // Update damage boost timer
            if (effects.timers.damageBoost > 0) {
                effects.timers.damageBoost -= deltaTime;
                
                // Remove effect if timer expired
                if (effects.timers.damageBoost <= 0) {
                    effects.damageBoost = 0;
                    
                    // Get player
                    const player = this.gameEngine.getEntity(playerId);
                    if (player) {
                        // Get weapon component
                        const weapon = player.getComponent('Weapon');
                        if (weapon) {
                            // Reset damage multiplier
                            weapon.damageMultiplier = 1;
                        }
                    }
                }
            }
            
            // Update resistance boost timer
            if (effects.timers.resistanceBoost > 0) {
                effects.timers.resistanceBoost -= deltaTime;
                
                // Remove effect if timer expired
                if (effects.timers.resistanceBoost <= 0) {
                    effects.resistanceBoost = 0;
                    
                    // Get player
                    const player = this.gameEngine.getEntity(playerId);
                    if (player) {
                        // Get health component
                        const health = player.getComponent('Health');
                        if (health) {
                            // Reset armor
                            health.setArmor(health.baseArmor);
                        }
                    }
                }
            }
            
            // Update overheal timer
            if (effects.timers.overheal > 0) {
                effects.timers.overheal -= deltaTime;
                
                // Remove effect if timer expired
                if (effects.timers.overheal <= 0) {
                    effects.overheal = 0;
                    
                    // Get player
                    const player = this.gameEngine.getEntity(playerId);
                    if (player) {
                        // Get health component
                        const health = player.getComponent('Health');
                        if (health) {
                            // Remove overheal
                            health.removeOverheal();
                        }
                    }
                }
            }
            
            // Remove player effects if all timers expired
            if (effects.timers.damageBoost <= 0 && 
                effects.timers.resistanceBoost <= 0 && 
                effects.timers.overheal <= 0) {
                this.activeEffects.delete(playerId);
            }
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
     * Render the medic player
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderMedic(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw medic player (moderate size, medical appearance)
        ctx.fillStyle = entity.getComponent('Render').color;
        ctx.fillRect(-15, -15, 30, 30);
        
        // Draw medical cross
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -15, 6, 30);
        ctx.fillRect(-15, -3, 30, 6);
        
        // Draw helmet
        ctx.fillStyle = '#666666';
        ctx.fillRect(-12, -20, 24, 10);
        
        // Draw visor
        ctx.fillStyle = '#55ff55';
        ctx.fillRect(-8, -17, 16, 4);
        
        // Draw medical kit
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, -10, 10, 20);
        ctx.fillStyle = '#ff5555';
        ctx.fillRect(17, -8, 6, 16);
        
        // Draw weapon
        this.renderWeapon(ctx, transform);
        
        // Draw special ability indicator
        if (this.specialActive) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw revive progress
        if (this.isReviving) {
            ctx.fillStyle = '#55ff55';
            ctx.fillRect(-20, -30, 40 * (1 - this.reviveTimer / this.reviveTime), 5);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(-20, -30, 40, 5);
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
                
            case 'plasma':
                // Draw plasma rifle
                ctx.fillStyle = '#666666';
                ctx.fillRect(15, -5, 25, 10);
                
                // Draw barrel
                ctx.fillStyle = '#444444';
                ctx.fillRect(40, -3, 15, 6);
                
                // Draw energy cell
                ctx.fillStyle = '#55ffff';
                ctx.fillRect(20, -3, 8, 6);
                break;
        }
    }
    
    /**
     * Serialize medic player for network transmission
     * @returns {object} Serialized medic player data
     */
    serialize() {
        const data = super.serialize();
        
        // Add medic-specific data
        data.specialCooldown = this.specialCooldown;
        data.specialDuration = this.specialDuration;
        data.specialActive = this.specialActive;
        data.healCooldown = this.healCooldown;
        data.reviveCooldown = this.reviveCooldown;
        data.isReviving = this.isReviving;
        data.reviveTimer = this.reviveTimer;
        
        return data;
    }
    
    /**
     * Deserialize medic player data
     * @param {object} data - Serialized medic player data
     * @returns {Medic} This medic player for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set medic-specific data
        this.specialCooldown = data.specialCooldown || 0;
        this.specialDuration = data.specialDuration || 0;
        this.specialActive = data.specialActive || false;
        this.healCooldown = data.healCooldown || 0;
        this.reviveCooldown = data.reviveCooldown || 0;
        this.isReviving = data.isReviving || false;
        this.reviveTimer = data.reviveTimer || 0;
        
        // Apply special ability effects if active
        if (this.specialActive) {
            this.applySpecialAbilityEffects();
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Medic;
}