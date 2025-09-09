/**
 * Arcade Meltdown - Enhanced Scoreboard UI
 * Displays player scores, stats, and rankings with humorous titles and achievements
 */

class ScoreboardEnhanced {
    /**
     * Create a new Enhanced Scoreboard UI
     * @param {GameEngine} gameEngine - Game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Scoreboard properties
        this.visible = false;
        this.toggleKey = 'Tab'; // Key to toggle scoreboard visibility
        
        // Player data
        this.playerData = new Map(); // playerId -> player stats
        
        // Score calculation properties
        this.killScore = 10; // Points per enemy kill
        this.assistScore = 5; // Points per assist
        this.miniBossKillScore = 50; // Points per mini-boss kill
        this.bossKillScore = 100; // Points per boss kill
        this.survivalScore = 1; // Points per second survived
        this.damageScore = 0.1; // Points per damage dealt
        this.reviveScore = 15; // Points per revive
        this.powerupScore = 5; // Points per powerup collected
        
        // Enhanced humorous titles with descriptions
        this.titles = [
            { 
                minScore: 0, 
                title: "Pixel Padawan", 
                color: "#888888",
                description: "Just learning the ropes of digital destruction",
                icon: "👶"
            },
            { 
                minScore: 50, 
                title: "Arcade Amateur", 
                color: "#55ff55",
                description: "Getting the hang of things, one coin at a time",
                icon: "🎮"
            },
            { 
                minScore: 150, 
                title: "Game Grunt", 
                color: "#55ffff",
                description: "Mastered the basics, ready for more action",
                icon: "🕹️"
            },
            { 
                minScore: 300, 
                title: "Console Commander", 
                color: "#5555ff",
                description: "Leading the charge with controller in hand",
                icon: "🎯"
            },
            { 
                minScore: 500, 
                title: "Boss Basher", 
                color: "#ff55ff",
                description: "Makes bosses cry for their digital mothers",
                icon: "👊"
            },
            { 
                minScore: 750, 
                title: "Meltdown Master", 
                color: "#ff5555",
                description: "Thrives in chaos, melts faces for fun",
                icon: "🔥"
            },
            { 
                minScore: 1000, 
                title: "Digital Demigod", 
                color: "#ffff55",
                description: "Worshipped by pixels, feared by polygons",
                icon: "⚡"
            },
            { 
                minScore: 1500, 
                title: "Neural Nemesis", 
                color: "#ff9933",
                description: "Your brain has more RAM than the server",
                icon: "🧠"
            },
            { 
                minScore: 2000, 
                title: "Cybernetic Champion", 
                color: "#ff3333",
                description: "More machine than human, all killer",
                icon: "🤖"
            },
            { 
                minScore: 3000, 
                title: "Arcade Avatar", 
                color: "#ff00ff",
                description: "You ARE the game. The game is afraid.",
                icon: "👾"
            },
            { 
                minScore: 5000, 
                title: "Glitch Guru", 
                color: "#00ffff",
                description: "Breaks reality on a daily basis",
                icon: "🌀"
            },
            { 
                minScore: 7500, 
                title: "Chaos Connoisseur", 
                color: "#ff0080",
                description: "Drinks chaos for breakfast, bathes in meltdown",
                icon: "💀"
            },
            { 
                minScore: 10000, 
                title: "Retro Royalty", 
                color: "#ffaa00",
                description: "King of all arcades, past, present, and future",
                icon: "👑"
            },
            { 
                minScore: 15000, 
                title: "Score Sovereign", 
                color: "#ff5500",
                description: "Numbers bow before you, points weep in your presence",
                icon: "🏆"
            },
            { 
                minScore: 20000, 
                title: "Legendary Leveler", 
                color: "#ff0000",
                description: "Myths are told about your gaming prowess",
                icon: "🔱"
            },
            { 
                minScore: 30000, 
                title: "Apex Arcade Ace", 
                color: "#ff00ff",
                description: "The final boss of real life",
                icon: "🌟"
            },
            { 
                minScore: 50000, 
                title: "Digital Deity", 
                color: "#ffffff",
                description: "You have transcended the game itself",
                icon: "✨"
            }
        ];
        
        // Achievement system
        this.achievements = [
            {
                id: "first_blood",
                name: "First Blood",
                description: "Get your first kill",
                icon: "🩸",
                condition: (player) => player.kills >= 1,
                reward: 10
            },
            {
                id: "survivor",
                name: "Survivor",
                description: "Survive 5 waves without dying",
                icon: "🛡️",
                condition: (player) => player.wavesSurvived >= 5 && player.deaths === 0,
                reward: 25
            },
            {
                id: "boss_slayer",
                name: "Boss Slayer",
                description: "Defeat a boss without taking damage",
                icon: "🐉",
                condition: (player) => player.bossKills >= 1 && player.bossDamageTaken === 0,
                reward: 50
            },
            {
                id: "team_player",
                name: "Team Player",
                description: "Revive 5 teammates",
                icon: "🤝",
                condition: (player) => player.revives >= 5,
                reward: 30
            },
            {
                id: "power_hungry",
                name: "Power Hungry",
                description: "Collect 10 power-ups in a single game",
                icon: "⚡",
                condition: (player) => player.powerupsCollected >= 10,
                reward: 20
            },
            {
                id: "chaos_magnet",
                name: "Chaos Magnet",
                description: "Reach maximum chaos level",
                icon: "🌀",
                condition: (player) => player.maxChaosReached >= 100,
                reward: 40
            },
            {
                id: "sharpshooter",
                name: "Sharpshooter",
                description: "Achieve 90% accuracy with at least 100 shots",
                icon: "🎯",
                condition: (player) => player.shotsFired >= 100 && (player.hits / player.shotsFired) >= 0.9,
                reward: 35
            },
            {
                id: "untouchable",
                name: "Untouchable",
                description: "Complete a wave without taking damage",
                icon: "👻",
                condition: (player) => player.untouchableWaves >= 1,
                reward: 30
            },
            {
                id: "speed_demon",
                name: "Speed Demon",
                description: "Complete a wave in under 2 minutes",
                icon: "🏃",
                condition: (player) => player.fastestWaveTime < 120,
                reward: 25
            },
            {
                id: "lone_wolf",
                name: "Lone Wolf",
                description: "Complete a wave alone with at least 4 players in the game",
                icon: "🐺",
                condition: (player) => player.loneWolfWaves >= 1,
                reward: 45
            }
        ];
        
        // Player achievements
        this.playerAchievements = new Map(); // playerId -> achievement ids
        
        // Stats tracking
        this.statsHistory = []; // History of game stats
        this.currentGameStats = {
            startTime: Date.now(),
            totalKills: 0,
            totalDamage: 0,
            totalDeaths: 0,
            totalRevives: 0,
            totalPowerups: 0,
            wavesCompleted: 0,
            bossesDefeated: 0,
            maxChaosLevel: 0
        };
        
        // Fun facts
        this.funFacts = [
            "Did you know? The first arcade game was Computer Space, released in 1971.",
            "Fun fact: The highest score ever recorded on Pac-Man is 3,333,360 points.",
            "Did you know? The term 'high score' was popularized by pinball machines.",
            "Fun fact: The arcade industry peaked in 1982 with $8 billion in revenue.",
            "Did you know? The first video game tournament was held in 1972 for Spacewar.",
            "Fun fact: The average arcade game in the 1980s cost about 25 cents to play.",
            "Did you know? The word 'arcade' comes from the Latin word 'arcus' meaning 'arch'.",
            "Fun fact: The first game to feature a high score table was Asteroids in 1979.",
            "Did you know? The highest-grossing arcade game of all time is Pac-Man.",
            "Fun fact: The arcade version of Donkey Kong was the first appearance of Mario."
        ];
        
        // UI properties
        this.width = 500;
        this.height = 450;
        this.x = 0;
        this.y = 0;
        this.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.borderColor = '#ffffff';
        this.borderWidth = 2;
        this.cornerRadius = 10;
        
        // Animation properties
        this.animationProgress = 0;
        this.animationSpeed = 5;
        this.targetAnimationProgress = 0;
        
        // Initialize scoreboard
        this.init();
    }
    
    /**
     * Initialize the scoreboard
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up input handling
        this.setupInputHandling();
        
        // Position scoreboard
        this.positionScoreboard();
        
        // Load saved stats
        this.loadStats();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for player join events
        window.eventSystem.on('player:join', (player) => {
            this.onPlayerJoin(player);
        });
        
        // Listen for player leave events
        window.eventSystem.on('player:leave', (player) => {
            this.onPlayerLeave(player);
        });
        
        // Listen for player death events
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        // Listen for player revive events
        window.eventSystem.on('player:revive', (reviver, player) => {
            this.onPlayerRevive(reviver, player);
        });
        
        // Listen for enemy death events
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        // Listen for mini-boss death events
        window.eventSystem.on('miniBoss:death', (miniBoss, source) => {
            this.onMiniBossDeath(miniBoss, source);
        });
        
        // Listen for boss death events
        window.eventSystem.on('boss:death', (boss, source) => {
            this.onBossDeath(boss, source);
        });
        
        // Listen for player damage events
        window.eventSystem.on('player:damageDealt', (player, damage, target) => {
            this.onPlayerDamageDealt(player, damage, target);
        });
        
        // Listen for player damage taken events
        window.eventSystem.on('player:hurt', (player, damage, source) => {
            this.onPlayerHurt(player, damage, source);
        });
        
        // Listen for powerup collect events
        window.eventSystem.on('player:powerupCollect', (player, powerup) => {
            this.onPlayerPowerupCollect(player, powerup);
        });
        
        // Listen for wave complete events
        window.eventSystem.on('wave:complete', (waveNumber, score, time) => {
            this.onWaveComplete(waveNumber, score, time);
        });
        
        // Listen for chaos meter changes
        window.eventSystem.on('chaos:increase', (chaosLevel, amount) => {
            this.onChaosIncrease(chaosLevel, amount);
        });
        
        // Listen for game over events
        window.eventSystem.on('game:over', (score) => {
            this.onGameOver(score);
        });
    }
    
    /**
     * Set up input handling
     */
    setupInputHandling() {
        // Listen for keydown events
        document.addEventListener('keydown', (e) => {
            if (e.key === this.toggleKey) {
                this.toggle();
            }
        });
        
        // Listen for keyup events
        document.addEventListener('keyup', (e) => {
            if (e.key === this.toggleKey) {
                // Keep scoreboard visible for a short time after key release
                setTimeout(() => {
                    if (!this.visible) return;
                    this.hide();
                }, 1000);
            }
        });
    }
    
    /**
     * Position the scoreboard
     */
    positionScoreboard() {
        // Center scoreboard on screen
        this.x = (this.gameEngine.canvas.width - this.width) / 2;
        this.y = (this.gameEngine.canvas.height - this.height) / 2;
    }
    
    /**
     * Load saved stats
     */
    loadStats() {
        try {
            // Load stats from local storage
            const savedStats = localStorage.getItem('arcadeMeltdown_stats');
            if (savedStats) {
                this.statsHistory = JSON.parse(savedStats);
            }
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
    }
    
    /**
     * Save stats
     */
    saveStats() {
        try {
            // Save stats to local storage
            localStorage.setItem('arcadeMeltdown_stats', JSON.stringify(this.statsHistory));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    }
    
    /**
     * Update the scoreboard
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Update animation progress
        if (this.animationProgress !== this.targetAnimationProgress) {
            const diff = this.targetAnimationProgress - this.animationProgress;
            this.animationProgress += diff * this.animationSpeed * deltaTime;
            
            // Clamp animation progress
            this.animationProgress = Math.max(0, Math.min(1, this.animationProgress));
        }
        
        // Update survival scores
        this.updateSurvivalScores(deltaTime);
        
        // Check for achievements
        this.checkAchievements();
        
        // Sort players by score
        this.sortPlayersByScore();
    }
    
    /**
     * Update survival scores
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    updateSurvivalScores(deltaTime) {
        // Get all players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        // Update survival score for each player
        for (const player of players) {
            // Get player data
            const data = this.playerData.get(player.id);
            if (!data) continue;
            
            // Update survival score
            data.survivalScore += this.survivalScore * deltaTime;
            data.timePlayed += deltaTime;
            
            // Update total score
            this.updateTotalScore(player.id);
        }
    }
    
    /**
     * Check for achievements
     */
    checkAchievements() {
        // Get all players
        const players = this.gameEngine.getEntitiesByTag('player');
        
        // Check achievements for each player
        for (const player of players) {
            // Get player data
            const data = this.playerData.get(player.id);
            if (!data) continue;
            
            // Get player achievements
            const playerAchievements = this.playerAchievements.get(player.id) || [];
            
            // Check each achievement
            for (const achievement of this.achievements) {
                // Skip if already unlocked
                if (playerAchievements.includes(achievement.id)) continue;
                
                // Check if achievement is unlocked
                if (achievement.condition(data)) {
                    // Add achievement
                    playerAchievements.push(achievement.id);
                    
                    // Add reward score
                    data.achievementScore += achievement.reward;
                    
                    // Update total score
                    this.updateTotalScore(player.id);
                    
                    // Emit achievement unlocked event
                    window.eventSystem.emit('scoreboard:achievementUnlocked', player.id, achievement);
                }
            }
            
            // Update player achievements
            this.playerAchievements.set(player.id, playerAchievements);
        }
    }
    
    /**
     * Sort players by score
     */
    sortPlayersByScore() {
        // Convert player data to array
        const playerArray = Array.from(this.playerData.entries());
        
        // Sort by total score (descending)
        playerArray.sort((a, b) => {
            return b[1].totalScore - a[1].totalScore;
        });
        
        // Update rankings
        for (let i = 0; i < playerArray.length; i++) {
            const playerId = playerArray[i][0];
            const data = playerArray[i][1];
            data.rank = i + 1;
        }
    }
    
    /**
     * Toggle scoreboard visibility
     */
    toggle() {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Show the scoreboard
     */
    show() {
        this.visible = true;
        this.targetAnimationProgress = 1;
    }
    
    /**
     * Hide the scoreboard
     */
    hide() {
        this.visible = false;
        this.targetAnimationProgress = 0;
    }
    
    /**
     * Render the scoreboard
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        // Skip if not visible and not animating
        if (!this.visible && this.animationProgress <= 0) return;
        
        // Save context state
        ctx.save();
        
        // Calculate animated position and scale
        const animX = this.x;
        const animY = this.y + (1 - this.animationProgress) * 50;
        const animWidth = this.width;
        const animHeight = this.height * this.animationProgress;
        
        // Draw scoreboard background with rounded corners
        ctx.fillStyle = this.backgroundColor;
        this.roundRect(ctx, animX, animY, animWidth, animHeight, this.cornerRadius);
        ctx.fill();
        
        // Draw scoreboard border with rounded corners
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        this.roundRect(ctx, animX, animY, animWidth, animHeight, this.cornerRadius);
        ctx.stroke();
        
        // Draw scoreboard title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ARCADE MELTDOWN SCOREBOARD', animX + animWidth / 2, animY + 35);
        
        // Draw scoreboard headers
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('RANK', animX + 20, animY + 70);
        ctx.fillText('PLAYER', animX + 80, animY + 70);
        ctx.fillText('TITLE', animX + 200, animY + 70);
        ctx.fillText('SCORE', animX + 340, animY + 70);
        ctx.fillText('K/D', animX + 410, animY + 70);
        ctx.fillText('TIME', animX + 460, animY + 70);
        
        // Draw player data
        const playerArray = Array.from(this.playerData.entries());
        const maxPlayers = Math.min(playerArray.length, 8); // Show max 8 players
        
        for (let i = 0; i < maxPlayers; i++) {
            const playerId = playerArray[i][0];
            const data = playerArray[i][1];
            
            // Calculate row position
            const rowY = animY + 100 + i * 35;
            
            // Draw rank
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data.rank, animX + 35, rowY);
            
            // Draw player name
            ctx.textAlign = 'left';
            ctx.font = '14px Arial';
            
            // Get player title
            const title = this.getPlayerTitle(data.totalScore);
            
            // Draw player name with title color
            ctx.fillStyle = title.color;
            ctx.fillText(data.name, animX + 80, rowY);
            
            // Draw player title icon
            ctx.font = '16px Arial';
            ctx.fillText(title.icon, animX + 80, rowY - 10);
            
            // Draw player title
            ctx.font = '10px Arial';
            ctx.fillText(title.title, animX + 80, rowY + 12);
            
            // Draw score
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(Math.floor(data.totalScore), animX + 370, rowY);
            
            // Draw K/D ratio
            const kdRatio = data.deaths > 0 ? (data.kills / data.deaths).toFixed(2) : data.kills;
            ctx.fillText(kdRatio, animX + 420, rowY);
            
            // Draw time played
            const minutes = Math.floor(data.timePlayed / 60);
            const seconds = Math.floor(data.timePlayed % 60);
            const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            ctx.fillText(timeStr, animX + 470, rowY);
        }
        
        // Draw game stats
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        // Get wave number
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        const waveNumber = waveSpawner ? waveSpawner.currentWave : 0;
        
        // Get chaos meter
        const chaosMeter = this.gameEngine.getSystem('chaosMeter');
        const chaosLevel = chaosMeter ? chaosMeter.getChaosLevel() : 0;
        
        // Draw game stats
        ctx.fillText(`Wave: ${waveNumber}`, animX + 20, animY + animHeight - 80);
        ctx.fillText(`Chaos: ${Math.floor(chaosLevel)}%`, animX + 120, animY + animHeight - 80);
        ctx.fillText(`Total Kills: ${this.currentGameStats.totalKills}`, animX + 220, animY + animHeight - 80);
        ctx.fillText(`Players: ${this.playerData.size}`, animX + 350, animY + animHeight - 80);
        
        // Draw fun fact
        const funFact = this.funFacts[Math.floor(Math.random() * this.funFacts.length)];
        ctx.font = 'italic 10px Arial';
        ctx.fillStyle = '#aaaaaa';
        ctx.textAlign = 'center';
        this.wrapText(ctx, funFact, animX + animWidth / 2, animY + animHeight - 50, animWidth - 40, 12);
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Draw rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} radius - Corner radius
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    /**
     * Wrap text
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {string} text - Text to wrap
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} maxWidth - Maximum width
     * @param {number} lineHeight - Line height
     */
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        ctx.fillText(line, x, y);
    }
    
    /**
     * Handle player join event
     * @param {Player} player - Player who joined
     */
    onPlayerJoin(player) {
        // Create player data
        const data = {
            id: player.id,
            name: player.name || `Player ${player.id}`,
            kills: 0,
            deaths: 0,
            assists: 0,
            revives: 0,
            powerupsCollected: 0,
            shotsFired: 0,
            hits: 0,
            bossKills: 0,
            bossDamageTaken: 0,
            wavesSurvived: 0,
            untouchableWaves: 0,
            loneWolfWolves: 0,
            fastestWaveTime: Infinity,
            maxChaosReached: 0,
            timePlayed: 0,
            killScore: 0,
            assistScore: 0,
            reviveScore: 0,
            powerupScore: 0,
            survivalScore: 0,
            damageScore: 0,
            miniBossKillScore: 0,
            bossKillScore: 0,
            achievementScore: 0,
            totalScore: 0,
            rank: 0
        };
        
        // Add player data
        this.playerData.set(player.id, data);
        
        // Initialize player achievements
        this.playerAchievements.set(player.id, []);
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', player.id, data);
    }
    
    /**
     * Handle player leave event
     * @param {Player} player - Player who left
     */
    onPlayerLeave(player) {
        // Remove player data
        this.playerData.delete(player.id);
        
        // Remove player achievements
        this.playerAchievements.delete(player.id);
        
        // Emit player data remove event
        window.eventSystem.emit('scoreboard:playerDataRemove', player.id);
    }
    
    /**
     * Handle player death event
     * @param {Player} player - Player who died
     * @param {Entity} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Get player data
        const data = this.playerData.get(player.id);
        if (!data) return;
        
        // Increment deaths
        data.deaths++;
        
        // Update total score
        this.updateTotalScore(player.id);
        
        // Update game stats
        this.currentGameStats.totalDeaths++;
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', player.id, data);
        
        // Award kill to source if it's a player
        if (source && source.hasTag && source.hasTag('player')) {
            const sourceData = this.playerData.get(source.id);
            if (sourceData) {
                sourceData.kills++;
                sourceData.killScore += this.killScore;
                this.updateTotalScore(source.id);
                window.eventSystem.emit('scoreboard:playerDataUpdate', source.id, sourceData);
            }
        }
    }
    
    /**
     * Handle player revive event
     * @param {Player} reviver - Player who revived
     * @param {Player} player - Player who was revived
     */
    onPlayerRevive(reviver, player) {
        // Award revive to reviver
        const reviverData = this.playerData.get(reviver.id);
        if (reviverData) {
            reviverData.revives++;
            reviverData.reviveScore += this.reviveScore;
            this.updateTotalScore(reviver.id);
            window.eventSystem.emit('scoreboard:playerDataUpdate', reviver.id, reviverData);
        }
        
        // Update game stats
        this.currentGameStats.totalRevives++;
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - Enemy that died
     * @param {Entity} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Skip if source is not a player
        if (!source || !source.hasTag || !source.hasTag('player')) return;
        
        // Get player data
        const data = this.playerData.get(source.id);
        if (!data) return;
        
        // Award kill based on enemy type
        if (enemy.hasTag && enemy.hasTag('miniBoss')) {
            data.miniBossKillScore += this.miniBossKillScore;
            data.bossKills++;
        } else if (enemy.hasTag && enemy.hasTag('boss')) {
            data.bossKillScore += this.bossKillScore;
            data.bossKills++;
        } else {
            data.killScore += this.killScore;
            data.kills++;
        }
        
        // Update total score
        this.updateTotalScore(source.id);
        
        // Update game stats
        this.currentGameStats.totalKills++;
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', source.id, data);
    }
    
    /**
     * Handle mini-boss death event
     * @param {MiniBoss} miniBoss - Mini-boss that died
     * @param {Entity} source - Source of death
     */
    onMiniBossDeath(miniBoss, source) {
        // Skip if source is not a player
        if (!source || !source.hasTag || !source.hasTag('player')) return;
        
        // Get player data
        const data = this.playerData.get(source.id);
        if (!data) return;
        
        // Award mini-boss kill
        data.miniBossKillScore += this.miniBossKillScore;
        data.kills++;
        data.bossKills++;
        
        // Update total score
        this.updateTotalScore(source.id);
        
        // Update game stats
        this.currentGameStats.totalKills++;
        this.currentGameStats.bossesDefeated++;
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', source.id, data);
    }
    
    /**
     * Handle boss death event
     * @param {Boss} boss - Boss that died
     * @param {Entity} source - Source of death
     */
    onBossDeath(boss, source) {
        // Skip if source is not a player
        if (!source || !source.hasTag || !source.hasTag('player')) return;
        
        // Get player data
        const data = this.playerData.get(source.id);
        if (!data) return;
        
        // Award boss kill
        data.bossKillScore += this.bossKillScore;
        data.kills++;
        data.bossKills++;
        
        // Update total score
        this.updateTotalScore(source.id);
        
        // Update game stats
        this.currentGameStats.totalKills++;
        this.currentGameStats.bossesDefeated++;
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', source.id, data);
    }
    
    /**
     * Handle player damage dealt event
     * @param {Player} player - Player who dealt damage
     * @param {number} damage - Amount of damage dealt
     * @param {Entity} target - Target of damage
     */
    onPlayerDamageDealt(player, damage, target) {
        // Get player data
        const data = this.playerData.get(player.id);
        if (!data) return;
        
        // Award damage score
        data.damageScore += damage * this.damageScore;
        
        // Update shots fired and hits
        data.shotsFired++;
        data.hits++;
        
        // Update boss damage taken if target is a boss
        if (target && target.hasTag && target.hasTag('boss')) {
            data.bossDamageTaken += damage;
        }
        
        // Update total score
        this.updateTotalScore(player.id);
        
        // Update game stats
        this.currentGameStats.totalDamage += damage;
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', player.id, data);
    }
    
    /**
     * Handle player hurt event
     * @param {Player} player - Player who was hurt
     * @param {number} damage - Amount of damage taken
     * @param {Entity} source - Source of damage
     */
    onPlayerHurt(player, damage, source) {
        // Get player data
        const data = this.playerData.get(player.id);
        if (!data) return;
        
        // Update boss damage taken if source is a boss
        if (source && source.hasTag && source.hasTag('boss')) {
            data.bossDamageTaken += damage;
        }
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', player.id, data);
    }
    
    /**
     * Handle player powerup collect event
     * @param {Player} player - Player who collected powerup
     * @param {Powerup} powerup - Powerup collected
     */
    onPlayerPowerupCollect(player, powerup) {
        // Get player data
        const data = this.playerData.get(player.id);
        if (!data) return;
        
        // Award powerup score
        data.powerupScore += this.powerupScore;
        data.powerupsCollected++;
        
        // Update total score
        this.updateTotalScore(player.id);
        
        // Update game stats
        this.currentGameStats.totalPowerups++;
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', player.id, data);
    }
    
    /**
     * Handle wave complete event
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     * @param {number} time - Time taken to complete wave
     */
    onWaveComplete(waveNumber, score, time) {
        // Award survival bonus to all players
        for (const [playerId, data] of this.playerData) {
            data.survivalScore += 50; // Flat bonus for completing wave
            data.wavesSurvived++;
            
            // Check if wave was completed without taking damage
            if (data.untouchableThisWave) {
                data.untouchableWaves++;
            }
            
            // Update fastest wave time
            if (time < data.fastestWaveTime) {
                data.fastestWaveTime = time;
            }
            
            // Reset untouchable flag
            data.untouchableThisWave = false;
            
            this.updateTotalScore(playerId);
            window.eventSystem.emit('scoreboard:playerDataUpdate', playerId, data);
        }
        
        // Update game stats
        this.currentGameStats.wavesCompleted++;
    }
    
    /**
     * Handle chaos increase event
     * @param {number} chaosLevel - Current chaos level
     * @param {number} amount - Amount of increase
     */
    onChaosIncrease(chaosLevel, amount) {
        // Update max chaos level for all players
        for (const [playerId, data] of this.playerData) {
            if (chaosLevel > data.maxChaosReached) {
                data.maxChaosReached = chaosLevel;
                window.eventSystem.emit('scoreboard:playerDataUpdate', playerId, data);
            }
        }
        
        // Update game stats
        if (chaosLevel > this.currentGameStats.maxChaosLevel) {
            this.currentGameStats.maxChaosLevel = chaosLevel;
        }
    }
    
    /**
     * Handle game over event
     * @param {number} score - Final score
     */
    onGameOver(score) {
        // Calculate game duration
        const gameDuration = (Date.now() - this.currentGameStats.startTime) / 1000;
        
        // Add game stats to history
        this.statsHistory.push({
            date: new Date().toISOString(),
            duration: gameDuration,
            ...this.currentGameStats
        });
        
        // Keep only last 10 games
        if (this.statsHistory.length > 10) {
            this.statsHistory.shift();
        }
        
        // Save stats
        this.saveStats();
        
        // Reset current game stats
        this.currentGameStats = {
            startTime: Date.now(),
            totalKills: 0,
            totalDamage: 0,
            totalDeaths: 0,
            totalRevives: 0,
            totalPowerups: 0,
            wavesCompleted: 0,
            bossesDefeated: 0,
            maxChaosLevel: 0
        };
    }
    
    /**
     * Update total score for a player
     * @param {string} playerId - Player ID
     */
    updateTotalScore(playerId) {
        // Get player data
        const data = this.playerData.get(playerId);
        if (!data) return;
        
        // Calculate total score
        data.totalScore = 
            data.killScore + 
            data.assistScore + 
            data.reviveScore + 
            data.powerupScore + 
            data.survivalScore + 
            data.damageScore + 
            data.miniBossKillScore + 
            data.bossKillScore + 
            data.achievementScore;
    }
    
    /**
     * Get player title based on score
     * @param {number} score - Player score
     * @returns {object} Player title
     */
    getPlayerTitle(score) {
        // Find appropriate title
        for (let i = this.titles.length - 1; i >= 0; i--) {
            if (score >= this.titles[i].minScore) {
                return this.titles[i];
            }
        }
        
        // Return default title
        return this.titles[0];
    }
    
    /**
     * Get player achievements
     * @param {string} playerId - Player ID
     * @returns {Array} Player achievements
     */
    getPlayerAchievements(playerId) {
        const achievementIds = this.playerAchievements.get(playerId) || [];
        
        return achievementIds.map(id => {
            return this.achievements.find(a => a.id === id);
        }).filter(a => a); // Filter out undefined
    }
    
    /**
     * Get player data
     * @param {string} playerId - Player ID
     * @returns {object} Player data
     */
    getPlayerData(playerId) {
        return this.playerData.get(playerId);
    }
    
    /**
     * Get all player data
     * @returns {Map} All player data
     */
    getAllPlayerData() {
        return this.playerData;
    }
    
    /**
     * Get stats history
     * @returns {Array} Stats history
     */
    getStatsHistory() {
        return this.statsHistory;
    }
    
    /**
     * Get current game stats
     * @returns {object} Current game stats
     */
    getCurrentGameStats() {
        return this.currentGameStats;
    }
    
    /**
     * Destroy the scoreboard
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.toggle);
        document.removeEventListener('keyup', this.toggle);
        
        // Clear player data
        this.playerData.clear();
        
        // Clear player achievements
        this.playerAchievements.clear();
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreboardEnhanced;
}