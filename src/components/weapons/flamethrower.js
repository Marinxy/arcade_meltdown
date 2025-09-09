/**
 * Arcade Meltdown - Flamethrower Weapon Component
 * Short-range continuous fire weapon with area damage
 */

import Weapon from './weapon.js';
import Bullet from '../../entities/bullet.js';
import MathUtils from '../../utils/math.js';

class Flamethrower extends Weapon {
    /**
     * Create a new Flamethrower weapon component
     * @param {Entity} owner - Entity that owns this weapon
     */
    constructor(owner) {
        // Call parent constructor
        super(owner);
        
        // Weapon properties
        this.weaponType = 'flamethrower';
        this.name = 'Flamethrower';
        this.fireRate = 10; // shots per second (very high)
        this.damage = 8; // damage per second (applied over time)
        this.ammoCapacity = 100; // fuel units
        this.reloadTime = 3; // seconds
        this.spread = 0.2; // radians (wide spread)
        this.projectileSpeed = 300;
        this.projectileSize = 6;
        this.projectileLifetime = 0.5; // seconds
        this.range = 150; // maximum range
        
        // Damage over time properties
        this.dotDuration = 3; // seconds
        this.dotInterval = 0.5; // seconds between damage ticks
        
        // Area of effect properties
        this.aoeRadius = 30;
        this.aoeDamage = 5;
        
        // Current ammo
        this.currentAmmo = this.ammoCapacity;
        
        // Reload state
        this.isReloading = false;
        this.reloadTimer = 0;
        
        // Fire state
        this.lastFireTime = 0;
        this.fireTimer = 0;
        this.isFiring = false;
        
        // Visual effects
        this.flameEffect = true;
        this.muzzleFlashDuration = 0.2; // seconds
        this.muzzleFlashTimer = 0;
        this.showMuzzleFlash = false;
        
        // Initialize weapon
        this.init();
    }
    
    /**
     * Initialize the weapon
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for owner events
        if (this.owner) {
            window.eventSystem.on(`entity:destroyed:${this.owner.id}`, () => {
                this.destroy();
            });
        }
    }
    
    /**
     * Update the weapon
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update fire timer
        if (this.fireTimer > 0) {
            this.fireTimer -= deltaTime;
        }
        
        // Update reload timer
        if (this.isReloading) {
            this.reloadTimer -= deltaTime;
            
            // Check if reload is complete
            if (this.reloadTimer <= 0) {
                this.completeReload();
            }
        }
        
        // Update muzzle flash timer
        if (this.muzzleFlashTimer > 0) {
            this.muzzleFlashTimer -= deltaTime;
            
            // Check if muzzle flash should be hidden
            if (this.muzzleFlashTimer <= 0) {
                this.showMuzzleFlash = false;
            }
        }
        
        // Continuous fire while firing
        if (this.isFiring && this.canFire()) {
            // Get owner transform
            const transform = this.owner.getComponent('Transform');
            if (transform) {
                // Fire weapon
                this.fire(transform.x, transform.y, transform.rotation);
            }
        }
    }
    
    /**
     * Start firing
     */
    startFiring() {
        this.isFiring = true;
    }
    
    /**
     * Stop firing
     */
    stopFiring() {
        this.isFiring = false;
    }
    
    /**
     * Fire the weapon
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} rotation - Firing rotation in radians
     * @returns {boolean} Whether the weapon was fired
     */
    fire(x, y, rotation) {
        // Check if weapon can fire
        if (!this.canFire()) {
            return false;
        }
        
        // Calculate fire direction with spread
        const spread = (Math.random() - 0.5) * this.spread;
        const fireRotation = rotation + spread;
        
        // Calculate projectile velocity
        const vx = Math.cos(fireRotation) * this.projectileSpeed;
        const vy = Math.sin(fireRotation) * this.projectileSpeed;
        
        // Import Bullet class (circular dependency workaround)
        const Bullet = require('../../entities/bullet.js').default || window.Bullet;
        
        // Create bullet entity
        const bullet = new Bullet(
            x + Math.cos(fireRotation) * 20, // Spawn in front of player
            y + Math.sin(fireRotation) * 20,
            vx,
            vy,
            this.damage,
            this.owner,
            {
                aoe: true,
                aoeRadius: this.aoeRadius,
                aoeDamage: this.aoeDamage,
                dot: true,
                dotDamage: this.damage * this.dotInterval,
                dotDuration: this.dotDuration,
                dotInterval: this.dotInterval,
                size: this.projectileSize,
                color: '#ff6600',
                type: 'flame',
                lifetime: this.projectileLifetime,
                range: this.range
            }
        );
        
        // Add bullet to game engine
        this.owner.gameEngine.addEntity(bullet);
        
        // Update fire state
        this.lastFireTime = performance.now() / 1000;
        this.fireTimer = 1 / this.fireRate;
        this.currentAmmo--;
        
        // Show muzzle flash
        this.showMuzzleFlash = true;
        this.muzzleFlashTimer = this.muzzleFlashDuration;
        
        // Emit weapon fire event
        window.eventSystem.emit('weapon:fire', this, this.owner);
        
        // Auto-reload if out of ammo
        if (this.currentAmmo <= 0) {
            this.startReload();
            this.stopFiring();
        }
        
        return true;
    }
    
    /**
     * Start reloading
     * @returns {boolean} Whether reload was started
     */
    startReload() {
        // Check if weapon can reload
        if (!this.canReload()) {
            return false;
        }
        
        // Start reload
        this.isReloading = true;
        this.reloadTimer = this.reloadTime;
        
        // Stop firing
        this.stopFiring();
        
        // Emit weapon reload event
        window.eventSystem.emit('weapon:reload', this, this.owner);
        
        return true;
    }
    
    /**
     * Complete reload
     */
    completeReload() {
        // Reset reload state
        this.isReloading = false;
        this.reloadTimer = 0;
        
        // Refill ammo
        this.currentAmmo = this.ammoCapacity;
        
        // Emit weapon reloaded event
        window.eventSystem.emit('weapon:reloaded', this, this.owner);
    }
    
    /**
     * Check if weapon can fire
     * @returns {boolean} Whether the weapon can fire
     */
    canFire() {
        // Check if not reloading and has ammo and fire timer is expired
        return !this.isReloading && 
               this.currentAmmo > 0 && 
               this.fireTimer <= 0;
    }
    
    /**
     * Check if weapon can reload
     * @returns {boolean} Whether the weapon can reload
     */
    canReload() {
        // Check if not already reloading and not at full ammo
        return !this.isReloading && this.currentAmmo < this.ammoCapacity;
    }
    
    /**
     * Get ammo percentage
     * @returns {number} Ammo percentage (0-1)
     */
    getAmmoPercentage() {
        return this.currentAmmo / this.ammoCapacity;
    }
    
    /**
     * Get ammo string
     * @returns {string} Ammo string
     */
    getAmmoString() {
        return `${this.currentAmmo}/${this.ammoCapacity}`;
    }
    
    /**
     * Render the weapon
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    render(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Save context state
        ctx.save();
        
        // Translate to entity position
        ctx.translate(transform.x, transform.y);
        
        // Rotate to entity rotation
        ctx.rotate(transform.rotation);
        
        // Draw weapon body
        ctx.fillStyle = '#666666';
        ctx.fillRect(15, -5, 30, 10);
        
        // Draw barrel
        ctx.fillStyle = '#444444';
        ctx.fillRect(45, -3, 15, 6);
        
        // Draw fuel tank
        ctx.fillStyle = '#333333';
        ctx.fillRect(20, -5, 10, 10);
        
        // Draw muzzle flash if active
        if (this.showMuzzleFlash) {
            // Draw flame effect
            const gradient = ctx.createLinearGradient(45, 0, 65, 0);
            gradient.addColorStop(0, '#ff6600');
            gradient.addColorStop(0.5, '#ff3300');
            gradient.addColorStop(1, 'rgba(255, 51, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.8;
            
            // Draw multiple flame particles
            for (let i = 0; i < 5; i++) {
                const size = 5 + Math.random() * 10;
                const yOffset = (Math.random() - 0.5) * 10;
                const xOffset = 45 + Math.random() * 20;
                
                ctx.beginPath();
                ctx.moveTo(xOffset, yOffset);
                ctx.lineTo(xOffset + size, yOffset - size/2);
                ctx.lineTo(xOffset + size, yOffset + size/2);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        }
        
        // Draw ammo indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.getAmmoString(), 30, 15);
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Serialize weapon for network transmission
     * @returns {object} Serialized weapon data
     */
    serialize() {
        return {
            weaponType: this.weaponType,
            currentAmmo: this.currentAmmo,
            isReloading: this.isReloading,
            reloadTimer: this.reloadTimer,
            fireTimer: this.fireTimer,
            isFiring: this.isFiring
        };
    }
    
    /**
     * Deserialize weapon data
     * @param {object} data - Serialized weapon data
     * @returns {Flamethrower} This weapon for method chaining
     */
    deserialize(data) {
        // Set weapon data
        this.currentAmmo = data.currentAmmo || this.ammoCapacity;
        this.isReloading = data.isReloading || false;
        this.reloadTimer = data.reloadTimer || 0;
        this.fireTimer = data.fireTimer || 0;
        this.isFiring = data.isFiring || false;
        
        return this;
    }
    
    /**
     * Destroy the weapon
     */
    destroy() {
        // Stop firing
        this.stopFiring();
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Flamethrower;
}