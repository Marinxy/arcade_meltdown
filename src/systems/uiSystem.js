/**
 * Arcade Meltdown - UI System
 * Handles user interface elements and interactions
 */

class UISystem {
    /**
     * Create a new UI System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // UI state
        this.visible = true;
        this.currentMenu = null;
        this.menuStack = [];
        this.activeDialog = null;
        this.notifications = [];
        this.maxNotifications = 5;
        
        // UI elements
        this.elements = {
            // Main game UI
            healthBar: document.getElementById('healthBar'),
            healthText: document.getElementById('healthText'),
            playerClass: document.getElementById('playerClass'),
            waveNumber: document.getElementById('waveNumber'),
            score: document.getElementById('score'),
            chaosFill: document.getElementById('chaosFill'),
            weaponName: document.getElementById('weaponName'),
            ammoCount: document.getElementById('ammoCount'),
            specialIcon: document.getElementById('specialIcon'),
            specialCooldown: document.getElementById('specialCooldown'),
            
            // Menus
            mainMenu: document.getElementById('mainMenu'),
            pauseMenu: document.getElementById('pauseMenu'),
            gameOverMenu: document.getElementById('gameOverMenu'),
            scoreboardMenu: document.getElementById('scoreboardMenu'),
            settingsMenu: document.getElementById('settingsMenu'),
            
            // Buttons
            startButton: document.getElementById('startButton'),
            resumeButton: document.getElementById('resumeButton'),
            restartButton: document.getElementById('restartButton'),
            quitButton: document.getElementById('quitButton'),
            settingsButton: document.getElementById('settingsButton'),
            backButton: document.getElementById('backButton'),
            
            // Scoreboard
            scoreboardEntries: document.getElementById('scoreboardEntries'),
            scoreboardTitle: document.getElementById('scoreboardTitle'),
            
            // Settings
            musicVolumeSlider: document.getElementById('musicVolumeSlider'),
            sfxVolumeSlider: document.getElementById('sfxVolumeSlider'),
            masterVolumeSlider: document.getElementById('masterVolumeSlider'),
            spatialAudioToggle: document.getElementById('spatialAudioToggle'),
            
            // Notifications
            notificationContainer: document.getElementById('notificationContainer')
        };
        
        // UI configuration
        this.config = window.config.get('ui');
        
        // Performance metrics
        this.metrics = {
            uiUpdates: 0,
            renderTime: 0,
            updateTime: 0
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the UI system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up button event listeners
        this.setupButtonEventListeners();
        
        // Set up settings controls
        this.setupSettingsControls();
        
        // Initialize UI state
        this.initUIState();
        
        // Hide all menus initially
        this.hideAllMenus();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        window.eventSystem.on('game:over', (gameEngine) => {
            this.onGameOver(gameEngine);
        });
        
        window.eventSystem.on('game:paused', (gameEngine) => {
            this.onGamePaused(gameEngine);
        });
        
        window.eventSystem.on('game:resumed', (gameEngine) => {
            this.onGameResumed(gameEngine);
        });
        
        window.eventSystem.on('game:menuToggle', (gameEngine) => {
            this.onGameMenuToggle(gameEngine);
        });
        
        // Listen for wave events
        window.eventSystem.on('wave:start', (wave, enemyCount) => {
            this.onWaveStart(wave, enemyCount);
        });
        
        window.eventSystem.on('wave:complete', (wave, score) => {
            this.onWaveComplete(wave, score);
        });
        
        // Listen for player events
        window.eventSystem.on('player:created', (player) => {
            this.onPlayerCreated(player);
        });
        
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        window.eventSystem.on('player:score', (player, score) => {
            this.onPlayerScore(player, score);
        });
        
        window.eventSystem.on('player:specialAbility', (player, playerClass) => {
            this.onPlayerSpecialAbility(player, playerClass);
        });
        
        window.eventSystem.on('player:specialAbilityEnd', (player, playerClass) => {
            this.onPlayerSpecialAbilityEnd(player, playerClass);
        });
        
        // Listen for chaos events
        window.eventSystem.on('chaos:update', (chaosLevel) => {
            this.onChaosUpdate(chaosLevel);
        });
        
        // Listen for network events
        window.eventSystem.on('network:roomCreated', (roomCode) => {
            this.onNetworkRoomCreated(roomCode);
        });
        
        window.eventSystem.on('network:roomJoined', (roomCode) => {
            this.onNetworkRoomJoined(roomCode);
        });
        
        window.eventSystem.on('network:playerJoined', (connectionId) => {
            this.onNetworkPlayerJoined(connectionId);
        });
        
        window.eventSystem.on('network:playerLeft', (connectionId) => {
            this.onNetworkPlayerLeft(connectionId);
        });
        
        window.eventSystem.on('network:chatMessage', (connectionId, text) => {
            this.onNetworkChatMessage(connectionId, text);
        });
        
        // Listen for UI events
        window.eventSystem.on('ui:buttonClick', (buttonId) => {
            this.onUIButtonClick(buttonId);
        });
        
        // Listen for config changes
        window.eventSystem.on('config:change', (event) => {
            this.onConfigChange(event);
        });
    }
    
    /**
     * Set up button event listeners
     */
    setupButtonEventListeners() {
        // Start button
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', () => {
                this.handleStartButtonClick();
            });
        }
        
        // Resume button
        if (this.elements.resumeButton) {
            this.elements.resumeButton.addEventListener('click', () => {
                this.handleResumeButtonClick();
            });
        }
        
        // Restart button
        if (this.elements.restartButton) {
            this.elements.restartButton.addEventListener('click', () => {
                this.handleRestartButtonClick();
            });
        }
        
        // Quit button
        if (this.elements.quitButton) {
            this.elements.quitButton.addEventListener('click', () => {
                this.handleQuitButtonClick();
            });
        }
        
        // Settings button
        if (this.elements.settingsButton) {
            this.elements.settingsButton.addEventListener('click', () => {
                this.handleSettingsButtonClick();
            });
        }
        
        // Back button
        if (this.elements.backButton) {
            this.elements.backButton.addEventListener('click', () => {
                this.handleBackButtonClick();
            });
        }
    }
    
    /**
     * Set up settings controls
     */
    setupSettingsControls() {
        // Music volume slider
        if (this.elements.musicVolumeSlider) {
            this.elements.musicVolumeSlider.addEventListener('input', (e) => {
                this.handleMusicVolumeChange(e.target.value);
            });
        }
        
        // SFX volume slider
        if (this.elements.sfxVolumeSlider) {
            this.elements.sfxVolumeSlider.addEventListener('input', (e) => {
                this.handleSFXVolumeChange(e.target.value);
            });
        }
        
        // Master volume slider
        if (this.elements.masterVolumeSlider) {
            this.elements.masterVolumeSlider.addEventListener('input', (e) => {
                this.handleMasterVolumeChange(e.target.value);
            });
        }
        
        // Spatial audio toggle
        if (this.elements.spatialAudioToggle) {
            this.elements.spatialAudioToggle.addEventListener('change', (e) => {
                this.handleSpatialAudioToggle(e.target.checked);
            });
        }
    }
    
    /**
     * Initialize UI state
     */
    initUIState() {
        // Set initial menu
        this.currentMenu = 'main';
        
        // Show main menu
        this.showMenu('mainMenu');
        
        // Update settings controls
        this.updateSettingsControls();
    }
    
    /**
     * Update the UI system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Start performance measurement
        const startTime = performance.now();
        
        // Update game UI
        this.updateGameUI();
        
        // Update notifications
        this.updateNotifications(deltaTime);
        
        // Update active dialog
        this.updateActiveDialog(deltaTime);
        
        // End performance measurement
        const endTime = performance.now();
        this.metrics.updateTime = endTime - startTime;
        
        // Update metrics
        this.metrics.uiUpdates++;
        
        // Emit UI metrics event
        window.eventSystem.emit('ui:metrics', this.metrics);
    }
    
    /**
     * Update game UI elements
     */
    updateGameUI() {
        // Skip update if game is not in playing state
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
     * Update notifications
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateNotifications(deltaTime) {
        // Update notification timers
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            const notification = this.notifications[i];
            notification.timer -= deltaTime;
            
            // Remove expired notifications
            if (notification.timer <= 0) {
                this.removeNotification(i);
            }
        }
    }
    
    /**
     * Update active dialog
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateActiveDialog(deltaTime) {
        if (!this.activeDialog) return;
        
        // Update dialog timer
        if (this.activeDialog.autoClose) {
            this.activeDialog.timer -= deltaTime;
            
            // Close dialog if timer expired
            if (this.activeDialog.timer <= 0) {
                this.closeDialog();
            }
        }
    }
    
    /**
     * Show a menu
     * @param {string} menuId - Menu ID
     */
    showMenu(menuId) {
        // Hide current menu
        if (this.currentMenu) {
            this.hideMenu(this.currentMenu);
        }
        
        // Show new menu
        const menu = this.elements[menuId];
        if (menu) {
            menu.style.display = 'flex';
            this.currentMenu = menuId;
            
            // Add to menu stack
            if (!this.menuStack.includes(menuId)) {
                this.menuStack.push(menuId);
            }
        }
    }
    
    /**
     * Hide a menu
     * @param {string} menuId - Menu ID
     */
    hideMenu(menuId) {
        const menu = this.elements[menuId];
        if (menu) {
            menu.style.display = 'none';
        }
    }
    
    /**
     * Hide all menus
     */
    hideAllMenus() {
        for (const elementId in this.elements) {
            if (elementId.endsWith('Menu')) {
                this.hideMenu(elementId);
            }
        }
        
        // Clear menu stack
        this.menuStack = [];
        this.currentMenu = null;
    }
    
    /**
     * Show a dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Array} buttons - Dialog buttons
     * @param {boolean} autoClose - Whether to auto-close the dialog
     * @param {number} autoCloseTime - Time before auto-closing
     */
    showDialog(title, message, buttons = [], autoClose = false, autoCloseTime = 5) {
        // Create dialog element
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h2 class="dialog-title">${title}</h2>
                <p class="dialog-message">${message}</p>
                <div class="dialog-buttons"></div>
            </div>
        `;
        
        // Add buttons
        const buttonsContainer = dialog.querySelector('.dialog-buttons');
        for (const button of buttons) {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'dialog-button';
            buttonElement.textContent = button.text;
            buttonElement.addEventListener('click', () => {
                if (button.callback) {
                    button.callback();
                }
                this.closeDialog();
            });
            buttonsContainer.appendChild(buttonElement);
        }
        
        // Add close button if no buttons provided
        if (buttons.length === 0) {
            const closeButton = document.createElement('button');
            closeButton.className = 'dialog-button';
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => {
                this.closeDialog();
            });
            buttonsContainer.appendChild(closeButton);
        }
        
        // Add dialog to DOM
        document.body.appendChild(dialog);
        
        // Set active dialog
        this.activeDialog = {
            element: dialog,
            autoClose: autoClose,
            timer: autoCloseTime
        };
    }
    
    /**
     * Close active dialog
     */
    closeDialog() {
        if (!this.activeDialog) return;
        
        // Remove dialog from DOM
        document.body.removeChild(this.activeDialog.element);
        
        // Clear active dialog
        this.activeDialog = null;
    }
    
    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     * @param {number} duration - Notification duration in seconds
     */
    showNotification(message, type = 'info', duration = 3) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add notification to container
        if (this.elements.notificationContainer) {
            this.elements.notificationContainer.appendChild(notification);
        } else {
            document.body.appendChild(notification);
        }
        
        // Add to notifications array
        this.notifications.push({
            element: notification,
            type: type,
            timer: duration
        });
        
        // Remove oldest notification if limit reached
        if (this.notifications.length > this.maxNotifications) {
            this.removeNotification(0);
        }
    }
    
    /**
     * Remove a notification
     * @param {number} index - Notification index
     */
    removeNotification(index) {
        if (index < 0 || index >= this.notifications.length) return;
        
        const notification = this.notifications[index];
        
        // Remove from DOM
        if (notification.element.parentNode) {
            notification.element.parentNode.removeChild(notification.element);
        }
        
        // Remove from array
        this.notifications.splice(index, 1);
    }
    
    /**
     * Update scoreboard
     * @param {Array} scores - Array of score objects
     * @param {string} title - Scoreboard title
     */
    updateScoreboard(scores, title = 'SCOREBOARD') {
        if (!this.elements.scoreboardEntries || !this.elements.scoreboardTitle) return;
        
        // Update title
        this.elements.scoreboardTitle.textContent = title;
        
        // Clear entries
        this.elements.scoreboardEntries.innerHTML = '';
        
        // Add entries
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i];
            const entry = document.createElement('div');
            entry.className = 'scoreboard-entry';
            
            // Add rank
            const rank = document.createElement('div');
            rank.className = 'scoreboard-rank';
            rank.textContent = `#${i + 1}`;
            entry.appendChild(rank);
            
            // Add name
            const name = document.createElement('div');
            name.className = 'scoreboard-name';
            name.textContent = score.name;
            entry.appendChild(name);
            
            // Add score
            const scoreValue = document.createElement('div');
            scoreValue.className = 'scoreboard-score';
            scoreValue.textContent = score.score;
            entry.appendChild(scoreValue);
            
            // Add title if available
            if (score.title) {
                const title = document.createElement('div');
                title.className = 'scoreboard-title';
                title.textContent = score.title;
                entry.appendChild(title);
            }
            
            // Add entry to scoreboard
            this.elements.scoreboardEntries.appendChild(entry);
        }
    }
    
    /**
     * Update settings controls
     */
    updateSettingsControls() {
        // Update music volume slider
        if (this.elements.musicVolumeSlider) {
            this.elements.musicVolumeSlider.value = window.config.get('audio.musicVolume');
        }
        
        // Update SFX volume slider
        if (this.elements.sfxVolumeSlider) {
            this.elements.sfxVolumeSlider.value = window.config.get('audio.sfxVolume');
        }
        
        // Update master volume slider
        if (this.elements.masterVolumeSlider) {
            this.elements.masterVolumeSlider.value = window.config.get('audio.masterVolume');
        }
        
        // Update spatial audio toggle
        if (this.elements.spatialAudioToggle) {
            this.elements.spatialAudioToggle.checked = window.config.get('audio.spatialPanning');
        }
    }
    
    /**
     * Handle start button click
     */
    handleStartButtonClick() {
        // Emit button click event
        window.eventSystem.emit('ui:buttonClick', 'start');
        
        // Hide main menu
        this.hideMenu('mainMenu');
        
        // Start game
        this.gameEngine.startGame();
    }
    
    /**
     * Handle resume button click
     */
    handleResumeButtonClick() {
        // Emit button click event
        window.eventSystem.emit('ui:buttonClick', 'resume');
        
        // Hide pause menu
        this.hideMenu('pauseMenu');
        
        // Resume game
        this.gameEngine.resumeGame();
    }
    
    /**
     * Handle restart button click
     */
    handleRestartButtonClick() {
        // Emit button click event
        window.eventSystem.emit('ui:buttonClick', 'restart');
        
        // Hide game over menu
        this.hideMenu('gameOverMenu');
        
        // Restart game
        this.gameEngine.restartGame();
    }
    
    /**
     * Handle quit button click
     */
    handleQuitButtonClick() {
        // Emit button click event
        window.eventSystem.emit('ui:buttonClick', 'quit');
        
        // Show main menu
        this.showMenu('mainMenu');
        
        // Quit game
        this.gameEngine.quitGame();
    }
    
    /**
     * Handle settings button click
     */
    handleSettingsButtonClick() {
        // Emit button click event
        window.eventSystem.emit('ui:buttonClick', 'settings');
        
        // Show settings menu
        this.showMenu('settingsMenu');
    }
    
    /**
     * Handle back button click
     */
    handleBackButtonClick() {
        // Emit button click event
        window.eventSystem.emit('ui:buttonClick', 'back');
        
        // Go back to previous menu
        if (this.menuStack.length > 1) {
            // Remove current menu from stack
            this.menuStack.pop();
            
            // Show previous menu
            const previousMenu = this.menuStack[this.menuStack.length - 1];
            this.showMenu(previousMenu);
        }
    }
    
    /**
     * Handle music volume change
     * @param {number} value - Volume value
     */
    handleMusicVolumeChange(value) {
        // Update config
        window.config.set('audio.musicVolume', parseFloat(value));
        
        // Update audio system
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.setMusicVolume(parseFloat(value));
        }
    }
    
    /**
     * Handle SFX volume change
     * @param {number} value - Volume value
     */
    handleSFXVolumeChange(value) {
        // Update config
        window.config.set('audio.sfxVolume', parseFloat(value));
        
        // Update audio system
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.setSFXVolume(parseFloat(value));
        }
    }
    
    /**
     * Handle master volume change
     * @param {number} value - Volume value
     */
    handleMasterVolumeChange(value) {
        // Update config
        window.config.set('audio.masterVolume', parseFloat(value));
        
        // Update audio system
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.setMasterVolume(parseFloat(value));
        }
    }
    
    /**
     * Handle spatial audio toggle
     * @param {boolean} checked - Whether spatial audio is enabled
     */
    handleSpatialAudioToggle(checked) {
        // Update config
        window.config.set('audio.spatialPanning', checked);
        
        // Update audio system
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.spatialPanning = checked;
        }
    }
    
    /**
     * Handle game start event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameStart(gameEngine) {
        // Hide all menus
        this.hideAllMenus();
        
        // Show game notification
        this.showNotification('Game started!', 'success');
    }
    
    /**
     * Handle game over event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameOver(gameEngine) {
        // Show game over menu
        this.showMenu('gameOverMenu');
        
        // Show game over notification
        this.showNotification('Game over!', 'error');
    }
    
    /**
     * Handle game paused event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGamePaused(gameEngine) {
        // Show pause menu
        this.showMenu('pauseMenu');
        
        // Show pause notification
        this.showNotification('Game paused', 'info');
    }
    
    /**
     * Handle game resumed event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameResumed(gameEngine) {
        // Hide pause menu
        this.hideMenu('pauseMenu');
        
        // Show resume notification
        this.showNotification('Game resumed', 'success');
    }
    
    /**
     * Handle game menu toggle event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameMenuToggle(gameEngine) {
        // Toggle pause menu
        if (this.currentMenu === 'pauseMenu') {
            this.hideMenu('pauseMenu');
            gameEngine.resumeGame();
        } else if (gameEngine.gameState === 'playing') {
            this.showMenu('pauseMenu');
            gameEngine.pauseGame();
        }
    }
    
    /**
     * Handle wave start event
     * @param {number} wave - Wave number
     * @param {number} enemyCount - Number of enemies
     */
    onWaveStart(wave, enemyCount) {
        // Show wave start notification
        this.showNotification(`Wave ${wave} started!`, 'warning');
    }
    
    /**
     * Handle wave complete event
     * @param {number} wave - Wave number
     * @param {number} score - Current score
     */
    onWaveComplete(wave, score) {
        // Show wave complete notification
        this.showNotification(`Wave ${wave} complete!`, 'success');
        
        // Show scoreboard
        this.showScoreboard();
    }
    
    /**
     * Handle player created event
     * @param {Player} player - The player that was created
     */
    onPlayerCreated(player) {
        // Update player info
        this.updatePlayerInfo();
    }
    
    /**
     * Handle player death event
     * @param {Player} player - The player that died
     * @param {object} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Show player death notification
        this.showNotification('You died!', 'error');
    }
    
    /**
     * Handle player score event
     * @param {Player} player - The player that scored
     * @param {number} score - New score
     */
    onPlayerScore(player, score) {
        // Update score display
        if (this.elements.score) {
            this.elements.score.textContent = score;
        }
    }
    
    /**
     * Handle player special ability event
     * @param {Player} player - The player that used the special ability
     * @param {string} playerClass - Player class
     */
    onPlayerSpecialAbility(player, playerClass) {
        // Show special ability notification
        this.showNotification(`${playerClass.toUpperCase()} special ability activated!`, 'success');
    }
    
    /**
     * Handle player special ability end event
     * @param {Player} player - The player whose special ability ended
     * @param {string} playerClass - Player class
     */
    onPlayerSpecialAbilityEnd(player, playerClass) {
        // Show special ability end notification
        this.showNotification(`${playerClass.toUpperCase()} special ability ended`, 'info');
    }
    
    /**
     * Handle chaos update event
     * @param {number} chaosLevel - New chaos level
     */
    onChaosUpdate(chaosLevel) {
        // Update chaos meter
        this.updateChaosMeter();
        
        // Show chaos level notifications
        const thresholds = window.config.get('chaos.thresholds');
        
        if (chaosLevel >= thresholds.extreme) {
            this.showNotification('EXTREME CHAOS!', 'error');
        } else if (chaosLevel >= thresholds.high) {
            this.showNotification('High chaos level!', 'warning');
        } else if (chaosLevel >= thresholds.medium) {
            this.showNotification('Chaos level rising!', 'warning');
        } else if (chaosLevel >= thresholds.low) {
            this.showNotification('Chaos level increasing', 'info');
        }
    }
    
    /**
     * Handle network room created event
     * @param {string} roomCode - Room code
     */
    onNetworkRoomCreated(roomCode) {
        // Show room created notification
        this.showNotification(`Room created: ${roomCode}`, 'success');
        
        // Show room code dialog
        this.showDialog(
            'Room Created',
            `Room code: ${roomCode}\nShare this code with other players to join.`,
            [
                {
                    text: 'Copy',
                    callback: () => {
                        // Copy room code to clipboard
                        navigator.clipboard.writeText(roomCode);
                        this.showNotification('Room code copied to clipboard!', 'success');
                    }
                },
                {
                    text: 'OK',
                    callback: () => {}
                }
            ]
        );
    }
    
    /**
     * Handle network room joined event
     * @param {string} roomCode - Room code
     */
    onNetworkRoomJoined(roomCode) {
        // Show room joined notification
        this.showNotification(`Joined room: ${roomCode}`, 'success');
    }
    
    /**
     * Handle network player joined event
     * @param {string} connectionId - Connection ID
     */
    onNetworkPlayerJoined(connectionId) {
        // Show player joined notification
        this.showNotification('Player joined the game!', 'success');
    }
    
    /**
     * Handle network player left event
     * @param {string} connectionId - Connection ID
     */
    onNetworkPlayerLeft(connectionId) {
        // Show player left notification
        this.showNotification('Player left the game!', 'warning');
    }
    
    /**
     * Handle network chat message event
     * @param {string} connectionId - Connection ID
     * @param {string} text - Chat message text
     */
    onNetworkChatMessage(connectionId, text) {
        // Show chat message notification
        this.showNotification(`Chat: ${text}`, 'info');
    }
    
    /**
     * Handle UI button click event
     * @param {string} buttonId - Button ID
     */
    onUIButtonClick(buttonId) {
        // Play button click sound
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.playSound('buttonClick');
        }
    }
    
    /**
     * Handle config changes
     * @param {object} event - Config change event
     */
    onConfigChange(event) {
        const { path, value } = event;
        
        // Update settings controls if they changed
        if (path.startsWith('audio.') || path.startsWith('ui.')) {
            this.updateSettingsControls();
        }
    }
    
    /**
     * Show scoreboard
     */
    showScoreboard() {
        // Generate scoreboard data
        const scores = [
            { name: 'Player 1', score: this.gameEngine.score, title: 'Top Scorer' },
            { name: 'Player 2', score: Math.floor(this.gameEngine.score * 0.8), title: 'Close Second' },
            { name: 'Player 3', score: Math.floor(this.gameEngine.score * 0.6), title: 'Solid Effort' },
            { name: 'Player 4', score: Math.floor(this.gameEngine.score * 0.4), title: 'Try Harder' }
        ];
        
        // Update scoreboard
        this.updateScoreboard(scores, `WAVE ${this.gameEngine.wave} COMPLETE`);
        
        // Show scoreboard menu
        this.showMenu('scoreboardMenu');
    }
    
    /**
     * Get UI status
     * @returns {object} UI status
     */
    getStatus() {
        return {
            visible: this.visible,
            currentMenu: this.currentMenu,
            activeDialog: this.activeDialog !== null,
            notificationCount: this.notifications.length
        };
    }
    
    /**
     * Get UI metrics
     * @returns {object} UI metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    
    /**
     * Destroy the UI system
     */
    destroy() {
        // Hide all menus
        this.hideAllMenus();
        
        // Close active dialog
        this.closeDialog();
        
        // Remove all notifications
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            this.removeNotification(i);
        }
        
        // Clear menu stack
        this.menuStack = [];
        this.currentMenu = null;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UISystem;
}