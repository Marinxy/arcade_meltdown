/**
 * Arcade Meltdown - Network System
 * Handles WebRTC networking for LAN play
 */

class NetworkSystem {
    /**
     * Create a new Network System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Network state
        this.isHost = false;
        this.isConnected = false;
        this.connectionId = null;
        this.roomCode = null;
        
        // WebRTC configuration
        this.rtcConfig = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        // Peer connections
        this.peers = new Map(); // connectionId -> PeerConnection
        this.dataChannels = new Map(); // connectionId -> DataChannel
        
        // Signaling server
        this.signalingServer = null;
        this.signalingConnection = null;
        
        // Network events
        this.eventHandlers = {
            onConnected: null,
            onDisconnected: null,
            onPlayerJoined: null,
            onPlayerLeft: null,
            onDataReceived: null,
            onError: null
        };
        
        // Message queue
        this.messageQueue = [];
        
        // Sync data
        this.syncData = {
            players: new Map(),
            enemies: new Map(),
            bullets: new Map(),
            gameState: null
        };
        
        // Performance metrics
        this.metrics = {
            messagesSent: 0,
            messagesReceived: 0,
            bytesSent: 0,
            bytesReceived: 0,
            latency: 0,
            updateTime: 0
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the network system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize signaling server connection
        this.initSignalingServer();
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
        
        window.eventSystem.on('player:created', (player) => {
            this.onPlayerCreated(player);
        });
        
        window.eventSystem.on('player:death', (player, source) => {
            this.onPlayerDeath(player, source);
        });
        
        window.eventSystem.on('enemy:spawned', (enemy) => {
            this.onEnemySpawned(enemy);
        });
        
        window.eventSystem.on('enemy:death', (enemy, source) => {
            this.onEnemyDeath(enemy, source);
        });
        
        window.eventSystem.on('bullet:hit', (bullet, entity, damage) => {
            this.onBulletHit(bullet, entity, damage);
        });
        
        window.eventSystem.on('wave:start', (wave, enemyCount) => {
            this.onWaveStart(wave, enemyCount);
        });
        
        window.eventSystem.on('wave:complete', (wave, score) => {
            this.onWaveComplete(wave, score);
        });
    }
    
    /**
     * Initialize signaling server connection
     */
    initSignalingServer() {
        // In a real implementation, this would connect to a WebSocket signaling server
        // For now, we'll simulate it with local storage for LAN discovery
        
        // Check if we're running in a browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
            // Set up local storage listeners for signaling
            window.addEventListener('storage', this.handleStorageEvent.bind(this));
            
            // Check for existing games
            this.checkForExistingGames();
        }
    }
    
    /**
     * Handle storage events for signaling
     * @param {StorageEvent} event - Storage event
     */
    handleStorageEvent(event) {
        // In a real implementation, this would handle signaling messages
        // For now, we'll just log the event
        console.log('Storage event:', event);
    }
    
    /**
     * Check for existing games in local storage
     */
    checkForExistingGames() {
        // In a real implementation, this would check for existing games on the LAN
        // For now, we'll just check local storage
        const existingGames = localStorage.getItem('arcadeMeltdownGames');
        
        if (existingGames) {
            try {
                const games = JSON.parse(existingGames);
                console.log('Existing games:', games);
            } catch (e) {
                console.error('Error parsing existing games:', e);
            }
        }
    }
    
    /**
     * Create a new game room
     * @returns {string} Room code
     */
    createRoom() {
        // Generate a random room code
        this.roomCode = this.generateRoomCode();
        this.isHost = true;
        
        // In a real implementation, this would register the room with the signaling server
        // For now, we'll store it in local storage
        this.registerRoom();
        
        // Emit room created event
        window.eventSystem.emit('network:roomCreated', this.roomCode);
        
        return this.roomCode;
    }
    
    /**
     * Generate a random room code
     * @returns {string} Room code
     */
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }
    
    /**
     * Register the room with local storage
     */
    registerRoom() {
        // In a real implementation, this would register with the signaling server
        // For now, we'll store it in local storage
        const games = this.getExistingGames();
        games[this.roomCode] = {
            host: this.connectionId || 'host',
            created: Date.now(),
            players: []
        };
        
        localStorage.setItem('arcadeMeltdownGames', JSON.stringify(games));
    }
    
    /**
     * Get existing games from local storage
     * @returns {object} Existing games
     */
    getExistingGames() {
        const existingGames = localStorage.getItem('arcadeMeltdownGames');
        
        if (existingGames) {
            try {
                return JSON.parse(existingGames);
            } catch (e) {
                console.error('Error parsing existing games:', e);
                return {};
            }
        }
        
        return {};
    }
    
    /**
     * Join a game room
     * @param {string} roomCode - Room code to join
     * @returns {boolean} True if successfully joined
     */
    joinRoom(roomCode) {
        this.roomCode = roomCode;
        this.isHost = false;
        
        // In a real implementation, this would connect to the signaling server
        // For now, we'll just check local storage
        const games = this.getExistingGames();
        
        if (!games[roomCode]) {
            // Room doesn't exist
            this.emitError('Room not found');
            return false;
        }
        
        // Add player to room
        if (!games[roomCode].players) {
            games[roomCode].players = [];
        }
        
        this.connectionId = this.generateConnectionId();
        games[roomCode].players.push(this.connectionId);
        
        localStorage.setItem('arcadeMeltdownGames', JSON.stringify(games));
        
        // Emit room joined event
        window.eventSystem.emit('network:roomJoined', roomCode);
        
        return true;
    }
    
    /**
     * Generate a connection ID
     * @returns {string} Connection ID
     */
    generateConnectionId() {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Leave the current room
     */
    leaveRoom() {
        if (!this.roomCode) return;
        
        // In a real implementation, this would notify the signaling server
        // For now, we'll update local storage
        const games = this.getExistingGames();
        
        if (games[this.roomCode]) {
            // Remove player from room
            if (games[this.roomCode].players) {
                const index = games[this.roomCode].players.indexOf(this.connectionId);
                if (index !== -1) {
                    games[this.roomCode].players.splice(index, 1);
                }
            }
            
            // If room is empty and we're not the host, remove it
            if (games[this.roomCode].players.length === 0 && !this.isHost) {
                delete games[this.roomCode];
            }
            
            localStorage.setItem('arcadeMeltdownGames', JSON.stringify(games));
        }
        
        // Close all peer connections
        this.closeAllPeerConnections();
        
        // Reset state
        this.roomCode = null;
        this.isHost = false;
        this.isConnected = false;
        
        // Emit room left event
        window.eventSystem.emit('network:roomLeft');
    }
    
    /**
     * Create a peer connection
     * @param {string} connectionId - Connection ID
     * @param {boolean} isInitiator - Whether this peer initiates the connection
     * @returns {RTCPeerConnection} Peer connection
     */
    createPeerConnection(connectionId, isInitiator) {
        // Create peer connection
        const peerConnection = new RTCPeerConnection(this.rtcConfig);
        
        // Store peer connection
        this.peers.set(connectionId, peerConnection);
        
        // Set up event handlers
        peerConnection.onicecandidate = (event) => {
            this.handleIceCandidate(connectionId, event);
        };
        
        peerConnection.onconnectionstatechange = () => {
            this.handleConnectionStateChange(connectionId, peerConnection.connectionState);
        };
        
        peerConnection.ondatachannel = (event) => {
            this.handleDataChannel(connectionId, event.channel);
        };
        
        // Create data channel if we're the initiator
        if (isInitiator) {
            const dataChannel = peerConnection.createDataChannel('gameData');
            this.setupDataChannel(connectionId, dataChannel);
        }
        
        return peerConnection;
    }
    
    /**
     * Set up a data channel
     * @param {string} connectionId - Connection ID
     * @param {RTCDataChannel} dataChannel - Data channel
     */
    setupDataChannel(connectionId, dataChannel) {
        // Store data channel
        this.dataChannels.set(connectionId, dataChannel);
        
        // Set up event handlers
        dataChannel.onopen = () => {
            this.handleDataChannelOpen(connectionId);
        };
        
        dataChannel.onclose = () => {
            this.handleDataChannelClose(connectionId);
        };
        
        dataChannel.onmessage = (event) => {
            this.handleDataChannelMessage(connectionId, event);
        };
        
        dataChannel.onerror = (error) => {
            this.handleDataChannelError(connectionId, error);
        };
    }
    
    /**
     * Handle ICE candidate
     * @param {string} connectionId - Connection ID
     * @param {RTCPeerConnectionIceEvent} event - ICE candidate event
     */
    handleIceCandidate(connectionId, event) {
        if (event.candidate) {
            // In a real implementation, this would send the candidate to the other peer via signaling
            console.log('ICE candidate:', event.candidate);
        }
    }
    
    /**
     * Handle connection state change
     * @param {string} connectionId - Connection ID
     * @param {RTCPeerConnectionState} connectionState - Connection state
     */
    handleConnectionStateChange(connectionId, connectionState) {
        console.log(`Connection ${connectionId} state changed to ${connectionState}`);
        
        if (connectionState === 'connected') {
            this.isConnected = true;
            this.emitConnected(connectionId);
        } else if (connectionState === 'disconnected' || connectionState === 'failed') {
            this.isConnected = false;
            this.emitDisconnected(connectionId);
        }
    }
    
    /**
     * Handle data channel
     * @param {string} connectionId - Connection ID
     * @param {RTCDataChannel} dataChannel - Data channel
     */
    handleDataChannel(connectionId, dataChannel) {
        this.setupDataChannel(connectionId, dataChannel);
    }
    
    /**
     * Handle data channel open
     * @param {string} connectionId - Connection ID
     */
    handleDataChannelOpen(connectionId) {
        console.log(`Data channel open for connection ${connectionId}`);
        
        // Send initial sync data
        this.sendSyncData(connectionId);
    }
    
    /**
     * Handle data channel close
     * @param {string} connectionId - Connection ID
     */
    handleDataChannelClose(connectionId) {
        console.log(`Data channel closed for connection ${connectionId}`);
        
        // Remove data channel
        this.dataChannels.delete(connectionId);
    }
    
    /**
     * Handle data channel message
     * @param {string} connectionId - Connection ID
     * @param {MessageEvent} event - Message event
     */
    handleDataChannelMessage(connectionId, event) {
        // Update metrics
        this.metrics.messagesReceived++;
        this.metrics.bytesReceived += event.data.size || 0;
        
        // Parse message
        try {
            const message = JSON.parse(event.data);
            this.handleNetworkMessage(connectionId, message);
        } catch (e) {
            console.error('Error parsing network message:', e);
        }
    }
    
    /**
     * Handle data channel error
     * @param {string} connectionId - Connection ID
     * @param {Event} error - Error event
     */
    handleDataChannelError(connectionId, error) {
        console.error(`Data channel error for connection ${connectionId}:`, error);
        this.emitError(`Data channel error: ${error.message}`);
    }
    
    /**
     * Handle network message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Network message
     */
    handleNetworkMessage(connectionId, message) {
        // Handle different message types
        switch (message.type) {
            case 'sync':
                this.handleSyncMessage(connectionId, message);
                break;
                
            case 'playerUpdate':
                this.handlePlayerUpdateMessage(connectionId, message);
                break;
                
            case 'enemyUpdate':
                this.handleEnemyUpdateMessage(connectionId, message);
                break;
                
            case 'bulletUpdate':
                this.handleBulletUpdateMessage(connectionId, message);
                break;
                
            case 'gameStateUpdate':
                this.handleGameStateUpdateMessage(connectionId, message);
                break;
                
            case 'chat':
                this.handleChatMessage(connectionId, message);
                break;
                
            default:
                console.warn('Unknown message type:', message.type);
        }
        
        // Emit data received event
        if (this.eventHandlers.onDataReceived) {
            this.eventHandlers.onDataReceived(connectionId, message);
        }
    }
    
    /**
     * Handle sync message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Sync message
     */
    handleSyncMessage(connectionId, message) {
        // Update sync data
        if (message.players) {
            for (const [id, playerData] of Object.entries(message.players)) {
                this.syncData.players.set(id, playerData);
            }
        }
        
        if (message.enemies) {
            for (const [id, enemyData] of Object.entries(message.enemies)) {
                this.syncData.enemies.set(id, enemyData);
            }
        }
        
        if (message.bullets) {
            for (const [id, bulletData] of Object.entries(message.bullets)) {
                this.syncData.bullets.set(id, bulletData);
            }
        }
        
        if (message.gameState) {
            this.syncData.gameState = message.gameState;
        }
        
        // Emit sync complete event
        window.eventSystem.emit('network:syncComplete', connectionId);
    }
    
    /**
     * Handle player update message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Player update message
     */
    handlePlayerUpdateMessage(connectionId, message) {
        // Update player in sync data
        this.syncData.players.set(message.playerId, message.data);
        
        // Update player entity if it exists
        const player = this.gameEngine.getEntity(message.playerId);
        if (player) {
            player.deserialize(message.data);
        }
        
        // Emit player updated event
        window.eventSystem.emit('network:playerUpdated', message.playerId, message.data);
    }
    
    /**
     * Handle enemy update message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Enemy update message
     */
    handleEnemyUpdateMessage(connectionId, message) {
        // Update enemy in sync data
        this.syncData.enemies.set(message.enemyId, message.data);
        
        // Update enemy entity if it exists
        const enemy = this.gameEngine.getEntity(message.enemyId);
        if (enemy) {
            enemy.deserialize(message.data);
        }
        
        // Emit enemy updated event
        window.eventSystem.emit('network:enemyUpdated', message.enemyId, message.data);
    }
    
    /**
     * Handle bullet update message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Bullet update message
     */
    handleBulletUpdateMessage(connectionId, message) {
        // Update bullet in sync data
        this.syncData.bullets.set(message.bulletId, message.data);
        
        // Update bullet entity if it exists
        const bullet = this.gameEngine.getEntity(message.bulletId);
        if (bullet) {
            bullet.deserialize(message.data);
        }
        
        // Emit bullet updated event
        window.eventSystem.emit('network:bulletUpdated', message.bulletId, message.data);
    }
    
    /**
     * Handle game state update message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Game state update message
     */
    handleGameStateUpdateMessage(connectionId, message) {
        // Update game state in sync data
        this.syncData.gameState = message.data;
        
        // Update game engine state
        this.gameEngine.wave = message.data.wave;
        this.gameEngine.score = message.data.score;
        this.gameEngine.chaosLevel = message.data.chaosLevel;
        
        // Emit game state updated event
        window.eventSystem.emit('network:gameStateUpdated', message.data);
    }
    
    /**
     * Handle chat message
     * @param {string} connectionId - Connection ID
     * @param {object} message - Chat message
     */
    handleChatMessage(connectionId, message) {
        // Emit chat message event
        window.eventSystem.emit('network:chatMessage', connectionId, message.text);
    }
    
    /**
     * Send a message to all connected peers
     * @param {object} message - Message to send
     */
    broadcast(message) {
        for (const [connectionId, dataChannel] of this.dataChannels) {
            if (dataChannel.readyState === 'open') {
                this.sendMessage(connectionId, message);
            }
        }
    }
    
    /**
     * Send a message to a specific peer
     * @param {string} connectionId - Connection ID
     * @param {object} message - Message to send
     */
    sendMessage(connectionId, message) {
        const dataChannel = this.dataChannels.get(connectionId);
        
        if (!dataChannel || dataChannel.readyState !== 'open') {
            console.warn(`Cannot send message to ${connectionId}: data channel not open`);
            return false;
        }
        
        try {
            // Serialize message
            const data = JSON.stringify(message);
            
            // Send message
            dataChannel.send(data);
            
            // Update metrics
            this.metrics.messagesSent++;
            this.metrics.bytesSent += data.length;
            
            return true;
        } catch (e) {
            console.error(`Error sending message to ${connectionId}:`, e);
            return false;
        }
    }
    
    /**
     * Send sync data to a specific peer
     * @param {string} connectionId - Connection ID
     */
    sendSyncData(connectionId) {
        // Collect sync data
        const syncData = {
            type: 'sync',
            players: {},
            enemies: {},
            bullets: {},
            gameState: {
                wave: this.gameEngine.wave,
                score: this.gameEngine.score,
                chaosLevel: this.gameEngine.chaosLevel
            }
        };
        
        // Add player data
        for (const [id, entity] of this.gameEngine.entities) {
            if (entity.hasTag('player')) {
                syncData.players[id] = entity.serialize();
            }
        }
        
        // Add enemy data
        for (const [id, entity] of this.gameEngine.entities) {
            if (entity.hasTag('enemy')) {
                syncData.enemies[id] = entity.serialize();
            }
        }
        
        // Add bullet data
        for (const [id, entity] of this.gameEngine.entities) {
            if (entity.hasTag('bullet')) {
                syncData.bullets[id] = entity.serialize();
            }
        }
        
        // Send sync data
        this.sendMessage(connectionId, syncData);
    }
    
    /**
     * Send player update
     * @param {Player} player - Player to update
     */
    sendPlayerUpdate(player) {
        const message = {
            type: 'playerUpdate',
            playerId: player.id,
            data: player.serialize()
        };
        
        this.broadcast(message);
    }
    
    /**
     * Send enemy update
     * @param {Enemy} enemy - Enemy to update
     */
    sendEnemyUpdate(enemy) {
        const message = {
            type: 'enemyUpdate',
            enemyId: enemy.id,
            data: enemy.serialize()
        };
        
        this.broadcast(message);
    }
    
    /**
     * Send bullet update
     * @param {Bullet} bullet - Bullet to update
     */
    sendBulletUpdate(bullet) {
        const message = {
            type: 'bulletUpdate',
            bulletId: bullet.id,
            data: bullet.serialize()
        };
        
        this.broadcast(message);
    }
    
    /**
     * Send game state update
     */
    sendGameStateUpdate() {
        const message = {
            type: 'gameStateUpdate',
            data: {
                wave: this.gameEngine.wave,
                score: this.gameEngine.score,
                chaosLevel: this.gameEngine.chaosLevel
            }
        };
        
        this.broadcast(message);
    }
    
    /**
     * Send chat message
     * @param {string} text - Chat message text
     */
    sendChatMessage(text) {
        const message = {
            type: 'chat',
            text: text,
            sender: this.connectionId
        };
        
        this.broadcast(message);
    }
    
    /**
     * Close a peer connection
     * @param {string} connectionId - Connection ID
     */
    closePeerConnection(connectionId) {
        const peerConnection = this.peers.get(connectionId);
        
        if (peerConnection) {
            // Close data channel
            const dataChannel = this.dataChannels.get(connectionId);
            if (dataChannel) {
                dataChannel.close();
                this.dataChannels.delete(connectionId);
            }
            
            // Close peer connection
            peerConnection.close();
            this.peers.delete(connectionId);
        }
    }
    
    /**
     * Close all peer connections
     */
    closeAllPeerConnections() {
        for (const [connectionId, peerConnection] of this.peers) {
            this.closePeerConnection(connectionId);
        }
    }
    
    /**
     * Update the network system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Start performance measurement
        const startTime = performance.now();
        
        // Process message queue
        this.processMessageQueue();
        
        // Send periodic updates
        this.sendPeriodicUpdates(deltaTime);
        
        // End performance measurement
        const endTime = performance.now();
        this.metrics.updateTime = endTime - startTime;
        
        // Emit network metrics event
        window.eventSystem.emit('network:metrics', this.metrics);
    }
    
    /**
     * Process message queue
     */
    processMessageQueue() {
        // Process queued messages
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.broadcast(message);
        }
    }
    
    /**
     * Send periodic updates
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    sendPeriodicUpdates(deltaTime) {
        // Send game state update periodically
        static let gameStateUpdateTimer = 0;
        gameStateUpdateTimer += deltaTime;
        
        if (gameStateUpdateTimer >= 0.5) { // Update every 0.5 seconds
            this.sendGameStateUpdate();
            gameStateUpdateTimer = 0;
        }
    }
    
    /**
     * Handle game start event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameStart(gameEngine) {
        // Send game state update
        this.sendGameStateUpdate();
    }
    
    /**
     * Handle game over event
     * @param {GameEngine} gameEngine - The game engine
     */
    onGameOver(gameEngine) {
        // Send game state update
        this.sendGameStateUpdate();
    }
    
    /**
     * Handle player created event
     * @param {Player} player - The player that was created
     */
    onPlayerCreated(player) {
        // Send player update
        this.sendPlayerUpdate(player);
    }
    
    /**
     * Handle player death event
     * @param {Player} player - The player that died
     * @param {object} source - Source of death
     */
    onPlayerDeath(player, source) {
        // Send player update
        this.sendPlayerUpdate(player);
    }
    
    /**
     * Handle enemy spawned event
     * @param {Enemy} enemy - The enemy that was spawned
     */
    onEnemySpawned(enemy) {
        // Send enemy update
        this.sendEnemyUpdate(enemy);
    }
    
    /**
     * Handle enemy death event
     * @param {Enemy} enemy - The enemy that died
     * @param {object} source - Source of death
     */
    onEnemyDeath(enemy, source) {
        // Send enemy update
        this.sendEnemyUpdate(enemy);
    }
    
    /**
     * Handle bullet hit event
     * @param {Bullet} bullet - The bullet that hit
     * @param {Entity} entity - Entity that was hit
     * @param {number} damage - Amount of damage
     */
    onBulletHit(bullet, entity, damage) {
        // Send bullet update
        this.sendBulletUpdate(bullet);
    }
    
    /**
     * Handle wave start event
     * @param {number} wave - Wave number
     * @param {number} enemyCount - Number of enemies
     */
    onWaveStart(wave, enemyCount) {
        // Send game state update
        this.sendGameStateUpdate();
    }
    
    /**
     * Handle wave complete event
     * @param {number} wave - Wave number
     * @param {number} score - Current score
     */
    onWaveComplete(wave, score) {
        // Send game state update
        this.sendGameStateUpdate();
    }
    
    /**
     * Set an event handler
     * @param {string} event - Event type
     * @param {Function} handler - Event handler function
     */
    setEventHandler(event, handler) {
        if (this.eventHandlers.hasOwnProperty(event)) {
            this.eventHandlers[event] = handler;
        }
    }
    
    /**
     * Emit connected event
     * @param {string} connectionId - Connection ID
     */
    emitConnected(connectionId) {
        if (this.eventHandlers.onConnected) {
            this.eventHandlers.onConnected(connectionId);
        }
    }
    
    /**
     * Emit disconnected event
     * @param {string} connectionId - Connection ID
     */
    emitDisconnected(connectionId) {
        if (this.eventHandlers.onDisconnected) {
            this.eventHandlers.onDisconnected(connectionId);
        }
    }
    
    /**
     * Emit error event
     * @param {string} error - Error message
     */
    emitError(error) {
        if (this.eventHandlers.onError) {
            this.eventHandlers.onError(error);
        }
    }
    
    /**
     * Get network status
     * @returns {object} Network status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            isHost: this.isHost,
            roomCode: this.roomCode,
            connectionId: this.connectionId,
            peerCount: this.peers.size
        };
    }
    
    /**
     * Get network metrics
     * @returns {object} Network metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    
    /**
     * Destroy the network system
     */
    destroy() {
        // Leave room
        this.leaveRoom();
        
        // Close all peer connections
        this.closeAllPeerConnections();
        
        // Clear event handlers
        for (const handler in this.eventHandlers) {
            this.eventHandlers[handler] = null;
        }
        
        // Clear message queue
        this.messageQueue.length = 0;
        
        // Clear sync data
        this.syncData.players.clear();
        this.syncData.enemies.clear();
        this.syncData.bullets.clear();
        this.syncData.gameState = null;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkSystem;
}