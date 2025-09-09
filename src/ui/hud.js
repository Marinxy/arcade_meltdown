/**
 * Arcade Meltdown - HUD System
 * Manages the in-game heads-up display
 */

class HUD {
    /**
     * Create a new HUD system
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // HUD elements
        this.elements = {
            playerClass: document.getElementById('playerClass'),
            healthBar: document.getElementById('healthBar'),
            healthText: document.getElementById('healthText'),
            waveNumber: document.getElementById('waveNumber'),
            score: document.getElementById('score'),
            chaosFill: document.getElementById('chaosFill'),
            weaponName: document.getElementById('weaponName'),
            ammoCount: document.getElementById('ammoCount'),
            specialIcon: document.getElementById('specialIcon'),
            specialCooldown: document.getElementById('specialCooldown')
        };
        
        // Initialize the HUD
        this.init();
    }
    
    /**
     * Initialize the HUD
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial update
        this.update();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for player events
        window.eventSystem.on('player:created', (player) => {
            this.onPlayerCreated(player);
        });
        
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        window.eventSystem.on('player:damage', (player, damage, source) => {
            this.onPlayerDamage(player, damage, source);
        });
        
        window.eventSystem.on('player:score', (player, score) => {
            this.onPlayerScore(player, score);
        });
        
        window.eventSystem.on('player:levelUp', (player, level) => {
            this.onPlayerLevelUp(player, level);
        });
        
        window.eventSystem.on('player:specialAbility', (player, playerClass) => {
            this.onPlayerSpecialAbility(player, playerClass);
        });
        
        window.eventSystem.on('player:specialAbilityEnd', (player, playerClass) => {
            this.onPlayerSpecialAbilityEnd(player, playerClass);
        });
        
        // Listen for wave events
        window.eventSystem.on('wave:start', (wave, enemyCount) => {
            this.onWaveStart(wave, enemyCount);
        });
        
        window.eventSystem.on('wave:complete', (wave, score) => {
            this.onWaveComplete(wave, score);
        });
        
        // Listen for chaos events
        window.eventSystem.on('chaos:update', (chaosLevel) => {
            this.onChaosUpdate(chaosLevel);
        });
        
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        window.eventSystem.on('game:over', (gameEngine) => {
            this.onGameOver(gameEngine);
        });
    }
    
    /**
     * Update the HUD
     */
    update() {
        if (this.gameEngine.gameState !== 'playing') return;
        
        // Update player info
        this.updatePlayerInfo();
        
        // Update game info
        this.updateGameInfo();
        
        // Update chaos meter
        this.updateChaosMeter();
        
        // Update weapon info
        this.updateWeaponInfo();
    }
    
    /**
     * Update player information
     */
    updatePlayerInfo() {
        const player = this.gameEngine.player;
        if (!player) return;
        
        // Update player class
        if (this.elements.playerClass) {
            this.elements.playerClass.textContent = player.playerClass.toUpperCase();
        }
        
        // Update health
        const health = player.getComponent('Health');
        if (health && this.elements.healthBar && this.elements.healthText) {
            const healthPercentage = health.getHealthPercentage();
            this.elements.healthBar.style.width = `${healthPercentage * 100}%`;
            this.elements.healthText.textContent = `${Math.ceil(health.currentHealth)}/${health.maxHealth}`;
        }
    }
    
    /**
     * Update game information
     */
    updateGameInfo() {
        // Update wave number
        if (this.elements.waveNumber) {
            this.elements.waveNumber.textContent = this.gameEngine.wave;
        }
        
        // Update score
        if (this.elements.score) {
            this.elements.score.textContent = this.gameEngine.score;
        }
    }
    
    /**
     * Update chaos meter
     */
    updateChaosMeter() {
        if (this.elements.chaosFill) {
            this.elements.chaosFill.style.width = `${this.gameEngine.chaosLevel * 100}%`;
        }
    }
    
    /**
     * Update weapon information
     */
    updateWeaponInfo() {
        const player = this.gameEngine.player;
        if (!player) return;
        
        const weapon = player.getComponent('Weapon');
        if (!weapon) return;
        
        // Update weapon name
        if (this.elements.weaponName) {
            this.elements.weaponName.textContent = weapon.weaponType.toUpperCase();
        }
        
        // Update ammo count
        if (this.elements.ammoCount) {
            this.elements.ammoCount.textContent = weapon.getAmmoString();
        }
        
        // Update special ability
        if (this.elements.specialIcon && this.elements.specialCooldown) {
            // Set special ability icon based on player class
            this.setSpecialAbilityIcon(player.playerClass);
            
            // Update cooldown
            const cooldownPercentage = player.specialCooldown / player.maxSpecialCooldown;
            this.elements.specialCooldown.style.transform = `scale(${cooldownPercentage})`;
        }
    }
    
    /**
     * Set the special ability icon based on player class
     * @param {string} playerClass - Player class
     */
    setSpecialAbilityIcon(playerClass) {
        if (!this.elements.specialIcon) return;
        
        // Set icon based on player class
        switch (playerClass) {
            case 'heavy':
                this.elements.specialIcon.style.backgroundColor = '#ff5555';
                this.elements.specialIcon.innerHTML = '💢';
                break;
                
            case 'scout':
                this.elements.specialIcon.style.backgroundColor = '#55ffff';
                this.elements.specialIcon.innerHTML = '⚡';
                break;
                
            case 'engineer':
                this.elements.specialIcon.style.backgroundColor = '#55ff55';
                this.elements.specialIcon.innerHTML = '🛡️';
                break;
                
            case 'medic':
                this.elements.specialIcon.style.backgroundColor = '#55ff55';
                this.elements.specialIcon.innerHTML = '💚';
                break;
                
            default:
                this.elements.specialIcon.style.backgroundColor = '#ffffff';
                this.elements.specialIcon.innerHTML = '?';
        }
    }
    
    /**
     * Handle player created event
     * @param {Player} player - The player that was created
     */
    onPlayerCreated(player) {
        // Update HUD
        this.update();
    }
    
    /**
     * Handle player death event
     * @param {Player} player - The player that died
     * @param {object} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Update HUD
        this.update();
        
        // Show death message (could be implemented as a temporary overlay)
        this.showDeathMessage();
    }
    
    /**
     * Handle player damage event
     * @param {Player} player - The player that was damaged
     * @param {number} damage - Amount of damage
     * @param {object} source - Source of damage
     */
    onPlayerDamage(player, damage, source) {
        // Update HUD
        this.updatePlayerInfo();
        
        // Show damage indicator (could be implemented as a screen flash)
        this.showDamageIndicator();
    }
    
    /**
     * Handle player score event
     * @param {Player} player - The player that scored
     * @param {number} score - New score
     */
    onPlayerScore(player, score) {
        // Update HUD
        this.updateGameInfo();
        
        // Show score popup (could be implemented as a floating text)
        this.showScorePopup(score);
    }
    
    /**
     * Handle player level up event
     * @param {Player} player - The player that leveled up
     * @param {number} level - New level
     */
    onPlayerLevelUp(player, level) {
        // Show level up message
        this.showLevelUpMessage(level);
    }
    
    /**
     * Handle player special ability event
     * @param {Player} player - The player that used the special ability
     * @param {string} playerClass - Player class
     */
    onPlayerSpecialAbility(player, playerClass) {
        // Update HUD
        this.updateWeaponInfo();
        
        // Show special ability activation message
        this.showSpecialAbilityMessage(playerClass);
    }
    
    /**
     * Handle player special ability end event
     * @param {Player} player - The player whose special ability ended
     * @param {string} playerClass - Player class
     */
    onPlayerSpecialAbilityEnd(player, playerClass) {
        // Update HUD
        this.updateWeaponInfo();
    }
    
    /**
     * Handle wave start event
     * @param {number} wave - Wave number
     * @param {number} enemyCount - Number of enemies
     */
    onWaveStart(wave, enemyCount) {
        // Update HUD
        this.updateGameInfo();
        
        // Show wave start message
        this.showWaveStartMessage(wave);
    }
    
    /**
     * Handle wave complete event
     * @param {number} wave - Wave number
     * @param {number} score - Current score
     */
    onWaveComplete(wave, score) {
        // Update HUD
        this.updateGameInfo();
        
        // Show scoreboard
        this.showScoreboard();
    }
    
    /**
     * Handle chaos update event
     * @param {number} chaosLevel - New chaos level
     */
    onChaosUpdate(chaosLevel) {
        // Update HUD
        this.updateChaosMeter();
        
        // Show chaos level change effects
        this.updateChaosEffects(chaosLevel);
    }
    
    /**
     * Handle game start event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameStart(gameEngine) {
        // Update HUD
        this.update();
    }
    
    /**
     * Handle game over event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameOver(gameEngine) {
        // Update HUD
        this.update();
    }
    
    /**
     * Show death message
     */
    showDeathMessage() {
        // This would show a "YOU DIED" message on screen
        // For now, we'll just log it
        console.log('Player died');
    }
    
    /**
     * Show damage indicator
     */
    showDamageIndicator() {
        // This would show a red flash or other damage indicator
        // For now, we'll just log it
        console.log('Player took damage');
    }
    
    /**
     * Show score popup
     * @param {number} score - Score to show
     */
    showScorePopup(score) {
        // This would show a floating score popup
        // For now, we'll just log it
        console.log(`Score: ${score}`);
    }
    
    /**
     * Show level up message
     * @param {number} level - New level
     */
    showLevelUpMessage(level) {
        // This would show a "LEVEL UP!" message
        // For now, we'll just log it
        console.log(`Level up: ${level}`);
    }
    
    /**
     * Show special ability message
     * @param {string} playerClass - Player class
     */
    showSpecialAbilityMessage(playerClass) {
        // This would show a special ability activation message
        // For now, we'll just log it
        console.log(`${playerClass} special ability activated`);
    }
    
    /**
     * Show wave start message
     * @param {number} wave - Wave number
     */
    showWaveStartMessage(wave) {
        // This would show a "WAVE X START" message
        // For now, we'll just log it
        console.log(`Wave ${wave} started`);
    }
    
    /**
     * Show scoreboard
     */
    showScoreboard() {
        // This would show the wave complete scoreboard
        // For now, we'll just log it
        console.log('Wave complete - showing scoreboard');
    }
    
    /**
     * Update chaos effects based on chaos level
     * @param {number} chaosLevel - Chaos level (0-1)
     */
    updateChaosEffects(chaosLevel) {
        // This would update visual effects based on chaos level
        // For example, screen shake, color filters, etc.
        
        // Get chaos thresholds
        const thresholds = window.config.get('chaos.thresholds');
        
        // Apply effects based on chaos level
        if (chaosLevel >= thresholds.extreme) {
            // Extreme chaos effects
            console.log('Extreme chaos level');
        } else if (chaosLevel >= thresholds.high) {
            // High chaos effects
            console.log('High chaos level');
        } else if (chaosLevel >= thresholds.medium) {
            // Medium chaos effects
            console.log('Medium chaos level');
        } else if (chaosLevel >= thresholds.low) {
            // Low chaos effects
            console.log('Low chaos level');
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HUD;
}