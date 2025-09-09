/**
 * Arcade Meltdown - Post-Apocalyptic Arena Tileset
 * Ruined cityscape with debris, overgrown vegetation, and makeshift structures
 */

class PostApocalypticTileset {
    /**
     * Create a new Post-Apocalyptic tileset
     */
    constructor() {
        // Tileset properties
        this.name = "Post-Apocalyptic";
        this.description = "Ruined cityscape with debris, overgrown vegetation, and makeshift structures";
        this.tileSize = 32;
        this.tileCount = 64;
        
        // Tile types
        this.tiles = {
            // Floor tiles
            floor_1: {
                id: 0,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                decoration: "cracked_concrete",
                decorationColor: "#2a1f1f"
            },
            floor_2: {
                id: 1,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#2d2424",
                decoration: "dirt",
                decorationColor: "#1a1414"
            },
            floor_3: {
                id: 2,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#342a2a",
                decoration: "overgrown",
                decorationColor: "#1a3a1a"
            },
            floor_4: {
                id: 3,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#2f2626",
                decoration: "rubble",
                decorationColor: "#1a1616"
            },
            
            // Wall tiles
            wall_1: {
                id: 4,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                decoration: "cracked_brick",
                decorationColor: "#2a2015"
            },
            wall_2: {
                id: 5,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#322820",
                decoration: "exposed_rebar",
                decorationColor: "#4a3828"
            },
            wall_3: {
                id: 6,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#352b21",
                decoration: "graffiti",
                decorationColor: "#8a4a2a"
            },
            wall_4: {
                id: 7,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#30261d",
                decoration: "moss",
                decorationColor: "#2a4a2a"
            },
            
            // Corner tiles
            corner_tl: {
                id: 8,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                shape: "corner_tl"
            },
            corner_tr: {
                id: 9,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                shape: "corner_tr"
            },
            corner_bl: {
                id: 10,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                shape: "corner_bl"
            },
            corner_br: {
                id: 11,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                shape: "corner_br"
            },
            
            // Obstacle tiles
            obstacle_1: {
                id: 12,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#3a2f2f",
                shape: "debris",
                health: 50,
                destructible: true
            },
            obstacle_2: {
                id: 13,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#4a3828",
                shape: "burnt_car",
                health: 100,
                destructible: true
            },
            obstacle_3: {
                id: 14,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#3a3025",
                shape: "collapsed_wall",
                health: 150,
                destructible: true
            },
            obstacle_4: {
                id: 15,
                type: "obstacle",
                walkable: false,
                transparent: true,
                color: "#2a4a2a",
                shape: "overgrown_rubble",
                health: 75,
                destructible: true
            },
            
            // Cover tiles
            cover_1: {
                id: 16,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#3a2f2f",
                shape: "broken_wall",
                height: 0.6,
                cover: true
            },
            cover_2: {
                id: 17,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#4a3828",
                shape: "burnt_car",
                height: 0.7,
                cover: true
            },
            cover_3: {
                id: 18,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#3a3025",
                shape: "makeshift_barrier",
                height: 0.8,
                cover: true
            },
            cover_4: {
                id: 19,
                type: "cover",
                walkable: false,
                transparent: true,
                color: "#2a4a2a",
                shape: "overgrown_wall",
                height: 0.7,
                cover: true
            },
            
            // Hazard tiles
            hazard_1: {
                id: 20,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                shape: "fire",
                damage: 15,
                damageInterval: 0.5,
                animated: true
            },
            hazard_2: {
                id: 21,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#2d2424",
                shape: "toxic_waste",
                damage: 8,
                damageInterval: 1,
                slow: 0.6,
                animated: true
            },
            hazard_3: {
                id: 22,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#342a2a",
                shape: "radiation",
                damage: 5,
                damageInterval: 2,
                animated: true
            },
            hazard_4: {
                id: 23,
                type: "hazard",
                walkable: true,
                transparent: true,
                color: "#2f2626",
                shape: "spike_trap",
                damage: 20,
                damageInterval: 0.2,
                animated: true
            },
            
            // Spawn tiles
            spawn_player: {
                id: 24,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#8a7a6a",
                shape: "spawn_point",
                spawnType: "player"
            },
            spawn_enemy: {
                id: 25,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#8a4a2a",
                shape: "spawn_point",
                spawnType: "enemy"
            },
            spawn_boss: {
                id: 26,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#8a2a2a",
                shape: "spawn_point",
                spawnType: "boss"
            },
            spawn_powerup: {
                id: 27,
                type: "spawn",
                walkable: true,
                transparent: true,
                color: "#2a8a2a",
                shape: "spawn_point",
                spawnType: "powerup"
            },
            
            // Objective tiles
            objective_1: {
                id: 28,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#8a7a6a",
                shape: "supply_crate",
                interactive: true,
                captureTime: 5
            },
            objective_2: {
                id: 29,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#4a3828",
                shape: "radio_tower",
                interactive: true,
                captureTime: 8
            },
            objective_3: {
                id: 30,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#2a4a2a",
                shape: "water_purifier",
                interactive: true,
                captureTime: 10
            },
            objective_4: {
                id: 31,
                type: "objective",
                walkable: true,
                transparent: true,
                color: "#8a4a2a",
                shape: "fuel_tank",
                interactive: true,
                captureTime: 7
            },
            
            // Decoration tiles
            decoration_1: {
                id: 32,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                shape: "graffiti_tag",
                text: "WASTELAND",
                textColor: "#8a4a2a"
            },
            decoration_2: {
                id: 33,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#2d2424",
                shape: "warning_sign",
                text: "DANGER",
                textColor: "#8a2a2a"
            },
            decoration_3: {
                id: 34,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#342a2a",
                shape: "overgrown_plant",
                animated: true
            },
            decoration_4: {
                id: 35,
                type: "decoration",
                walkable: true,
                transparent: true,
                color: "#2f2626",
                shape: "scrap_metal",
                animated: false
            },
            
            // Door tiles
            door_1: {
                id: 36,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                shape: "barricaded_door",
                open: false,
                openable: true,
                locked: false
            },
            door_2: {
                id: 37,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#322820",
                shape: "metal_door",
                open: false,
                openable: true,
                locked: true,
                keyRequired: "key"
            },
            door_3: {
                id: 38,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#352b21",
                shape: "vault_door",
                open: false,
                openable: true,
                locked: true,
                keyRequired: "keycard"
            },
            door_4: {
                id: 39,
                type: "door",
                walkable: false,
                transparent: false,
                color: "#30261d",
                shape: "makeshift_door",
                open: false,
                openable: true,
                locked: false
            },
            
            // Platform tiles
            platform_1: {
                id: 40,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#3a3025",
                shape: "metal_platform",
                moving: false
            },
            platform_2: {
                id: 41,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#322820",
                shape: "metal_platform",
                moving: true,
                moveSpeed: 1,
                moveDistance: 100,
                moveDirection: "horizontal"
            },
            platform_3: {
                id: 42,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#352b21",
                shape: "metal_platform",
                moving: true,
                moveSpeed: 1.5,
                moveDistance: 150,
                moveDirection: "vertical"
            },
            platform_4: {
                id: 43,
                type: "platform",
                walkable: true,
                transparent: true,
                color: "#30261d",
                shape: "metal_platform",
                moving: true,
                moveSpeed: 2,
                moveDistance: 0,
                moveDirection: "circular",
                rotateSpeed: 1
            },
            
            // Liquid tiles
            liquid_1: {
                id: 44,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#2a3a4a",
                shape: "water",
                depth: 0.5,
                slow: 0.7,
                animated: true
            },
            liquid_2: {
                id: 45,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#3a2a4a",
                shape: "toxic_water",
                depth: 0.5,
                slow: 0.6,
                damage: 5,
                damageInterval: 1,
                animated: true
            },
            liquid_3: {
                id: 46,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#4a2a2a",
                shape: "oil",
                depth: 0.5,
                slow: 0.5,
                damage: 2,
                damageInterval: 2,
                flammable: true,
                animated: true
            },
            liquid_4: {
                id: 47,
                type: "liquid",
                walkable: true,
                transparent: true,
                color: "#2a4a3a",
                shape: "dirty_water",
                depth: 0.5,
                slow: 0.8,
                animated: true
            },
            
            // Special tiles
            special_1: {
                id: 48,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#8a7a6a",
                shape: "sewer_entrance",
                destination: null,
                oneWay: false,
                animated: true
            },
            special_2: {
                id: 49,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#4a3828",
                shape: "conveyor_belt",
                speed: 1.5,
                direction: "right",
                animated: true
            },
            special_3: {
                id: 50,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#3a3025",
                shape: "spring_trap",
                jumpHeight: 4,
                animated: true
            },
            special_4: {
                id: 51,
                type: "special",
                walkable: true,
                transparent: true,
                color: "#2a4a2a",
                shape: "vine_rope",
                climbable: true,
                animated: true
            },
            
            // Background tiles
            background_1: {
                id: 52,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#1a1414",
                parallax: 0.2,
                decoration: "ruined_cityscape",
                decorationColor: "#2a1f1f"
            },
            background_2: {
                id: 53,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#1a1616",
                parallax: 0.4,
                decoration: "collapsed_buildings",
                decorationColor: "#2a1414"
            },
            background_3: {
                id: 54,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#1a1a14",
                parallax: 0.6,
                decoration: "wasteland_horizon",
                decorationColor: "#2a1a14"
            },
            background_4: {
                id: 55,
                type: "background",
                walkable: true,
                transparent: true,
                color: "#141a14",
                parallax: 0.8,
                decoration: "distant_mountains",
                decorationColor: "#1a2a14"
            },
            
            // Transition tiles
            transition_floor_wall_1: {
                id: 56,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                shape: "floor_wall",
                direction: "top"
            },
            transition_floor_wall_2: {
                id: 57,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                shape: "floor_wall",
                direction: "right"
            },
            transition_floor_wall_3: {
                id: 58,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                shape: "floor_wall",
                direction: "bottom"
            },
            transition_floor_wall_4: {
                id: 59,
                type: "transition",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                shape: "floor_wall",
                direction: "left"
            },
            
            // Extra tiles for variety
            extra_1: {
                id: 60,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#3a2f2f",
                decoration: "blood_stains",
                decorationColor: "#8a2a2a"
            },
            extra_2: {
                id: 61,
                type: "floor",
                walkable: true,
                transparent: true,
                color: "#2d2424",
                decoration: "footprints",
                decorationColor: "#2a1f1f"
            },
            extra_3: {
                id: 62,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#3a3025",
                decoration: "bullet_holes",
                decorationColor: "#2a2015"
            },
            extra_4: {
                id: 63,
                type: "wall",
                walkable: false,
                transparent: false,
                color: "#322820",
                decoration: "explosion_marks",
                decorationColor: "#8a4a2a"
            }
        };
        
        // Tile palette
        this.palette = {
            primary: "#3a2f2f",
            secondary: "#2d2424",
            accent1: "#8a4a2a",
            accent2: "#2a4a2a",
            accent3: "#8a7a6a",
            accent4: "#4a3828",
            dark: "#1a1414",
            light: "#8a7a6a"
        };
        
        // Lighting settings
        this.lighting = {
            ambient: 0.3,
            directional: 0.4,
            pointLights: [
                { x: 0.3, y: 0.3, color: "#8a4a2a", intensity: 0.6, radius: 0.4 },
                { x: 0.7, y: 0.7, color: "#8a7a6a", intensity: 0.5, radius: 0.3 },
                { x: 0.5, y: 0.2, color: "#2a4a2a", intensity: 0.4, radius: 0.3 }
            ],
            fog: {
                color: "#1a1414",
                density: 0.08,
                near: 8,
                far: 40
            }
        };
        
        // Particle effects
        this.particles = {
            dust: {
                enabled: true,
                color: "#8a7a6a",
                density: 0.05,
                speed: 0.4
            },
            ash: {
                enabled: true,
                color: "#4a3828",
                density: 0.03,
                speed: 0.3
            },
            sparks: {
                enabled: false,
                color: "#8a4a2a",
                density: 0.02,
                speed: 0.5
            },
            leaves: {
                enabled: true,
                color: "#2a4a2a",
                density: 0.01,
                speed: 0.2
            }
        };
        
        // Sound effects
        this.sounds = {
            ambient: "wasteland_ambient.mp3",
            footstep: "dirt_footstep.mp3",
            wall_hit: "concrete_hit.mp3",
            glass_break: "glass_shatter.mp3",
            explosion: "debris_explosion.mp3",
            door_open: "metal_door.mp3",
            hazard: "fire_crackle.mp3"
        };
        
        // Music theme
        this.music = "post_apocalyptic_theme.mp3";
        
        // Initialize tileset
        this.init();
    }
    
    /**
     * Initialize the tileset
     */
    init() {
        // Create tile map for quick lookup
        this.tileMap = {};
        
        for (const [key, tile] of Object.entries(this.tiles)) {
            this.tileMap[tile.id] = key;
        }
        
        // Create tile type map
        this.tileTypeMap = {
            floor: [],
            wall: [],
            corner: [],
            obstacle: [],
            cover: [],
            hazard: [],
            spawn: [],
            objective: [],
            decoration: [],
            door: [],
            platform: [],
            liquid: [],
            special: [],
            background: [],
            transition: [],
            extra: []
        };
        
        for (const [key, tile] of Object.entries(this.tiles)) {
            this.tileTypeMap[tile.type].push(key);
        }
    }
    
    /**
     * Get tile by ID
     * @param {number} id - Tile ID
     * @returns {object} Tile data
     */
    getTileById(id) {
        const key = this.tileMap[id];
        return key ? this.tiles[key] : null;
    }
    
    /**
     * Get tile by name
     * @param {string} name - Tile name
     * @returns {object} Tile data
     */
    getTileByName(name) {
        return this.tiles[name];
    }
    
    /**
     * Get all tiles of a specific type
     * @param {string} type - Tile type
     * @returns {Array} Array of tile names
     */
    getTilesByType(type) {
        return this.tileTypeMap[type] || [];
    }
    
    /**
     * Get random tile of a specific type
     * @param {string} type - Tile type
     * @returns {string} Random tile name
     */
    getRandomTileByType(type) {
        const tiles = this.getTilesByType(type);
        if (tiles.length === 0) return null;
        
        return tiles[Math.floor(Math.random() * tiles.length)];
    }
    
    /**
     * Get tile palette
     * @returns {object} Tile palette
     */
    getPalette() {
        return this.palette;
    }
    
    /**
     * Get lighting settings
     * @returns {object} Lighting settings
     */
    getLighting() {
        return this.lighting;
    }
    
    /**
     * Get particle effects
     * @returns {object} Particle effects
     */
    getParticles() {
        return this.particles;
    }
    
    /**
     * Get sound effects
     * @returns {object} Sound effects
     */
    getSounds() {
        return this.sounds;
    }
    
    /**
     * Get music theme
     * @returns {string} Music theme
     */
    getMusic() {
        return this.music;
    }
    
    /**
     * Get all tiles
     * @returns {object} All tiles
     */
    getAllTiles() {
        return this.tiles;
    }
    
    /**
     * Render tile
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {string} tileName - Tile name
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Tile size
     * @param {object} options - Rendering options
     */
    renderTile(ctx, tileName, x, y, size, options = {}) {
        // Get tile data
        const tile = this.getTileByName(tileName);
        if (!tile) return;
        
        // Save context state
        ctx.save();
        
        // Set tile position
        ctx.translate(x, y);
        
        // Draw tile background
        ctx.fillStyle = tile.color;
        ctx.fillRect(0, 0, size, size);
        
        // Draw tile decoration based on type
        switch (tile.decoration) {
            case "cracked_concrete":
                this.drawCrackedConcreteDecoration(ctx, size, tile.decorationColor);
                break;
            case "dirt":
                this.drawDirtDecoration(ctx, size, tile.decorationColor);
                break;
            case "overgrown":
                this.drawOvergrownDecoration(ctx, size, tile.decorationColor);
                break;
            case "rubble":
                this.drawRubbleDecoration(ctx, size, tile.decorationColor);
                break;
            case "cracked_brick":
                this.drawCrackedBrickDecoration(ctx, size, tile.decorationColor);
                break;
            case "exposed_rebar":
                this.drawExposedRebarDecoration(ctx, size, tile.decorationColor);
                break;
            case "graffiti":
                this.drawGraffitiDecoration(ctx, size, tile.decorationColor, tile.text);
                break;
            case "moss":
                this.drawMossDecoration(ctx, size, tile.decorationColor);
                break;
            case "blood_stains":
                this.drawBloodStainsDecoration(ctx, size, tile.decorationColor);
                break;
            case "footprints":
                this.drawFootprintsDecoration(ctx, size, tile.decorationColor);
                break;
            case "bullet_holes":
                this.drawBulletHolesDecoration(ctx, size, tile.decorationColor);
                break;
            case "explosion_marks":
                this.drawExplosionMarksDecoration(ctx, size, tile.decorationColor);
                break;
            case "ruined_cityscape":
                this.drawRuinedCityscapeDecoration(ctx, size, tile.decorationColor);
                break;
            case "collapsed_buildings":
                this.drawCollapsedBuildingsDecoration(ctx, size, tile.decorationColor);
                break;
            case "wasteland_horizon":
                this.drawWastelandHorizonDecoration(ctx, size, tile.decorationColor);
                break;
            case "distant_mountains":
                this.drawDistantMountainsDecoration(ctx, size, tile.decorationColor);
                break;
        }
        
        // Draw tile shape based on type
        switch (tile.shape) {
            case "corner_tl":
                this.drawCornerShape(ctx, size, "tl");
                break;
            case "corner_tr":
                this.drawCornerShape(ctx, size, "tr");
                break;
            case "corner_bl":
                this.drawCornerShape(ctx, size, "bl");
                break;
            case "corner_br":
                this.drawCornerShape(ctx, size, "br");
                break;
            case "debris":
                this.drawDebrisShape(ctx, size);
                break;
            case "burnt_car":
                this.drawBurntCarShape(ctx, size);
                break;
            case "collapsed_wall":
                this.drawCollapsedWallShape(ctx, size);
                break;
            case "overgrown_rubble":
                this.drawOvergrownRubbleShape(ctx, size);
                break;
            case "broken_wall":
                this.drawBrokenWallShape(ctx, size);
                break;
            case "makeshift_barrier":
                this.drawMakeshiftBarrierShape(ctx, size);
                break;
            case "overgrown_wall":
                this.drawOvergrownWallShape(ctx, size);
                break;
            case "fire":
                this.drawFireShape(ctx, size);
                break;
            case "toxic_waste":
                this.drawToxicWasteShape(ctx, size);
                break;
            case "radiation":
                this.drawRadiationShape(ctx, size);
                break;
            case "spike_trap":
                this.drawSpikeTrapShape(ctx, size);
                break;
            case "spawn_point":
                this.drawSpawnPointShape(ctx, size, tile.spawnType);
                break;
            case "supply_crate":
                this.drawSupplyCrateShape(ctx, size);
                break;
            case "radio_tower":
                this.drawRadioTowerShape(ctx, size);
                break;
            case "water_purifier":
                this.drawWaterPurifierShape(ctx, size);
                break;
            case "fuel_tank":
                this.drawFuelTankShape(ctx, size);
                break;
            case "graffiti_tag":
                this.drawGraffitiTagShape(ctx, size, tile.text, tile.textColor);
                break;
            case "warning_sign":
                this.drawWarningSignShape(ctx, size, tile.text, tile.textColor);
                break;
            case "overgrown_plant":
                this.drawOvergrownPlantShape(ctx, size);
                break;
            case "scrap_metal":
                this.drawScrapMetalShape(ctx, size);
                break;
            case "barricaded_door":
                this.drawBarricadedDoorShape(ctx, size, tile.open);
                break;
            case "metal_door":
                this.drawMetalDoorShape(ctx, size, tile.open);
                break;
            case "vault_door":
                this.drawVaultDoorShape(ctx, size, tile.open);
                break;
            case "makeshift_door":
                this.drawMakeshiftDoorShape(ctx, size, tile.open);
                break;
            case "metal_platform":
                this.drawMetalPlatformShape(ctx, size);
                break;
            case "water":
                this.drawWaterShape(ctx, size);
                break;
            case "toxic_water":
                this.drawToxicWaterShape(ctx, size);
                break;
            case "oil":
                this.drawOilShape(ctx, size);
                break;
            case "dirty_water":
                this.drawDirtyWaterShape(ctx, size);
                break;
            case "sewer_entrance":
                this.drawSewerEntranceShape(ctx, size);
                break;
            case "conveyor_belt":
                this.drawConveyorBeltShape(ctx, size, tile.direction);
                break;
            case "spring_trap":
                this.drawSpringTrapShape(ctx, size);
                break;
            case "vine_rope":
                this.drawVineRopeShape(ctx, size);
                break;
            case "floor_wall":
                this.drawFloorWallShape(ctx, size, tile.direction);
                break;
        }
        
        // Draw tile text if available
        if (tile.text) {
            this.drawText(ctx, size, tile.text, tile.textColor || "#ffffff");
        }
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Draw cracked concrete decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawCrackedConcreteDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // Draw random cracks
        const crackCount = 3;
        
        for (let i = 0; i < crackCount; i++) {
            const startX = Math.random() * size;
            const startY = Math.random() * size;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            
            const segmentCount = 4;
            
            for (let j = 0; j < segmentCount; j++) {
                x += (Math.random() - 0.5) * size * 0.3;
                y += (Math.random() - 0.5) * size * 0.3;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw dirt decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawDirtDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw dirt patches
        const patchCount = 5;
        
        for (let i = 0; i < patchCount; i++) {
            const patchX = Math.random() * size;
            const patchY = Math.random() * size;
            const patchSize = size * (0.05 + Math.random() * 0.1);
            
            ctx.beginPath();
            ctx.arc(patchX, patchY, patchSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw overgrown decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawOvergrownDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw grass patches
        ctx.fillRect(0, size * 0.7, size, size * 0.3);
        
        // Draw grass blades
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        const bladeCount = 10;
        
        for (let i = 0; i < bladeCount; i++) {
            const bladeX = Math.random() * size;
            const bladeHeight = size * (0.1 + Math.random() * 0.2);
            
            ctx.beginPath();
            ctx.moveTo(bladeX, size);
            ctx.lineTo(bladeX + (Math.random() - 0.5) * 5, size - bladeHeight);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw rubble decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawRubbleDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw rubble pieces
        const pieceCount = 6;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size;
            const pieceWidth = size * (0.05 + Math.random() * 0.15);
            const pieceHeight = size * (0.05 + Math.random() * 0.15);
            const pieceRotation = Math.random() * Math.PI;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw cracked brick decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawCrackedBrickDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // Draw brick pattern
        const brickWidth = size * 0.25;
        const brickHeight = size * 0.15;
        
        for (let y = 0; y < size; y += brickHeight) {
            const offset = (Math.floor(y / brickHeight) % 2) * (brickWidth / 2);
            
            for (let x = 0; x < size; x += brickWidth) {
                ctx.strokeRect(x + offset, y, brickWidth - 1, brickHeight - 1);
            }
        }
        
        // Draw cracks
        const crackCount = 2;
        
        for (let i = 0; i < crackCount; i++) {
            const startX = Math.random() * size;
            const startY = Math.random() * size;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            
            const segmentCount = 3;
            
            for (let j = 0; j < segmentCount; j++) {
                x += (Math.random() - 0.5) * size * 0.3;
                y += (Math.random() - 0.5) * size * 0.3;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw exposed rebar decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawExposedRebarDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        
        // Draw rebar
        const rebarCount = 3;
        const rebarWidth = size * 0.05;
        const rebarSpacing = size / (rebarCount + 1);
        
        for (let i = 1; i <= rebarCount; i++) {
            const rebarX = i * rebarSpacing;
            
            ctx.fillRect(rebarX - rebarWidth / 2, 0, rebarWidth, size);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw graffiti decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     * @param {string} text - Graffiti text
     */
    drawGraffitiDecoration(ctx, size, color, text) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;
        
        // Draw graffiti background
        const graffitiWidth = size * 0.9;
        const graffitiHeight = size * 0.7;
        const graffitiX = (size - graffitiWidth) / 2;
        const graffitiY = (size - graffitiHeight) / 2;
        
        ctx.fillRect(graffitiX, graffitiY, graffitiWidth, graffitiHeight);
        
        // Draw graffiti text
        if (text) {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7;
            ctx.font = `${size * 0.15}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.fillText(text, size / 2, size / 2);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw moss decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawMossDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;
        
        // Draw moss patches
        const patchCount = 8;
        
        for (let i = 0; i < patchCount; i++) {
            const patchX = Math.random() * size;
            const patchY = Math.random() * size;
            const patchSize = size * (0.05 + Math.random() * 0.1);
            
            ctx.beginPath();
            ctx.arc(patchX, patchY, patchSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw blood stains decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawBloodStainsDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        
        // Draw blood stains
        const stainCount = 3;
        
        for (let i = 0; i < stainCount; i++) {
            const stainX = Math.random() * size;
            const stainY = Math.random() * size;
            const stainSize = size * (0.1 + Math.random() * 0.2);
            
            ctx.beginPath();
            ctx.arc(stainX, stainY, stainSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw blood drips
            const dripCount = 3;
            
            for (let j = 0; j < dripCount; j++) {
                const dripX = stainX + (Math.random() - 0.5) * stainSize;
                const dripY = stainY + stainSize;
                const dripHeight = size * (0.1 + Math.random() * 0.1);
                const dripWidth = size * 0.02;
                
                ctx.beginPath();
                ctx.moveTo(dripX - dripWidth / 2, dripY);
                ctx.lineTo(dripX + dripWidth / 2, dripY);
                ctx.lineTo(dripX, dripY + dripHeight);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw footprints decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawFootprintsDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        
        // Draw footprints
        const footprintCount = 2;
        
        for (let i = 0; i < footprintCount; i++) {
            const footprintX = size * 0.3 + i * size * 0.4;
            const footprintY = size * 0.5;
            const footprintSize = size * 0.1;
            
            // Draw left footprint
            ctx.beginPath();
            ctx.ellipse(footprintX - footprintSize / 2, footprintY, footprintSize, footprintSize * 0.6, 0, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw right footprint
            ctx.beginPath();
            ctx.ellipse(footprintX + footprintSize / 2, footprintY, footprintSize, footprintSize * 0.6, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw bullet holes decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawBulletHolesDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        
        // Draw bullet holes
        const holeCount = 5;
        
        for (let i = 0; i < holeCount; i++) {
            const holeX = Math.random() * size;
            const holeY = Math.random() * size;
            const holeSize = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(holeX, holeY, holeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw bullet hole cracks
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.4;
            
            const crackCount = 3;
            
            for (let j = 0; j < crackCount; j++) {
                const angle = (j / crackCount) * Math.PI * 2;
                const crackLength = holeSize * 2;
                
                ctx.beginPath();
                ctx.moveTo(holeX, holeY);
                ctx.lineTo(
                    holeX + Math.cos(angle) * crackLength,
                    holeY + Math.sin(angle) * crackLength
                );
                ctx.stroke();
            }
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.6;
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw explosion marks decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawExplosionMarksDecoration(ctx, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        
        // Draw explosion marks
        const markCount = 2;
        
        for (let i = 0; i < markCount; i++) {
            const markX = Math.random() * size;
            const markY = Math.random() * size;
            const markRadius = size * (0.1 + Math.random() * 0.2);
            
            // Draw explosion circle
            ctx.beginPath();
            ctx.arc(markX, markY, markRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw explosion rays
            const rayCount = 8;
            
            for (let j = 0; j < rayCount; j++) {
                const angle = (j / rayCount) * Math.PI * 2;
                const rayLength = markRadius * (1 + Math.random() * 0.5);
                
                ctx.beginPath();
                ctx.moveTo(markX, markY);
                ctx.lineTo(
                    markX + Math.cos(angle) * rayLength,
                    markY + Math.sin(angle) * rayLength
                );
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw ruined cityscape decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawRuinedCityscapeDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        
        // Draw buildings
        const buildingCount = 4;
        const buildingWidth = size / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
            const buildingHeight = size * (0.4 + Math.random() * 0.5);
            const buildingX = i * buildingWidth;
            const buildingY = size - buildingHeight;
            
            ctx.fillRect(buildingX, buildingY, buildingWidth - 1, buildingHeight);
            
            // Draw broken windows
            ctx.fillStyle = "#1a1414";
            ctx.globalAlpha = 0.3;
            
            const windowSize = buildingWidth * 0.2;
            const windowSpacing = buildingWidth * 0.3;
            
            for (let y = buildingY + windowSpacing; y < size - windowSpacing; y += windowSize + windowSpacing) {
                for (let x = buildingX + windowSpacing; x < buildingX + buildingWidth - windowSpacing; x += windowSize + windowSpacing) {
                    if (Math.random() > 0.5) {
                        ctx.fillRect(x, y, windowSize, windowSize);
                    }
                }
            }
            
            // Draw damage
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            
            const damageCount = 2;
            
            for (let j = 0; j < damageCount; j++) {
                const damageX = buildingX + Math.random() * buildingWidth;
                const damageY = buildingY + Math.random() * buildingHeight;
                const damageSize = buildingWidth * 0.2;
                
                ctx.fillRect(damageX, damageY, damageSize, damageSize);
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw collapsed buildings decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawCollapsedBuildingsDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        // Draw collapsed building pieces
        const pieceCount = 8;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size;
            const pieceWidth = size * (0.1 + Math.random() * 0.2);
            const pieceHeight = size * (0.05 + Math.random() * 0.15);
            const pieceRotation = Math.random() * Math.PI;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw wasteland horizon decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawWastelandHorizonDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        
        // Draw horizon line
        const horizonY = size * 0.7;
        
        ctx.fillRect(0, horizonY, size, size - horizonY);
        
        // Draw distant structures
        const structureCount = 3;
        
        for (let i = 0; i < structureCount; i++) {
            const structureX = i * size / structureCount + size / (structureCount * 2);
            const structureWidth = size * 0.1;
            const structureHeight = size * 0.2;
            
            ctx.fillRect(structureX - structureWidth / 2, horizonY - structureHeight, structureWidth, structureHeight);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw distant mountains decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} color - Decoration color
     */
    drawDistantMountainsDecoration(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        
        // Draw mountain silhouette
        ctx.beginPath();
        ctx.moveTo(0, size);
        
        const peakCount = 4;
        
        for (let i = 0; i <= peakCount; i++) {
            const peakX = (i / peakCount) * size;
            const peakY = size * (0.3 + Math.random() * 0.3);
            
            ctx.lineTo(peakX, peakY);
        }
        
        ctx.lineTo(size, size);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw corner shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} direction - Corner direction
     */
    drawCornerShape(ctx, size, direction) {
        ctx.fillStyle = "#3a3025";
        
        switch (direction) {
            case "tl":
                // Top-left corner
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(size, 0);
                ctx.lineTo(0, size);
                ctx.closePath();
                ctx.fill();
                break;
            case "tr":
                // Top-right corner
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(size, 0);
                ctx.lineTo(size, size);
                ctx.closePath();
                ctx.fill();
                break;
            case "bl":
                // Bottom-left corner
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, size);
                ctx.lineTo(size, size);
                ctx.closePath();
                ctx.fill();
                break;
            case "br":
                // Bottom-right corner
                ctx.beginPath();
                ctx.moveTo(size, 0);
                ctx.lineTo(size, size);
                ctx.lineTo(0, size);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }
    
    /**
     * Draw debris shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawDebrisShape(ctx, size) {
        ctx.fillStyle = "#3a2f2f";
        
        // Draw debris pieces
        const pieceCount = 6;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size;
            const pieceWidth = size * (0.1 + Math.random() * 0.2);
            const pieceHeight = size * (0.05 + Math.random() * 0.15);
            const pieceRotation = Math.random() * Math.PI;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
    }
    
    /**
     * Draw burnt car shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawBurntCarShape(ctx, size) {
        ctx.fillStyle = "#4a3828";
        
        // Draw car body
        const carWidth = size * 0.7;
        const carHeight = size * 0.4;
        const carX = (size - carWidth) / 2;
        const carY = (size - carHeight) / 2;
        
        ctx.fillRect(carX, carY, carWidth, carHeight);
        
        // Draw car details
        ctx.fillStyle = "#2a1a1a";
        ctx.globalAlpha = 0.5;
        
        // Draw windows
        const windowWidth = carWidth * 0.3;
        const windowHeight = carHeight * 0.5;
        const windowY = carY;
        
        ctx.fillRect(carX + carWidth * 0.1, windowY, windowWidth, windowHeight);
        ctx.fillRect(carX + carWidth * 0.6, windowY, windowWidth, windowHeight);
        
        // Draw wheels
        const wheelRadius = size * 0.08;
        const wheelY = carY + carHeight;
        
        ctx.beginPath();
        ctx.arc(carX + carWidth * 0.2, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(carX + carWidth * 0.8, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw damage
        ctx.fillStyle = "#8a4a2a";
        ctx.globalAlpha = 0.3;
        
        const damageCount = 3;
        
        for (let i = 0; i < damageCount; i++) {
            const damageX = carX + Math.random() * carWidth;
            const damageY = carY + Math.random() * carHeight;
            const damageSize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(damageX, damageY, damageSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw collapsed wall shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawCollapsedWallShape(ctx, size) {
        ctx.fillStyle = "#3a3025";
        
        // Draw wall pieces
        const pieceCount = 8;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size;
            const pieceWidth = size * (0.1 + Math.random() * 0.2);
            const pieceHeight = size * (0.05 + Math.random() * 0.15);
            const pieceRotation = Math.random() * Math.PI;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
        
        // Draw rebar
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.5;
        
        const rebarCount = 3;
        const rebarWidth = size * 0.03;
        const rebarSpacing = size / (rebarCount + 1);
        
        for (let i = 1; i <= rebarCount; i++) {
            const rebarX = i * rebarSpacing;
            
            ctx.fillRect(rebarX - rebarWidth / 2, 0, rebarWidth, size);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw overgrown rubble shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawOvergrownRubbleShape(ctx, size) {
        // Draw rubble
        ctx.fillStyle = "#3a2f2f";
        
        const pieceCount = 6;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size;
            const pieceWidth = size * (0.1 + Math.random() * 0.2);
            const pieceHeight = size * (0.05 + Math.random() * 0.15);
            const pieceRotation = Math.random() * Math.PI;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
        
        // Draw overgrowth
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.5;
        
        // Draw grass patches
        ctx.fillRect(0, size * 0.7, size, size * 0.3);
        
        // Draw grass blades
        ctx.strokeStyle = "#2a4a2a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        const bladeCount = 15;
        
        for (let i = 0; i < bladeCount; i++) {
            const bladeX = Math.random() * size;
            const bladeHeight = size * (0.1 + Math.random() * 0.2);
            
            ctx.beginPath();
            ctx.moveTo(bladeX, size);
            ctx.lineTo(bladeX + (Math.random() - 0.5) * 5, size - bladeHeight);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw broken wall shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawBrokenWallShape(ctx, size) {
        ctx.fillStyle = "#3a2f2f";
        
        // Draw wall pieces
        const pieceCount = 5;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size * 0.7;
            const pieceWidth = size * (0.15 + Math.random() * 0.25);
            const pieceHeight = size * (0.2 + Math.random() * 0.3);
            const pieceRotation = Math.random() * Math.PI * 0.5;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
        
        // Draw rebar
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.5;
        
        const rebarCount = 3;
        const rebarWidth = size * 0.03;
        const rebarSpacing = size / (rebarCount + 1);
        
        for (let i = 1; i <= rebarCount; i++) {
            const rebarX = i * rebarSpacing;
            
            ctx.fillRect(rebarX - rebarWidth / 2, 0, rebarWidth, size);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw makeshift barrier shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawMakeshiftBarrierShape(ctx, size) {
        ctx.fillStyle = "#3a3025";
        
        // Draw barrier base
        const barrierWidth = size * 0.8;
        const barrierHeight = size * 0.6;
        const barrierX = (size - barrierWidth) / 2;
        const barrierY = (size - barrierHeight) / 2;
        
        ctx.fillRect(barrierX, barrierY, barrierWidth, barrierHeight);
        
        // Draw barrier details
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        
        // Draw horizontal planks
        const plankCount = 4;
        const plankHeight = barrierHeight / (plankCount + 1);
        
        for (let i = 1; i <= plankCount; i++) {
            const plankY = barrierY + i * plankHeight;
            
            ctx.beginPath();
            ctx.moveTo(barrierX, plankY);
            ctx.lineTo(barrierX + barrierWidth, plankY);
            ctx.stroke();
        }
        
        // Draw vertical supports
        const supportCount = 3;
        const supportWidth = barrierWidth / (supportCount + 1);
        
        for (let i = 1; i <= supportCount; i++) {
            const supportX = barrierX + i * supportWidth;
            
            ctx.beginPath();
            ctx.moveTo(supportX, barrierY);
            ctx.lineTo(supportX, barrierY + barrierHeight);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw overgrown wall shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawOvergrownWallShape(ctx, size) {
        // Draw wall
        ctx.fillStyle = "#3a3025";
        
        const wallWidth = size * 0.8;
        const wallHeight = size * 0.6;
        const wallX = (size - wallWidth) / 2;
        const wallY = (size - wallHeight) / 2;
        
        ctx.fillRect(wallX, wallY, wallWidth, wallHeight);
        
        // Draw overgrowth
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.5;
        
        // Draw grass on top of wall
        ctx.fillRect(wallX, wallY - size * 0.1, wallWidth, size * 0.1);
        
        // Draw vines on wall
        ctx.strokeStyle = "#2a4a2a";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        const vineCount = 5;
        
        for (let i = 0; i < vineCount; i++) {
            const vineX = wallX + Math.random() * wallWidth;
            
            ctx.beginPath();
            ctx.moveTo(vineX, wallY);
            
            let x = vineX;
            let y = wallY;
            
            const segmentCount = 5;
            
            for (let j = 0; j < segmentCount; j++) {
                x += (Math.random() - 0.5) * 10;
                y += wallHeight / segmentCount;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        // Draw grass blades at base
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.5;
        
        const bladeCount = 10;
        
        for (let i = 0; i < bladeCount; i++) {
            const bladeX = wallX + Math.random() * wallWidth;
            const bladeHeight = size * (0.1 + Math.random() * 0.2);
            
            ctx.beginPath();
            ctx.moveTo(bladeX, wallY + wallHeight);
            ctx.lineTo(bladeX + (Math.random() - 0.5) * 5, wallY + wallHeight - bladeHeight);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw fire shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawFireShape(ctx, size) {
        // Draw fire base
        ctx.fillStyle = "#3a2f2f";
        ctx.fillRect(0, 0, size, size);
        
        // Draw fire
        const flameCount = 5;
        
        for (let i = 0; i < flameCount; i++) {
            const flameX = size * (0.2 + Math.random() * 0.6);
            const flameY = size * (0.5 + Math.random() * 0.3);
            const flameWidth = size * (0.1 + Math.random() * 0.2);
            const flameHeight = size * (0.3 + Math.random() * 0.4);
            
            // Draw flame gradient
            const gradient = ctx.createLinearGradient(flameX, flameY, flameX, flameY - flameHeight);
            gradient.addColorStop(0, "rgba(255, 100, 0, 0.8)");
            gradient.addColorStop(0.5, "rgba(255, 200, 0, 0.6)");
            gradient.addColorStop(1, "rgba(255, 255, 0, 0.2)");
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.8;
            
            ctx.beginPath();
            ctx.moveTo(flameX - flameWidth / 2, flameY);
            ctx.quadraticCurveTo(
                flameX + (Math.random() - 0.5) * flameWidth,
                flameY - flameHeight / 2,
                flameX,
                flameY - flameHeight
            );
            ctx.quadraticCurveTo(
                flameX + (Math.random() - 0.5) * flameWidth,
                flameY - flameHeight / 2,
                flameX + flameWidth / 2,
                flameY
            );
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw embers
        ctx.fillStyle = "#ff6600";
        ctx.globalAlpha = 0.7;
        
        const emberCount = 8;
        
        for (let i = 0; i < emberCount; i++) {
            const emberX = Math.random() * size;
            const emberY = size * (0.7 + Math.random() * 0.3);
            const emberSize = size * 0.02;
            
            ctx.beginPath();
            ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw toxic waste shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawToxicWasteShape(ctx, size) {
        // Draw waste base
        ctx.fillStyle = "#2d2424";
        ctx.fillRect(0, 0, size, size);
        
        // Draw toxic waste
        ctx.fillStyle = "#3a2a4a";
        ctx.globalAlpha = 0.6;
        
        const wasteRadius = size * 0.4;
        const wasteX = size / 2;
        const wasteY = size / 2;
        
        ctx.beginPath();
        ctx.arc(wasteX, wasteY, wasteRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw toxic bubbles
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.7;
        
        const bubbleCount = 6;
        
        for (let i = 0; i < bubbleCount; i++) {
            const angle = (i / bubbleCount) * Math.PI * 2;
            const distance = wasteRadius * 0.7;
            const bubbleX = wasteX + Math.cos(angle) * distance;
            const bubbleY = wasteY + Math.sin(angle) * distance;
            const bubbleSize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw toxic fumes
        ctx.strokeStyle = "#2a4a2a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        const fumeCount = 3;
        
        for (let i = 0; i < fumeCount; i++) {
            const fumeX = wasteX + (Math.random() - 0.5) * wasteRadius;
            const fumeY = wasteY - wasteRadius;
            const fumeHeight = size * (0.2 + Math.random() * 0.2);
            const fumeWidth = size * (0.1 + Math.random() * 0.1);
            
            ctx.beginPath();
            ctx.moveTo(fumeX - fumeWidth / 2, fumeY);
            ctx.quadraticCurveTo(
                fumeX + (Math.random() - 0.5) * fumeWidth,
                fumeY - fumeHeight / 2,
                fumeX,
                fumeY - fumeHeight
            );
            ctx.quadraticCurveTo(
                fumeX + (Math.random() - 0.5) * fumeWidth,
                fumeY - fumeHeight / 2,
                fumeX + fumeWidth / 2,
                fumeY
            );
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw radiation shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawRadiationShape(ctx, size) {
        // Draw radiation base
        ctx.fillStyle = "#342a2a";
        ctx.fillRect(0, 0, size, size);
        
        // Draw radiation symbol
        ctx.strokeStyle = "#8a2a2a";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#8a2a2a";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.3;
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw radiation blades
        const bladeCount = 3;
        
        for (let i = 0; i < bladeCount; i++) {
            const angle = (i / bladeCount) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }
        
        // Draw radiation particles
        ctx.fillStyle = "#8a2a2a";
        ctx.globalAlpha = 0.6;
        
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = radius * (0.5 + Math.random() * 0.5);
            const particleX = centerX + Math.cos(angle) * distance;
            const particleY = centerY + Math.sin(angle) * distance;
            const particleSize = size * 0.02;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw spike trap shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawSpikeTrapShape(ctx, size) {
        // Draw trap base
        ctx.fillStyle = "#2f2626";
        ctx.fillRect(0, 0, size, size);
        
        // Draw spikes
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.8;
        
        const spikeCount = 5;
        const spikeWidth = size * 0.1;
        const spikeHeight = size * 0.3;
        const spikeSpacing = size / (spikeCount + 1);
        
        for (let i = 1; i <= spikeCount; i++) {
            const spikeX = i * spikeSpacing;
            
            ctx.beginPath();
            ctx.moveTo(spikeX - spikeWidth / 2, size);
            ctx.lineTo(spikeX + spikeWidth / 2, size);
            ctx.lineTo(spikeX, size - spikeHeight);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw blood on spikes
        ctx.fillStyle = "#8a2a2a";
        ctx.globalAlpha = 0.5;
        
        for (let i = 1; i <= spikeCount; i++) {
            if (Math.random() > 0.5) {
                const spikeX = i * spikeSpacing;
                const bloodY = size - spikeHeight * 0.7;
                const bloodSize = size * 0.03;
                
                ctx.beginPath();
                ctx.arc(spikeX, bloodY, bloodSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw spawn point shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} spawnType - Spawn type
     */
    drawSpawnPointShape(ctx, size, spawnType) {
        // Set color based on spawn type
        let color;
        switch (spawnType) {
            case "player":
                color = "#8a7a6a";
                break;
            case "enemy":
                color = "#8a4a2a";
                break;
            case "boss":
                color = "#8a2a2a";
                break;
            case "powerup":
                color = "#2a8a2a";
                break;
            default:
                color = "#ffffff";
        }
        
        // Draw spawn point
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const spawnRadius = size * 0.4;
        const spawnX = size / 2;
        const spawnY = size / 2;
        
        // Draw spawn circle
        ctx.beginPath();
        ctx.arc(spawnX, spawnY, spawnRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw spawn symbol
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        
        switch (spawnType) {
            case "player":
                // Draw player symbol
                ctx.beginPath();
                ctx.moveTo(spawnX, spawnY - spawnRadius * 0.5);
                ctx.lineTo(spawnX - spawnRadius * 0.4, spawnY + spawnRadius * 0.5);
                ctx.lineTo(spawnX + spawnRadius * 0.4, spawnY + spawnRadius * 0.5);
                ctx.closePath();
                ctx.fill();
                break;
            case "enemy":
                // Draw enemy symbol
                ctx.beginPath();
                ctx.moveTo(spawnX - spawnRadius * 0.3, spawnY - spawnRadius * 0.3);
                ctx.lineTo(spawnX + spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.moveTo(spawnX + spawnRadius * 0.3, spawnY - spawnRadius * 0.3);
                ctx.lineTo(spawnX - spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.stroke();
                break;
            case "boss":
                // Draw boss symbol
                ctx.beginPath();
                ctx.arc(spawnX, spawnY, spawnRadius * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(spawnX - spawnRadius * 0.5, spawnY);
                ctx.lineTo(spawnX + spawnRadius * 0.5, spawnY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(spawnX, spawnY - spawnRadius * 0.5);
                ctx.lineTo(spawnX, spawnY + spawnRadius * 0.5);
                ctx.stroke();
                break;
            case "powerup":
                // Draw powerup symbol
                ctx.beginPath();
                ctx.moveTo(spawnX, spawnY - spawnRadius * 0.5);
                ctx.lineTo(spawnX - spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.lineTo(spawnX + spawnRadius * 0.3, spawnY + spawnRadius * 0.3);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(spawnX, spawnY, spawnRadius * 0.2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw supply crate shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawSupplyCrateShape(ctx, size) {
        ctx.fillStyle = "#8a7a6a";
        
        // Draw crate
        const crateWidth = size * 0.6;
        const crateHeight = size * 0.6;
        const crateX = (size - crateWidth) / 2;
        const crateY = (size - crateHeight) / 2;
        
        ctx.fillRect(crateX, crateY, crateWidth, crateHeight);
        
        // Draw crate details
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        // Draw crate planks
        const plankCount = 3;
        const plankHeight = crateHeight / plankCount;
        
        for (let i = 1; i < plankCount; i++) {
            const y = crateY + i * plankHeight;
            
            ctx.beginPath();
            ctx.moveTo(crateX, y);
            ctx.lineTo(crateX + crateWidth, y);
            ctx.stroke();
        }
        
        // Draw crate nails
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.7;
        
        const nailCount = 8;
        const nailSpacing = crateWidth / 3;
        const nailRadius = size * 0.02;
        
        for (let i = 1; i < 3; i++) {
            for (let j = 1; j < 3; j++) {
                const nailX = crateX + i * nailSpacing;
                const nailY = crateY + j * nailSpacing;
                
                ctx.beginPath();
                ctx.arc(nailX, nailY, nailRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw radio tower shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawRadioTowerShape(ctx, size) {
        // Draw tower base
        ctx.fillStyle = "#4a3828";
        
        const baseWidth = size * 0.6;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
        
        // Draw tower pole
        const poleWidth = size * 0.1;
        const poleHeight = size * 0.7;
        const poleX = (size - poleWidth) / 2;
        const poleY = baseY - poleHeight;
        
        ctx.fillRect(poleX, poleY, poleWidth, poleHeight);
        
        // Draw tower antenna
        const antennaWidth = size * 0.05;
        const antennaHeight = size * 0.2;
        const antennaX = (size - antennaWidth) / 2;
        const antennaY = poleY - antennaHeight;
        
        ctx.fillRect(antennaX, antennaY, antennaWidth, antennaHeight);
        
        // Draw tower cross beams
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        const beamCount = 3;
        const beamSpacing = poleHeight / (beamCount + 1);
        
        for (let i = 1; i <= beamCount; i++) {
            const beamY = poleY + i * beamSpacing;
            const beamWidth = poleWidth * 2;
            
            ctx.beginPath();
            ctx.moveTo(poleX - beamWidth / 2, beamY);
            ctx.lineTo(poleX + beamWidth / 2, beamY);
            ctx.stroke();
        }
        
        // Draw tower signal
        ctx.strokeStyle = "#8a4a2a";
        ctx.lineWidth = 1;
        ctx.shadowColor = "#8a4a2a";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const signalCount = 3;
        
        for (let i = 0; i < signalCount; i++) {
            const signalRadius = antennaHeight * (0.3 + i * 0.3);
            
            ctx.beginPath();
            ctx.arc(antennaX + antennaWidth / 2, antennaY, signalRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw water purifier shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawWaterPurifierShape(ctx, size) {
        // Draw purifier base
        ctx.fillStyle = "#2a4a2a";
        
        const baseWidth = size * 0.7;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
        
        // Draw purifier tank
        const tankWidth = size * 0.5;
        const tankHeight = size * 0.5;
        const tankX = (size - tankWidth) / 2;
        const tankY = baseY - tankHeight;
        
        ctx.fillRect(tankX, tankY, tankWidth, tankHeight);
        
        // Draw purifier pipes
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        
        // Draw inlet pipe
        ctx.beginPath();
        ctx.moveTo(tankX - size * 0.1, tankY + tankHeight * 0.7);
        ctx.lineTo(tankX, tankY + tankHeight * 0.7);
        ctx.stroke();
        
        // Draw outlet pipe
        ctx.beginPath();
        ctx.moveTo(tankX + tankWidth, tankY + tankHeight * 0.3);
        ctx.lineTo(tankX + tankWidth + size * 0.1, tankY + tankHeight * 0.3);
        ctx.stroke();
        
        // Draw purifier water
        ctx.fillStyle = "#2a3a4a";
        ctx.globalAlpha = 0.6;
        
        const waterHeight = tankHeight * 0.7;
        
        ctx.fillRect(tankX, tankY + tankHeight - waterHeight, tankWidth, waterHeight);
        
        // Draw purifier bubbles
        ctx.fillStyle = "#8a7a6a";
        ctx.globalAlpha = 0.7;
        
        const bubbleCount = 5;
        
        for (let i = 0; i < bubbleCount; i++) {
            const bubbleX = tankX + Math.random() * tankWidth;
            const bubbleY = tankY + tankHeight - waterHeight + Math.random() * waterHeight;
            const bubbleSize = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw fuel tank shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawFuelTankShape(ctx, size) {
        // Draw tank base
        ctx.fillStyle = "#8a4a2a";
        
        const baseWidth = size * 0.7;
        const baseHeight = size * 0.1;
        const baseX = (size - baseWidth) / 2;
        const baseY = size - baseHeight;
        
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
        
        // Draw tank body
        const tankWidth = size * 0.6;
        const tankHeight = size * 0.6;
        const tankX = (size - tankWidth) / 2;
        const tankY = baseY - tankHeight;
        
        ctx.fillRect(tankX, tankY, tankWidth, tankHeight);
        
        // Draw tank details
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        
        // Draw tank bands
        const bandCount = 3;
        const bandSpacing = tankHeight / (bandCount + 1);
        
        for (let i = 1; i <= bandCount; i++) {
            const bandY = tankY + i * bandSpacing;
            
            ctx.beginPath();
            ctx.moveTo(tankX, bandY);
            ctx.lineTo(tankX + tankWidth, bandY);
            ctx.stroke();
        }
        
        // Draw tank valve
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.7;
        
        const valveX = tankX + tankWidth / 2;
        const valveY = tankY + tankHeight * 0.3;
        const valveRadius = size * 0.05;
        
        ctx.beginPath();
        ctx.arc(valveX, valveY, valveRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tank warning
        ctx.fillStyle = "#8a2a2a";
        ctx.globalAlpha = 0.7;
        ctx.font = `${size * 0.1}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText("FUEL", tankX + tankWidth / 2, tankY + tankHeight / 2);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw graffiti tag shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} text - Graffiti text
     * @param {string} textColor - Text color
     */
    drawGraffitiTagShape(ctx, size, text, textColor) {
        // Draw graffiti background
        ctx.fillStyle = "#3a2f2f";
        ctx.fillRect(0, 0, size, size);
        
        // Draw graffiti text
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.8;
        ctx.font = `bold ${size * 0.2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Add text shadow effect
        ctx.shadowColor = "#1a1414";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(text, size / 2, size / 2);
        
        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw graffiti splatter
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.5;
        
        const splatterCount = 5;
        
        for (let i = 0; i < splatterCount; i++) {
            const splatterX = Math.random() * size;
            const splatterY = Math.random() * size;
            const splatterSize = size * (0.05 + Math.random() * 0.1);
            
            ctx.beginPath();
            ctx.arc(splatterX, splatterY, splatterSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw warning sign shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} text - Warning text
     * @param {string} textColor - Text color
     */
    drawWarningSignShape(ctx, size, text, textColor) {
        // Draw sign background
        ctx.fillStyle = "#8a4a2a";
        
        const signWidth = size * 0.8;
        const signHeight = size * 0.6;
        const signX = (size - signWidth) / 2;
        const signY = (size - signHeight) / 2;
        
        ctx.fillRect(signX, signY, signWidth, signHeight);
        
        // Draw sign border
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        ctx.strokeRect(signX, signY, signWidth, signHeight);
        
        // Draw warning triangle
        ctx.fillStyle = "#8a2a2a";
        ctx.globalAlpha = 0.8;
        
        const triangleSize = size * 0.2;
        const triangleX = size / 2;
        const triangleY = signY + signHeight * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(triangleX, triangleY - triangleSize);
        ctx.lineTo(triangleX - triangleSize, triangleY + triangleSize);
        ctx.lineTo(triangleX + triangleSize, triangleY + triangleSize);
        ctx.closePath();
        ctx.fill();
        
        // Draw exclamation mark
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.9;
        ctx.font = `bold ${size * 0.15}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText("!", triangleX, triangleY);
        
        // Draw warning text
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.8;
        ctx.font = `${size * 0.1}px Arial`;
        
        ctx.fillText(text, size / 2, signY + signHeight * 0.7);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw overgrown plant shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawOvergrownPlantShape(ctx, size) {
        // Draw plant base
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.3;
        
        ctx.fillRect(0, size * 0.7, size, size * 0.3);
        
        // Draw plant stem
        ctx.strokeStyle = "#2a4a2a";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        
        const stemX = size / 2;
        const stemHeight = size * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(stemX, size);
        ctx.lineTo(stemX, size - stemHeight);
        ctx.stroke();
        
        // Draw plant leaves
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.7;
        
        const leafCount = 6;
        
        for (let i = 0; i < leafCount; i++) {
            const leafY = size - (i + 1) * stemHeight / leafCount;
            const leafSize = size * (0.1 + Math.random() * 0.1);
            const leafAngle = (Math.random() - 0.5) * Math.PI / 2;
            
            ctx.save();
            ctx.translate(stemX, leafY);
            ctx.rotate(leafAngle);
            
            ctx.beginPath();
            ctx.ellipse(0, 0, leafSize, leafSize * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // Draw plant flowers
        ctx.fillStyle = "#8a4a2a";
        ctx.globalAlpha = 0.8;
        
        const flowerCount = 2;
        
        for (let i = 0; i < flowerCount; i++) {
            const flowerY = size - stemHeight * (0.2 + i * 0.3);
            const flowerSize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(stemX, flowerY, flowerSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw scrap metal shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawScrapMetalShape(ctx, size) {
        // Draw scrap pieces
        ctx.fillStyle = "#4a3828";
        
        const pieceCount = 8;
        
        for (let i = 0; i < pieceCount; i++) {
            const pieceX = Math.random() * size;
            const pieceY = Math.random() * size;
            const pieceWidth = size * (0.1 + Math.random() * 0.2);
            const pieceHeight = size * (0.05 + Math.random() * 0.15);
            const pieceRotation = Math.random() * Math.PI;
            
            ctx.save();
            ctx.translate(pieceX, pieceY);
            ctx.rotate(pieceRotation);
            ctx.fillRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        }
        
        // Draw rust
        ctx.fillStyle = "#8a4a2a";
        ctx.globalAlpha = 0.3;
        
        const rustCount = 10;
        
        for (let i = 0; i < rustCount; i++) {
            const rustX = Math.random() * size;
            const rustY = Math.random() * size;
            const rustSize = size * (0.02 + Math.random() * 0.05);
            
            ctx.beginPath();
            ctx.arc(rustX, rustY, rustSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw barricaded door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawBarricadedDoorShape(ctx, size, open) {
        ctx.fillStyle = "#3a3025";
        
        // Draw door frame
        const frameWidth = size * 0.1;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.8 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#4a3828";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw barricade
            ctx.fillStyle = "#3a2f2f";
            ctx.globalAlpha = 0.7;
            
            const plankCount = 5;
            const plankHeight = doorHeight / plankCount;
            
            for (let i = 0; i < plankCount; i++) {
                const plankY = frameWidth + i * plankHeight;
                
                ctx.fillRect(frameWidth, plankY, doorWidth, size * 0.05);
            }
            
            // Draw nails
            ctx.fillStyle = "#4a3828";
            ctx.globalAlpha = 0.5;
            
            const nailCount = 10;
            const nailRadius = size * 0.01;
            
            for (let i = 0; i < nailCount; i++) {
                const nailX = frameWidth + Math.random() * doorWidth;
                const nailY = frameWidth + Math.random() * doorHeight;
                
                ctx.beginPath();
                ctx.arc(nailX, nailY, nailRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw metal door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawMetalDoorShape(ctx, size, open) {
        ctx.fillStyle = "#322820";
        
        // Draw door frame
        const frameWidth = size * 0.15;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.7 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#4a3828";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw door details
            ctx.strokeStyle = "#322820";
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            
            // Draw door panels
            const panelCount = 3;
            const panelHeight = doorHeight / panelCount;
            
            for (let i = 1; i < panelCount; i++) {
                const panelY = frameWidth + i * panelHeight;
                
                ctx.beginPath();
                ctx.moveTo(frameWidth, panelY);
                ctx.lineTo(frameWidth + doorWidth, panelY);
                ctx.stroke();
            }
            
            // Draw handle
            ctx.fillStyle = "#3a2f2f";
            ctx.globalAlpha = 0.7;
            
            const handleX = frameWidth + doorWidth * 0.8;
            const handleY = frameWidth + doorHeight * 0.5;
            const handleRadius = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(handleX, handleY, handleRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw vault door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawVaultDoorShape(ctx, size, open) {
        ctx.fillStyle = "#352b21";
        
        // Draw door frame
        const frameWidth = size * 0.2;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.6 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#4a3828";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw door details
            ctx.strokeStyle = "#352b21";
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.6;
            
            // Draw door reinforcement
            const reinforcementCount = 4;
            const reinforcementHeight = doorHeight / reinforcementCount;
            
            for (let i = 0; i < reinforcementCount; i++) {
                const reinforcementY = frameWidth + i * reinforcementHeight;
                
                ctx.beginPath();
                ctx.moveTo(frameWidth, reinforcementY);
                ctx.lineTo(frameWidth + doorWidth, reinforcementY);
                ctx.stroke();
            }
            
            // Draw lock
            ctx.fillStyle = "#8a7a6a";
            ctx.globalAlpha = 0.8;
            
            const lockX = frameWidth + doorWidth / 2;
            const lockY = frameWidth + doorHeight / 2;
            const lockRadius = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(lockX, lockY, lockRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw keyhole
            ctx.fillStyle = "#1a1414";
            ctx.globalAlpha = 0.9;
            
            const keyholeWidth = size * 0.02;
            const keyholeHeight = size * 0.04;
            
            ctx.fillRect(lockX - keyholeWidth / 2, lockY, keyholeWidth, keyholeHeight);
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw makeshift door shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {boolean} open - Whether door is open
     */
    drawMakeshiftDoorShape(ctx, size, open) {
        ctx.fillStyle = "#30261d";
        
        // Draw door frame
        const frameWidth = size * 0.1;
        
        // Left frame
        ctx.fillRect(0, 0, frameWidth, size);
        
        // Right frame
        ctx.fillRect(size - frameWidth, 0, frameWidth, size);
        
        // Top frame
        ctx.fillRect(0, 0, size, frameWidth);
        
        // Bottom frame
        ctx.fillRect(0, size - frameWidth, size, frameWidth);
        
        // Draw door
        const doorWidth = size * 0.8 - frameWidth * 2;
        const doorHeight = size - frameWidth * 2;
        
        if (!open) {
            // Draw closed door
            ctx.fillStyle = "#3a2f2f";
            ctx.fillRect(frameWidth, frameWidth, doorWidth, doorHeight);
            
            // Draw door planks
            ctx.strokeStyle = "#30261d";
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            
            const plankCount = 4;
            const plankWidth = doorWidth / plankCount;
            
            for (let i = 1; i < plankCount; i++) {
                const plankX = frameWidth + i * plankWidth;
                
                ctx.beginPath();
                ctx.moveTo(plankX, frameWidth);
                ctx.lineTo(plankX, frameWidth + doorHeight);
                ctx.stroke();
            }
            
            // Draw handle
            ctx.fillStyle = "#4a3828";
            ctx.globalAlpha = 0.7;
            
            const handleX = frameWidth + doorWidth * 0.8;
            const handleY = frameWidth + doorHeight * 0.5;
            const handleRadius = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(handleX, handleY, handleRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw metal platform shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawMetalPlatformShape(ctx, size) {
        // Draw platform
        ctx.fillStyle = "#3a3025";
        
        const platformWidth = size * 0.8;
        const platformHeight = size * 0.2;
        const platformX = (size - platformWidth) / 2;
        const platformY = (size - platformHeight) / 2;
        
        ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
        
        // Draw platform details
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        // Draw platform lines
        const lineCount = 3;
        const lineSpacing = platformWidth / (lineCount + 1);
        
        for (let i = 1; i <= lineCount; i++) {
            const x = platformX + i * lineSpacing;
            
            ctx.beginPath();
            ctx.moveTo(x, platformY);
            ctx.lineTo(x, platformY + platformHeight);
            ctx.stroke();
        }
        
        // Draw platform supports
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.7;
        
        const supportWidth = size * 0.05;
        const supportHeight = size * 0.3;
        const supportX1 = platformX + platformWidth * 0.2;
        const supportX2 = platformX + platformWidth * 0.8;
        const supportY = platformY + platformHeight;
        
        ctx.fillRect(supportX1 - supportWidth / 2, supportY, supportWidth, supportHeight);
        ctx.fillRect(supportX2 - supportWidth / 2, supportY, supportWidth, supportHeight);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw water shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawWaterShape(ctx, size) {
        // Draw water
        ctx.fillStyle = "#2a3a4a";
        ctx.globalAlpha = 0.6;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw water waves
        ctx.strokeStyle = "#3a4a5a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        
        const waveCount = 3;
        const waveHeight = size * 0.1;
        
        for (let i = 0; i < waveCount; i++) {
            const y = size * 0.2 + i * size * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x <= size; x += 5) {
                const waveY = y + Math.sin((x / size) * Math.PI * 4 + Date.now() / 1000 + i) * waveHeight;
                ctx.lineTo(x, waveY);
            }
            
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw toxic water shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawToxicWaterShape(ctx, size) {
        // Draw water
        ctx.fillStyle = "#3a2a4a";
        ctx.globalAlpha = 0.6;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw water waves
        ctx.strokeStyle = "#4a3a5a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        
        const waveCount = 3;
        const waveHeight = size * 0.1;
        
        for (let i = 0; i < waveCount; i++) {
            const y = size * 0.2 + i * size * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x <= size; x += 5) {
                const waveY = y + Math.sin((x / size) * Math.PI * 4 + Date.now() / 1000 + i) * waveHeight;
                ctx.lineTo(x, waveY);
            }
            
            ctx.stroke();
        }
        
        // Draw toxic bubbles
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.7;
        
        const bubbleCount = 8;
        
        for (let i = 0; i < bubbleCount; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const bubbleSize = size * 0.05;
            
            ctx.beginPath();
            ctx.arc(x, y, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw oil shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawOilShape(ctx, size) {
        // Draw oil
        ctx.fillStyle = "#4a2a2a";
        ctx.globalAlpha = 0.7;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw oil ripples
        ctx.strokeStyle = "#5a3a3a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        const rippleCount = 2;
        const maxRippleRadius = size * 0.4;
        
        for (let i = 0; i < rippleCount; i++) {
            const rippleRadius = (Date.now() / 500 + i) % maxRippleRadius;
            const rippleAlpha = 1 - (rippleRadius / maxRippleRadius);
            
            ctx.globalAlpha = rippleAlpha * 0.5;
            
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, rippleRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw dirty water shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawDirtyWaterShape(ctx, size) {
        // Draw water
        ctx.fillStyle = "#2a4a3a";
        ctx.globalAlpha = 0.6;
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw water waves
        ctx.strokeStyle = "#3a5a4a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        
        const waveCount = 3;
        const waveHeight = size * 0.1;
        
        for (let i = 0; i < waveCount; i++) {
            const y = size * 0.2 + i * size * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x <= size; x += 5) {
                const waveY = y + Math.sin((x / size) * Math.PI * 4 + Date.now() / 1000 + i) * waveHeight;
                ctx.lineTo(x, waveY);
            }
            
            ctx.stroke();
        }
        
        // Draw debris
        ctx.fillStyle = "#3a2f2f";
        ctx.globalAlpha = 0.5;
        
        const debrisCount = 5;
        
        for (let i = 0; i < debrisCount; i++) {
            const debrisX = Math.random() * size;
            const debrisY = Math.random() * size;
            const debrisSize = size * 0.03;
            
            ctx.beginPath();
            ctx.arc(debrisX, debrisY, debrisSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw sewer entrance shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawSewerEntranceShape(ctx, size) {
        // Draw entrance base
        ctx.fillStyle = "#3a2f2f";
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw sewer hole
        ctx.fillStyle = "#1a1414";
        ctx.globalAlpha = 0.8;
        
        const holeRadius = size * 0.3;
        const holeX = size / 2;
        const holeY = size / 2;
        
        ctx.beginPath();
        ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sewer grate
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        const grateLineCount = 5;
        const grateLineSpacing = (holeRadius * 2) / grateLineCount;
        
        for (let i = 0; i < grateLineCount; i++) {
            const grateX = holeX - holeRadius + i * grateLineSpacing;
            
            ctx.beginPath();
            ctx.moveTo(grateX, holeY - holeRadius);
            ctx.lineTo(grateX, holeY + holeRadius);
            ctx.stroke();
        }
        
        // Draw sewer water
        ctx.fillStyle = "#2a3a4a";
        ctx.globalAlpha = 0.5;
        
        const waterHeight = size * 0.1;
        const waterY = holeY + holeRadius - waterHeight;
        const waterWidth = holeRadius * 2;
        const waterX = holeX - holeRadius;
        
        ctx.fillRect(waterX, waterY, waterWidth, waterHeight);
        
        // Draw sewer smell
        ctx.strokeStyle = "#3a2a2a";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        const smellCount = 3;
        
        for (let i = 0; i < smellCount; i++) {
            const smellX = holeX + (Math.random() - 0.5) * holeRadius;
            const smellY = holeY - holeRadius - size * (0.1 + i * 0.1);
            const smellWidth = size * (0.1 + Math.random() * 0.1);
            const smellHeight = size * 0.05;
            
            ctx.beginPath();
            ctx.ellipse(smellX, smellY, smellWidth, smellHeight, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw conveyor belt shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} direction - Conveyor belt direction
     */
    drawConveyorBeltShape(ctx, size, direction) {
        // Draw belt base
        ctx.fillStyle = "#3a2f2f";
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw belt
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.7;
        
        const beltHeight = size * 0.2;
        const beltY = (size - beltHeight) / 2;
        
        ctx.fillRect(0, beltY, size, beltHeight);
        
        // Draw belt lines
        ctx.strokeStyle = "#3a2f2f";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        const lineCount = 5;
        const lineSpacing = size / lineCount;
        
        for (let i = 0; i < lineCount; i++) {
            const lineX = i * lineSpacing;
            
            ctx.beginPath();
            ctx.moveTo(lineX, beltY);
            ctx.lineTo(lineX, beltY + beltHeight);
            ctx.stroke();
        }
        
        // Draw belt direction indicator
        ctx.fillStyle = "#8a7a6a";
        ctx.globalAlpha = 0.8;
        
        const arrowCount = 3;
        const arrowSpacing = size / (arrowCount + 1);
        
        for (let i = 1; i <= arrowCount; i++) {
            const arrowX = i * arrowSpacing;
            const arrowY = beltY + beltHeight / 2;
            const arrowSize = size * 0.05;
            
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            
            switch (direction) {
                case "right":
                    ctx.lineTo(arrowX + arrowSize, arrowY);
                    ctx.lineTo(arrowX, arrowY - arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY);
                    ctx.lineTo(arrowX, arrowY + arrowSize);
                    break;
                case "left":
                    ctx.lineTo(arrowX - arrowSize, arrowY);
                    ctx.lineTo(arrowX, arrowY - arrowSize);
                    ctx.lineTo(arrowX - arrowSize, arrowY);
                    ctx.lineTo(arrowX, arrowY + arrowSize);
                    break;
                case "up":
                    ctx.lineTo(arrowX, arrowY - arrowSize);
                    ctx.lineTo(arrowX - arrowSize, arrowY);
                    ctx.lineTo(arrowX, arrowY - arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY);
                    break;
                case "down":
                    ctx.lineTo(arrowX, arrowY + arrowSize);
                    ctx.lineTo(arrowX - arrowSize, arrowY);
                    ctx.lineTo(arrowX, arrowY + arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY);
                    break;
            }
            
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw spring trap shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawSpringTrapShape(ctx, size) {
        // Draw trap base
        ctx.fillStyle = "#3a3025";
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw spring
        ctx.strokeStyle = "#4a3828";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        const springX = size / 2;
        const springY = size * 0.7;
        const springWidth = size * 0.2;
        const springHeight = size * 0.5;
        const springCoils = 5;
        const coilHeight = springHeight / springCoils;
        
        ctx.beginPath();
        ctx.moveTo(springX - springWidth / 2, springY);
        
        for (let i = 0; i < springCoils; i++) {
            const coilY = springY - i * coilHeight;
            const coilDirection = i % 2 === 0 ? -1 : 1;
            
            ctx.quadraticCurveTo(
                springX + coilDirection * springWidth,
                coilY - coilHeight / 2,
                springX - coilDirection * springWidth / 2,
                coilY - coilHeight
            );
        }
        
        ctx.stroke();
        
        // Draw spring platform
        ctx.fillStyle = "#4a3828";
        ctx.globalAlpha = 0.8;
        
        const platformWidth = size * 0.4;
        const platformHeight = size * 0.1;
        const platformX = (size - platformWidth) / 2;
        const platformY = springY - springHeight - platformHeight;
        
        ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
        
        // Draw spring indicator
        ctx.strokeStyle = "#8a4a2a";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#8a4a2a";
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.8;
        
        const indicatorRadius = size * 0.1;
        
        ctx.beginPath();
        ctx.arc(springX, platformY - indicatorRadius, indicatorRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw vine rope shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     */
    drawVineRopeShape(ctx, size) {
        // Draw rope base
        ctx.fillStyle = "#3a2f2f";
        
        ctx.fillRect(0, 0, size, size);
        
        // Draw vine
        ctx.strokeStyle = "#2a4a2a";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        
        const vineX = size / 2;
        
        ctx.beginPath();
        ctx.moveTo(vineX, 0);
        
        let x = vineX;
        let y = 0;
        
        const segmentCount = 10;
        
        for (let i = 1; i <= segmentCount; i++) {
            x = vineX + Math.sin(i * 0.5) * size * 0.1;
            y = (i / segmentCount) * size;
            
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        
        // Draw vine leaves
        ctx.fillStyle = "#2a4a2a";
        ctx.globalAlpha = 0.8;
        
        const leafCount = 5;
        
        for (let i = 1; i <= leafCount; i++) {
            const leafY = (i / leafCount) * size;
            const leafX = vineX + Math.sin(i * 0.5) * size * 0.1;
            const leafSize = size * 0.08;
            const leafAngle = Math.sin(i * 0.7) * Math.PI / 4;
            
            ctx.save();
            ctx.translate(leafX, leafY);
            ctx.rotate(leafAngle);
            
            ctx.beginPath();
            ctx.ellipse(0, 0, leafSize, leafSize * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw floor wall transition shape
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} direction - Transition direction
     */
    drawFloorWallShape(ctx, size, direction) {
        // Draw floor
        ctx.fillStyle = "#3a2f2f";
        
        switch (direction) {
            case "top":
                ctx.fillRect(0, size / 2, size, size / 2);
                break;
            case "right":
                ctx.fillRect(0, 0, size / 2, size);
                break;
            case "bottom":
                ctx.fillRect(0, 0, size, size / 2);
                break;
            case "left":
                ctx.fillRect(size / 2, 0, size / 2, size);
                break;
        }
        
        // Draw wall
        ctx.fillStyle = "#3a3025";
        
        switch (direction) {
            case "top":
                ctx.fillRect(0, 0, size, size / 2);
                break;
            case "right":
                ctx.fillRect(size / 2, 0, size / 2, size);
                break;
            case "bottom":
                ctx.fillRect(0, size / 2, size, size / 2);
                break;
            case "left":
                ctx.fillRect(0, 0, size / 2, size);
                break;
        }
        
        // Draw transition line
        ctx.strokeStyle = "#2d2424";
        ctx.lineWidth = 1;
        
        switch (direction) {
            case "top":
                ctx.beginPath();
                ctx.moveTo(0, size / 2);
                ctx.lineTo(size, size / 2);
                ctx.stroke();
                break;
            case "right":
                ctx.beginPath();
                ctx.moveTo(size / 2, 0);
                ctx.lineTo(size / 2, size);
                ctx.stroke();
                break;
            case "bottom":
                ctx.beginPath();
                ctx.moveTo(0, size / 2);
                ctx.lineTo(size, size / 2);
                ctx.stroke();
                break;
            case "left":
                ctx.beginPath();
                ctx.moveTo(size / 2, 0);
                ctx.lineTo(size / 2, size);
                ctx.stroke();
                break;
        }
    }
    
    /**
     * Draw text
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} size - Tile size
     * @param {string} text - Text to draw
     * @param {string} color - Text color
     */
    drawText(ctx, size, text, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.font = `${size * 0.2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText(text, size / 2, size / 2);
        
        ctx.globalAlpha = 1;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostApocalypticTileset;
}