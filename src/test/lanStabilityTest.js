/**
 * Arcade Meltdown - LAN Stability Test Suite
 * Tests network stability and performance with 6-8 players
 */

class LANStabilityTest {
    /**
     * Create a new LAN Stability Test
     * @param {GameEngine} gameEngine - Game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Test properties
        this.running = false;
        this.testDuration = 300; // 5 minutes in seconds
        this.testTimer = 0;
        this.testResults = {
            startTime: 0,
            endTime: 0,
            players: [],
            networkStats: {
                totalPacketsSent: 0,
                totalPacketsReceived: 0,
                totalPacketsLost: 0,
                averageLatency: 0,
                maxLatency: 0,
                minLatency: Infinity,
                latencySamples: [],
                bandwidthUsage: 0,
                connectionStability: 0
            },
            performanceStats: {
                averageFPS: 0,
                minFPS: Infinity,
                maxFPS: 0,
                fpsSamples: [],
                frameTimeSamples: [],
                averageFrameTime: 0,
                maxFrameTime: 0,
                droppedFrames: 0
            },
            gameplayStats: {
                totalKills: 0,
                totalDeaths: 0,
                totalDamage: 0,
                totalRevives: 0,
                totalPowerups: 0,
                wavesCompleted: 0,
                bossesDefeated: 0,
                maxChaosLevel: 0,
                averageChaosLevel: 0,
                chaosLevelSamples: []
            },
            errorStats: {
                totalErrors: 0,
                networkErrors: 0,
                gameErrors: 0,
                renderingErrors: 0,
                errorLog: []
            }
        };
        
        // Test scenarios
        this.testScenarios = [
            {
                name: "Basic Movement Test",
                description: "Players move around the arena without combat",
                duration: 60,
                setup: this.setupBasicMovementTest.bind(this),
                run: this.runBasicMovementTest.bind(this),
                cleanup: this.cleanupBasicMovementTest.bind(this)
            },
            {
                name: "Combat Stress Test",
                description: "Intense combat with all weapons and abilities",
                duration: 120,
                setup: this.setupCombatStressTest.bind(this),
                run: this.runCombatStressTest.bind(this),
                cleanup: this.cleanupCombatStressTest.bind(this)
            },
            {
                name: "Chaos Meter Test",
                description: "Push chaos meter to maximum and maintain",
                duration: 90,
                setup: this.setupChaosMeterTest.bind(this),
                run: this.runChaosMeterTest.bind(this),
                cleanup: this.cleanupChaosMeterTest.bind(this)
            },
            {
                name: "Boss Battle Test",
                description: "Multiple boss battles with all players",
                duration: 120,
                setup: this.setupBossBattleTest.bind(this),
                run: this.runBossBattleTest.bind(this),
                cleanup: this.cleanupBossBattleTest.bind(this)
            },
            {
                name: "Connection Stability Test",
                description: "Simulate network issues and test recovery",
                duration: 90,
                setup: this.setupConnectionStabilityTest.bind(this),
                run: this.runConnectionStabilityTest.bind(this),
                cleanup: this.cleanupConnectionStabilityTest.bind(this)
            }
        ];
        
        // Current test scenario
        this.currentScenario = null;
        this.scenarioTimer = 0;
        
        // Test bots
        this.testBots = [];
        this.botCount = 6; // Number of test bots
        
        // Network simulation
        this.networkSimulation = {
            enabled: false,
            packetLoss: 0, // 0-1
            latency: 0, // ms
            jitter: 0, // ms
            bandwidth: 0 // kbps
        };
        
        // Performance monitoring
        this.performanceMonitor = {
            enabled: true,
            sampleInterval: 1000, // ms
            lastSampleTime: 0
        };
        
        // Initialize test
        this.init();
    }
    
    /**
     * Initialize the LAN stability test
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Create test bots
        this.createTestBots();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for network events
        window.eventSystem.on('network:packetSent', (packet) => {
            this.onPacketSent(packet);
        });
        
        window.eventSystem.on('network:packetReceived', (packet) => {
            this.onPacketReceived(packet);
        });
        
        window.eventSystem.on('network:packetLost', (packet) => {
            this.onPacketLost(packet);
        });
        
        window.eventSystem.on('network:latency', (latency) => {
            this.onLatency(latency);
        });
        
        // Listen for player events
        window.eventSystem.on('player:join', (player) => {
            this.onPlayerJoin(player);
        });
        
        window.eventSystem.on('player:leave', (player) => {
            this.onPlayerLeave(player);
        });
        
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        // Listen for game events
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        window.eventSystem.on('boss:death', (boss, source) => {
            this.onBossDeath(boss, source);
        });
        
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
        });
        
        // Listen for chaos meter events
        window.eventSystem.on('chaos:increase', (chaosLevel, amount) => {
            this.onChaosIncrease(chaosLevel, amount);
        });
        
        // Listen for error events
        window.eventSystem.on('error', (error) => {
            this.onError(error);
        });
    }
    
    /**
     * Create test bots
     */
    createTestBots() {
        // Get networking system
        const networking = this.gameEngine.getSystem('networking');
        if (!networking) return;
        
        // Create test bots
        for (let i = 0; i < this.botCount; i++) {
            // Create bot player
            const bot = {
                id: `bot_${i}`,
                name: `Test Bot ${i + 1}`,
                isBot: true,
                class: this.getRandomPlayerClass(),
                position: this.getRandomPosition(),
                targetPosition: null,
                moveTimer: 0,
                moveInterval: 2 + Math.random() * 3, // seconds
                shootTimer: 0,
                shootInterval: 1 + Math.random() * 2, // seconds
                abilityTimer: 0,
                abilityInterval: 5 + Math.random() * 10, // seconds
                stats: {
                    kills: 0,
                    deaths: 0,
                    damage: 0,
                    shots: 0,
                    hits: 0
                }
            };
            
            // Add bot to test bots array
            this.testBots.push(bot);
            
            // Add bot to game engine
            this.addBotToGame(bot);
        }
    }
    
    /**
     * Get random player class
     * @returns {string} Random player class
     */
    getRandomPlayerClass() {
        const classes = ['assault', 'heavy', 'scout', 'engineer', 'medic'];
        return classes[Math.floor(Math.random() * classes.length)];
    }
    
    /**
     * Get random position
     * @returns {object} Random position
     */
    getRandomPosition() {
        return {
            x: Math.random() * this.gameEngine.arena.width,
            y: Math.random() * this.gameEngine.arena.height
        };
    }
    
    /**
     * Add bot to game
     * @param {object} bot - Bot to add
     */
    addBotToGame(bot) {
        // Create bot player entity
        const Player = require('../entities/player.js').default || window.Player;
        const player = new Player(bot.position.x, bot.position.y, bot.class);
        
        // Set bot properties
        player.id = bot.id;
        player.name = bot.name;
        player.isBot = true;
        
        // Add player to game engine
        this.gameEngine.addEntity(player);
        
        // Store player reference
        bot.entity = player;
    }
    
    /**
     * Start LAN stability test
     * @param {number} scenarioIndex - Index of test scenario to run (-1 for all scenarios)
     */
    startTest(scenarioIndex = -1) {
        // Check if test is already running
        if (this.running) return;
        
        // Reset test results
        this.resetTestResults();
        
        // Set running state
        this.running = true;
        
        // Set start time
        this.testResults.startTime = Date.now();
        
        // Set current scenario
        if (scenarioIndex >= 0 && scenarioIndex < this.testScenarios.length) {
            this.currentScenario = this.testScenarios[scenarioIndex];
        } else {
            this.currentScenario = this.testScenarios[0];
        }
        
        // Setup scenario
        if (this.currentScenario.setup) {
            this.currentScenario.setup();
        }
        
        // Set scenario timer
        this.scenarioTimer = 0;
        
        // Emit test start event
        window.eventSystem.emit('lanStabilityTest:start', this.currentScenario);
        
        console.log(`LAN Stability Test started: ${this.currentScenario.name}`);
    }
    
    /**
     * Stop LAN stability test
     */
    stopTest() {
        // Check if test is running
        if (!this.running) return;
        
        // Set running state
        this.running = false;
        
        // Set end time
        this.testResults.endTime = Date.now();
        
        // Cleanup scenario
        if (this.currentScenario && this.currentScenario.cleanup) {
            this.currentScenario.cleanup();
        }
        
        // Process test results
        this.processTestResults();
        
        // Emit test complete event
        window.eventSystem.emit('lanStabilityTest:complete', this.testResults);
        
        console.log(`LAN Stability Test completed: ${this.currentScenario.name}`);
        console.log('Test Results:', this.testResults);
    }
    
    /**
     * Reset test results
     */
    resetTestResults() {
        this.testResults = {
            startTime: 0,
            endTime: 0,
            players: [],
            networkStats: {
                totalPacketsSent: 0,
                totalPacketsReceived: 0,
                totalPacketsLost: 0,
                averageLatency: 0,
                maxLatency: 0,
                minLatency: Infinity,
                latencySamples: [],
                bandwidthUsage: 0,
                connectionStability: 0
            },
            performanceStats: {
                averageFPS: 0,
                minFPS: Infinity,
                maxFPS: 0,
                fpsSamples: [],
                frameTimeSamples: [],
                averageFrameTime: 0,
                maxFrameTime: 0,
                droppedFrames: 0
            },
            gameplayStats: {
                totalKills: 0,
                totalDeaths: 0,
                totalDamage: 0,
                totalRevives: 0,
                totalPowerups: 0,
                wavesCompleted: 0,
                bossesDefeated: 0,
                maxChaosLevel: 0,
                averageChaosLevel: 0,
                chaosLevelSamples: []
            },
            errorStats: {
                totalErrors: 0,
                networkErrors: 0,
                gameErrors: 0,
                renderingErrors: 0,
                errorLog: []
            }
        };
    }
    
    /**
     * Process test results
     */
    processTestResults() {
        // Calculate network stats
        const networkStats = this.testResults.networkStats;
        
        // Calculate average latency
        if (networkStats.latencySamples.length > 0) {
            const sum = networkStats.latencySamples.reduce((a, b) => a + b, 0);
            networkStats.averageLatency = sum / networkStats.latencySamples.length;
        }
        
        // Calculate packet loss percentage
        const totalPackets = networkStats.totalPacketsSent + networkStats.totalPacketsReceived;
        if (totalPackets > 0) {
            networkStats.packetLossPercentage = (networkStats.totalPacketsLost / totalPackets) * 100;
        }
        
        // Calculate connection stability (inverse of latency variance)
        if (networkStats.latencySamples.length > 1) {
            const mean = networkStats.averageLatency;
            const variance = networkStats.latencySamples.reduce((sum, latency) => {
                return sum + Math.pow(latency - mean, 2);
            }, 0) / networkStats.latencySamples.length;
            
            // Lower variance = higher stability
            networkStats.connectionStability = Math.max(0, 100 - variance);
        }
        
        // Calculate performance stats
        const performanceStats = this.testResults.performanceStats;
        
        // Calculate average FPS
        if (performanceStats.fpsSamples.length > 0) {
            const sum = performanceStats.fpsSamples.reduce((a, b) => a + b, 0);
            performanceStats.averageFPS = sum / performanceStats.fpsSamples.length;
        }
        
        // Calculate average frame time
        if (performanceStats.frameTimeSamples.length > 0) {
            const sum = performanceStats.frameTimeSamples.reduce((a, b) => a + b, 0);
            performanceStats.averageFrameTime = sum / performanceStats.frameTimeSamples.length;
        }
        
        // Calculate gameplay stats
        const gameplayStats = this.testResults.gameplayStats;
        
        // Calculate average chaos level
        if (gameplayStats.chaosLevelSamples.length > 0) {
            const sum = gameplayStats.chaosLevelSamples.reduce((a, b) => a + b, 0);
            gameplayStats.averageChaosLevel = sum / gameplayStats.chaosLevelSamples.length;
        }
    }
    
    /**
     * Update LAN stability test
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Skip if not running
        if (!this.running) return;
        
        // Update test timer
        this.testTimer += deltaTime;
        
        // Update scenario timer
        this.scenarioTimer += deltaTime;
        
        // Check if test duration exceeded
        if (this.testTimer >= this.testDuration) {
            this.stopTest();
            return;
        }
        
        // Check if scenario duration exceeded
        if (this.scenarioTimer >= this.currentScenario.duration) {
            // Move to next scenario
            const currentIndex = this.testScenarios.indexOf(this.currentScenario);
            const nextIndex = (currentIndex + 1) % this.testScenarios.length;
            
            // Cleanup current scenario
            if (this.currentScenario.cleanup) {
                this.currentScenario.cleanup();
            }
            
            // Set next scenario
            this.currentScenario = this.testScenarios[nextIndex];
            
            // Setup next scenario
            if (this.currentScenario.setup) {
                this.currentScenario.setup();
            }
            
            // Reset scenario timer
            this.scenarioTimer = 0;
            
            // Emit scenario change event
            window.eventSystem.emit('lanStabilityTest:scenarioChange', this.currentScenario);
            
            console.log(`LAN Stability Test scenario changed: ${this.currentScenario.name}`);
        }
        
        // Run current scenario
        if (this.currentScenario.run) {
            this.currentScenario.run(deltaTime);
        }
        
        // Update test bots
        this.updateTestBots(deltaTime);
        
        // Update performance monitoring
        this.updatePerformanceMonitoring(deltaTime);
        
        // Update network simulation
        this.updateNetworkSimulation(deltaTime);
    }
    
    /**
     * Update test bots
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateTestBots(deltaTime) {
        // Update each bot
        for (const bot of this.testBots) {
            // Skip if bot has no entity
            if (!bot.entity) continue;
            
            // Update bot timers
            bot.moveTimer += deltaTime;
            bot.shootTimer += deltaTime;
            bot.abilityTimer += deltaTime;
            
            // Get bot transform
            const transform = bot.entity.getComponent('Transform');
            if (!transform) continue;
            
            // Get bot physics
            const physics = bot.entity.getComponent('Physics');
            if (!physics) continue;
            
            // Get bot weapon
            const weapon = bot.entity.getComponent('Weapon');
            if (!weapon) continue;
            
            // Reset input
            bot.entity.input.reset();
            
            // Move bot
            if (bot.moveTimer >= bot.moveInterval) {
                // Set new target position
                bot.targetPosition = this.getRandomPosition();
                bot.moveTimer = 0;
                bot.moveInterval = 2 + Math.random() * 3;
            }
            
            // Move toward target position
            if (bot.targetPosition) {
                const dx = bot.targetPosition.x - transform.x;
                const dy = bot.targetPosition.y - transform.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    const direction = Math.atan2(dy, dx);
                    bot.entity.input.up = Math.cos(direction) > 0;
                    bot.entity.input.down = Math.cos(direction) < 0;
                    bot.entity.input.left = Math.sin(direction) < 0;
                    bot.entity.input.right = Math.sin(direction) > 0;
                }
            }
            
            // Face random direction
            transform.rotation = Math.random() * Math.PI * 2;
            
            // Shoot weapon
            if (bot.shootTimer >= bot.shootInterval) {
                bot.entity.input.shoot = true;
                bot.shootTimer = 0;
                bot.shootInterval = 1 + Math.random() * 2;
                bot.stats.shots++;
            }
            
            // Use ability
            if (bot.abilityTimer >= bot.abilityInterval) {
                // Use random ability
                const abilities = ['ability1', 'ability2'];
                const ability = abilities[Math.floor(Math.random() * abilities.length)];
                bot.entity.input[ability] = true;
                bot.abilityTimer = 0;
                bot.abilityInterval = 5 + Math.random() * 10;
            }
        }
    }
    
    /**
     * Update performance monitoring
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updatePerformanceMonitoring(deltaTime) {
        // Skip if not enabled
        if (!this.performanceMonitor.enabled) return;
        
        // Get current time
        const currentTime = Date.now();
        
        // Check if should sample
        if (currentTime - this.performanceMonitor.lastSampleTime >= this.performanceMonitor.sampleInterval) {
            // Get performance stats
            const performanceStats = this.testResults.performanceStats;
            
            // Get FPS
            const fps = this.gameEngine.getFPS();
            performanceStats.fpsSamples.push(fps);
            
            // Update min/max FPS
            performanceStats.minFPS = Math.min(performanceStats.minFPS, fps);
            performanceStats.maxFPS = Math.max(performanceStats.maxFPS, fps);
            
            // Get frame time
            const frameTime = this.gameEngine.getFrameTime();
            performanceStats.frameTimeSamples.push(frameTime);
            
            // Update max frame time
            performanceStats.maxFrameTime = Math.max(performanceStats.maxFrameTime, frameTime);
            
            // Count dropped frames (frame time > 100ms)
            if (frameTime > 100) {
                performanceStats.droppedFrames++;
            }
            
            // Update last sample time
            this.performanceMonitor.lastSampleTime = currentTime;
        }
    }
    
    /**
     * Update network simulation
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateNetworkSimulation(deltaTime) {
        // Skip if not enabled
        if (!this.networkSimulation.enabled) return;
        
        // Get networking system
        const networking = this.gameEngine.getSystem('networking');
        if (!networking) return;
        
        // Apply network simulation to networking system
        networking.setPacketLoss(this.networkSimulation.packetLoss);
        networking.setLatency(this.networkSimulation.latency);
        networking.setJitter(this.networkSimulation.jitter);
        networking.setBandwidth(this.networkSimulation.bandwidth);
    }
    
    /**
     * Setup basic movement test
     */
    setupBasicMovementTest() {
        console.log("Setting up Basic Movement Test");
        
        // Disable combat
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.enabled = false;
        }
        
        // Set all bots to move around
        for (const bot of this.testBots) {
            // Set bot to move
            bot.moveInterval = 1 + Math.random() * 2;
            bot.shootInterval = Infinity; // Disable shooting
            bot.abilityInterval = Infinity; // Disable abilities
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = false;
    }
    
    /**
     * Run basic movement test
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    runBasicMovementTest(deltaTime) {
        // Test is running automatically
    }
    
    /**
     * Cleanup basic movement test
     */
    cleanupBasicMovementTest() {
        console.log("Cleaning up Basic Movement Test");
        
        // Re-enable combat
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.enabled = true;
        }
    }
    
    /**
     * Setup combat stress test
     */
    setupCombatStressTest() {
        console.log("Setting up Combat Stress Test");
        
        // Enable high enemy spawn rate
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.enabled = true;
            waveSpawner.spawnRateMultiplier = 3;
        }
        
        // Set all bots to combat mode
        for (const bot of this.testBots) {
            // Set bot to combat mode
            bot.moveInterval = 0.5 + Math.random() * 1;
            bot.shootInterval = 0.2 + Math.random() * 0.5;
            bot.abilityInterval = 2 + Math.random() * 5;
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = true;
        this.networkSimulation.packetLoss = 0.05; // 5% packet loss
        this.networkSimulation.latency = 50; // 50ms latency
        this.networkSimulation.jitter = 10; // 10ms jitter
        this.networkSimulation.bandwidth = 1000; // 1000kbps
    }
    
    /**
     * Run combat stress test
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    runCombatStressTest(deltaTime) {
        // Test is running automatically
    }
    
    /**
     * Cleanup combat stress test
     */
    cleanupCombatStressTest() {
        console.log("Cleaning up Combat Stress Test");
        
        // Reset enemy spawn rate
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.spawnRateMultiplier = 1;
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = false;
    }
    
    /**
     * Setup chaos meter test
     */
    setupChaosMeterTest() {
        console.log("Setting up Chaos Meter Test");
        
        // Get chaos meter system
        const chaosMeter = this.gameEngine.getSystem('chaosMeter');
        if (chaosMeter) {
            // Set chaos increase multiplier
            chaosMeter.chaosIncreaseMultiplier = 5;
            
            // Set chaos decay rate
            chaosMeter.chaosDecayRate = 0.5;
        }
        
        // Enable high enemy spawn rate
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.enabled = true;
            waveSpawner.spawnRateMultiplier = 2;
        }
        
        // Set all bots to aggressive mode
        for (const bot of this.testBots) {
            // Set bot to aggressive mode
            bot.moveInterval = 0.3 + Math.random() * 0.7;
            bot.shootInterval = 0.1 + Math.random() * 0.3;
            bot.abilityInterval = 1 + Math.random() * 3;
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = true;
        this.networkSimulation.packetLoss = 0.1; // 10% packet loss
        this.networkSimulation.latency = 100; // 100ms latency
        this.networkSimulation.jitter = 20; // 20ms jitter
        this.networkSimulation.bandwidth = 500; // 500kbps
    }
    
    /**
     * Run chaos meter test
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    runChaosMeterTest(deltaTime) {
        // Test is running automatically
    }
    
    /**
     * Cleanup chaos meter test
     */
    cleanupChaosMeterTest() {
        console.log("Cleaning up Chaos Meter Test");
        
        // Get chaos meter system
        const chaosMeter = this.gameEngine.getSystem('chaosMeter');
        if (chaosMeter) {
            // Reset chaos increase multiplier
            chaosMeter.chaosIncreaseMultiplier = 1;
            
            // Reset chaos decay rate
            chaosMeter.chaosDecayRate = 2;
        }
        
        // Reset enemy spawn rate
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.spawnRateMultiplier = 1;
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = false;
    }
    
    /**
     * Setup boss battle test
     */
    setupBossBattleTest() {
        console.log("Setting up Boss Battle Test");
        
        // Enable boss spawning
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.enabled = true;
            waveSpawner.bossSpawnChance = 1; // 100% chance to spawn boss
            waveSpawner.miniBossSpawnChance = 0.5; // 50% chance to spawn mini-boss
        }
        
        // Set all bots to boss battle mode
        for (const bot of this.testBots) {
            // Set bot to boss battle mode
            bot.moveInterval = 0.5 + Math.random() * 1;
            bot.shootInterval = 0.2 + Math.random() * 0.5;
            bot.abilityInterval = 1 + Math.random() * 3;
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = true;
        this.networkSimulation.packetLoss = 0.02; // 2% packet loss
        this.networkSimulation.latency = 30; // 30ms latency
        this.networkSimulation.jitter = 5; // 5ms jitter
        this.networkSimulation.bandwidth = 1500; // 1500kbps
    }
    
    /**
     * Run boss battle test
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    runBossBattleTest(deltaTime) {
        // Test is running automatically
    }
    
    /**
     * Cleanup boss battle test
     */
    cleanupBossBattleTest() {
        console.log("Cleaning up Boss Battle Test");
        
        // Reset boss spawn chance
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.bossSpawnChance = 0.1; // 10% chance to spawn boss
            waveSpawner.miniBossSpawnChance = 0.2; // 20% chance to spawn mini-boss
        }
        
        // Reset network simulation
        this.networkSimulation.enabled = false;
    }
    
    /**
     * Setup connection stability test
     */
    setupConnectionStabilityTest() {
        console.log("Setting up Connection Stability Test");
        
        // Enable normal enemy spawn rate
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        if (waveSpawner) {
            waveSpawner.enabled = true;
            waveSpawner.spawnRateMultiplier = 1;
        }
        
        // Set all bots to normal mode
        for (const bot of this.testBots) {
            // Set bot to normal mode
            bot.moveInterval = 1 + Math.random() * 2;
            bot.shootInterval = 0.5 + Math.random() * 1;
            bot.abilityInterval = 3 + Math.random() * 7;
        }
        
        // Set up network simulation with varying conditions
        this.networkSimulation.enabled = true;
        this.networkSimulation.packetLoss = 0;
        this.networkSimulation.latency = 20;
        this.networkSimulation.jitter = 5;
        this.networkSimulation.bandwidth = 2000;
    }
    
    /**
     * Run connection stability test
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    runConnectionStabilityTest(deltaTime) {
        // Vary network conditions during test
        const progress = this.scenarioTimer / this.currentScenario.duration;
        
        if (progress < 0.25) {
            // Good conditions
            this.networkSimulation.packetLoss = 0.01;
            this.networkSimulation.latency = 20;
            this.networkSimulation.jitter = 5;
        } else if (progress < 0.5) {
            // Degrading conditions
            this.networkSimulation.packetLoss = 0.05;
            this.networkSimulation.latency = 50;
            this.networkSimulation.jitter = 15;
        } else if (progress < 0.75) {
            // Poor conditions
            this.networkSimulation.packetLoss = 0.1;
            this.networkSimulation.latency = 100;
            this.networkSimulation.jitter = 30;
        } else {
            // Recovering conditions
            this.networkSimulation.packetLoss = 0.02;
            this.networkSimulation.latency = 30;
            this.networkSimulation.jitter = 10;
        }
    }
    
    /**
     * Cleanup connection stability test
     */
    cleanupConnectionStabilityTest() {
        console.log("Cleaning up Connection Stability Test");
        
        // Reset network simulation
        this.networkSimulation.enabled = false;
    }
    
    /**
     * Handle packet sent event
     * @param {object} packet - Packet that was sent
     */
    onPacketSent(packet) {
        // Skip if not running
        if (!this.running) return;
        
        // Update network stats
        this.testResults.networkStats.totalPacketsSent++;
    }
    
    /**
     * Handle packet received event
     * @param {object} packet - Packet that was received
     */
    onPacketReceived(packet) {
        // Skip if not running
        if (!this.running) return;
        
        // Update network stats
        this.testResults.networkStats.totalPacketsReceived++;
    }
    
    /**
     * Handle packet lost event
     * @param {object} packet - Packet that was lost
     */
    onPacketLost(packet) {
        // Skip if not running
        if (!this.running) return;
        
        // Update network stats
        this.testResults.networkStats.totalPacketsLost++;
        
        // Update error stats
        this.testResults.errorStats.totalErrors++;
        this.testResults.errorStats.networkErrors++;
        
        // Log error
        this.testResults.errorStats.errorLog.push({
            time: Date.now(),
            type: 'network',
            message: 'Packet lost',
            details: packet
        });
    }
    
    /**
     * Handle latency event
     * @param {number} latency - Current latency in ms
     */
    onLatency(latency) {
        // Skip if not running
        if (!this.running) return;
        
        // Update network stats
        this.testResults.networkStats.latencySamples.push(latency);
        this.testResults.networkStats.maxLatency = Math.max(this.testResults.networkStats.maxLatency, latency);
        this.testResults.networkStats.minLatency = Math.min(this.testResults.networkStats.minLatency, latency);
    }
    
    /**
     * Handle player join event
     * @param {Player} player - Player who joined
     */
    onPlayerJoin(player) {
        // Skip if not running
        if (!this.running) return;
        
        // Add player to test results
        this.testResults.players.push({
            id: player.id,
            name: player.name,
            class: player.class,
            isBot: player.isBot || false,
            joinTime: Date.now(),
            leaveTime: null,
            stats: {
                kills: 0,
                deaths: 0,
                damage: 0,
                revives: 0,
                powerups: 0
            }
        });
    }
    
    /**
     * Handle player leave event
     * @param {Player} player - Player who left
     */
    onPlayerLeave(player) {
        // Skip if not running
        if (!this.running) return;
        
        // Find player in test results
        const playerData = this.testResults.players.find(p => p.id === player.id);
        if (playerData) {
            // Set leave time
            playerData.leaveTime = Date.now();
        }
    }
    
    /**
     * Handle player death event
     * @param {Player} player - Player who died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Skip if not running
        if (!this.running) return;
        
        // Update gameplay stats
        this.testResults.gameplayStats.totalDeaths++;
        
        // Find player in test results
        const playerData = this.testResults.players.find(p => p.id === player.id);
        if (playerData) {
            // Update player stats
            playerData.stats.deaths++;
        }
        
        // Update bot stats
        const bot = this.testBots.find(b => b.id === player.id);
        if (bot) {
            bot.stats.deaths++;
        }
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - Enemy that died
     * @param {Entity} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Skip if not running
        if (!this.running) return;
        
        // Update gameplay stats
        this.testResults.gameplayStats.totalKills++;
        
        // Find source player in test results
        if (source && source.hasTag && source.hasTag('player')) {
            const playerData = this.testResults.players.find(p => p.id === source.id);
            if (playerData) {
                // Update player stats
                playerData.stats.kills++;
            }
            
            // Update bot stats
            const bot = this.testBots.find(b => b.id === source.id);
            if (bot) {
                bot.stats.kills++;
            }
        }
    }
    
    /**
     * Handle boss death event
     * @param {Boss} boss - Boss that died
     * @param {Entity} source - Source of death
     */
    onBossDeath(boss, source) {
        // Skip if not running
        if (!this.running) return;
        
        // Update gameplay stats
        this.testResults.gameplayStats.bossesDefeated++;
    }
    
    /**
     * Handle wave complete event
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Skip if not running
        if (!this.running) return;
        
        // Update gameplay stats
        this.testResults.gameplayStats.wavesCompleted++;
    }
    
    /**
     * Handle chaos increase event
     * @param {number} chaosLevel - Current chaos level
     * @param {number} amount - Amount of increase
     */
    onChaosIncrease(chaosLevel, amount) {
        // Skip if not running
        if (!this.running) return;
        
        // Update gameplay stats
        this.testResults.gameplayStats.chaosLevelSamples.push(chaosLevel);
        this.testResults.gameplayStats.maxChaosLevel = Math.max(
            this.testResults.gameplayStats.maxChaosLevel, 
            chaosLevel
        );
    }
    
    /**
     * Handle error event
     * @param {Error} error - Error that occurred
     */
    onError(error) {
        // Skip if not running
        if (!this.running) return;
        
        // Update error stats
        this.testResults.errorStats.totalErrors++;
        
        // Categorize error
        if (error.type === 'network') {
            this.testResults.errorStats.networkErrors++;
        } else if (error.type === 'game') {
            this.testResults.errorStats.gameErrors++;
        } else if (error.type === 'rendering') {
            this.testResults.errorStats.renderingErrors++;
        }
        
        // Log error
        this.testResults.errorStats.errorLog.push({
            time: Date.now(),
            type: error.type || 'unknown',
            message: error.message || 'Unknown error',
            details: error
        });
    }
    
    /**
     * Get test results
     * @returns {object} Test results
     */
    getTestResults() {
        return this.testResults;
    }
    
    /**
     * Generate test report
     * @returns {string} Test report
     */
    generateTestReport() {
        const results = this.testResults;
        
        // Calculate test duration
        const testDuration = (results.endTime - results.startTime) / 1000;
        
        // Generate report
        let report = `LAN Stability Test Report\n`;
        report += `========================\n\n`;
        report += `Test Duration: ${testDuration.toFixed(2)} seconds\n`;
        report += `Test Scenarios: ${this.testScenarios.map(s => s.name).join(', ')}\n\n`;
        
        // Network stats
        report += `Network Statistics:\n`;
        report += `-----------------\n`;
        report += `Packets Sent: ${results.networkStats.totalPacketsSent}\n`;
        report += `Packets Received: ${results.networkStats.totalPacketsReceived}\n`;
        report += `Packets Lost: ${results.networkStats.totalPacketsLost}\n`;
        report += `Packet Loss: ${results.networkStats.packetLossPercentage ? results.networkStats.packetLossPercentage.toFixed(2) + '%' : 'N/A'}\n`;
        report += `Average Latency: ${results.networkStats.averageLatency ? results.networkStats.averageLatency.toFixed(2) + 'ms' : 'N/A'}\n`;
        report += `Min Latency: ${results.networkStats.minLatency !== Infinity ? results.networkStats.minLatency.toFixed(2) + 'ms' : 'N/A'}\n`;
        report += `Max Latency: ${results.networkStats.maxLatency ? results.networkStats.maxLatency.toFixed(2) + 'ms' : 'N/A'}\n`;
        report += `Connection Stability: ${results.networkStats.connectionStability ? results.networkStats.connectionStability.toFixed(2) + '%' : 'N/A'}\n\n`;
        
        // Performance stats
        report += `Performance Statistics:\n`;
        report += `-----------------------\n`;
        report += `Average FPS: ${results.performanceStats.averageFPS ? results.performanceStats.averageFPS.toFixed(2) : 'N/A'}\n`;
        report += `Min FPS: ${results.performanceStats.minFPS !== Infinity ? results.performanceStats.minFPS.toFixed(2) : 'N/A'}\n`;
        report += `Max FPS: ${results.performanceStats.maxFPS ? results.performanceStats.maxFPS.toFixed(2) : 'N/A'}\n`;
        report += `Average Frame Time: ${results.performanceStats.averageFrameTime ? results.performanceStats.averageFrameTime.toFixed(2) + 'ms' : 'N/A'}\n`;
        report += `Max Frame Time: ${results.performanceStats.maxFrameTime ? results.performanceStats.maxFrameTime.toFixed(2) + 'ms' : 'N/A'}\n`;
        report += `Dropped Frames: ${results.performanceStats.droppedFrames}\n\n`;
        
        // Gameplay stats
        report += `Gameplay Statistics:\n`;
        report += `---------------------\n`;
        report += `Total Kills: ${results.gameplayStats.totalKills}\n`;
        report += `Total Deaths: ${results.gameplayStats.totalDeaths}\n`;
        report += `K/D Ratio: ${results.gameplayStats.totalDeaths > 0 ? (results.gameplayStats.totalKills / results.gameplayStats.totalDeaths).toFixed(2) : 'N/A'}\n`;
        report += `Waves Completed: ${results.gameplayStats.wavesCompleted}\n`;
        report += `Bosses Defeated: ${results.gameplayStats.bossesDefeated}\n`;
        report += `Max Chaos Level: ${results.gameplayStats.maxChaosLevel}\n`;
        report += `Average Chaos Level: ${results.gameplayStats.averageChaosLevel ? results.gameplayStats.averageChaosLevel.toFixed(2) : 'N/A'}\n\n`;
        
        // Error stats
        report += `Error Statistics:\n`;
        report += `------------------\n`;
        report += `Total Errors: ${results.errorStats.totalErrors}\n`;
        report += `Network Errors: ${results.errorStats.networkErrors}\n`;
        report += `Game Errors: ${results.errorStats.gameErrors}\n`;
        report += `Rendering Errors: ${results.errorStats.renderingErrors}\n\n`;
        
        // Player stats
        report += `Player Statistics:\n`;
        report += `-------------------\n`;
        for (const player of results.players) {
            report += `${player.name} (${player.class}):\n`;
            report += `  Kills: ${player.stats.kills}\n`;
            report += `  Deaths: ${player.stats.deaths}\n`;
            report += `  K/D Ratio: ${player.stats.deaths > 0 ? (player.stats.kills / player.stats.deaths).toFixed(2) : 'N/A'}\n`;
            report += `  Damage: ${player.stats.damage}\n`;
            report += `  Revives: ${player.stats.revives}\n`;
            report += `  Powerups: ${player.stats.powerups}\n`;
            report += `  Play Time: ${player.leaveTime ? ((player.leaveTime - player.joinTime) / 1000).toFixed(2) + 's' : 'N/A'}\n\n`;
        }
        
        // Conclusion
        report += `Conclusion:\n`;
        report += `-----------\n`;
        
        // Determine test result
        let testResult = 'PASS';
        let issues = [];
        
        // Check network stability
        if (results.networkStats.packetLossPercentage > 10) {
            testResult = 'FAIL';
            issues.push('High packet loss rate');
        }
        
        if (results.networkStats.averageLatency > 100) {
            testResult = 'FAIL';
            issues.push('High average latency');
        }
        
        if (results.networkStats.connectionStability < 70) {
            testResult = 'FAIL';
            issues.push('Poor connection stability');
        }
        
        // Check performance
        if (results.performanceStats.averageFPS < 30) {
            testResult = 'FAIL';
            issues.push('Low average FPS');
        }
        
        if (results.performanceStats.droppedFrames > results.performanceStats.fpsSamples.length * 0.1) {
            testResult = 'FAIL';
            issues.push('High dropped frame rate');
        }
        
        // Check errors
        if (results.errorStats.totalErrors > 10) {
            testResult = 'FAIL';
            issues.push('High error rate');
        }
        
        // Add conclusion
        report += `Test Result: ${testResult}\n`;
        
        if (issues.length > 0) {
            report += `Issues:\n`;
            for (const issue of issues) {
                report += `  - ${issue}\n`;
            }
        } else {
            report += `No issues detected.\n`;
        }
        
        return report;
    }
    
    /**
     * Destroy the LAN stability test
     */
    destroy() {
        // Stop test if running
        if (this.running) {
            this.stopTest();
        }
        
        // Remove test bots
        for (const bot of this.testBots) {
            if (bot.entity) {
                this.gameEngine.removeEntity(bot.entity);
            }
        }
        
        // Clear test bots
        this.testBots = [];
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LANStabilityTest;
}