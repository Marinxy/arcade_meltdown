/**
 * Arcade Meltdown - Game Balancing System
 * Manages balance of all player classes and weapons
 */

class GameBalancer {
    /**
     * Create a new Game Balancing system
     * @param {GameEngine} gameEngine - Game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Player class balance data
        this.playerClasses = {
            assault: {
                name: "Assault",
                description: "Balanced combat class with all-around capabilities",
                health: 100,
                speed: 180,
                damageMultiplier: 1.0,
                defenseMultiplier: 1.0,
                abilityCooldownMultiplier: 1.0,
                weaponProficiency: {
                    pistol: 1.0,
                    rifle: 1.2,
                    shotgun: 0.9,
                    smg: 1.1,
                    plasmaRifle: 1.0,
                    flamethrower: 0.9,
                    rocketLauncher: 0.8
                },
                abilities: {
                    ability1: {
                        name: "Combat Roll",
                        description: "Quick dodge in the direction of movement",
                        cooldown: 8,
                        duration: 0.5,
                        speedMultiplier: 2.5,
                        invulnerable: true
                    },
                    ability2: {
                        name: "Adrenaline Rush",
                        description: "Temporarily increase fire rate and movement speed",
                        cooldown: 20,
                        duration: 8,
                        fireRateMultiplier: 1.5,
                        speedMultiplier: 1.3
                    }
                },
                playstyle: "Versatile combatant effective at all ranges",
                difficulty: "Medium",
                balanceRating: 1.0 // 1.0 = perfectly balanced
            },
            
            heavy: {
                name: "Heavy",
                description: "Tank class with high health and heavy weapons",
                health: 180,
                speed: 120,
                damageMultiplier: 1.2,
                defenseMultiplier: 1.5,
                abilityCooldownMultiplier: 1.2,
                weaponProficiency: {
                    pistol: 0.7,
                    rifle: 1.0,
                    shotgun: 1.3,
                    smg: 0.8,
                    plasmaRifle: 1.1,
                    flamethrower: 1.2,
                    rocketLauncher: 1.4
                },
                abilities: {
                    ability1: {
                        name: "Shield Wall",
                        description: "Deploy a temporary shield that blocks incoming damage",
                        cooldown: 15,
                        duration: 6,
                        damageReduction: 0.8,
                        radius: 100
                    },
                    ability2: {
                        name: "Berserker Rage",
                        description: "Temporarily increase damage and resistance",
                        cooldown: 25,
                        duration: 10,
                        damageMultiplier: 1.8,
                        defenseMultiplier: 1.3
                    }
                },
                playstyle: "Frontline tank that excels at close range",
                difficulty: "Easy",
                balanceRating: 1.0
            },
            
            scout: {
                name: "Scout",
                description: "Fast and agile class specializing in hit-and-run tactics",
                health: 80,
                speed: 240,
                damageMultiplier: 0.9,
                defenseMultiplier: 0.8,
                abilityCooldownMultiplier: 0.8,
                weaponProficiency: {
                    pistol: 1.2,
                    rifle: 0.9,
                    shotgun: 0.7,
                    smg: 1.3,
                    plasmaRifle: 1.0,
                    flamethrower: 0.8,
                    rocketLauncher: 0.6
                },
                abilities: {
                    ability1: {
                        name: "Dash",
                        description: "Quick burst of speed in any direction",
                        cooldown: 5,
                        duration: 0.3,
                        speedMultiplier: 4.0,
                        distance: 200
                    },
                    ability2: {
                        name: "Targeting System",
                        description: "Highlight enemies and increase critical hit chance",
                        cooldown: 18,
                        duration: 12,
                        critChanceMultiplier: 2.0,
                        visionBonus: 1.5
                    }
                },
                playstyle: "Fast-moving harasser that excels at flanking",
                difficulty: "Hard",
                balanceRating: 1.0
            },
            
            engineer: {
                name: "Engineer",
                description: "Support class with deployable turrets and defensive structures",
                health: 110,
                speed: 150,
                damageMultiplier: 0.95,
                defenseMultiplier: 1.1,
                abilityCooldownMultiplier: 0.9,
                weaponProficiency: {
                    pistol: 1.0,
                    rifle: 1.0,
                    shotgun: 0.9,
                    smg: 1.0,
                    plasmaRifle: 1.2,
                    flamethrower: 0.8,
                    rocketLauncher: 1.1
                },
                abilities: {
                    ability1: {
                        name: "Deploy Turret",
                        description: "Place an automated turret that attacks enemies",
                        cooldown: 12,
                        duration: 30,
                        damage: 15,
                        fireRate: 3,
                        health: 100
                    },
                    ability2: {
                        name: "Repair Field",
                        description: "Create an area that repairs allies and damages enemies",
                        cooldown: 20,
                        duration: 8,
                        radius: 150,
                        healPerSecond: 10,
                        damagePerSecond: 5
                    }
                },
                playstyle: "Defensive support that controls areas with turrets",
                difficulty: "Medium",
                balanceRating: 1.0
            },
            
            medic: {
                name: "Medic",
                description: "Support class focused on healing and reviving teammates",
                health: 90,
                speed: 170,
                damageMultiplier: 0.85,
                defenseMultiplier: 0.9,
                abilityCooldownMultiplier: 0.7,
                weaponProficiency: {
                    pistol: 1.1,
                    rifle: 0.9,
                    shotgun: 0.8,
                    smg: 1.0,
                    plasmaRifle: 1.0,
                    flamethrower: 0.7,
                    rocketLauncher: 0.7
                },
                abilities: {
                    ability1: {
                        name: "Healing Burst",
                        description: "Heal all nearby allies",
                        cooldown: 10,
                        radius: 200,
                        healAmount: 40
                    },
                    ability2: {
                        name: "Revive",
                        description: "Quickly revive a fallen teammate with bonus health",
                        cooldown: 15,
                        reviveTime: 2,
                        bonusHealth: 50
                    }
                },
                playstyle: "Essential support that keeps the team alive",
                difficulty: "Medium",
                balanceRating: 1.0
            }
        };
        
        // Weapon balance data
        this.weapons = {
            pistol: {
                name: "Pistol",
                description: "Reliable sidearm with moderate damage and accuracy",
                damage: 20,
                fireRate: 3,
                magazineSize: 12,
                reloadTime: 1.5,
                accuracy: 0.9,
                range: 400,
                ammoType: "light",
                specialProperties: {
                    headshotMultiplier: 2.0,
                    critChance: 0.05
                },
                balanceRating: 1.0
            },
            
            rifle: {
                name: "Rifle",
                description: "Standard issue weapon with good all-around performance",
                damage: 25,
                fireRate: 5,
                magazineSize: 30,
                reloadTime: 2.0,
                accuracy: 0.85,
                range: 600,
                ammoType: "medium",
                specialProperties: {
                    headshotMultiplier: 2.0,
                    critChance: 0.08
                },
                balanceRating: 1.0
            },
            
            shotgun: {
                name: "Shotgun",
                description: "Devastating close-range weapon with wide spread",
                damage: 80,
                fireRate: 1,
                magazineSize: 8,
                reloadTime: 2.5,
                accuracy: 0.6,
                range: 200,
                ammoType: "heavy",
                specialProperties: {
                    pelletCount: 8,
                    spreadAngle: 0.3,
                    critChance: 0.1
                },
                balanceRating: 1.0
            },
            
            smg: {
                name: "SMG",
                description: "High fire rate weapon with low recoil",
                damage: 15,
                fireRate: 10,
                magazineSize: 40,
                reloadTime: 2.2,
                accuracy: 0.75,
                range: 350,
                ammoType: "light",
                specialProperties: {
                    headshotMultiplier: 1.8,
                    critChance: 0.07
                },
                balanceRating: 1.0
            },
            
            plasmaRifle: {
                name: "Plasma Rifle",
                description: "Advanced energy weapon with armor penetration",
                damage: 35,
                fireRate: 4,
                magazineSize: 25,
                reloadTime: 2.8,
                accuracy: 0.9,
                range: 700,
                ammoType: "energy",
                specialProperties: {
                    headshotMultiplier: 2.2,
                    critChance: 0.1,
                    armorPenetration: 0.5,
                    dotDamage: 5,
                    dotDuration: 3
                },
                balanceRating: 1.0
            },
            
            flamethrower: {
                name: "Flamethrower",
                description: "Short-range weapon that sets enemies on fire",
                damage: 12,
                fireRate: 8,
                magazineSize: 100,
                reloadTime: 3.0,
                accuracy: 0.5,
                range: 150,
                ammoType: "fuel",
                specialProperties: {
                    coneAngle: 0.5,
                    dotDamage: 8,
                    dotDuration: 5,
                    critChance: 0.05
                },
                balanceRating: 1.0
            },
            
            rocketLauncher: {
                name: "Rocket Launcher",
                description: "Explosive weapon with area damage",
                damage: 150,
                fireRate: 0.5,
                magazineSize: 3,
                reloadTime: 4.0,
                accuracy: 0.8,
                range: 800,
                ammoType: "explosive",
                specialProperties: {
                    explosionRadius: 150,
                    headshotMultiplier: 1.5,
                    critChance: 0.15,
                    selfDamage: 30
                },
                balanceRating: 1.0
            }
        };
        
        // Game balance metrics
        this.balanceMetrics = {
            classWinRates: {},
            classUsageRates: {},
            weaponUsageRates: {},
            weaponKillRates: {},
            averageGameDuration: 0,
            averageKillsPerGame: 0,
            averageDeathsPerGame: 0,
            averageDamagePerGame: 0,
            balanceScore: 0 // 0-100, higher is better
        };
        
        // Balance adjustments
        this.balanceAdjustments = {
            playerClasses: {},
            weapons: {}
        };
        
        // Initialize system
        this.init();
    }
    
    /**
     * Initialize the game balancing system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize balance metrics
        this.initializeBalanceMetrics();
        
        // Calculate initial balance score
        this.calculateBalanceScore();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for player join events
        window.eventSystem.on('player:join', (player) => {
            this.onPlayerJoin(player);
        });
        
        // Listen for player death events
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        // Listen for enemy death events
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for player damage events
        window.eventSystem.on('player:damageDealt', (player, damage, target) => {
            this.onPlayerDamageDealt(player, damage, target);
        });
        
        // Listen for game start events
        window.eventSystem.on('game:start', () => {
            this.onGameStart();
        });
        
        // Listen for game over events
        window.eventSystem.on('game:over', (score) => {
            this.onGameOver(score);
        });
        
        // Listen for wave complete events
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
        });
    }
    
    /**
     * Initialize balance metrics
     */
    initializeBalanceMetrics() {
        // Initialize class win rates
        for (const classId in this.playerClasses) {
            this.balanceMetrics.classWinRates[classId] = 0.5; // Start with 50% win rate
            this.balanceMetrics.classUsageRates[classId] = 0; // Start with 0% usage rate
        }
        
        // Initialize weapon usage rates
        for (const weaponId in this.weapons) {
            this.balanceMetrics.weaponUsageRates[weaponId] = 0; // Start with 0% usage rate
            this.balanceMetrics.weaponKillRates[weaponId] = 0; // Start with 0% kill rate
        }
    }
    
    /**
     * Handle player join event
     * @param {Player} player - Player who joined
     */
    onPlayerJoin(player) {
        // Get player class
        const playerClass = player.class;
        
        // Update class usage rates
        if (this.balanceMetrics.classUsageRates[playerClass] !== undefined) {
            this.balanceMetrics.classUsageRates[playerClass]++;
        }
    }
    
    /**
     * Handle player death event
     * @param {Player} player - Player who died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Get player class
        const playerClass = player.class;
        
        // Update class win rates
        if (source && source.hasTag && source.hasTag('player')) {
            // Source player gets a win
            const sourceClass = source.class;
            if (this.balanceMetrics.classWinRates[sourceClass] !== undefined) {
                // Increment win count
                this.balanceMetrics.classWinRates[sourceClass] = 
                    (this.balanceMetrics.classWinRates[sourceClass] * 0.95) + 0.05;
            }
            
            // Dead player gets a loss
            if (this.balanceMetrics.classWinRates[playerClass] !== undefined) {
                // Decrement win count
                this.balanceMetrics.classWinRates[playerClass] = 
                    (this.balanceMetrics.classWinRates[playerClass] * 0.95);
            }
        }
        
        // Update deaths per game
        this.balanceMetrics.averageDeathsPerGame++;
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - Enemy that died
     * @param {Entity} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Skip if source is not a player
        if (!source || !source.hasTag || !source.hasTag('player')) return;
        
        // Get player weapon
        const weapon = source.getComponent('Weapon');
        if (!weapon) return;
        
        // Get weapon type
        const weaponType = weapon.type;
        
        // Update weapon kill rates
        if (this.balanceMetrics.weaponKillRates[weaponType] !== undefined) {
            this.balanceMetrics.weaponKillRates[weaponType]++;
        }
        
        // Update kills per game
        this.balanceMetrics.averageKillsPerGame++;
    }
    
    /**
     * Handle player damage dealt event
     * @param {Player} player - Player who dealt damage
     * @param {number} damage - Amount of damage dealt
     * @param {Entity} target - Target of damage
     */
    onPlayerDamageDealt(player, damage, target) {
        // Update damage per game
        this.balanceMetrics.averageDamagePerGame += damage;
    }
    
    /**
     * Handle game start event
     */
    onGameStart() {
        // Reset game metrics
        this.balanceMetrics.averageKillsPerGame = 0;
        this.balanceMetrics.averageDeathsPerGame = 0;
        this.balanceMetrics.averageDamagePerGame = 0;
        
        // Reset usage rates
        for (const weaponId in this.balanceMetrics.weaponUsageRates) {
            this.balanceMetrics.weaponUsageRates[weaponId] = 0;
        }
    }
    
    /**
     * Handle game over event
     * @param {number} score - Final score
     */
    onGameOver(score) {
        // Calculate game duration
        const gameDuration = (Date.now() - this.gameStartTime) / 1000;
        
        // Update average game duration
        this.balanceMetrics.averageGameDuration = 
            (this.balanceMetrics.averageGameDuration * 0.9) + (gameDuration * 0.1);
        
        // Calculate balance score
        this.calculateBalanceScore();
        
        // Apply balance adjustments if needed
        this.applyBalanceAdjustments();
    }
    
    /**
     * Handle wave complete event
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Update weapon usage rates
        const players = this.gameEngine.getEntitiesByTag('player');
        
        for (const player of players) {
            // Get player weapon
            const weapon = player.getComponent('Weapon');
            if (!weapon) continue;
            
            // Get weapon type
            const weaponType = weapon.type;
            
            // Update weapon usage rate
            if (this.balanceMetrics.weaponUsageRates[weaponType] !== undefined) {
                this.balanceMetrics.weaponUsageRates[weaponType]++;
            }
        }
    }
    
    /**
     * Calculate balance score
     */
    calculateBalanceScore() {
        // Calculate class balance score
        let classBalanceScore = 0;
        let classCount = 0;
        
        for (const classId in this.balanceMetrics.classWinRates) {
            const winRate = this.balanceMetrics.classWinRates[classId];
            
            // Calculate deviation from ideal win rate (50%)
            const deviation = Math.abs(winRate - 0.5);
            
            // Convert to score (lower deviation = higher score)
            const score = 100 * (1 - (deviation * 2));
            
            classBalanceScore += score;
            classCount++;
        }
        
        // Calculate average class balance score
        const avgClassBalanceScore = classCount > 0 ? classBalanceScore / classCount : 100;
        
        // Calculate weapon balance score
        let weaponBalanceScore = 0;
        let weaponCount = 0;
        
        // Normalize weapon usage rates
        const totalWeaponUsage = Object.values(this.balanceMetrics.weaponUsageRates)
            .reduce((sum, rate) => sum + rate, 0);
        
        for (const weaponId in this.balanceMetrics.weaponUsageRates) {
            const usageRate = totalWeaponUsage > 0 ? 
                this.balanceMetrics.weaponUsageRates[weaponId] / totalWeaponUsage : 0;
            
            // Calculate deviation from ideal usage rate (equal distribution)
            const idealUsageRate = 1 / Object.keys(this.weapons).length;
            const deviation = Math.abs(usageRate - idealUsageRate);
            
            // Convert to score (lower deviation = higher score)
            const score = 100 * (1 - (deviation / idealUsageRate));
            
            weaponBalanceScore += score;
            weaponCount++;
        }
        
        // Calculate average weapon balance score
        const avgWeaponBalanceScore = weaponCount > 0 ? weaponBalanceScore / weaponCount : 100;
        
        // Calculate overall balance score
        this.balanceMetrics.balanceScore = (avgClassBalanceScore + avgWeaponBalanceScore) / 2;
    }
    
    /**
     * Apply balance adjustments
     */
    applyBalanceAdjustments() {
        // Check if balance adjustments are needed
        if (this.balanceMetrics.balanceScore < 70) {
            // Apply class balance adjustments
            this.applyClassBalanceAdjustments();
            
            // Apply weapon balance adjustments
            this.applyWeaponBalanceAdjustments();
        }
    }
    
    /**
     * Apply class balance adjustments
     */
    applyClassBalanceAdjustments() {
        // Calculate average win rate
        let totalWinRate = 0;
        let classCount = 0;
        
        for (const classId in this.balanceMetrics.classWinRates) {
            totalWinRate += this.balanceMetrics.classWinRates[classId];
            classCount++;
        }
        
        const avgWinRate = classCount > 0 ? totalWinRate / classCount : 0.5;
        
        // Apply adjustments to each class
        for (const classId in this.balanceMetrics.classWinRates) {
            const winRate = this.balanceMetrics.classWinRates[classId];
            
            // Calculate adjustment factor
            let adjustmentFactor = 1.0;
            
            if (winRate > avgWinRate + 0.1) {
                // Class is too strong, nerf it
                adjustmentFactor = 0.95;
            } else if (winRate < avgWinRate - 0.1) {
                // Class is too weak, buff it
                adjustmentFactor = 1.05;
            }
            
            // Apply adjustments to class stats
            const playerClass = this.playerClasses[classId];
            if (playerClass) {
                // Adjust health
                playerClass.health = Math.round(playerClass.health * adjustmentFactor);
                
                // Adjust speed
                playerClass.speed = Math.round(playerClass.speed * adjustmentFactor);
                
                // Adjust damage multiplier
                playerClass.damageMultiplier = playerClass.damageMultiplier * adjustmentFactor;
                
                // Adjust defense multiplier
                playerClass.defenseMultiplier = playerClass.defenseMultiplier * adjustmentFactor;
                
                // Adjust ability cooldown multiplier
                playerClass.abilityCooldownMultiplier = playerClass.abilityCooldownMultiplier / adjustmentFactor;
                
                // Store adjustment
                this.balanceAdjustments.playerClasses[classId] = {
                    adjustmentFactor: adjustmentFactor,
                    reason: winRate > avgWinRate + 0.1 ? "Too strong" : "Too weak"
                };
            }
        }
    }
    
    /**
     * Apply weapon balance adjustments
     */
    applyWeaponBalanceAdjustments() {
        // Calculate average usage rate
        const totalWeaponUsage = Object.values(this.balanceMetrics.weaponUsageRates)
            .reduce((sum, rate) => sum + rate, 0);
        
        const avgUsageRate = totalWeaponUsage > 0 ? 
            totalWeaponUsage / Object.keys(this.weapons).length : 0;
        
        // Apply adjustments to each weapon
        for (const weaponId in this.balanceMetrics.weaponUsageRates) {
            const usageRate = totalWeaponUsage > 0 ? 
                this.balanceMetrics.weaponUsageRates[weaponId] / totalWeaponUsage : 0;
            
            // Calculate adjustment factor
            let adjustmentFactor = 1.0;
            
            if (usageRate > avgUsageRate + 0.1) {
                // Weapon is too popular, nerf it
                adjustmentFactor = 0.95;
            } else if (usageRate < avgUsageRate - 0.1) {
                // Weapon is not popular enough, buff it
                adjustmentFactor = 1.05;
            }
            
            // Apply adjustments to weapon stats
            const weapon = this.weapons[weaponId];
            if (weapon) {
                // Adjust damage
                weapon.damage = Math.round(weapon.damage * adjustmentFactor);
                
                // Adjust fire rate
                weapon.fireRate = weapon.fireRate * adjustmentFactor;
                
                // Adjust magazine size
                weapon.magazineSize = Math.round(weapon.magazineSize * adjustmentFactor);
                
                // Adjust reload time
                weapon.reloadTime = weapon.reloadTime / adjustmentFactor;
                
                // Adjust accuracy
                weapon.accuracy = weapon.accuracy * adjustmentFactor;
                
                // Store adjustment
                this.balanceAdjustments.weapons[weaponId] = {
                    adjustmentFactor: adjustmentFactor,
                    reason: usageRate > avgUsageRate + 0.1 ? "Too popular" : "Not popular enough"
                };
            }
        }
    }
    
    /**
     * Get player class data
     * @param {string} classId - Class ID
     * @returns {object} Player class data
     */
    getPlayerClass(classId) {
        return this.playerClasses[classId];
    }
    
    /**
     * Get all player classes
     * @returns {object} All player classes
     */
    getAllPlayerClasses() {
        return this.playerClasses;
    }
    
    /**
     * Get weapon data
     * @param {string} weaponId - Weapon ID
     * @returns {object} Weapon data
     */
    getWeapon(weaponId) {
        return this.weapons[weaponId];
    }
    
    /**
     * Get all weapons
     * @returns {object} All weapons
     */
    getAllWeapons() {
        return this.weapons;
    }
    
    /**
     * Get balance metrics
     * @returns {object} Balance metrics
     */
    getBalanceMetrics() {
        return this.balanceMetrics;
    }
    
    /**
     * Get balance adjustments
     * @returns {object} Balance adjustments
     */
    getBalanceAdjustments() {
        return this.balanceAdjustments;
    }
    
    /**
     * Get balance score
     * @returns {number} Balance score (0-100)
     */
    getBalanceScore() {
        return this.balanceMetrics.balanceScore;
    }
    
    /**
     * Get recommended class for player based on playstyle
     * @param {string} playstyle - Player playstyle
     * @returns {string} Recommended class ID
     */
    getRecommendedClass(playstyle) {
        // Map playstyles to classes
        const playstyleMap = {
            "aggressive": "heavy",
            "defensive": "engineer",
            "support": "medic",
            "balanced": "assault",
            "fast": "scout",
            "tactical": "assault",
            "team": "medic",
            "solo": "scout",
            "area": "engineer"
        };
        
        // Get recommended class
        const recommendedClass = playstyleMap[playstyle.toLowerCase()];
        
        // Return recommended class or default to assault
        return recommendedClass || "assault";
    }
    
    /**
     * Get class matchup data
     * @param {string} classId1 - First class ID
     * @param {string} classId2 - Second class ID
     * @returns {object} Matchup data
     */
    getClassMatchup(classId1, classId2) {
        // Get class data
        const class1 = this.playerClasses[classId1];
        const class2 = this.playerClasses[classId2];
        
        if (!class1 || !class2) {
            return {
                advantage: "none",
                score: 0.5,
                description: "Invalid class IDs"
            };
        }
        
        // Calculate matchup score based on class stats
        let score = 0.5; // Start with neutral score
        
        // Compare health
        const healthDiff = class1.health - class2.health;
        score += (healthDiff / 100) * 0.1;
        
        // Compare speed
        const speedDiff = class1.speed - class2.speed;
        score += (speedDiff / 100) * 0.1;
        
        // Compare damage
        const damageDiff = class1.damageMultiplier - class2.damageMultiplier;
        score += damageDiff * 0.15;
        
        // Compare defense
        const defenseDiff = class1.defenseMultiplier - class2.defenseMultiplier;
        score += defenseDiff * 0.15;
        
        // Compare ability cooldown
        const cooldownDiff = class2.abilityCooldownMultiplier - class1.abilityCooldownMultiplier;
        score += cooldownDiff * 0.1;
        
        // Clamp score
        score = Math.max(0, Math.min(1, score));
        
        // Determine advantage
        let advantage = "none";
        if (score > 0.6) {
            advantage = classId1;
        } else if (score < 0.4) {
            advantage = classId2;
        }
        
        // Generate description
        let description = "Even matchup";
        if (advantage === classId1) {
            description = `${class1.name} has advantage over ${class2.name}`;
        } else if (advantage === classId2) {
            description = `${class2.name} has advantage over ${class1.name}`;
        }
        
        return {
            advantage: advantage,
            score: score,
            description: description
        };
    }
    
    /**
     * Get weapon matchup data
     * @param {string} weaponId1 - First weapon ID
     * @param {string} weaponId2 - Second weapon ID
     * @returns {object} Matchup data
     */
    getWeaponMatchup(weaponId1, weaponId2) {
        // Get weapon data
        const weapon1 = this.weapons[weaponId1];
        const weapon2 = this.weapons[weaponId2];
        
        if (!weapon1 || !weapon2) {
            return {
                advantage: "none",
                score: 0.5,
                description: "Invalid weapon IDs"
            };
        }
        
        // Calculate matchup score based on weapon stats
        let score = 0.5; // Start with neutral score
        
        // Compare damage
        const damageDiff = weapon1.damage - weapon2.damage;
        score += (damageDiff / 100) * 0.15;
        
        // Compare fire rate
        const fireRateDiff = weapon1.fireRate - weapon2.fireRate;
        score += (fireRateDiff / 10) * 0.15;
        
        // Compare magazine size
        const magazineDiff = weapon1.magazineSize - weapon2.magazineSize;
        score += (magazineDiff / 50) * 0.1;
        
        // Compare reload time
        const reloadDiff = weapon2.reloadTime - weapon1.reloadTime;
        score += (reloadDiff / 2) * 0.1;
        
        // Compare accuracy
        const accuracyDiff = weapon1.accuracy - weapon2.accuracy;
        score += accuracyDiff * 0.1;
        
        // Compare range
        const rangeDiff = weapon1.range - weapon2.range;
        score += (rangeDiff / 500) * 0.1;
        
        // Clamp score
        score = Math.max(0, Math.min(1, score));
        
        // Determine advantage
        let advantage = "none";
        if (score > 0.6) {
            advantage = weaponId1;
        } else if (score < 0.4) {
            advantage = weaponId2;
        }
        
        // Generate description
        let description = "Even matchup";
        if (advantage === weaponId1) {
            description = `${weapon1.name} has advantage over ${weapon2.name}`;
        } else if (advantage === weaponId2) {
            description = `${weapon2.name} has advantage over ${weapon1.name}`;
        }
        
        return {
            advantage: advantage,
            score: score,
            description: description
        };
    }
    
    /**
     * Generate balance report
     * @returns {string} Balance report
     */
    generateBalanceReport() {
        let report = "Game Balance Report\n";
        report += "==================\n\n";
        
        // Overall balance score
        report += `Overall Balance Score: ${this.balanceMetrics.balanceScore.toFixed(1)}/100\n`;
        
        // Class balance section
        report += "\nClass Balance:\n";
        report += "--------------\n";
        
        for (const classId in this.playerClasses) {
            const playerClass = this.playerClasses[classId];
            const winRate = this.balanceMetrics.classWinRates[classId] || 0;
            const usageRate = this.balanceMetrics.classUsageRates[classId] || 0;
            
            report += `\n${playerClass.name}:\n`;
            report += `  Win Rate: ${(winRate * 100).toFixed(1)}%\n`;
            report += `  Usage Rate: ${(usageRate * 100).toFixed(1)}%\n`;
            report += `  Balance Rating: ${playerClass.balanceRating.toFixed(2)}\n`;
            
            // Check if adjustments were made
            if (this.balanceAdjustments.playerClasses[classId]) {
                const adjustment = this.balanceAdjustments.playerClasses[classId];
                report += `  Adjustment: ${adjustment.adjustmentFactor.toFixed(2)}x (${adjustment.reason})\n`;
            }
        }
        
        // Weapon balance section
        report += "\nWeapon Balance:\n";
        report += "---------------\n";
        
        // Calculate total weapon usage
        const totalWeaponUsage = Object.values(this.balanceMetrics.weaponUsageRates)
            .reduce((sum, rate) => sum + rate, 0);
        
        for (const weaponId in this.weapons) {
            const weapon = this.weapons[weaponId];
            const usageRate = totalWeaponUsage > 0 ? 
                this.balanceMetrics.weaponUsageRates[weaponId] / totalWeaponUsage : 0;
            const killRate = this.balanceMetrics.weaponKillRates[weaponId] || 0;
            
            report += `\n${weapon.name}:\n`;
            report += `  Usage Rate: ${(usageRate * 100).toFixed(1)}%\n`;
            report += `  Kill Rate: ${killRate}\n`;
            report += `  Balance Rating: ${weapon.balanceRating.toFixed(2)}\n`;
            
            // Check if adjustments were made
            if (this.balanceAdjustments.weapons[weaponId]) {
                const adjustment = this.balanceAdjustments.weapons[weaponId];
                report += `  Adjustment: ${adjustment.adjustmentFactor.toFixed(2)}x (${adjustment.reason})\n`;
            }
        }
        
        // Game metrics section
        report += "\nGame Metrics:\n";
        report += "-------------\n";
        report += `Average Game Duration: ${this.balanceMetrics.averageGameDuration.toFixed(1)} seconds\n`;
        report += `Average Kills Per Game: ${this.balanceMetrics.averageKillsPerGame.toFixed(1)}\n`;
        report += `Average Deaths Per Game: ${this.balanceMetrics.averageDeathsPerGame.toFixed(1)}\n`;
        report += `Average Damage Per Game: ${this.balanceMetrics.averageDamagePerGame.toFixed(1)}\n`;
        
        // Recommendations section
        report += "\nRecommendations:\n";
        report += "----------------\n";
        
        // Check if balance score is low
        if (this.balanceMetrics.balanceScore < 70) {
            report += "Game balance is below optimal. Consider the following adjustments:\n";
            
            // Check class balance
            for (const classId in this.balanceMetrics.classWinRates) {
                const winRate = this.balanceMetrics.classWinRates[classId];
                
                if (winRate > 0.6) {
                    const playerClass = this.playerClasses[classId];
                    report += `- Nerf ${playerClass.name} (win rate: ${(winRate * 100).toFixed(1)}%)\n`;
                } else if (winRate < 0.4) {
                    const playerClass = this.playerClasses[classId];
                    report += `- Buff ${playerClass.name} (win rate: ${(winRate * 100).toFixed(1)}%)\n`;
                }
            }
            
            // Check weapon balance
            for (const weaponId in this.balanceMetrics.weaponUsageRates) {
                const usageRate = totalWeaponUsage > 0 ? 
                    this.balanceMetrics.weaponUsageRates[weaponId] / totalWeaponUsage : 0;
                
                if (usageRate > 0.3) {
                    const weapon = this.weapons[weaponId];
                    report += `- Nerf ${weapon.name} (usage rate: ${(usageRate * 100).toFixed(1)}%)\n`;
                } else if (usageRate < 0.05) {
                    const weapon = this.weapons[weaponId];
                    report += `- Buff ${weapon.name} (usage rate: ${(usageRate * 100).toFixed(1)}%)\n`;
                }
            }
        } else {
            report += "Game balance is optimal. No major adjustments needed.\n";
        }
        
        return report;
    }
    
    /**
     * Update the game balancing system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the game balancing system
     */
    destroy() {
        // Nothing to destroy here
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameBalancer;
}