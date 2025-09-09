/**
 * Arcade Meltdown - Player Class
 * Represents a player character with class-specific abilities
 */

import Entity from './entity.js';
import Transform from '../components/transform.js';
import Physics from '../components/physics.js';
import Render from '../components/render.js';
import Health from '../components/health.js';
import Weapon from '../components/weapon.js';

class Player extends Entity {
    /**
     * Create a new Player
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} playerClass - Player class (heavy, scout, engineer, medic)
     * @param {string} playerId - Unique player ID
     */
    constructor(x, y, playerClass, playerId = null) {
        // Create entity with player ID
        super(playerId || `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        
        // Set entity type and tags
        this.setType('player');
        this.addTag('player');
        this.addTag(playerClass);
        
        // Player class
        this.playerClass = playerClass;
        
        // Player name
        this.name = `Player ${Math.floor(Math.random() * 1000)}`;
        
        // Player score
        this.score = 0;
        
        // Player level
        this.level = 1;
        
        // Experience points
        this.experience = 0;
        
        // Special ability cooldown
        this.specialCooldown = 0;
        this.maxSpecialCooldown = 0;
        
        // Whether the player is currently using special ability
        this.usingSpecial = false;
        
        // Special ability duration
        this.specialDuration = 0;
        this.maxSpecialDuration = 0;
        
        // Player input state
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            mouseX: 0,
            mouseY: 0,
            mousePressed: false,
            special: false,
            reload: false
        };
        
        // Initialize player based on class
        this.initPlayerClass(playerClass);
        
        // Add components
        this.addComponents(x, y);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Initialize player based on class
     * @param {string} playerClass - Player class
     */
    initPlayerClass(playerClass) {
        const classConfig = window.config.get(`player.classes.${playerClass}`);
        
        if (!classConfig) {
            console.error(`Invalid player class: ${playerClass}`);
            return;
        }
        
        // Set class-specific properties
        this.health = classConfig.health;
        this.speed = classConfig.speed;
        this.weaponType = classConfig.weapon;
        this.maxSpecialCooldown = classConfig.specialCooldown;
        
        // Set class-specific special ability properties
        this.initSpecialAbility(playerClass);
    }
    
    /**
     * Initialize special ability based on class
     * @param {string} playerClass - Player class
     */
    initSpecialAbility(playerClass) {
        switch (playerClass) {
            case 'heavy':
                this.maxSpecialDuration = 5000; // 5 seconds
                this.specialAbilityName = 'Berserk Mode';
                break;
            case 'scout':
                this.maxSpecialDuration = 3000; // 3 seconds
                this.specialAbilityName = 'Dash/Cloak';
                break;
            case 'engineer':
                this.maxSpecialDuration = 10000; // 10 seconds
                this.specialAbilityName = 'Energy Shield';
                break;
            case 'medic':
                this.maxSpecialDuration = 0; // Instant use
                this.specialAbilityName = 'Buff Grenade';
                break;
            default:
                this.maxSpecialDuration = 5000;
                this.specialAbilityName = 'Special Ability';
        }
    }
    
    /**
     * Add components to the player
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
        const render = new Render(null, '#00ffff');
        render.layer = 10; // Players render on top of most things
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
        
        // Weapon component
        const weapon = new Weapon(this.weaponType);
        weapon.onFire = (weaponComponent, bullets) => {
            this.onFire(bullets);
        };
        weapon.onReload = (weaponComponent) => {
            this.onReload();
        };
        weapon.onEmpty = (weaponComponent) => {
            this.onEmpty();
        };
        this.addComponent(weapon);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            const { path, value } = event;
            
            // Update player class config if changed
            if (path.startsWith(`player.classes.${this.playerClass}`)) {
                this.initPlayerClass(this.playerClass);
                
                // Update components with new values
                const physics = this.getComponent('Physics');
                if (physics) {
                    physics.maxSpeed = this.speed;
                }
                
                const health = this.getComponent('Health');
                if (health) {
                    health.setMaxHealth(this.health);
                }
                
                const weapon = this.getComponent('Weapon');
                if (weapon && weapon.weaponType !== this.weaponType) {
                    this.removeComponent('Weapon');
                    const newWeapon = new Weapon(this.weaponType);
                    newWeapon.onFire = (weaponComponent, bullets) => {
                        this.onFire(bullets);
                    };
                    newWeapon.onReload = (weaponComponent) => {
                        this.onReload();
                    };
                    newWeapon.onEmpty = (weaponComponent) => {
                        this.onEmpty();
                    };
                    this.addComponent(newWeapon);
                }
            }
        });
    }
    
    /**
     * Update the player
     * @param {number} deltaTime - Time elapsed in seconds
     */
    update(deltaTime) {
        // Call parent update
        super.update(deltaTime);
        
        // Get components
        const transform = this.getComponent('Transform');
        const physics = this.getComponent('Physics');
        const weapon = this.getComponent('Weapon');
        
        if (!transform || !physics || !weapon) return;
        
        // Update special ability cooldown
        if (this.specialCooldown > 0) {
            this.specialCooldown -= deltaTime * 1000;
            if (this.specialCooldown < 0) {
                this.specialCooldown = 0;
            }
        }
        
        // Update special ability duration
        if (this.usingSpecial && this.specialDuration > 0) {
            this.specialDuration -= deltaTime * 1000;
            if (this.specialDuration <= 0) {
                this.endSpecialAbility();
            }
        }
        
        // Process input
        this.processInput(deltaTime, transform, physics, weapon);
        
        // Update weapon rotation to face mouse
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = this.input.mouseX - rect.left;
            const mouseY = this.input.mouseY - rect.top;
            
            // Calculate angle to mouse
            const angle = Math.atan2(mouseY - transform.y, mouseX - transform.x);
            transform.rotation = angle;
        }
        
        // Apply class-specific effects
        this.applyClassEffects(deltaTime);
    }
    
    /**
     * Process player input
     * @param {number} deltaTime - Time elapsed in seconds
     * @param {Transform} transform - Transform component
     * @param {Physics} physics - Physics component
     * @param {Weapon} weapon - Weapon component
     */
    processInput(deltaTime, transform, physics, weapon) {
        // Calculate movement direction
        let moveX = 0;
        let moveY = 0;
        
        if (this.input.up) moveY -= 1;
        if (this.input.down) moveY += 1;
        if (this.input.left) moveX -= 1;
        if (this.input.right) moveX += 1;
        
        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= length;
            moveY /= length;
        }
        
        // Apply movement force
        if (moveX !== 0 || moveY !== 0) {
            const moveSpeed = this.speed * (this.usingSpecial && this.playerClass === 'heavy' ? 1.5 : 1);
            physics.applyForce(moveX * moveSpeed * 10, moveY * moveSpeed * 10);
        }
        
        // Handle weapon firing
        if (this.input.mousePressed) {
            weapon.startFiring();
        } else {
            weapon.stopFiring();
        }
        
        // Handle reload
        if (this.input.reload) {
            weapon.reload();
        }
        
        // Handle special ability
        if (this.input.special && this.specialCooldown <= 0 && !this.usingSpecial) {
            this.useSpecialAbility();
        }
    }
    
    /**
     * Apply class-specific effects
     * @param {number} deltaTime - Time elapsed in seconds
     */
    applyClassEffects(deltaTime) {
        const health = this.getComponent('Health');
        const physics = this.getComponent('Physics');
        const weapon = this.getComponent('Weapon');
        
        if (!health || !physics || !weapon) return;
        
        switch (this.playerClass) {
            case 'heavy':
                // Berserk mode: increased damage and speed
                if (this.usingSpecial) {
                    weapon.damage = window.config.get(`weapons.${this.weaponType}.damage`) * 1.5;
                    physics.maxSpeed = this.speed * 1.5;
                } else {
                    weapon.damage = window.config.get(`weapons.${this.weaponType}.damage`);
                    physics.maxSpeed = this.speed;
                }
                break;
                
            case 'scout':
                // Dash/cloak: increased speed and temporary invisibility
                if (this.usingSpecial) {
                    physics.maxSpeed = this.speed * 2;
                    // Invisibility would be handled by render system
                } else {
                    physics.maxSpeed = this.speed;
                }
                break;
                
            case 'engineer':
                // Energy shield: temporary invulnerability
                if (this.usingSpecial) {
                    health.setInvulnerable(0); // Continuous invulnerability
                } else {
                    // Invulnerability will be handled by cooldown system
                }
                break;
                
            case 'medic':
                // Buff grenade: instant use, no duration effects
                break;
        }
    }
    
    /**
     * Use special ability
     */
    useSpecialAbility() {
        if (this.specialCooldown > 0) return;
        
        switch (this.playerClass) {
            case 'heavy':
            case 'scout':
            case 'engineer':
                // Abilities with duration
                this.usingSpecial = true;
                this.specialDuration = this.maxSpecialDuration;
                break;
                
            case 'medic':
                // Instant ability
                this.performMedicSpecial();
                break;
        }
        
        // Set cooldown
        this.specialCooldown = this.maxSpecialCooldown;
        
        // Emit event
        window.eventSystem.emit('player:specialAbility', this, this.playerClass);
    }
    
    /**
     * End special ability
     */
    endSpecialAbility() {
        this.usingSpecial = false;
        this.specialDuration = 0;
        
        // Handle class-specific cleanup
        switch (this.playerClass) {
            case 'engineer':
                const health = this.getComponent('Health');
                if (health) {
                    health.invulnerable = false;
                }
                break;
        }
        
        // Emit event
        window.eventSystem.emit('player:specialAbilityEnd', this, this.playerClass);
    }
    
    /**
     * Perform medic's special ability (buff grenade)
     */
    performMedicSpecial() {
        // This would create a buff grenade entity
        // For now, we'll just emit an event
        window.eventSystem.emit('player:medicBuff', this);
    }
    
    /**
     * Handle player death
     * @param {object} source - Source of death
     */
    onDeath(source) {
        // Emit death event
        window.eventSystem.emit('player:death', this, source);
        
        // Reset player state
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            mouseX: 0,
            mouseY: 0,
            mousePressed: false,
            special: false,
            reload: false
        };
        
        // End special ability if active
        if (this.usingSpecial) {
            this.endSpecialAbility();
        }
    }
    
    /**
     * Handle player taking damage
     * @param {number} damage - Amount of damage
     * @param {object} source - Source of damage
     */
    onDamage(damage, source) {
        // Emit damage event
        window.eventSystem.emit('player:damage', this, damage, source);
    }
    
    /**
     * Handle weapon firing
     * @param {Array} bullets - Array of bullets created
     */
    onFire(bullets) {
        // Emit fire event
        window.eventSystem.emit('player:fire', this, bullets);
    }
    
    /**
     * Handle weapon reload
     */
    onReload() {
        // Emit reload event
        window.eventSystem.emit('player:reload', this);
    }
    
    /**
     * Handle weapon out of ammo
     */
    onEmpty() {
        // Emit empty event
        window.eventSystem.emit('player:empty', this);
    }
    
    /**
     * Add score to player
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.score += points;
        
        // Check for level up
        const expNeeded = this.level * 1000;
        if (this.experience >= expNeeded) {
            this.levelUp();
        }
        
        // Emit score event
        window.eventSystem.emit('player:score', this, this.score);
    }
    
    /**
     * Add experience to player
     * @param {number} exp - Experience to add
     */
    addExperience(exp) {
        this.experience += exp;
        
        // Check for level up
        const expNeeded = this.level * 1000;
        if (this.experience >= expNeeded) {
            this.levelUp();
        }
    }
    
    /**
     * Level up the player
     */
    levelUp() {
        this.level++;
        this.experience = 0;
        
        // Increase stats
        const health = this.getComponent('Health');
        if (health) {
            health.setMaxHealth(health.maxHealth + 10);
            health.heal(health.maxHealth);
        }
        
        // Emit level up event
        window.eventSystem.emit('player:levelUp', this, this.level);
    }
    
    /**
     * Serialize player for network transmission
     * @returns {object} Serialized player data
     */
    serialize() {
        const data = super.serialize();
        
        // Add player-specific data
        data.playerClass = this.playerClass;
        data.name = this.name;
        data.score = this.score;
        data.level = this.level;
        data.experience = this.experience;
        data.specialCooldown = this.specialCooldown;
        data.usingSpecial = this.usingSpecial;
        data.specialDuration = this.specialDuration;
        
        return data;
    }
    
    /**
     * Deserialize player data
     * @param {object} data - Serialized player data
     * @returns {Player} This player for method chaining
     */
    deserialize(data) {
        super.deserialize(data);
        
        // Set player-specific data
        this.playerClass = data.playerClass;
        this.name = data.name;
        this.score = data.score;
        this.level = data.level;
        this.experience = data.experience;
        this.specialCooldown = data.specialCooldown;
        this.usingSpecial = data.usingSpecial;
        this.specialDuration = data.specialDuration;
        
        return this;
    }
}

// Export for use in modules
export default Player;