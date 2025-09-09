/**
 * Arcade Meltdown - Boss Enemy Class
 * Final boss with multiple phases and complex attack patterns
 */

import Enemy from './enemy.js';
import Transform from '../../components/transform.js';
import Physics from '../../components/physics.js';
import Health from '../../components/health.js';
import Render from '../../components/render.js';
import Collision from '../../components/collision.js';
import Weapon from '../../components/weapon.js';
import MathUtils from '../../utils/math.js';

class Boss extends Enemy {
    /**
     * Create a new Boss enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        // Call parent constructor
        super(x, y, 'boss');
        
        // Enemy properties
        this.speed = 80; // Slow movement speed
        this.health = 2000; // Very high health
        this.damage = 30; // High damage
        
        // Phase properties
        this.phases = 3; // Number of phases
        this.currentPhase = 1; // Current phase
        this.phaseTransitionHealths = [0.66, 0.33]; // Health percentages to transition to next phases
        
        // Attack properties
        this.attackPatterns = [
            'meleeSlam', 'projectileBarrage', 'summonMinions', 
            'laserBeam', 'shockwave', 'homingMissiles'
        ];
        this.currentAttackPattern = null;
        this.attackCooldown = 4; // seconds between attacks
        this.attackTimer = 0;
        this.isAttacking = false;
        this.canAttack = true;
        
        // Melee slam attack properties
        this.meleeSlamRange = 100;
        this.meleeSlamDamage = 50;
        this.meleeSlamWindup = 1.2;
        this.meleeSlamDuration = 0.8;
        this.meleeSlamKnockback = 500;
        
        // Projectile barrage attack properties
        this.projectileBarrageRange = 500;
        this.projectileBarrageDamage = 15;
        this.projectileBarrageProjectileSpeed = 350;
        this.projectileBarrageProjectileSize = 10;
        this.projectileBarrageSpread = 0.3;
        this.projectileBarrageProjectileCount = 12;
        this.projectileBarrageBurstCount = 3;
        this.projectileBarrageBurstInterval = 0.5;
        
        // Summon minions attack properties
        this.summonMinionsRange = 300;
        this.summonMinionsCount = 5; // Number of minions to summon
        self.summonMinionsCooldown = 15; // seconds between summons
        self.canSummonMinions = true;
        self.summonMinionsTimer = 0;
        
        // Laser beam attack properties
        this.laserBeamRange = 600;
        this.laserBeamDamage = 40;
        this.laserBeamWindup = 1.5;
        this.laserBeamDuration = 2;
        this.laserBeamWidth = 30;
        this.laserBeamRotationSpeed = 1; // radians per second
        
        // Shockwave attack properties
        this.shockwaveRange = 400;
        this.shockwaveDamage = 25;
        this.shockwaveSpeed = 200;
        this.shockwaveWidth = 20;
        
        // Homing missiles attack properties
        this.homingMissilesRange = 450;
        this.homingMissilesDamage = 20;
        this.homingMissilesSpeed = 150;
        this.homingMissilesAcceleration = 50;
        this.homingMissilesSize = 12;
        this.homingMissilesCount = 6;
        self.homingMissilesCooldown = 12;
        self.canHomingMissiles = true;
        self.homingMissilesTimer = 0;
        
        // AI properties
        this.aggressive = true;
        this.patternChangeChance = 0.4; // Chance to change attack pattern
        this.patternChangeTimer = 0;
        this.patternChangeInterval = 6; // seconds
        
        // Movement properties
        this.movementPatterns = ['stationary', 'circular', 'figure8', 'random'];
        this.currentMovementPattern = 'stationary';
        this.movementChangeTimer = 0;
        this.movementChangeInterval = 10; // seconds
        this.movementSpeed = 60;
        this.movementRadius = 150;
        self.movementAngle = 0;
        self.movementCenter = { x, y };
        
        // Visual properties
        this.color = '#ff00ff';
        this.size = 50;
        this.phaseColors = ['#ff00ff', '#ff0080', '#ff0040']; // Colors for each phase
        
        // State
        this.attackWindupTimer = 0;
        this.attackExecuteTimer = 0;
        this.isVulnerable = true;
        this.vulnerabilityTimer = 0;
        this.vulnerabilityDuration = 3; // seconds of vulnerability after attack
        this.invulnerabilityDuration = 2; // seconds of invulnerability after taking damage
        
        // Special abilities
        self.enrageThreshold = 0.2; // Health percentage to enrage
        self.enrageMode = false;
        self.enrageSpeedMultiplier = 1.5;
        self.enrageDamageMultiplier = 1.5;
        
        // Initialize components
        this.initComponents();
        
        // Select initial attack pattern
        this.selectAttackPattern();
        
        // Select initial movement pattern
        this.selectMovementPattern();
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
            physics.acceleration = 150;
            physics.deceleration = 300;
            physics.mass = 5; // Very heavy mass
        }
        
        // Update health component
        if (health) {
            health.setMaxHealth(this.health);
        }
        
        // Update render component
        if (render) {
            render.customRender = this.renderBoss.bind(this);
        }
        
        // Update collision component
        if (collision) {
            collision.radius = this.size;
        }
    }
    
    /**
     * Update the boss enemy
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
        
        // Update summon minions timer
        if (self.summonMinionsTimer > 0) {
            self.summonMinionsTimer -= deltaTime;
            
            // Check if summon minions cooldown is complete
            if (self.summonMinionsTimer <= 0) {
                self.canSummonMinions = true;
            }
        }
        
        // Update homing missiles timer
        if (self.homingMissilesTimer > 0) {
            self.homingMissilesTimer -= deltaTime;
            
            // Check if homing missiles cooldown is complete
            if (self.homingMissilesTimer <= 0) {
                self.canHomingMissiles = true;
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
        
        // Update movement change timer
        if (this.movementChangeTimer > 0) {
            this.movementChangeTimer -= deltaTime;
            
            // Check if should change movement pattern
            if (this.movementChangeTimer <= 0) {
                this.selectMovementPattern();
                this.movementChangeTimer = this.movementChangeInterval;
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
        
        // Update movement
        this.updateMovement(deltaTime);
        
        // Check for phase transition
        this.checkPhaseTransition();
        
        // Check for enrage mode
        this.checkEnrageMode();
        
        // Update AI
        this.updateAI(deltaTime);
    }
    
    /**
     * Update movement
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateMovement(deltaTime) {
        // Get transform component
        const transform = this.getComponent('Transform');
        if (!transform) return;
        
        // Skip movement if attacking
        if (this.isAttacking) return;
        
        // Update movement based on pattern
        switch (this.currentMovementPattern) {
            case 'stationary':
                // Don't move
                break;
                
            case 'circular':
                // Move in a circle
                self.movementAngle += this.movementSpeed / this.movementRadius * deltaTime;
                transform.x = self.movementCenter.x + Math.cos(self.movementAngle) * this.movementRadius;
                transform.y = self.movementCenter.y + Math.sin(self.movementAngle) * this.movementRadius;
                break;
                
            case 'figure8':
                // Move in a figure-8 pattern
                self.movementAngle += this.movementSpeed / this.movementRadius * deltaTime;
                transform.x = self.movementCenter.x + Math.cos(self.movementAngle) * this.movementRadius;
                transform.y = self.movementCenter.y + Math.sin(self.movementAngle * 2) * this.movementRadius * 0.5;
                break;
                
            case 'random':
                // Move randomly
                if (Math.random() < 0.02) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * this.movementRadius;
                    self.movementCenter.x = transform.x + Math.cos(angle) * distance;
                    self.movementCenter.y = transform.y + Math.sin(angle) * distance;
                    
                    // Keep within arena bounds
                    self.movementCenter.x = Math.max(this.size, Math.min(this.gameEngine.arena.width - this.size, self.movementCenter.x));
                    self.movementCenter.y = Math.max(this.size, Math.min(this.gameEngine.arena.height - this.size, self.movementCenter.y));
                }
                
                // Move toward center
                const dx = self.movementCenter.x - transform.x;
                const dy = self.movementCenter.y - transform.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    const direction = Math.atan2(dy, dx);
                    this.input.up = Math.cos(direction) > 0;
                    this.input.down = Math.cos(direction) < 0;
                    this.input.left = Math.sin(direction) < 0;
                    this.input.right = Math.sin(direction) > 0;
                }
                break;
        }
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
        for (let i = 0; i < this.phaseTransitionHealths.length; i++) {
            if (healthPercentage <= this.phaseTransitionHealths[i] && this.currentPhase === i + 1) {
                this.transitionToNextPhase();
                break;
            }
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
        this.damage *= 1.3;
        this.attackCooldown *= 0.8;
        this.movementSpeed *= 1.2;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            physics.maxSpeed *= 1.2;
        }
        
        // Add new attack patterns based on phase
        if (this.currentPhase === 2) {
            // Add laser beam attack
            if (!this.attackPatterns.includes('laserBeam')) {
                this.attackPatterns.push('laserBeam');
            }
        } else if (this.currentPhase === 3) {
            // Add shockwave and homing missiles attacks
            if (!this.attackPatterns.includes('shockwave')) {
                this.attackPatterns.push('shockwave');
            }
            if (!this.attackPatterns.includes('homingMissiles')) {
                this.attackPatterns.push('homingMissiles');
            }
        }
        
        // Emit phase transition event
        window.eventSystem.emit('boss:phaseTransition', this, this.currentPhase);
        
        // Select new attack pattern
        this.selectAttackPattern();
    }
    
    /**
     * Check for enrage mode
     */
    checkEnrageMode() {
        // Get health component
        const health = this.getComponent('Health');
        if (!health) return;
        
        // Calculate health percentage
        const healthPercentage = health.getHealthPercentage();
        
        // Enter enrage mode if health is below threshold and not already in enrage mode
        if (healthPercentage <= self.enrageThreshold && !self.enrageMode) {
            this.enterEnrageMode();
        }
    }
    
    /**
     * Enter enrage mode
     */
    enterEnrageMode() {
        // Set enrage mode
        self.enrageMode = true;
        
        // Get physics component
        const physics = this.getComponent('Physics');
        if (physics) {
            // Increase speed
            physics.maxSpeed *= self.enrageSpeedMultiplier;
        }
        
        // Change color
        this.color = '#ff0000';
        
        // Decrease attack cooldown
        this.attackCooldown *= 0.7;
        
        // Emit enrage mode event
        window.eventSystem.emit('boss:enrage', this);
        
        // Select new attack pattern
        this.selectAttackPattern();
    }
    
    /**
     * Select attack pattern
     */
    selectAttackPattern() {
        // Filter available attack patterns based on phase
        let availablePatterns = [...this.attackPatterns];
        
        // Remove summon minions if not available
        if (!self.canSummonMinions) {
            availablePatterns = availablePatterns.filter(pattern => pattern !== 'summonMinions');
        }
        
        // Remove homing missiles if not available
        if (!self.canHomingMissiles) {
            availablePatterns = availablePatterns.filter(pattern => pattern !== 'homingMissiles');
        }
        
        // Select random pattern
        this.currentAttackPattern = availablePatterns[
            Math.floor(Math.random() * availablePatterns.length)
        ];
        
        // Reset pattern change timer
        this.patternChangeTimer = this.patternChangeInterval;
        
        // Emit pattern change event
        window.eventSystem.emit('boss:patternChange', this, this.currentAttackPattern);
    }
    
    /**
     * Select movement pattern
     */
    selectMovementPattern() {
        // Filter available movement patterns based on phase
        let availablePatterns = [...this.movementPatterns];
        
        // Remove stationary in phase 3
        if (this.currentPhase === 3) {
            availablePatterns = availablePatterns.filter(pattern => pattern !== 'stationary');
        }
        
        // Select random pattern
        this.currentMovementPattern = availablePatterns[
            Math.floor(Math.random() * availablePatterns.length)
        ];
        
        // Reset movement change timer
        this.movementChangeTimer = this.movementChangeInterval;
        
        // Set movement center
        const transform = this.getComponent('Transform');
        if (transform) {
            self.movementCenter = { x: transform.x, y: transform.y };
            self.movementAngle = 0;
        }
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
            case 'meleeSlam':
                this.executeMeleeSlamPattern(direction, distance);
                break;
                
            case 'projectileBarrage':
                this.executeProjectileBarragePattern(direction, distance);
                break;
                
            case 'summonMinions':
                this.executeSummonMinionsPattern(direction, distance);
                break;
                
            case 'laserBeam':
                this.executeLaserBeamPattern(direction, distance);
                break;
                
            case 'shockwave':
                this.executeShockwavePattern(direction, distance);
                break;
                
            case 'homingMissiles':
                this.executeHomingMissilesPattern(direction, distance);
                break;
        }
        
        // Face player
        transform.rotation = direction;
    }
    
    /**
     * Execute melee slam attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeMeleeSlamPattern(direction, distance) {
        if (distance <= this.meleeSlamRange && this.canAttack) {
            // Attack player
            this.startMeleeSlamAttack(direction);
        }
    }
    
    /**
     * Execute projectile barrage attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeProjectileBarragePattern(direction, distance) {
        if (distance <= this.projectileBarrageRange && this.canAttack) {
            // Attack player
            this.startProjectileBarrageAttack(direction);
        }
    }
    
    /**
     * Execute summon minions attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeSummonMinionsPattern(direction, distance) {
        if (self.canSummonMinions && this.canAttack) {
            // Summon minions
            this.startSummonMinionsAttack();
        }
    }
    
    /**
     * Execute laser beam attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeLaserBeamPattern(direction, distance) {
        if (distance <= this.laserBeamRange && this.canAttack) {
            // Attack player
            this.startLaserBeamAttack(direction);
        }
    }
    
    /**
     * Execute shockwave attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeShockwavePattern(direction, distance) {
        if (distance <= this.shockwaveRange && this.canAttack) {
            // Attack player
            this.startShockwaveAttack(direction);
        }
    }
    
    /**
     * Execute homing missiles attack pattern
     * @param {number} direction - Direction to player
     * @param {number} distance - Distance to player
     */
    executeHomingMissilesPattern(direction, distance) {
        if (distance <= this.homingMissilesRange && this.canAttack && self.canHomingMissiles) {
            // Attack player
            this.startHomingMissilesAttack(direction);
        }
    }
    
    /**
     * Start melee slam attack
     * @param {number} direction - Direction to attack
     */
    startMeleeSlamAttack(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        this.attackWindupTimer = this.meleeSlamWindup;
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('boss:attackWindup', this, 'meleeSlam');
    }
    
    /**
     * Start projectile barrage attack
     * @param {number} direction - Direction to attack
     */
    startProjectileBarrageAttack(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        this.attackWindupTimer = 0.8; // Windup for projectile barrage
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('boss:attackWindup', this, 'projectileBarrage');
    }
    
    /**
     * Start summon minions attack
     */
    startSummonMinionsAttack() {
        // Check if can attack
        if (!this.canAttack || !self.canSummonMinions || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        self.canSummonMinions = false;
        this.attackWindupTimer = 1.5; // Longer windup for summon attack
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Set summon cooldown
        self.summonMinionsTimer = self.summonMinionsCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('boss:attackWindup', this, 'summonMinions');
    }
    
    /**
     * Start laser beam attack
     * @param {number} direction - Direction to attack
     */
    startLaserBeamAttack(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        this.attackWindupTimer = this.laserBeamWindup;
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('boss:attackWindup', this, 'laserBeam');
    }
    
    /**
     * Start shockwave attack
     * @param {number} direction - Direction to attack
     */
    startShockwaveAttack(direction) {
        // Check if can attack
        if (!this.canAttack || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        this.attackWindupTimer = 1; // Windup for shockwave
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('boss:attackWindup', this, 'shockwave');
    }
    
    /**
     * Start homing missiles attack
     * @param {number} direction - Direction to attack
     */
    startHomingMissilesAttack(direction) {
        // Check if can attack
        if (!this.canAttack || !self.canHomingMissiles || this.isAttacking) return;
        
        // Start attack
        this.isAttacking = true;
        this.canAttack = false;
        self.canHomingMissiles = false;
        this.attackWindupTimer = 1.2; // Windup for homing missiles
        
        // Set attack cooldown
        this.attackTimer = this.attackCooldown;
        
        // Set homing missiles cooldown
        self.homingMissilesTimer = self.homingMissilesCooldown;
        
        // Emit attack windup event
        window.eventSystem.emit('boss:attackWindup', this, 'homingMissiles');
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
            case 'meleeSlam':
                this.executeMeleeSlamAttack(transform);
                break;
                
            case 'projectileBarrage':
                this.executeProjectileBarrageAttack(transform);
                break;
                
            case 'summonMinions':
                this.executeSummonMinionsAttack(transform);
                break;
                
            case 'laserBeam':
                this.executeLaserBeamAttack(transform);
                break;
                
            case 'shockwave':
                this.executeShockwaveAttack(transform);
                break;
                
            case 'homingMissiles':
                this.executeHomingMissilesAttack(transform);
                break;
        }
    }
    
    /**
     * Execute melee slam attack
     * @param {Transform} transform - Transform component
     */
    executeMeleeSlamAttack(transform) {
        // Calculate slam area
        const slamDistance = this.meleeSlamRange + 20;
        const slamWidth = 120;
        
        // Find all entities in slam area
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
            
            // Check if entity is in slam range
            if (distance <= slamDistance) {
                // Calculate angle to entity
                const angleToEntity = Math.atan2(dy, dx);
                const angleDiff = Math.abs(MathUtils.angleDifference(transform.rotation, angleToEntity));
                
                // Check if entity is within slam width
                if (angleDiff <= Math.atan(slamWidth / (2 * distance))) {
                    // Apply damage if entity has health
                    const health = entity.getComponent('Health');
                    if (health) {
                        const damage = self.enrageMode ? 
                            this.meleeSlamDamage * self.enrageDamageMultiplier : 
                            this.meleeSlamDamage;
                        health.takeDamage(damage, this);
                    }
                    
                    // Apply knockback if entity has physics
                    const physics = entity.getComponent('Physics');
                    if (physics) {
                        const knockbackForce = this.meleeSlamKnockback;
                        physics.velocity.x += Math.cos(angleToEntity) * knockbackForce;
                        physics.velocity.y += Math.sin(angleToEntity) * knockbackForce;
                    }
                    
                    // Emit attack hit event
                    window.eventSystem.emit('boss:attackHit', this, entity, 'meleeSlam');
                }
            }
        }
        
        // Set attack duration
        this.attackExecuteTimer = this.meleeSlamDuration;
        
        // Create screen shake
        if (this.gameEngine.renderSystem) {
            this.gameEngine.renderSystem.shakeScreen(0.8, 15);
        }
        
        // Emit attack event
        window.eventSystem.emit('boss:attack', this, 'meleeSlam');
    }
    
    /**
     * Execute projectile barrage attack
     * @param {Transform} transform - Transform component
     */
    executeProjectileBarrageAttack(transform) {
        // Fire projectiles in bursts
        this.fireProjectileBurst(transform, 0);
        
        // Schedule subsequent bursts
        for (let i = 1; i < this.projectileBarrageBurstCount; i++) {
            setTimeout(() => {
                this.fireProjectileBurst(transform, i);
            }, i * this.projectileBarrageBurstInterval * 1000);
        }
        
        // Set attack duration
        this.attackExecuteTimer = this.projectileBarrageBurstCount * this.projectileBarrageBurstInterval + 0.5;
        
        // Emit attack event
        window.eventSystem.emit('boss:attack', this, 'projectileBarrage');
    }
    
    /**
     * Fire a burst of projectiles
     * @param {Transform} transform - Transform component
     * @param {number} burstIndex - Burst index
     */
    fireProjectileBurst(transform, burstIndex) {
        // Calculate projectile spread
        const spreadAngle = this.projectileBarrageSpread;
        const startAngle = transform.rotation - spreadAngle / 2;
        const angleStep = spreadAngle / (this.projectileBarrageProjectileCount - 1);
        
        // Calculate offset angle for each burst
        const burstOffset = (burstIndex % 2 === 0 ? 1 : -1) * (Math.floor(burstIndex / 2) + 1) * 0.1;
        
        // Fire projectiles
        for (let i = 0; i < this.projectileBarrageProjectileCount; i++) {
            // Calculate projectile direction
            const direction = startAngle + angleStep * i + burstOffset;
            
            // Calculate projectile velocity
            const vx = Math.cos(direction) * this.projectileBarrageProjectileSpeed;
            const vy = Math.sin(direction) * this.projectileBarrageProjectileSpeed;
            
            // Import Bullet class (circular dependency workaround)
            const Bullet = require('../bullet.js').default || window.Bullet;
            
            // Create projectile
            const bullet = new Bullet(
                transform.x + Math.cos(direction) * this.size,
                transform.y + Math.sin(direction) * this.size,
                vx,
                vy,
                this.projectileBarrageDamage,
                this,
                {
                    size: this.projectileBarrageProjectileSize,
                    color: '#ff00ff',
                    type: 'bossProjectile'
                }
            );
            
            // Add projectile to game engine
            this.gameEngine.addEntity(bullet);
        }
    }
    
    /**
     * Execute summon minions attack
     * @param {Transform} transform - Transform component
     */
    executeSummonMinionsAttack(transform) {
        // Calculate summon positions
        const summonDistance = 100;
        const summonPositions = [];
        
        for (let i = 0; i < this.summonMinionsCount; i++) {
            const angle = (i / this.summonMinionsCount) * Math.PI * 2;
            const x = transform.x + Math.cos(angle) * summonDistance;
            const y = transform.y + Math.sin(angle) * summonDistance;
            
            // Check if position is valid (inside arena)
            if (x >= 0 && x <= this.gameEngine.arena.width && 
                y >= 0 && y <= this.gameEngine.arena.height) {
                summonPositions.push({ x, y });
            }
        }
        
        // Summon minions at valid positions
        for (const position of summonPositions) {
            // Determine enemy type based on phase
            let enemyType = 'grunt';
            if (this.currentPhase === 2) {
                enemyType = Math.random() < 0.7 ? 'grunt' : 'spitter';
            } else if (this.currentPhase === 3) {
                const rand = Math.random();
                if (rand < 0.5) {
                    enemyType = 'grunt';
                } else if (rand < 0.8) {
                    enemyType = 'spitter';
                } else {
                    enemyType = 'bruiser';
                }
            }
            
            // Import enemy class (circular dependency workaround)
            let Enemy;
            switch (enemyType) {
                case 'grunt':
                    Enemy = require('./grunt.js').default || window.Grunt;
                    break;
                case 'spitter':
                    Enemy = require('./spitter.js').default || window.Spitter;
                    break;
                case 'bruiser':
                    Enemy = require('./bruiser.js').default || window.Bruiser;
                    break;
            }
            
            // Create enemy
            const enemy = new Enemy(position.x, position.y);
            
            // Add enemy to game engine
            this.gameEngine.addEntity(enemy);
            
            // Emit summon event
            window.eventSystem.emit('boss:summon', this, enemy);
        }
        
        // Set attack duration
        this.attackExecuteTimer = 1;
        
        // Emit attack event
        window.eventSystem.emit('boss:attack', this, 'summonMinions');
    }
    
    /**
     * Execute laser beam attack
     * @param {Transform} transform - Transform component
     */
    executeLaserBeamAttack(transform) {
        // Create laser beam entity
        const LaserBeam = require('../laserBeam.js').default || window.LaserBeam;
        
        const laserBeam = new LaserBeam(
            transform.x,
            transform.y,
            transform.rotation,
            this.laserBeamRange,
            this.laserBeamWidth,
            this.laserBeamDamage,
            this.laserBeamDuration,
            this.laserBeamRotationSpeed,
            this
        );
        
        // Add laser beam to game engine
        this.gameEngine.addEntity(laserBeam);
        
        // Set attack duration
        this.attackExecuteTimer = this.laserBeamDuration + 0.5;
        
        // Emit attack event
        window.eventSystem.emit('boss:attack', this, 'laserBeam');
    }
    
    /**
     * Execute shockwave attack
     * @param {Transform} transform - Transform component
     */
    executeShockwaveAttack(transform) {
        // Create shockwave entity
        const Shockwave = require('../shockwave.js').default || window.Shockwave;
        
        const shockwave = new Shockwave(
            transform.x,
            transform.y,
            this.shockwaveRange,
            this.shockwaveWidth,
            this.shockwaveSpeed,
            this.shockwaveDamage,
            this
        );
        
        // Add shockwave to game engine
        this.gameEngine.addEntity(shockwave);
        
        // Set attack duration
        this.attackExecuteTimer = 2;
        
        // Create screen shake
        if (this.gameEngine.renderSystem) {
            this.gameEngine.renderSystem.shakeScreen(0.6, 10);
        }
        
        // Emit attack event
        window.eventSystem.emit('boss:attack', this, 'shockwave');
    }
    
    /**
     * Execute homing missiles attack
     * @param {Transform} transform - Transform component
     */
    executeHomingMissilesAttack(transform) {
        // Find all players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        // Fire missiles at each player
        for (let i = 0; i < this.homingMissilesCount; i++) {
            // Select random player
            const target = players[Math.floor(Math.random() * players.length)];
            if (!target) continue;
            
            // Calculate initial direction (slightly away from target)
            const targetTransform = target.getComponent('Transform');
            if (!targetTransform) continue;
            
            const dx = targetTransform.x - transform.x;
            const dy = targetTransform.y - transform.y;
            const direction = Math.atan2(dy, dx);
            
            // Calculate offset angle
            const offsetAngle = (Math.random() - 0.5) * Math.PI * 0.5;
            const fireDirection = direction + offsetAngle;
            
            // Calculate initial velocity
            const vx = Math.cos(fireDirection) * this.homingMissilesSpeed;
            const vy = Math.sin(fireDirection) * this.homingMissilesSpeed;
            
            // Import HomingMissile class (circular dependency workaround)
            const HomingMissile = require('../homingMissile.js').default || window.HomingMissile;
            
            // Create homing missile
            const missile = new HomingMissile(
                transform.x + Math.cos(fireDirection) * this.size,
                transform.y + Math.sin(fireDirection) * this.size,
                vx,
                vy,
                this.homingMissilesDamage,
                this,
                target,
                {
                    size: this.homingMissilesSize,
                    color: '#ff00ff',
                    speed: this.homingMissilesSpeed,
                    acceleration: this.homingMissilesAcceleration
                }
            );
            
            // Add missile to game engine
            this.gameEngine.addEntity(missile);
        }
        
        // Set attack duration
        this.attackExecuteTimer = 1;
        
        // Emit attack event
        window.eventSystem.emit('boss:attack', this, 'homingMissiles');
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
        window.eventSystem.emit('boss:hurt', this, source);
    }
    
    /**
     * Render the boss enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Entity} entity - Entity to render
     * @param {number} alpha - Interpolation factor (0-1)
     */
    renderBoss(ctx, entity, alpha) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        
        // Draw boss body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw boss details
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
        ctx.fillRect(-this.size * 1.5, -this.size * 0.5, this.size * 0.8, this.size);
        
        // Right arm
        ctx.fillRect(this.size * 0.7, -this.size * 0.5, this.size * 0.8, this.size);
        
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
        
        // Draw enrage mode indicator
        if (self.enrageMode) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw phase indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`PHASE ${this.currentPhase}`, 0, -this.size - 25);
        
        // Draw health bar
        const health = entity.getComponent('Health');
        if (health) {
            const healthPercentage = health.getHealthPercentage();
            
            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(-this.size, -this.size - 40, this.size * 2, 8);
            
            // Health
            ctx.fillStyle = self.enrageMode ? '#ff0000' : this.color;
            ctx.fillRect(-this.size, -this.size - 40, this.size * 2 * healthPercentage, 8);
            
            // Phase transition markers
            for (let i = 0; i < this.phaseTransitionHealths.length; i++) {
                const markerPosition = -this.size + this.size * 2 * (1 - this.phaseTransitionHealths[i]);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(markerPosition - 1, -this.size - 42, 2, 12);
            }
            
            // Enrage marker
            const enragePosition = -this.size + this.size * 2 * (1 - self.enrageThreshold);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(enragePosition - 1, -this.size - 42, 2, 12);
        }
    }
    
    /**
     * Serialize boss for network transmission
     * @returns {object} Serialized boss data
     */
    serialize() {
        const data = super.serialize();
        
        // Add boss-specific data
        data.currentPhase = this.currentPhase;
        data.currentAttackPattern = this.currentAttackPattern;
        data.attackTimer = this.attackTimer;
        data.isAttacking = this.isAttacking;
        data.canAttack = this.canAttack;
        data.canSummonMinions = self.canSummonMinions;
        data.summonMinionsTimer = self.summonMinionsTimer;
        data.canHomingMissiles = self.canHomingMissiles;
        data.homingMissilesTimer = self.homingMissilesTimer;
        data.isVulnerable = this.isVulnerable;
        data.vulnerabilityTimer = this.vulnerabilityTimer;
        data.attackWindupTimer = this.attackWindupTimer;
        data.attackExecuteTimer = this.attackExecuteTimer;
        data.currentMovementPattern = this.currentMovementPattern;
        data.movementAngle = self.movementAngle;
        data.movementCenter = self.movementCenter;
        data.enrageMode = self.enrageMode;
        
        return data;
    }
    
    /**
     * Deserialize boss data
     * @param {object} data - Serialized boss data
     * @returns {Boss} This boss for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set boss-specific data
        this.currentPhase = data.currentPhase || 1;
        this.currentAttackPattern = data.currentAttackPattern || null;
        this.attackTimer = data.attackTimer || 0;
        this.isAttacking = data.isAttacking || false;
        this.canAttack = data.canAttack || true;
        self.canSummonMinions = data.canSummonMinions || true;
        self.summonMinionsTimer = data.summonMinionsTimer || 0;
        self.canHomingMissiles = data.canHomingMissiles || true;
        self.homingMissilesTimer = data.homingMissilesTimer || 0;
        this.isVulnerable = data.isVulnerable || true;
        this.vulnerabilityTimer = data.vulnerabilityTimer || 0;
        this.attackWindupTimer = data.attackWindupTimer || 0;
        this.attackExecuteTimer = data.attackExecuteTimer || 0;
        this.currentMovementPattern = data.currentMovementPattern || 'stationary';
        self.movementAngle = data.movementAngle || 0;
        self.movementCenter = data.movementCenter || { x: 0, y: 0 };
        self.enrageMode = data.enrageMode || false;
        
        // Update color based on phase
        this.color = this.phaseColors[this.currentPhase - 1];
        
        // Update color if in enrage mode
        if (self.enrageMode) {
            this.color = '#ff0000';
        }
        
        // Update attack patterns based on phase
        if (this.currentPhase >= 2 && !this.attackPatterns.includes('laserBeam')) {
            this.attackPatterns.push('laserBeam');
        }
        
        if (this.currentPhase >= 3) {
            if (!this.attackPatterns.includes('shockwave')) {
                this.attackPatterns.push('shockwave');
            }
            if (!this.attackPatterns.includes('homingMissiles')) {
                this.attackPatterns.push('homingMissiles');
            }
        }
        
        return this;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Boss;
}