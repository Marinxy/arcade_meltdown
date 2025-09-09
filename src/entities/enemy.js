/**
 * Arcade Meltdown - Enemy Class
 * Represents enemy entities with different types and behaviors
 */

import Entity from './entity.js';
import Transform from '../components/transform.js';
import Physics from '../components/physics.js';
import Render from '../components/render.js';
import Health from '../components/health.js';
import MathUtils from '../utils/math.js';

class Enemy extends Entity {
    /**
     * Create a new Enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} enemyType - Type of enemy (grunt, spitter, bruiser, miniBoss, boss)
     * @param {number} wave - Wave number (affects enemy strength)
     */
    constructor(x, y, enemyType, wave = 1) {
        // Create entity with unique ID
        super(`enemy_${enemyType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        
        // Set entity type and tags
        this.setType('enemy');
        this.addTag('enemy');
        this.addTag(enemyType);
        
        // Enemy type
        this.enemyType = enemyType;
        
        // Wave number (affects enemy strength)
        this.wave = wave;
        
        // Target entity (usually a player)
        this.target = null;
        
        // State machine for AI behavior
        this.state = 'idle'; // idle, chasing, attacking, fleeing
        this.stateTimer = 0;
        
        // AI properties
        this.detectionRange = 300;
        this.attackRange = 50;
        this.attackCooldown = 0;
        this.attackTimer = 0;
        
        // Initialize enemy based on type
        this.initEnemyType(enemyType, wave);
        
        // Add components
        this.addComponents(x, y);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Initialize enemy based on type
     * @param {string} enemyType - Type of enemy
     * @param {number} wave - Wave number
     */
    initEnemyType(enemyType, wave) {
        const enemyConfig = window.config.get(`enemy.types.${enemyType}`);
        
        if (!enemyConfig) {
            console.error(`Invalid enemy type: ${enemyType}`);
            return;
        }
        
        // Scale stats with wave number
        const waveMultiplier = 1 + (wave - 1) * 0.2;
        
        // Set enemy properties
        this.health = Math.floor(enemyConfig.health * waveMultiplier);
        this.speed = enemyConfig.speed;
        this.damage = Math.floor(enemyConfig.damage * waveMultiplier);
        this.points = Math.floor(enemyConfig.points * waveMultiplier);
        
        // Set type-specific properties
        this.setTypeSpecificProperties(enemyType);
    }
    
    /**
     * Set type-specific properties
     * @param {string} enemyType - Type of enemy
     */
    setTypeSpecificProperties(enemyType) {
        switch (enemyType) {
            case 'grunt':
                this.detectionRange = 300;
                this.attackRange = 30;
                this.attackCooldown = 1000;
                this.color = '#ff5555';
                this.size = 20;
                break;
                
            case 'spitter':
                this.detectionRange = 400;
                this.attackRange = 250;
                this.attackCooldown = 2000;
                this.color = '#55ff55';
                this.size = 25;
                this.projectileSpeed = 300;
                break;
                
            case 'bruiser':
                this.detectionRange = 250;
                this.attackRange = 40;
                this.attackCooldown = 1500;
                this.color = '#ff55ff';
                this.size = 35;
                this.chargeSpeed = this.speed * 2;
                this.chargeCooldown = 5000;
                this.chargeTimer = 0;
                break;
                
            case 'miniBoss':
                this.detectionRange = 500;
                this.attackRange = 100;
                this.attackCooldown = 3000;
                this.color = '#ffff55';
                this.size = 50;
                this.specialAttackCooldown = 10000;
                this.specialAttackTimer = 0;
                break;
                
            case 'boss':
                this.detectionRange = 600;
                this.attackRange = 150;
                this.attackCooldown = 2000;
                this.color = '#ff0000';
                this.size = 80;
                this.specialAttackCooldown = 15000;
                this.specialAttackTimer = 0;
                this.phase = 1;
                this.phaseThreshold = 0.5; // Switch phase at 50% health
                break;
        }
    }
    
    /**
     * Add components to the enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    addComponents(x, y) {
        // Transform component
        const transform = new Transform(x, y);
        this.addComponent(transform);
        
        // Physics component
        const physics = new Physics();
        physics.maxSpeed = this.speed;
        physics.friction = 0.9;
        physics.drag = 0.05;
        this.addComponent(physics);
        
        // Render component
        const render = new Render(null, this.color);
        render.layer = 5; // Enemies render below players
        this.addComponent(render);
        
        // Health component
        const health = new Health(this.health);
        health.onDeath = (healthComponent, source) => {
            this.onDeath(source);
        };
        health.onDamage = (healthComponent, damage, source) => {
            this.onDamage(damage, source);
        };
        this.addComponent(health);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            const { path, value } = event;
            
            // Update enemy config if changed
            if (path.startsWith(`enemies.${this.enemyType}`)) {
                this.initEnemyType(this.enemyType, this.wave);
                
                // Update components with new values
                const physics = this.getComponent('Physics');
                if (physics) {
                    physics.maxSpeed = this.speed;
                }
                
                const health = this.getComponent('Health');
                if (health) {
                    health.setMaxHealth(this.health);
                }
            }
        });
    }
    
    /**
     * Update the enemy
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Get components
        const transform = this.getComponent('Transform');
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        
        if (!transform || !physics || !health) return;
        
        // Update timers
        this.updateTimers(deltaTime);
        
        // Update AI state
        this.updateAI(deltaTime, transform, physics, health);
        
        // Update type-specific behavior
        this.updateTypeSpecificBehavior(deltaTime, transform, physics, health);
    }
    
    /**
     * Update timers
     * @param {number} deltaTime - Time elapsed in seconds
     */
    updateTimers(deltaTime) {
        // Update state timer
        this.stateTimer += deltaTime * 1000;
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime * 1000;
            if (this.attackCooldown < 0) {
                this.attackCooldown = 0;
            }
        }
        
        // Update attack timer
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime * 1000;
            if (this.attackTimer < 0) {
                this.attackTimer = 0;
            }
        }
        
        // Update type-specific timers
        switch (this.enemyType) {
            case 'bruiser':
                if (this.chargeTimer > 0) {
                    this.chargeTimer -= deltaTime * 1000;
                    if (this.chargeTimer < 0) {
                        this.chargeTimer = 0;
                    }
                }
                break;
                
            case 'miniBoss':
            case 'boss':
                if (this.specialAttackTimer > 0) {
                    this.specialAttackTimer -= deltaTime * 1000;
                    if (this.specialAttackTimer < 0) {
                        this.specialAttackTimer = 0;
                    }
                }
                break;
        }
    }
    
    /**
     * Update AI state
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Health} health - Health component
     */
    updateAI(deltaTime, transform, physics, health) {
        // Find target if none exists or current target is dead/invalid
        if (!this.target || !this.isValidTarget(this.target)) {
            this.findTarget();
        }
        
        // If no target, return to idle state
        if (!this.target) {
            this.state = 'idle';
            return;
        }
        
        // Get target position
        const targetTransform = this.target.getComponent('Transform');
        if (!targetTransform) return;
        
        // Calculate distance to target
        const distance = MathUtils.distance(
            transform.x, transform.y,
            targetTransform.x, targetTransform.y
        );
        
        // State machine
        switch (this.state) {
            case 'idle':
                // If target is in detection range, start chasing
                if (distance <= this.detectionRange) {
                    this.state = 'chasing';
                    this.stateTimer = 0;
                }
                break;
                
            case 'chasing':
                // Move towards target
                this.moveTowardsTarget(transform, physics, targetTransform);
                
                // If target is in attack range, start attacking
                if (distance <= this.attackRange) {
                    this.state = 'attacking';
                    this.stateTimer = 0;
                }
                // If target is out of detection range, return to idle
                else if (distance > this.detectionRange * 1.5) {
                    this.state = 'idle';
                    this.stateTimer = 0;
                }
                break;
                
            case 'attacking':
                // Face target
                const angle = MathUtils.angle(
                    transform.x, transform.y,
                    targetTransform.x, targetTransform.y
                );
                transform.rotation = angle;
                
                // Attack if cooldown is ready
                if (this.attackCooldown <= 0) {
                    this.performAttack(transform, targetTransform);
                    this.attackCooldown = this.getAttackCooldown();
                    this.attackTimer = 500; // Attack animation duration
                }
                
                // If target is out of attack range, start chasing
                if (distance > this.attackRange * 1.2) {
                    this.state = 'chasing';
                    this.stateTimer = 0;
                }
                break;
                
            case 'fleeing':
                // Move away from target
                this.moveAwayFromTarget(transform, physics, targetTransform);
                
                // Flee for a certain time, then return to chasing
                if (this.stateTimer > 3000) {
                    this.state = 'chasing';
                    this.stateTimer = 0;
                }
                break;
        }
    }
    
    /**
     * Update type-specific behavior
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Health} health - Health component
     */
    updateTypeSpecificBehavior(deltaTime, transform, physics, health) {
        switch (this.enemyType) {
            case 'bruiser':
                this.updateBruiserBehavior(deltaTime, transform, physics, health);
                break;
                
            case 'spitter':
                this.updateSpitterBehavior(deltaTime, transform, physics, health);
                break;
                
            case 'miniBoss':
                this.updateMiniBossBehavior(deltaTime, transform, physics, health);
                break;
                
            case 'boss':
                this.updateBossBehavior(deltaTime, transform, physics, health);
                break;
        }
    }
    
    /**
     * Update Bruiser-specific behavior
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Health} health - Health component
     */
    updateBruiserBehavior(deltaTime, transform, physics, health) {
        // Bruisers can charge at players
        if (this.chargeTimer <= 0 && this.state === 'chasing') {
            // 20% chance to charge when chasing
            if (Math.random() < 0.2) {
                this.state = 'charging';
                this.stateTimer = 0;
                physics.maxSpeed = this.chargeSpeed;
                this.chargeTimer = this.chargeCooldown;
                
                // Emit charge event
                window.eventSystem.emit('enemy:bruiserCharge', this);
            }
        }
        
        // Handle charging state
        if (this.state === 'charging') {
            // Charge for 2 seconds, then return to chasing
            if (this.stateTimer > 2000) {
                this.state = 'chasing';
                this.stateTimer = 0;
                physics.maxSpeed = this.speed;
            }
        }
    }
    
    /**
     * Update Spitter-specific behavior
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Health} health - Health component
     */
    updateSpitterBehavior(deltaTime, transform, physics, health) {
        // Spitters attack from a distance
        if (this.state === 'attacking') {
            // Keep distance from target
            const targetTransform = this.target.getComponent('Transform');
            if (targetTransform) {
                const distance = MathUtils.distance(
                    transform.x, transform.y,
                    targetTransform.x, targetTransform.y
                );
                
                // If too close, move away
                if (distance < this.attackRange * 0.8) {
                    this.moveAwayFromTarget(transform, physics, targetTransform);
                }
                // If too far, move closer
                else if (distance > this.attackRange) {
                    this.moveTowardsTarget(transform, physics, targetTransform);
                }
            }
        }
    }
    
    /**
     * Update Mini-boss-specific behavior
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Health} health - Health component
     */
    updateMiniBossBehavior(deltaTime, transform, physics, health) {
        // Mini-bosses have special attacks
        if (this.specialAttackTimer <= 0) {
            this.performSpecialAttack(transform);
            this.specialAttackTimer = this.specialAttackCooldown;
        }
    }
    
    /**
     * Update Boss-specific behavior
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Health} health - Health component
     */
    updateBossBehavior(deltaTime, transform, physics, health) {
        // Bosses have multiple phases
        const healthPercentage = health.getHealthPercentage();
        
        // Switch to phase 2 if health is below threshold
        if (this.phase === 1 && healthPercentage < this.phaseThreshold) {
            this.phase = 2;
            this.speed *= 1.5;
            physics.maxSpeed = this.speed;
            this.damage *= 1.5;
            
            // Emit phase change event
            window.eventSystem.emit('enemy:bossPhaseChange', this, this.phase);
        }
        
        // Bosses have special attacks
        if (this.specialAttackTimer <= 0) {
            this.performSpecialAttack(transform);
            this.specialAttackTimer = this.specialAttackCooldown * (this.phase === 2 ? 0.7 : 1);
        }
    }
    
    /**
     * Find a target (usually the nearest player)
     */
    findTarget() {
        // This would typically query the game engine for all players
        // For now, we'll just emit an event and let the game engine handle it
        window.eventSystem.emit('enemy:findTarget', this);
    }
    
    /**
     * Check if a target is valid
     * @param {Entity} target - Target to check
     * @returns {boolean} True if target is valid
     */
    isValidTarget(target) {
        if (!target || !target.isActive()) return false;
        if (!target.hasTag('player')) return false;
        
        const health = target.getComponent('Health');
        if (!health || health.isEntityDead()) return false;
        
        return true;
    }
    
    /**
     * Move towards target
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Transform} targetTransform - Target's transform component
     */
    moveTowardsTarget(transform, physics, targetTransform) {
        const angle = MathUtils.angle(
            transform.x, transform.y,
            targetTransform.x, targetTransform.y
        );
        
        const force = 200;
        physics.applyForce(
            Math.cos(angle) * force,
            Math.sin(angle) * force
        );
    }
    
    /**
     * Move away from target
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Transform} targetTransform - Target's transform component
     */
    moveAwayFromTarget(transform, physics, targetTransform) {
        const angle = MathUtils.angle(
            transform.x, transform.y,
            targetTransform.x, targetTransform.y
        );
        
        const force = 200;
        physics.applyForce(
            -Math.cos(angle) * force,
            -Math.sin(angle) * force
        );
    }
    
    /**
     * Perform an attack
     * @param {Transform} transform - Transform component
     * @param {Transform} targetTransform - Target's transform component
     */
    performAttack(transform, targetTransform) {
        // Emit attack event
        window.eventSystem.emit('enemy:attack', this, this.target);
        
        // Different attack types based on enemy type
        switch (this.enemyType) {
            case 'grunt':
                // Melee attack
                this.performMeleeAttack(transform, targetTransform);
                break;
                
            case 'spitter':
                // Ranged projectile attack
                this.performProjectileAttack(transform, targetTransform);
                break;
                
            case 'bruiser':
                // Melee attack with knockback
                this.performMeleeAttack(transform, targetTransform, true);
                break;
                
            case 'miniBoss':
                // Special melee attack
                this.performSpecialMeleeAttack(transform, targetTransform);
                break;
                
            case 'boss':
                // Area of effect attack
                this.performAOEAttack(transform);
                break;
        }
    }
    
    /**
     * Perform a melee attack
     * @param {Transform} transform - Transform component
     * @param {Transform} targetTransform - Target's transform component
     * @param {boolean} knockback - Whether to apply knockback
     */
    performMeleeAttack(transform, targetTransform, knockback = false) {
        // Emit melee attack event
        window.eventSystem.emit('enemy:meleeAttack', this, this.target, knockback);
    }
    
    /**
     * Perform a projectile attack
     * @param {Transform} transform - Transform component
     * @param {Transform} targetTransform - Target's transform component
     */
    performProjectileAttack(transform, targetTransform) {
        // Calculate projectile velocity
        const angle = MathUtils.angle(
            transform.x, transform.y,
            targetTransform.x, targetTransform.y
        );
        
        const projectile = {
            type: 'spit',
            x: transform.x,
            y: transform.y,
            vx: Math.cos(angle) * this.projectileSpeed,
            vy: Math.sin(angle) * this.projectileSpeed,
            damage: this.damage,
            owner: this
        };
        
        // Emit projectile attack event
        window.eventSystem.emit('enemy:projectileAttack', this, projectile);
    }
    
    /**
     * Perform a special melee attack
     * @param {Transform} transform - Transform component
     * @param {Transform} targetTransform - Target's transform component
     */
    performSpecialMeleeAttack(transform, targetTransform) {
        // Emit special melee attack event
        window.eventSystem.emit('enemy:specialMeleeAttack', this, this.target);
    }
    
    /**
     * Perform an area of effect attack
     * @param {Transform} transform - Transform component
     */
    performAOEAttack(transform) {
        // Emit AOE attack event
        window.eventSystem.emit('enemy:aoeAttack', this, transform.x, transform.y, 150);
    }
    
    /**
     * Perform a special attack
     * @param {Transform} transform - Transform component
     */
    performSpecialAttack(transform) {
        // Different special attacks based on enemy type
        switch (this.enemyType) {
            case 'miniBoss':
                // Spawn minions
                window.eventSystem.emit('enemy:miniBossSpecial', this, transform.x, transform.y);
                break;
                
            case 'boss':
                // Map-wide attack
                window.eventSystem.emit('enemy:bossSpecial', this);
                break;
        }
    }
    
    /**
     * Get attack cooldown based on enemy type
     * @returns {number} Attack cooldown in ms
     */
    getAttackCooldown() {
        switch (this.enemyType) {
            case 'grunt':
                return 1000;
            case 'spitter':
                return 2000;
            case 'bruiser':
                return 1500;
            case 'miniBoss':
                return 3000;
            case 'boss':
                return 2000;
            default:
                return 1000;
        }
    }
    
    /**
     * Handle enemy death
     * @param {object} source - Source of death
     */
    onDeath(source) {
        // Emit death event
        window.eventSystem.emit('enemy:death', this, source);
        
        // Award points to killer
        if (source && source.hasTag('player')) {
            source.addScore(this.points);
        }
        
        // Increase chaos level
        window.eventSystem.emit('chaos:increase', 0.05);
    }
    
    /**
     * Handle enemy taking damage
     * @param {number} damage - Amount of damage
     * @param {object} source - Source of damage
     */
    onDamage(damage, source) {
        // Emit damage event
        window.eventSystem.emit('enemy:damage', this, damage, source);
        
        // Increase chaos level
        window.eventSystem.emit('chaos:increase', 0.02);
        
        // Bruisers flee when heavily damaged
        if (this.enemyType === 'bruiser') {
            const health = this.getComponent('Health');
            if (health && health.getHealthPercentage() < 0.3) {
                this.state = 'fleeing';
                this.stateTimer = 0;
            }
        }
    }
    
    /**
     * Serialize enemy for network transmission
     * @returns {object} Serialized enemy data
     */
    serialize() {
        const data = super.serialize();
        
        // Add enemy-specific data
        data.enemyType = this.enemyType;
        data.wave = this.wave;
        data.state = this.state;
        data.target = this.target ? this.target.id : null;
        data.attackCooldown = this.attackCooldown;
        data.points = this.points;
        
        // Add type-specific data
        switch (this.enemyType) {
            case 'bruiser':
                data.chargeTimer = this.chargeTimer;
                break;
                
            case 'miniBoss':
            case 'boss':
                data.specialAttackTimer = this.specialAttackTimer;
                break;
                
            case 'boss':
                data.phase = this.phase;
                break;
        }
        
        return data;
    }
    
    /**
     * Deserialize enemy data
     * @param {object} data - Serialized enemy data
     * @returns {Enemy} This enemy for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set enemy-specific data
        this.enemyType = data.enemyType;
        this.wave = data.wave;
        this.state = data.state;
        this.attackCooldown = data.attackCooldown;
        this.points = data.points;
        
        // Target would need to be resolved by ID
        // This would typically be handled by the game engine
        
        // Set type-specific data
        switch (this.enemyType) {
            case 'bruiser':
                this.chargeTimer = data.chargeTimer;
                break;
                
            case 'miniBoss':
            case 'boss':
                this.specialAttackTimer = data.specialAttackTimer;
                break;
                
            case 'boss':
                this.phase = data.phase;
                break;
        }
        
        return this;
    }
}

// Export for use in modules
export default Enemy;