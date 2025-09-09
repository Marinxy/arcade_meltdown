/**
 * Arcade Meltdown - Physics System
 * Handles physics calculations and updates
 */

class PhysicsSystem {
    /**
     * Create a new Physics System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
    }
    
    /**
     * Initialize the physics system
     */
    init() {
        // Nothing to initialize for basic physics
    }
    
    /**
     * Update the physics system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update physics for all entities with physics components
        for (const [id, entity] of this.gameEngine.entities) {
            if (entity.isActive()) {
                const transform = entity.getComponent('Transform');
                const physics = entity.getComponent('Physics');
                
                if (transform && physics) {
                    this.updateEntityPhysics(entity, transform, physics, deltaTime);
                }
            }
        }
    }
    
    /**
     * Update physics for a single entity
     * @param {Entity} entity - Entity to update
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {number} deltaTime - Delta time in seconds
     */
    updateEntityPhysics(entity, transform, physics, deltaTime) {
        // Update physics component
        physics.update(deltaTime);
        
        // Apply velocity to position
        transform.x += physics.velocity.x * deltaTime;
        transform.y += physics.velocity.y * deltaTime;
        
        // Keep entity within arena bounds
        this.constrainToArena(entity, transform);
    }
    
    /**
     * Constrain entity to arena bounds
     * @param {Entity} entity - Entity to constrain
     * @param {Transform} transform - Transform component
     */
    constrainToArena(entity, transform) {
        const arena = this.gameEngine.arena;
        const margin = 20; // Keep some margin from edges
        
        // Constrain X position
        if (transform.x < margin) {
            transform.x = margin;
        } else if (transform.x > arena.width - margin) {
            transform.x = arena.width - margin;
        }
        
        // Constrain Y position
        if (transform.y < margin) {
            transform.y = margin;
        } else if (transform.y > arena.height - margin) {
            transform.y = arena.height - margin;
        }
    }
    
    /**
     * Destroy the physics system
     */
    destroy() {
        // Nothing to destroy
    }
}

// Export for use in modules
export default PhysicsSystem;
