/**
 * Arcade Meltdown - Health Component
 * Handles health, damage, and invulnerability for entities
 */

class Health {
    /**
     * Create a new Health component
     * @param {number} maxHealth - Maximum health value
     */
    constructor(maxHealth) {
        // Maximum health
        this.maxHealth = maxHealth;
        
        // Current health
        this.currentHealth = maxHealth;
        
        // Whether the entity is invulnerable
        this.invulnerable = false;
        
        // Invulnerability time remaining (in ms)
        this.invulnerabilityTime = 0;
        
        // Whether the entity is dead
        this.isDead = false;
        
        // Regeneration rate (health per second)
        this.regenRate = 0;
        
        // Time since last damage (for regeneration)
        this.timeSinceDamage = 0;
        
        // Delay before regeneration starts (in seconds)
        this.regenDelay = 5;
        
        // Callback function for when health changes
        this.onHealthChange = null;
        
        // Callback function for when entity dies
        this.onDeath = null;
        
        // Callback function for when entity takes damage
        this.onDamage = null;
        
        // Callback function for when entity is healed
        this.onHeal = null;
    }
    
    /**
     * Take damage
     * @param {number} damage - Amount of damage to take
     * @param {object} source - Source of the damage (optional)
     * @returns {boolean} True if damage was taken, false if invulnerable or already dead
     */
    takeDamage(damage, source = null) {
        if (this.isDead || this.invulnerable || damage <= 0) {
            return false;
        }
        
        // Store old health for callback
        const oldHealth = this.currentHealth;
        
        // Apply damage
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        
        // Reset time since damage
        this.timeSinceDamage = 0;
        
        // Trigger damage callback
        if (this.onDamage) {
            this.onDamage(this, damage, source);
        }
        
        // Check if entity died
        if (this.currentHealth <= 0 && !this.isDead) {
            this.die(source);
        }
        
        // Trigger health change callback
        if (this.onHealthChange) {
            this.onHealthChange(this, oldHealth, this.currentHealth);
        }
        
        return true;
    }
    
    /**
     * Heal the entity
     * @param {number} amount - Amount to heal
     * @param {object} source - Source of the healing (optional)
     * @returns {boolean} True if healing was applied, false if already at max health or dead
     */
    heal(amount, source = null) {
        if (this.isDead || this.currentHealth >= this.maxHealth || amount <= 0) {
            return false;
        }
        
        // Store old health for callback
        const oldHealth = this.currentHealth;
        
        // Apply healing
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        
        // Trigger heal callback
        if (this.onHeal) {
            this.onHeal(this, amount, source);
        }
        
        // Trigger health change callback
        if (this.onHealthChange) {
            this.onHealthChange(this, oldHealth, this.currentHealth);
        }
        
        return true;
    }
    
    /**
     * Set invulnerability for a duration
     * @param {number} duration - Duration in ms
     */
    setInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerabilityTime = duration;
    }
    
    /**
     * Kill the entity
     * @param {object} source - Source of the death (optional)
     */
    die(source = null) {
        if (this.isDead) return;
        
        this.isDead = true;
        this.currentHealth = 0;
        
        // Trigger death callback
        if (this.onDeath) {
            this.onDeath(this, source);
        }
    }
    
    /**
     * Revive the entity
     * @param {number} health - Health to revive with (optional, defaults to max health)
     */
    revive(health = null) {
        if (!this.isDead) return;
        
        this.isDead = false;
        this.currentHealth = health !== null ? Math.min(health, this.maxHealth) : this.maxHealth;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.timeSinceDamage = 0;
    }
    
    /**
     * Set the maximum health
     * @param {number} maxHealth - New maximum health
     * @param {boolean} adjustCurrent - Whether to adjust current health proportionally
     */
    setMaxHealth(maxHealth, adjustCurrent = true) {
        if (maxHealth <= 0) return;
        
        const oldMaxHealth = this.maxHealth;
        this.maxHealth = maxHealth;
        
        if (adjustCurrent && oldMaxHealth > 0) {
            // Adjust current health proportionally
            const healthRatio = this.currentHealth / oldMaxHealth;
            this.currentHealth = Math.min(maxHealth, Math.max(0, maxHealth * healthRatio));
        } else {
            // Clamp current health to new max
            this.currentHealth = Math.min(maxHealth, this.currentHealth);
        }
    }
    
    /**
     * Set regeneration rate
     * @param {number} rate - Health per second
     * @param {number} delay - Delay before regeneration starts (in seconds)
     */
    setRegeneration(rate, delay = 5) {
        this.regenRate = Math.max(0, rate);
        this.regenDelay = Math.max(0, delay);
    }
    
    /**
     * Update the health component
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        // Update invulnerability time
        if (this.invulnerable && this.invulnerabilityTime > 0) {
            this.invulnerabilityTime -= deltaTime * 1000;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
                this.invulnerabilityTime = 0;
            }
        }
        
        // Update time since damage
        if (!this.isDead && this.timeSinceDamage < this.regenDelay) {
            this.timeSinceDamage += deltaTime;
        }
        
        // Apply regeneration if conditions are met
        if (!this.isDead && 
            this.regenRate > 0 && 
            this.currentHealth < this.maxHealth && 
            this.timeSinceDamage >= this.regenDelay) {
            
            const oldHealth = this.currentHealth;
            this.currentHealth = Math.min(this.maxHealth, this.currentHealth + this.regenRate * deltaTime);
            
            // Trigger health change callback if health actually changed
            if (this.currentHealth !== oldHealth && this.onHealthChange) {
                this.onHealthChange(this, oldHealth, this.currentHealth);
            }
        }
    }
    
    /**
     * Check if the entity is dead
     * @returns {boolean} True if the entity is dead
     */
    isEntityDead() {
        return this.isDead;
    }
    
    /**
     * Get the health percentage
     * @returns {number} Health as a percentage (0-1)
     */
    getHealthPercentage() {
        return this.maxHealth > 0 ? this.currentHealth / this.maxHealth : 0;
    }
    
    /**
     * Get the missing health
     * @returns {number} Amount of health missing
     */
    getMissingHealth() {
        return Math.max(0, this.maxHealth - this.currentHealth);
    }
    
    /**
     * Check if the entity is at full health
     * @returns {boolean} True if at full health
     */
    isAtFullHealth() {
        return this.currentHealth >= this.maxHealth;
    }
    
    /**
     * Check if the entity is below a certain health threshold
     * @param {number} threshold - Health threshold (0-1)
     * @returns {boolean} True if below threshold
     */
    isBelowHealthThreshold(threshold) {
        return this.getHealthPercentage() < threshold;
    }
    
    /**
     * Clone this health component
     * @returns {Health} A new health component with the same values
     */
    clone() {
        const health = new Health(this.maxHealth);
        health.currentHealth = this.currentHealth;
        health.invulnerable = this.invulnerable;
        health.invulnerabilityTime = this.invulnerabilityTime;
        health.isDead = this.isDead;
        health.regenRate = this.regenRate;
        health.timeSinceDamage = this.timeSinceDamage;
        health.regenDelay = this.regenDelay;
        return health;
    }
    
    /**
     * Copy values from another health component
     * @param {Health} other - Health component to copy from
     */
    copy(other) {
        this.maxHealth = other.maxHealth;
        this.currentHealth = other.currentHealth;
        this.invulnerable = other.invulnerable;
        this.invulnerabilityTime = other.invulnerabilityTime;
        this.isDead = other.isDead;
        this.regenRate = other.regenRate;
        this.timeSinceDamage = other.timeSinceDamage;
        this.regenDelay = other.regenDelay;
    }
    
    /**
     * Convert to string representation
     * @returns {string} String representation
     */
    toString() {
        return `Health(current: ${this.currentHealth}/${this.maxHealth}, percentage: ${(this.getHealthPercentage() * 100).toFixed(1)}%, dead: ${this.isDead}, invulnerable: ${this.invulnerable})`;
    }
}

// Export for use in modules
export default Health;