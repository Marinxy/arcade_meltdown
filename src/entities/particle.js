/**
 * Arcade Meltdown - Particle Class
 * Represents visual particles for effects like explosions, trails, etc.
 */

import Entity from './entity.js';
import Transform from '../components/transform.js';
import Physics from '../components/physics.js';
import Render from '../components/render.js';
import MathUtils from '../utils/math.js';

class Particle extends Entity {
    /**
     * Create a new Particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} type - Particle type
     * @param {object} options - Particle options
     */
    constructor(x, y, type, options = {}) {
        // Create entity with unique ID
        super(`particle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        
        // Set entity type and tags
        this.setType('particle');
        this.addTag('particle');
        this.addTag(type);
        
        // Particle properties
        this.type = type;
        this.lifetime = options.lifetime || 1000; // Particle lifetime in ms
        this.maxLifetime = this.lifetime;
        this.fadeOut = options.fadeOut !== false; // Whether to fade out over time
        this.scaleOut = options.scaleOut !== false; // Whether to scale out over time
        this.rotationSpeed = options.rotationSpeed || 0; // Rotation speed in radians per second
        
        // Initialize particle based on type
        this.initParticleType(type, options);
        
        // Add components
        this.addComponents(x, y, options);
    }
    
    /**
     * Initialize particle based on type
     * @param {string} type - Particle type
     * @param {object} options - Particle options
     */
    initParticleType(type, options) {
        switch (type) {
            case 'explosion':
                this.color = options.color || '#ff5500';
                this.size = options.size || MathUtils.random(5, 15);
                this.velocity = {
                    x: MathUtils.random(-200, 200),
                    y: MathUtils.random(-200, 200)
                };
                this.gravity = { x: 0, y: 300 };
                this.friction = 0.95;
                break;
                
            case 'sparks':
                this.color = options.color || '#ffff00';
                this.size = options.size || MathUtils.random(2, 5);
                this.velocity = {
                    x: MathUtils.random(-300, 300),
                    y: MathUtils.random(-300, 300)
                };
                this.gravity = { x: 0, y: 500 };
                this.friction = 0.9;
                this.lifetime = options.lifetime || 500;
                break;
                
            case 'smoke':
                this.color = options.color || '#666666';
                this.size = options.size || MathUtils.random(10, 30);
                this.velocity = {
                    x: MathUtils.random(-50, 50),
                    y: MathUtils.random(-100, -50)
                };
                this.gravity = { x: 0, y: -20 }; // Smoke rises
                this.friction = 0.98;
                this.lifetime = options.lifetime || 2000;
                this.fadeOut = true;
                this.scaleOut = true;
                break;
                
            case 'blood':
                this.color = options.color || '#ff0000';
                this.size = options.size || MathUtils.random(2, 6);
                this.velocity = {
                    x: MathUtils.random(-150, 150),
                    y: MathUtils.random(-200, -50)
                };
                this.gravity = { x: 0, y: 500 };
                this.friction = 0.9;
                this.lifetime = options.lifetime || 1000;
                break;
                
            case 'plasma':
                this.color = options.color || '#00ffff';
                this.size = options.size || MathUtils.random(3, 8);
                this.velocity = {
                    x: MathUtils.random(-100, 100),
                    y: MathUtils.random(-100, 100)
                };
                this.gravity = { x: 0, y: 0 };
                this.friction = 0.95;
                this.rotationSpeed = MathUtils.random(-5, 5);
                break;
                
            case 'heal':
                this.color = options.color || '#00ff00';
                this.size = options.size || MathUtils.random(5, 10);
                this.velocity = {
                    x: MathUtils.random(-50, 50),
                    y: MathUtils.random(-100, -50)
                };
                this.gravity = { x: 0, y: -100 }; // Heal particles rise
                this.friction = 0.95;
                this.lifetime = options.lifetime || 1500;
                this.fadeOut = true;
                break;
                
            case 'bulletTrail':
                this.color = options.color || '#ffff00';
                this.size = options.size || MathUtils.random(2, 4);
                this.velocity = options.velocity || { x: 0, y: 0 };
                this.gravity = { x: 0, y: 0 };
                this.friction = 0.9;
                this.lifetime = options.lifetime || 200;
                this.fadeOut = true;
                break;
                
            case 'flame':
                this.color = options.color || '#ff5500';
                this.size = options.size || MathUtils.random(5, 15);
                this.velocity = {
                    x: MathUtils.random(-30, 30),
                    y: MathUtils.random(-100, -50)
                };
                this.gravity = { x: 0, y: -50 }; // Flames rise
                this.friction = 0.95;
                this.lifetime = options.lifetime || 800;
                this.fadeOut = true;
                break;
                
            default:
                this.color = options.color || '#ffffff';
                this.size = options.size || 5;
                this.velocity = options.velocity || { x: 0, y: 0 };
                this.gravity = { x: 0, y: 0 };
                this.friction = 0.95;
        }
    }
    
    /**
     * Add components to the particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {object} options - Particle options
     */
    addComponents(x, y, options) {
        // Transform component
        const transform = new Transform(x, y);
        transform.rotation = options.rotation || MathUtils.random(0, Math.PI * 2);
        this.addComponent(transform);
        
        // Physics component
        const physics = new Physics();
        physics.velocity = { ...this.velocity };
        physics.gravity = { ...this.gravity };
        physics.friction = this.friction;
        physics.drag = 0.01;
        this.addComponent(physics);
        
        // Render component
        const render = new Render(null, this.color);
        render.layer = 20; // Particles render on top of everything
        render.scale = { x: 1, y: 1 };
        this.addComponent(render);
    }
    
    /**
     * Update the particle
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Get components
        const transform = this.getComponent('Transform');
        const physics = this.getComponent('Physics');
        const render = this.getComponent('Render');
        
        if (!transform || !physics || !render) return;
        
        // Update lifetime
        this.lifetime -= deltaTime * 1000;
        
        // Destroy particle if lifetime is over
        if (this.lifetime <= 0) {
            this.destroy();
            return;
        }
        
        // Update rotation
        if (this.rotationSpeed !== 0) {
            transform.rotation += this.rotationSpeed * deltaTime;
        }
        
        // Update fade out
        if (this.fadeOut) {
            const lifeRatio = this.lifetime / this.maxLifetime;
            render.opacity = lifeRatio;
        }
        
        // Update scale out
        if (this.scaleOut) {
            const lifeRatio = this.lifetime / this.maxLifetime;
            const scale = 1 + (1 - lifeRatio) * 2; // Scale up to 3x original size
            render.scale = { x: scale, y: scale };
        }
        
        // Update color based on lifetime for some particle types
        if (this.type === 'flame' || this.type === 'plasma') {
            const lifeRatio = this.lifetime / this.maxLifetime;
            // Shift from yellow/orange to red as particle ages
            const r = 255;
            const g = Math.floor(255 * lifeRatio);
            const b = Math.floor(100 * lifeRatio);
            render.color = `rgb(${r}, ${g}, ${b})`;
        }
    }
    
    /**
     * Destroy the particle
     */
    destroy() {
        // Call parent destroy
        super.destroy();
    }
    
    /**
     * Serialize particle for network transmission
     * @returns {object} Serialized particle data
     */
    serialize() {
        const data = super.serialize();
        
        // Add particle-specific data
        data.type = this.type;
        data.lifetime = this.lifetime;
        data.maxLifetime = this.maxLifetime;
        data.fadeOut = this.fadeOut;
        data.scaleOut = this.scaleOut;
        data.rotationSpeed = this.rotationSpeed;
        data.color = this.getComponent('Render').color;
        data.size = this.size;
        
        return data;
    }
    
    /**
     * Deserialize particle data
     * @param {object} data - Serialized particle data
     * @returns {Particle} This particle for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set particle-specific data
        this.type = data.type;
        this.lifetime = data.lifetime;
        this.maxLifetime = data.maxLifetime;
        this.fadeOut = data.fadeOut;
        this.scaleOut = data.scaleOut;
        this.rotationSpeed = data.rotationSpeed;
        this.size = data.size;
        
        // Update render component color
        const render = this.getComponent('Render');
        if (render && data.color) {
            render.color = data.color;
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Particle;
}