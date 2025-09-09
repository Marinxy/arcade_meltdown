/**
 * Arcade Meltdown - Entity Class
 * Base class for all game entities using Entity-Component-System architecture
 */

class Entity {
    /**
     * Create a new Entity
     * @param {string} id - Unique identifier for the entity (optional)
     */
    constructor(id = null) {
        // Generate unique ID if not provided
        this.id = id || this.generateUniqueId();
        
        // Whether the entity is active
        this.active = true;
        
        // Map of components (component type -> component instance)
        this.components = new Map();
        
        // Entity tags for grouping/categorization
        this.tags = new Set();
        
        // Entity type for classification
        this.type = 'entity';
        
        // Reference to the game engine
        this.gameEngine = null;
    }
    
    /**
     * Generate a unique ID for the entity
     * @returns {string} Unique ID
     */
    generateUniqueId() {
        return `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Add a component to the entity
     * @param {Component} component - Component to add
     * @returns {Entity} This entity for method chaining
     */
    addComponent(component) {
        // Get component type from constructor name
        const componentType = component.constructor.name;
        
        // Add component to map
        this.components.set(componentType, component);
        
        // Set entity reference on component if it has one
        if (component.entity !== undefined) {
            component.entity = this;
        }
        
        // Notify systems that a component was added
        if (this.gameEngine && this.gameEngine.entityManager) {
            this.gameEngine.entityManager.onComponentAdded(this, componentType, component);
        }
        
        return this;
    }
    
    /**
     * Remove a component from the entity
     * @param {string} componentType - Type of component to remove
     * @returns {Entity} This entity for method chaining
     */
    removeComponent(componentType) {
        if (this.components.has(componentType)) {
            const component = this.components.get(componentType);
            
            // Remove component from map
            this.components.delete(componentType);
            
            // Clear entity reference on component if it has one
            if (component && component.entity !== undefined) {
                component.entity = null;
            }
            
            // Notify systems that a component was removed
            if (this.gameEngine && this.gameEngine.entityManager) {
                this.gameEngine.entityManager.onComponentRemoved(this, componentType, component);
            }
        }
        
        return this;
    }
    
    /**
     * Get a component from the entity
     * @param {string} componentType - Type of component to get
     * @returns {Component|null} The component or null if not found
     */
    getComponent(componentType) {
        return this.components.get(componentType) || null;
    }
    
    /**
     * Check if the entity has a specific component
     * @param {string} componentType - Type of component to check for
     * @returns {boolean} True if the entity has the component
     */
    hasComponent(componentType) {
        return this.components.has(componentType);
    }
    
    /**
     * Get all components of the entity
     * @returns {Map} Map of all components
     */
    getComponents() {
        return this.components;
    }
    
    /**
     * Add a tag to the entity
     * @param {string} tag - Tag to add
     * @returns {Entity} This entity for method chaining
     */
    addTag(tag) {
        this.tags.add(tag);
        
        // Notify systems that a tag was added
        if (this.gameEngine && this.gameEngine.entityManager) {
            this.gameEngine.entityManager.onTagAdded(this, tag);
        }
        
        return this;
    }
    
    /**
     * Remove a tag from the entity
     * @param {string} tag - Tag to remove
     * @returns {Entity} This entity for method chaining
     */
    removeTag(tag) {
        if (this.tags.has(tag)) {
            this.tags.delete(tag);
            
            // Notify systems that a tag was removed
            if (this.gameEngine && this.gameEngine.entityManager) {
                this.gameEngine.entityManager.onTagRemoved(this, tag);
            }
        }
        
        return this;
    }
    
    /**
     * Check if the entity has a specific tag
     * @param {string} tag - Tag to check for
     * @returns {boolean} True if the entity has the tag
     */
    hasTag(tag) {
        return this.tags.has(tag);
    }
    
    /**
     * Get all tags of the entity
     * @returns {Set} Set of all tags
     */
    getTags() {
        return this.tags;
    }
    
    /**
     * Set the entity type
     * @param {string} type - Entity type
     * @returns {Entity} This entity for method chaining
     */
    setType(type) {
        this.type = type;
        return this;
    }
    
    /**
     * Get the entity type
     * @returns {string} Entity type
     */
    getType() {
        return this.type;
    }
    
    /**
     * Activate the entity
     */
    activate() {
        if (!this.active) {
            this.active = true;
            
            // Notify systems that the entity was activated
            if (this.gameEngine && this.gameEngine.entityManager) {
                this.gameEngine.entityManager.onEntityActivated(this);
            }
        }
    }
    
    /**
     * Deactivate the entity
     */
    deactivate() {
        if (this.active) {
            this.active = false;
            
            // Notify systems that the entity was deactivated
            if (this.gameEngine && this.gameEngine.entityManager) {
                this.gameEngine.entityManager.onEntityDeactivated(this);
            }
        }
    }
    
    /**
     * Check if the entity is active
     * @returns {boolean} True if the entity is active
     */
    isActive() {
        return this.active;
    }
    
    /**
     * Update the entity
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        if (!this.active) return;
        
        // Update all components that have an update method
        for (const [type, component] of this.components) {
            if (typeof component.update === 'function') {
                component.update(deltaTime);
            }
        }
    }
    
    /**
     * Render the entity
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        if (!this.active) return;
        
        // Render all components that have a render method
        for (const [type, component] of this.components) {
            if (typeof component.render === 'function') {
                component.render(ctx);
            }
        }
    }
    
    /**
     * Destroy the entity
     */
    destroy() {
        // Deactivate the entity
        this.deactivate();
        
        // Remove all components
        for (const [type, component] of this.components) {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
            this.components.delete(type);
        }
        
        // Clear tags
        this.tags.clear();
        
        // Notify systems that the entity was destroyed
        if (this.gameEngine && this.gameEngine.entityManager) {
            this.gameEngine.entityManager.onEntityDestroyed(this);
        }
        
        // Remove reference to game engine
        this.gameEngine = null;
    }
    
    /**
     * Clone the entity
     * @returns {Entity} A new entity with the same components and tags
     */
    clone() {
        const entity = new Entity();
        entity.type = this.type;
        
        // Clone tags
        for (const tag of this.tags) {
            entity.addTag(tag);
        }
        
        // Clone components
        for (const [type, component] of this.components) {
            if (typeof component.clone === 'function') {
                entity.addComponent(component.clone());
            }
        }
        
        return entity;
    }
    
    /**
     * Serialize the entity for network transmission or saving
     * @returns {object} Serialized entity data
     */
    serialize() {
        const data = {
            id: this.id,
            type: this.type,
            active: this.active,
            tags: Array.from(this.tags),
            components: {}
        };
        
        // Serialize components
        for (const [type, component] of this.components) {
            if (typeof component.serialize === 'function') {
                data.components[type] = component.serialize();
            }
        }
        
        return data;
    }
    
    /**
     * Deserialize entity data
     * @param {object} data - Serialized entity data
     * @returns {Entity} This entity for method chaining
     */
    deserialize(data) {
        this.id = data.id;
        this.type = data.type;
        this.active = data.active;
        
        // Clear existing tags and components
        this.tags.clear();
        this.components.clear();
        
        // Add tags
        for (const tag of data.tags) {
            this.addTag(tag);
        }
        
        // Deserialize components
        for (const [type, componentData] of Object.entries(data.components)) {
            // This would need to be implemented by each specific component type
            // For now, we'll just store the data
            console.warn(`Deserialization of component ${type} not implemented`);
        }
        
        return this;
    }
    
    /**
     * Convert to string representation
     * @returns {string} String representation
     */
    toString() {
        return `Entity(id: ${this.id}, type: ${this.type}, active: ${this.active}, components: ${Array.from(this.components.keys()).join(', ')}, tags: ${Array.from(this.tags).join(', ')})`;
    }
}

// Export for use in modules
export default Entity;