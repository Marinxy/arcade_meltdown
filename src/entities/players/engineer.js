/**
 * Arcade Meltdown - Engineer Player Class
 * Engineer class with defensive abilities and turret deployment
 */

import Player from '../player.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Engineer extends Player {
    /**
     * Create a new Engineer player
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'engineer');
        
        // Engineer-specific properties
        this.speed = 200; // Moderate movement speed
        this.health = 150; // Moderate health
        this.armor = 0.25; // 25% damage reduction
        this.specialCooldown = 0;
        this.maxSpecialCooldown = 12; // 12 seconds
        this.specialDuration = 0;
        this.maxSpecialDuration = 5; // 5 seconds
        this.specialActive = false;
        
        // Turret properties
        this.turretCount = 0;
        this.maxTurrets = 3;
        this.turretCooldown = 0;
        this.maxTurretCooldown = 5; // 5 seconds
        this.turretHealth = 100;
        this.turretDamage = 10;
        this.turretRange = 300;
        this.turretFireRate = 2; // shots per second
        
        // Repair properties
        this.repairAmount = 25;
        this.repairRange = 150;
        this.repairCooldown = 0;
        this.maxRepairCooldown = 3; // 3 seconds
        
        // Active turrets
        this.turrets = [];
        
        // Initialize engineer-specific components
        this.initEngineerComponents();
    }
    
    /**
     * Initialize engineer-specific components
     */
    initEngineerComponents() {
        // Get components
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        const render = this.getComponent('Render');
        const weapon = this.getComponent('Weapon');
        
        // Update physics component
        if (physics) {
            physics.maxSpeed = this.speed;
            physics.acceleration = 400;
            physics.deceleration = 600;
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
            health.setArmor(this.armor);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderEngineer.bind(this);
        }
        
        // Update weapon component
        if (weapon) {
            // Set initial weapon to shotgun
            weapon.setWeapon('shotgun');
        }
    }
    
    /**
     * Update the engineer player
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
        
        // Update turret cooldown
        if (this.turretCooldown > 0) {
            this.turretCooldown -= deltaTime;
        }
        
        // Update repair cooldown
        if (this.repairCooldown > 0) {
            this.repairCooldown -= deltaTime;
        }
        
        // Update turrets
        this.updateTurrets(deltaTime);
        
        // Handle special ability input
        if (this.input.special && this.specialCooldown <= 0 && !this.specialActive) {
            this.activateSpecialAbility();
        }
        
        // Handle turret deployment input
        if (this.input.deploy && this.turretCooldown <= 0 && this.turretCount < this.maxTurrets) {
            this.deployTurret();
        }
        
        // Handle repair input
        if (this.input.repair && this.repairCooldown <= 0) {
            this.repairNearbyTurrets();
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
        window.eventSystem.emit('player:specialAbility', this, 'engineer');
    }
    
    /**
     * Deactivate special ability
     */
    deactivateSpecialAbility() {
        this.specialActive = false;
        
        // Remove special ability effects
        this.removeSpecialAbilityEffects();
        
        // Emit special ability end event
        window.eventSystem.emit('player:specialAbilityEnd', this, 'engineer');
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
        
        // Upgrade all turrets
        for (const turret of this.turrets) {
            this.upgradeTurret(turret);
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
        
        // Downgrade all turrets
        for (const turret of this.turrets) {
            this.downgradeTurret(turret);
        }
    }
    
    /**
     * Deploy a turret
     */
    deployTurret() {
        // Get player transform
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Calculate turret position (in front of player)
        const distance = 50;
        const x = transform.x + Math.cos(transform.rotation) * distance;
        const y = transform.y + Math.sin(transform.rotation) * distance;
        
        // Check if position is valid (inside arena)
        if (x < 0 || x > this.gameEngine.arena.width || 
            y < 0 || y > this.gameEngine.arena.height) {
            return;
        }
        
        // Import Turret class (circular dependency workaround)
        const Turret = require('../entities/turret.js').default || window.Turret;
        
        // Create turret entity
        const turret = new Turret(x, y, this);
        
        // Add turret to game engine
        this.gameEngine.addEntity(turret);
        
        // Add to turrets array
        this.turrets.push(turret);
        
        // Update turret count
        this.turretCount++;
        
        // Set turret cooldown
        this.turretCooldown = this.maxTurretCooldown;
        
        // Emit turret deployed event
        window.eventSystem.emit('player:turretDeployed', this, turret);
    }
    
    /**
     * Repair nearby turrets
     */
    repairNearbyTurrets() {
        // Get player transform
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Repair each turret within range
        for (const turret of this.turrets) {
            // Get turret transform
            const turretTransform = turret.getComponent('Transform');
            if (!turretTransform) continue;
            
            // Calculate distance to turret
            const dx = turretTransform.x - transform.x;
            const dy = turretTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Repair if within range
            if (distance <= this.repairRange) {
                // Get turret health component
                const health = turret.getComponent('Health');
                if (health) {
                    // Repair turret
                    health.heal(this.repairAmount);
                    
                    // Emit turret repaired event
                    window.eventSystem.emit('player:turretRepaired', this, turret);
                }
            }
        }
        
        // Set repair cooldown
        this.repairCooldown = this.maxRepairCooldown;
    }
    
    /**
     * Update turrets
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateTurrets(deltaTime) {
        // Remove destroyed turrets
        for (let i = this.turrets.length - 1; i >= 0; i--) {
            const turret = this.turrets[i];
            
            // Check if turret is still active
            if (!turret.isActive()) {
                // Remove from array
                this.turrets.splice(i, 1);
                
                // Update turret count
                this.turretCount--;
            }
        }
    }
    
    /**
     * Upgrade a turret
     * @param {Turret} turret - Turret to upgrade
     */
    upgradeTurret(turret) {
        // Get turret weapon component
        const weapon = turret.getComponent('Weapon');
        if (!weapon) return;
        
        // Increase fire rate
        weapon.fireRate *= 1.5;
        
        // Increase damage
        weapon.damage *= 1.5;
        
        // Get turret render component
        const render = turret.getComponent('Render');
        if (render) {
            // Change color to indicate upgrade
            render.color = '#55ff55';
        }
    }
    
    /**
     * Downgrade a turret
     * @param {Turret} turret - Turret to downgrade
     */
    downgradeTurret(turret) {
        // Get turret weapon component
        const weapon = turret.getComponent('Weapon');
        if (!weapon) return;
        
        // Restore fire rate
        weapon.fireRate /= 1.5;
        
        // Restore damage
        weapon.damage /= 1.5;
        
        // Get turret render component
        const render = turret.getComponent('Render');
        if (render) {
            // Restore color
            render.color = '#888888';
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
     * Render the engineer player
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderEngineer(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw engineer player (moderate size, technical appearance)
        ctx.fillStyle = entity.getComponent('Render').color;
        ctx.fillRect(-15, -15, 30, 30);
        
        // Draw tool belt
        ctx.fillStyle = '#333333';
        ctx.fillRect(-15, 10, 30, 5);
        
        // Draw helmet
        ctx.fillStyle = '#666666';
        ctx.fillRect(-12, -20, 24, 10);
        
        // Draw visor
        ctx.fillStyle = '#55ff55';
        ctx.fillRect(-8, -17, 16, 4);
        
        // Draw tool
        ctx.fillStyle = '#888888';
        ctx.fillRect(15, -5, 10, 3);
        ctx.fillRect(15, 2, 10, 3);
        
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
        
        // Draw turret count indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.turretCount}/${this.maxTurrets}`, 0, -25);
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
            case 'shotgun':
                // Draw shotgun
                ctx.fillStyle = '#666666';
                ctx.fillRect(15, -6, 25, 12);
                
                // Draw barrels
                ctx.fillStyle = '#444444';
                ctx.fillRect(40, -4, 8, 2);
                ctx.fillRect(40, 0, 8, 2);
                ctx.fillRect(40, 4, 8, 2);
                
                // Draw pump
                ctx.fillStyle = '#333333';
                ctx.fillRect(20, -6, 5, 12);
                break;
                
            case 'flamethrower':
                // Draw flamethrower
                ctx.fillStyle = '#666666';
                ctx.fillRect(15, -5, 30, 10);
                
                // Draw barrel
                ctx.fillStyle = '#444444';
                ctx.fillRect(45, -3, 15, 6);
                
                // Draw fuel tank
                ctx.fillStyle = '#333333';
                ctx.fillRect(20, -5, 10, 10);
                break;
        }
    }
    
    /**
     * Serialize engineer player for network transmission
     * @returns {object} Serialized engineer player data
     */
    serialize() {
        const data = super.serialize();
        
        // Add engineer-specific data
        data.specialCooldown = this.specialCooldown;
        data.specialDuration = this.specialDuration;
        data.specialActive = this.specialActive;
        data.turretCount = this.turretCount;
        data.turretCooldown = this.turretCooldown;
        data.repairCooldown = this.repairCooldown;
        
        return data;
    }
    
    /**
     * Deserialize engineer player data
     * @param {object} data - Serialized engineer player data
     * @returns {Engineer} This engineer player for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set engineer-specific data
        this.specialCooldown = data.specialCooldown || 0;
        this.specialDuration = data.specialDuration || 0;
        this.specialActive = data.specialActive || false;
        this.turretCount = data.turretCount || 0;
        this.turretCooldown = data.turretCooldown || 0;
        this.repairCooldown = data.repairCooldown || 0;
        
        // Apply special ability effects if active
        if (this.specialActive) {
            this.applySpecialAbilityEffects();
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Engineer;
}