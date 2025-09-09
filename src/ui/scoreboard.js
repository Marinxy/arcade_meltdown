/**
 * Arcade Meltdown - Scoreboard UI
 * Displays player scores, stats, and rankings
 */

class Scoreboard {
    /**
     * Create a new Scoreboard UI
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
        
        // Humorous titles
        this.titles = [
            { minScore: 0, title: "Pixel Padawan", color: "#888888" },
            { minScore: 50, title: "Arcade Amateur", color: "#55ff55" },
            { minScore: 150, title: "Game Grunt", color: "#55ffff" },
            { minScore: 300, title: "Console Commander", color: "#5555ff" },
            { minScore: 500, title: "Boss Basher", color: "#ff55ff" },
            { minScore: 750, title: "Meltdown Master", color: "#ff5555" },
            { minScore: 1000, title: "Digital Demigod", color: "#ffff55" },
            { minScore: 1500, title: "Neural Nemesis", color: "#ff9933" },
            { minScore: 2000, title: "Cybernetic Champion", color: "#ff3333" },
            { minScore: 3000, title: "Arcade Avatar", color: "#ff00ff" }
        ];
        
        // UI properties
        this.width = 400;
        this.height = 300;
        this.x = 0;
        this.y = 0;
        this.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.borderColor = '#ffffff';
        this.borderWidth = 2;
        
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
        
        // Listen for wave complete events
        window.eventSystem.on('wave:complete', (waveNumber, score) => {
            this.onWaveComplete(waveNumber, score);
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
            
            // Update total score
            this.updateTotalScore(player.id);
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
        
        // Draw scoreboard background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(animX, animY, animWidth, animHeight);
        
        // Draw scoreboard border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(animX, animY, animWidth, animHeight);
        
        // Draw scoreboard title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCOREBOARD', animX + animWidth / 2, animY + 30);
        
        // Draw scoreboard headers
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('RANK', animX + 20, animY + 60);
        ctx.fillText('PLAYER', animX + 80, animY + 60);
        ctx.fillText('SCORE', animX + 200, animY + 60);
        ctx.fillText('KILLS', animX + 280, animY + 60);
        ctx.fillText('DEATHS', animX + 340, animY + 60);
        
        // Draw player data
        const playerArray = Array.from(this.playerData.entries());
        const maxPlayers = Math.min(playerArray.length, 8); // Show max 8 players
        
        for (let i = 0; i < maxPlayers; i++) {
            const playerId = playerArray[i][0];
            const data = playerArray[i][1];
            
            // Calculate row position
            const rowY = animY + 90 + i * 25;
            
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
            
            // Draw player title
            ctx.font = '10px Arial';
            ctx.fillText(title.title, animX + 80, rowY + 12);
            
            // Draw score
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(Math.floor(data.totalScore), animX + 310, rowY);
            
            // Draw kills
            ctx.fillText(data.kills, animX + 300, rowY);
            
            // Draw deaths
            ctx.fillText(data.deaths, animX + 360, rowY);
        }
        
        // Draw game stats
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        // Get wave number
        const waveSpawner = this.gameEngine.getSystem('waveSpawner');
        const waveNumber = waveSpawner ? waveSpawner.currentWave : 0;
        
        // Draw wave number
        ctx.fillText(`Wave: ${waveNumber}`, animX + 20, animY + animHeight - 40);
        
        // Draw total enemies killed
        const totalKills = this.getTotalKills();
        ctx.fillText(`Total Kills: ${totalKills}`, animX + 150, animY + animHeight - 40);
        
        // Draw total players
        ctx.fillText(`Players: ${this.playerData.size}`, animX + 280, animY + animHeight - 40);
        
        // Restore context state
        ctx.restore();
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
            killScore: 0,
            assistScore: 0,
            survivalScore: 0,
            damageScore: 0,
            miniBossKillScore: 0,
            bossKillScore: 0,
            totalScore: 0,
            rank: 0
        };
        
        // Add player data
        this.playerData.set(player.id, data);
        
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
        // Award assist to reviver
        const reviverData = this.playerData.get(reviver.id);
        if (reviverData) {
            reviverData.assists++;
            reviverData.assistScore += this.assistScore;
            this.updateTotalScore(reviver.id);
            window.eventSystem.emit('scoreboard:playerDataUpdate', reviver.id, reviverData);
        }
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
        } else if (enemy.hasTag && enemy.hasTag('boss')) {
            data.bossKillScore += this.bossKillScore;
        } else {
            data.killScore += this.killScore;
            data.kills++;
        }
        
        // Update total score
        this.updateTotalScore(source.id);
        
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
        
        // Update total score
        this.updateTotalScore(source.id);
        
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
        
        // Update total score
        this.updateTotalScore(source.id);
        
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
        
        // Update total score
        this.updateTotalScore(player.id);
        
        // Emit player data update event
        window.eventSystem.emit('scoreboard:playerDataUpdate', player.id, data);
    }
    
    /**
     * Handle wave complete event
     * @param {number} waveNumber - Wave number that was completed
     * @param {number} score - Current score
     */
    onWaveComplete(waveNumber, score) {
        // Award survival bonus to all players
        for (const [playerId, data] of this.playerData) {
            data.survivalScore += 50; // Flat bonus for completing wave
            this.updateTotalScore(playerId);
            window.eventSystem.emit('scoreboard:playerDataUpdate', playerId, data);
        }
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
            data.survivalScore + 
            data.damageScore + 
            data.miniBossKillScore + 
            data.bossKillScore;
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
     * Get total kills across all players
     * @returns {number} Total kills
     */
    getTotalKills() {
        let totalKills = 0;
        
        // Sum kills from all players
        for (const data of this.playerData.values()) {
            totalKills += data.kills;
        }
        
        return totalKills;
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
     * Destroy the scoreboard
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.toggle);
        document.removeEventListener('keyup', this.toggle);
        
        // Clear player data
        this.playerData.clear();
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scoreboard;
}