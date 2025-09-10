/**
 * Arcade Meltdown - Weapon Component
 * Handles weapon properties, firing, and ammunition
 */

class Weapon {
    /**
     * Create a new Weapon component
     * @param {string} weaponType - Type of weapon
     */
    constructor(weaponType) {
        // Type of weapon
        this.weaponType = weaponType;
        
        // Weapon properties based on type
        this.setWeaponProperties(weaponType);
        
        // Current ammo
        this.ammo = this.maxAmmo;
        
        // Whether the weapon is currently firing
        this.isFiring = false;
        
        // Time since last shot
        this.timeSinceLastShot = 0;
        
        // Whether the weapon is reloading
        this.isReloading = false;
        
        // Reload time remaining
        this.reloadTimeRemaining = 0;
        
        // Weapon upgrades
        this.upgrades = new Map();
        
        // Callback function for when weapon fires
        this.onFire = null;
        
        // Callback function for when weapon reloads
        this.onReload = null;
        
        // Callback function for when weapon runs out of ammo
        this.onEmpty = null;
    }
    
    /**
     * Set weapon properties based on weapon type
     * @param {string} weaponType - Type of weapon
     */
    setWeaponProperties(weaponType) {
        const weaponConfig = window.config.get(`weapons.${weaponType}`);
        
        if (weaponConfig) {
            this.damage = weaponConfig.damage || 10;
            this.fireRate = weaponConfig.fireRate || 500; // ms between shots
            this.bulletType = 'bullet';
            this.spread = weaponConfig.spread || 0; // degrees
            this.maxAmmo = weaponConfig.ammo || -1; // -1 for infinite
            this.range = weaponConfig.range || 500;
            this.penetration = weaponConfig.penetration || 0;
            this.splashDamage = weaponConfig.splashDamage || 0;
            this.splashRadius = weaponConfig.splashRadius || 0;
            this.pellets = weaponConfig.pellets || 1; // for shotguns
            this.coneAngle = weaponConfig.coneAngle || 0; // for flamethrower
            this.continuous = weaponConfig.continuous || false; // for flamethrower/heal beam
        } else {
            // Default properties
            this.damage = 10;
            this.fireRate = 500;
            this.bulletType = 'bullet';
            this.spread = 0;
            this.maxAmmo = -1;
            this.range = 500;
            this.penetration = 0;
            this.splashDamage = 0;
            this.splashRadius = 0;
            this.pellets = 1;
            this.coneAngle = 0;
            this.continuous = false;
        }
    }
    
    /**
     * Start firing the weapon
     */
    startFiring() {
        if (this.isReloading || this.ammo === 0) return;
        
        this.isFiring = true;
        
        // Fire immediately if enough time has passed
        if (this.timeSinceLastShot >= this.fireRate) {
            this.fire();
        }
    }
    
    /**
     * Stop firing the weapon
     */
    stopFiring() {
        this.isFiring = false;
    }
    
    /**
     * Fire the weapon
     * @param {number} x - X position of firing entity
     * @param {number} y - Y position of firing entity
     * @param {number} angle - Angle to fire in radians
     * @returns {Array} Array of bullet objects created
     */
    fire(x, y, angle) {
        if (this.isReloading || this.ammo === 0) return [];
        
        // Check if enough time has passed since last shot
        if (this.timeSinceLastShot < this.fireRate) return [];
        
        // Reset time since last shot
        this.timeSinceLastShot = 0;
        
        // Consume ammo
        if (this.maxAmmo > 0) {
            this.ammo--;
            
            // Check if out of ammo
            if (this.ammo === 0 && this.onEmpty) {
                this.onEmpty(this);
            }
        }
        
        // Calculate damage with upgrades
        let finalDamage = this.damage;
        if (this.upgrades.has('damage')) {
            finalDamage *= this.upgrades.get('damage').value;
        }
        
        // Create bullets
        const bullets = [];
        
        if (this.pellets > 1) {
            // Shotgun - create multiple pellets
            for (let i = 0; i < this.pellets; i++) {
                // Calculate spread angle
                const spreadAngle = (Math.random() - 0.5) * this.spread * Math.PI / 180;
                const pelletAngle = angle + spreadAngle;
                
                const bullet = this.createBullet(x, y, pelletAngle, finalDamage);
                bullets.push(bullet);
            }
        } else if (this.coneAngle > 0) {
            // Flamethrower - create cone of bullets
            const coneRadians = this.coneAngle * Math.PI / 180;
            const numBullets = 5;
            
            for (let i = 0; i < numBullets; i++) {
                const spreadAngle = (Math.random() - 0.5) * coneRadians;
                const bulletAngle = angle + spreadAngle;
                
                const bullet = this.createBullet(x, y, bulletAngle, finalDamage);
                bullets.push(bullet);
            }
        } else {
            // Single bullet
            // Apply spread
            const spreadAngle = (Math.random() - 0.5) * this.spread * Math.PI / 180;
            const finalAngle = angle + spreadAngle;
            
            const bullet = this.createBullet(x, y, finalAngle, finalDamage);
            bullets.push(bullet);
        }
        
        // Create actual bullet entities
        this.createBulletEntities(bullets);
        
        // Trigger fire callback
        if (this.onFire) {
            this.onFire(this, bullets);
        }
        
        return bullets;
    }
    
    /**
     * Create a bullet object
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} angle - Angle in radians
     * @param {number} damage - Damage value
     * @returns {object} Bullet object
     */
    createBullet(x, y, angle, damage) {
        return {
            type: this.bulletType,
            x: x,
            y: y,
            angle: angle,
            speed: 800, // pixels per second
            damage: damage,
            range: this.range,
            penetration: this.penetration,
            splashDamage: this.splashDamage,
            splashRadius: this.splashRadius,
            owner: null // Will be set by the entity
        };
    }
    
    /**
     * Create bullet entities from bullet data
     * @param {Array} bullets - Array of bullet data
     */
    createBulletEntities(bullets) {
        // Import Bullet class dynamically to avoid circular dependency
        import('../entities/bullet.js').then(({ default: Bullet }) => {
            for (const bulletData of bullets) {
                const bullet = new Bullet(
                    bulletData.x,
                    bulletData.y,
                    bulletData.angle,
                    bulletData.speed,
                    bulletData.damage,
                    bulletData.type,
                    this.entity || null
                );
                
                // Add bullet to game engine if available
                if (this.entity && this.entity.gameEngine) {
                    this.entity.gameEngine.addEntity(bullet);
                }
            }
        }).catch(error => {
            console.error('Failed to create bullet entities:', error);
        });
    }
    
    /**
     * Reload the weapon
     */
    reload() {
        if (this.isReloading || this.ammo === this.maxAmmo || this.maxAmmo <= 0) return;
        
        this.isReloading = true;
        this.reloadTimeRemaining = this.getReloadTime();
        
        // Trigger reload callback
        if (this.onReload) {
            this.onReload(this);
        }
    }
    
    /**
     * Get reload time based on weapon type
     * @returns {number} Reload time in ms
     */
    getReloadTime() {
        switch (this.weaponType) {
            case 'shotgun':
                return 2000;
            case 'smg':
                return 1500;
            case 'plasmaRifle':
                return 1000;
            case 'flamethrower':
                return 2500;
            case 'rocketLauncher':
                return 3000;
            case 'healBeam':
                return 0; // Doesn't need to reload
            default:
                return 1500;
        }
    }
    
    /**
     * Add an upgrade to the weapon
     * @param {object} upgrade - Upgrade object
     */
    addUpgrade(upgrade) {
        this.upgrades.set(upgrade.id, upgrade);
    }
    
    /**
     * Remove an upgrade from the weapon
     * @param {string} upgradeId - ID of upgrade to remove
     */
    removeUpgrade(upgradeId) {
        this.upgrades.delete(upgradeId);
    }
    
    /**
     * Get all upgrades
     * @returns {Array} Array of upgrades
     */
    getUpgrades() {
        return Array.from(this.upgrades.values());
    }
    
    /**
     * Update the weapon
     * @param {number} deltaTime - Time elapsed in ms
     */
    update(deltaTime) {
        // Update time since last shot
        if (this.timeSinceLastShot < this.fireRate) {
            this.timeSinceLastShot += deltaTime;
        }
        
        // Update reload
        if (this.isReloading) {
            this.reloadTimeRemaining -= deltaTime;
            
            if (this.reloadTimeRemaining <= 0) {
                this.isReloading = false;
                this.reloadTimeRemaining = 0;
                this.ammo = this.maxAmmo;
            }
        }
        
        // Continuous firing (for flamethrower, heal beam)
        if (this.isFiring && this.continuous && !this.isReloading && this.ammo !== 0) {
            if (this.timeSinceLastShot >= this.fireRate) {
                return this.fire(); // Return bullets for continuous firing
            }
        }
        
        return [];
    }
    
    /**
     * Get the ammo as a string (for display)
     * @returns {string} Ammo string
     */
    getAmmoString() {
        if (this.maxAmmo <= 0) return '∞';
        if (this.isReloading) return 'RELOAD';
        return `${this.ammo}/${this.maxAmmo}`;
    }
    
    /**
     * Get the reload progress (0-1)
     * @returns {number} Reload progress
     */
    getReloadProgress() {
        if (!this.isReloading) return 1;
        return 1 - (this.reloadTimeRemaining / this.getReloadTime());
    }
    
    /**
     * Get the fire progress (0-1)
     * @returns {number} Fire progress
     */
    getFireProgress() {
        return Math.min(1, this.timeSinceLastShot / this.fireRate);
    }
    
    /**
     * Clone this weapon component
     * @returns {Weapon} A new weapon component with the same values
     */
    clone() {
        const weapon = new Weapon(this.weaponType);
        weapon.ammo = this.ammo;
        weapon.isFiring = this.isFiring;
        weapon.timeSinceLastShot = this.timeSinceLastShot;
        weapon.isReloading = this.isReloading;
        weapon.reloadTimeRemaining = this.reloadTimeRemaining;
        
        // Copy upgrades
        for (const [id, upgrade] of this.upgrades) {
            weapon.addUpgrade({...upgrade});
        }
        
        return weapon;
    }
    
    /**
     * Copy values from another weapon component
     * @param {Weapon} other - Weapon component to copy from
     */
    copy(other) {
        this.weaponType = other.weaponType;
        this.setWeaponProperties(other.weaponType);
        this.ammo = other.ammo;
        this.isFiring = other.isFiring;
        this.timeSinceLastShot = other.timeSinceLastShot;
        this.isReloading = other.isReloading;
        this.reloadTimeRemaining = other.reloadTimeRemaining;
        
        // Copy upgrades
        this.upgrades.clear();
        for (const [id, upgrade] of other.upgrades) {
            this.addUpgrade({...upgrade});
        }
    }
    
    /**
     * Convert to string representation
     * @returns {string} String representation
     */
    toString() {
        return `Weapon(type: ${this.weaponType}, ammo: ${this.getAmmoString()}, damage: ${this.damage}, firing: ${this.isFiring}, reloading: ${this.isReloading})`;
    }
}

// Export for use in modules
export default Weapon;