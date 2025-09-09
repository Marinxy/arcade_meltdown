/**
 * Arcade Meltdown - Rocket Launcher Weapon Component
 * Slow-firing explosive weapon with area damage
 */

import Weapon from './weapon.js';
import Bullet from '../../entities/bullet.js';
import MathUtils from '../../utils/math.js';

class RocketLauncher extends Weapon {
    /**
     * Create a new Rocket Launcher weapon component
     * @param {Entity} owner - Entity that owns this weapon
     */
    constructor(owner) {
        // Call parent constructor
        super(owner);
        
        // Weapon properties
        this.weaponType = 'rocket';
        this.name = 'Rocket Launcher';
        this.fireRate = 0.5; // shots per second (very slow)
        this.damage = 50; // direct hit damage
        this.ammoCapacity = 6;
        this.reloadTime = 4; // seconds
        this.spread = 0.02; // radians (very accurate)
        this.projectileSpeed = 250;
        this.projectileSize = 8;
        self.acceleration = 50; // rockets accelerate over time
        
        // Explosion properties
        this.explosionRadius = 100;
        this.explosionDamage = 30;
        self.explosionKnockback = 200;
        
        // Current ammo
        this.currentAmmo = this.ammoCapacity;
        
        // Reload state
        this.isReloading = false;
        this.reloadTimer = 0;
        
        // Fire state
        this.lastFireTime = 0;
        this.fireTimer = 0;
        
        // Visual effects
        this.muzzleFlashDuration = 0.3; // seconds
        this.muzzleFlashTimer = 0;
        this.showMuzzleFlash = false;
        
        // Rocket trail effect
        this.trailEffect = true;
        this.trailDuration = 0.5; // seconds
        
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
            x + Math.cos(fireRotation) * 25, // Spawn in front of player
            y + Math.sin(fireRotation) * 25,
            vx,
            vy,
            this.damage,
            this.owner,
            {
                explosive: true,
                explosionRadius: this.explosionRadius,
                explosionDamage: this.explosionDamage,
                explosionKnockback: self.explosionKnockback,
                acceleration: self.acceleration,
                size: this.projectileSize,
                color: '#ff3333',
                type: 'rocket',
                trail: this.trailEffect,
                trailColor: '#ff9933',
                trailDuration: this.trailDuration
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
        
        // Apply recoil to owner
        this.applyRecoil();
        
        // Emit weapon fire event
        window.eventSystem.emit('weapon:fire', this, this.owner);
        
        // Auto-reload if out of ammo
        if (this.currentAmmo <= 0) {
            this.startReload();
        }
        
        return true;
    }
    
    /**
     * Apply recoil to owner
     */
    applyRecoil() {
        // Get owner physics component
        const physics = this.owner.getComponent('Physics');
        if (!physics) return;
        
        // Get owner transform component
        const transform = this.owner.getComponent('Transform');
        if (!transform) return;
        
        // Calculate recoil force
        const recoilForce = 150;
        const recoilX = -Math.cos(transform.rotation) * recoilForce;
        const recoilY = -Math.sin(transform.rotation) * recoilForce;
        
        // Apply recoil impulse
        physics.velocity.x += recoilX;
        physics.velocity.y += recoilY;
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
        ctx.fillRect(15, -6, 35, 12);
        
        // Draw barrel
        ctx.fillStyle = '#444444';
        ctx.fillRect(50, -4, 20, 8);
        
        // Draw grip
        ctx.fillStyle = '#333333';
        ctx.fillRect(25, -6, 8, 12);
        
        // Draw rocket in chamber
        if (this.currentAmmo > 0) {
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(45, -2, 8, 4);
        }
        
        // Draw muzzle flash if active
        if (this.showMuzzleFlash) {
            // Draw large explosion effect
            const gradient = ctx.createRadialGradient(70, 0, 5, 70, 0, 25);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, '#ff9933');
            gradient.addColorStop(0.7, '#ff3333');
            gradient.addColorStop(1, 'rgba(255, 51, 51, 0)');
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(70, 0, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        // Draw ammo indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.getAmmoString(), 32, 18);
        
        // Draw reload indicator if reloading
        if (this.isReloading) {
            ctx.fillStyle = '#ff3333';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('RELOADING', 32, -18);
            
            // Draw reload progress bar
            const reloadProgress = 1 - (this.reloadTimer / this.reloadTime);
            ctx.fillStyle = '#333333';
            ctx.fillRect(-20, -25, 40, 5);
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(-20, -25, 40 * reloadProgress, 5);
        }
        
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
            fireTimer: this.fireTimer
        };
    }
    
    /**
     * Deserialize weapon data
     * @param {object} data - Serialized weapon data
     * @returns {RocketLauncher} This weapon for method chaining
     */
    deserialize(data) {
        // Set weapon data
        this.currentAmmo = data.currentAmmo || this.ammoCapacity;
        this.isReloading = data.isReloading || false;
        this.reloadTimer = data.reloadTimer || 0;
        this.fireTimer = data.fireTimer || 0;
        
        return this;
    }
    
    /**
     * Destroy the weapon
     */
    destroy() {
        // No specific cleanup needed
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RocketLauncher;
}