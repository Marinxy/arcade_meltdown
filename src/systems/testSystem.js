/**
 * Arcade Meltdown - Test System
 * Handles testing of core gameplay loop with 2-4 players
 */

class TestSystem {
    /**
     * Create a new Test System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Test configuration
        this.testConfig = window.config.get('testing');
        
        // Test state
        this.testMode = false;
        this.currentTest = null;
        this.testResults = [];
        this.testTimer = 0;
        this.testDuration = 60; // 60 seconds per test
        
        // Test scenarios
        this.testScenarios = [
            {
                name: 'Single Player Basic',
                description: 'Test basic gameplay with a single player',
                playerCount: 1,
                enemyCount: 5,
                waveCount: 1,
                duration: 30
            },
            {
                name: 'Two Player Co-op',
                description: 'Test co-op gameplay with two players',
                playerCount: 2,
                enemyCount: 10,
                waveCount: 2,
                duration: 60
            },
            {
                name: 'Three Player Squad',
                description: 'Test squad gameplay with three players',
                playerCount: 3,
                enemyCount: 15,
                waveCount: 3,
                duration: 90
            },
            {
                name: 'Four Player Team',
                description: 'Test team gameplay with four players',
                playerCount: 4,
                enemyCount: 20,
                waveCount: 4,
                duration: 120
            },
            {
                name: 'Wave Progression',
                description: 'Test wave progression with increasing difficulty',
                playerCount: 2,
                enemyCount: 30,
                waveCount: 5,
                duration: 150
            },
            {
                name: 'Chaos Mechanics',
                description: 'Test chaos meter mechanics and effects',
                playerCount: 2,
                enemyCount: 25,
                waveCount: 3,
                duration: 120,
                chaosEnabled: true
            },
            {
                name: 'Weapon Variety',
                description: 'Test all weapon types and their effectiveness',
                playerCount: 4,
                enemyCount: 20,
                waveCount: 2,
                duration: 90
            },
            {
                name: 'Player Class Balance',
                description: 'Test balance between different player classes',
                playerCount: 4,
                enemyCount: 25,
                waveCount: 3,
                duration: 120
            }
        ];
        
        // Test metrics
        this.testMetrics = {
            playersCreated: 0,
            enemiesSpawned: 0,
            bulletsFired: 0,
            hitsRegistered: 0,
            damageDealt: 0,
            damageTaken: 0,
            timeToComplete: 0,
            scoreAchieved: 0,
            chaosLevel: 0,
            fps: 0,
            frameTime: 0,
            updateTime: 0
        };
        
        // Test players
        this.testPlayers = [];
        
        // Test controls
        this.testControls = [
            // Player 1 controls (WASD + Space)
            {
                playerIndex: 0,
                controls: {
                    up: 'KeyW',
                    down: 'KeyS',
                    left: 'KeyA',
                    right: 'KeyD',
                    fire: 'Space',
                    special: 'KeyQ',
                    reload: 'KeyR',
                    dash: 'KeyShift'
                }
            },
            // Player 2 controls (Arrow keys + Enter)
            {
                playerIndex: 1,
                controls: {
                    up: 'ArrowUp',
                    down: 'ArrowDown',
                    left: 'ArrowLeft',
                    right: 'ArrowRight',
                    fire: 'Enter',
                    special: 'ShiftRight',
                    reload: 'ControlRight',
                    dash: 'Slash'
                }
            },
            // Player 3 controls (IJKL + U)
            {
                playerIndex: 2,
                controls: {
                    up: 'KeyI',
                    down: 'KeyK',
                    left: 'KeyJ',
                    right: 'KeyL',
                    fire: 'KeyU',
                    special: 'KeyO',
                    reload: 'KeyP',
                    dash: 'KeyY'
                }
            },
            // Player 4 controls (Numpad)
            {
                playerIndex: 3,
                controls: {
                    up: 'Numpad8',
                    down: 'Numpad5',
                    left: 'Numpad4',
                    right: 'Numpad6',
                    fire: 'Numpad0',
                    special: 'Numpad1',
                    reload: 'Numpad2',
                    dash: 'Numpad3'
                }
            }
        ];
        
        // AI behavior for test players
        this.aiBehaviors = {
            aggressive: {
                movementChance: 0.8,
                fireChance: 0.7,
                specialChance: 0.3,
                reloadThreshold: 0.3,
                dodgeChance: 0.5
            },
            balanced: {
                movementChance: 0.6,
                fireChance: 0.5,
                specialChance: 0.2,
                reloadThreshold: 0.5,
                dodgeChance: 0.3
            },
            defensive: {
                movementChance: 0.4,
                fireChance: 0.3,
                specialChance: 0.1,
                reloadThreshold: 0.7,
                dodgeChance: 0.7
            }
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the test system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize test state
        this.initTestState();
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
        
        // Listen for enemy events
        window.eventSystem.on('enemy:spawned', (enemy) => {
            this.onEnemySpawned(enemy);
        });
        
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for weapon events
        window.eventSystem.on('weapon:fire', (weapon, owner) => {
            this.onWeaponFire(weapon, owner);
        });
        
        // Listen for bullet events
        window.eventSystem.on('bullet:hit', (bullet, entity, damage) => {
            this.onBulletHit(bullet, entity, damage);
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
        
        // Listen for input events
        window.eventSystem.on('input:keyDown', (keyCode) => {
            this.onInputKeyDown(keyCode);
        });
        
        window.eventSystem.on('input:keyUp', (keyCode) => {
            this.onInputKeyUp(keyCode);
        });
        
        // Listen for test events
        window.eventSystem.on('test:start', (testIndex) => {
            this.startTest(testIndex);
        });
        
        window.eventSystem.on('test:stop', () => {
            this.stopTest();
        });
        
        window.eventSystem.on('test:toggle', () => {
            this.toggleTestMode();
        });
    }
    
    /**
     * Initialize test state
     */
    initTestState() {
        // Reset test state
        this.testMode = false;
        this.currentTest = null;
        this.testResults = [];
        this.testTimer = 0;
        
        // Reset test metrics
        this.resetTestMetrics();
        
        // Clear test players
        this.testPlayers = [];
    }
    
    /**
     * Reset test metrics
     */
    resetTestMetrics() {
        this.testMetrics = {
            playersCreated: 0,
            enemiesSpawned: 0,
            bulletsFired: 0,
            hitsRegistered: 0,
            damageDealt: 0,
            damageTaken: 0,
            timeToComplete: 0,
            scoreAchieved: 0,
            chaosLevel: 0,
            fps: 0,
            frameTime: 0,
            updateTime: 0
        };
    }
    
    /**
     * Toggle test mode
     */
    toggleTestMode() {
        this.testMode = !this.testMode;
        
        if (this.testMode) {
            // Show test menu
            this.showTestMenu();
        } else {
            // Hide test menu
            this.hideTestMenu();
            
            // Stop current test
            this.stopTest();
        }
    }
    
    /**
     * Show test menu
     */
    showTestMenu() {
        // Create test menu element
        const testMenu = document.createElement('div');
        testMenu.id = 'testMenu';
        testMenu.className = 'test-menu';
        testMenu.innerHTML = `
            <div class="test-menu-content">
                <h2>Test Scenarios</h2>
                <div class="test-scenarios"></div>
                <div class="test-controls">
                    <button id="startTestButton">Start Test</button>
                    <button id="stopTestButton">Stop Test</button>
                    <button id="closeTestMenuButton">Close</button>
                </div>
                <div class="test-results">
                    <h3>Test Results</h3>
                    <div class="test-results-content"></div>
                </div>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(testMenu);
        
        // Populate test scenarios
        const scenariosContainer = testMenu.querySelector('.test-scenarios');
        for (let i = 0; i < this.testScenarios.length; i++) {
            const scenario = this.testScenarios[i];
            const scenarioElement = document.createElement('div');
            scenarioElement.className = 'test-scenario';
            scenarioElement.innerHTML = `
                <input type="radio" name="testScenario" value="${i}" id="scenario${i}">
                <label for="scenario${i}">
                    <strong>${scenario.name}</strong>
                    <p>${scenario.description}</p>
                    <small>Players: ${scenario.playerCount}, Enemies: ${scenario.enemyCount}, Waves: ${scenario.waveCount}, Duration: ${scenario.duration}s</small>
                </label>
            `;
            scenariosContainer.appendChild(scenarioElement);
        }
        
        // Select first scenario by default
        const firstScenario = testMenu.querySelector('input[type="radio"]');
        if (firstScenario) {
            firstScenario.checked = true;
        }
        
        // Set up button event listeners
        const startButton = testMenu.querySelector('#startTestButton');
        const stopButton = testMenu.querySelector('#stopTestButton');
        const closeButton = testMenu.querySelector('#closeTestMenuButton');
        
        startButton.addEventListener('click', () => {
            const selectedScenario = testMenu.querySelector('input[name="testScenario"]:checked');
            if (selectedScenario) {
                const testIndex = parseInt(selectedScenario.value);
                this.startTest(testIndex);
            }
        });
        
        stopButton.addEventListener('click', () => {
            this.stopTest();
        });
        
        closeButton.addEventListener('click', () => {
            this.toggleTestMode();
        });
    }
    
    /**
     * Hide test menu
     */
    hideTestMenu() {
        const testMenu = document.getElementById('testMenu');
        if (testMenu) {
            document.body.removeChild(testMenu);
        }
    }
    
    /**
     * Start a test
     * @param {number} testIndex - Test scenario index
     */
    startTest(testIndex) {
        // Validate test index
        if (testIndex < 0 || testIndex >= this.testScenarios.length) {
            console.error(`Invalid test index: ${testIndex}`);
            return;
        }
        
        // Get test scenario
        const scenario = this.testScenarios[testIndex];
        
        // Set current test
        this.currentTest = {
            index: testIndex,
            scenario: scenario,
            startTime: Date.now(),
            completed: false
        };
        
        // Reset test metrics
        this.resetTestMetrics();
        
        // Set test duration
        this.testDuration = scenario.duration;
        this.testTimer = 0;
        
        // Start game if not already started
        if (this.gameEngine.gameState !== 'playing') {
            this.gameEngine.startGame();
        }
        
        // Create test players
        this.createTestPlayers(scenario.playerCount);
        
        // Set up wave system for test
        this.setupWaveSystem(scenario);
        
        // Enable chaos if specified
        if (scenario.chaosEnabled) {
            this.gameEngine.chaosSystem.enabled = true;
        }
        
        // Emit test start event
        window.eventSystem.emit('test:started', testIndex);
        
        // Show test started notification
        this.showTestNotification(`Test started: ${scenario.name}`, 'info');
    }
    
    /**
     * Stop current test
     */
    stopTest() {
        if (!this.currentTest) return;
        
        // Calculate test metrics
        this.calculateTestMetrics();
        
        // Mark test as completed
        this.currentTest.completed = true;
        this.currentTest.endTime = Date.now();
        this.currentTest.metrics = { ...this.testMetrics };
        
        // Add to test results
        this.testResults.push({
            test: this.currentTest.scenario.name,
            index: this.currentTest.index,
            startTime: this.currentTest.startTime,
            endTime: this.currentTest.endTime,
            metrics: { ...this.testMetrics }
        });
        
        // Emit test complete event
        window.eventSystem.emit('test:completed', this.currentTest);
        
        // Show test completed notification
        this.showTestNotification(`Test completed: ${this.currentTest.scenario.name}`, 'success');
        
        // Update test results display
        this.updateTestResultsDisplay();
        
        // Clear current test
        this.currentTest = null;
    }
    
    /**
     * Create test players
     * @param {number} playerCount - Number of players to create
     */
    createTestPlayers(playerCount) {
        // Clear existing test players
        this.testPlayers = [];
        
        // Create players
        for (let i = 0; i < playerCount; i++) {
            // Calculate spawn position
            const angle = (i / playerCount) * Math.PI * 2;
            const distance = 100;
            const x = this.gameEngine.arena.width / 2 + Math.cos(angle) * distance;
            const y = this.gameEngine.arena.height / 2 + Math.sin(angle) * distance;
            
            // Determine player class
            const playerClasses = ['heavy', 'scout', 'engineer', 'medic'];
            const playerClass = playerClasses[i % playerClasses.length];
            
            // Import Player class (circular dependency workaround)
            const Player = require('../entities/player.js').default || window.Player;
            
            // Create player
            const player = new Player(x, y, playerClass);
            player.isTestPlayer = true;
            player.testPlayerIndex = i;
            
            // Set up AI behavior
            player.aiBehavior = this.getRandomAIBehavior();
            
            // Add to game engine
            this.gameEngine.addEntity(player);
            
            // Add to test players
            this.testPlayers.push(player);
            
            // Update metrics
            this.testMetrics.playersCreated++;
        }
    }
    
    /**
     * Get a random AI behavior
     * @returns {string} AI behavior type
     */
    getRandomAIBehavior() {
        const behaviors = Object.keys(this.aiBehaviors);
        return behaviors[Math.floor(Math.random() * behaviors.length)];
    }
    
    /**
     * Set up wave system for test
     * @param {object} scenario - Test scenario
     */
    setupWaveSystem(scenario) {
        // Set wave count
        this.gameEngine.waveSystem.maxWaves = scenario.waveCount;
        
        // Set enemy count
        this.gameEngine.waveSystem.totalEnemies = scenario.enemyCount;
        
        // Start first wave
        this.gameEngine.waveSystem.startWave(1);
    }
    
    /**
     * Calculate test metrics
     */
    calculateTestMetrics() {
        // Calculate time to complete
        if (this.currentTest) {
            this.testMetrics.timeToComplete = (Date.now() - this.currentTest.startTime) / 1000;
        }
        
        // Get current score
        this.testMetrics.scoreAchieved = this.gameEngine.score;
        
        // Get current chaos level
        this.testMetrics.chaosLevel = this.gameEngine.chaosLevel;
    }
    
    /**
     * Update test results display
     */
    updateTestResultsDisplay() {
        const testMenu = document.getElementById('testMenu');
        if (!testMenu) return;
        
        const resultsContainer = testMenu.querySelector('.test-results-content');
        if (!resultsContainer) return;
        
        // Clear results
        resultsContainer.innerHTML = '';
        
        // Add results
        for (const result of this.testResults) {
            const resultElement = document.createElement('div');
            resultElement.className = 'test-result';
            resultElement.innerHTML = `
                <h4>${result.test}</h4>
                <p>Time: ${result.metrics.timeToComplete.toFixed(2)}s</p>
                <p>Score: ${result.metrics.scoreAchieved}</p>
                <p>Enemies: ${result.metrics.enemiesSpawned}</p>
                <p>Bullets: ${result.metrics.bulletsFired}</p>
                <p>Accuracy: ${result.metrics.bulletsFired > 0 ? 
                    ((result.metrics.hitsRegistered / result.metrics.bulletsFired) * 100).toFixed(1) : 0}%</p>
                <p>DPS: ${(result.metrics.damageDealt / result.metrics.timeToComplete).toFixed(1)}</p>
            `;
            resultsContainer.appendChild(resultElement);
        }
    }
    
    /**
     * Update the test system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Skip update if not in test mode
        if (!this.testMode || !this.currentTest) return;
        
        // Start performance measurement
        const startTime = performance.now();
        
        // Update test timer
        this.testTimer += deltaTime;
        
        // Update test metrics
        this.testMetrics.fps = 1 / deltaTime;
        this.testMetrics.frameTime = deltaTime * 1000;
        
        // Update test players
        this.updateTestPlayers(deltaTime);
        
        // Check if test should end
        if (this.testTimer >= this.testDuration || this.gameEngine.gameState === 'gameOver') {
            this.stopTest();
        }
        
        // End performance measurement
        const endTime = performance.now();
        this.testMetrics.updateTime = endTime - startTime;
    }
    
    /**
     * Update test players
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateTestPlayers(deltaTime) {
        for (const player of this.testPlayers) {
            // Skip if player is not active
            if (!player.isActive()) continue;
            
            // Get AI behavior
            const behavior = this.aiBehaviors[player.aiBehavior];
            
            // Get input component
            const input = player.getComponent('Input');
            if (!input) continue;
            
            // Reset input
            input.reset();
            
            // Get transform component
            const transform = player.getComponent('Transform');
            if (!transform) continue;
            
            // Get weapon component
            const weapon = player.getComponent('Weapon');
            if (!weapon) continue;
            
            // AI decision making
            if (Math.random() < behavior.movementChance) {
                // Random movement
                const moveX = (Math.random() - 0.5) * 2;
                const moveY = (Math.random() - 0.5) * 2;
                
                // Apply movement
                input.up = moveY < -0.5;
                input.down = moveY > 0.5;
                input.left = moveX < -0.5;
                input.right = moveX > 0.5;
            }
            
            // Find nearest enemy
            const nearestEnemy = this.findNearestEnemy(transform);
            
            if (nearestEnemy) {
                // Calculate direction to enemy
                const dx = nearestEnemy.getComponent('Transform').x - transform.x;
                const dy = nearestEnemy.getComponent('Transform').y - transform.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Aim at enemy
                const angle = Math.atan2(dy, dx);
                transform.rotation = angle;
                
                // Fire at enemy
                if (Math.random() < behavior.fireChance && weapon.canFire()) {
                    input.fire = true;
                }
                
                // Use special ability
                if (Math.random() < behavior.specialChance && player.specialCooldown <= 0) {
                    input.special = true;
                }
                
                // Reload if needed
                if (weapon.getAmmoPercentage() < behavior.reloadThreshold && !weapon.isReloading) {
                    input.reload = true;
                }
                
                // Dodge if enemy is close and firing
                if (distance < 200 && Math.random() < behavior.dodgeChance && player.dashCooldown <= 0) {
                    input.dash = true;
                }
            }
        }
    }
    
    /**
     * Find nearest enemy to a position
     * @param {Transform} transform - Transform component
     * @returns {Entity|null} Nearest enemy or null
     */
    findNearestEnemy(transform) {
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        // Get all enemies
        const enemies = this.gameEngine.getEntitiesByTag('enemy');
        
        // Find nearest enemy
        for (const enemy of enemies) {
            // Skip if enemy is not active
            if (!enemy.isActive()) continue;
            
            // Get enemy transform
            const enemyTransform = enemy.getComponent('Transform');
            if (!enemyTransform) continue;
            
            // Calculate distance
            const dx = enemyTransform.x - transform.x;
            const dy = enemyTransform.y - transform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if this is the nearest enemy
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }
    
    /**
     * Show test notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    showTestNotification(message, type = 'info') {
        // Show notification through UI system
        if (this.gameEngine.uiSystem) {
            this.gameEngine.uiSystem.showNotification(`[TEST] ${message}`, type);
        }
    }
    
    /**
     * Handle game start event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameStart(gameEngine) {
        // No specific action for test system
    }
    
    /**
     * Handle game over event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameOver(gameEngine) {
        // Stop test if game is over
        if (this.currentTest) {
            this.stopTest();
        }
    }
    
    /**
     * Handle player created event
     * @param {Player} player - The player that was created
     */
    onPlayerCreated(player) {
        // Update metrics if this is a test player
        if (player.isTestPlayer) {
            this.testMetrics.playersCreated++;
        }
    }
    
    /**
     * Handle player death event
     * @param {Player} player - The player that died
     * @param {object} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Show test notification
        if (player.isTestPlayer) {
            this.showTestNotification(`Test player ${player.testPlayerIndex + 1} died`, 'warning');
        }
    }
    
    /**
     * Handle player score event
     * @param {Player} player - The player that scored
     * @param {number} score - New score
     */
    onPlayerScore(player, score) {
        // Update metrics
        this.testMetrics.scoreAchieved = score;
    }
    
    /**
     * Handle enemy spawned event
     * @param {Enemy} enemy - The enemy that was spawned
     */
    onEnemySpawned(enemy) {
        // Update metrics
        this.testMetrics.enemiesSpawned++;
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - The enemy that died
     * @param {object} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // No specific action for test system
    }
    
    /**
     * Handle weapon fire event
     * @param {Weapon} weapon - The weapon that fired
     * @param {Entity} owner - Weapon owner
     */
    onWeaponFire(weapon, owner) {
        // Update metrics if this is a test player
        if (owner.isTestPlayer) {
            this.testMetrics.bulletsFired++;
        }
    }
    
    /**
     * Handle bullet hit event
     * @param {Bullet} bullet - The bullet that hit
     * @param {Entity} entity - Entity that was hit
     * @param {number} damage - Amount of damage
     */
    onBulletHit(bullet, entity, damage) {
        // Update metrics
        this.testMetrics.hitsRegistered++;
        
        // Update damage metrics
        if (bullet.owner && bullet.owner.isTestPlayer) {
            this.testMetrics.damageDealt += damage;
        }
        
        if (entity.hasTag('player') && entity.isTestPlayer) {
            this.testMetrics.damageTaken += damage;
        }
    }
    
    /**
     * Handle wave start event
     * @param {number} wave - Wave number
     * @param {number} enemyCount - Number of enemies
     */
    onWaveStart(wave, enemyCount) {
        // Show test notification
        this.showTestNotification(`Wave ${wave} started`, 'info');
    }
    
    /**
     * Handle wave complete event
     * @param {number} wave - Wave number
     * @param {number} score - Current score
     */
    onWaveComplete(wave, score) {
        // Show test notification
        this.showTestNotification(`Wave ${wave} completed`, 'success');
    }
    
    /**
     * Handle chaos update event
     * @param {number} chaosLevel - New chaos level
     */
    onChaosUpdate(chaosLevel) {
        // Update metrics
        this.testMetrics.chaosLevel = chaosLevel;
    }
    
    /**
     * Handle input key down event
     * @param {string} keyCode - Key code
     */
    onInputKeyDown(keyCode) {
        // Skip if not in test mode
        if (!this.testMode) return;
        
        // Handle test controls
        if (keyCode === 'F1') {
            this.toggleTestMode();
        } else if (keyCode === 'F2') {
            // Start first test
            this.startTest(0);
        } else if (keyCode === 'F3') {
            // Stop current test
            this.stopTest();
        }
    }
    
    /**
     * Handle input key up event
     * @param {string} keyCode - Key code
     */
    onInputKeyUp(keyCode) {
        // No specific action for test system
    }
    
    /**
     * Get test status
     * @returns {object} Test status
     */
    getStatus() {
        return {
            testMode: this.testMode,
            currentTest: this.currentTest ? {
                index: this.currentTest.index,
                name: this.currentTest.scenario.name,
                progress: this.testTimer / this.testDuration,
                timeRemaining: this.testDuration - this.testTimer
            } : null,
            testCount: this.testResults.length
        };
    }
    
    /**
     * Get test metrics
     * @returns {object} Test metrics
     */
    getMetrics() {
        return { ...this.testMetrics };
    }
    
    /**
     * Get test results
     * @returns {Array} Test results
     */
    getTestResults() {
        return [...this.testResults];
    }
    
    /**
     * Destroy the test system
     */
    destroy() {
        // Stop current test
        this.stopTest();
        
        // Hide test menu
        this.hideTestMenu();
        
        // Clear test players
        this.testPlayers = [];
        
        // Clear test results
        this.testResults = [];
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestSystem;
}