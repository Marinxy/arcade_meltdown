/**
 * Arcade Meltdown - Physics Component
 * Handles physics properties and calculations for entities
 */

class Physics {
    /**
     * Create a new Physics component
     */
    constructor() {
        // Velocity
        this.velocity = { x: 0, y: 0 };
        
        // Acceleration
        this.acceleration = { x: 0, y: 0 };
        
        // Mass (affects how forces are applied)
        this.mass = 1;
        
        // Friction (0-1, where 1 is no friction)
        this.friction = 0.98;
        
        // Maximum speed
        this.maxSpeed = 500;
        
        // Bounce factor (0-1, where 1 is perfect bounce)
        this.bounce = 0.5;
        
        // Gravity (can be set to 0 for top-down games)
        this.gravity = { x: 0, y: 0 };
        
        // Whether this entity is affected by gravity
        this.affectedByGravity = false;
        
        // Whether this entity is static (doesn't move)
        this.isStatic = false;
        
        // Drag coefficient (air resistance)
        this.drag = 0.01;
    }
    
    /**
     * Apply a force to the entity
     * @param {number} fx - Force X component
     * @param {number} fy - Force Y component
     */
    applyForce(fx, fy) {
        if (this.isStatic) return;
        
        // F = ma, so a = F/m
        this.acceleration.x += fx / this.mass;
        this.acceleration.y += fy / this.mass;
    }
    
    /**
     * Apply an impulse (instantaneous change in velocity)
     * @param {number} ix - Impulse X component
     * @param {number} iy - Impulse Y component
     */
    applyImpulse(ix, iy) {
        if (this.isStatic) return;
        
        // Impulse directly changes velocity
        this.velocity.x += ix / this.mass;
        this.velocity.y += iy / this.mass;
    }
    
    /**
     * Set the velocity directly
     * @param {number} vx - Velocity X component
     * @param {number} vy - Velocity Y component
     */
    setVelocity(vx, vy) {
        this.velocity.x = vx;
        this.velocity.y = vy;
    }
    
    /**
     * Clamp the velocity to the maximum speed
     */
    clampSpeed() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
    }
    
    /**
     * Update the physics based on time delta
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        if (this.isStatic) return;
        
        // Apply gravity if affected
        if (this.affectedByGravity) {
            this.acceleration.x += this.gravity.x;
            this.acceleration.y += this.gravity.y;
        }
        
        // Update velocity based on acceleration
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        
        // Apply drag (air resistance)
        this.velocity.x *= (1 - this.drag * deltaTime);
        this.velocity.y *= (1 - this.drag * deltaTime);
        
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        
        // Clamp to max speed
        this.clampSpeed();
        
        // Reset acceleration for next frame
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }
    
    /**
     * Get the current speed
     * @returns {number} Current speed
     */
    getSpeed() {
        return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    }
    
    /**
     * Get the direction of movement in radians
     * @returns {number} Direction in radians
     */
    getDirection() {
        return Math.atan2(this.velocity.y, this.velocity.x);
    }
    
    /**
     * Stop all movement
     */
    stop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }
    
    /**
     * Check if the entity is moving
     * @returns {boolean} True if the entity is moving
     */
    isMoving() {
        return this.velocity.x !== 0 || this.velocity.y !== 0;
    }
    
    /**
     * Set the entity to be static (immovable)
     * @param {boolean} isStatic - Whether the entity should be static
     */
    setStatic(isStatic) {
        this.isStatic = isStatic;
        if (isStatic) {
            this.stop();
        }
    }
    
    /**
     * Set whether the entity is affected by gravity
     * @param {boolean} affected - Whether the entity should be affected by gravity
     */
    setAffectedByGravity(affected) {
        this.affectedByGravity = affected;
    }
    
    /**
     * Set the gravity vector
     * @param {number} gx - Gravity X component
     * @param {number} gy - Gravity Y component
     */
    setGravity(gx, gy) {
        this.gravity.x = gx;
        this.gravity.y = gy;
    }
    
    /**
     * Clone this physics component
     * @returns {Physics} A new physics component with the same values
     */
    clone() {
        const physics = new Physics();
        physics.velocity = { ...this.velocity };
        physics.acceleration = { ...this.acceleration };
        physics.mass = this.mass;
        physics.friction = this.friction;
        physics.maxSpeed = this.maxSpeed;
        physics.bounce = this.bounce;
        physics.gravity = { ...this.gravity };
        physics.affectedByGravity = this.affectedByGravity;
        physics.isStatic = this.isStatic;
        physics.drag = this.drag;
        return physics;
    }
    
    /**
     * Copy values from another physics component
     * @param {Physics} other - Physics component to copy from
     */
    copy(other) {
        this.velocity = { ...other.velocity };
        this.acceleration = { ...other.acceleration };
        this.mass = other.mass;
        this.friction = other.friction;
        this.maxSpeed = other.maxSpeed;
        this.bounce = other.bounce;
        this.gravity = { ...other.gravity };
        this.affectedByGravity = other.affectedByGravity;
        this.isStatic = other.isStatic;
        this.drag = other.drag;
    }
    
    /**
     * Convert to string representation
     * @returns {string} String representation
     */
    toString() {
        return `Physics(velocity: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)}), acceleration: (${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)}), mass: ${this.mass}, speed: ${this.getSpeed().toFixed(2)})`;
    }
}

// Export for use in modules
export default Physics;