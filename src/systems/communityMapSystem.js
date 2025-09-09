/**
 * Arcade Meltdown - Community Map System
 * Manages community-created maps and map sharing
 */

class CommunityMapSystem {
    /**
     * Create a new community map system
     * @param {GameEngine} gameEngine - The game engine instance
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Map storage
        this.maps = new Map();
        this.currentMap = null;
        this.mapCategories = {
            featured: {
                name: "Featured",
                description: "Officially selected community maps",
                maps: []
            },
            popular: {
                name: "Popular",
                description: "Most played community maps",
                maps: []
            },
            recent: {
                name: "Recent",
                description: "Newest community maps",
                maps: []
            },
            my_maps: {
                name: "My Maps",
                description: "Maps you've created",
                maps: []
            }
        };
        
        // Map editor
        this.mapEditor = null;
        this.isEditing = false;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the community map system
     */
    init() {
        // Load maps from storage
        this.loadMaps();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game events
        window.eventSystem.on('game:start', (gameEngine) => {
            this.onGameStart(gameEngine);
        });
        
        window.eventSystem.on('map:load', (mapId) => {
            this.loadMap(mapId);
        });
        
        window.eventSystem.on('map:save', (mapData) => {
            this.saveMap(mapData);
        });
        
        window.eventSystem.on('map:delete', (mapId) => {
            this.deleteMap(mapId);
        });
        
        window.eventSystem.on('map:publish', (mapId) => {
            this.publishMap(mapId);
        });
        
        window.eventSystem.on('map:rate', (mapId, rating) => {
            this.rateMap(mapId, rating);
        });
        
        window.eventSystem.on('map:download', (mapId) => {
            this.downloadMap(mapId);
        });
        
        window.eventSystem.on('map:share', (mapId) => {
            this.shareMap(mapId);
        });
        
        window.eventSystem.on('editor:start', () => {
            this.startEditor();
        });
        
        window.eventSystem.on('editor:stop', () => {
            this.stopEditor();
        });
        
        window.eventSystem.on('editor:test', () => {
            this.testMap();
        });
    }
    
    /**
     * Load maps from local storage
     */
    loadMaps() {
        try {
            // Load maps from local storage
            const savedMaps = localStorage.getItem('arcademeltdown_community_maps');
            if (savedMaps) {
                const maps = JSON.parse(savedMaps);
                for (const map of maps) {
                    this.maps.set(map.id, map);
                    
                    // Add to appropriate categories
                    if (map.published) {
                        if (map.featured) {
                            this.mapCategories.featured.maps.push(map.id);
                        }
                        this.mapCategories.popular.maps.push(map.id);
                        this.mapCategories.recent.maps.push(map.id);
                    } else if (map.author === this.getLocalPlayerId()) {
                        this.mapCategories.my_maps.maps.push(map.id);
                    }
                }
            }
            
            // Sort categories
            this.sortCategories();
        } catch (error) {
            console.error('Failed to load community maps:', error);
        }
    }
    
    /**
     * Save maps to local storage
     */
    saveMaps() {
        try {
            const maps = Array.from(this.maps.values());
            localStorage.setItem('arcademeltdown_community_maps', JSON.stringify(maps));
        } catch (error) {
            console.error('Failed to save community maps:', error);
        }
    }
    
    /**
     * Get the local player ID
     * @returns {string} Player ID
     */
    getLocalPlayerId() {
        // In a real implementation, this would get the actual player ID
        return 'local_player';
    }
    
    /**
     * Sort map categories
     */
    sortCategories() {
        // Sort popular by play count
        this.mapCategories.popular.maps.sort((a, b) => {
            const mapA = this.maps.get(a);
            const mapB = this.maps.get(b);
            return (mapB?.playCount || 0) - (mapA?.playCount || 0);
        });
        
        // Sort recent by creation date
        this.mapCategories.recent.maps.sort((a, b) => {
            const mapA = this.maps.get(a);
            const mapB = this.maps.get(b);
            return (mapB?.createdAt || 0) - (mapA?.createdAt || 0);
        });
        
        // Keep only top 10 for each category
        this.mapCategories.popular.maps = this.mapCategories.popular.maps.slice(0, 10);
        this.mapCategories.recent.maps = this.mapCategories.recent.maps.slice(0, 10);
    }
    
    /**
     * Create a new map
     * @param {object} mapData - Map data
     * @returns {string} Map ID
     */
    createMap(mapData) {
        const mapId = this.generateMapId();
        
        // Create map object
        const map = {
            id: mapId,
            name: mapData.name || "Untitled Map",
            description: mapData.description || "",
            author: this.getLocalPlayerId(),
            authorName: mapData.authorName || "Anonymous",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            published: false,
            featured: false,
            tiles: mapData.tiles || [],
            width: mapData.width || 40,
            height: mapData.height || 30,
            tileSize: mapData.tileSize || 40,
            spawnPoints: mapData.spawnPoints || [],
            objectives: mapData.objectives || [],
            difficulty: mapData.difficulty || "medium",
            tags: mapData.tags || [],
            playCount: 0,
            rating: 0,
            ratingCount: 0,
            downloads: 0
        };
        
        // Add to maps
        this.maps.set(mapId, map);
        
        // Add to my maps category
        this.mapCategories.my_maps.maps.push(mapId);
        
        // Save maps
        this.saveMaps();
        
        // Emit map created event
        window.eventSystem.emit('map:created', mapId);
        
        return mapId;
    }
    
    /**
     * Save a map
     * @param {object} mapData - Map data
     * @returns {string} Map ID
     */
    saveMap(mapData) {
        let map;
        
        if (mapData.id) {
            // Update existing map
            map = this.maps.get(mapData.id);
            if (!map) {
                return this.createMap(mapData);
            }
            
            // Update map data
            map.name = mapData.name || map.name;
            map.description = mapData.description || map.description;
            map.tiles = mapData.tiles || map.tiles;
            map.width = mapData.width || map.width;
            map.height = mapData.height || map.height;
            map.tileSize = mapData.tileSize || map.tileSize;
            map.spawnPoints = mapData.spawnPoints || map.spawnPoints;
            map.objectives = mapData.objectives || map.objectives;
            map.difficulty = mapData.difficulty || map.difficulty;
            map.tags = mapData.tags || map.tags;
            map.updatedAt = Date.now();
        } else {
            // Create new map
            return this.createMap(mapData);
        }
        
        // Save maps
        this.saveMaps();
        
        // Emit map saved event
        window.eventSystem.emit('map:saved', map.id);
        
        return map.id;
    }
    
    /**
     * Load a map
     * @param {string} mapId - Map ID
     * @returns {object|null} Map data or null if not found
     */
    loadMap(mapId) {
        const map = this.maps.get(mapId);
        if (!map) {
            console.warn(`Map not found: ${mapId}`);
            return null;
        }
        
        // Set as current map
        this.currentMap = mapId;
        
        // Update play count
        map.playCount = (map.playCount || 0) + 1;
        this.saveMaps();
        
        // Load map into arena
        this.loadMapIntoArena(map);
        
        // Emit map loaded event
        window.eventSystem.emit('map:loaded', mapId);
        
        return map;
    }
    
    /**
     * Load map into arena
     * @param {object} map - Map data
     */
    loadMapIntoArena(map) {
        // Update arena dimensions
        this.gameEngine.arena.width = map.width * map.tileSize;
        this.gameEngine.arena.height = map.height * map.tileSize;
        this.gameEngine.arena.tileSize = map.tileSize;
        
        // Create tiles array
        this.gameEngine.arena.tiles = [];
        for (let y = 0; y < map.height; y++) {
            this.gameEngine.arena.tiles[y] = [];
            for (let x = 0; x < map.width; x++) {
                const index = y * map.width + x;
                this.gameEngine.arena.tiles[y][x] = map.tiles[index] || 0;
            }
        }
        
        // Update canvas size if needed
        if (this.gameEngine.canvas.width !== this.gameEngine.arena.width ||
            this.gameEngine.canvas.height !== this.gameEngine.arena.height) {
            this.gameEngine.canvas.width = this.gameEngine.arena.width;
            this.gameEngine.canvas.height = this.gameEngine.arena.height;
        }
    }
    
    /**
     * Delete a map
     * @param {string} mapId - Map ID
     * @returns {boolean} Whether the map was deleted
     */
    deleteMap(mapId) {
        const map = this.maps.get(mapId);
        if (!map) {
            return false;
        }
        
        // Check if user is the author
        if (map.author !== this.getLocalPlayerId()) {
            console.warn('Cannot delete map: not the author');
            return false;
        }
        
        // Remove from maps
        this.maps.delete(mapId);
        
        // Remove from categories
        for (const category of Object.values(this.mapCategories)) {
            const index = category.maps.indexOf(mapId);
            if (index !== -1) {
                category.maps.splice(index, 1);
            }
        }
        
        // Save maps
        this.saveMaps();
        
        // Emit map deleted event
        window.eventSystem.emit('map:deleted', mapId);
        
        return true;
    }
    
    /**
     * Publish a map
     * @param {string} mapId - Map ID
     * @returns {boolean} Whether the map was published
     */
    publishMap(mapId) {
        const map = this.maps.get(mapId);
        if (!map) {
            return false;
        }
        
        // Check if user is the author
        if (map.author !== this.getLocalPlayerId()) {
            console.warn('Cannot publish map: not the author');
            return false;
        }
        
        // Publish map
        map.published = true;
        map.publishedAt = Date.now();
        
        // Add to categories
        this.mapCategories.popular.maps.push(mapId);
        this.mapCategories.recent.maps.push(mapId);
        
        // Remove from my maps if it's there
        const myMapsIndex = this.mapCategories.my_maps.maps.indexOf(mapId);
        if (myMapsIndex !== -1) {
            this.mapCategories.my_maps.maps.splice(myMapsIndex, 1);
        }
        
        // Sort categories
        this.sortCategories();
        
        // Save maps
        this.saveMaps();
        
        // Emit map published event
        window.eventSystem.emit('map:published', mapId);
        
        return true;
    }
    
    /**
     * Rate a map
     * @param {string} mapId - Map ID
     * @param {number} rating - Rating (1-5)
     * @returns {boolean} Whether the rating was saved
     */
    rateMap(mapId, rating) {
        const map = this.maps.get(mapId);
        if (!map) {
            return false;
        }
        
        // Validate rating
        rating = Math.max(1, Math.min(5, rating));
        
        // Get previous rating
        const ratingsKey = `arcademeltdown_map_ratings_${this.getLocalPlayerId()}`;
        let ratings = {};
        try {
            const savedRatings = localStorage.getItem(ratingsKey);
            if (savedRatings) {
                ratings = JSON.parse(savedRatings);
            }
        } catch (error) {
            console.error('Failed to load map ratings:', error);
        }
        
        const previousRating = ratings[mapId];
        
        // Update rating
        ratings[mapId] = rating;
        
        // Save ratings
        try {
            localStorage.setItem(ratingsKey, JSON.stringify(ratings));
        } catch (error) {
            console.error('Failed to save map ratings:', error);
        }
        
        // Update map rating
        if (previousRating) {
            // Adjust total rating
            map.rating = ((map.rating * map.ratingCount) - previousRating + rating) / map.ratingCount;
        } else {
            // Add new rating
            map.rating = ((map.rating * map.ratingCount) + rating) / (map.ratingCount + 1);
            map.ratingCount++;
        }
        
        // Save maps
        this.saveMaps();
        
        // Emit map rated event
        window.eventSystem.emit('map:rated', mapId, rating);
        
        return true;
    }
    
    /**
     * Download a map
     * @param {string} mapId - Map ID
     * @returns {boolean} Whether the download was successful
     */
    downloadMap(mapId) {
        const map = this.maps.get(mapId);
        if (!map) {
            return false;
        }
        
        // Create a copy of the map for the user
        const mapCopy = {
            ...map,
            id: this.generateMapId(),
            author: this.getLocalPlayerId(),
            authorName: "You",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            published: false,
            featured: false,
            playCount: 0,
            rating: 0,
            ratingCount: 0,
            downloads: 0,
            originalAuthor: map.author,
            originalMapId: map.id
        };
        
        // Add to maps
        this.maps.set(mapCopy.id, mapCopy);
        
        // Add to my maps category
        this.mapCategories.my_maps.maps.push(mapCopy.id);
        
        // Increment download count
        map.downloads = (map.downloads || 0) + 1;
        this.saveMaps();
        
        // Emit map downloaded event
        window.eventSystem.emit('map:downloaded', mapCopy.id);
        
        return true;
    }
    
    /**
     * Share a map
     * @param {string} mapId - Map ID
     * @returns {string} Share URL
     */
    shareMap(mapId) {
        const map = this.maps.get(mapId);
        if (!map || !map.published) {
            return "";
        }
        
        // In a real implementation, this would generate a shareable URL
        const shareUrl = `${window.location.origin}/map/${mapId}`;
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    console.log('Map share URL copied to clipboard');
                })
                .catch(error => {
                    console.error('Failed to copy share URL:', error);
                });
        }
        
        // Emit map shared event
        window.eventSystem.emit('map:shared', mapId, shareUrl);
        
        return shareUrl;
    }
    
    /**
     * Start the map editor
     */
    startEditor() {
        if (this.isEditing) {
            return;
        }
        
        this.isEditing = true;
        
        // Import MapEditor class (circular dependency workaround)
        const MapEditor = require('../ui/mapEditor.js').default || window.MapEditor;
        
        // Create map editor
        this.mapEditor = new MapEditor(this.gameEngine, this);
        
        // Pause the game
        if (this.gameEngine.gameState === 'playing') {
            this.gameEngine.gameState = 'paused';
        }
        
        // Emit editor started event
        window.eventSystem.emit('editor:started');
    }
    
    /**
     * Stop the map editor
     */
    stopEditor() {
        if (!this.isEditing || !this.mapEditor) {
            return;
        }
        
        this.isEditing = false;
        
        // Destroy map editor
        this.mapEditor.destroy();
        this.mapEditor = null;
        
        // Resume the game if it was playing
        if (this.gameEngine.gameState === 'paused') {
            this.gameEngine.gameState = 'playing';
        }
        
        // Emit editor stopped event
        window.eventSystem.emit('editor:stopped');
    }
    
    /**
     * Test the current map in the editor
     */
    testMap() {
        if (!this.isEditing || !this.mapEditor) {
            return;
        }
        
        // Get current map data from editor
        const mapData = this.mapEditor.getMapData();
        
        // Save map temporarily
        const tempMapId = this.saveMap(mapData);
        
        // Load map
        this.loadMap(tempMapId);
        
        // Start game
        this.gameEngine.startGame('grunt');
        
        // Emit editor test event
        window.eventSystem.emit('editor:test', tempMapId);
    }
    
    /**
     * Get a map by ID
     * @param {string} mapId - Map ID
     * @returns {object|null} Map data or null if not found
     */
    getMap(mapId) {
        return this.maps.get(mapId) || null;
    }
    
    /**
     * Get all maps in a category
     * @param {string} category - Category name
     * @returns {Array} Array of map IDs
     */
    getMapsByCategory(category) {
        return this.mapCategories[category]?.maps || [];
    }
    
    /**
     * Get all maps
     * @returns {Array} Array of all maps
     */
    getAllMaps() {
        return Array.from(this.maps.values());
    }
    
    /**
     * Get maps by tag
     * @param {string} tag - Tag to search for
     * @returns {Array} Array of maps with the tag
     */
    getMapsByTag(tag) {
        return Array.from(this.maps.values()).filter(map => 
            map.tags && map.tags.includes(tag)
        );
    }
    
    /**
     * Search maps
     * @param {string} query - Search query
     * @returns {Array} Array of matching maps
     */
    searchMaps(query) {
        query = query.toLowerCase().trim();
        
        if (!query) {
            return [];
        }
        
        return Array.from(this.maps.values()).filter(map => {
            return map.name.toLowerCase().includes(query) ||
                   map.description.toLowerCase().includes(query) ||
                   map.authorName.toLowerCase().includes(query) ||
                   (map.tags && map.tags.some(tag => tag.toLowerCase().includes(query)));
        });
    }
    
    /**
     * Generate a unique map ID
     * @returns {string} Map ID
     */
    generateMapId() {
        return `map_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    }
    
    /**
     * Handle game start
     * @param {GameEngine} gameEngine - Game engine instance
     */
    onGameStart(gameEngine) {
        // Nothing specific to do here
    }
    
    /**
     * Update the community map system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Nothing to update here
    }
    
    /**
     * Destroy the community map system
     */
    destroy() {
        // Stop editor if active
        if (this.isEditing) {
            this.stopEditor();
        }
        
        // Save maps
        this.saveMaps();
    }
}

// Export for use in modules
export default CommunityMapSystem;