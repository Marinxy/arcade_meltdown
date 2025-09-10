/**
 * Arcade Meltdown - Bullet Class
 * Represents projectiles fired by weapons or enemies
 */

import Entity from './entity.js';
import Transform from '../components/transform.js';
import Physics from '../components/physics.js';
import Render from '../components/render.js';
import MathUtils from '../utils/math.js';

class Bullet extends Entity {
    /**
     * Create a new Bullet
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} angle - Angle in radians
     * @param {number} speed - Bullet speed
     * @param {number} damage - Bullet damage
     * @param {string} type - Bullet type
     * @param {Entity} owner - Entity that fired the bullet
     */
    constructor(x, y, angle, speed, damage, type = 'bullet', owner = null) {
        // Create entity with unique ID
        super(`bullet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        
        // Set entity type and tags
        this.setType('bullet');
        this.addTag('bullet');
        this.addTag(type);
        
        // Bullet properties
        this.type = type;
        this.damage = damage;
        this.owner = owner;
        this.range = 500; // Default range
        this.penetration = 0; // Number of entities it can pass through
        this.splashDamage = 0; // Area of effect damage
        this.splashRadius = 0; // Area of effect radius
        this.lifetime = 2000; // Bullet lifetime in ms
        
        // Bullet state
        this.active = true;
        this.distanceTraveled = 0;
        this.entitiesHit = new Set(); // Track entities already hit
        
        // Initialize bullet based on type
        this.initBulletType(type);
        
        // Add components
        this.addComponents(x, y, angle, speed);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Initialize bullet based on type
     * @param {string} type - Bullet type
     */
    initBulletType(type) {
        switch (type) {
            case 'bullet':
                this.color = '#ffff00';
                this.size = 4;
                break;
                
            case 'pellet':
                this.color = '#ffaa00';
                this.size = 3;
                this.range = 200;
                break;
                
            case 'plasma':
                this.color = '#00ffff';
                this.size = 6;
                this.penetration = 3;
                break;
                
            case 'rocket':
                this.color = '#ff0000';
                this.size = 8;
                this.splashDamage = 40;
                this.splashRadius = 100;
                break;
                
            case 'spit':
                this.color = '#55ff55';
                this.size = 5;
                break;
                
            case 'flame':
                this.color = '#ff5500';
                this.size = 10;
                this.lifetime = 500;
                break;
                
            case 'heal':
                this.color = '#00ff00';
                this.size = 6;
                this.damage = -25; // Negative damage = healing
                break;
                
            default:
                this.color = '#ffffff';
                this.size = 4;
        }
    }
    
    /**
     * Add components to the bullet
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} angle - Angle in radians
     * @param {number} speed - Bullet speed
     */
    addComponents(x, y, angle, speed) {
        // Transform component
        const transform = new Transform(x, y, angle);
        this.addComponent(transform);
        
        // Physics component
        const physics = new Physics();
        physics.velocity.x = Math.cos(angle) * speed;
        physics.velocity.y = Math.sin(angle) * speed;
        physics.isStatic = false;
        physics.drag = 0; // No drag for bullets
        this.addComponent(physics);
        
        // Render component
        const render = new Render(null, this.color);
        render.layer = 15; // Bullets render on top of everything
        this.addComponent(render);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // No specific event listeners for bullets at this time
    }
    
    /**
     * Update the bullet
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Get components
        const transform = this.getComponent('Transform');
        const physics = this.getComponent('Physics');
        
        if (!transform || !physics) return;
        
        // Update distance traveled
        const distance = Math.sqrt(
            physics.velocity.x ** 2 + 
            physics.velocity.y ** 2
        ) * deltaTime;
        this.distanceTraveled += distance;
        
        // Check if bullet has exceeded its range
        if (this.distanceTraveled > this.range) {
            this.destroy();
            return;
        }
        
        // Update lifetime
        this.lifetime -= deltaTime * 1000;
        if (this.lifetime <= 0) {
            this.destroy();
            return;
        }
        
        // Update rotation to match velocity direction
        if (physics.velocity.x !== 0 || physics.velocity.y !== 0) {
            transform.rotation = Math.atan2(physics.velocity.y, physics.velocity.x);
        }
        
        // Create trail effect for certain bullet types
        if (this.type === 'plasma' || this.type === 'rocket') {
            this.createTrailEffect(transform);
        }
    }
    
    /**
     * Create a trail effect for the bullet
     * @param {Transform} transform - Transform component
     */
    createTrailEffect(transform) {
        // This would create a particle effect at the bullet's position
        // For now, we'll just emit an event
        window.eventSystem.emit('bullet:trail', this, transform.x, transform.y);
    }
    
    /**
     * Handle collision with an entity
     * @param {Entity} entity - Entity collided with
     */
    onCollision(entity) {
        // Don't collide with owner
        if (entity === this.owner) return;
        
        // Don't collide with entities already hit
        if (this.entitiesHit.has(entity)) return;
        
        // Don't collide with other bullets
        if (entity.hasTag('bullet')) return;
        
        // Handle different collision types based on bullet type
        switch (this.type) {
            case 'heal':
                // Heal bullets heal players
                if (entity.hasTag('player')) {
                    this.healEntity(entity);
                }
                break;
                
            default:
                // Damage entities
                if (entity.hasTag('player') || entity.hasTag('enemy')) {
                    this.damageEntity(entity);
                }
                break;
        }
        
        // Add to hit entities
        this.entitiesHit.add(entity);
        
        // Reduce penetration count
        this.penetration--;
        
        // Apply splash damage if applicable
        if (this.splashDamage > 0) {
            this.applySplashDamage(entity);
        }
        
        // Destroy bullet if no penetration left
        if (this.penetration < 0) {
            this.destroy();
        }
    }
    
    /**
     * Handle collision (called by collision system)
     */
    onCollision() {
        // Destroy bullet on collision
        this.destroy();
    }
    
    /**
     * Damage an entity
     * @param {Entity} entity - Entity to damage
     */
    damageEntity(entity) {
        const health = entity.getComponent('Health');
        if (health) {
            health.takeDamage(this.damage, this.owner);
            
            // Emit damage event
            window.eventSystem.emit('bullet:hit', this, entity, this.damage);
        }
    }
    
    /**
     * Heal an entity
     * @param {Entity} entity - Entity to heal
     */
    healEntity(entity) {
        const health = entity.getComponent('Health');
        if (health) {
            health.heal(-this.damage, this.owner); // Negative damage = healing
            
            // Emit heal event
            window.eventSystem.emit('bullet:heal', this, entity, -this.damage);
        }
    }
    
    /**
     * Apply splash damage
     * @param {Entity} impactEntity - Entity at impact point
     */
    applySplashDamage(impactEntity) {
        // Get impact position
        const impactTransform = impactEntity.getComponent('Transform');
        if (!impactTransform) return;
        
        // Emit splash damage event
        window.eventSystem.emit('bullet:splash', this, impactTransform.x, impactTransform.y, this.splashRadius, this.splashDamage);
    }
    
    /**
     * Render the bullet
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        const transform = this.getComponent('Transform');
        const render = this.getComponent('Render');
        
        if (!transform || !render || !render.visible) return;
        
        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.rotate(transform.rotation);
        
        // Draw bullet based on type
        ctx.fillStyle = render.color;
        
        switch (this.type) {
            case 'bullet':
                ctx.fillRect(-2, -1, 4, 2);
                break;
            case 'pellet':
                ctx.beginPath();
                ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'plasma':
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rocket':
                ctx.fillRect(-4, -2, 8, 4);
                break;
            case 'spit':
                ctx.beginPath();
                ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'flame':
                ctx.beginPath();
                ctx.moveTo(0, -5);
                ctx.lineTo(3, 0);
                ctx.lineTo(0, 5);
                ctx.lineTo(-3, 0);
                ctx.closePath();
                ctx.fill();
                break;
            case 'heal':
                ctx.fillRect(-1, -3, 2, 6);
                ctx.fillRect(-3, -1, 6, 2);
                break;
            default:
                ctx.fillRect(-2, -2, 4, 4);
        }
        
        ctx.restore();
    }
    
    /**
     * Destroy the bullet
     */
    destroy() {
        if (!this.active) return;
        
        // Emit destroy event
        window.eventSystem.emit('bullet:destroy', this);
        
        // Create explosion effect for rockets
        if (this.type === 'rocket') {
            const transform = this.getComponent('Transform');
            if (transform) {
                window.eventSystem.emit('bullet:explosion', this, transform.x, transform.y, this.splashRadius);
            }
        }
        
        // Call parent destroy
        super.destroy();
    }
    
    /**
     * Serialize bullet for network transmission
     * @returns {object} Serialized bullet data
     */
    serialize() {
        const data = super.serialize();
        
        // Add bullet-specific data
        data.type = this.type;
        data.damage = this.damage;
        data.owner = this.owner ? this.owner.id : null;
        data.range = this.range;
        data.penetration = this.penetration;
        data.splashDamage = this.splashDamage;
        data.splashRadius = this.splashRadius;
        data.lifetime = this.lifetime;
        data.distanceTraveled = this.distanceTraveled;
        
        return data;
    }
    
    /**
     * Deserialize bullet data
     * @param {object} data - Serialized bullet data
     * @returns {Bullet} This bullet for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set bullet-specific data
        this.type = data.type;
        this.damage = data.damage;
        this.range = data.range;
        this.penetration = data.penetration;
        this.splashDamage = data.splashDamage;
        this.splashRadius = data.splashRadius;
        this.lifetime = data.lifetime;
        this.distanceTraveled = data.distanceTraveled;
        
        // Owner would need to be resolved by ID
        // This would typically be handled by the game engine
        
        return this;
    }
}

// Export for use in modules
export default Bullet;