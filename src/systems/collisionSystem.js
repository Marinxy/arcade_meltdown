/**
 * Arcade Meltdown - Collision System
 * Handles collision detection and response between entities
 */

class CollisionSystem {
    /**
     * Create a new Collision System
     * @param {GameEngine} gameEngine - Reference to the game engine
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Collision pairs to check
        this.collisionPairs = [
            { type1: 'player', type2: 'enemy' },
            { type1: 'player', type2: 'bullet' },
            { type1: 'enemy', type2: 'bullet' },
            { type1: 'bullet', type2: 'arena' },
            { type1: 'player', type2: 'arena' },
            { type1: 'enemy', type2: 'arena' }
        ];
        
        // Spatial partitioning grid for optimization
        this.grid = {
            cellSize: 100,
            cells: new Map()
        };
        
        // Collision callbacks
        this.callbacks = {
            onCollision: null,
            onPlayerEnemyCollision: null,
            onPlayerBulletCollision: null,
            onEnemyBulletCollision: null,
            onBulletArenaCollision: null,
            onPlayerArenaCollision: null,
            onEnemyArenaCollision: null
        };
        
        // Performance metrics
        this.metrics = {
            collisionChecks: 0,
            collisionsDetected: 0,
            updateTime: 0
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the collision system
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize spatial grid
        this.initSpatialGrid();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for bullet events
        window.eventSystem.on('bullet:destroy', (bullet) => {
            this.onBulletDestroy(bullet);
        });
        
        // Listen for entity events
        window.eventSystem.on('entity:destroy', (entity) => {
            this.onEntityDestroy(entity);
        });
    }
    
    /**
     * Initialize spatial grid
     */
    initSpatialGrid() {
        // Calculate grid dimensions
        const gridWidth = Math.ceil(this.gameEngine.arena.width / this.grid.cellSize);
        const gridHeight = Math.ceil(this.gameEngine.arena.height / this.grid.cellSize);
        
        // Initialize grid cells
        this.grid.cells.clear();
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const cellKey = `${x},${y}`;
                this.grid.cells.set(cellKey, []);
            }
        }
    }
    
    /**
     * Update the collision system
     * @param {number} deltaTime - Fixed delta time in seconds
     */
    update(deltaTime) {
        // Start performance measurement
        const startTime = performance.now();
        
        // Reset metrics
        this.metrics.collisionChecks = 0;
        this.metrics.collisionsDetected = 0;
        
        // Clear spatial grid
        this.clearSpatialGrid();
        
        // Populate spatial grid with entities
        this.populateSpatialGrid();
        
        // Check collisions
        this.checkCollisions();
        
        // End performance measurement
        const endTime = performance.now();
        this.metrics.updateTime = endTime - startTime;
        
        // Emit collision metrics event
        window.eventSystem.emit('collision:metrics', this.metrics);
    }
    
    /**
     * Clear spatial grid
     */
    clearSpatialGrid() {
        for (const [key, cell] of this.grid.cells) {
            cell.length = 0;
        }
    }
    
    /**
     * Populate spatial grid with entities
     */
    populateSpatialGrid() {
        // Get all active entities
        const entities = Array.from(this.gameEngine.entities.values())
            .filter(entity => entity.isActive());
        
        // Add entities to grid cells
        for (const entity of entities) {
            this.addEntityToGrid(entity);
        }
    }
    
    /**
     * Add an entity to the spatial grid
     * @param {Entity} entity - Entity to add
     */
    addEntityToGrid(entity) {
        // Get entity bounds
        const bounds = this.getEntityBounds(entity);
        if (!bounds) return;
        
        // Calculate grid cells that the entity overlaps
        const minCellX = Math.floor(bounds.minX / this.grid.cellSize);
        const maxCellX = Math.floor(bounds.maxX / this.grid.cellSize);
        const minCellY = Math.floor(bounds.minY / this.grid.cellSize);
        const maxCellY = Math.floor(bounds.maxY / this.grid.cellSize);
        
        // Add entity to each overlapping cell
        for (let y = minCellY; y <= maxCellY; y++) {
            for (let x = minCellX; x <= maxCellX; x++) {
                const cellKey = `${x},${y}`;
                const cell = this.grid.cells.get(cellKey);
                
                if (cell) {
                    cell.push(entity);
                }
            }
        }
    }
    
    /**
     * Get entity bounds for collision detection
     * @param {Entity} entity - Entity to get bounds for
     * @returns {object|null} Entity bounds {minX, minY, maxX, maxY}
     */
    getEntityBounds(entity) {
        // Get transform component
        const transform = entity.getComponent('Transform');
        if (!transform) return null;
        
        // Get render component for size
        const render = entity.getComponent('Render');
        
        // Default size based on entity type
        let width = 20;
        let height = 20;
        
        if (render) {
            // If render component has custom size, use it
            width = render.customRender ? 20 : 20;
            height = render.customRender ? 20 : 20;
        }
        
        // Adjust size based on entity type
        if (entity.hasTag('player')) {
            const player = entity;
            switch (player.playerClass) {
                case 'heavy':
                    width = 40;
                    height = 40;
                    break;
                case 'scout':
                    width = 30;
                    height = 30;
                    break;
                case 'engineer':
                    width = 30;
                    height = 30;
                    break;
                case 'medic':
                    width = 30;
                    height = 30;
                    break;
            }
        } else if (entity.hasTag('enemy')) {
            const enemy = entity;
            switch (enemy.enemyType) {
                case 'grunt':
                    width = 20;
                    height = 20;
                    break;
                case 'spitter':
                    width = 25;
                    height = 30;
                    break;
                case 'bruiser':
                    width = 35;
                    height = 35;
                    break;
                case 'miniBoss':
                    width = 50;
                    height = 50;
                    break;
                case 'boss':
                    width = 80;
                    height = 80;
                    break;
            }
        } else if (entity.hasTag('bullet')) {
            const bullet = entity;
            switch (bullet.type) {
                case 'bullet':
                    width = 4;
                    height = 4;
                    break;
                case 'pellet':
                    width = 3;
                    height = 3;
                    break;
                case 'plasma':
                    width = 6;
                    height = 6;
                    break;
                case 'rocket':
                    width = 8;
                    height = 8;
                    break;
                case 'spit':
                    width = 5;
                    height = 5;
                    break;
                case 'flame':
                    width = 10;
                    height = 10;
                    break;
                case 'heal':
                    width = 6;
                    height = 6;
                    break;
            }
        } else if (entity.hasTag('particle')) {
            const particle = entity;
            width = particle.size || 5;
            height = particle.size || 5;
        }
        
        // Apply scale
        if (render) {
            width *= render.scale.x;
            height *= render.scale.y;
        }
        
        // Calculate bounds
        const minX = transform.x - width / 2;
        const minY = transform.y - height / 2;
        const maxX = transform.x + width / 2;
        const maxY = transform.y + height / 2;
        
        return { minX, minY, maxX, maxY };
    }
    
    /**
     * Check collisions between entities
     */
    checkCollisions() {
        // Check each collision pair
        for (const pair of this.collisionPairs) {
            this.checkCollisionPair(pair.type1, pair.type2);
        }
    }
    
    /**
     * Check collisions between two entity types
     * @param {string} type1 - First entity type
     * @param {string} type2 - Second entity type
     */
    checkCollisionPair(type1, type2) {
        // If checking the same type, avoid duplicate checks
        if (type1 === type2) {
            this.checkCollisionsWithinType(type1);
        } else {
            this.checkCollisionsBetweenTypes(type1, type2);
        }
    }
    
    /**
     * Check collisions within the same entity type
     * @param {string} type - Entity type
     */
    checkCollisionsWithinType(type) {
        // Get all cells that contain entities of this type
        const cellsWithEntities = [];
        
        for (const [key, cell] of this.grid.cells) {
            const entitiesOfType = cell.filter(entity => entity.hasTag(type));
            if (entitiesOfType.length > 0) {
                cellsWithEntities.push({ cell, entities: entitiesOfType });
            }
        }
        
        // Check collisions within each cell
        for (const { cell, entities } of cellsWithEntities) {
            for (let i = 0; i < entities.length; i++) {
                for (let j = i + 1; j < entities.length; j++) {
                    this.checkEntityCollision(entities[i], entities[j]);
                }
            }
        }
        
        // Check collisions between adjacent cells
        for (let i = 0; i < cellsWithEntities.length; i++) {
            for (let j = i + 1; j < cellsWithEntities.length; j++) {
                const cell1 = cellsWithEntities[i];
                const cell2 = cellsWithEntities[j];
                
                // Only check adjacent cells
                if (this.areCellsAdjacent(cell1.cell, cell2.cell)) {
                    for (const entity1 of cell1.entities) {
                        for (const entity2 of cell2.entities) {
                            this.checkEntityCollision(entity1, entity2);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Check collisions between two different entity types
     * @param {string} type1 - First entity type
     * @param {string} type2 - Second entity type
     */
    checkCollisionsBetweenTypes(type1, type2) {
        // Get all cells that contain entities of type1
        const cellsWithType1 = [];
        
        for (const [key, cell] of this.grid.cells) {
            const entitiesOfType1 = cell.filter(entity => entity.hasTag(type1));
            if (entitiesOfType1.length > 0) {
                cellsWithType1.push({ cell, entities: entitiesOfType1 });
            }
        }
        
        // Get all cells that contain entities of type2
        const cellsWithType2 = [];
        
        for (const [key, cell] of this.grid.cells) {
            const entitiesOfType2 = cell.filter(entity => entity.hasTag(type2));
            if (entitiesOfType2.length > 0) {
                cellsWithType2.push({ cell, entities: entitiesOfType2 });
            }
        }
        
        // Check collisions between cells of type1 and type2
        for (const cell1 of cellsWithType1) {
            for (const cell2 of cellsWithType2) {
                // Only check if cells are the same or adjacent
                if (cell1.cell === cell2.cell || this.areCellsAdjacent(cell1.cell, cell2.cell)) {
                    for (const entity1 of cell1.entities) {
                        for (const entity2 of cell2.entities) {
                            this.checkEntityCollision(entity1, entity2);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Check if two cells are adjacent
     * @param {string} cellKey1 - First cell key
     * @param {string} cellKey2 - Second cell key
     * @returns {boolean} True if cells are adjacent
     */
    areCellsAdjacent(cellKey1, cellKey2) {
        // Parse cell keys
        const [x1, y1] = cellKey1.split(',').map(Number);
        const [x2, y2] = cellKey2.split(',').map(Number);
        
        // Check if cells are adjacent (including diagonals)
        return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
    }
    
    /**
     * Check collision between two entities
     * @param {Entity} entity1 - First entity
     * @param {Entity} entity2 - Second entity
     */
    checkEntityCollision(entity1, entity2) {
        // Skip if entities are the same
        if (entity1 === entity2) return;
        
        // Increment collision checks metric
        this.metrics.collisionChecks++;
        
        // Get entity bounds
        const bounds1 = this.getEntityBounds(entity1);
        const bounds2 = this.getEntityBounds(entity2);
        
        if (!bounds1 || !bounds2) return;
        
        // Check if bounds overlap
        if (this.boundsOverlap(bounds1, bounds2)) {
            // Collision detected
            this.metrics.collisionsDetected++;
            
            // Handle collision
            this.handleCollision(entity1, entity2);
        }
    }
    
    /**
     * Check if two bounds overlap
     * @param {object} bounds1 - First bounds
     * @param {object} bounds2 - Second bounds
     * @returns {boolean} True if bounds overlap
     */
    boundsOverlap(bounds1, bounds2) {
        return bounds1.minX < bounds2.maxX &&
               bounds1.maxX > bounds2.minX &&
               bounds1.minY < bounds2.maxY &&
               bounds1.maxY > bounds2.minY;
    }
    
    /**
     * Handle collision between two entities
     * @param {Entity} entity1 - First entity
     * @param {Entity} entity2 - Second entity
     */
    handleCollision(entity1, entity2) {
        // Determine collision type and call appropriate handler
        if (entity1.hasTag('player') && entity2.hasTag('enemy')) {
            this.handlePlayerEnemyCollision(entity1, entity2);
        } else if (entity1.hasTag('enemy') && entity2.hasTag('player')) {
            this.handlePlayerEnemyCollision(entity2, entity1);
        } else if (entity1.hasTag('player') && entity2.hasTag('bullet')) {
            this.handlePlayerBulletCollision(entity1, entity2);
        } else if (entity1.hasTag('bullet') && entity2.hasTag('player')) {
            this.handlePlayerBulletCollision(entity2, entity1);
        } else if (entity1.hasTag('enemy') && entity2.hasTag('bullet')) {
            this.handleEnemyBulletCollision(entity1, entity2);
        } else if (entity1.hasTag('bullet') && entity2.hasTag('enemy')) {
            this.handleEnemyBulletCollision(entity2, entity1);
        } else if (entity1.hasTag('bullet') && entity2.hasTag('arena')) {
            this.handleBulletArenaCollision(entity1, entity2);
        } else if (entity1.hasTag('arena') && entity2.hasTag('bullet')) {
            this.handleBulletArenaCollision(entity2, entity1);
        } else if (entity1.hasTag('player') && entity2.hasTag('arena')) {
            this.handlePlayerArenaCollision(entity1, entity2);
        } else if (entity1.hasTag('arena') && entity2.hasTag('player')) {
            this.handlePlayerArenaCollision(entity2, entity1);
        } else if (entity1.hasTag('enemy') && entity2.hasTag('arena')) {
            this.handleEnemyArenaCollision(entity1, entity2);
        } else if (entity1.hasTag('arena') && entity2.hasTag('enemy')) {
            this.handleEnemyArenaCollision(entity2, entity1);
        }
        
        // Trigger general collision callback
        if (this.callbacks.onCollision) {
            this.callbacks.onCollision(entity1, entity2);
        }
    }
    
    /**
     * Handle player-enemy collision
     * @param {Player} player - Player entity
     * @param {Enemy} enemy - Enemy entity
     */
    handlePlayerEnemyCollision(player, enemy) {
        // Get player and enemy components
        const playerHealth = player.getComponent('Health');
        const enemyHealth = enemy.getComponent('Health');
        const playerPhysics = player.getComponent('Physics');
        const enemyPhysics = enemy.getComponent('Physics');
        
        // Apply damage to player
        if (playerHealth) {
            playerHealth.takeDamage(enemy.damage, enemy);
        }
        
        // Apply knockback to player
        if (playerPhysics) {
            const playerTransform = player.getComponent('Transform');
            const enemyTransform = enemy.getComponent('Transform');
            
            if (playerTransform && enemyTransform) {
                // Calculate knockback direction
                const dx = playerTransform.x - enemyTransform.x;
                const dy = playerTransform.y - enemyTransform.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    // Normalize and apply knockback force
                    const knockbackForce = 500;
                    playerPhysics.applyForce(
                        (dx / distance) * knockbackForce,
                        (dy / distance) * knockbackForce
                    );
                }
            }
        }
        
        // Apply knockback to enemy
        if (enemyPhysics) {
            const playerTransform = player.getComponent('Transform');
            const enemyTransform = enemy.getComponent('Transform');
            
            if (playerTransform && enemyTransform) {
                // Calculate knockback direction
                const dx = enemyTransform.x - playerTransform.x;
                const dy = enemyTransform.y - playerTransform.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    // Normalize and apply knockback force
                    const knockbackForce = 300;
                    enemyPhysics.applyForce(
                        (dx / distance) * knockbackForce,
                        (dy / distance) * knockbackForce
                    );
                }
            }
        }
        
        // Trigger callback
        if (this.callbacks.onPlayerEnemyCollision) {
            this.callbacks.onPlayerEnemyCollision(player, enemy);
        }
    }
    
    /**
     * Handle player-bullet collision
     * @param {Player} player - Player entity
     * @param {Bullet} bullet - Bullet entity
     */
    handlePlayerBulletCollision(player, bullet) {
        // Skip if bullet is owned by player (friendly fire)
        if (bullet.owner === player) return;
        
        // Get player health component
        const playerHealth = player.getComponent('Health');
        
        // Apply damage to player
        if (playerHealth) {
            playerHealth.takeDamage(bullet.damage, bullet.owner);
        }
        
        // Handle bullet collision
        this.handleBulletCollision(bullet);
        
        // Trigger callback
        if (this.callbacks.onPlayerBulletCollision) {
            this.callbacks.onPlayerBulletCollision(player, bullet);
        }
    }
    
    /**
     * Handle enemy-bullet collision
     * @param {Enemy} enemy - Enemy entity
     * @param {Bullet} bullet - Bullet entity
     */
    handleEnemyBulletCollision(enemy, bullet) {
        // Skip if bullet is owned by enemy (friendly fire)
        if (bullet.owner === enemy) return;
        
        // Skip if bullet is a heal bullet
        if (bullet.type === 'heal') return;
        
        // Get enemy health component
        const enemyHealth = enemy.getComponent('Health');
        
        // Apply damage to enemy
        if (enemyHealth) {
            enemyHealth.takeDamage(bullet.damage, bullet.owner);
        }
        
        // Handle bullet collision
        this.handleBulletCollision(bullet);
        
        // Trigger callback
        if (this.callbacks.onEnemyBulletCollision) {
            this.callbacks.onEnemyBulletCollision(enemy, bullet);
        }
    }
    
    /**
     * Handle bullet-arena collision
     * @param {Bullet} bullet - Bullet entity
     * @param {Entity} arena - Arena entity
     */
    handleBulletArenaCollision(bullet, arena) {
        // Handle bullet collision
        this.handleBulletCollision(bullet);
        
        // Trigger callback
        if (this.callbacks.onBulletArenaCollision) {
            this.callbacks.onBulletArenaCollision(bullet, arena);
        }
    }
    
    /**
     * Handle player-arena collision
     * @param {Player} player - Player entity
     * @param {Entity} arena - Arena entity
     */
    handlePlayerArenaCollision(player, arena) {
        // Get player physics component
        const playerPhysics = player.getComponent('Physics');
        const playerTransform = player.getComponent('Transform');
        
        if (playerPhysics && playerTransform) {
            // Get player bounds
            const playerBounds = this.getEntityBounds(player);
            
            if (playerBounds) {
                // Calculate push direction to keep player inside arena
                let pushX = 0;
                let pushY = 0;
                
                // Check left boundary
                if (playerBounds.minX < 0) {
                    pushX = -playerBounds.minX;
                    playerTransform.x += pushX;
                }
                
                // Check right boundary
                if (playerBounds.maxX > this.gameEngine.arena.width) {
                    pushX = this.gameEngine.arena.width - playerBounds.maxX;
                    playerTransform.x += pushX;
                }
                
                // Check top boundary
                if (playerBounds.minY < 0) {
                    pushY = -playerBounds.minY;
                    playerTransform.y += pushY;
                }
                
                // Check bottom boundary
                if (playerBounds.maxY > this.gameEngine.arena.height) {
                    pushY = this.gameEngine.arena.height - playerBounds.maxY;
                    playerTransform.y += pushY;
                }
                
                // Stop velocity at boundaries
                if (pushX !== 0) playerPhysics.velocity.x = 0;
                if (pushY !== 0) playerPhysics.velocity.y = 0;
            }
        }
        
        // Trigger callback
        if (this.callbacks.onPlayerArenaCollision) {
            this.callbacks.onPlayerArenaCollision(player, arena);
        }
    }
    
    /**
     * Handle enemy-arena collision
     * @param {Enemy} enemy - Enemy entity
     * @param {Entity} arena - Arena entity
     */
    handleEnemyArenaCollision(enemy, arena) {
        // Get enemy physics component
        const enemyPhysics = enemy.getComponent('Physics');
        const enemyTransform = enemy.getComponent('Transform');
        
        if (enemyPhysics && enemyTransform) {
            // Get enemy bounds
            const enemyBounds = this.getEntityBounds(enemy);
            
            if (enemyBounds) {
                // Calculate push direction to keep enemy inside arena
                let pushX = 0;
                let pushY = 0;
                
                // Check left boundary
                if (enemyBounds.minX < 0) {
                    pushX = -enemyBounds.minX;
                    enemyTransform.x += pushX;
                }
                
                // Check right boundary
                if (enemyBounds.maxX > this.gameEngine.arena.width) {
                    pushX = this.gameEngine.arena.width - enemyBounds.maxX;
                    enemyTransform.x += pushX;
                }
                
                // Check top boundary
                if (enemyBounds.minY < 0) {
                    pushY = -enemyBounds.minY;
                    enemyTransform.y += pushY;
                }
                
                // Check bottom boundary
                if (enemyBounds.maxY > this.gameEngine.arena.height) {
                    pushY = this.gameEngine.arena.height - enemyBounds.maxY;
                    enemyTransform.y += pushY;
                }
                
                // Stop velocity at boundaries
                if (pushX !== 0) enemyPhysics.velocity.x = 0;
                if (pushY !== 0) enemyPhysics.velocity.y = 0;
            }
        }
        
        // Trigger callback
        if (this.callbacks.onEnemyArenaCollision) {
            this.callbacks.onEnemyArenaCollision(enemy, arena);
        }
    }
    
    /**
     * Handle bullet collision
     * @param {Bullet} bullet - Bullet entity
     */
    handleBulletCollision(bullet) {
        // Get bullet physics component
        const bulletPhysics = bullet.getComponent('Physics');
        
        // Stop bullet
        if (bulletPhysics) {
            bulletPhysics.stop();
        }
        
        // Call bullet's collision method
        if (typeof bullet.onCollision === 'function') {
            bullet.onCollision(bullet);
        }
        
        // Destroy bullet if it has no penetration left
        if (bullet.penetration < 0) {
            bullet.destroy();
        }
    }
    
    /**
     * Handle bullet destroy event
     * @param {Bullet} bullet - Bullet that was destroyed
     */
    onBulletDestroy(bullet) {
        // Remove bullet from spatial grid
        this.removeEntityFromGrid(bullet);
    }
    
    /**
     * Handle entity destroy event
     * @param {Entity} entity - Entity that was destroyed
     */
    onEntityDestroy(entity) {
        // Remove entity from spatial grid
        this.removeEntityFromGrid(entity);
    }
    
    /**
     * Remove an entity from the spatial grid
     * @param {Entity} entity - Entity to remove
     */
    removeEntityFromGrid(entity) {
        // Get entity bounds
        const bounds = this.getEntityBounds(entity);
        if (!bounds) return;
        
        // Calculate grid cells that the entity overlaps
        const minCellX = Math.floor(bounds.minX / this.grid.cellSize);
        const maxCellX = Math.floor(bounds.maxX / this.grid.cellSize);
        const minCellY = Math.floor(bounds.minY / this.grid.cellSize);
        const maxCellY = Math.floor(bounds.maxY / this.grid.cellSize);
        
        // Remove entity from each overlapping cell
        for (let y = minCellY; y <= maxCellY; y++) {
            for (let x = minCellX; x <= maxCellX; x++) {
                const cellKey = `${x},${y}`;
                const cell = this.grid.cells.get(cellKey);
                
                if (cell) {
                    const index = cell.indexOf(entity);
                    if (index !== -1) {
                        cell.splice(index, 1);
                    }
                }
            }
        }
    }
    
    /**
     * Set a callback for a collision event
     * @param {string} event - Event type ('onCollision', 'onPlayerEnemyCollision', etc.)
     * @param {Function} callback - Callback function
     */
    setCallback(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }
    
    /**
     * Check if a point collides with any entity
     * @param {number} x - Point X coordinate
     * @param {number} y - Point Y coordinate
     * @param {Array} excludeTags - Tags to exclude
     * @returns {Entity|null} Colliding entity or null
     */
    checkPointCollision(x, y, excludeTags = []) {
        // Get grid cell for point
        const cellX = Math.floor(x / this.grid.cellSize);
        const cellY = Math.floor(y / this.grid.cellSize);
        const cellKey = `${cellX},${cellY}`;
        const cell = this.grid.cells.get(cellKey);
        
        if (!cell) return null;
        
        // Check collision with entities in cell
        for (const entity of cell) {
            // Skip if entity has excluded tag
            let skip = false;
            for (const tag of excludeTags) {
                if (entity.hasTag(tag)) {
                    skip = true;
                    break;
                }
            }
            if (skip) continue;
            
            // Get entity bounds
            const bounds = this.getEntityBounds(entity);
            if (!bounds) continue;
            
            // Check if point is inside bounds
            if (x >= bounds.minX && x <= bounds.maxX &&
                y >= bounds.minY && y <= bounds.maxY) {
                return entity;
            }
        }
        
        return null;
    }
    
    /**
     * Check if a line segment collides with any entity
     * @param {number} x1 - Line start X coordinate
     * @param {number} y1 - Line start Y coordinate
     * @param {number} x2 - Line end X coordinate
     * @param {number} y2 - Line end Y coordinate
     * @param {Array} excludeTags - Tags to exclude
     * @returns {object|null} Collision info or null
     */
    checkLineCollision(x1, y1, x2, y2, excludeTags = []) {
        // Get all cells that the line segment passes through
        const cells = this.getLineCells(x1, y1, x2, y2);
        
        // Check collision with entities in cells
        let closestCollision = null;
        let closestDistance = Infinity;
        
        for (const cellKey of cells) {
            const cell = this.grid.cells.get(cellKey);
            if (!cell) continue;
            
            for (const entity of cell) {
                // Skip if entity has excluded tag
                let skip = false;
                for (const tag of excludeTags) {
                    if (entity.hasTag(tag)) {
                        skip = true;
                        break;
                    }
                }
                if (skip) continue;
                
                // Get entity bounds
                const bounds = this.getEntityBounds(entity);
                if (!bounds) continue;
                
                // Check line-rectangle intersection
                const collision = this.lineRectIntersection(x1, y1, x2, y2, bounds);
                if (collision) {
                    // Calculate distance to collision
                    const dx = collision.x - x1;
                    const dy = collision.y - y1;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Keep closest collision
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestCollision = {
                            entity: entity,
                            x: collision.x,
                            y: collision.y,
                            distance: distance
                        };
                    }
                }
            }
        }
        
        return closestCollision;
    }
    
    /**
     * Get all cells that a line segment passes through
     * @param {number} x1 - Line start X coordinate
     * @param {number} y1 - Line start Y coordinate
     * @param {number} x2 - Line end X coordinate
     * @param {number} y2 - Line end Y coordinate
     * @returns {Array} Array of cell keys
     */
    getLineCells(x1, y1, x2, y2) {
        const cells = new Set();
        
        // Get start and end cells
        const startCellX = Math.floor(x1 / this.grid.cellSize);
        const startCellY = Math.floor(y1 / this.grid.cellSize);
        const endCellX = Math.floor(x2 / this.grid.cellSize);
        const endCellY = Math.floor(y2 / this.grid.cellSize);
        
        // Add start cell
        cells.add(`${startCellX},${startCellY}`);
        
        // If start and end cells are the same, we're done
        if (startCellX === endCellX && startCellY === endCellY) {
            return Array.from(cells);
        }
        
        // Calculate line direction
        const dx = x2 - x1;
        const dy = y2 - y1;
        
        // Calculate step direction
        const stepX = dx > 0 ? 1 : -1;
        const stepY = dy > 0 ? 1 : -1;
        
        // Calculate current position
        let currentX = x1;
        let currentY = y1;
        
        // Calculate cell boundaries
        let nextCellX = startCellX;
        let nextCellY = startCellY;
        
        // Walk along the line
        while (nextCellX !== endCellX || nextCellY !== endCellY) {
            // Calculate distance to next cell boundary in X direction
            const tMaxX = dx !== 0 ? 
                ((nextCellX + (dx > 0 ? 1 : 0)) * this.grid.cellSize - currentX) / dx : 
                Infinity;
            
            // Calculate distance to next cell boundary in Y direction
            const tMaxY = dy !== 0 ? 
                ((nextCellY + (dy > 0 ? 1 : 0)) * this.grid.cellSize - currentY) / dy : 
                Infinity;
            
            // Move to next cell
            if (tMaxX < tMaxY) {
                // Move to next cell in X direction
                nextCellX += stepX;
                currentX += tMaxX * dx;
                currentY += tMaxX * dy;
            } else {
                // Move to next cell in Y direction
                nextCellY += stepY;
                currentX += tMaxY * dx;
                currentY += tMaxY * dy;
            }
            
            // Add cell to set
            cells.add(`${nextCellX},${nextCellY}`);
        }
        
        return Array.from(cells);
    }
    
    /**
     * Check line-rectangle intersection
     * @param {number} x1 - Line start X coordinate
     * @param {number} y1 - Line start Y coordinate
     * @param {number} x2 - Line end X coordinate
     * @param {number} y2 - Line end Y coordinate
     * @param {object} rect - Rectangle bounds {minX, minY, maxX, maxY}
     * @returns {object|null} Intersection point or null
     */
    lineRectIntersection(x1, y1, x2, y2, rect) {
        // Check each edge of the rectangle
        const edges = [
            { x1: rect.minX, y1: rect.minY, x2: rect.maxX, y2: rect.minY }, // Top
            { x1: rect.maxX, y1: rect.minY, x2: rect.maxX, y2: rect.maxY }, // Right
            { x1: rect.maxX, y1: rect.maxY, x2: rect.minX, y2: rect.maxY }, // Bottom
            { x1: rect.minX, y1: rect.maxY, x2: rect.minX, y2: rect.minY }  // Left
        ];
        
        let closestIntersection = null;
        let closestDistance = Infinity;
        
        // Check intersection with each edge
        for (const edge of edges) {
            const intersection = this.lineLineIntersection(
                x1, y1, x2, y2,
                edge.x1, edge.y1, edge.x2, edge.y2
            );
            
            if (intersection) {
                // Calculate distance to intersection
                const dx = intersection.x - x1;
                const dy = intersection.y - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Keep closest intersection
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIntersection = intersection;
                }
            }
        }
        
        return closestIntersection;
    }
    
    /**
     * Check line-line intersection
     * @param {number} x1 - First line start X coordinate
     * @param {number} y1 - First line start Y coordinate
     * @param {number} x2 - First line end X coordinate
     * @param {number} y2 - First line end Y coordinate
     * @param {number} x3 - Second line start X coordinate
     * @param {number} y3 - Second line start Y coordinate
     * @param {number} x4 - Second line end X coordinate
     * @param {number} y4 - Second line end Y coordinate
     * @returns {object|null} Intersection point or null
     */
    lineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Calculate determinants
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        
        // Lines are parallel if denominator is zero
        if (den === 0) return null;
        
        // Calculate intersection point
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        
        // Check if intersection is within both line segments
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        }
        
        return null;
    }
    
    /**
     * Destroy the collision system
     */
    destroy() {
        // Clear spatial grid
        this.grid.cells.clear();
        
        // Clear callbacks
        for (const callback in this.callbacks) {
            this.callbacks[callback] = null;
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionSystem;
}