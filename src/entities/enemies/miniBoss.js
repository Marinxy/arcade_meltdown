/**
 * Arcade Meltdown - Mini-Boss Enemy Class
 * Powerful enemy with multiple attack patterns and phases
 */

import Enemy from './enemy.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Collision from '../../components/collision.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class MiniBoss extends Enemy {
    /**
     * Create a new Mini-Boss enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'miniBoss');
        
        // Enemy properties
        this.speed = 100; // Slow movement speed
        this.health = 500; // High health
        this.damage = 20; // Moderate damage
        
        // Phase properties
        this.phases = 2; // Number of phases
        this.currentPhase = 1; // Current phase
        this.phaseTransitionHealth = 0.5; // Health percentage to transition to next phase
        
        // Attack properties
        this.attackPatterns = ['melee', 'ranged', 'summon', 'charge'];
        this.currentAttackPattern = null;
        this.attackCooldown = 3; // seconds between attacks
        this.attackTimer = 0;
        this.isAttacking = false;
        this.canAttack = true;
        
        // Melee attack properties
        this.meleeRange = 60;
        this.meleeDamage = 25;
        this.meleeWindup = 0.8;
        this.meleeDuration = 0.5;
        
        // Ranged attack properties
        this.rangedRange = 400;
        this.rangedDamage = 15;
        this.rangedProjectileSpeed = 300;
        this.rangedProjectileSize = 8;
        this.rangedSpread = 0.2;
        this.rangedProjectileCount = 3;
        
        // Summon attack properties
        this.summonRange = 300;
        this.summonCount = 3; // Number of enemies to summon
        self.summonCooldown = 10; // seconds between summons
        self.canSummon = true;
        self.summonTimer = 0;
        
        // Charge attack properties
        this.chargeSpeed = 250;
        this.chargeDistance = 200;
        this.chargeDamage = 30;
        this.chargeKnockback = 300;
        self.canCharge = true;
        self.chargeCooldown = 8;
        self.chargeTimer = 0;
        self.isCharging = false;
        self.chargeDirection = 0;
        self.chargeDistanceTraveled = 0;
        
        // AI properties
        this.aggressive = true;
        this.patternChangeChance = 0.3; // Chance to change attack pattern
        this.patternChangeTimer = 0;
        this.patternChangeInterval = 5; // seconds
        
        // Visual properties
        this.color = '#ff33ff';
        this.size = 30;
        this.phaseColors = ['#ff33ff', '#ff00ff']; // Colors for each phase
        
        // State
        this.attackWindupTimer = 0;
        this.attackExecuteTimer = 0;
        this.isVulnerable = true;
        this.vulnerabilityTimer = 0;
        this.vulnerabilityDuration = 2; // seconds of vulnerability after attack
        this.invulnerabilityDuration = 1; // seconds of invulnerability after taking damage
        
        // Initialize components
        this.initComponents();
        
        // Select initial attack pattern
        this.selectAttackPattern();
    }
    
    /**
     * Initialize components
     */
    initComponents() {
        // Get components
        const physics = this.getComponent('Physics');
        const health = this.getComponent('Health');
        const render = this.getComponent('Render');
        const collision = this.getComponent('Collision');
        
        // Update physics component
        if (physics) {
            physics.maxSpeed = this.speed;
            physics.acceleration = 200;
            physics.deceleration = 400;
            physics.mass = 3; // Heavy mass
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderMiniBoss.bind(this);
        }
        
        // Update collision component
        if (collision) {
            collision.radius = this.size;
        }
    }
    
    /**
     * Update the mini-boss enemy
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Update attack timer
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
            
            // Check if attack is complete
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.canAttack = true;
            }
        }
        
        // Update summon timer
        if (self.summonTimer > 0) {
            self.summonTimer -= deltaTime;
            
            // Check if summon cooldown is complete
            if (self.summonTimer <= 0) {
                self.canSummon = true;
            }
        }
        
        // Update charge timer
        if (self.chargeTimer > 0) {
            self.chargeTimer -= deltaTime;
            
            // Check if charge cooldown is complete
            if (self.chargeTimer <= 0) {
                self.canCharge = true;
            }
        }
        
        // Update pattern change timer
        if (this.patternChangeTimer > 0) {
            this.patternChangeTimer -= deltaTime;
            
            // Check if should change pattern
            if (this.patternChangeTimer <= 0 && Math.random() < this.patternChangeChance) {
                this.selectAttackPattern();
                this.patternChangeTimer = this.patternChangeInterval;
            }
        }
        
        // Update vulnerability timer
        if (this.vulnerabilityTimer > 0) {
            this.vulnerabilityTimer -= deltaTime;
            
            // Check if vulnerability should end
            if (this.vulnerabilityTimer <= 0) {
                this.isVulnerable = true;
            }
        }
        
        // Update attack windup timer
        if (this.attackWindupTimer > 0) {
            this.attackWindupTimer -= deltaTime;
            
            // Check if should execute attack
            if (this.attackWindupTimer <= 0) {
                this.executeCurrentAttack();
            }
        }
        
        // Update attack execute timer
        if (this.attackExecuteTimer > 0) {
            this.attackExecuteTimer -= deltaTime;
            
            // Check if attack is complete
            if (this.attackExecuteTimer <= 0) {
                this.completeCurrentAttack();
            }
        }
        
        // Update charge distance if charging
        if (self.isCharging) {
            // Calculate distance traveled this frame
            const physics = this.getComponent('Physics');
            if (physics) {
                const frameDistance = Math.sqrt(
                    physics.velocity.x * physics.velocity.x + 
                    physics.velocity.y * physics.velocity.y
                ) * deltaTime;
                
                self.chargeDistanceTraveled += frameDistance;
                
                // Stop charging if reached maximum distance
                if (self.chargeDistanceTraveled >= this.chargeDistance) {
                    this.stopCharging();
                }
            }
        }
        
        // Check for phase transition
        this.checkPhaseTransition();
        
        // Update AI
        this.updateAI(deltaTime);
    }
    
    /**
     * Check for phase transition
     */
    checkPhaseTransition() {
        // Get health component
        const health = this.getComponent('Health');
        if (!health) return;
        
        // Calculate health percentage
        const healthPercentage = health.getHealthPercentage();
        
        // Check if should transition to next phase
        const transitionHealth = this.phaseTransitionHealth * (3 - this.currentPhase);
        if (healthPercentage <= transitionHealth && this.currentPhase < this.phases) {
            this.transitionToNextPhase();
        }
    }
    
    /**
     * Transition to next phase
     */
    transitionToNextPhase() {
        // Increment phase
        this.currentPhase++;
        
        // Update color
        this.color = this.phaseColors[this.currentPhase - 1];
        
        // Increase stats
        this.damage *= 1.5;
        this.attackCooldown *= 0.8;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            physics.maxSpeed *= 1.2;
        }
        
        // Emit phase transition event
        window.eventSystem.emit('miniBoss:phaseTransition', this, this.currentPhase);
        
        // Select new attack pattern
        this.selectAttackPattern();
    }
    
    /**
     * Select attack pattern
     */
    selectAttackPattern() {
        // Filter available attack patterns based on phase
        let availablePatterns = [...this.attackPatterns];
        
        // Remove summon if not available or in phase 1
        if (!self.canSummon || this.currentPhase === 1) {
            availablePatterns = availablePatterns.filter(pattern => pattern !== 'summon');
        }
        
        // Remove charge if not available
        if (!self.canCharge) {
            availablePatterns = availablePatterns.filter(pattern => pattern !== 'charge');
        }
        
        // Select random pattern
        this.currentAttackPattern = availablePatterns[
            Math.floor(Math.random() * availablePatterns.length)
        ];
        
        // Reset pattern change timer
        this.patternChangeTimer = this.patternChangeInterval;
        
        // Emit pattern change event
        window.eventSystem.emit('miniBoss:patternChange', this, this.currentAttackPattern);
    }
    
    /**
     * Update AI behavior
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateAI(deltaTime) {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Find nearest player
        const nearestPlayer = this.findNearestPlayer();
        if (!nearestPlayer) return;
        
        // Get player transform
        const playerTransform = nearestPlayer.getComponent('Transform');
        if (!playerTransform) return;
        
        // Calculate direction to player
        const dx = playerTransform.x - transform.x;
        const dy = playerTransform.y - transform.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const direction = Math.atan2(dy, dx);
        
        // Reset input
        this.input.reset();
        
        // Execute current attack pattern
        switch (this.currentAttackPattern) {
            case 'melee':
                this.executeMeleePattern(direction, distance);
                break;
                
            case 'ranged':
                this.executeRangedPattern(direction, distance);
                break;
                
            case 'summon':
                this.executeSummonPattern(direction, distance);
                break;
                
            case 'charge':
                this.executeChargePattern(direction, distance);
                break;
        }
        
        // Face player
        transform.rotation = direction;
    }
    
    /**
     * Execute melee attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeMeleePattern(direction, distance) {
        if (self.isCharging) {
            // Continue charging
            this.continueCharging(direction);
        } else if (distance <= this.meleeRange && this.canAttack) {
            // Attack player
            this.startMeleeAttack(direction);
        } else if (distance > this.meleeRange * 2) {
            // Move toward player
            this.moveTowardPlayer(direction);
        } else {
            // Strafe around player
            this.strafeAroundPlayer(direction);
        }
    }
    
    /**
     * Execute ranged attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeRangedPattern(direction, distance) {
        if (self.isCharging) {
            // Continue charging
            this.continueCharging(direction);
        } else if (distance <= this.rangedRange && this.canAttack) {
            // Attack player
            this.startRangedAttack(direction);
        } else if (distance > this.rangedRange) {
            // Move toward player
            this.moveTowardPlayer(direction);
        } else {
            // Keep distance
            this.keepDistanceFromPlayer(direction);
        }
    }
    
    /**
     * Execute summon attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeSummonPattern(direction, distance) {
        if (self.isCharging) {
            // Continue charging
            this.continueCharging(direction);
        } else if (self.canSummon && this.canAttack) {
            // Summon enemies
            this.startSummonAttack();
        } else if (distance > this.summonRange * 1.5) {
            // Move toward player
            this.moveTowardPlayer(direction);
        } else {
            // Keep distance
            this.keepDistanceFromPlayer(direction);
        }
    }
    
    /**
     * Execute charge attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeChargePattern(direction, distance) {
        if (self.isCharging) {
            // Continue charging
            this.continueCharging(direction);
        } else if (self.canCharge && this.canAttack && distance >= this.chargeDistance * 0.5) {
            // Charge at player
            this.startCharge(direction);
        } else if (distance > this.chargeDistance) {
            // Move toward player
            this.moveTowardPlayer(direction);
        } else {
            // Strafe around player
            this.strafeAroundPlayer(direction);
        }
    }
    
    /**
     * Start melee attack
     * @param {number} direction - Direction to attack
     */
    startMeleeAttack(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        this.attackWindupTimer = this.meleeWindup;
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('miniBoss:attackWindup', this, 'melee');
    }
    
    /**
     * Start ranged attack
     * @param {number} direction - Direction to attack
     */
    startRangedAttack(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        this.attackWindupTimer = 0.5; // Short windup for ranged attack
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('miniBoss:attackWindup', this, 'ranged');
    }
    
    /**
     * Start summon attack
     */
    startSummonAttack() {
        // Check if can attack
        if (!this.canAttack || !self.canSummon || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        self.canSummon = false;
        this.attackWindupTimer = 1; // Longer windup for summon attack
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Set summon cooldown
        self.summonTimer = self.summonCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('miniBoss:attackWindup', this, 'summon');
    }
    
    /**
     * Start charge
     * @param {number} direction - Direction to charge
     */
    startCharge(direction) {
        // Check if can attack
        if (!this.canAttack || !self.canCharge || this.isAttacking) return;
        
        // Start charge
        this.isAttacking = true;
        this.canAttack = false;
        self.canCharge = false;
        self.isCharging = true;
        self.chargeDirection = direction;
        self.chargeDistanceTraveled = 0;
        this.attackWindupTimer = 0.5; // Short windup for charge
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Set charge cooldown
        self.chargeTimer = self.chargeCooldown;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            // Increase speed for charge
            physics.maxSpeed = this.chargeSpeed;
        }
        
        // Emit attack windup event
        window.eventSystem.emit('miniBoss:attackWindup', this, 'charge');
    }
    
    /**
     * Execute current attack
     */
    executeCurrentAttack() {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Execute based on current attack pattern
        switch (this.currentAttackPattern) {
            case 'melee':
                this.executeMeleeAttack(transform);
                break;
                
            case 'ranged':
                this.executeRangedAttack(transform);
                break;
                
            case 'summon':
                this.executeSummonAttack(transform);
                break;
                
            case 'charge':
                // Charge is handled in updateAI
                this.attackExecuteTimer = 0.1; // Short execute time for charge
                break;
        }
    }
    
    /**
     * Execute melee attack
     * @param {Transform} transform - Transform component
     */
    executeMeleeAttack(transform) {
        // Calculate attack area
        const attackDistance = this.meleeRange + 20;
        const attackWidth = 60;
        
        // Find all entities in attack area
        const entities = this.gameEngine.getEntities();
        for (const entity of entities) {
            // Skip self and non-players
            if (entity === this || !entity.hasTag('player')) continue;
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if entity is in attack range
            if (distance <= attackDistance) {
                // Calculate angle to entity
                const angleToEntity = Math.atan2(dy, dx);
                const angleDiff = Math.abs(MathUtils.angleDifference(transform.rotation, angleToEntity));
                
                // Check if entity is within attack width
                if (angleDiff <= Math.atan(attackWidth / (2 * distance))) {
                    // Apply damage if entity has health
                    const health = entity.getComponent('Health');
                    if (health) {
                        health.takeDamage(this.meleeDamage, this);
                    }
                    
                    // Apply knockback if entity has physics
                    const physics = entity.getComponent('Physics');
                    if (physics) {
                        const knockbackForce = 300;
                        physics.velocity.x += Math.cos(angleToEntity) * knockbackForce;
                        physics.velocity.y += Math.sin(angleToEntity) * knockbackForce;
                    }
                    
                    // Emit attack hit event
                    window.eventSystem.emit('miniBoss:attackHit', this, entity, 'melee');
                }
            }
        }
        
        // Set attack duration
        this.attackExecuteTimer = this.meleeDuration;
        
        // Emit attack event
        window.eventSystem.emit('miniBoss:attack', this, 'melee');
    }
    
    /**
     * Execute ranged attack
     * @param {Transform} transform - Transform component
     */
    executeRangedAttack(transform) {
        // Calculate projectile spread
        const spreadAngle = this.rangedSpread;
        const startAngle = transform.rotation - spreadAngle / 2;
        const angleStep = spreadAngle / (this.rangedProjectileCount - 1);
        
        // Fire projectiles
        for (let i = 0; i < this.rangedProjectileCount; i++) {
            // Calculate projectile direction
            const direction = startAngle + angleStep * i;
            
            // Calculate projectile velocity
            const vx = Math.cos(direction) * this.rangedProjectileSpeed;
            const vy = Math.sin(direction) * this.rangedProjectileSpeed;
            
            // Import Bullet class (circular dependency workaround)
            const Bullet = require('../bullet.js').default || window.Bullet;
            
            // Create projectile
            const bullet = new Bullet(
                transform.x + Math.cos(direction) * this.size,
                transform.y + Math.sin(direction) * this.size,
                vx,
                vy,
                this.rangedDamage,
                this,
                {
                    size: this.rangedProjectileSize,
                    color: '#ff33ff',
                    type: 'miniBossProjectile'
                }
            );
            
            // Add projectile to game engine
            this.gameEngine.addEntity(bullet);
        }
        
        // Set attack duration
        this.attackExecuteTimer = 0.5;
        
        // Emit attack event
        window.eventSystem.emit('miniBoss:attack', this, 'ranged');
    }
    
    /**
     * Execute summon attack
     * @param {Transform} transform - Transform component
     */
    executeSummonAttack(transform) {
        // Calculate summon positions
        const summonDistance = 80;
        const summonPositions = [];
        
        for (let i = 0; i < this.summonCount; i++) {
            const angle = (i / this.summonCount) * Math.PI * 2;
            const x = transform.x + Math.cos(angle) * summonDistance;
            const y = transform.y + Math.sin(angle) * summonDistance;
            
            // Check if position is valid (inside arena)
            if (x >= 0 && x <= this.gameEngine.arena.width && 
                y >= 0 && y <= this.gameEngine.arena.height) {
                summonPositions.push({ x, y });
            }
        }
        
        // Summon enemies at valid positions
        for (const position of summonPositions) {
            // Determine enemy type based on phase
            const enemyType = this.currentPhase === 1 ? 'grunt' : 'spitter';
            
            // Import enemy class (circular dependency workaround)
            const Enemy = enemyType === 'grunt' ? 
                require('./grunt.js').default || window.Grunt :
                require('./spitter.js').default || window.Spitter;
            
            // Create enemy
            const enemy = new Enemy(position.x, position.y);
            
            // Add enemy to game engine
            this.gameEngine.addEntity(enemy);
            
            // Emit summon event
            window.eventSystem.emit('miniBoss:summon', this, enemy);
        }
        
        // Set attack duration
        this.attackExecuteTimer = 1;
        
        // Emit attack event
        window.eventSystem.emit('miniBoss:attack', this, 'summon');
    }
    
    /**
     * Continue charging
     * @param {number} direction - Direction to charge
     */
    continueCharging(direction) {
        // Apply movement input
        this.input.up = Math.cos(self.chargeDirection) > 0;
        this.input.down = Math.cos(self.chargeDirection) < 0;
        this.input.left = Math.sin(self.chargeDirection) < 0;
        this.input.right = Math.sin(self.chargeDirection) > 0;
        
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Check for collision with players
        const entities = this.gameEngine.getEntities();
        for (const entity of entities) {
            // Skip self and non-players
            if (entity === this || !entity.hasTag('player')) continue;
            
            // Get entity transform
            const entityTransform = entity.getComponent('Transform');
            if (!entityTransform) continue;
            
            // Calculate distance to entity
            const dx = entityTransform.x - transform.x;
            const dy = entityTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if collided with player
            if (distance <= this.size + 20) {
                // Apply damage if entity has health
                const health = entity.getComponent('Health');
                if (health) {
                    health.takeDamage(this.chargeDamage, this);
                }
                
                // Apply knockback if entity has physics
                const physics = entity.getComponent('Physics');
                if (physics) {
                    const knockbackDirection = Math.atan2(dy, dx);
                    physics.velocity.x += Math.cos(knockbackDirection) * this.chargeKnockback;
                    physics.velocity.y += Math.sin(knockbackDirection) * this.chargeKnockback;
                }
                
                // Stop charging
                this.stopCharging();
                
                // Emit charge hit event
                window.eventSystem.emit('miniBoss:chargeHit', this, entity);
                
                break;
            }
        }
    }
    
    /**
     * Stop charging
     */
    stopCharging() {
        // Stop charging
        self.isCharging = false;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            // Restore speed
            physics.maxSpeed = this.speed;
        }
        
        // Set attack duration
        this.attackExecuteTimer = 0.5;
        
        // Emit charge end event
        window.eventSystem.emit('miniBoss:chargeEnd', this);
    }
    
    /**
     * Complete current attack
     */
    completeCurrentAttack() {
        // Set vulnerability
        this.isVulnerable = false;
        this.vulnerabilityTimer = this.invulnerabilityDuration;
        
        // Set attack complete
        this.isAttacking = false;
        
        // Select new attack pattern
        this.selectAttackPattern();
    }
    
    /**
     * Move toward player
     * @param {number} direction - Direction to player
     */
    moveTowardPlayer(direction) {
        // Apply movement input
        this.input.up = Math.cos(direction) > 0;
        this.input.down = Math.cos(direction) < 0;
        this.input.left = Math.sin(direction) < 0;
        this.input.right = Math.sin(direction) > 0;
    }
    
    /**
     * Keep distance from player
     * @param {number} direction - Direction to player
     */
    keepDistanceFromPlayer(direction) {
        // Apply movement input (opposite direction)
        this.input.up = Math.cos(direction) < 0;
        this.input.down = Math.cos(direction) > 0;
        this.input.left = Math.sin(direction) > 0;
        this.input.right = Math.sin(direction) < 0;
    }
    
    /**
     * Strafe around player
     * @param {number} direction - Direction to player
     */
    strafeAroundPlayer(direction) {
        // Calculate strafe direction (perpendicular to player direction)
        const strafeDirection = direction + Math.PI / 2;
        
        // Apply strafe input
        this.input.up = Math.cos(strafeDirection) > 0;
        this.input.down = Math.cos(strafeDirection) < 0;
        this.input.left = Math.sin(strafeDirection) < 0;
        this.input.right = Math.sin(strafeDirection) > 0;
    }
    
    /**
     * Take damage
     * @param {number} damage - Amount of damage
     * @param {Entity} source - Source of damage
     */
    takeDamage(damage, source) {
        // Check if vulnerable
        if (!this.isVulnerable) return;
        
        // Call parent takeDamage
        super.takeDamage(damage, source);
        
        // Set invulnerability
        this.isVulnerable = false;
        this.vulnerabilityTimer = this.invulnerabilityDuration;
        
        // Emit hurt event
        window.eventSystem.emit('miniBoss:hurt', this, source);
    }
    
    /**
     * Render the mini-boss enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderMiniBoss(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw mini-boss body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        
        // Draw mini-boss details
        ctx.fillStyle = '#cc00cc';
        
        // Draw head
        ctx.fillRect(-this.size * 0.8, -this.size * 1.2, this.size * 1.6, this.size * 0.6);
        
        // Draw eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.size * 0.5, -this.size * 1.0, this.size * 0.3, this.size * 0.2);
        ctx.fillRect(this.size * 0.2, -this.size * 1.0, this.size * 0.3, this.size * 0.2);
        
        // Draw arms
        ctx.fillStyle = this.color;
        
        // Left arm
        if (this.isAttacking && this.currentAttackPattern === 'melee') {
            // Extended arm
            ctx.fillRect(-this.size * 1.5, -this.size * 0.5, this.size * 0.8, this.size);
        } else {
            // Normal arm
            ctx.fillRect(-this.size * 1.2, -this.size * 0.3, this.size * 0.5, this.size * 0.8);
        }
        
        // Right arm
        if (this.isAttacking && this.currentAttackPattern === 'melee') {
            // Extended arm
            ctx.fillRect(this.size * 0.7, -this.size * 0.5, this.size * 0.8, this.size);
        } else {
            // Normal arm
            ctx.fillRect(this.size * 0.7, -this.size * 0.3, this.size * 0.5, this.size * 0.8);
        }
        
        // Draw legs
        ctx.fillRect(-this.size * 0.8, this.size * 0.8, this.size * 0.6, this.size * 0.8);
        ctx.fillRect(this.size * 0.2, this.size * 0.8, this.size * 0.6, this.size * 0.8);
        
        // Draw attack windup effect
        if (this.isAttacking && this.attackWindupTimer > 0) {
            ctx.strokeStyle = '#ff99ff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Draw charge effect
        if (self.isCharging) {
            // Draw motion lines
            ctx.strokeStyle = '#ff99ff';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            
            for (let i = 1; i <= 3; i++) {
                const lineLength = this.size * i * 0.5;
                const lineDirection = self.chargeDirection + Math.PI;
                
                ctx.beginPath();
                ctx.moveTo(
                    Math.cos(lineDirection) * this.size,
                    Math.sin(lineDirection) * this.size
                );
                ctx.lineTo(
                    Math.cos(lineDirection) * (this.size + lineLength),
                    Math.sin(lineDirection) * (this.size + lineLength)
                );
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
        }
        
        // Draw vulnerability indicator
        if (!this.isVulnerable) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 100);
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Draw phase indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`PHASE ${this.currentPhase}`, 0, -this.size - 20);
        
        // Draw health bar
        const health = entity.getComponent('Health');
        if (health) {
            const healthPercentage = health.getHealthPercentage();
            
            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(-this.size, -this.size - 30, this.size * 2, 6);
            
            // Health
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size, -this.size - 30, this.size * 2 * healthPercentage, 6);
            
            // Phase transition markers
            for (let i = 1; i < this.phases; i++) {
                const markerPosition = -this.size + this.size * 2 * (1 - this.phaseTransitionHealth * i);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(markerPosition - 1, -this.size - 32, 2, 10);
            }
        }
    }
    
    /**
     * Serialize mini-boss for network transmission
     * @returns {object} Serialized mini-boss data
     */
    serialize() {
        const data = super.serialize();
        
        // Add mini-boss-specific data
        data.currentPhase = this.currentPhase;
        data.currentAttackPattern = this.currentAttackPattern;
        data.attackTimer = this.attackTimer;
        data.isAttacking = this.isAttacking;
        data.canAttack = this.canAttack;
        data.canSummon = self.canSummon;
        data.summonTimer = self.summonTimer;
        data.canCharge = self.canCharge;
        data.chargeTimer = self.chargeTimer;
        data.isCharging = self.isCharging;
        data.chargeDirection = self.chargeDirection;
        data.chargeDistanceTraveled = self.chargeDistanceTraveled;
        data.isVulnerable = this.isVulnerable;
        data.vulnerabilityTimer = this.vulnerabilityTimer;
        data.attackWindupTimer = this.attackWindupTimer;
        data.attackExecuteTimer = this.attackExecuteTimer;
        
        return data;
    }
    
    /**
     * Deserialize mini-boss data
     * @param {object} data - Serialized mini-boss data
     * @returns {MiniBoss} This mini-boss for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set mini-boss-specific data
        this.currentPhase = data.currentPhase || 1;
        this.currentAttackPattern = data.currentAttackPattern || null;
        this.attackTimer = data.attackTimer || 0;
        this.isAttacking = data.isAttacking || false;
        this.canAttack = data.canAttack || true;
        self.canSummon = data.canSummon || true;
        self.summonTimer = data.summonTimer || 0;
        self.canCharge = data.canCharge || true;
        self.chargeTimer = data.chargeTimer || 0;
        self.isCharging = data.isCharging || false;
        self.chargeDirection = data.chargeDirection || 0;
        self.chargeDistanceTraveled = data.chargeDistanceTraveled || 0;
        this.isVulnerable = data.isVulnerable || true;
        this.vulnerabilityTimer = data.vulnerabilityTimer || 0;
        this.attackWindupTimer = data.attackWindupTimer || 0;
        this.attackExecuteTimer = data.attackExecuteTimer || 0;
        
        // Update color based on phase
        this.color = this.phaseColors[this.currentPhase - 1];
        
        // Update physics if charging
        if (self.isCharging) {
            const physics = this.getComponent('Physics');
            if (physics) {
                physics.maxSpeed = this.chargeSpeed;
            }
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiniBoss;
}