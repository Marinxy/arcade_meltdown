/**
 * Arcade Meltdown - UI Module
 * Handles all UI elements and transitions
 */

class UI {
    /**
     * Create a new UI module
     */
    constructor() {
        // Initialize UI state
        this.currentScreen = 'loading';
        this.previousScreen = null;
        
        // UI elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainMenu = document.getElementById('main-menu');
        this.classSelect = document.getElementById('class-select');
        this.gameContainer = document.getElementById('game-container');
        this.pauseMenu = document.getElementById('pause-menu');
        this.gameOver = document.getElementById('game-over');
        this.scoreboard = document.getElementById('scoreboard');
        this.optionsMenu = document.getElementById('options-menu');
        this.hud = document.getElementById('hud');
    }
    
    /**
     * Initialize the UI module
     */
    init() {
        // Set initial screen visibility
        this.updateScreenVisibility();
    }
    
    /**
     * Update screen visibility based on current screen
     */
    updateScreenVisibility() {
        // Hide all screens
        this.hideAllScreens();
        
        // Show current screen
        switch (this.currentScreen) {
            case 'loading':
                this.loadingScreen?.classList.remove('hidden');
                break;
            case 'mainMenu':
                this.mainMenu?.classList.remove('hidden');
                break;
            case 'classSelect':
                this.classSelect?.classList.remove('hidden');
                break;
            case 'game':
                this.gameContainer?.classList.remove('hidden');
                this.hud?.classList.remove('hidden');
                break;
            case 'pause':
                this.pauseMenu?.classList.remove('hidden');
                break;
            case 'gameOver':
                this.gameOver?.classList.remove('hidden');
                break;
            case 'scoreboard':
                this.scoreboard?.classList.remove('hidden');
                break;
            case 'options':
                this.optionsMenu?.classList.remove('hidden');
                break;
        }
    }
    
    /**
     * Hide all screens
     */
    hideAllScreens() {
        this.loadingScreen?.classList.add('hidden');
        this.mainMenu?.classList.add('hidden');
        this.classSelect?.classList.add('hidden');
        this.gameContainer?.classList.add('hidden');
        this.pauseMenu?.classList.add('hidden');
        this.gameOver?.classList.add('hidden');
        this.scoreboard?.classList.add('hidden');
        this.optionsMenu?.classList.add('hidden');
        this.hud?.classList.add('hidden');
    }
    
    /**
     * Show loading screen
     */
    showLoadingScreen() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'loading';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        this.currentScreen = this.previousScreen || 'mainMenu';
        this.previousScreen = null;
        this.updateScreenVisibility();
    }
    
    /**
     * Show main menu
     */
    showMainMenu() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'mainMenu';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide main menu
     */
    hideMainMenu() {
        // Don't hide if we're going to options
        if (this.currentScreen !== 'options') {
            this.previousScreen = this.currentScreen;
            this.currentScreen = 'hidden';
            this.updateScreenVisibility();
        }
    }
    
    /**
     * Show class select
     */
    showClassSelect() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'classSelect';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide class select
     */
    hideClassSelect() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'hidden';
        this.updateScreenVisibility();
    }
    
    /**
     * Show game container
     */
    showGameContainer() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'game';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide game container
     */
    hideGameContainer() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'hidden';
        this.updateScreenVisibility();
    }
    
    /**
     * Show pause menu
     */
    showPauseMenu() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'pause';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide pause menu
     */
    hidePauseMenu() {
        this.currentScreen = this.previousScreen || 'game';
        this.previousScreen = null;
        this.updateScreenVisibility();
    }
    
    /**
     * Show game over screen
     */
    showGameOver() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'gameOver';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide game over screen
     */
    hideGameOver() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'hidden';
        this.updateScreenVisibility();
    }
    
    /**
     * Show scoreboard
     */
    showScoreboard() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'scoreboard';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide scoreboard
     */
    hideScoreboard() {
        this.currentScreen = this.previousScreen || 'game';
        this.previousScreen = null;
        this.updateScreenVisibility();
    }
    
    /**
     * Show options menu
     */
    showOptionsMenu() {
        this.previousScreen = this.currentScreen;
        this.currentScreen = 'options';
        this.updateScreenVisibility();
    }
    
    /**
     * Hide options menu
     */
    hideOptionsMenu() {
        this.currentScreen = this.previousScreen || 'mainMenu';
        this.previousScreen = null;
        this.updateScreenVisibility();
    }
    
    /**
     * Update HUD elements
     * @param {object} data - HUD data
     */
    updateHUD(data) {
        if (!this.hud) return;
        
        // Update health
        if (data.health !== undefined) {
            const healthFill = this.hud.querySelector('.health-fill');
            const healthValue = this.hud.querySelector('.health-value');
            
            if (healthFill) {
                healthFill.style.width = `${Math.max(0, Math.min(100, data.health))}%`;
            }
            
            if (healthValue) {
                healthValue.textContent = `${Math.max(0, data.health)}/100`;
            }
        }
        
        // Update weapon
        if (data.weapon !== undefined) {
            const weaponName = this.hud.querySelector('.hud-weapon-name');
            const weaponAmmo = this.hud.querySelector('.hud-weapon-ammo');
            
            if (weaponName) {
                weaponName.textContent = data.weapon.name || 'Assault Rifle';
            }
            
            if (weaponAmmo) {
                weaponAmmo.textContent = `${data.weapon.current || 30}/${data.weapon.total || 90}`;
            }
        }
        
        // Update wave
        if (data.wave !== undefined) {
            const waveNumber = this.hud.querySelector('#hud-wave-number');
            if (waveNumber) {
                waveNumber.textContent = data.wave;
            }
        }
        
        // Update chaos
        if (data.chaos !== undefined) {
            const chaosValue = this.hud.querySelector('#hud-chaos-value');
            if (chaosValue) {
                chaosValue.textContent = `${Math.round(data.chaos * 100)}%`;
            }
        }
        
        // Update score
        if (data.score !== undefined) {
            const scoreValue = this.hud.querySelector('.score-value');
            if (scoreValue) {
                scoreValue.textContent = data.score;
            }
        }
        
        // Update enemies
        if (data.enemies !== undefined) {
            const enemiesValue = this.hud.querySelector('.enemies-value');
            if (enemiesValue) {
                enemiesValue.textContent = data.enemies;
            }
        }
        
        // Update power-ups
        if (data.powerups !== undefined) {
            const powerupSlots = this.hud.querySelectorAll('.hud-powerup-slot');
            
            data.powerups.forEach((powerup, index) => {
                if (powerupSlots[index]) {
                    powerupSlots[index].textContent = powerup.icon || '';
                    powerupSlots[index].classList.remove('empty');
                }
            });
        }
    }
    
    /**
     * Update the UI
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the UI module
     */
    destroy() {
        // Clean up event listeners if any
    }
}

// Export for use in modules
export default UI;